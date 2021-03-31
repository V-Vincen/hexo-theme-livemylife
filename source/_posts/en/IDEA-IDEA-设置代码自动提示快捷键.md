---
title: '[IDEA] IDEA 设置代码自动提示快捷键'
catalog: true
date: 2019-06-13 09:24:24
subtitle: IDEA 设置（Alt + /）
header-img: /img/idea/idea_bg2.png
tags:
- IDEA
categories:
- IDEA
---

前言：使用 eclipse 都习惯使用快捷键 ALT + /  来代码自动提示，后来使用 IntelliJ Idea 这个快捷键并不管用，十分不便，这里记录如何使更改 idea 代码自动提示快捷键。

## 哪个是代码自动提示快捷键
File –》Settings –》KeyMa（快捷键ctrl+alt+s）进入快捷键设置界面。 
idea 中默认的代码自动提示快捷键是 Basic Ctrl + 空格（可以再搜索框中输入 basic 快速查找），这个和安装的中文输入法切换快捷键冲突，所以需要修改。 
![1](1.png)



## 移除占用 Alt + 斜杠的快捷键
需要将Basic的快捷键修改为 Alt + /，但 Alt + / 被 Cyclic Expand Word 占用，所以先修改 Cyclic Expand Word 的快捷键，右键 Remove Alt + 斜杠。 
![2](2.png)



## 设置 Basic 快捷键为 Alt + 斜杠
右键 Add Keyboard Shutcut，然后在键盘上按下 Alt + 空格，点击 ok 即完成修改。 
![3](3.png)