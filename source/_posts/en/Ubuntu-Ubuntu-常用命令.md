---
title: '[Ubuntu] Ubuntu 常用命令'
catalog: true
date: 2019-07-14 05:25:38
subtitle: Ubuntu 常用命令
header-img: /img/linux/ubuntu_bg.jpg
tags:
- Ubuntu
categories:
- Ubuntu
---

## 防火墙相关命令（Ubuntu）
### 安装方法
```sh
sudo apt-get install ufw
```

### 使用方法
**启用**
```sh
 sudo ufw default deny 
 sudo ufw enable
```
通过第一命令，我们设置默认的规则为allow， 这样除非指明打开的端口， 否则所有端口默认都是关闭的。第二个命令则启动了ufw。如果下次重新启动机器， ufw也会自动启动。
对于大部分防火墙操作来说， 其实无非就是的打开关闭端口。

**关闭**
```sh
 sudo ufw disable 
```

**查看防火墙状态**
```sh
sudo ufw status 
```

**开启/禁用相应端口或服务举例**
 ```sh
 # 允许外部访问80端口
 sudo ufw allow 80
 
 # 禁止外部访问80端口
 sudo ufw delete allow 80
 
 # 允许此 IP 访问所有的本机端口
 sudo ufw allow from 192.168.1.1
 
 # 禁止外部访问 smtp 服务
 sudo ufw deny smtp
 
 # 删除上面建立的某条规则
 sudo ufw delete allow smtp
 
 # 要拒绝所有的 TCP 流量从10.0.0.0/8 到192.168.0.1地址的22端口
 sudo ufw deny proto tcp from 10.0.0.0/8 to 192.168.0.1 port 22
 
 # 可以允许所有 RFC 1918网络（局域网/无线局域网的）访问这个主机（/8,/16,/12是一种网络分级）
 sudo ufw allow from 10.0.0.0/8
 sudo ufw allow from 172.16.0.0/12
 sudo ufw allow from 192.168.0.0/16
 ```

推荐设置
```sh
 sudo apt-get install ufw
 sudo ufw enable
 sudo ufw default deny 
```
这样设置已经很安全，如果有特殊需要，可以使用 `sudo ufw allow` 开启相应服务。


## 进程命令
**查看进程**
```sh
ps -ef | grep mysql
ps -ef | grep tomcat-8
```

**结束进程**
```sh
Kill -9 进程号
```

补充：

1. 我们经常会用到 `kill` 命令去杀死一个进程，但是有时会出现 `kill` 不成功的现象，这是就要用到 `kill -9`。

2. 之所以这两个命令会有区别是因为所发送的信号( Signal )是不同的：
默认情况下 `kill` 命令的参数为 -15，信号为 `SIGTERM`，这是告诉进程你需要被关闭，请自行停止运行并退出；而 `kill -9` 代表的信号是 `SIGKILL`，表示进程被终止，需要立即退出。

3. 因此 `kill -9` 表示强制杀死该进程，这个信号不能被捕获也不能被忽略。

## 查看端口
**方法一**
```sh
netstat -an | grep 8080

# 端口已被监听
tcp6       0      0 :::8080                 :::*                    LISTEN
```

**方法二**
```sh
telnet 192.168.189.137 8080

# 表端口已打开
Trying 192.168.189.137...
Connected to 192.168.189.137.
Escape character is '^]'.

# 表端口未打开
Trying 192.168.189.137...
telnet: Unable to connect to remote host: Connection refused
```

## 查看日志
先切换到你的 `tomcat` 下的 `logs：cd usr/local/tomcat/logs` 控制台执行：
```sh
tail -f catalina.out
```
这样运行时就可以实时查看运行日志了

## 网络命令
查看网路链接的状态：`systemctl status networking.service`

重启网路链接：`systemctl restart networking.service`

关闭网路链接：`systemctl stop networking.service`

## MySQL 命令
启动 mysql 服务：`systemctl start mysqld.service`

停止 mysql 服务：`systemctl stop mysqld.service`

重启 mysql 服务：`systemctl restart mysqld.service`

查看 mysql 服务当前状态：`systemctl status mysqld.service`

设置 mysql 服务开机自启动：`systemctl enable mysqld.service`

停止 mysql 服务开机自启动：`systemctl disable mysqld.service`