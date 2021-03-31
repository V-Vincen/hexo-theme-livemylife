---
title: '[Git] 4 TortoiseGit 简介和安装'
catalog: true
date: 2019-08-23 01:35:12
subtitle: TortoiseGit 简介和安装
header-img: /img/git/git_bg.png
tags:
- Git
categories:
- Git
---

## 概述
TortoiseGit，中文名海龟 Git，其作用是简化 Git 操作。海龟 Git 只支持 Windows 系统，有一个前辈海龟 SVN，TortoiseSVN 和 TortoiseGit 都是非常优秀的开源的版本库客户端。 分为 32 位版与 64 位版。并且支持各种语言，包括简体中文。

## 安装 TortoiseGit
### 下载
下载地址：https://tortoisegit.org/download/

![1](1.png)

### 安装
我们需要先安装程序包，然后安装语言包(LanguagePack)。因为TortoiseGit 只是一个程序壳，必须依赖一个 Git Core，也就是上一节我们安装的 Git. 所以安装前请确定已完成上一节的操作。 下面以64位版本为演示（64，32位除文件名不一样，其他的操作都一致）。

双击安装程序
![2](2.png)

下一步，进入版权信息界面，直接点击下一步（Next）即可
![3](3.png)

下一步，选择SSH客户端。可以选择 TortoiseGitPlink（位于 TortoiseGit 安装目录 /bin 下）, 也可以选择 Git 默认的 SSH 客户端,位于 Git 安装目录 /bin/ssh.exe（如果配置了 Path，那直接是 ssh.exe）
![4](4.png)

接着是选择安装目录，可以保持默认，或者安装到开发环境目录下，安装的程序组件保持默认即可
![5](5.png)

下一步到确认安装界面，点击 Install 按钮安装即可，如下图所示
![6](6.png)

安装完成，点击 Finish 按钮即可
![7](7.png)

### 安装语言包
双击打开语言包安装程序
![8](8.png)

点击下一步（Alt+N），语言包会自动安装完成
![9](9.png)

### 配置
在空白处点击鼠标右键，选择 --> TortoiseGit --> Settings，然后就可以看到配置界面
![10](10.png)

选中 General，在右边的 Language 中选择中文。 不勾选自动升级的复选框，可能还需要指定 Git.exe 文件的路径

再次点击鼠标右键，可以看到弹出菜单中已经变成中文。
![11](11.png)