---
title: '[Charles] 1 Charles'
catalog: true
date: 2020-05-15 11:17:06
subtitle: Web debugging proxy application...
header-img: /img/charles/charles_bg.png
tags:
- Charles
categories:
- Charles
---


Charles 是 HTTP 代理、HTTP 监视器、反向代理，使开发人员可以查看其计算机与 Internet 之间的所有 HTTP 和 SSL、HTTPS通信。这包括请求，响应和 HTTP 标头（其中包含 cookie 和缓存信息）。说的再简单点，Charles 就是一个网络抓包工具，是使用 Java 开发的，所以支持 Windows、MacOS 和 Linux 平台。当然Charles 也是 MacOS 上的最常用的抓包工具，今天来总结一下 Charles 的最新使用方法，主要是抓 HTTPS 包的使用方法。

## How to install Charles

Charles 官网下载地址：https://www.charlesproxy.com/

Charles 是收费的，官方版本只有30天的试用期。那如何对其进行破解呢？

### 替换 `charles.jar`
因为 Charles 是 Java 编写的，所以破解难度还是比较低的，我们只需要找到对应的 jar 文件，这个 jar 对应的是一个 `charles.jar`，然后反编译 `charles.jar` 找到需要破解的位置，使用 javassist 修改对应字节码，得到一个新的 `charles.jar`，使用新的替换之前老的 `charles.jar` 就可以了。所以说到底，破解 Charles 其实就是破解 `charles.jar`，使用破解的 `charles.jar` 去替换原始的 `charles.jar` 就可以了。关于如何破解 `charles.jar` 这里就不展开了，因为网上已经有人帮我们破解好了，我只需要拿到破解的 `charles.jar` 去替换我们 Charles 对应路径下的 `charles.jar` 就行。

- 进入官方网站，下载并安装新版的 [Charles](https://www.charlesproxy.com/) 

- 替换 `charles.jar`
    - 进入破解网站：https://www.zzzmode.com/mytools/charles/
    - 输入 `RegisterName` （此名称随意，用于显示 `Registered to xxx`）
    - 选择你在官网中安装的 Charles 的版本
    - 点击生成，就会得到一个破解的 `charles.jar`，点击下载就可以下载一个破解好的 `charles.jar`
    
    ![1](1.png)

- 替换本地 `charles.jar` 文件
    - 进入 Charles 的安装目录，找到对应的 `charles.jar`，将其替换成破解后的 `charles.jar`
    - 安装目录：
        - macOS -> `/Applications/Charles.app/Contents/Java/charles.jar`
        - Windows -> C:\Program Files\Charles\lib\charles.jar
        - Ubuntu -> /usr/lib/Charles-proxy/charles.jar

### 激活码
当然如果觉得上面的破解比较麻烦，那也没关系这里也有懒人破解方法。Neo Peng's Blog：https://zhile.io/2017/07/07/charles-proxy-usage-and-license.html 大神为我们提供了免费的激活码：

- Registered Name: https://zhile.io

- License Key: 48891cf209c6d32bf4

打开 Charles，`help -> Registered to`，输入账号和 key 提交破解成功就可以正常使用啦！

![2](2.png)
    



