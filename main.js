/**
 * ============================================================================
 * 1. 引入依赖与全局配置
 * ============================================================================
 */
const { app, BrowserWindow, Tray, Menu, ipcMain, Notification, screen, dialog, protocol, net, globalShortcut } = require('electron'); 
// 发布版中去掉globalShortcut，如需调试请自行添加并删除相关注释 (已保留引用)
const path = require('path');
const fs = require('fs'); 
const Store = require('electron-store');
const AutoLaunch = require('auto-launch');
const axios = require('axios');
const url = require('url');
const https = require('https');
const http = require('http');
const { shell } = require('electron');
const os = require('os');
const { execSync } = require('child_process');

// 检测系统支持的材质类型
function getSystemMaterial() {
  if (process.platform !== 'win32') return 'none';
  const release = os.release();
  const parts = release.split('.');
  const buildNumber = parseInt(parts[2], 10);
  if (buildNumber >= 22000) return 'mica';      // Windows 11
  if (buildNumber >= 17763) return 'acrylic';    // Windows 10 1809+
  return 'none';                                  // Windows 7 / 8 / 早期 Win10
}

// 启用 Windows 11 Mica 效果与透明视觉
app.setName('墨启随机点名');
app.commandLine.appendSwitch('enable-transparent-visuals');

// 初始化配置存储
const store = new Store({
  defaults: {
    launchFloat: false,
    floatWindowPosition: null,
    autoLaunch: false,
    autoLaunchFloat: false,
    hardwareAcceleration: true, // 新增：默认启用硬件加速
    hotkeyEnabled: false,
    hotkeySchemes: Array(5).fill(''),
    toastSettings: { toastMode: 'global' },
    toastHistory: [],
    language: 'system'
  }
});

// --- 新增：根据保存的配置在应用准备前禁用硬件加速（如果用户关闭了） ---
if (store.get('hardwareAcceleration') === false) {
  console.log('[Moqi Random Picker]Hardware acceleration disabled by user setting.');
  app.disableHardwareAcceleration();
}
// --- 新增结束 ---

// ===== 自动启动配置 =====
const appLauncher = new AutoLaunch({
  name: '墨启随机点名',
  path: process.platform === 'win32' ? process.execPath : app.getPath('exe'),
  isHidden: true
});

// ===== 单实例锁 =====
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
    if (floatWindow) {
      floatWindow.show();
    }
  });
}

// 注册自定义协议以加载媒体资源 (必须在 app.ready 之前)
protocol.registerSchemesAsPrivileged([
  { scheme: 'media', privileges: { secure: true, supportFetchAPI: true, bypassCSP: true } }
]);

/**
 * ============================================================================
 * 2. 全局变量定义
 * ============================================================================
 */
let mainWindow = null;
let floatWindow = null;
let splashWindow = null;
let toastWindow = null; // 全局 Toast 独立窗口
let tray = null;
let isQuitting = false;
let devModeEnabled = false;
let registeredHotkeys = [];

/**
 * ============================================================================
 * 3. IPC 通信监听 (核心修复点：移到全局作用域)
 * ============================================================================
 */
// 获取快捷键配置
ipcMain.handle('get-hotkey-schemes', () => {
  return {
    enabled: store.get('hotkeyEnabled', false),
    schemes: store.get('hotkeySchemes', Array(5).fill(''))
  };
});
// 更新快捷键配置
ipcMain.on('update-hotkey-schemes', (event, { enabled, schemes }) => {
  store.set('hotkeyEnabled', enabled);
  if (schemes && schemes.length > 0) {
    store.set('hotkeySchemes', schemes);
  }
  registerHotkeys();
});
//监听APP进入后台
ipcMain.on('quit-app', () => {
    isQuitting = true;
    app.quit();
});
// ── 全局 Toast 系统 (独立窗口 + 主进程管理) ──
ipcMain.on('show-toast-from-renderer', (_, { type, title, message, duration }) => {
  showGlobalToast(type, title, message, duration);
});
ipcMain.on('toast-size-changed', (_, { height }) => {
  if (!toastWindow || toastWindow.isDestroyed()) return;
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: sw, height: sh } = primaryDisplay.workAreaSize;
  const wx = 380;
  const wy = Math.min(height + 24, sh - 40); // cap to screen height with padding
  toastWindow.setBounds({
    x: Math.round(sw - wx - 20),
    y: 20,
    width: wx,
    height: Math.max(wy, 60)
  }, false);
});
ipcMain.on('toast-count-changed', (_, count) => {
  if (count <= 0 && toastWindow && !toastWindow.isDestroyed()) {
    toastWindow.hide(); // 无通知时完全隐藏
  }
});
// Toast mode 管理 (主进程 state)
let toastMode = 'global'; // 'global' | 'inline'
function loadToastState() {
  try {
    const s = store.get('toastSettings');
    if (s) {
      toastMode = s.toastMode || 'global';
    }
  } catch(e) {}
}
function saveToastState() {
  store.set('toastSettings', { toastMode });
}
function showGlobalToast(type, title, message, duration = 3500) {
  if (toastMode === 'inline') {
    // 局内模式: 发送到主窗口渲染 DOM toast
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('show-inline-toast', { type, title, message, duration });
    }
  } else {
    // 全局模式: 通过独立 Toast 窗口显示
    if (toastWindow && !toastWindow.isDestroyed()) {
      toastWindow.webContents.send('show-toast', { type, title, message, duration });
      if (!toastWindow.isVisible()) toastWindow.show();
    }
  }
}
ipcMain.handle('get-toast-state', () => ({
  toastMode
}));
ipcMain.on('set-toast-mode', (_, mode) => {
  toastMode = mode;
  saveToastState();
});

// 读取 docs 帮助文件
ipcMain.handle('read-doc-file', async (_, docName) => {
  // 防止路径穿越攻击
  const safeName = path.basename(docName);
  const docPath = path.join(__dirname, 'docs', safeName);
  try {
    if (!fs.existsSync(docPath)) return { error: '文件不存在' };
    const content = fs.readFileSync(docPath, 'utf-8');
    return { content };
  } catch (e) {
    return { error: e.message };
  }
});
// 读取用户协议文件
ipcMain.handle('read-agreement-file', async () => {
  const agreementPath = path.join(__dirname, '用户协议与隐私政策.md');
  try {
    if (!fs.existsSync(agreementPath)) return { error: '协议文件不存在' };
    const content = fs.readFileSync(agreementPath, 'utf-8');
    return { content };
  } catch (e) {
    return { error: e.message };
  }
});
// 检查主窗口是否可见
ipcMain.handle('is-main-window-visible', () => {
  return mainWindow && !mainWindow.isDestroyed() && mainWindow.isVisible();
});
// 转发姓名更新到悬浮窗
ipcMain.on('update-name', (_, name) => {
  floatWindow?.webContents.send('update-name', name);
});

// [新增] IPC 监听：选择图片文件夹
ipcMain.handle('select-photo-folder', async () => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  if (result.canceled) return null;
  return result.filePaths[0]; // 返回选择的文件夹路径
});

// [新增] IPC 监听：读取文件夹内的图片列表
ipcMain.handle('scan-photo-folder', async (event, folderPath) => {
  try {
    if (!folderPath || !fs.existsSync(folderPath)) return { error: '文件夹不存在' };

    const files = await fs.promises.readdir(folderPath);
    // 过滤出图片文件
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const images = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });
    return { images }; // 返回文件名数组
  } catch (error) {
    console.error('读取文件夹失败:', error);
    return { error: error.message };
  }
});

// 快速点名转发
ipcMain.on('quick-roll', (event) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('execute-quick-roll');
  }
});

// 配置获取与设置
ipcMain.handle('get-config', () => store.get('launchFloat', false));
ipcMain.handle('set-config', (_, value) => {
  store.set('launchFloat', Boolean(value));
});

// 自动启动配置
ipcMain.handle('get-auto-launch-config', async () => ({
  autoLaunch: await appLauncher.isEnabled(),
  autoLaunchFloat: store.get('autoLaunchFloat', false)
}));

ipcMain.handle('set-auto-launch-config', async (_, config) => {
  try {
    if (config.autoLaunch) {
      await appLauncher.enable();
    } else {
      await appLauncher.disable();
      store.set('autoLaunchFloat', false);
    }
    store.set('autoLaunchFloat', config.autoLaunch && config.autoLaunchFloat);
    if (config.autoLaunchFloat) {
      if(mainWindow) mainWindow.hide();
      floatWindow?.show();
    }
  } catch (err) {
    console.error('自动启动配置失败:', err);
  }
});

// 窗口控制
ipcMain.on('window-minimize', () => mainWindow?.minimize());
ipcMain.on('window-close', () => mainWindow?.close());

// 开发者工具
ipcMain.on('open-devtools', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.openDevTools({ mode: 'undocked' });
  }
});

ipcMain.on('request-devtools', () => {
  // 主进程验证（更安全）
  if (!devModeEnabled) {
    ipcMain.once('devtools-auth', (event, password) => {
      // 简单验证逻辑
      // 注意：validatePassword 函数在原文中未定义，这里保留结构以防您有自定义实现
      // if (validatePassword(password)) { 
      //   devModeEnabled = true;
      //   mainWindow.webContents.openDevTools({ mode: 'undocked' });
      //   event.reply('devtools-response', { success: true });
      // } else {
      //   event.reply('devtools-response', { success: false, message: '密码错误' });
      // }
       devModeEnabled = true;
       mainWindow.webContents.openDevTools({ mode: 'undocked' });
       event.reply('devtools-response', { success: true });
    });
  } else {
    mainWindow.webContents.openDevTools({ mode: 'undocked' });
  }
});

// 获取 APP 版本号（主题商店版本适配用）
ipcMain.handle('get-app-version', () => app.getVersion());

// 读取 Windows 系统强调色（AccentColor），返回 #RRGGBB 格式
ipcMain.handle('get-windows-accent-color', () => {
  if (process.platform !== 'win32') return null;
  try {
    const output = execSync(
      'reg query "HKCU\\Software\\Microsoft\\Windows\\DWM" /v AccentColor',
      { timeout: 3000 }
    ).toString();
    // 输出格式："    AccentColor    REG_DWORD    0xffd77800"
    const match = output.match(/0x([0-9a-fA-F]{8})/);
    if (!match) return null;
    const raw = parseInt(match[1], 16);       // AABBGGRR 格式的 DWORD
    const a = (raw >>> 24) & 0xff;
    const b = (raw >>> 16) & 0xff;
    const g = (raw >>> 8) & 0xff;
    const r = raw & 0xff;
    // 仅当系统启用标题栏着色 (Alpha >= 128) 时返回有效值
    if (a < 128) return null;
    return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    console.error('[Moqi Random Picker]读取 Windows 强调色失败:', e.message);
    return null;
  }
});

// 检查更新
ipcMain.handle('check-for-update', async () => {
  try {
    const response = await axios.get('https://rrc.thinks365.com/updates/update.json');
    return response.data;
  } catch (error) {
    console.error('检查更新失败:', error);
    return { error: '无法连接更新服务器' };
  }
});

// 下载文件辅助函数（支持重定向、进度回调）
function downloadFile(downloadUrl, sender, tempDir, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      reject(new Error('重定向次数过多'));
      return;
    }

    const protocol = downloadUrl.startsWith('https') ? https : http;
    const request = protocol.get(downloadUrl, { timeout: 30000 }, (response) => {
      // 处理重定向
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        request.destroy();
        const redirectUrl = response.headers.location.startsWith('http')
          ? response.headers.location
          : new url.URL(response.headers.location, downloadUrl).href;
        downloadFile(redirectUrl, sender, tempDir, maxRedirects - 1)
          .then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`服务器返回状态码: ${response.statusCode}`));
        return;
      }

      const fileName = downloadUrl.split('/').pop().split('?')[0];
      const decodedFileName = decodeURIComponent(fileName);
      const filePath = path.join(tempDir, decodedFileName);

      const totalSize = parseInt(response.headers['content-length'], 10) || 0;
      let downloadedSize = 0;
      let lastUpdateTime = Date.now();
      let lastDownloadedSize = 0;

      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);

      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        const now = Date.now();
        if (now - lastUpdateTime >= 200) {
          const elapsed = (now - lastUpdateTime) / 1000;
          const speed = (downloadedSize - lastDownloadedSize) / elapsed;
          sender.send('download-progress', {
            downloaded: downloadedSize,
            total: totalSize,
            speed: speed,
            percent: totalSize > 0 ? Math.round((downloadedSize / totalSize) * 100) : 0
          });
          lastUpdateTime = now;
          lastDownloadedSize = downloadedSize;
        }
      });

      response.on('end', () => {
        sender.send('download-progress', {
          downloaded: downloadedSize,
          total: totalSize || downloadedSize,
          speed: 0,
          percent: 100
        });
        resolve({ success: true, filePath: filePath });
      });

      response.on('error', (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });

      fileStream.on('error', (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
    });

    request.on('timeout', () => {
      request.destroy();
      reject(new Error('下载超时，请检查网络连接'));
    });

    request.on('error', (err) => {
      reject(err);
    });
  });
}

// 下载更新安装程序（带进度）
ipcMain.handle('download-update', async (event, downloadUrl) => {
  try {
    const tempDir = app.getPath('temp');
    return await downloadFile(downloadUrl, event.sender, tempDir);
  } catch (error) {
    console.error('下载更新失败:', error);
    return { success: false, error: error.message };
  }
});

// 运行安装程序
ipcMain.on('run-installer', (_, filePath) => {
  shell.openPath(filePath).then((error) => {
    if (error) {
      console.error('启动安装程序失败:', error);
    }
  });
});

// 悬浮窗背景更新
ipcMain.on('update-float-background', (_, imageData) => {
  floatWindow?.webContents.send('update-float-background', imageData);
});

// 悬浮窗显示控制
ipcMain.on('show-float-window', () => floatWindow?.show());
ipcMain.on('hide-float-window', () => floatWindow?.hide());
ipcMain.handle('is-float-window-visible', () => floatWindow?.isVisible() || false);

// 动画控制
ipcMain.on('start-float-animation', (_, data) => {
  floatWindow?.webContents.send('start-float-animation', data);
});
ipcMain.on('stop-float-animation', (_, name) => {
  floatWindow?.webContents.send('stop-float-animation', name);
});

// 悬浮窗样式更新
ipcMain.on('update-float-styles', (_, styles) => {
  floatWindow?.webContents.send('update-float-styles', styles);
});

// ===== 悬浮窗伪 Mica 效果 =====
// 获取主显示器边界（用于 CSS background-size）
ipcMain.handle('get-display-bounds', () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  return {
    width: primaryDisplay.bounds.width,
    height: primaryDisplay.bounds.height
  };
});

// 获取 Windows 当前壁纸（返回 Base64 Data URL）
ipcMain.handle('get-wallpaper-path', () => {
  if (process.platform !== 'win32') return null;
  try {
    // TranscodedWallpaper 始终是当前实际使用的壁纸缓存（无后缀名，nativeImage 无法识别）
    const wallpaperPath = path.join(
      os.homedir(),
      'AppData', 'Roaming', 'Microsoft', 'Windows', 'Themes', 'TranscodedWallpaper'
    );
    if (fs.existsSync(wallpaperPath)) {
      const buffer = fs.readFileSync(wallpaperPath);
      // Windows 壁纸缓存几乎全是 JPEG，强制声明 image/jpeg
      return 'data:image/jpeg;base64,' + buffer.toString('base64');
    }
    // 回退：从注册表读取原始壁纸路径
    const output = execSync(
      'reg query "HKCU\\Control Panel\\Desktop" /v WallPaper',
      { timeout: 3000 }
    ).toString();
    const match = output.match(/WallPaper\s+REG_SZ\s+(.*)/);
    if (match && match[1].trim()) {
      const regPath = match[1].trim();
      if (fs.existsSync(regPath)) {
        const buffer = fs.readFileSync(regPath);
        const ext = path.extname(regPath).toLowerCase() === '.png' ? 'png' : 'jpeg';
        return 'data:image/' + ext + ';base64,' + buffer.toString('base64');
      }
    }
  } catch (e) {
    console.error('[Moqi] 获取壁纸失败:', e);
  }
  return null;
});

// 转发悬浮窗 Mica 设置
ipcMain.on('update-float-mica', (_, settings) => {
  floatWindow?.webContents.send('update-float-mica', settings);
});

// 打开外部链接
ipcMain.on('open-external', (_, url) => {
  require('electron').shell.openExternal(url);
});

// 显示悬浮菜单
ipcMain.on('show-float-menu', (event) => {
  const floatMenu = createFloatMenu();
  
  // 保留您原文注释掉的定位逻辑
  // 获取悬浮窗的位置和大小
  //const floatBounds = floatWindow.getBounds();
  
  // 获取屏幕的工作区域（排除任务栏）
  //const primaryDisplay = screen.getPrimaryDisplay();
  //const workArea = primaryDisplay.workArea;
  
  // 计算菜单显示位置 - 紧贴悬浮窗右侧
  //let menuX = floatBounds.x + 5; // 紧贴右侧，稍微重叠 floatBounds.width - 
  // let menuY = floatBounds.y + 5; // 在悬浮窗垂直居中位置
  
  // 确保菜单不会超出屏幕右侧
  //const menuWidth = 160; // 预估菜单宽度
  //if (menuX + menuWidth > workArea.x + workArea.width) {
  //    menuX = workArea.x + workArea.width - menuWidth - 10;
  //}
  
  // 确保菜单不会超出屏幕底部
  //const menuHeight = 220; // 预估菜单高度
  //if (menuY + menuHeight > workArea.y + workArea.height) {
  //    menuY = workArea.y + workArea.height - menuHeight - 10;
  //}
  
  // 显示菜单，紧贴悬浮窗
  if (floatWindow && !floatWindow.isDestroyed()) {
      floatMenu.popup({
          window: floatWindow,
          //x: Math.round(menuX),
          //y: Math.round(menuY),
          // positioningItem: 0 // 确保菜单紧贴指定位置
      });
  }
      //const closeMenuHandler = () => {
      // 菜单关闭后的清理工作（如果需要的话）
      //console.log('[Moqi Random Picker]Float menu closed');
  //};
  
  // 监听菜单关闭事件
  //floatMenu.on('menu-will-close', closeMenuHandler);
});

// 语言设置 IPC
ipcMain.handle('get-language', () => {
  return store.get('language', 'system');
});

ipcMain.on('set-language', (_, lang) => {
  store.set('language', lang);
  rebuildTrayMenu();
});

ipcMain.on('update-float-language', (_, lang) => {
  if (floatWindow && !floatWindow.isDestroyed()) {
    floatWindow.webContents.send('update-float-language', lang);
  }
});

// 硬件加速配置 IPC
ipcMain.handle('get-hardware-acceleration', () => {
  return store.get('hardwareAcceleration', true); // 默认为启用
});

ipcMain.handle('set-hardware-acceleration', async (_, enabled) => {
  try {
    store.set('hardwareAcceleration', enabled);
    
    const choice = await dialog.showMessageBox({
      type: 'info',
      title: tMain('重启软件以应用更改'),
      message: tMain('硬件加速设置已更改，需要重启墨启随机点名才能生效。'),
      buttons: [tMain('现在重启软件'), tMain('稍后重启软件')],
      defaultId: 0,
      cancelId: 1
    });

    if (choice.response === 0) {
      // 用户选择立即重启
      app.relaunch();
      app.exit(0);
    }
    
    return true;
  } catch (error) {
    console.error('设置硬件加速失败:', error);
    return false;
  }
});

/**
 * ============================================================================
 * 4. 辅助函数定义
 * ============================================================================
 */

// --- 新增：创建启动窗口 ---
function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 400, 
    height: 200, 
    minWidth: 600,    // 设置最小宽度为 600px
    minHeight: 400,   // 设置最小高度为 400px
    transparent: false,
    frame: false, 
    alwaysOnTop: true, 
    resizable: false,
    movable: false, 
    icon: path.join(__dirname, 'icon.png'), 
    webPreferences: {
      nodeIntegration: false, 
      contextIsolation: true,  
    }
  });

  splashWindow.loadFile('splash.html').catch(() => {
      console.log('[Moqi Random Picker]启动画面加载失败');
  }); 

  // 可选：如果 splash.html 加载失败，可以在这里处理
  splashWindow.webContents.on('did-fail-load', () => {
      console.log('[Moqi Random Picker]启动画面加载失败');
      // 可以选择在这里关闭 splashWindow 或显示错误信息
      // 例如：splashWindow.destroy();
  });
}

// --- 新增：重置悬浮窗位置的函数 ---
function resetFloatWindowPosition() {
  if (floatWindow && !floatWindow.isDestroyed()) {
    try {
      // 获取主屏幕的工作区域（排除任务栏）
      const primaryDisplay = screen.getPrimaryDisplay();
      const { width, height } = primaryDisplay.workAreaSize;
      const workArea = primaryDisplay.workArea;
      // 定义悬浮窗的默认尺寸（请根据 float.html 的实际尺寸调整）
      // 假设 float.html 的宽度约为 160px，高度约为 80px
      const defaultFloatWidth = 162;
      const defaultFloatHeight = 82;
      // 计算默认位置（例如：屏幕右下角，留出一些边距）
      // Math.round 用于确保坐标是整数
      const defaultX = Math.round(workArea.x + width - defaultFloatWidth - 40); // 距右边 20px
      const defaultY = Math.round(workArea.y + 40); // 距离屏幕工作区顶边 20px
      // 设置悬浮窗到计算出的默认位置和尺寸
      // 使用 setBounds 一次性设置位置和尺寸，避免闪烁
      // animate = false 表示不使用动画，立即移动
      floatWindow.setBounds({
        x: defaultX,
        y: defaultY,
        width: defaultFloatWidth,
        height: defaultFloatHeight
      }, false); // false for no animation
      // 确保窗口在重置后是可见的
      if (!floatWindow.isVisible()) {
        floatWindow.show();
      }
      if (floatWindow.isMinimized()) {
        floatWindow.restore();
      }
      //清除存储的位置
      store.delete('floatWindowPosition');
      console.log('[Moqi Random Picker]The floating window position has been reset to the bottom right corner of the screen.');
    } catch (error) {
      console.error('[Moqi Random Picker]Error when resetting the position of the floating window:', error);
    }
  } else {
    console.log('[Moqi Random Picker]The overlay instance does not exist or has been destroyed and cannot be relocated');
  }
}

function registerHotkeys() {
  // 先注销所有已注册的快捷键
  registeredHotkeys.forEach(acc => globalShortcut.unregister(acc));
  registeredHotkeys = [];

  const enabled = store.get('hotkeyEnabled', false);
  if (!enabled) return;

  const schemes = store.get('hotkeySchemes', []);
  schemes.forEach(acc => {
    if (acc && typeof acc === 'string' && acc.trim() !== '') {
      const success = globalShortcut.register(acc, () => {
        console.log(`Hotkey ${acc} triggered quick roll`);
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('execute-quick-roll');
        }
      });
      if (success) {
        registeredHotkeys.push(acc);
        console.log(`Registered hotkey: ${acc}`);
      } else {
        console.error(`Failed to register hotkey: ${acc}`);
      }
    }
  });
}

// --- i18n 翻译辅助函数 (main process) ---
const _mainLangMap = {
    'zh-TW': {
        '显示主界面': '顯示主介面',
        '显示/隐藏悬浮窗': '顯示/隱藏懸浮窗',
        '切换点名模式': '切換點名模式',
        '重置悬浮窗位置': '重設懸浮窗位置',
        '打开设置': '開啟設定',
        '清除自定义 CSS': '清除自訂 CSS',
        '退出程序': '結束程式',
        '打开主界面': '開啟主介面',
        '隐藏悬浮窗': '隱藏懸浮窗',
        '墨启随机点名': '墨啟隨機點名',
        '程序正在后台运行': '程式正在背景執行',
        '重启软件以应用更改': '重啟軟體以套用變更',
        '硬件加速设置已更改，需要重启墨启随机点名才能生效。': '硬體加速設定已變更，需要重啟墨啟隨機點名才能生效。',
        '现在重启软件': '現在重啟軟體',
        '稍后重启软件': '稍後重啟軟體',
        '主界面已最小化到托盘。如需退出请右键托盘图标。': '主介面已最小化到系統匣。如需結束程式請右鍵系統匣圖示。'
    },
    'en': {
        '显示主界面': 'Show Main Window',
        '显示/隐藏悬浮窗': 'Show/Hide Float',
        '切换点名模式': 'Switch Roll Mode',
        '重置悬浮窗位置': 'Reset Float Position',
        '打开设置': 'Open Settings',
        '清除自定义 CSS': 'Clear Custom CSS',
        '退出程序': 'Quit',
        '打开主界面': 'Open Main Window',
        '隐藏悬浮窗': 'Hide Float',
        '墨启随机点名': 'Moqi Random Picker',
        '程序正在后台运行': 'Running in background',
        '重启软件以应用更改': 'Restart to Apply',
        '硬件加速设置已更改，需要重启墨启随机点名才能生效。': 'Hardware acceleration changed. Restart Moqi Random Picker for it to take effect.',
        '现在重启软件': 'Restart Now',
        '稍后重启软件': 'Restart Later',
        '主界面已最小化到托盘。如需退出请右键托盘图标。': 'Minimized to tray. Right-click tray icon to quit.'
    }
};

function resolveMainLang() {
    var stored = store.get('language', 'system');
    if (!stored || stored === 'system') {
        var sysLocale = app.getLocale() || '';
        if (sysLocale.startsWith('zh')) {
            return (sysLocale === 'zh-TW' || sysLocale === 'zh-HK' || sysLocale === 'zh-MO') ? 'zh-TW' : 'zh-CN';
        }
        if (sysLocale.startsWith('en')) return 'en';
        return 'zh-CN';
    }
    return stored;
}

function tMain(text) {
    var lang = resolveMainLang();
    if (lang === 'zh-CN') return text;
    var map = _mainLangMap[lang];
    return (map && map[text]) ? map[text] : text;
}

function rebuildTrayMenu() {
    if (tray && !tray.isDestroyed()) {
        createTray();
    }
}

function rebuildFloatMenu() {
    // Float menu is created on demand; no rebuild needed
}

// --- 创建系统托盘和菜单 ---
function createTray() {
  // 如果托盘已存在，先销毁它
  if (tray) {
    tray.destroy();
  }
  tray = new Tray(path.join(__dirname, 'icon.png'));
  // --- 修改：更新上下文菜单，添加重置位置选项 ---
  const contextMenu = Menu.buildFromTemplate([
    {
      label: tMain('显示主界面'),
      click: () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.show();
          if (mainWindow.isMinimized()) mainWindow.restore();
        }
      }
    },
    {
      label: tMain('显示/隐藏悬浮窗'),
      click: () => {
        if (floatWindow && !floatWindow.isDestroyed()) {
          if (floatWindow.isVisible()) {
            floatWindow.hide();
          } else {
            floatWindow.show();
            if (floatWindow.isMinimized()) floatWindow.restore();
          }
        }
      }
    },
    // --- 新增：重置悬浮窗位置菜单项 ---
          {
            label: tMain('切换点名模式'),
            click: () => {
                if (mainWindow) {
                    mainWindow.webContents.send('toggle-roll-mode');
                }
            }
        },
    {
      label: tMain('重置悬浮窗位置'),
      click: () => {
        resetFloatWindowPosition();
      }
    },
    // --- 新增结束 ---
    { type: 'separator' },
            {
            label: tMain('打开设置'),
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                    mainWindow.webContents.send('open-settings-menu');
                }
            }
        },
    {
      label: tMain('清除自定义 CSS'),
      click: () => {
          if (mainWindow) {
              mainWindow.webContents.send('reset-custom-css');
          }
      }
    },
    {
      label: tMain('退出程序'),
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);
  // --- 修改结束 ---
  tray.setToolTip(tMain('墨启随机点名'));
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.show();
        if (mainWindow.isMinimized()) mainWindow.restore();
    }
  });
}

function showNotification(message = '') {
  new Notification({
    title: tMain('墨启随机点名'),
    body: message || tMain('程序正在后台运行'),
    icon: path.join(__dirname, 'icon.png')
  }).show();
}

function createFloatMenu() {
  return Menu.buildFromTemplate([
    {
          label: tMain('切换点名模式'),
          click: () => {
              if (mainWindow) {
                  mainWindow.webContents.send('toggle-roll-mode');
              }
          }
      },
      {
          label: tMain('重置悬浮窗位置'),
          click: () => {
              resetFloatWindowPosition();
          }
      },
      { type: 'separator' },
      {
          label: tMain('打开主界面'),
          click: () => {
              if (mainWindow) {
                  mainWindow.show();
                  if (mainWindow.isMinimized()) mainWindow.restore();
                  mainWindow.focus();
              }
          }
      },
      {
          label: tMain('隐藏悬浮窗'),
          click: () => {
              if (floatWindow) {
                  floatWindow.hide();
              }
          }
      },
      { type: 'separator' },
      {
          label: tMain('打开设置'),
          click: () => {
              if (mainWindow) {
                  mainWindow.show();
                  mainWindow.focus();
                  mainWindow.webContents.send('open-settings-menu');
              }
          }
      },
  ]);
}

/**
 * ============================================================================
 * 5. 窗口创建逻辑 (只负责创建，不负责 IPC 注册)
 * ============================================================================
 */
function createWindows() {
  // ===== 创建启动窗口 =====
  createSplashWindow(); // 在创建主窗口前先创建启动窗口

  // ===== 检测系统材质支持 =====
  const systemMaterial = getSystemMaterial();

  // ===== 主窗口配置 =====
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 600,   // 设置最小高度为 600px
    minWidth: 800,    // 设置最小宽度为 800px
    show: false, // 关键：初始不显示主窗口
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      devTools: true,
      webSecurity: true
    },
    icon: path.join(__dirname, 'icon.png'),
    frame: false,
    maximizable: false,                                                    // 禁用最大化
    backgroundMaterial: systemMaterial !== 'none' ? systemMaterial : undefined,  // 按系统动态选择材质
    backgroundColor: systemMaterial !== 'none' ? '#00000000' : '#fdfcfc'  // 不支持材质时使用纯色背景
  });
  mainWindow.loadFile('index.html');

  // --- 系统材质与焦点状态 IPC 通知 ---
  // 1. 页面加载完成后，告知前端当前材质类型
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow.isDestroyed()) {
      mainWindow.webContents.send('init-material', systemMaterial);
    }
  });

  // 2. 监听焦点事件并通知前端
  mainWindow.on('focus', () => {
    if (!mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window-focus-change', true);
    }
  });
  mainWindow.on('blur', () => {
    if (!mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window-focus-change', false);
    }
  });
//监听主程序进入后台和显示事件，转发给前端以便前端做出相应的 UI 调整
mainWindow.on('hide', () => {
    if (!mainWindow.isDestroyed()) {
        mainWindow.webContents.send('window-hidden');
    }
});

mainWindow.on('show', () => {
    if (!mainWindow.isDestroyed()) {
        mainWindow.webContents.send('window-shown');
    }
});
  // ===== 关键修改：监听主窗口 ready-to-show 事件 =====
  mainWindow.on('ready-to-show', () => {
    console.log("The main window is ready to be displayed.");
    // 关闭启动窗口
    if (splashWindow) {
      splashWindow.destroy(); // 或者 splashWindow.close()，destroy 更彻底
      splashWindow = null;
    }

    // 根据配置决定是否显示主窗口
    if (!store.get('autoLaunchFloat')) {
      mainWindow.show(); // 显示主窗口
      mainWindow.focus();
    } else {
      // 如果配置了启动时只显示悬浮窗，则隐藏主窗口
      mainWindow.hide();
    }
  });
  // ===== 关键修改结束 =====

  // ===== 悬浮窗口增强配置 =====
  const savedPosition = store.get('floatWindowPosition');
  floatWindow = new BrowserWindow({
    width: 160,
    height: 80,
    hasShadow: false, 
    x: savedPosition?.x,
    y: savedPosition?.y,
    show: store.get('launchFloat') || store.get('autoLaunchFloat'),
    alwaysOnTop: true,//始终置顶
    focusable: false, //不聚焦
    frame: false,
    transparent: true, 
    hasShadow: false,  
    backgroundColor: '#00000000', 
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'icon.png')
});
  floatWindow.loadFile('float.html');
  // 关键修改点2: 增加位置保存后的置顶
  floatWindow.on('moved', () => {
    const [x, y] = floatWindow.getPosition();
    store.set('floatWindowPosition', { x, y });
    if (process.platform === 'win32') {
      floatWindow.setAlwaysOnTop(true, 'screen-saver');
    } else {
      floatWindow.setAlwaysOnTop(true);
    }
  });
  // 关键修改点3: 显示事件绑定
  floatWindow.on('show', () => {
    floatWindow.setAlwaysOnTop(true);
  });
  floatWindow.on('show', () => floatWindow.setHasShadow(false));
  // 关键修改点4: 失去焦点时重新置顶
  floatWindow.on('blur', () => {
    if (floatWindow && !floatWindow.isDestroyed() && floatWindow.isVisible()) {
      floatWindow.setAlwaysOnTop(true);
    }
  });
  // ===== Toast 全局通知窗口 =====
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: sw } = primaryDisplay.workAreaSize;
  toastWindow = new BrowserWindow({
    width: 380,
    height: 60,
    x: Math.round(sw - 400),
    y: 20,
    show: false,
    alwaysOnTop: true,
    focusable: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'icon.png')
  });
  toastWindow.loadFile('toast.html');
  toastWindow.setVisibleOnAllWorkspaces(true);
  toastWindow.setAlwaysOnTop(true, 'screen-saver');

  // ===== 窗口事件处理 =====
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      showNotification('主界面已最小化到托盘。如需退出请右键托盘图标。');
    }
  });
  floatWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      floatWindow.hide();
    }
  });
  toastWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      toastWindow.hide();
    }
  });
  // ===== 系统托盘 =====
  createTray(); // 确保在窗口创建后再创建托盘，这样 floatWindow 引用是有效的
}

/**
 * ============================================================================
 * 6. 应用生命周期
 * ============================================================================
 */

// 添加全局点击监听，确保菜单在点击其他地方时关闭
app.on('browser-window-blur', (event, window) => {
  // 当窗口失去焦点时，可以触发菜单关闭
  // Electron 的 Menu 已经有内置的关闭机制，这里主要是备用
});

// 添加悬浮窗点击外部关闭菜单的备用机制
if (floatWindow) {
  floatWindow.on('blur', () => {
      // 悬浮窗失去焦点时，可以认为用户点击了外部
      // 但 Electron 菜单已经处理了这个情况
  });
}

// ===== 应用生命周期 =====
app.whenReady().then(() => {
  // 1. 注册 media:// 协议，用于前端 img src 加载本地图片
  // 核心修复：确保协议只注册一次，并使用 decodeURIComponent 和 url.pathToFileURL 修复中文路径
  if (!protocol.isProtocolHandled('media')) {
    protocol.handle('media', (request) => {
      // 1. 获取请求的原始 URL
      let urlString = request.url;
      
      // 2. 去掉协议头 'media://' (兼容有无 '/' 的情况)
      // 有些环境可能是 media://D:/... 有些是 media:///D:/...
      let filePath = urlString.replace(/^media:\/\//, '');
      
      // 3. 关键步骤：解码 URL (解决中文路径问题: %E5%B0... -> 小蔡)
      filePath = decodeURIComponent(filePath);

      // 4. Windows 路径特殊处理
      // 如果路径以 "/" 开头且后面跟着盘符 (例如 /D:/Photos)，去掉开头的 "/"
      if (process.platform === 'win32' && filePath.startsWith('/') && /^[a-zA-Z]:/.test(filePath.slice(1))) {
        filePath = filePath.slice(1);
      }

      // 5. 使用 pathToFileURL 生成标准 file:// URL 并请求
      // 这能处理各种怪异字符和空格
      return net.fetch(url.pathToFileURL(filePath).toString());
    });
  }

  // 注册全局快捷键，开发版使用
//Ctrl+Shift+i 打开开发者工具

  globalShortcut.register('CommandOrControl+Shift+Alt+i', function () {
   if (mainWindow && !mainWindow.isDestroyed()) {
     mainWindow.webContents.openDevTools();
    }
  });
  
  // 新增：Ctrl+Shift+D 切换开发者工具
  //globalShortcut.register('CommandOrControl+Shift+Alt+D', function () {
    // 确保主窗口存在且未被销毁
    //if (mainWindow && !mainWindow.isDestroyed()) {
      // 切换开发者工具状态
      //if (mainWindow.webContents.isDevToolsOpened()) {
      //  mainWindow.webContents.closeDevTools();
      //} else {
      //  mainWindow.webContents.openDevTools({ mode: 'undocked' });
      // }
    //}
  //});

  if (store.get('autoLaunch')) { // 可以根据需要决定是否在自动启动时也显示启动画面
    if (store.get('autoLaunchFloat')) {
      createWindows(); // 即使自动启动，也创建启动画面
    } else {
      createWindows();
    }
  } else {
    createWindows(); // 正常启动时创建启动画面
  }
  registerHotkeys();
  loadToastState();
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (mainWindow === null && !isQuitting) createWindows();
});

// ===== 关键修改：在应用退出前清理启动窗口和快捷键 =====
app.on('before-quit', () => {
  isQuitting = true;
  if (splashWindow) {
    splashWindow.destroy(); // 确保启动窗口被销毁
    splashWindow = null;
  }
  floatWindow?.destroy();
  toastWindow?.destroy();
});

// 新增：在应用退出时注销所有全局快捷键
//app.on('will-quit', () => {
   //注销所有全局快捷键
 // globalShortcut.unregisterAll();
//});
// ===== 关键修改结束 =====