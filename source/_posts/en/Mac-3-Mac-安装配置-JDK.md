---
title: '[Mac] 3 Mac 安装配置 JDK'
catalog: true
date: 2020-01-14 11:57:16
subtitle: Mac 安装配置 JDK
header-img: /img/mac/mac_bg.jpg
tags:
- Mac
categories:
- Mac
---

## 常规方法安装

### 下载安装 JDK 1.8.0（`.dmg`）
官网下载：https://www.oracle.com/technetwork/java/javase/downloads/index.html

![1](1.png)

![2](2.png)

下载完成之后双击打开可以看到有一个 `apk` 文件，双击按照步骤安装即可。

### 配置环境变量
安装好的 `JDK` 大概路径为：`/Library/Java/JavaVirtualMachines/jdk1.8.0_191.jdk/Contents/Home` 实际路径以自己为准。使用终端 `cd` 到 `Home` 路径中。使用 `vim` 打开 `JDK` 配置文件 `.bash_profile`：
```shell
sudo vim .bash_profile
```

输入以下内容，路径以自己实际路径为准：
```shell
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_191.jdk/Contents/Home
```

验证 `JDK` 是否安装成功可以在终端输入：
```shell
java -version
```

出现
```shell
java version "1.8.0_191"
Java(TM) SE Runtime Environment (build 1.8.0_191-b12)
Java HotSpot(TM) 64-Bit Server VM (build 25.191-b12, mixed mode)
```

## `Homebrew` 安装 
可以使用 `brew` 安装很多应用，比如 `java`，`idea`，`iterms`，`sublime`等。



- 安装新的 `brew` 仓库源：`brew tap caskroom/versions`

- 安装 `JDK` 的最新版本，`JDK` 内嵌 `JRE`：`brew cask install java`

- 安装 `JDK 8` 的最新版本：`brew cask install java8` 

**注意：使用 `brew install java` 是找不到 java 的安装源的**

搜索 `JDK` 版本信息：`brew cask search java `
如果出现下图中的错误：

![3](3.png)

- 搜索 java `brew search java`  

- 搜索 java 版本信息：`brew cask info java`

![4](4.png)



















