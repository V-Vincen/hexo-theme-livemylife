---
title: '[Mac] 7 使用 Mac 自带服务器实现本地文件访问'
catalog: true
date: 2020-01-14 13:49:40
subtitle: 使用 Mac 自带服务器实现本地
header-img: /img/mac/mac_bg.jpg
tags:
- Mac
categories:
- Mac
---

# 开启服务
Mac 本身是包含 `apache` 服务器的，我们只要打开就可以使用了，根本不用去部署什么 `tomcat`。

打开终端，输入命令：
```
sudo apachectl start
```

输入本机开机密码，密码输入完成之后在本地浏览器中输入 `127.0.0.1` 或者 `localhost`，出现 `it works!` 表明服务器已经启动了，就是这么简单。如果失败可以重启 `sudo apachectl restart`。

进入文件夹 `/Library/WebServer`，这个文件夹就是本地服务器的文件夹，然后你就可以把你自己的文件放入到其中的 `Documents` 文件夹中,他的路径对应的就是 `127.0.0.1/你的文件名`。例如我在 `Documents` 中放了个文件夹 `TestDownload`，其中有个压缩包叫测试下载 `.zip`，那么我就可以在浏览器中直接使用 `127.0.0.1/TestDownload/测试下载.zip` 访问。注意这种文件是直接就开始下载的，如果是图片会直接打开。

## 相关命令
```shell
# 重启 apache
sudo /usr/sbin/apachectl restart

# 关闭 apache
sudo /usr/sbin/apachectl stop

# 开启 apache
sudo /usr/sbin/apachectl start
```

