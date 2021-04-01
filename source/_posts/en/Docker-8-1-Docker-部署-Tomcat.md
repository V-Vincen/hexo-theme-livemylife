---
title: '[Docker] 8.1 Docker 部署 Tomcat'
catalog: true
date: 2019-08-21 03:00:31
subtitle: Docker 部署 Tomcat
header-img: /img/docker/docker_bg4.png
tags:
- Docker
categories:
- Docker
---

## 搜索 `tomcat` 镜像
docker 官网：https://hub.docker.com/_/tomcat
```sh
docker search tomcat
```

## 下载 `tomcat` 镜像
默认最新版本
```sh
docker pull tomcat
```

## 运行 `tomcat` 容器
```sh
docker run \
--name tomcat \
-p 8080:8080 \
-v $PWD/ROOT:/usr/local/tomcat/webapps/ROOT \
-d tomcat
```
或者
```sh
docker run \
--name tomcat \
-p 8080:8080 \
-v /usr/local/docker/web/ROOT:/usr/local/tomcat/webapps/ROOT \
-d tomcat
```
命令说明：
- `-p 8080:8080`：将容器的8080端口映射到主机的8080端口
- `-v $PWD/ROOT:/usr/local/tomcat/webapps/ROOT`：将主机中当前目录下的 `ROOT` 挂载到容器的 `/ROOT`  或者 `-v /usr/local/docker/web/ROOT:/usr/local/tomcat/webapps/ROOT`：直接指定宿主机的绝对路径

查看容器启动情况
```sh
root@ubuntu:/usr/local/docker# docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                    NAMES
65bed88bc006        tomcat              "catalina.sh run"   41 seconds ago      Up 40 seconds       0.0.0.0:8080->8080/tcp   tomcat
```