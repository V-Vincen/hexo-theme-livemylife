---
title: '[Mac] Mac 进程、端口、上传下载、压缩等命令'
catalog: true
date: 2020-03-24 01:22:01
subtitle: Mac 进程、端口、上传下载等命令
header-img: /img/mac/mac_bg.jpg
tags:
- Mac
categories:
- Mac
---

## 进程命令
### Mac 查看进程号
```shell
ps -ef | grep 软件或者进程号
ps aux | grep 软件或者进程号
```

### 查看进程监听的端口
```shell
sudo lsof -nP -p 进程号 | grep LISTEN
sudo lsof -nP | grep LISTEN | grep 进程号
```
或者
```shell
netstat -ltnp | grep 进程号
```

## 端口命令
### Mac 查看端口号
```shell
sudo lsof -i:端口号
```
注：Windows 查看端口号
```cmd
netstat -an | grep 端口号
```

### 查看监听端口的进程
```shell
sudo lsof -nP | grep LISTEN | grep 端口号
```
- -n 表示不显示主机名
- -P 表示不显示端口俗称
- 不加 sudo 只能查看以当前用户运行的程序


## 上传下载
先来回顾 ssh 连接远程服务器
```shell
ssh username@192.168.100.100
```

### 从服务器上下载文件
```shell
scp username@servername:/remote_path/filename /loacal_path（如：/Users/mac/Desktop）
```

### 上传本地文件到服务器
```shell
scp /loacal_path/filename username@servername:/remote_path
```

### 从服务器下载整个目录
```shell
scp -r username@servername:/remote_dir /local_dir（如：/Users/mac/Desktop）
```

### 上传目录到服务器
```shell
scp -r local_dir username@servername:/remote_dir
```

### 压缩（加密）
```shell
zip -e ~/wantPath/zipName.zip /filePath/fileName
```
输入上述命令回车，出现 `enter password`，输入你想设置的加密密码，然后敲回车，要求输入验证密码，再输入一遍刚刚设置的密码，敲回车即可。（密码为你解压缩时的密码）

`~/filePath/zipName.zip`：压缩后文件存放的路径及名称。

`/filePath/fileName`：想要压缩的文件及路径。
