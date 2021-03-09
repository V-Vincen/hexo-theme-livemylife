---
title: '[Docker] Docker 插件部署 Spring Boot 项目（IDEA 中）'
catalog: true
date: 2019-08-22 00:52:43
subtitle: IDEA 中 Docker 插件部署 Spring Boot 项目
header-img: /img/docker/docker_bg5.png
tags:
- Docker
categories:
- Docker
---

## 配置 `docker` 远程访问

### 方法一：
**编辑 `docker` 服务配置文件**
```sh
vim /lib/systemd/system/docker.service
```
找到如下配置，修改为：
```sh
# ExecStart=/usr/bin/dockerd
ExecStart=/usr/bin/dockerd -H unix:///var/run/docker.sock -H tcp://0.0.0.0:2375
```
如图：
![1](1.png)

**重启 `docker` 网络**
```sh
systemctl restart docker
```
测试：
```sh
curl http://localhost:2375/verion
```
![2](2.png)


### 方法二：（亲测有效）
**测试是否可以连接**
```sh
docker -H 192.168.20.43 info
```
返回如下信息则说明可以远程连接：
![3](3.png)

**如果没有返回则需要配置**

这个路径文件如果不存在需要自己创建
```sh
cd /etc/systemd/system/docker.service.d/override.conf
```
在这个 `override.conf`  添加如下内容：
```sh
ExecStart=
ExecStart=/usr/bin/dockerd -H tcp://0.0.0.0:2375 -H unix://var/run/docker.sock
ExecReload=/bin/kill -s HUP $MAINPID
TimeoutSec=0
RestartSec=2
Restart=always
```
运行如下命令，让刚才修改文件生效：
```sh
systemctl daemon-reload
```
重启 `docker` 服务：
```sh
systemctl restart docker.service
```
使用如下命令再次测试：
```
docker -H 192.168.20.43 info
```
返回上图信息，则说明大功告成。

**查看监听端口**

```sh
netstat -lntp | grep dockerd

tcp6       0      0 :::2375                 :::*                    LISTEN      3305/dockerd
```

## 配置 `IDEA` 连接 `docker` 服务
### 安装 `IDEA` 的 `docker` 插件
在 `setting` 中安装 `docker` 插件：IntelliJ IDEA 2019.1.1 版已集成 `docker` 插件
![4](4.png)

### 配置连接
我们打开 `settings` 可以看到 `docker`，点击 `+` ，添加一个连接。
![5](5.png)

然后再工具栏选择 `docker` 的窗口，点击运行。接下来我们在 `IDEA` 上面操作 `docker`。
![6](6.png)

## 编写 `Dockerfile`
在项目根目录下建立一个 `Dockerfile` 文件，写入一下内容：
```Dockerfile
FROM java:8

ADD /target/crm-0.0.1-SNAPSHOT.jar crm.jar

EXPOSE 9090

ENTRYPOINT ["java","-jar","crm.jar"]

# Ubuntu 时区
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```
![7](7.png)

## 然后配置 `docker` 启动项
选择编辑：
![8](8.png)

添加一个启动项：
![9](9.png)

填写 `docker` 相关的参数：
![10](10.png)

在执行 `docker` 镜像之前需要把项目进行打包，所以在最下面的操作栏中加入 `maven` 打包相关的命令，添加一个 `maven` 任务：
![11](11.png)

编写 `maven` 打包命令：
```maven
clean package -Dmaven.test.skip=true
```
![12](12.png)