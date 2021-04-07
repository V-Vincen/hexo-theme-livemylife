---
title: '[Mac] 10 Mac 安装配置 Nginx'
catalog: true
date: 2020-03-23 02:15:06
subtitle: Mac 安装配置 Nginx
header-img: /img/mac/mac_bg.jpg
tags:
- Mac
categories:
- Mac
---

## 用 Homebrew 来安装 Nginx

### 安装
```shell
brew install nginx
```

### 查看 nginx 版本
```shell
nginx -v
```

### 启动 nginx
```shell
nginx
```
也可以使用下面的命令启动，但是配置文件 `nginx.conf` 修改后用这个命令执行不生效，故不建议使用：
```shell
brew services start nginx
```
![1](1.png)

### 查看 nginx 是否启动成功
在浏览器中访问：在浏览器中访问：[http://localhost:8080](https://v_vincen.gitee.io/404.html)，如果出现如下界面，则说明启动成功。，如果出现如下界面，则说明启动成功。

![2](2.png)

**注**：端口号是在配置文件 `nginx.conf` 里面配置的，默认端口是 8080 ，配置文件的位置 `/usr/local/etc/nginx`。


### 关闭 nginx
```shell
nginx -s stop
```
也可以使用下面的命令启动，但是配置文件 `nginx.conf` 修改后用这个命令执行不生效，故不建议使用：
```shell
brew services stop nginx
```

### 重新加载 nginx
```shell
nginx -s reload
```

### 常用的指令有
```shell
nginx -s reload 重新加载配置
nginx -s reopen 重启
nginx -s stop 停止
nginx -s quit 退出
nginx -V 查看版本，以及配置文件地址
nginx -v 查看版本
nginx -c filename 指定配置文件
nginx -h 帮助
```

