---
title: '[IDEA] JRebel & XRebel 插件安装和使用'
catalog: true
date: 2020-12-30 18:51:57
subtitle: JRebel is a productivity tool that allows developers to reload code changes instantly... XRebel is a performance tool for Java development which gives developers real time performance insights to help them understand and resolve potential issues faster and earlier, during the development phase...
header-img: /img/idea/idea_bg2.png
tags: 
- IDEA
categories:
- IDEA
---

## JRebel 简介
JRebel 是一套 JavaEE 开发工具。Jrebel 可快速实现热部署，节省了大量重启时间，提高了个人开发效率。JRebel 是一款 JAVA 虚拟机插件，它使得 JAVA 程序员能在不进行重部署的情况下，即时看到代码的改变对一个应用程序带来的影响。JRebel 使你能即时分别看到代码、类和资源的变化，你可以一个个地上传而不是一次性全部部署。当程序员在开发环境中对任何一个类或者资源作出修改的时候，这个变化会直接反应在部署好的应用程序上，从而跳过了构建和部署的过程，可以省去大量的部署用的时间。

JRebel 是一款 JVM 插件，它使得 Java 代码修改后不用重启系统，立即生效。IDEA 上原生是不支持热部署的，一般更新了 Java 文件后要手动重启 Tomcat 服务器，才能生效，浪费时间浪费生命。目前对于 IDEA 热部署最好的解决方案就是安装 JRebel 插件。

## JRebel 安装
### 安装插件

![1](1.png)

### 在线生成 GUID
网址：[在线GUID地址](https://www.guidgen.com/)

![2](2.png)

如果失效刷新 GUID 替换就可以！连接到在线授权服务器：https://jrebel.qekang.com/{GUID}

### 激活
打开 JRebel & XRebel 如下所示面板，填写上面的授权地址。

![3](3.png)

![4](4.png)

### 设置离线模式

![5](5.png)

![6](6.png)

### 设置自动编译
要想实现热部署，还需要对 IDEA 按如下进行设置。
- 由于 JRebel 是实时监控 `.class` 文件的变化来实现热部署的，所以在 IDEA 环境下需要打开自动变编译功能才能实现随时修改，随时生效。
    ![7](7.png)

- 设置 `compiler.automake.allow.when.app.running`

    - Windows 快捷键：`ctrl + shift + A`，搜索：`Registry` 或者快捷键：`Ctrl + Shift + Alt + /`，选择 `Registry`
    - Mac 快捷键：`shift + option + command + /`

    ![8](8.png)

## JRebel 使用

运行项目时要点击图中红框中的按钮，即可运行。

 ![9](9.png)
 
##  XRebel 简介
XRebel 是用于 Java 开发的性能工具，可为开发人员提供实时性能见解，以帮助他们在开发阶段更快，更早地理解和解决潜在问题。XRebel 可以做传统的分析工具无法完成的工作。它使开发人员可以从头到尾跟踪其代码的影响-即使是在分布式应用程序中。 结合实时 Java 性能指标，XRebel 成为任何 Java 开发人员必备的工具。借助 XRebel，开发人员可以创建性能更好的应用程序，从而带来更好的最终用户体验。

## 启动
如下图：

![10](10.png)

- 如果你是直接在 `IDEA Plugins Marketplace` 中下载的那无需多余配置。

- 如果你是第三方下载的话，在启动前则需要配置 `VM options`：`-javaagent:[/path/to/]xrebel.jar` 启动参数。`[/path/to/]` 为你 XRebel 插件实际放置路径。

    ![11](11.png)
    
### 激活

项目启动后，在项目根 url 后面输入 `/xrebel`，会弹出 `XRebel activation`框。如激活 JRebel 插件一样，填写上面获取授权地址。

![12](12.png)

![13](13.png)

### 设置离线模式

![14](14.png)

### 功能简介

- 开始

    ![15](15.png)

- 查看 I/O 

    ![16](16.png)

- 日志查看

    ![17](17.png)
    
- 异常查看

    ![18](18.png)

- 其他设置

    ![19](19.png)
