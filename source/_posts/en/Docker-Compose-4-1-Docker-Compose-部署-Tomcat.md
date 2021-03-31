---
title: '[Docker Compose] 4.1 Docker Compose 部署 Tomcat'
catalog: true
date: 2019-08-22 18:10:56
subtitle: Docker Compose 部署 Tomcat
header-img: /img/dockercompose/dockercompose_bg2.png
tags:
- Docker Compose
categories:
- Docker Compose
---

启动一个 `tomcat`，先在 `/usr/local/docker/tomcat/` 目录下创建一个 `docker-compose.yml` 配置文件。

## docker-compose.yml
```yml
version: '3.1'
services:
  tomcat:
    restart: always
    image: tomcat
    container_name: tomcat
    ports:
      - 8080:8080
    volumes:
      - /usr/local/docker/tomcat/webapps/ROOT:/usr/local/tomcat/webapps/ROOT
    environment:
      TZ: Asia/Shanghai
```

## 运行 `compose` 项目（运行容器）
```sh
docker-compose up
```

## 删除容器
```sh
docker-compose down
```

## 容器守护态运行
```sh
docker-compose up -d
```

## 查看日志
```sh
docker-compose logs tomcat
```

## 监听日志
```sh
docker-compose logs -f tomcat
```