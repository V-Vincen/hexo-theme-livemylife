---
title: '[Docker Compose] 2 Docker Compose 安装与卸载'
catalog: true
date: 2019-08-22 03:35:28
subtitle: Docker Compose 安装与卸载
header-img: /img/dockercompose/dockercompose_bg.png
tags:
- Docker Compose
categories:
- Docker Compose
---

`Compose` 支持 Linux、macOS、Windows 10 三大平台。

`Compose` 可以通过 Python 的包管理工具 `pip` 进行安装，也可以直接下载编译好的二进制文件使用，甚至能够直接在 Docker 容器中运行。

前两种方式是传统方式，适合本地环境下安装使用；最后一种方式则不破坏系统环境，更适合云计算场景。

`Docker for Mac` 、`Docker for Windows` 自带 `docker-compose` 二进制文件，安装 Docker 之后可以直接使用。
```sh
root@ubuntu:~# docker-compose --version

docker-compose version 1.24.1, build 4667896b
```

## 二进制包
在 Linux 上的也安装十分简单，从 [官方 GitHub Release](https://github.com/docker/compose/releases) 处直接下载编译好的二进制文件即可。

例如，在 Linux 64 位系统上直接下载对应的二进制包。
```sh
curl -L https://github.com/docker/compose/releases/download/1.24.1/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

## 卸载
如果是二进制包方式安装的，删除二进制文件即可。
```sh
$ sudo rm /usr/local/bin/docker-compose
```