---
title: '[Mac] 4 Mac 安装配置 Maven'
catalog: true
date: 2020-01-14 12:01:45
subtitle: Mac 安装配置 Maven
header-img: /img/mac/mac_bg.jpg
tags:
- Mac
categories:
- Mac
---

## 常规方法安装

### 下载安装包（`.tar.gz`）
官网下载：https://maven.apache.org/download.cgi

![1](1.png)

解压：`tar -zxvf apache-maven-3.5.0-bin.tar.gz`


### 配置 `Maven` 环境变量
打开终端 ，输入 `vim ~/.bash_profile`

配置 `Maven` 的环境变量：
```shell
export M2_HOME="/Users/during/Documents/Software/apache-maven-3.5.0"
export PATH="$M2_HOME/bin:$PATH"
```

通过 `echo $JAVA_HOME` 查看是否配置过 `JAVA_HOME` ，如果 `JAVA_HOME` 没有配置，还需要导入 `JAVA_HOME` 环境变量：
```shell
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_45.jdk/Contents/Home
```

输入 `source ~/.bash_profile` 使环境变量生效

输入 `mvn -v` 查看 `Maven` 否安装成功

### 配置 `Maven` 仓库
在 `apache-maven-3.6.2/conf` 下找到 `settings.xml`，设置 `<localRepository>/Users/xxx/maven_repo</localRepository>`

## `Homebrew` 安装
### 安装命令
```shell
brew search maven
brew info maven
brew install maven
```

### 验证
验证 `Maven` 是否安装成功，输入 `mvn -v` 

### 配置 `Maven` 仓库
在路径 `/usr/local/Cellar/maven/3.5.0/libexec/conf` 下找到 `setting.xml`，设置 `<localRepository>/Users/xxx/maven_repo</localRepository>`



