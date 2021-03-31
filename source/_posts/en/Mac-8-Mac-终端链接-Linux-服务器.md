---
title: '[Mac] 8 Mac 终端链接 Linux 服务器'
catalog: true
date: 2020-01-14 13:50:03
subtitle: Mac 终端链接 Linux 服务器
header-img: /img/mac/mac_bg.jpg
tags:
- Mac
categories:
- Mac
---

## 远程链接

打开 `iTerm2`，通过 `ssh` 命令连接 `linux` 服务器，命令：
```shell
# root 是服务器账户名，@ 后面的是购买的公网 ip 地址
ssh root@127.0.0.1
```

## `ssh` 配置 `config` 快速登录服务器

可先通过 `ssh-keygen -t rsa` 生成密钥。客户端（自己 Mac 的配置）：
```shell
➜  ~ cd ~/.ssh
➜  .ssh ls
config      id_rsa      id_rsa.pub  known_hosts

➜  .ssh cat config
Host ubuntu
HostName 10.211.55.3
Port 22
User vincent
```
配置 `config` （没有的话自己新建一个）

- `Host`：是别名 `ubuntu`
- `HostName` ：为 `IP`
- `Port` ：为端口
- `User`：为用户名

配置好后可直接用 `ssh ubuntu` 这条命令进行登录。
