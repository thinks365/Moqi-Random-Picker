# 墨启随机点名

<p align="center">
  <img src="https://img.shields.io/badge/version-v6.7.x-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-Apache%202.0-green.svg" alt="License">
  <a href="https://www.electronjs.org/"><img src="https://img.shields.io/badge/electron-33%2B-47848f.svg" alt="Electron"></a>
  <img src="https://img.shields.io/badge/platform-Windows7%20%7C%2010%20%7C%2011-lightgrey.svg" alt="Platform">
</p>


> [!WARNING]
> 本项目几乎是VibeCoding的，因此低质量代码可能无处不在。


## 简介

​	墨启随机点名是一款基于 Electron 开发的现代化、跨平台随机点名与抽签软件。专为课堂互动、活动抽奖、会议点名等场景设计，界面优雅，功能强大，支持高度个性化定制。

## ✨ 核心特性

**🎯 随机点名**  — 支持个人模式与小组模式，随机抽取姓名或整组

**⚡ 快速点名** — 可调时长自动连续点名，适合快速问答

**📋 批量抽取** — 一次性随机抽取多人（2-50 人/组）

**🔁 不重复模式** — 已点过的名字在当前轮次内不再出现，直至本轮全部轮完

**🎰 精确随机** — 通过时间随机化增强抽取随机性，减少连续同人概率

**🪟 悬浮窗** — 置顶透明浮窗，点名结果全屏展示，不遮挡课件，不用退出课件放映。

**🔊 语音播报** — 基于 Web Speech API，自动播报点名结果，支持自定义播报模板变量 

**📷 照片展示** — 点名时同步显示人员照片，支持本地照片文件夹扫描

**⌨️ 全局快捷键** — 最多 5 套快捷键方案，使用翻页笔也能触发点名

**📊 TXT/Excel双模式名单导入导出** — 支持 SheetJS 解析与生成，自动识别分组信息

**🔔 通知系统** — 全局 Toast / 局内通知双模式，可自由切换

**🌐 多语言** — 简体中文 / 繁體中文 / English，自动跟随系统或手动切换

**🔒 密码保护** — 可设置密码保护数据防篡改

**🚀 开机自启** — 支持系统启动时自动运行、悬浮窗自动弹出

**🔄 软件更新** — 程序内可检查版本更新，一键下载安装

**📦 托盘驻留** — 系统托盘常驻，关闭窗口不退出，符合 Windows 使用习惯

**🎵 背景音乐** — 点名过程中播放自定义背景音效

## 📥 安装与运行

<a href="https://github.com/thinks365/Moqi-Random-Picker/releases/latest" style="text-decoration:none;">  

<div style="display: inline-flex; align-items: center; background-color: #24292e; color: white; border-radius: 8px; padding: 10px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
    <svg height="24" viewBox="0 0 16 16" width="24" style="fill: white; margin-right: 12px;">
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82A7.93 7.93 0 0 0 8 4.75c-.68.01-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.16.73.64.84.94.36 1.08 1.81.79 2.57.59 0 .67.01 1.32.01 1.49 0 .21-.15.47-.55.38A8.014 8.014 0 0 1 0 8c0-4.42 3.58-8 8-8z"></path>
    </svg>
    <div style="text-align: left;">
      <div style="font-size: 10px; text-transform: uppercase; opacity: 0.8; line-height: 1;">Download on</div>
      <div style="font-size: 16px; font-weight: 600; line-height: 1.2; margin-top: 2px;">GitHub Releases</div>
    </div>
  </div>

</a>

你可以前往 [Release 页面](https://github.com/thinks365/Moqi-Random-Picker/releases) 下载最新版本的安装包。也可以从[官网](https://rrc.thinks365.com/)下载。 

## 📝 数据导入格式说明

### （1）使用TXT文件导入：

> [!WARNING]
> 注意：TXT文件中，不得存在任何空行（无内容行）。

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

	*(注：未加括号的人员将自动归入“未分组”类别，支持不同人数的小组)*

### （2）使用Excel导入：

按照如下格式（第一行填数据类别（组别和姓名））创建xlsx文件，然后在程序中导入即可：

> [!WARNING]
> 注意：请勿在Excel文件中使用任何合并单元格。

![image-20260620161224027](https://raw.githubusercontent.com/Yangst233/PIC/main/image-20260620161224027.png)

## 🖼️ 照片联动命名规则

当您在设置中关联了照片文件夹后，软件会在该文件夹中寻找与抽取出的姓名**同名的图片文件**。 例如：名单中有“张三”，只要文件夹内存在 `张三.jpg`、`张三.png` 等同名文件，即可在点中张三时自动展示。

## 🤝 参与贡献

欢迎提交 Issue 或发送电子邮件至thinks365@163.com报告 Bug 或提出新功能建议。

## 📄 开源协议

本项目基于 [Apache License 2.0]() 协议开源。 Copyright © 2026 日有所思 (thinks365.com)

## 🖼️ 软件截图

> 注：以下截图展示本软件6.7.1版本及以上的新版界面，早期版本与本截图样式可能不同。

![image-20260620160601095](https://raw.githubusercontent.com/Yangst233/PIC/main/image-20260620160601095.png)

<p style="text-align: center;">图1 主界面和悬浮窗</p>

![image-20260620160648180](https://raw.githubusercontent.com/Yangst233/PIC/main/image-20260620160648180.png)

<p style="text-align: center;">图2 设置菜单</p>
