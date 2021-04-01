---
title: '[Charles] 2 How to Use Charles'
catalog: true
date: 2020-05-15 12:01:04
subtitle: Web debugging proxy application...
header-img: /img/charles/charles_bg.png
tags:
- Charles
categories:
- Charles
---

## 准备工作
- 安装 `JDK`
    
    Charles 由 Java 开发，请先安装好 [JDK](https://www.oracle.com/java/technologies/javase-jdk8-downloads.html)（笔者 JDK 版本为 1.8.0_91）。

- 关闭 VPN/代理
    
    **切记：** 为了正常使用 Charles，请关闭自己的 VPN 或者其他代理设置。


## Charles 客户端配置
安装好 Charles 后，在菜单栏勾选 `Proxy -> macOS Proxy`，macOS 系统 HTTP/HTTPS 代理将会被自动设置为本地代理，默认端口 8888。

![3](3.png)


## 抓 MacOS 应用程序包
### 抓取 HTTP 包
访问 HTTP 数据链接，可以开始抓取 HTTP 包。

![4](4.png)

### 抓取 HTTPS 包
在菜单栏选择 `Help -> SSL Proxying -> Install Charles Root Certificate`，会自动导入 `Charles Proxy CA` 证书并打开 `Keychain Access`，双击新导入的证书弹出证书信息页面，将 `Secure Sockets Layer(SSL)` 设置为 `Always Trust`，关闭页面后弹出密码提示，输入密码更新系统信任设置。

![5](5.png)

在菜单栏选择 `Proxy -> SSL Proxy Settings...`，在 `SSL Proxying` 选项卡中可以添加需要抓包的域名端口。（可以只配置一个 `*`，抓取全部 ）

![6](6.png)

或者直接在 `Structure` 列表中右击需要抓 HTTPS 包的地址，选择 `Enable SSL Proxying`，也可以添加到上述列表中。

![7](7.png)

访问 HTTPS 数据链接，可以开始抓取 HTTPS 包。

![8](8.png)


## 抓 iOS 应用程序包
### 抓取 HTTP 包
在 Mac 上先打开 Charles，确保 iOS 设备和 Mac 处于同一局域网内（可使用 Mac 创建热点分享给 iOS 设备）。设置 iOS HTTP 代理，打开 iOS 设备对应 WIFI 设置，添加代理 IP 地址（ Mac 的局域网地址）和端口号（8888）。

![9](9.png)
    
Mac 局域网地址可以在 Charles 中从菜单栏 `Help -> Local IP Address` 获取。

![10](10.png)

在 iOS 设备上访问数据链接，Charles 弹出 `Access Control` 确认对话框，选择 `Allow`，可以开始抓取 HTTP 包。

![11](11.png)

### 抓取 HTTPS 包
在菜单栏选择 `Help -> SSL Proxying -> Install Charles Root Certificate on a Mobile Device or a Remote Browser`，弹出提示框。

![12](12.png)

根据上述提示，在 iOS 设备上使用 Safari 浏览器访问 http://chls.pro/ssl，Safari 浏览器会自动下载证书并提示安装，根据提示一步一步安装好，证书会被添加到 `设置 -> 通用 -> 描述文件` 中。

![13](13.png)

进入 `设置 -> 通用 -> 关于本机 -> 证书信任设置`，对上一步安装的 Charles 证书启用完全信任。

![14](14.png)

在 iOS 设备上访问 HTTPS 数据链接，可以开始抓取 HTTPS 包。抓包域名端口设置和 macOS 应用程序相同。

![15](15.png)

参考：https://zhuanlan.zhihu.com/p/26182135