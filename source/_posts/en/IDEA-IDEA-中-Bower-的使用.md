---
title: '[IDEA] IDEA 中 Bower 的使用'
catalog: true
date: 2019-06-14 01:59:09
subtitle: Bower 的使用
header-img: /img/idea/idea_bg2.png
tags:
- IDEA
categories:
- IDEA
---

在开始之前，请确保您的计算机上有 Node.js 。（Node.js 的安装请在 Bower 安装和使用中查看）

IntelliJ IDEA 与 Bower 软件包管理器（Bower Package Manager）集成，这样您就可以在不离开IDE 的情况下安装、定位、升级和删除包含 HTML、CSS、JavaScript、字体、图像文件等的客户端库和组件。" Bower "页提供了用于管理包的专用 UI 。当然, 您也可以在内置终端的命令行中执行此操作。



## 安装和配置 Bower（请在 Bower 的安装和配置中查看）



## 安装 Bower

打开内置的IntelliJ IDEA终端（Alt+F12），并在命令提示符下键入：

```shell
npm install -g bower
```



## 创建 bower.json

1.打开嵌入式终端（查看|工具窗口|终端或 Alt + F12）。

2.在命令提示符下键入：

```
cd <your project folder>

bower init
```

回答问题以指定以下基本设置：

- 要使用的测试框架。
- 要自动捕获的浏览器。
- 定义测试文件在测试或排除时所涉及的位置的模式。



## 在 WebStorm 中配置 Bower

1.在"设置/首选项"对话框（Ctrl + Alt + S）中，单击"语言和框架"下的" JavaScript  " ，然后单击" Bower "。将打开 Bower 页面。

2.指定要使用的 Node.js 解释器。这可能是一个本地 Node.js 的解释或适用于 Linux 在 Windows子系统上的 Node.js。

3.指定 Bower 包的位置和 bower.json 配置文件。



## 管理 Bower 包

Bower 仅将软件包安装为项目依赖项或开发依赖项，请从 Bower 官方网站了解更多信息。您可以在 Bower 页面或 Terminal 工具窗口中管理 Bower 软件包。



## 在终端中安装软件包

1.打开嵌入式终端（查看|工具窗口|终端，或使用 Alt + F12）。

2.在命令提示符处，键入：

```shell
bower install --save <package_name> # 将程序包安装为项目依赖项
bower install --save-dev <package_name> # 或开发依赖项
```



## 在 Bower 页面上处理包

1.在"设置/首选项"对话框（Ctrl + Alt + S）中，单击"语言和框架"下的" JavaScript " ，然后单击"  Bower "。

2.在打开的 Bower 页面上，Packages 区域显示项目中当前安装的所有 Bower 软件包。

- 要安装软件包，请单击' + '，然后在打开的"可用软件包"对话框中，选择所需的软件包，然后单击"安装软件包"。

- 要升级到软件包的最新版本，请在列表中选择它，然后单击' ^ '。

- 要卸载程序包，请在列表中选择它，然后单击' - '。

  ![1](1.png)
