---
title: '[Ubuntu] 1 Ubuntu 软件包管理'
catalog: true
date: 2019-07-14 04:44:37
subtitle: Ubuntu 软件包管理
header-img: /img/linux/ubuntu_bg.jpg
tags:
- Ubuntu
categories:
- Ubuntu
---

## 概述
APT（Advanced Packaging Tool）是 Debian/Ubuntu 类 Linux 系统中的软件包管理程序, 使用它可以找到想要的软件包, 而且安装、卸载、更新都很简便；也可以用来对 Ubuntu 进行升级; APT 的源文件为 `/etc/apt/` 目录下的 `sources.list` 文件。

## 修改数据源
由于国内的网络环境问题，我们需要将 Ubuntu 的数据源修改为国内数据源，操作步骤如下：

### 查看系统版本
```sh
    lsb_release -a
```
输出结果为
```sh
    No LSB modules are available.
    Distributor ID:	Ubuntu
    Description:	Ubuntu 16.04 LTS
    Release:	16.04
    Codename:	xenial
```
**注意**： Codename 为 `xenial`，该名称为我们 Ubuntu 系统的名称，修改数据源需要用到该名称

### 编辑数据源
```sh
    vi /etc/apt/sources.list
```
删除全部内容并修改为
```sh
    deb http://mirrors.aliyun.com/ubuntu/ xenial main restricted universe multiverse
    deb http://mirrors.aliyun.com/ubuntu/ xenial-security main restricted universe multiverse
    deb http://mirrors.aliyun.com/ubuntu/ xenial-updates main restricted universe multiverse
    deb http://mirrors.aliyun.com/ubuntu/ xenial-backports main restricted universe multiverse
```

### 更新数据源
```sh
    apt-get update
```

## 常用 APT 命令
### 安装软件包
```sh
    apt-get install packagename
```

### 删除软件包
```sh
    apt-get remove packagename
```

### 更新软件包列表
```sh
    apt-get update
```

### 升级有可用更新的系统（慎用）
```sh
    apt-get upgrade
```

## 其它 APT 命令
### 搜索
```sh
    apt-cache search package
```

### 获取包信息
```sh
    apt-cache show package
```

### 删除包及配置文件
```sh
    apt-get remove package --purge
```

### 了解使用依赖
```sh
    apt-cache depends package
```

### 查看被哪些包依赖
```sh
    apt-cache rdepends package
```

### 安装相关的编译环境
```sh
    apt-get build-dep package
```

### 下载源代码
```sh
    apt-get source package
```

### 清理无用的包
```sh
    apt-get clean && apt-get autoclean
```

### 检查是否有损坏的依赖
```sh
    apt-get check
```