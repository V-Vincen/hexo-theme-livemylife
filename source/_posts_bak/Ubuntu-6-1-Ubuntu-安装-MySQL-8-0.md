---
title: '[Ubuntu] 6.1 Ubuntu 安装 MySQL 8.0'
catalog: true
date: 2019-07-14 05:22:38
subtitle: Ubuntu 安装 MySQL 8.0
header-img: /img/linux/ubuntu_bg.jpg
tags:
- Ubuntu
categories:
- Ubuntu
---

## 删除历史版本 MySQL 
`sudo apt-get remove mysql-*`

然后清理残留的数据

`dpkg -l |grep ^rc|awk '{print $2}' |sudo xargs dpkg -P`

它会跳出一个对话框，你选择 yes 就好了

## 安装 MySQL 8.0

### [下载deb包](https://dev.mysql.com/downloads/repo/apt/)

![1](1.png)

### 运行命令

```sh
sudo dpkg -i mysql-apt-config_0.*.****_all.deb
```

1. 安装执行，然后会出现一个紫色框界面。
2. 它有四个选项：选择第一个，enter 确定。
3. 然后又会出现一个紫色框界面，选择 8.0 那个，enter 确定。
4. 会回到第一个紫色框，此时按上下键选择 ok，enter 确定。

### 执行

```sh
sudo apt update

sudo apt-get install mysql-server
```

1. 安装过程中会询问，都选择 yes 。
2. 安装最后会出现紫色框，让你输入密码，输入完成之后，会再让你输入一遍，确定。
3. 输入完成之后，会出现紫色框问你选择密码的加密方式：因为第一种加密方式Ubuntu不支持，所以我们选择第二个加密方式（密码加密方式选择 5.x）。enter确定。

### 启动 MySQL
```sh
service mysql start
```

### 进入 MySQL

```sh
mysql -uroot -p
```

### 允许远程登录

```mysql
use mysql;
update user set host = '%' where user ='root';
flush privileges;
```

## 遇到的问题

解决：`Could not get lock /var/cache/apt/archives/lock`

在 `apt-get update` 的时候，遇到：

```sh
E: Could not get lock /var/cache/

apt/archives/lock - open (11 Resource temporarily unavailable)
E: Unable to lock the download directory
```

解决办法如下：

```sh
sudo rm -rf /var/cache/apt/archives/lock
sudo apt-get update
```

然后 `apt-get` 就恢复正常了。



