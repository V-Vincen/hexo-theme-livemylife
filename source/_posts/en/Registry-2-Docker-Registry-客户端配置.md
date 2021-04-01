---
title: '[Registry] 2 Docker Registry 客户端配置'
catalog: true
date: 2019-08-28 11:55:35
subtitle: Docker Registry 客户端配置
header-img: /img/dockerregistry/registry_bg.png
tags:
- Registry
categories:
- Registry
---

## 概述
我们的教学案例使用的是 Ubuntu Server 16.04 LTS 版本，属于 `systemd` 系统，需要在 `/etc/docker/daemon.json` 中增加如下内容（如果文件不存在请新建该文件）
```sh
{
  "registry-mirrors": [
    "https://registry.docker-cn.com"
  ],
  "insecure-registries": [
    "ip:5000"
  ]
}
```
注意：该文件必须符合 `json` 规范，否则 Docker 将不能启动。

之后重新启动服务
```sh
$ sudo systemctl daemon-reload
$ sudo systemctl restart docker
```

## 检查客户端配置是否生效
使用 `docker info` 命令手动检查，如果从配置中看到如下内容，说明配置成功（这里以：`192.168.189.138` 为例，此 `ip` 地址为 `Docker Registry 私服 ip 地址`）
```sh
Insecure Registries:
 192.168.189.138:5000
 127.0.0.0/8
```

## 测试镜像上传
我们以 Nginx 为例测试镜像上传功能
```sh
## 拉取一个镜像
docker pull nginx

## 查看全部镜像
docker images

## 标记本地镜像并指向目标仓库（ip:port/image_name:tag，该格式为标记版本号）
docker tag nginx 192.168.189.138:5000/nginx

## 提交镜像到仓库
docker push 192.168.189.138:5000/nginx
```

## 查看全部镜像
```sh
curl -XGET http://192.168.189.138:5000/v2/_catalog
```

## 测试拉取镜像
**先删除镜像**
```sh
docker rmi nginx
docker rmi 192.168.189.138:5000/nginx
```

**再拉取镜像**
```sh
docker pull 192.168.189.138:5000/nginx
```

<font color=red>注意：</font>目前的配置只能做到本服务器拉取、推送，如果在其他主机上试图推送镜像到上来，结果是失败的。如果想做到 `externally-accessible`（外部可访问），可参考：
- [手把手教你搭建 Docker Registry 私服](https://blog.csdn.net/egworkspace/article/details/80518647)

- [Docker 私有仓库高级配置](https://www.funtl.com/zh/docs-docker/Docker-%E7%A7%81%E6%9C%89%E4%BB%93%E5%BA%93%E9%AB%98%E7%BA%A7%E9%85%8D%E7%BD%AE.html)