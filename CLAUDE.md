`description:alwaysApply: true`

# 墨启随机点名 (Moqi Random Picker)

An Electron desktop app for randomly selecting names from a list — used for classroom roll-call / random picking. Built with vanilla JS, no frontend framework.

**重要：必须使用中文交流。** 所有回复、注释、文档、提交信息均使用简体中文。代码中的变量名、函数名使用英文。

---

## 项目文件结构

```
D85-501/
├── package.json              ← 项目配置、依赖、electron-builder 打包配置
├── yarn.lock                 ← 依赖锁定文件
├── icon.png                  ← 应用图标
├── splash.png                ← 启动画面图片
│
├── main.js          (1124L)  ← Electron 主进程：窗口管理、Tray、IPC、全局快捷键、自动启动、自定义协议
├── preload.js       (103L)   ← contextBridge：向渲染进程暴露安全的 electronAPI
│
├── index.html       (5458L)  ← 主窗口：单文件 SPA，内含 CSS + HTML + 内联 JS（无打包器）
├── float.html       (487L)   ← 悬浮窗：置顶透明浮窗，显示点名结果（nodeIntegration: true）
├── splash.html      (52L)    ← 启动画面：app 加载前的过渡窗口
├── toast.html       (260L)   ← 全局 Toast 通知窗口：透明浮窗，主进程管理生命周期
│
├── js/
│   ├── i18n.js      (1245L)  ← 国际化引擎：翻译映射表 + TreeWalker DOM 翻译 + 反向索引
│   ├── security.js  (350L)   ← 密码保护：SHA-256 哈希、PIN 输入、权限范围控制
│   ├── updater.js   (305L)   ← 版本更新：静默检查、下载进度、自动/手动更新
│   ├── hotkeys.js   (255L)   ← 快捷键配置 UI：录制键位、校验冲突
│   ├── tts.js       (204L)   ← 语音播报：Web Speech API 封装、模板变量 %name%
│   ├── excelio.js   (184L)   ← Excel 导入导出：SheetJS 解析/生成，分组识别
│   ├── custom-css.js(192L)   ← 自定义 CSS：应用/重置用户自定义样式
│   ├── presets.js   (23L)    ← CSS 快捷预设：预设配色方案
│   └── utils.js     (114L)   ← 工具函数：帮助弹窗、照片文件夹扫描、分组解析、Beta 标记
│
├── docs/                      ← 帮助文档（Markdown，对应设置页各 tab 的 ? 按钮）
│   ├── general.md             ← 通用设置：点名模式、显示、速度、不重复、硬件加速
│   ├── hotkeys.md             ← 快捷键：全局快捷键配置说明
│   ├── float.md               ← 悬浮窗：背景设置、自定义样式
│   ├── data.md                ← 数据管理：名单导入、导出、照片、音乐
│   ├── notification.md        ← 通知设置：全局通知 vs 局内通知
│   ├── security.md            ← 安全设置：密码保护说明
│   ├── startup.md             ← 启动设置：自启、悬浮窗自启、自动检查
│   └── tts.md                 ← 语音播报：TTS 参数、自定义模板、批量播报
│
├── 用户协议与隐私政策.md (145L) ← 首次启动弹窗展示的用户协议与隐私政策
└── CLAUDE.md                  ← 本文件
```

---

## 架构概览

### 进程模型

| 进程 | 文件 | 特点 |
|------|------|------|
| **主进程** | `main.js` | 窗口创建、Tray、IPC 处理、全局快捷键、自动启动、存储 |
| **主窗口** | `index.html` | 完整 UI（设置、点名、名单管理等），`contextIsolation: true`，通过 preload 通信 |
| **悬浮窗** | `float.html` | 置顶透明窗口，`nodeIntegration: true`（性能考虑），主进程直接 `send()` |
| **Toast 窗** | `toast.html` | 全局通知浮窗，主进程管理，每次显示时新建 |
| **启动画面** | `splash.html` | 加载过渡，`ready-to-show` 时销毁 |

### 脚本加载顺序

`index.html` 底部 `<script>` 标签按以下顺序加载（**顺序不可更改**）：

```
security.js → updater.js → hotkeys.js → excelio.js → presets.js → tts.js → custom-css.js → utils.js → i18n.js → 内联脚本
```

`i18n.js` 必须在外部脚本最后、内联脚本之前加载，确保内联脚本中调用 `t()` 时翻译已就绪。

### 数据存储

| 存储层 | 用途 | 位置 |
|--------|------|------|
| **electron-store** | 跨窗口/持久化配置 | 主进程 `%APPDATA%/moqi-random-picker/` |
| **localStorage** | 渲染进程设置和状态 | 浏览器引擎本地存储 |
| **IndexedDB** | 名单数据的持久化备份 | 浏览器引擎数据库（`dbName` 变量） |

---

## 关键 IPC 通道

### 窗口生命周期

| Channel | 方向 | 用途 |
|---------|------|------|
| `window-minimize` | renderer→main | 最小化主窗口 |
| `window-close` | renderer→main | 关闭主窗口（实际隐藏） |
| `window-hidden` | main→renderer | 通知渲染进程窗口已隐藏 |
| `window-shown` | main→renderer | 通知渲染进程窗口已显示 |
| `quit-app` | renderer→main | 退出应用（设置 `isQuitting = true`） |

### 悬浮窗

| Channel | 方向 | 用途 |
|---------|------|------|
| `update-name` | renderer→main→float | 发送姓名到悬浮窗显示 |
| `show-float-window` | renderer→main | 显示悬浮窗 |
| `hide-float-window` | renderer→main | 隐藏悬浮窗 |
| `is-float-window-visible` | invoke | 查询悬浮窗可见状态 |
| `start-float-animation` | renderer→main→float | 悬浮窗滚动动画 |
| `stop-float-animation` | renderer→main→float | 停止动画，定格结果 |
| `update-float-background` | renderer→main→float | 更新悬浮窗背景图 |
| `update-float-styles` | renderer→main→float | 同步样式设置（含字体缩放/英文换行） |
| `show-float-menu` | renderer→main | 弹出悬浮窗右键菜单 |

### 下载与更新

| Channel | 方向 | 用途 |
|---------|------|------|
| `check-for-update` | invoke | 检查远程 `update.json`（axios） |
| `download-update` | invoke | 下载安装包，返回文件路径 |
| `download-progress` | main→renderer | 下载进度事件 |
| `run-installer` | renderer→main | 执行下载好的安装程序 |

### 全局 Toast

| Channel | 方向 | 用途 |
|---------|------|------|
| `show-toast-from-renderer` | renderer→main | 从渲染进程触发全局 Toast |
| `show-inline-toast` | main→renderer | 转发 Toast 到可见的渲染进程 |
| `get-toast-state` | invoke | 获取 Toast 历史 |
| `set-toast-mode` | renderer→main | 切换通知模式（全局/局内） |
| `toast-size-changed` | renderer→main | Toast 窗口大小变化 |
| `toast-count-changed` | renderer→main | Toast 堆叠计数变化 |

### 配置与存储

| Channel | 方向 | 用途 |
|---------|------|------|
| `get-config` / `set-config` | invoke | `launchFloat` 设置 |
| `get-auto-launch-config` / `set-auto-launch-config` | invoke | 开机自启设置 |
| `get-hardware-acceleration` / `set-hardware-acceleration` | invoke | GPU 加速开关 |
| `get-language` / `set-language` | invoke / send | 语言偏好（electron-store） |
| `update-float-language` | renderer→main→float | 语言同步到悬浮窗 |
| `language-changed` | main→renderer | 语言变更事件广播 |
| `get-hotkey-schemes` / `update-hotkey-schemes` | invoke / send | 快捷键方案 CRUD |
| `get-app-version` | invoke | 获取当前应用版本号 |

### 文件与数据

| Channel | 方向 | 用途 |
|---------|------|------|
| `select-photo-folder` / `scan-photo-folder` | invoke | 选择/扫描本地照片文件夹 |
| `read-doc-file` | invoke | 读取 `docs/` 下的帮助文档 .md |
| `read-agreement-file` | invoke | 读取 `用户协议与隐私政策.md` |
| `open-external` | renderer→main | 在系统默认浏览器打开 URL |

### 快捷操作

| Channel | 方向 | 用途 |
|---------|------|------|
| `execute-quick-roll` | main→renderer | 全局快捷键触发快速点名 |
| `toggle-roll-mode` | main→renderer | 托盘菜单切换点名模式 |
| `open-settings-menu` | main→renderer | 托盘菜单打开设置 |
| `reset-custom-css` | main→renderer | 托盘菜单重置自定义 CSS |

---

## 关键实现细节

### 主进程 (`main.js`)

- **窗口管理**：`createWindows()` 同时创建 splash → main → float → toast。主窗口 `show: false`，`ready-to-show` 后销毁 splash 再显示
- **应用生命周期**：关闭行为是隐藏而非退出（`mainWindow.on('close')` 阻止退出，除非 `isQuitting` 为 true），符合 Windows 托盘应用惯例
- **单实例锁**：`app.requestSingleInstanceLock()`，第二个实例唤醒已有窗口
- **自定义协议**：`media://` 协议在 `app.whenReady()` 前注册，通过 `net.fetch` 加载本地图片，`decodeURIComponent` 支持中文路径
- **全局快捷键**：最多 5 个方案，通过 `globalShortcut` 注册，触发时 `mainWindow.webContents.send('execute-quick-roll')`
- **Tray**：系统托盘 + 右键菜单（显示主窗口、切换悬浮窗、重置悬浮窗位置、切换模式、设置、退出）。语言切换时 `rebuildTrayMenu()` 重建
- **主进程翻译**：独立的 `_mainLangMap`（仅 zh-TW + en）和 `tMain()` 函数，覆盖原生 UI（菜单、对话框按钮、通知标题）

### 主窗口 (`index.html`)

- **无打包器**：通过 CDN 加载 Font Awesome（图标）、`marked`（Markdown 渲染）、SheetJS（Excel 处理）
- **状态管理**：全局 `state` 对象直接修改，无 store/reducer 模式
- **主题系统**：CSS 变量由 JS 动态设置，支持多套命名主题
- **模态框系统**：
  - 旧式 `modalManager`：`openModal(id)` / `closeModal(id)`，用于设置
  - 新式 `showModal(opts)`：动态创建 `mq-modal-overlay` + `mq-modal`，支持 size/回调/Promise 式关闭
  - 专用 overlay：更新（`#updateOverlay`）、PIN 验证（`.auth-overlay`）、无名单（`.nonamelist-overlay`）、协议（`#agreementOverlay`）
- **设置系统**：12 个 tab（通用、通知、快捷键、数据管理、语音播报、启动、主界面、悬浮窗、自定义 CSS、安全、关于、重置），通过 `data-tab` / `data-tab-content` 切换
- **按钮显示/隐藏**：`hideSwitchListWhenSingle`、`hideStartRollBtn`、`hideBatchRollBtn` 三个设置控制。`applySwitchListBtnVisibility()` 需在 `state.allLists` 变更的任何地方调用

### 悬浮窗 (`float.html`)

- `nodeIntegration: true` + `contextIsolation: false`（**刻意为之**——性能优化）
- 始终置顶（`alwaysOnTop: true`）、不可聚焦（`focusable: false`）、透明背景、不在任务栏显示
- IPC 直接通过 `floatWindow.webContents.send()`，不经过 preload
- 支持 `scaleTextToFit`（字体缩放到容器宽度）和 `wrapEnglishNames`（英文姓名按空格换行）
- 右键菜单通过 `show-float-menu` IPC 触发

### Toast 窗口 (`toast.html`)

- 全局通知模式：透明浮窗，主进程管理生命周期
- 局内通知模式：主窗口内的卡片式弹窗（inline）
- 两种模式通过 `set-toast-mode` IPC 切换
- 加载时调用 `initLanguage()` 但**不接收实时同步**（每次显示时新建窗口）

---

## i18n 国际化系统

### 核心机制

- **翻译 key 是简体中文原文**。`t('开始点名')` 在翻译表中未命中时回退到 key 本身（即简体中文）
- **反向索引**（`_reverseIndex`）：翻译值 → 原始 key。`applyLanguage()` 首次翻译后将 DOM 文本替换为目标语言；再次切换时通过 `_resolveOriginalKey()` 从当前 DOM 文本反查原始 key 再译为新语言
- **字符串插值**：`t('名单 "{0}" 已存入名单库', name)` 使用 `{0}`, `{1}` 占位符
- **DOM 翻译**：`applyLanguage(root)` 通过 TreeWalker 遍历文本节点、placeholder、title 属性。跳过 `<script>`、`<style>`、`<svg>`、`<noscript>` 以及带 `data-i18n-skip` 的元素
- **动态字符串规则**：`showToast()`、`confirm()`、`textContent =` 等动态设置的用户可见字符串必须用 `t()` 包裹。这是最容易遗漏的地方

### 翻译表结构（`js/i18n.js`）

- `_translations['zh-TW']`：繁体中文（台湾惯用词）
- `_translations['en']`：英文（自然表达，非直译）
- zh-CN 无翻译表（简体中文 key 即回退值）

### 多窗口语言同步流程

```
setLanguage(lang) → localStorage('mq_language') + applyLanguage()
  ├─→ electronAPI.setLanguage(lang)  → main.js electron-store + rebuildTrayMenu()
  ├─→ electronAPI.updateFloatLanguage(lang) → float.html setLanguage() + applyLanguage()
  └─→ 派发 'language-changed' 自定义事件
```

### 新增字符串 checklist

1. 在 `js/i18n.js` 的 `_translations['zh-TW']` 和 `_translations['en']` 中同时添加
2. 简体中文原文作为 key
3. 繁体中文使用台湾惯用词（設定/资料/匯入/儲存/選取/視窗…）
4. 英文使用自然英语表达
5. `<select id="langSelector">` 必须加 `data-i18n-skip`，防止选项文本被翻译后无法切换回原文
6. 重置软件时 `mq_language` 不会被清除（不在 `storageKeys` 中）

---

## npm scripts

| 命令 | 说明 |
|------|------|
| `npm start` | 开发运行 `electron .` |
| `npm run pack` | 打包到 `dist/` 目录（不生成安装包） |
| `npm run dist` / `npm run build` | 生成完整安装包（NSIS/dmg） |

---

## 重要约束

### 不要做的事

- **不要修改 `media://` 协议的 `decodeURIComponent` 逻辑**——中文路径依赖此机制，改动极易导致图片加载失败
- **不要改动脚本加载顺序**——`i18n.js` 必须在外部脚本最后、内联脚本之前加载
- **不要改为 `frame: true`**——窗口使用自定义标题栏，原生边框会破坏 UI
- **不要移除悬浮窗的 `nodeIntegration: true`**——性能关键，且 IPC 通过 `floatWindow.webContents.send()` 直接调用

### 需要注意的事

- `index.html` 超过 5400 行——编辑时定位到正确区域：
  - CSS：`<style id="main-styles">` 块
  - HTML：`<style>` 标签之后到 `<script>` 标签之前的 body 内容
  - JS：末尾的内联 `<script>` 块
- 关闭窗口是隐藏而非退出（`isQuitting` 标志控制真正的退出）
- `electron-store` 的 `asarUnpack` 配置不能删除（打包后需要独立文件访问）
- 所有修改 `state.allLists` 的地方必须同步调用 `applySwitchListBtnVisibility()`
- 新增设置项时，`storageKey` 需加入 `storageKeys` 对象以确保重置时被清除
