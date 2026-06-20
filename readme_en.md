# Moqi Random Picker

<p align="center">
  <img src="https://img.shields.io/badge/version-v6.7.x-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-Apache%202.0-green.svg" alt="License">
  <a href="https://www.electronjs.org/"><img src="https://img.shields.io/badge/electron-33%2B-47848f.svg" alt="Electron"></a>
  <img src="https://img.shields.io/badge/platform-Windows7%20%7C%2010%20%7C%2011-lightgrey.svg" alt="Platform">
</p>
选择本文档的语言/Language：[简体中文](readme.md)/[English](readme_en.md)

> [!TIP]
> This README was translated using AI tools.

> [!WARNING]
> This project is almost entirely VibeCoded, so low-quality code may be everywhere.


## Introduction

Moqi Random Picker is a modern, cross-platform random name picker and lottery app built with Electron. Designed for classroom interaction, event drawings, meeting roll-calls, and more, it features an elegant UI, powerful functionality, and extensive customization options.

## ✨ Core Features

**🎯 Random Picker** — Supports individual mode and group mode; randomly selects names or entire groups

**⚡ Quick Pick** — Configurable-duration auto-continuous picking, ideal for rapid Q&A sessions

**📋 Batch Draw** — Pick multiple people at once (2–50 people/groups)

**🔁 No-Repeat Mode** — Already-picked names won't appear again in the current round until everyone has been called

**🎰 Precise Randomization** — Time-based randomization enhances drawing entropy and reduces consecutive repeats

**🪟 Float Window** — Always-on-top transparent overlay displays picking results full-screen without blocking your slides; no need to exit presentation mode

**🔊 Text-to-Speech** — Built on the Web Speech API, automatically announces picking results with customizable speech templates and variables

**📷 Photo Display** — Shows person photos alongside picked names; supports local photo folder scanning

**⌨️ Global Hotkeys** — Up to 5 hotkey schemes; trigger picks even with a presentation remote

**📊 TXT/Excel Dual Import & Export** — SheetJS-powered parsing and generation with automatic group detection

**🔔 Notification System** — Global toast and inline notification modes, freely switchable

**🌐 Multi-Language** — Simplified Chinese / Traditional Chinese / English; auto-follows system locale or manual switching

**🔒 Password Protection** — Set a password to protect data from tampering

**🚀 Auto-Start** — Optionally launch on system startup and auto-show the float window

**🔄 Software Updates** — In-app version check with one-click download and install

**📦 System Tray** — Resides in the system tray; closing the window does not quit the app, following Windows desktop conventions

**🎵 Background Music** — Play custom background audio during the picking process

## 📥 Installation

Visit the [Releases page](https://github.com/thinks365/Moqi-Random-Picker/releases) to download the latest installer. You can also download it from the [official website](https://rrc.thinks365.com/).

## 📝 Data Import Formats

### (1) TXT File Import:

> [!WARNING]
> Note: TXT files must NOT contain any empty lines.

**1. Standard Name Mode (one per line):**

```
John
Jane
Bob
```

**2. Auto-Group Mode (Name[Group]):** Append a group tag in brackets after each name, and the app will automatically parse and create group data!

```
John[Group 1]
Jane[Group 1]
Bob[Group 2]
Alice[Group 2]
Tom[Group 3]
Jerry[Group 3]
```

*(Note: Names without brackets will automatically be placed in an "Ungrouped" category. Groups can have different numbers of members.)*

### (2) Excel Import:

Create an `.xlsx` file in the following format (the first row contains data categories — Group and Name), then import it in the app:

> [!WARNING]
> Note: Do NOT use any merged cells in the Excel file.

![image-20260620161224027](https://raw.githubusercontent.com/Yangst233/PIC/main/image-20260620161224027.png)

## 🖼️ Photo Matching Rules

After linking a photo folder in settings, the app will look for image files in that folder whose names match the picked name. For example: if "John" is in your list, placing `John.jpg`, `John.png`, or any identically-named file in the folder will automatically display the photo when John is picked.

## 🤝 Contributing

Issues and feature suggestions are welcome — submit an Issue on GitHub or email thinks365@163.com.

## 📄 License

This project is open-sourced under the [Apache License 2.0]() license. Copyright © 2026 日有所思 (thinks365.com)

## 📄 What's New in v6.7

1. UI improvements: Main window now supports Mica and Acrylic effects (see screenshots). Windows accent color support added.
2. UI improvements: Redesigned settings menu.
3. UI improvements: Float window now has a (pseudo) Mica material effect. Can simulate the Mica look.
4. New: TTS voice announcement — automatically reads out picking results.
5. New: Excel file import.
6. New: Picking result (history) export.
7. Fix: No-repeat mode not working correctly in certain modes.
8. Improvement: Presentation remote menu and functionality redesign.
9. Improvement: Password functionality enhancements.

## 🖼️ Screenshots

> Note: The screenshots below show the redesigned UI from v6.7.1 and above. Earlier versions may look different.

![image-20260620160601095](https://raw.githubusercontent.com/Yangst233/PIC/main/image-20260620160601095.png)

<p style="text-align: center;">Figure 1 – Main window and float window (Mica effect off)</p>

![image-20260620160648180](https://raw.githubusercontent.com/Yangst233/PIC/main/image-20260620160648180.png)

<p style="text-align: center;">Figure 2 – Settings menu</p>
