// ==========================================
// i18n.js - Internationalization Engine
// 墨启随机点名 (Moqi Random Picker)
// ==========================================

// ---- Current Language State ----
var _currentLang = 'zh-CN';

// ==========================================
// Translation Maps
// Keys are Simplified Chinese (zh-CN)
// Values are translations for zh-TW and en
// ==========================================
var _translations = {
    'zh-TW': {
        // ---- App Brand ----
        '墨启随机点名': '墨啟隨機點名',
        '墨启·随机点名': '墨啟·隨機點名',
        '墨启随机点名工具': '墨啟隨機點名工具',
        'Moqi Random Picker': 'Moqi Random Picker',
        'Copyright © 2026 日有所思 thinks365.com': 'Copyright © 2026 日有所思 thinks365.com',

        // ---- Settings Tab Labels ----
        '通用设置': '通用設定',
        '通知设置': '通知設定',
        '快捷键': '快速鍵',
        '数据管理': '資料管理',
        '语音播报': '語音播報',
        '启动设置': '啟動設定',
        '主界面': '主介面',
        '悬浮窗': '懸浮窗',
        '自定义 CSS': '自訂 CSS',
        '安全设置': '安全設定',
        '关于和更新': '關於和更新',
        '重置软件': '重設軟體',
        '设置': '設定',

        // ---- Settings: General (Tab 0) ----
        '点名模式': '點名模式',
        '个人模式': '個人模式',
        '随机抽取单个姓名': '隨機抽取單個姓名',
        '小组模式': '小組模式',
        '随机抽取整个小组': '隨機抽取整個小組',
        '显示设置': '顯示設定',
        '点名时显示照片': '點名時顯示照片',
        '点名设置': '點名設定',
        '批量抽取数量 (人/组)': '批量抽取數量 (人/組)',
        '快速点名时间': '快速點名時間',
        '抽选速度': '抽選速度',
        '启用精确点名 (提升随机性)': '啟用精確點名 (提升隨機性)',
        '不重复点名设置': '不重複點名設定',
        '启用不重复模式': '啟用不重複模式',
        '硬件加速': '硬體加速',
        '启用硬件加速（需要重启应用生效）': '啟用硬體加速（需要重啟應用程式生效）',
        '低功耗模式': '低功耗模式',
        '窗口隐藏时开启低功耗模式 (降低资源占用)': '視窗隱藏時開啟低功耗模式 (降低資源占用)',
        '语言 / Language': '語言 / Language',
        '跟随系统 (Follow System)': '跟隨系統 (Follow System)',
        '跟随系统': '跟隨系統',
        '简体中文': '简体中文/簡體中文',
        '繁體中文': '繁体中文/繁體中文',
        'English': '英语/English',
        '重启软件以应用更改': '重啟軟體以套用變更',
        '硬件加速设置已更改，需要重启墨启随机点名才能生效。': '硬體加速設定已變更，需要重啟墨啟隨機點名才能生效。',
        '现在重启软件': '現在重啟軟體',
        '稍后重启软件': '稍後重啟軟體',

        // ---- Settings: Hotkeys (Tab 1) ----
        '快捷键总开关': '快速鍵總開關',
        '自定义方案': '自訂方案',
        '添加方案': '新增方案',
        '点击快捷键框或编辑按钮录入组合键。支持 Ctrl、Shift、Alt、Win/Cmd 与字母、数字、功能键。': '點擊快速鍵框或編輯按鈕錄入組合鍵。支援 Ctrl、Shift、Alt、Win/Cmd 與字母、數字、功能鍵。',
        '要设置和使用快捷点名功能，请先打开总开关': '要設定和使用快捷點名功能，請先開啟總開關',
        '等待按键...': '等待按鍵...',
        '确认': '確認',
        '取消': '取消',
        '已清除': '已清除',
        '方案 {0} 的快捷键已清除': '方案 {0} 的快速鍵已清除',
        '快捷键录入': '快速鍵錄入',
        '请按下您要使用的组合键...': '請按下您要使用的組合鍵...',
        '设置成功': '設定成功',
        '快捷键已设置为: {0}': '快速鍵已設定為: {0}',
        '已取消': '已取消',
        '取消录入快捷键': '取消錄入快速鍵',
        '无效快捷键': '無效快速鍵',
        '按键 "{0}" 暂不支持作为全局快捷键，请选择其他有效组合键。': '按鍵 "{0}" 暫不支援作為全域快速鍵，請選擇其他有效組合鍵。',
        '字母、数字、符号等常用键必须与 Ctrl、Alt 或 Shift 组合使用，以免干扰正常输入。': '字母、數字、符號等常用鍵必須與 Ctrl、Alt 或 Shift 組合使用，以免干擾正常輸入。',
        '已达上限': '已達上限',
        '快捷键方案数量上限为 {0} 个': '快速鍵方案數量上限為 {0} 個',

        // ---- Settings: Main Interface (Tab 3) ----
        '模式切换按钮': '模式切換按鈕',
        '隐藏点名模式切换按钮': '隱藏點名模式切換按鈕',
        '按钮显示设置': '按鈕顯示設定',
        '只有一个名单时隐藏切换名单按钮': '只有一個名單時隱藏切換名單按鈕',
        '隐藏开始点名按钮': '隱藏開始點名按鈕',
        '隐藏批量点名按钮': '隱藏批量點名按鈕',
        '主界面标题设置': '主介面標題設定',
        '主界面背景设置': '主介面背景設定',
        '窗口材质效果': '視窗材質效果',
        '启用云母效果': '啟用雲母效果',
        '启用亚克力效果': '啟用亞克力效果',
        '当前系统不支持亚克力效果': '目前系統不支援亞克力效果',
        '仅Windows11系统支持云母效果': '僅 Windows 11 系統支援雲母效果',
        '当前系统不支持云母效果': '目前系統不支援雲母效果',
        '悬浮窗材质效果': '懸浮窗材質效果',
        '启用悬浮窗磨砂玻璃效果': '啟用懸浮窗磨砂玻璃效果',
        '无法获取壁纸': '無法獲取桌布',
        '未能读取系统壁纸，磨砂玻璃效果无法启用。': '無法讀取系統桌布，磨砂玻璃效果無法啟用。',
        '启用失败': '啟用失敗',
        '悬浮窗磨砂玻璃效果启用失败，请重试。': '懸浮窗磨砂玻璃效果啟用失敗，請重試。',
        '启用磨砂玻璃效果': '啟用磨砂玻璃效果',
        '该功能需要获取当前系统壁纸以渲染磨砂玻璃效果，可能导致程序资源占用升高。壁纸处理仅在本地运行，不会上传到网络。': '該功能需要取得目前系統桌布以渲染磨砂玻璃效果，可能導致程式資源佔用升高。桌布處理僅在本機執行，不會上傳到網路。',
        '确认启用': '確認啟用',
        '使用 Windows 强调色': '使用 Windows 強調色',
        '当前强调色': '目前強調色',
        '未能读取系统强调色，已使用默认': '無法讀取系統強調色，已使用預設',
        '请输入标题文本': '請輸入標題文字',
        '选择标题颜色': '選擇標題顏色',
        '选择背景图片': '選擇背景圖片',
        '使用默认背景': '使用預設背景',
        '清除': '清除',

        // ---- Settings: Custom CSS (Tab 4) ----
        '自定义 CSS': '自訂 CSS',
        '在此粘贴任意 CSS 代码，可覆盖颜色、字体、圆角、阴影、动画等一切样式。': '在此貼上任意 CSS 程式碼，可覆蓋顏色、字型、圓角、陰影、動畫等一切樣式。',
        '支持：CSS 变量覆盖 / @import 外部字体 / @media 响应式 / @keyframes 动画 / 任意选择器样式': '支援：CSS 變數覆蓋 / @import 外部字型 / @media 響應式 / @keyframes 動畫 / 任意選擇器樣式',
        '应用样式': '套用樣式',
        '重置样式': '重設樣式',
        '快捷预设': '快捷預設',
        '点击填入 textarea，需再点"应用样式"生效': '點擊填入文字框，需再點「套用樣式」生效',
        '自定义 CSS 功能提醒': '自訂 CSS 功能提醒',
        '自定义 CSS 功能目前处于 Beta 测试阶段，部分样式组合可能出现显示异常或界面错乱。': '自訂 CSS 功能目前處於 Beta 測試階段，部分樣式組合可能出現顯示異常或介面錯亂。',
        '如遇到以下问题：': '如遇到以下問題：',
        '· 按钮不可点击或布局错位': '· 按鈕不可點擊或佈局錯位',
        '· 文字颜色与背景融为一体无法辨认': '· 文字顏色與背景融為一體無法辨認',
        '· 窗口控件（最小化/关闭）失效或不可见': '· 視窗控制項（最小化/關閉）失效或不可見',
        '解决方法：右键点击系统托盘中的程序图标，选择 「清除自定义 CSS」 即可恢复默认样式，无需重启应用。': '解決方法：右鍵點擊系統匣中的程式圖示，選擇「清除自訂 CSS」即可恢復預設樣式，無需重啟應用程式。',
        '请仔细阅读以上说明，': '請仔細閱讀以上說明，',
        ' 秒后可点击确认': ' 秒後可點擊確認',
        '我已知晓，确认应用': '我已知曉，確認套用',
        '已应用': '已套用',
        '自定义 CSS 已生效（外部字体可能需稍等加载）': '自訂 CSS 已生效（外部字型可能需稍等載入）',
        '自定义 CSS 已生效': '自訂 CSS 已生效',
        '已重置': '已重設',
        '自定义 CSS 已清除，恢复默认样式': '自訂 CSS 已清除，恢復預設樣式',
        '未应用': '未套用',
        '有未应用的修改': '有未套用的修改',
        '已填入': '已填入',
        ' 预设已加载，请点击"应用样式"生效': ' 預設已載入，請點擊「套用樣式」生效',

        // ---- Settings: Float Window (Tab 5) ----
        '背景设置': '背景設定',
        '悬浮窗背景设置': '懸浮窗背景設定',
        '选择悬浮窗背景 (GIF/PNG)': '選擇懸浮窗背景 (GIF/PNG)',
        '清除悬浮窗背景': '清除懸浮窗背景',
        '推荐使用 160×80 像素的倍数（如 320×160、480×240）以获得最佳显示效果': '推薦使用 160×80 像素的倍數（如 320×160、480×240）以獲得最佳顯示效果',
        '悬浮窗强调色': '懸浮窗強調色',
        '悬浮窗使用 Windows 强调色': '懸浮窗使用 Windows 強調色',
        '为防止样式冲突，打开悬浮窗使用 Windows 强调色后无法进行悬浮窗样式设置': '為防止樣式衝突，開啟懸浮窗使用 Windows 強調色後無法進行懸浮窗樣式設定',
        '悬浮窗样式设置': '懸浮窗樣式設定',
        '自定义悬浮窗样式': '自訂懸浮窗樣式',
        '该功能仍在测试中，可能存在显示异常或不兼容的问题，请谨慎使用。如遇问题请尝试重置样式。若点击应用样式不起作用，请先尝试点击"重置样式"。': '該功能仍在測試中，可能存在顯示異常或不相容的問題，請謹慎使用。如遇問題請嘗試重設樣式。若點擊套用樣式不起作用，請先嘗試點擊「重設樣式」。',
        '按钮背景色': '按鈕背景色',
        '按钮文字色': '按鈕文字色',
        '姓名样式': '姓名樣式',
        '姓名颜色': '姓名顏色',
        '点名高亮颜色': '點名高亮顏色',
        '启用姓名阴影': '啟用姓名陰影',
        '阴影颜色': '陰影顏色',
        '透明度设置': '透明度設定',
        '按钮背景透明度': '按鈕背景透明度',
        '按钮文字透明度': '按鈕文字透明度',
        '姓名文字透明度': '姓名文字透明度',
        '样式已应用': '樣式已套用',
        '悬浮窗样式已更新': '懸浮窗樣式已更新',
        '确定重置悬浮窗样式为默认值？': '確定重設懸浮窗樣式為預設值？',
        '文字显示设置': '文字顯示設定',
        '缩放文字大小保证姓名完全显示': '縮放文字大小保證姓名完全顯示',
        '英文姓名以空格为分隔换行显示': '英文姓名以空格為分隔換行顯示',

        // ---- Settings: Data Management (Tab 6) ----
        '多名单管理': '多名單管理',
        '导入名单文件 (.txt)': '匯入名單檔案 (.txt)',
        '导入 Excel 名单并保存 (.xlsx)': '匯入 Excel 名單並儲存 (.xlsx)',
        '当前状态: 未加载名单': '目前狀態: 未載入名單',
        '清空当前名单': '清空目前名單',
        '给这个名单起个名 (如: 三年二班)': '為這個名單命名 (如: 三年二班)',
        '保存到名单库': '儲存到名單庫',
        '备份': '備份',
        '已保存的名单库': '已儲存的名單庫',
        '{0}个名单': '{0}個名單',
        '暂无保存的名单，请先导入并保存': '暫無儲存的名單，請先匯入並儲存',
        '当前使用': '目前使用',
        '未关联照片': '未關聯照片',
        '已关联照片': '已關聯照片',
        '人': '人',
        '组': '組',
        '使用': '使用',
        '名单名称': '名單名稱',
        '重命名': '重新命名',
        '照片设置': '照片設定',
        '关联照片文件夹': '關聯照片資料夾',
        '更改文件夹': '更改資料夾',
        '删除此名单': '刪除此名單',
        '创建时间': '建立時間',
        '请先在数据管理中导入并保存名单': '請先在資料管理中匯入並儲存名單',
        '背景音乐设置': '背景音樂設定',
        '选择背景音乐': '選擇背景音樂',
        '未加载音乐': '未載入音樂',
        '未加载照片': '未載入照片',
        '清除关联': '清除關聯',
        '快速链接': '快速連結',
        '小组名单设置帮助': '小組名單設定說明',
        '当前状态: 已加载 {0}': '目前狀態: 已載入 {0}',
        '未加载名单': '未載入名單',

        // ---- Settings: Security (Tab 7) ----
        '密码未设置': '密碼未設定',
        '修改密码': '修改密碼',
        '密码已设置 (保护中)': '密碼已設定 (保護中)',
        '设置 6 位数字密码': '設定 6 位數字密碼',
        '请再次输入 6 位数字密码确认': '請再次輸入 6 位數字密碼確認',
        '密码不一致': '密碼不一致',
        '两次输入的密码不一致，请重新设置': '兩次輸入的密碼不一致，請重新設定',
        '密码设置成功': '密碼設定成功',
        '6 位数字密码已生效': '6 位數字密碼已生效',
        '密码错误，请重试': '密碼錯誤，請重試',
        '请输入原 6 位数字密码': '請輸入原 6 位數字密碼',
        '原密码错误': '原密碼錯誤',
        '请输入新 6 位数字密码': '請輸入新 6 位數字密碼',
        '请再次输入新密码确认': '請再次輸入新密碼確認',
        '成功': '成功',
        '密码修改成功': '密碼修改成功',
        '提示': '提示',
        '请先设置密码，才能开启保护选项': '請先設定密碼，才能開啟保護選項',
        '身份验证': '身份驗證',
        '该操作需要验证密码，请输入 6 位数字密码。': '該操作需要驗證密碼，請輸入 6 位數字密碼。',
        '密码生效范围': '密碼生效範圍',
        '启用下方选项后，执行对应操作时需输入密码验证。': '啟用下方選項後，執行對應操作時需輸入密碼驗證。',
        '打开"设置"菜单': '開啟「設定」選單',
        '打开"数据管理"选项卡': '開啟「資料管理」選項卡',
        '打开"重置软件"选项卡': '開啟「重設軟體」選項卡',
        '点击数字键盘或使用物理键盘输入': '點擊數字鍵盤或使用實體鍵盤輸入',

        // ---- Settings: About (Tab 8) ----
        '检查更新': '檢查更新',
        '官方网站': '官方網站',
        '帮助文档': '說明文件',
        '开源致谢': '開源致謝',
        '检查更新失败，请检查网络连接': '檢查更新失敗，請檢查網路連線',
        '重试': '重試',
        '软件更新': '軟體更新',
        '正在检查更新...': '正在檢查更新...',
        '发现新版本': '發現新版本',
        '本次更新包含功能改进和错误修复': '本次更新包含功能改進和錯誤修復',
        '准备下载...': '準備下載...',
        '正在连接服务器...': '正在連線伺服器...',
        '取消下载': '取消下載',
        '自动更新': '自動更新',
        '手动更新': '手動更新',
        '自动更新将下载安装包并自动打开，手动更新需前往网页下载': '自動更新將下載安裝套件並自動開啟，手動更新需前往網頁下載',
        '当前已是最新版本': '目前已是最新版本',
        '您正在使用最新版本': '您正在使用最新版本',
        '关闭': '關閉',
        '当前版本 {0} 已是最新，暂无更新。': '目前版本 {0} 已是最新，暫無更新。',

        // ---- Settings: Reset (Tab 9) ----
        '恢复初始状态': '恢復初始狀態',
        '清除所有设置和已加载数据': '清除所有設定和已載入資料',
        '确定清除所有设置和数据？': '確定清除所有設定和資料？',
        '此操作将永久删除所有设置、数据和历史记录，包括名单库、背景图片、背景音乐、自定义CSS等。是否继续？': '此操作將永久刪除所有設定、資料和歷史記錄，包括名單庫、背景圖片、背景音樂、自訂CSS等。是否繼續？',
        '正在恢复': '正在恢復',
        '请勿操作软件。': '請勿操作軟體。',
        '恢复完毕': '恢復完畢',
        '已完成清除操作，软件将在3秒后自动重启...': '已完成清除操作，軟體將在3秒後自動重啟...',

        // ---- Settings: Startup (Tab 10) ----
        '启动时自动显示悬浮窗': '啟動時自動顯示懸浮窗',
        '开机自动启动程序': '開機自動啟動程式',
        '开机启动（仅悬浮窗）': '開機啟動（僅懸浮窗）',
        '注意：启用此功能会立即关闭窗口，此后每次启动软件时也只会启动悬浮窗，如需打开主界面请单击托盘图标。': '注意：啟用此功能會立即關閉視窗，此後每次啟動軟體時也只會啟動懸浮窗，如需開啟主介面請按一下系統匣圖示。',
        '启动时自动检查更新': '啟動時自動檢查更新',
        '启动时自动检查名单': '啟動時自動檢查名單',

        // ---- Settings: Notification (Tab 2) ----
        '通知显示方式': '通知顯示方式',
        '全局通知': '全域通知',
        '独立悬浮窗口，主界面隐藏时仍可见': '獨立懸浮視窗，主介面隱藏時仍可見',
        '标注"{0}"': '標註「{0}」',
        '局内通知': '局內通知',
        '主界面内卡片式弹窗': '主介面內卡片式彈窗',
        '窗口隐藏后无法看到': '視窗隱藏後無法看到',

        // ---- Settings: TTS (Tab 11) ----
        '开启后，抽取结束时自动播报被选中的人名或小组名。使用系统 TTS 引擎朗读抽取结果。': '開啟後，抽取結束時自動播報被選中的人名或小組名。使用系統 TTS 引擎朗讀抽取結果。',
        '启用语音播报': '啟用語音播報',
        '播报参数': '播報參數',
        '语速': '語速',
        '音调': '音調',
        '音量': '音量',
        '高级选项': '進階選項',
        '自定义播报内容': '自訂播報內容',
        '使用 %name% 作为姓名变量，播报时会自动替换为抽取结果。': '使用 %name% 作為姓名變數，播報時會自動替換為抽取結果。',
        '插入 %name%': '插入 %name%',
        '测试播报': '測試播報',
        '点击测试播报当前设置效果': '點擊測試播報目前設定效果',
        '默认': '預設',
        '课堂提问': '課堂提問',
        '恭喜选中': '恭喜選中',
        '请起立': '請起立',
        '请上台': '請上臺',
        '组长检查': '組長檢查',
        '请%name%回答问题': '請%name%回答問題',
        '恭喜%name%被选中': '恭喜%name%被選中',
        '%name%，请起立': '%name%，請起立',
        '有请%name%上台': '有請%name%上臺',
        '请%name%的组长检查作业': '請%name%的組長檢查作業',
        '变量超限': '變數超限',
        '%name% 最多出现{0}次': '%name% 最多出現{0}次',
        '字数超限': '字數超限',
        '有效字数已达50字上限': '有效字數已達50字上限',
        '插入后将超过50字上限': '插入後將超過50字上限',
        '不支持': '不支援',
        '当前环境不支持语音播报。': '目前環境不支援語音播報。',
        '测试播报 / 正在播报: {0}': '測試播報 / 正在播報: {0}',
        '有效字数：{0}/50 | 变量：{1}/3': '有效字數：{0}/50 | 變數：{1}/3',

        // ---- Main UI Buttons ----
        '切换名单': '切換名單',
        '显示悬浮窗': '顯示懸浮窗',
        '隐藏悬浮窗': '隱藏懸浮窗',
        '开始点名': '開始點名',
        '批量点名': '批量點名',
        '快速点名': '快速點名',
        '切换到点小组': '切換到點小組',
        '切换到点姓名': '切換到點姓名',
        '导出': '匯出',
        '清除记录': '清除記錄',
        '点名记录（最近50条）': '點名記錄（最近50條）',

        // ---- Display States ----
        '准备就绪': '準備就緒',
        '点名中': '點名中',
        '准备选组': '準備選組',
        '没有名单': '沒有名單',
        '剩余: {0}人': '剩餘: {0}人',
        '剩余: {0}组': '剩餘: {0}組',

        // ---- Toast Messages ----
        '保存成功': '儲存成功',
        '名单 "{0}" 已存入名单库': '名單「{0}」已存入名單庫',
        '无法保存': '無法儲存',
        '当前没有有效名单数据': '目前沒有有效名單資料',
        '名单名称不能为空': '名單名稱不能為空',
        '名单重命名成功': '名單重新命名成功',
        '已取消该名单的照片关联': '已取消該名單的照片關聯',
        '照片文件夹已关联并立即生效': '照片資料夾已關聯並立即生效',
        '已为 "{0}" 关联照片文件夹': '已為「{0}」關聯照片資料夾',
        '已切换到默认/临时名单': '已切換到預設/臨時名單',
        '已切换名单': '已切換名單',
        '当前使用: {0}': '目前使用: {0}',
        '删除成功': '刪除成功',
        '名单已从名单库中删除': '名單已從名單庫中刪除',
        '没有备选姓名': '沒有備選姓名',
        '缺少姓名数据，请先导入或加载名单。': '缺少姓名資料，請先匯入或載入名單。',
        '没有备选小组': '沒有備選小組',
        '缺少小组数据，请先导入或加载名单。': '缺少小組資料，請先匯入或載入名單。',
        '请先在设置 --> 数据管理中导入姓名数据。': '請先在設定 --> 資料管理中匯入姓名資料。',
        '请先在设置 --> 数据管理中导入分组数据。': '請先在設定 --> 資料管理中匯入分組資料。',
        '点名失败': '點名失敗',
        '没有可用姓名': '沒有可用姓名',
        '没有可用小组': '沒有可用小組',
        '抽取完毕': '抽取完畢',
        '所有人抽取完毕，即将开始新的一轮抽取。': '所有人員抽取完畢，即將開始新的一輪抽取。',
        '所有小组已抽取完毕，即将开始新的一轮。': '所有小組已抽取完畢，即將開始新的一輪。',
        '清除成功': '清除成功',
        '已清除当前名单数据。': '已清除目前名單資料。',
        '已解除照片文件夹关联': '已解除照片資料夾關聯',
        '已清除背景音乐。': '已清除背景音樂。',
        '历史记录已清除。': '歷史記錄已清除。',
        '导入成功': '匯入成功',
        '成功加载 {0} 个小组，共 {1} 个姓名数据。': '成功載入 {0} 個小組，共 {1} 個姓名資料。',
        '成功加载 {0} 个姓名数据。': '成功載入 {0} 個姓名資料。',
        '已加载临时名单。如需长期使用，请点击下方保存按钮。': '已載入臨時名單。如需長期使用，請點擊下方儲存按鈕。',
        '导入失败': '匯入失敗',
        '加载失败': '載入失敗',
        '音乐文件加载失败。': '音樂檔案載入失敗。',
        '文件格式错误': '檔案格式錯誤',
        '请选择有效的图片文件。': '請選擇有效的圖片檔案。',
        '文件过大': '檔案過大',
        '图片大小不能超过2MB': '圖片大小不能超過2MB',
        '背景设置成功': '背景設定成功',
        '已成功设置背景图片。': '已成功設定背景圖片。',
        '操作失败': '操作失敗',
        '无法切换悬浮窗状态。': '無法切換懸浮窗狀態。',
        '设置失败': '設定失敗',
        '无法保存悬浮窗启动设置。': '無法儲存懸浮窗啟動設定。',
        '无法保存自动启动设置。': '無法儲存自動啟動設定。',
        '设置已保存': '設定已儲存',
        '重启软件后生效': '重啟軟體後生效',
        '无法保存硬件加速设置': '無法儲存硬體加速設定',
        '导出成功': '匯出成功',
        '请妥善保存备份文件': '請妥善儲存備份檔案',
        '请选择GIF或PNG格式的图片文件。': '請選擇GIF或PNG格式的圖片檔案。',
        '图片大小不能超过1MB': '圖片大小不能超過1MB',
        '已成功设置悬浮窗背景图片。': '已成功設定懸浮窗背景圖片。',
        '悬浮窗背景图片已被清除。': '懸浮窗背景圖片已被清除。',
        '初始化失败': '初始化失敗',
        '配置加载错误，请尝试清除缓存': '設定載入錯誤，請嘗試清除快取',
        '导出历史记录': '匯出歷史記錄',
        '导出个人点名记录': '匯出個人點名記錄',
        '导出小组点名记录': '匯出小組點名記錄',
        '导出批量点名记录': '匯出批量點名記錄',
        '生成 Excel': '產生 Excel',
        '配置 Excel 数据列': '設定 Excel 資料欄',
        '为这个新名单命名：': '為這個新名單命名：',
        '指定【姓名】所在的列：': '指定【姓名】所在的欄：',
        '指定【小组】所在的列 (可选)：': '指定【小組】所在的欄 (可選)：',
        '确认入库': '確認入庫',
        '例如：高三一班': '例如：高三一班',
        '无法导出': '無法匯出',
        '当前没有历史记录': '目前沒有歷史記錄',
        '请至少选择一种导出类型': '請至少選擇一種匯出類型',
        '无数据': '無資料',
        '所选类型下没有历史记录': '所選類型下沒有歷史記錄',
        'Excel 文件已开始下载': 'Excel 檔案已開始下載',
        '文件为空': '檔案為空',
        'Excel文件中没有读取到有效数据行': 'Excel檔案中沒有讀取到有效資料行',
        '解析失败': '解析失敗',
        '无法读取 Excel 文件，请确保文件没有被加密损坏': '無法讀取 Excel 檔案，請確保檔案沒有被加密損壞',
        '未命名Excel名单': '未命名Excel名單',
        '参数缺失': '參數缺失',
        '必须指定【姓名】所在的列！': '必須指定【姓名】所在的欄！',
        '未提取到任何有效的姓名': '未提取到任何有效的姓名',
        '导入并保存成功': '匯入並儲存成功',
        '名单 "{0}" ({1}人) 已载入库中！': '名單「{0}」({1}人) 已載入庫中！',
        '全员不分组': '全員不分組',

        // ---- Confirm Dialogs ----
        '您确定要删除这个名单吗？': '您確定要刪除這個名單嗎？',
        '确定清除所有历史记录？': '確定清除所有歷史記錄？',
        '确定清除自定义背景？': '確定清除自訂背景？',
        '背景图片已被清除。': '背景圖片已被清除。',
        '确定清除悬浮窗背景？': '確定清除懸浮窗背景？',

        // ---- Status Text ----
        '已加载: {0}': '已載入: {0}',
        '未加载{0}': '未載入{0}',
        '名单': '名單',
        '照片': '照片',
        '音乐': '音樂',
        '已加载: {0} ({1}人)': '已載入: {0} ({1}人)',
        '已加载: {0} (未保存)': '已載入: {0} (未儲存)',
        '{0}人': '{0}人',
        '{0}组': '{0}組',
        '{0}个': '{0}個',
        '{0}秒': '{0}秒',

        // ---- Speed Labels ----
        '很慢': '很慢',
        '慢速': '慢速',
        '正常': '正常',
        '快速': '快速',
        '风驰电掣': '風馳電掣',

        // ---- CSS Preset Names ----
        '晨曦金': '晨曦金',
        '薄荷冰': '薄荷冰',
        '深海蓝': '深海藍',
        '薰衣草': '薰衣草',
        '毛玻璃': '毛玻璃',

        // ---- Misc ----
        '加载中...': '載入中...',
        '正在加载帮助文档...': '正在載入說明文件...',
        '无法加载帮助文档：{0}': '無法載入說明文件：{0}',
        '读取照片失败': '讀取照片失敗',
        '{0}张照片': '{0}張照片',
        '低功耗模式': '低功耗模式',
        '退出低功耗模式': '退出低功耗模式',
        '检测到没有名单': '偵測到沒有名單',
        '当前未导入或选择任何名单数据，点名功能无法使用。请前往设置中的数据管理页面导入名单，或访问帮助文档获取使用指南。': '目前未匯入或選擇任何名單資料，點名功能無法使用。請前往設定中的資料管理頁面匯入名單，或瀏覽說明文件取得使用指南。',
        '前往设置': '前往設定',
        '使用帮助': '使用說明',
        '批量选中 {0} 个': '批量選中 {0} 個',
        '数量不足': '數量不足',
        '剩余可用数量({0})小于抽取数量，将抽出所有剩余项。': '剩餘可用數量({0})小於抽取數量，將抽出所有剩餘項目。',
        '一轮结束': '一輪結束',
        '所有人员已抽取完毕': '所有人員已抽取完畢',
        '下载正在进行中，确定要关闭吗？': '下載正在進行中，確定要關閉嗎？',
        '无自动更新链接': '無自動更新連結',
        '该版本暂不支持自动更新，请使用手动更新。': '該版本暫不支援自動更新，請使用手動更新。',
        '下载无响应': '下載無回應',
        '当前无法使用自动更新，请尝试手动更新或稍后再试。': '目前無法使用自動更新，請嘗試手動更新或稍後再試。',
        '下载完成': '下載完成',
        '正在启动安装程序...': '正在啟動安裝程式...',
        '下载失败': '下載失敗',
        '重新下载': '重新下載',
        '完整覆盖(推荐)': '完整覆蓋 (推薦)',
        '完整显示': '完整顯示',
        '重复平铺': '重複平鋪',
        '未命名名单': '未命名名單',

        // ---- Main Process Tray / Float Menu ----
        '显示主界面': '顯示主介面',
        '显示/隐藏悬浮窗': '顯示/隱藏懸浮窗',
        '切换点名模式': '切換點名模式',
        '重置悬浮窗位置': '重設懸浮窗位置',
        '打开设置': '開啟設定',
        '清除自定义 CSS': '清除自訂 CSS',
        '退出程序': '結束程式',
        '打开主界面': '開啟主介面',
        '程序正在后台运行': '程式正在背景執行',
        '主界面已最小化到托盘。如需退出请右键托盘图标。': '主介面已最小化到系統匣。如需結束程式請右鍵系統匣圖示。',
        '文件不存在': '檔案不存在',
        '文件夹不存在': '資料夾不存在',
        '无法连接更新服务器': '無法連線更新伺服器',
        '下载超时，请检查网络连接': '下載逾時，請檢查網路連線',
        '墨启随机点名主进程': '墨啟隨機點名主程序',
        '悬浮窗': '懸浮窗',
        '{0}秒': '{0}秒',
        '已加载: {0}个小组': '已載入: {0}個小組',
        // 用户协议
        '用户协议与隐私政策': '使用者協議與隱私權政策',
        '我已阅读并同意': '我已閱讀並同意',
        '同意并继续': '同意並繼續',
        '加载协议失败: {0}': '載入協議失敗: {0}',
        '协议文件不存在': '協議檔案不存在',
        '不同意并退出': '不同意並退出',
        '用户协议与隐私政策': '使用者協議與隱私權政策',
    },

    'en': {
        // ---- App Brand ----
        '墨启随机点名': 'Moqi Random Picker',
        '墨启·随机点名': 'Moqi Random Picker',
        '墨启随机点名工具': 'Moqi Random Picker',
        'Moqi Random Picker': 'Moqi Random Picker',
        'Copyright © 2026 日有所思 thinks365.com': 'Copyright © 2026 日有所思 thinks365.com',

        // ---- Settings Tab Labels ----
        '通用设置': 'General',
        '通知设置': 'Notifications',
        '快捷键': 'Hotkeys',
        '数据管理': 'Data',
        '语音播报': 'Voice',
        '启动设置': 'Startup',
        '主界面': 'Main UI',
        '悬浮窗': 'Float Window',
        '自定义 CSS': 'Custom CSS',
        '安全设置': 'Security',
        '关于和更新': 'About',
        '重置软件': 'Reset Software',
        '设置': 'Settings',

        // ---- Settings: General (Tab 0) ----
        '点名模式': 'Roll Mode',
        '个人模式': 'Individual',
        '随机抽取单个姓名': 'Pick a single name randomly',
        '小组模式': 'Group',
        '随机抽取整个小组': 'Pick an entire group randomly',
        '显示设置': 'Display',
        '点名时显示照片': 'Show photo during roll',
        '点名设置': 'Roll Settings',
        '批量抽取数量 (人/组)': 'Batch count (persons/groups)',
        '快速点名时间': 'Quick roll duration',
        '抽选速度': 'Roll Speed',
        '启用精确点名 (提升随机性)': 'Enable precise roll (better randomness)',
        '不重复点名设置': 'Non-Repeating Mode',
        '启用不重复模式': 'Enable non-repeating mode',
        '硬件加速': 'Hardware Acceleration',
        '启用硬件加速（需要重启应用生效）': 'Enable hardware acceleration (requires restart)',
        '低功耗模式': 'Low Power Mode',
        '窗口隐藏时开启低功耗模式 (降低资源占用)': 'Enable low power mode when window is hidden (reduces resource usage)',
        '语言 / Language': '语言 / Language',
        '跟随系统 (Follow System)': 'Follow System',
        '跟随系统': '跟随系统/Follow System',
        '简体中文': '简体中文/Simplified Chinese',
        '繁體中文': '繁体中文/Traditional Chinese',
        'English': '英语/English',
        '重启软件以应用更改': 'Restart to Apply Changes',
        '硬件加速设置已更改，需要重启墨启随机点名才能生效。': 'Hardware acceleration setting has been changed. Please restart Moqi Random Picker for it to take effect.',
        '现在重启软件': 'Restart Now',
        '稍后重启软件': 'Restart Later',

        // ---- Settings: Hotkeys (Tab 1) ----
        '快捷键总开关': 'Hotkey Master Switch',
        '自定义方案': 'Custom Schemes',
        '添加方案': 'Add Scheme',
        '点击快捷键框或编辑按钮录入组合键。支持 Ctrl、Shift、Alt、Win/Cmd 与字母、数字、功能键。': 'Click the shortcut box or edit button to record a key combination. Supports Ctrl, Shift, Alt, Win/Cmd with letters, numbers, and function keys.',
        '要设置和使用快捷点名功能，请先打开总开关': 'Please enable the master switch to configure and use hotkeys.',
        '等待按键...': 'Waiting for key...',
        '确认': 'Confirm',
        '取消': 'Cancel',
        '已清除': 'Cleared',
        '方案 {0} 的快捷键已清除': 'Shortcut for Scheme {0} has been cleared',
        '快捷键录入': 'Record Hotkey',
        '请按下您要使用的组合键...': 'Please press the key combination you want to use...',
        '设置成功': 'Set Successfully',
        '快捷键已设置为: {0}': 'Hotkey set to: {0}',
        '已取消': 'Cancelled',
        '取消录入快捷键': 'Hotkey recording cancelled',
        '无效快捷键': 'Invalid Hotkey',
        '按键 "{0}" 暂不支持作为全局快捷键，请选择其他有效组合键。': 'The key "{0}" is not supported as a global hotkey. Please choose another valid combination.',
        '字母、数字、符号等常用键必须与 Ctrl、Alt 或 Shift 组合使用，以免干扰正常输入。': 'Letters, numbers, and symbols must be combined with Ctrl, Alt, or Shift to avoid interfering with normal input.',
        '已达上限': 'Limit Reached',
        '快捷键方案数量上限为 {0} 个': 'Maximum of {0} hotkey schemes allowed.',

        // ---- Settings: Main Interface (Tab 3) ----
        '模式切换按钮': 'Mode Toggle Button',
        '隐藏点名模式切换按钮': 'Hide roll mode toggle button',
        '按钮显示设置': 'Button Visibility',
        '只有一个名单时隐藏切换名单按钮': 'Hide switch list button when only one list',
        '隐藏开始点名按钮': 'Hide start roll button',
        '隐藏批量点名按钮': 'Hide batch roll button',
        '主界面标题设置': 'Title Settings',
        '主界面背景设置': 'Background Settings',
        '窗口材质效果': 'Window Material Effect',
        '启用云母效果': 'Enable Mica Effect',
        '启用亚克力效果': 'Enable Acrylic Effect',
        '当前系统不支持亚克力效果': 'Acrylic effect is not supported on this system',
        '仅Windows11系统支持云母效果': 'Mica effect is only supported on Windows 11',
        '当前系统不支持云母效果': 'Mica effect is not supported on this system',
        '悬浮窗材质效果': 'Float Window Material',
        '启用悬浮窗磨砂玻璃效果': 'Enable Float Window Frosted Glass',
        '无法获取壁纸': 'Cannot get wallpaper',
        '未能读取系统壁纸，磨砂玻璃效果无法启用。': 'Failed to read system wallpaper. Frosted glass effect cannot be enabled.',
        '启用失败': 'Enable failed',
        '悬浮窗磨砂玻璃效果启用失败，请重试。': 'Failed to enable float window frosted glass effect. Please try again.',
        '启用磨砂玻璃效果': 'Enable Frosted Glass',
        '该功能需要获取当前系统壁纸以渲染磨砂玻璃效果，可能导致程序资源占用升高。壁纸处理仅在本地运行，不会上传到网络。': 'This feature needs to read your system wallpaper to render the frosted glass effect, which may increase system resource usage. Wallpaper processing runs locally and will not be uploaded.',
        '确认启用': 'Confirm',
        '使用 Windows 强调色': 'Use Windows accent color',
        '当前强调色': 'Current accent color',
        '未能读取系统强调色，已使用默认': 'Failed to read system accent color, using default',
        '请输入标题文本': 'Enter title text',
        '选择标题颜色': 'Select title color',
        '选择背景图片': 'Choose background image',
        '使用默认背景': 'Using default background',
        '清除': 'Clear',

        // ---- Settings: Custom CSS (Tab 4) ----
        '自定义 CSS': 'Custom CSS',
        '在此粘贴任意 CSS 代码，可覆盖颜色、字体、圆角、阴影、动画等一切样式。': 'Paste any CSS code here to override colors, fonts, border radius, shadows, animations and more.',
        '支持：CSS 变量覆盖 / @import 外部字体 / @media 响应式 / @keyframes 动画 / 任意选择器样式': 'Supports: CSS variable override / @import external fonts / @media responsive / @keyframes animations / any selector styles',
        '应用样式': 'Apply',
        '重置样式': 'Reset Style',
        '点击填入 textarea，需再点"应用样式"生效': 'Click to fill textarea, then click "Apply" to take effect',
        '自定义 CSS 功能提醒': 'Custom CSS Notice',
        '自定义 CSS 功能目前处于 Beta 测试阶段，部分样式组合可能出现显示异常或界面错乱。': 'Custom CSS is currently in Beta. Some style combinations may cause display issues or layout problems.',
        '如遇到以下问题：': 'If you encounter the following issues:',
        '· 按钮不可点击或布局错位': '· Buttons not clickable or layout misaligned',
        '· 文字颜色与背景融为一体无法辨认': '· Text color blending into background, making it unreadable',
        '· 窗口控件（最小化/关闭）失效或不可见': '· Window controls (minimize/close) not working or invisible',
        '解决方法：右键点击系统托盘中的程序图标，选择 「清除自定义 CSS」 即可恢复默认样式，无需重启应用。': 'Solution: Right-click the app icon in the system tray, select "Clear Custom CSS" to restore default styles without restarting.',
        '请仔细阅读以上说明，': 'Please read the above instructions carefully. ',
        ' 秒后可点击确认': ' seconds until you can confirm',
        '我已知晓，确认应用': 'I understand, apply now',
        '已应用': 'Applied',
        '自定义 CSS 已生效（外部字体可能需稍等加载）': 'Custom CSS applied (external fonts may take a moment to load)',
        '自定义 CSS 已生效': 'Custom CSS applied',
        '已重置': 'Reset Complete',
        '自定义 CSS 已清除，恢复默认样式': 'Custom CSS cleared, default styles restored',
        '未应用': 'Not Applied',
        '有未应用的修改': 'Unapplied changes exist',
        '已填入': 'Loaded',
        ' 预设已加载，请点击"应用样式"生效': ' preset loaded. Click "Apply" to activate',

        // ---- Settings: Float Window (Tab 5) ----
        '背景设置': 'Background',
        '悬浮窗背景设置': 'Float Window Background',
        '选择悬浮窗背景 (GIF/PNG)': 'Choose float window background (GIF/PNG)',
        '清除悬浮窗背景': 'Clear float window background',
        '推荐使用 160×80 像素的倍数（如 320×160、480×240）以获得最佳显示效果': 'Recommended size: multiples of 160×80 pixels (e.g., 320×160, 480×240) for best results',
        '悬浮窗强调色': 'Float Window Accent Color',
        '悬浮窗使用 Windows 强调色': 'Float window uses Windows accent color',
        '为防止样式冲突，打开悬浮窗使用 Windows 强调色后无法进行悬浮窗样式设置': 'Float window style settings are disabled when using Windows accent color to prevent style conflicts',
        '悬浮窗样式设置': 'Float Window Style',
        '自定义悬浮窗样式': 'Custom Float Style',
        '该功能仍在测试中，可能存在显示异常或不兼容的问题，请谨慎使用。如遇问题请尝试重置样式。若点击应用样式不起作用，请先尝试点击"重置样式"。': 'This feature is in beta and may have display issues. If styles don\'t apply, try clicking "Reset" first.',
        '按钮背景色': 'Button Background',
        '按钮文字色': 'Button Text Color',
        '姓名样式': 'Name Style',
        '姓名颜色': 'Name Color',
        '点名高亮颜色': 'Highlight Color',
        '启用姓名阴影': 'Enable Name Shadow',
        '阴影颜色': 'Shadow Color',
        '透明度设置': 'Opacity',
        '按钮背景透明度': 'Button Background Opacity',
        '按钮文字透明度': 'Button Text Opacity',
        '姓名文字透明度': 'Name Text Opacity',
        '样式已应用': 'Style Applied',
        '悬浮窗样式已更新': 'Float window style updated',
        '确定重置悬浮窗样式为默认值？': 'Reset float window style to default?',
        '文字显示设置': 'Text Display',
        '缩放文字大小保证姓名完全显示': 'Scale text to fit full name',
        '英文姓名以空格为分隔换行显示': 'Wrap English names at spaces',

        // ---- Settings: Data Management (Tab 6) ----
        '多名单管理': 'List Management',
        '导入名单文件 (.txt)': 'Import name list (.txt)',
        '导入 Excel 名单并保存 (.xlsx)': 'Import Excel list and save (.xlsx)',
        '当前状态: 未加载名单': 'Status: No list loaded',
        '清空当前名单': 'Clear Current List',
        '给这个名单起个名 (如: 三年二班)': 'Name this list (e.g., Class 3-2)',
        '保存到名单库': 'Save to Library',
        '备份': 'Backup',
        '已保存的名单库': 'Saved Lists',
        '{0}个名单': '{0} list(s)',
        '暂无保存的名单，请先导入并保存': 'No saved lists. Import and save a list first.',
        '当前使用': 'In Use',
        '未关联照片': 'No photo',
        '已关联照片': 'Photo linked',
        '人': '',
        '组': ' groups',
        '使用': 'Use',
        '名单名称': 'List Name',
        '重命名': 'Rename',
        '照片设置': 'Photo Settings',
        '关联照片文件夹': 'Link Photo Folder',
        '更改文件夹': 'Change Folder',
        '删除此名单': 'Delete This List',
        '创建时间': 'Created',
        '请先在数据管理中导入并保存名单': 'Please import and save a list in Data Management first.',
        '背景音乐设置': 'Background Music',
        '选择背景音乐': 'Choose background music',
        '未加载音乐': 'No music loaded',
        '未加载照片': 'No photo loaded',
        '清除关联': 'Clear Link',
        '快速链接': 'Quick Links',
        '小组名单设置帮助': 'Group List Setup Guide',
        '当前状态: 已加载 {0}': 'Status: {0} loaded',
        '未加载名单': 'No list loaded',

        // ---- Settings: Security (Tab 7) ----
        '密码未设置': 'No Password Set',
        '修改密码': 'Change Password',
        '密码已设置 (保护中)': 'Password Set (Protected)',
        '设置 6 位数字密码': 'Set 6-digit PIN',
        '请再次输入 6 位数字密码确认': 'Re-enter 6-digit PIN to confirm',
        '密码不一致': 'PIN Mismatch',
        '两次输入的密码不一致，请重新设置': 'PINs do not match. Please try again.',
        '密码设置成功': 'PIN Set',
        '6 位数字密码已生效': '6-digit PIN is now active',
        '密码错误，请重试': 'Incorrect PIN. Please try again.',
        '请输入原 6 位数字密码': 'Enter current 6-digit PIN',
        '原密码错误': 'Incorrect Current PIN',
        '请输入新 6 位数字密码': 'Enter new 6-digit PIN',
        '请再次输入新密码确认': 'Re-enter new PIN to confirm',
        '成功': 'Success',
        '密码修改成功': 'PIN changed successfully',
        '提示': 'Notice',
        '请先设置密码，才能开启保护选项': 'Please set a PIN first to enable protection options.',
        '身份验证': 'Authentication',
        '该操作需要验证密码，请输入 6 位数字密码。': 'This action requires verification. Please enter your 6-digit PIN.',
        '密码生效范围': 'Protection Scope',
        '启用下方选项后，执行对应操作时需输入密码验证。': 'When enabled, the corresponding actions will require PIN verification.',
        '打开"设置"菜单': 'Opening "Settings" menu',
        '打开"数据管理"选项卡': 'Opening "Data" tab',
        '打开"重置软件"选项卡': 'Opening "Reset" tab',
        '点击数字键盘或使用物理键盘输入': 'Use the on-screen keypad or physical keyboard',

        // ---- Settings: About (Tab 8) ----
        '检查更新': 'Check for Updates',
        '官方网站': 'Official Website',
        '帮助文档': 'Documentation',
        '开源致谢': 'Open Source Credits',
        '检查更新失败，请检查网络连接': 'Update check failed. Please check your network connection.',
        '重试': 'Retry',
        '软件更新': 'Software Update',
        '正在检查更新...': 'Checking for updates...',
        '发现新版本': 'New Version Available',
        '本次更新包含功能改进和错误修复': 'This update includes feature improvements and bug fixes.',
        '准备下载...': 'Preparing download...',
        '正在连接服务器...': 'Connecting to server...',
        '取消下载': 'Cancel Download',
        '自动更新': 'Auto Update',
        '手动更新': 'Manual Update',
        '自动更新将下载安装包并自动打开，手动更新需前往网页下载': 'Auto update will download and launch the installer. Manual update requires visiting the website.',
        '当前已是最新版本': 'Up to Date',
        '您正在使用最新版本': 'You are using the latest version.',
        '关闭': 'Close',
        '当前版本 {0} 已是最新，暂无更新。': 'Version {0} is up to date. No updates available.',

        // ---- Settings: Reset (Tab 9) ----
        '恢复初始状态': 'Restore Default State',
        '清除所有设置和已加载数据': 'Clear All Settings and Data',
        '确定清除所有设置和数据？': 'Are you sure you want to clear all settings and data?',
        '此操作将永久删除所有设置、数据和历史记录，包括名单库、背景图片、背景音乐、自定义CSS等。是否继续？': 'This will permanently delete all settings, data, and history, including the list library, background images, background music, custom CSS, etc. Continue?',
        '正在恢复': 'Restoring',
        '请勿操作软件。': 'Please do not operate the software.',
        '恢复完毕': 'Restore Complete',
        '已完成清除操作，软件将在3秒后自动重启...': 'Reset complete. The app will restart in 3 seconds...',

        // ---- Settings: Startup (Tab 10) ----
        '启动时自动显示悬浮窗': 'Show float window on startup',
        '开机自动启动程序': 'Launch at system startup',
        '开机启动（仅悬浮窗）': 'Launch at startup (float window only)',
        '注意：启用此功能会立即关闭窗口，此后每次启动软件时也只会启动悬浮窗，如需打开主界面请单击托盘图标。': 'Note: Enabling this will close the window immediately. From now on, only the float window will appear at startup. Click the tray icon to open the main interface.',
        '启动时自动检查更新': 'Check for updates on startup',
        '启动时自动检查名单': 'Check name list on startup',

        // ---- Settings: Notification (Tab 2) ----
        '通知显示方式': 'Notification Style',
        '全局通知': 'Global Notification',
        '独立悬浮窗口，主界面隐藏时仍可见': 'Independent floating window, visible even when main window is hidden',
        '标注"{0}"': 'Tagged "{0}"',
        '局内通知': 'In-App Notification',
        '主界面内卡片式弹窗': 'Card-style popup within main window',
        '窗口隐藏后无法看到': 'Not visible when window is hidden',

        // ---- Settings: TTS (Tab 11) ----
        '开启后，抽取结束时自动播报被选中的人名或小组名。使用系统 TTS 引擎朗读抽取结果。': 'When enabled, the selected name or group will be read aloud using the system TTS engine.',
        '启用语音播报': 'Enable Voice Announcement',
        '播报参数': 'Announcement Settings',
        '语速': 'Rate',
        '音调': 'Pitch',
        '音量': 'Volume',
        '高级选项': 'Advanced',
        '自定义播报内容': 'Custom Announcement Text',
        '使用 %name% 作为姓名变量，播报时会自动替换为抽取结果。': 'Use %name% as the name variable. It will be replaced with the roll result.',
        '插入 %name%': 'Insert %name%',
        '测试播报': 'Test Announcement',
        '点击测试播报当前设置效果': 'Click to test the current announcement',
        '默认': 'Default',
        '课堂提问': 'Class Question',
        '恭喜选中': 'Congratulations',
        '请起立': 'Please Stand Up',
        '请上台': 'Come to the Front',
        '组长检查': 'Group Leader Check',
        '请%name%回答问题': 'Please have %name% answer the question',
        '恭喜%name%被选中': 'Congratulations, %name% has been selected',
        '%name%，请起立': '%name%, please stand up',
        '有请%name%上台': '%name%, please come to the front',
        '请%name%的组长检查作业': 'Please have %name%\'s group leader check the homework',
        '变量超限': 'Variable Limit',
        '%name% 最多出现{0}次': '%name% can appear at most {0} time(s)',
        '字数超限': 'Character Limit',
        '有效字数已达50字上限': 'Character limit of 50 reached',
        '插入后将超过50字上限': 'Insertion would exceed the 50-character limit',
        '不支持': 'Not Supported',
        '当前环境不支持语音播报。': 'Voice announcement is not supported in the current environment.',
        '测试播报 / 正在播报: {0}': 'Test / Announcing: {0}',
        '有效字数：{0}/50 | 变量：{1}/3': 'Characters: {0}/50 | Variables: {1}/3',

        // ---- Main UI Buttons ----
        '切换名单': 'Switch List',
        '显示悬浮窗': 'Show Float',
        '隐藏悬浮窗': 'Hide Float',
        '开始点名': 'Start Roll',
        '批量点名': 'Batch Roll',
        '快速点名': 'Quick Roll',
        '切换到点小组': 'Switch to Groups',
        '切换到点姓名': 'Switch to Names',
        '导出': 'Export',
        '清除记录': 'Clear History',
        '点名记录（最近50条）': 'Roll History (Last 50)',

        // ---- Display States ----
        '准备就绪': 'Ready',
        '点名中': 'Rolling...',
        '准备选组': 'Ready (Groups)',
        '没有名单': 'No List',
        '剩余: {0}人': 'Remaining: {0}',
        '剩余: {0}组': 'Remaining: {0} groups',

        // ---- Toast Messages ----
        '保存成功': 'Saved',
        '名单 "{0}" 已存入名单库': 'List "{0}" saved to library.',
        '无法保存': 'Cannot Save',
        '当前没有有效名单数据': 'No valid list data available.',
        '名单名称不能为空': 'List name cannot be empty.',
        '名单重命名成功': 'List renamed successfully.',
        '已取消该名单的照片关联': 'Photo link removed for this list.',
        '照片文件夹已关联并立即生效': 'Photo folder linked and now active.',
        '已为 "{0}" 关联照片文件夹': 'Photo folder linked for "{0}".',
        '已切换到默认/临时名单': 'Switched to default/temporary list.',
        '已切换名单': 'List Switched',
        '当前使用: {0}': 'Now using: {0}',
        '删除成功': 'Deleted',
        '名单已从名单库中删除': 'List removed from library.',
        '没有备选姓名': 'No Names Available',
        '缺少姓名数据，请先导入或加载名单。': 'No name data. Please import or load a list first.',
        '没有备选小组': 'No Groups Available',
        '缺少小组数据，请先导入或加载名单。': 'No group data. Please import or load a list first.',
        '请先在设置 --> 数据管理中导入姓名数据。': 'Please import name data in Settings → Data Management.',
        '请先在设置 --> 数据管理中导入分组数据。': 'Please import group data in Settings → Data Management.',
        '点名失败': 'Roll Failed',
        '没有可用姓名': 'No available names',
        '没有可用小组': 'No available groups',
        '抽取完毕': 'All Picked',
        '所有人抽取完毕，即将开始新的一轮抽取。': 'Everyone has been picked. Starting a new round...',
        '所有小组已抽取完毕，即将开始新的一轮。': 'All groups have been picked. Starting a new round...',
        '清除成功': 'Cleared Successfully',
        '已清除当前名单数据。': 'Current list data cleared.',
        '已解除照片文件夹关联': 'Photo folder link removed.',
        '已清除背景音乐。': 'Background music cleared.',
        '历史记录已清除。': 'History cleared.',
        '导入成功': 'Import Successful',
        '成功加载 {0} 个小组，共 {1} 个姓名数据。': 'Loaded {0} groups, {1} names total.',
        '成功加载 {0} 个姓名数据。': 'Loaded {0} names.',
        '已加载临时名单。如需长期使用，请点击下方保存按钮。': 'Temporary list loaded. Click "Save" below to keep it permanently.',
        '导入失败': 'Import Failed',
        '加载失败': 'Load Failed',
        '音乐文件加载失败。': 'Failed to load music file.',
        '文件格式错误': 'Invalid File Format',
        '请选择有效的图片文件。': 'Please select a valid image file.',
        '文件过大': 'File Too Large',
        '图片大小不能超过2MB': 'Image size must not exceed 2MB.',
        '背景设置成功': 'Background Set',
        '已成功设置背景图片。': 'Background image set successfully.',
        '操作失败': 'Operation Failed',
        '无法切换悬浮窗状态。': 'Unable to toggle float window state.',
        '设置失败': 'Setting Failed',
        '无法保存悬浮窗启动设置。': 'Unable to save float window startup setting.',
        '无法保存自动启动设置。': 'Unable to save auto-launch setting.',
        '设置已保存': 'Setting Saved',
        '重启软件后生效': 'Takes effect after restart.',
        '无法保存硬件加速设置': 'Unable to save hardware acceleration setting.',
        '导出成功': 'Export Successful',
        '请妥善保存备份文件': 'Please keep the backup file safe.',
        '请选择GIF或PNG格式的图片文件。': 'Please select a GIF or PNG image file.',
        '图片大小不能超过1MB': 'Image size must not exceed 1MB.',
        '已成功设置悬浮窗背景图片。': 'Float window background set successfully.',
        '悬浮窗背景图片已被清除。': 'Float window background cleared.',
        '初始化失败': 'Initialization Failed',
        '配置加载错误，请尝试清除缓存': 'Configuration load error. Try clearing the cache.',
        '导出历史记录': 'Export History',
        '导出个人点名记录': 'Export individual roll records',
        '导出小组点名记录': 'Export group roll records',
        '导出批量点名记录': 'Export batch roll records',
        '生成 Excel': 'Generate Excel',
        '配置 Excel 数据列': 'Configure Excel Columns',
        '为这个新名单命名：': 'Name this new list:',
        '指定【姓名】所在的列：': 'Specify the column for [Name]:',
        '指定【小组】所在的列 (可选)：': 'Specify the column for [Group] (optional):',
        '确认入库': 'Confirm & Save',
        '例如：高三一班': 'e.g., Class 3-1',
        '无法导出': 'Cannot Export',
        '当前没有历史记录': 'No history records available.',
        '请至少选择一种导出类型': 'Please select at least one export type.',
        '无数据': 'No Data',
        '所选类型下没有历史记录': 'No history records for the selected type.',
        'Excel 文件已开始下载': 'Excel file download started.',
        '文件为空': 'Empty File',
        'Excel文件中没有读取到有效数据行': 'No valid data rows found in the Excel file.',
        '解析失败': 'Parse Failed',
        '无法读取 Excel 文件，请确保文件没有被加密损坏': 'Cannot read Excel file. Ensure the file is not encrypted or corrupted.',
        '未命名Excel名单': 'Unnamed Excel List',
        '参数缺失': 'Missing Parameter',
        '必须指定【姓名】所在的列！': 'You must specify the column for [Name]!',
        '未提取到任何有效的姓名': 'No valid names extracted.',
        '导入并保存成功': 'Imported and Saved',
        '名单 "{0}" ({1}人) 已载入库中！': 'List "{0}" ({1} names) loaded into library!',
        '全员不分组': 'All Members (No Groups)',

        // ---- Confirm Dialogs ----
        '您确定要删除这个名单吗？': 'Are you sure you want to delete this list?',
        '确定清除所有历史记录？': 'Clear all history records?',
        '确定清除自定义背景？': 'Clear custom background?',
        '背景图片已被清除。': 'Background image cleared.',
        '确定清除悬浮窗背景？': 'Clear float window background?',

        // ---- Status Text ----
        '已加载: {0}': 'Loaded: {0}',
        '未加载{0}': 'No {0} loaded',
        '名单': 'list',
        '照片': 'photo',
        '音乐': 'music',
        '已加载: {0} ({1}人)': 'Loaded: {0} ({1} names)',
        '已加载: {0} (未保存)': 'Loaded: {0} (unsaved)',
        '{0}人': '{0} names',
        '{0}组': '{0} groups',
        '{0}个': '{0}',
        '{0}秒': '{0}s',

        // ---- Speed Labels ----
        '很慢': 'Very Slow',
        '慢速': 'Slow',
        '正常': 'Normal',
        '快速': 'Fast',
        '风驰电掣': 'Lightning',

        // ---- CSS Preset Names ----
        '晨曦金': 'Golden Dawn',
        '薄荷冰': 'Mint Ice',
        '深海蓝': 'Deep Ocean',
        '薰衣草': 'Lavender',
        '毛玻璃': 'Frosted Glass',

        // ---- Misc ----
        '加载中...': 'Loading...',
        '正在加载帮助文档...': 'Loading help document...',
        '无法加载帮助文档：{0}': 'Cannot load help document: {0}',
        '读取照片失败': 'Failed to Read Photo',
        '{0}张照片': '{0} photo(s)',
        '低功耗模式': 'Low Power Mode',
        '退出低功耗模式': 'Exit Low Power Mode',
        '检测到没有名单': 'No Name List Detected',
        '当前未导入或选择任何名单数据，点名功能无法使用。请前往设置中的数据管理页面导入名单，或访问帮助文档获取使用指南。': 'No name list is currently loaded. The roll call feature cannot be used. Please go to Settings → Data to import a list, or visit the help documentation.',
        '前往设置': 'Go to Settings',
        '使用帮助': 'Help',
        '批量选中 {0} 个': '{0} selected in batch',
        '数量不足': 'Insufficient Count',
        '剩余可用数量({0})小于抽取数量，将抽出所有剩余项。': 'Remaining count ({0}) is less than the requested batch size. All remaining items will be selected.',
        '一轮结束': 'Round Complete',
        '所有人员已抽取完毕': 'All members have been picked.',
        '下载正在进行中，确定要关闭吗？': 'Download in progress. Are you sure you want to close?',
        '无自动更新链接': 'No Auto-Update Link',
        '该版本暂不支持自动更新，请使用手动更新。': 'This version does not support auto-update. Please use manual update.',
        '下载无响应': 'Download Unresponsive',
        '当前无法使用自动更新，请尝试手动更新或稍后再试。': 'Auto-update is currently unavailable. Please try manual update or try again later.',
        '下载完成': 'Download Complete',
        '正在启动安装程序...': 'Launching installer...',
        '下载失败': 'Download Failed',
        '重新下载': 'Retry Download',
        '完整覆盖(推荐)': 'Cover (Recommended)',
        '完整显示': 'Contain',
        '重复平铺': 'Tile',
        '未命名名单': 'Unnamed List',

        // ---- Main Process Tray / Float Menu ----
        '显示主界面': 'Show Main Window',
        '显示/隐藏悬浮窗': 'Show/Hide Float Window',
        '切换点名模式': 'Switch Roll Mode',
        '重置悬浮窗位置': 'Reset Float Position',
        '打开设置': 'Open Settings',
        '清除自定义 CSS': 'Clear Custom CSS',
        '退出程序': 'Quit',
        '打开主界面': 'Open Main Window',
        '程序正在后台运行': 'Running in background',
        '主界面已最小化到托盘。如需退出请右键托盘图标。': 'The main window has been minimized to the tray. Right-click the tray icon to quit.',
        '文件不存在': 'File not found',
        '文件夹不存在': 'Folder not found',
        '无法连接更新服务器': 'Cannot connect to update server',
        '下载超时，请检查网络连接': 'Download timed out. Please check your network connection.',
        '墨启随机点名主进程': 'Moqi Random Picker',
        '悬浮窗': 'Float Window',
        '{0}秒': '{0}s',
        '已加载: {0}个小组': 'Loaded: {0} groups',
        '用户协议与隐私政策': 'User Agreement & Privacy Policy',
        '我已阅读并同意': 'I have read and agree',
        '同意并继续': 'Agree & Continue',
        '加载协议失败: {0}': 'Failed to load agreement: {0}',
        '协议文件不存在': 'Agreement file not found',
        '不同意并退出': 'Decline & Exit',
        '用户协议与隐私政策': 'User Agreement & Privacy Policy',
    }
};

// ==========================================
// Core Functions
// ==========================================

/**
 * Resolve the effective language code from a stored preference.
 * @param {string} storedLang - 'system', 'zh-CN', 'zh-TW', or 'en'
 * @returns {string} 'zh-CN', 'zh-TW', or 'en'
 */
function getEffectiveLanguage(storedLang) {
    if (!storedLang || storedLang === 'system') {
        try {
            var navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
            if (navLang.startsWith('zh')) {
                if (navLang === 'zh-tw' || navLang === 'zh-hk' || navLang === 'zh-mo' || navLang === 'zh-hant') {
                    return 'zh-TW';
                }
                return 'zh-CN';
            }
            if (navLang.startsWith('en')) {
                return 'en';
            }
            // Default fallback
            return 'zh-CN';
        } catch (e) {
            return 'zh-CN';
        }
    }
    return storedLang;
}

/**
 * Translate a string key to the current language.
 * Falls back to the key itself (Simplified Chinese) if no translation is found.
 * @param {string} key - The text to translate (Simplified Chinese)
 * @param {...any} args - Positional arguments for {0}, {1}, etc.
 * @returns {string} Translated text
 */
function t(key) {
    if (!key || typeof key !== 'string') return key || '';
    var translated = key;
    if (_currentLang !== 'zh-CN' && _translations[_currentLang] && _translations[_currentLang][key] !== undefined) {
        translated = _translations[_currentLang][key];
    }
    // Replace positional placeholders {0}, {1}, etc.
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            var val = arguments[i];
            if (val === undefined || val === null) val = '';
            translated = translated.replace(new RegExp('\\{' + (i - 1) + '\\}', 'g'), String(val));
        }
    }
    return translated;
}

/**
 * Walk the DOM and translate text nodes, placeholders, and title attributes.
 * @param {Element} [root] - Root element to translate (defaults to document.body)
 */

// Reverse-index cache: maps translated text → original zh-CN key
var _reverseIndex = null;

function _buildReverseIndex() {
    _reverseIndex = {};
    var langs = ['zh-TW', 'en'];
    for (var li = 0; li < langs.length; li++) {
        var map = _translations[langs[li]];
        for (var key in map) {
            if (map.hasOwnProperty(key)) {
                var val = map[key];
                if (_reverseIndex[val] !== undefined && _reverseIndex[val] !== key) {
                    console.warn('[i18n] Reverse index collision: value "' + val + '" maps to both "' + _reverseIndex[val] + '" and "' + key + '". The latter wins. Please use unique translation values.');
                }
                _reverseIndex[val] = key;
            }
        }
    }
}

function _resolveOriginalKey(text) {
    if (!text) return text;
    // If text IS a known key (exists in any translation map as a key), return it directly
    if (_translations['zh-TW'][text] !== undefined || _translations['en'][text] !== undefined) {
        return text;
    }
    // Reverse lookup: search for this text as a translation value
    if (!_reverseIndex) _buildReverseIndex();
    return _reverseIndex[text] || text;
}

function _translateText(originalText) {
    var key = _resolveOriginalKey(originalText);
    return t(key);
}

function applyLanguage(root) {
    if (!root) root = document.body;
    if (!root) return;

    // Invalidate reverse index on each language change (new translations may have been added)
    _reverseIndex = null;

    // Update HTML lang attribute
    var htmlEl = document.documentElement;
    if (htmlEl) {
        htmlEl.setAttribute('lang', _currentLang);
    }

    // Use TreeWalker for efficient traversal
    var walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        {
            acceptNode: function(node) {
                // Skip script and style content
                if (node.parentNode) {
                    var tag = node.parentNode.tagName;
                    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'SVG' || tag === 'NOSCRIPT') {
                        return NodeFilter.FILTER_REJECT;
                    }
                }
                // Skip elements marked with data-i18n-skip
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.hasAttribute && node.hasAttribute('data-i18n-skip')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_SKIP; // We handle elements in the walker loop
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    var node;
    var translatedNodes = [];

    // First pass: collect all text nodes
    while (node = walker.nextNode()) {
        if (node.nodeType === Node.TEXT_NODE) {
            translatedNodes.push(node);
        }
    }

    // Second pass: translate text nodes (read-only traversal now complete)
    for (var i = 0; i < translatedNodes.length; i++) {
        var textNode = translatedNodes[i];
        var originalText = textNode.nodeValue;
        if (!originalText) continue;
        var trimmed = originalText.trim();
        if (trimmed.length === 0) continue;

        // Use reverse-lookup to find original zh-CN key, then translate to target
        var translated = _translateText(trimmed);
        if (translated !== trimmed) {
            // Only replace if the text is reasonably static (not purely numeric/date)
            textNode.nodeValue = originalText.replace(trimmed, translated);
        }
    }

    // Process element attributes (placeholder, title)
    var allElements = root.querySelectorAll
        ? root.querySelectorAll('[placeholder],[title],option,label[for]')
        : [];
    for (var j = 0; j < allElements.length; j++) {
        var el = allElements[j];
        if (el.hasAttribute && el.hasAttribute('data-i18n-skip')) continue;

        // Translate placeholder
        var placeholder = el.getAttribute('placeholder');
        if (placeholder && placeholder.trim()) {
            var tPlaceholder = _translateText(placeholder.trim());
            if (tPlaceholder !== placeholder.trim()) {
                el.setAttribute('placeholder', tPlaceholder);
            }
        }

        // Translate title
        var title = el.getAttribute('title');
        if (title && title.trim()) {
            var tTitle = _translateText(title.trim());
            if (tTitle !== title.trim()) {
                el.setAttribute('title', tTitle);
            }
        }

        // Translate option text
        if (el.tagName === 'OPTION' && el.textContent) {
            var optText = el.textContent.trim();
            if (optText) {
                var tOpt = _translateText(optText);
                if (tOpt !== optText) {
                    el.textContent = tOpt;
                }
            }
        }
    }

    // Dispatch language change event
    try {
        document.dispatchEvent(new CustomEvent('language-changed', { detail: { lang: _currentLang } }));
    } catch (e) {
        // IE fallback
        try {
            var evt = document.createEvent('Event');
            evt.initEvent('language-changed', true, true);
            evt.detail = { lang: _currentLang };
            document.dispatchEvent(evt);
        } catch (e2) {}
    }
}

/**
 * Initialize the language system.
 * Reads stored preference from localStorage and sets the effective language.
 * @returns {string} The resolved language code
 */
function initLanguage() {
    var stored = 'system';
    try {
        var val = localStorage.getItem('mq_language');
        if (val) stored = val;
    } catch (e) {}
    _currentLang = getEffectiveLanguage(stored);
    return _currentLang;
}

/**
 * Change the current language.
 * Stores preference, applies translations, and dispatches event.
 * @param {string} lang - Language code or 'system'
 */
function setLanguage(lang) {
    try {
        localStorage.setItem('mq_language', lang || 'system');
    } catch (e) {}
    _currentLang = getEffectiveLanguage(lang);
    applyLanguage();
}
