const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // 姓名更新
    sendNameToFloat: (name) => ipcRenderer.send('update-name', name),
    // 快速点名
    onQuickRoll: (callback) => ipcRenderer.on('execute-quick-roll', callback),

    // 悬浮窗控制
    showFloatWindow: () => ipcRenderer.send('show-float-window'),
    hideFloatWindow: () => ipcRenderer.send('hide-float-window'),
    isFloatWindowVisible: () => ipcRenderer.invoke('is-float-window-visible'),

    // 窗口控制
    minimizeWindow: () => ipcRenderer.send('window-minimize'),
    closeWindow: () => ipcRenderer.send('window-close'),

    // 新增动画控制接口
    startFloatAnimation: (names, speed) => ipcRenderer.send('start-float-animation', { names, speed }),
    stopFloatAnimation: (name) => ipcRenderer.send('stop-float-animation', name),

    // 外部链接打开
    openExternal: (url) => ipcRenderer.send('open-external', url),

    // 下载更新安装程序
    downloadUpdate: (url) => ipcRenderer.invoke('download-update', url),
    // 下载进度监听
    onDownloadProgress: (callback) => {
      ipcRenderer.on('download-progress', (_event, data) => callback(data));
    },
    // 移除下载进度监听
    removeDownloadProgressListener: () => {
      ipcRenderer.removeAllListeners('download-progress');
    },
    // 运行安装程序
    runInstaller: (filePath) => ipcRenderer.send('run-installer', filePath),

    //启动同时启动悬浮窗
    getConfig: (key) => ipcRenderer.invoke('get-config', key),
    // 获取 APP 版本号（主题商店版本适配用）
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    setConfig: (value) => {
        // 确保传递布尔值
        return ipcRenderer.invoke('set-config', Boolean(value))
    },
    //开机自启动
    getAutoLaunchConfig: () => ipcRenderer.invoke('get-auto-launch-config'),
    setAutoLaunchConfig: (config) => ipcRenderer.invoke('set-auto-launch-config', config),
    //开发者工具
    openDevTools: (callback) => ipcRenderer.on('devtools-response', callback),
    requestDevTools: () => ipcRenderer.send('request-devtools'),
    // 添加更新相关API
    checkForUpdate: () => ipcRenderer.invoke('check-for-update'),
    updateFloatBackground: (imageData) => ipcRenderer.send('update-float-background', imageData),
    updateFloatStyles: (styles) => ipcRenderer.send('update-float-styles', styles),
    // 悬浮窗伪 Mica 效果
    getDisplayBounds: () => ipcRenderer.invoke('get-display-bounds'),
    getWallpaperPath: () => ipcRenderer.invoke('get-wallpaper-path'),
    updateFloatMica: (settings) => ipcRenderer.send('update-float-mica', settings),

    // 硬件加速配置接口
    getHardwareAcceleration: () => ipcRenderer.invoke('get-hardware-acceleration'),
    setHardwareAcceleration: (enabled) => ipcRenderer.invoke('set-hardware-acceleration', Boolean(enabled)),
    // 新增：显示悬浮窗菜单
    showFloatMenu: () => ipcRenderer.send('show-float-menu'),

    // 新增：监听模式切换和设置打开事件
    onToggleRollMode: (callback) => ipcRenderer.on('toggle-roll-mode', callback),
    onOpenSettingsMenu: (callback) => ipcRenderer.on('open-settings-menu', callback),
    // 托盘菜单：清除自定义 CSS
    onResetCustomCss: (callback) => ipcRenderer.on('reset-custom-css', callback),
    //图片API
    selectPhotoFolder: () => ipcRenderer.invoke('select-photo-folder'),
    scanPhotoFolder: (path) => ipcRenderer.invoke('scan-photo-folder', path),
    // 新增：监听窗口隐藏
    onWindowHidden: (callback) => {
        ipcRenderer.on('window-hidden', () => callback());
    },
    // 新增：监听窗口显示
    onWindowShown: (callback) => {
        ipcRenderer.on('window-shown', () => callback());
    },
    // 退出应用以进入ECO模式
    quitApp: () => {
        ipcRenderer.send('quit-app');
    },
    // [新增] 全局 Toast (通过主进程路由)
    showGlobalToast: (type, title, message, duration) => ipcRenderer.send('show-toast-from-renderer', { type, title, message, duration }),
    isMainWindowVisible: () => ipcRenderer.invoke('is-main-window-visible'),
    getToastState: () => ipcRenderer.invoke('get-toast-state'),
    setToastMode: (mode) => ipcRenderer.send('set-toast-mode', mode),
    readDocFile: (docName) => ipcRenderer.invoke('read-doc-file', docName),
    onInlineToast: (callback) => {
        ipcRenderer.on('show-inline-toast', (_, data) => callback(data));
    },
    //快捷键
    getHotkeySchemes: () => ipcRenderer.invoke('get-hotkey-schemes'),
    updateHotkeySchemes: (config) => ipcRenderer.send('update-hotkey-schemes', config),
    //语言设置
    getLanguage: () => ipcRenderer.invoke('get-language'),
    setLanguage: (lang) => ipcRenderer.send('set-language', lang),
    updateFloatLanguage: (lang) => ipcRenderer.send('update-float-language', lang),
    onLanguageChanged: (callback) => {
        ipcRenderer.on('language-changed', (_, lang) => callback(lang));
    },
    // 用户协议
    readAgreementFile: () => ipcRenderer.invoke('read-agreement-file'),

    // 系统材质与焦点状态
    onInitMaterial: (callback) => {
        ipcRenderer.on('init-material', (_event, material) => callback(material));
    },
    onWindowFocusChange: (callback) => {
        ipcRenderer.on('window-focus-change', (_event, isFocused) => callback(isFocused));
    },

    // Windows 系统强调色
    getWindowsAccentColor: () => ipcRenderer.invoke('get-windows-accent-color')
})