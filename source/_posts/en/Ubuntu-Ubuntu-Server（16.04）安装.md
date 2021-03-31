---
title: '[Ubuntu] Ubuntu Server（16.04）安装'
catalog: true
date: 2019-07-14 02:57:23
subtitle: Ubuntu is the modern, open source operating system on Linux for the enterprise server, desktop, cloud, and IoT...
header-img: /img/linux/ubuntu_bg.jpg
tags:
- Ubuntu
categories:
- Ubuntu
---

## 下载

官网下载（中文）：http://www.ubuntu.org.cn/download

官网下载：https://ubuntu.com/download


## 安装

进入系统安装的第一个界面，开始系统的安装操作。每一步的操作，左下角都会提示操作方式。

### 选择系统语言 - `English`

![1](1.png)



### 选择操作 - `Install Ubuntu Server`

![2](2.png)



### 选择安装过程和系统的默认语言 - `English`

![3](3.png)



### 选择区域 - `other`

![4](4.png)



### 选择亚洲 - `Asia`

![5](5.png)



### 选择国家 - `China`

![6](6.png)



### 选择字符集编码 - `United States`

![7](7.png)



### 是否扫描和配置键盘，选择否 - `No`

![8](8.png)



### 选择键盘类型 - `English (US)`

![9](9.png)



### 选择键盘布局 - `English (US)`

![10](10.png)



### 设置主机名称

自行设置，这里我设置为 `Ubuntu` - `Continue`

![12](12.png)



### 设置用户全名

自行设置，这里为 `yourname` - `Continue`

![13](13.png)



### 设置登录账号

自行设置，这里为 `yourname` - `Continue`

![14](14.png)

 

### 设置登录密码

自行设置，空格选择 `Show Password in Clear` 可以显示密码 - `Continue`

![15](15.png)



### 重复上一步设置的登录密码 - `Continue`

![16](16.png)



### 你设置的是弱密码 - `Yes`

![17](17.png)



### 是否加密 `home` 文件夹，选择否 - `No`

![17-1](17-1.png)



### 选择分区方式

分区向导-使用整个磁盘 - `Guided - use entire disk and set up LVM`

![18](18.png)



### 选择要分区的磁盘

![19](19.png)



### 是否将变更写入磁盘，选择是 - `Yes`

![20](20.png)



![20-1](20-1.png)



### 磁盘分区选择 - `Yes`

![21](21.png)



### 是否选择代理服务器 - `Continue`

![22](22.png)



### 选择升级方式 

一定要选择 - `No automatic updates`

![23](23.png)



### 选择要安装的软件

只选择 - `OpenSSH Server`

![24](24.png)



### 是否安装 `GRUB` 引导程序，选择是 - `Yes`

![25](25.png)



### 完成安装，选择下一步 - `Continue`

![26](26.png)



### 系统安装完会自动启动主机

输入设置好的登录账户和密码就可以开始使用了

![27](27.png)