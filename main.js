// main.js
const { app, BrowserWindow, Tray, Menu, ipcMain, Notification, screen, dialog } = require('electron'); 
// 发布版中去掉globalShortcut，如需调试请自行添加并删除相关注释
const path = require('path');
const Store = require('electron-store');
const AutoLaunch = require('auto-launch');
const axios = require('axios');

// 关闭 Windows 11 圆角 / Mica
app.commandLine.appendSwitch('disable-features', 'Windows11RoundWindow,Windows11Mica');
// 确保透明
app.setName('墨启随机点名');
app.commandLine.appendSwitch('enable-transparent-visuals');

// 初始化配置存储
const store = new Store({
  defaults: {
    launchFloat: false,
    floatWindowPosition: null,
    autoLaunch: false,
    autoLaunchFloat: false,
    hardwareAcceleration: true // 新增：默认启用硬件加速
  }
});

// --- 新增：根据保存的配置在应用准备前禁用硬件加速（如果用户关闭了） ---
if (store.get('hardwareAcceleration') === false) {
  console.log('Hardware acceleration disabled by user setting，应用将在无硬件加速模式下启动');
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

let mainWindow = null;
let floatWindow = null;
let splashWindow = null; // 新增：启动窗口引用
let tray = null;
let isQuitting = false;
let devModeEnabled = false;

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

  splashWindow.loadFile('splash.html'); // 加载启动画面 HTML

  // 可选：如果 splash.html 加载失败，可以在这里处理
  splashWindow.webContents.on('did-fail-load', () => {
      console.log('启动画面加载失败');
      // 可以选择在这里关闭 splashWindow 或显示错误信息
      // 例如：splashWindow.destroy();
  });
}
// --- 新增结束 ---

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
      console.log('The floating window position has been reset to the bottom right corner of the screen 悬浮窗位置已重置到屏幕右下角');
    } catch (error) {
      console.error('Error when resetting the position of the floating window重置悬浮窗位置时出错:', error);
    }
  } else {
    console.log('The overlay instance does not exist or has been destroyed and cannot be relocated悬浮窗实例不存在或已被销毁，无法重置位置');
  }
}
// --- 新增结束 ---

function createWindows() {
  // ===== 创建启动窗口 =====
  createSplashWindow(); // 在创建主窗口前先创建启动窗口

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
      devTools: true
    },
    icon: path.join(__dirname, 'icon.png'),
    frame: false,
    backgroundColor: '#fff'
  });
  

  mainWindow.loadFile('index.html');

  // 监听主窗口主题变更，保存到 Store
  ipcMain.on('update-float-theme', (event, themeName) => {
    store.set('currentTheme', themeName);
    floatWindow?.webContents.send('float-theme-updated', themeName);
  });

  // 添加同步 IPC 通道供 float.html 读取主题
  ipcMain.handleSync = (channel, handler) => {
    ipcMain.on(channel, (event, ...args) => {
      event.returnValue = handler(...args);
    });
  };
  ipcMain.handleSync('get-current-theme', () => {
    return store.get('currentTheme', 'default');
  });

  // ===== IPC通信处理 =====
  ipcMain.on('quick-roll', (event) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('execute-quick-roll');
    }
  });
  ipcMain.handle('get-config', () => store.get('launchFloat', false));
  ipcMain.handle('set-config', (_, value) => {
    store.set('launchFloat', Boolean(value));
  });
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
        mainWindow.hide();
        floatWindow?.show();
      }
    } catch (err) {
      console.error('自动启动配置失败:', err);
    }
  });
  ipcMain.on('window-minimize', () => mainWindow.minimize());
  ipcMain.on('window-close', () => mainWindow.close());
  if (process.platform === 'darwin') {
    app.dock.hide();
  }

  // ===== 关键修改：监听主窗口 ready-to-show 事件 =====
  mainWindow.on('ready-to-show', () => {
    console.log("The main window is ready to be displayed 主窗口已准备好显示");
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

  ipcMain.on('open-devtools', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.openDevTools({ mode: 'undocked' });
    }
  });
  ipcMain.on('request-devtools', () => {
    // 主进程验证（更安全）
    if (!devModeEnabled) {
      ipcMain.once('devtools-auth', (event, password) => {
        if (validatePassword(password)) { // 实际应使用加密验证
          devModeEnabled = true;
          mainWindow.webContents.openDevTools({ mode: 'undocked' });
          event.reply('devtools-response', { success: true });
        } else {
          event.reply('devtools-response', { success: false, message: '密码错误' });
        }
      });
    } else {
      mainWindow.webContents.openDevTools({ mode: 'undocked' });
    }
  });
  ipcMain.handle('check-for-update', async () => {
    try {
      const response = await axios.get('https://rrc.thinks365.com/updates/update.json');
      return response.data;
    } catch (error) {
      console.error('检查更新失败:', error);
      return { error: '无法连接更新服务器' };
    }
  });
ipcMain.on('update-float-background', (_, imageData) => {
    floatWindow?.webContents.send('update-float-background', imageData);
});
  // ===== 悬浮窗口增强配置 =====
  const savedPosition = store.get('floatWindowPosition');
  floatWindow = new BrowserWindow({
    width: 160,
    height: 80,
    hasShadow: false,
    x: savedPosition?.x,
    y: savedPosition?.y,
    show: store.get('launchFloat') || store.get('autoLaunchFloat'),
    // 关键修改点1: 窗口类型和焦点设置
    alwaysOnTop: true,
    focusable: false,  // 禁止聚焦
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      experimentalFeatures: true,
      nodeIntegration: true,
      contextIsolation: false
    },
    skipTaskbar: true,
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
    if (!floatWindow.isDestroyed() && floatWindow.isVisible()) {
      floatWindow.setAlwaysOnTop(true);
    }
  });
  // ===== 系统托盘 =====
  createTray(); // 确保在窗口创建后再创建托盘，这样 floatWindow 引用是有效的
  // ===== 窗口通信 =====
  ipcMain.on('show-float-window', () => floatWindow.show());
  ipcMain.on('hide-float-window', () => floatWindow.hide());
  ipcMain.handle('is-float-window-visible', () => floatWindow?.isVisible() || false);
  ipcMain.on('start-float-animation', (_, data) => {
    floatWindow?.webContents.send('start-float-animation', data);
  });
  ipcMain.on('stop-float-animation', (_, name) => {
    floatWindow?.webContents.send('stop-float-animation', name);
  });
  // 新增：监听主窗口发送的主题变更消息，并转发给悬浮窗
  ipcMain.on('update-float-theme', (event, themeName) => {
      // console.log('主进程收到主题变更:', themeName); // 可选：调试日志
      floatWindow?.webContents.send('float-theme-updated', themeName);
  });
  ipcMain.on('update-float-styles', (_, styles) => {
    floatWindow?.webContents.send('update-float-styles', styles);
});
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
  ipcMain.on('open-external', (_, url) => {
    require('electron').shell.openExternal(url);
  });
}
//显示悬浮菜单
ipcMain.on('show-float-menu', (event) => {
    const floatMenu = createFloatMenu();
    
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
    floatMenu.popup({
        window: floatWindow,
        //x: Math.round(menuX),
       //y: Math.round(menuY),
       // positioningItem: 0 // 确保菜单紧贴指定位置
    });
        //const closeMenuHandler = () => {
        // 菜单关闭后的清理工作（如果需要的话）
        //console.log('Float menu closed');
    //};
    
    // 监听菜单关闭事件
    //floatMenu.on('menu-will-close', closeMenuHandler);
});

// --- 修改：处理硬件加速设置的 IPC 处理程序 ---
ipcMain.handle('get-hardware-acceleration', () => {
  return store.get('hardwareAcceleration', true); // 默认为启用
});

ipcMain.handle('set-hardware-acceleration', async (_, enabled) => {
  try {
    store.set('hardwareAcceleration', enabled);
    
    const choice = await dialog.showMessageBox({
      type: 'info',
      title: '重启软件以应用更改',
      message: '硬件加速设置已更改，需要重启墨启随机点名才能生效。',
      buttons: ['现在重启', '稍后重启'],
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
// --- 修改结束 ---

function createTray() {
  // 如果托盘已存在，先销毁它
  if (tray) {
    tray.destroy();
  }
  tray = new Tray(path.join(__dirname, 'icon.png'));
  // --- 修改：更新上下文菜单，添加重置位置选项 ---
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主界面',
      click: () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.show();
            if (mainWindow.isMinimized()) mainWindow.restore();
        }
      }
    },
    {
      label: '显示/隐藏悬浮窗',
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
            label: '切换点名模式',
            click: () => {
                if (mainWindow) {
                    mainWindow.webContents.send('toggle-roll-mode');
                }
            }
        },
    {
      label: '重置悬浮窗位置',
      click: () => {
        resetFloatWindowPosition();
      }
    },
    // --- 新增结束 ---
    { type: 'separator' },
            {
            label: '打开设置',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                    mainWindow.webContents.send('open-settings-menu');
                }
            }
        },
    {
      label: '退出程序',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);
  // --- 修改结束 ---
  tray.setToolTip('墨启随机点名');
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
    title: '墨启随机点名',
    body: message || '程序正在后台运行',
    icon: path.join(__dirname, 'icon.png')
  }).show();
}

function createFloatMenu() {
    return Menu.buildFromTemplate([
      {
            label: '切换点名模式',
            click: () => {
                if (mainWindow) {
                    mainWindow.webContents.send('toggle-roll-mode');
                }
            }
        },
        {
            label: '重置悬浮窗位置',
            click: () => {
                resetFloatWindowPosition();
            }
        },
        { type: 'separator' },
        {
            label: '打开主界面',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    if (mainWindow.isMinimized()) mainWindow.restore();
                    mainWindow.focus();
                }
            }
        },
        {
            label: '隐藏悬浮窗',
            click: () => {
                if (floatWindow) {
                    floatWindow.hide();
                }
            }
        },
        { type: 'separator' },
        {
            label: '打开设置',
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
  // 注册全局快捷键
  // Ctrl+Shift+i 打开开发者工具
  //globalShortcut.register('CommandOrControl+Shift+Alt+i', function () {
   // if (mainWindow && !mainWindow.isDestroyed()) {
   //   mainWindow.webContents.openDevTools();
    //}
  //});
  
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
});

// 新增：在应用退出时注销所有全局快捷键
//app.on('will-quit', () => {
   //注销所有全局快捷键
 // globalShortcut.unregisterAll();
//});
// ===== 关键修改结束 =====
