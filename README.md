# 墨启随机点名

![Version](https://img.shields.io/badge/version-v6.2.1-blue.svg) ![License](https://img.shields.io/badge/license-Apache%202.0-green.svg) ![Platform](https://img.shields.io/badge/platform-Windows7%20%7C%2010%20%7C%2011-lightgrey.svg)


> [!WARNING]
> 本项目是在人工智能的辅助下完成的，因此低质量代码可能无处不在。


## 简介

​	墨启随机点名是一款基于 Electron 开发的现代化、跨平台随机点名与抽签软件。专为课堂互动、活动抽奖、会议点名等场景设计，界面优雅，功能强大，支持高度个性化定制。

## ✨ 核心特性

* **多种点名模式**
  * **常规点名**：带动画效果的单人滚动抽取。
  * **快速点名**：自定义秒数（0.1s - 5s），实现自动点名。
  * **批量抽取**：一次性抽出多人/多组，大屏展示一目了然。
  * **悬浮窗点名**：使用悬浮窗以实现无需退出PPT放映/白板书写即可点名，经过实测广泛支持Microsoft PowerPoint、WPS Office、希沃白板5、希沃轻白板、东方中原白板软件等使用场景。
* **双重抽取维度**
  * 支持一键切换 **“点姓名”** 与 **“点小组”** 模式，满足多样化教学与活动需求。
* **强大的数据与名单管理**
  * **多名单无缝切换**：导入一次即可保存至本地名单库，随时调取`（例如：三年二班、物理社团）`，对于走班制环境适配良好。
  * **智能分组解析**：TXT 导入支持自动识别分组格式。
  * **导入数据简单**：仅需将姓名一行一个写入TXT文件，通过程序即可导入。
* **沉浸式多媒体体验**
  * **照片联动**：绑定本地照片文件夹，点中姓名自动匹配展示照片。
  * **背景音乐**：支持自定义点名 BGM。
  * **自定义UI**：支持修改标题文字、颜色、全局背景图片（包含模糊、平铺等模式），内置“简白”与“云镜”双主题。
* **桌面悬浮窗**
  * 使用悬浮窗以实现无需退出PPT放映/白板书写即可点名，经过实测广泛支持Microsoft PowerPoint、WPS Office、希沃白板5、希沃轻白板、东方中原白板软件等使用场景。
  * **客制化**：支持自定义悬浮窗背景图、按钮颜色、文字颜色、透明度，甚至姓名文字的阴影效果。
* **安全与防误触机制**
  * 内置**密码保护系统**，可对“设置菜单”、“数据管理”、“重置软件”单独加锁，防止他人在公共电脑上篡改数据。
* **更多贴心功能**
  * **不重复模式**：确保在一轮抽取中不出现重复人员。
  * **历史记录**：自动保存最近 50 条抽取记录，随时调取。
  * **支持开机自启**（或仅悬浮窗自启），无需手动点击，上课时即点即用。
  * **自带软件更新**：可在软件内检测更新，随时随地获取最新功能和Bug修复。

## 📥 安装与运行

​	你可以前往 [Release 页面](https://github.com/thinks365/Moqi-Random-Picker/releases) 下载最新版本的安装包。也可以从[官网](https://rrc.thinks365.com/)下载。 

## 📝 数据导入格式说明

​	软件支持通过 `.txt` 纯文本文件快速导入名单。

**1. 常规姓名模式（一行一个）：**

```
张三
李四
王五
```

**2. 自动分组模式（姓名[组名]）：** 支持在姓名后紧跟中括号标记分组，软件会自动解析并建立小组数据！

```
张三[第一组]
李四[第一组]
王五[第二组]
赵六[第二组]
孙七[第三组]
蔡八[第三组]
```

​	*(注：未加括号的人员将自动归入“未分组”类别，支持不同人数的小组)*

## 🖼️ 照片联动命名规则

​	当您在设置中关联了照片文件夹后，软件会在该文件夹中寻找与抽取出的姓名**同名的图片文件**。 例如：名单中有“张三”，只要文件夹内存在 `张三.jpg`、`张三.png` 等同名文件，即可在点中张三时自动展示。

## 🤝 参与贡献

​	欢迎提交 Issue 报告 Bug 或提出新功能建议。

## 📄 开源协议

​	本项目基于 [Apache License 2.0]() 协议开源。 Copyright © 2026 日有所思 (thinks365.com)

## 🖼️ 软件截图

![image-20260218165559972](https://raw.githubusercontent.com/Yangst233/PIC/main/image-20260218165559972.png)

<p style="text-align:center">主界面</p>

![image-20260218165710736](https://raw.githubusercontent.com/Yangst233/PIC/main/image-20260218165710736.png)

<p style="text-align:center">设置菜单</p>

![image-20260218165751145](https://raw.githubusercontent.com/Yangst233/PIC/main/image-20260218165751145.png)

<p style="text-align:center">开始点名|快速点名</p>

![image-20260218165821724](https://raw.githubusercontent.com/Yangst233/PIC/main/image-20260218165821724.png)

<p style="text-align:center">批量点名</p>

![image-20260218165930143](https://raw.githubusercontent.com/Yangst233/PIC/main/image-20260218165930143.png)

<p style="text-align:center">小组点名</p>

![image-20260218170157693](https://raw.githubusercontent.com/Yangst233/PIC/main/image-20260218170157693.png)

<p style="text-align:center">云镜主题</p>
