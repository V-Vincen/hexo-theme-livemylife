---
title: '[Registry] 1 Docker Registry 私服和 WebUI 安装'
catalog: true
date: 2019-08-28 11:39:55
subtitle: Docker Registry 私服和 WebUI 安装
header-img: /img/dockerregistry/registry_bg.png
tags:
- Registry
categories:
- Registry
---

## 安装 Docker Registry 私服
### 概述
官方的 Docker Hub 是一个用于管理公共镜像的地方，我们可以在上面找到我们想要的镜像，也可以把我们自己的镜像推送上去。但是，有时候我们的服务器无法访问互联网，或者你不希望将自己的镜像放到公网当中，那么你就需要 Docker Registry，它可以用来存储和管理自己的镜像。

### 安装
Registry 官网 Docker Hub 下载地址：https://hub.docker.com/_/registry

我们使用 Docker 来安装和运行 Registry，配置版本为最新版 2.7 版。

在之前的 [Docker 私有仓库](https://wvincen.gitee.io/2019/07/18/Docker-6-Docker-%E4%BB%93%E5%BA%93/) 章节中已经提到过如何配置和使用容器运行私有仓库，这里我们使用 `docker-compose` 配置如下：
```yml
version: '3.1'
services:
  registry:
    image: registry
    restart: always
    container_name: registry
    ports:
      - 5000:5000
    volumes:
      - /usr/local/docker/registry/data:/var/lib/registry
```

### 测试
启动成功后需要测试服务端是否能够正常提供服务，有两种方式
- 浏览器端访问

[http://ip:5000/v2/](https://v_vincen.gitee.io/404.html)

![1](1.png)

- 终端访问
```sh
curl http://ip:5000/v2/
```


<font color=red>注意：</font>如想搭建一个拥有权限认证、TLS 的私有仓库，Docker 私服高级配置可参考：

- [手把手教你搭建 Docker Registry 私服](https://blog.csdn.net/egworkspace/article/details/80518647)

- [Docker 私有仓库高级配置](https://www.funtl.com/zh/docs-docker/Docker-%E7%A7%81%E6%9C%89%E4%BB%93%E5%BA%93%E9%AB%98%E7%BA%A7%E9%85%8D%E7%BD%AE.html)


## 安装 Docker Registry WebUI
### 概述
私服安装成功后就可以使用 docker 命令行工具对 registry 做各种操作了。然而不太方便的地方是不能直观的查看 registry 中的资源情况。如果可以使用 UI 工具管理镜像就更好了。这里介绍两个 Docker Registry WebUI 工具：
- [docker-registry-frontend](https://github.com/kwk/docker-registry-frontend)
- [docker-registry-web](https://hub.docker.com/r/hyper/docker-registry-web/)


两个工具的功能和界面都差不多，我们以 `docker-registry-fontend` 为例讲解

### docker-registry-frontend
我们使用 docker-compose 来安装和运行，`docker-compose.yml` 配置如下：
```yml
version: '3.1'
services:
  frontend:
    image: konradkleine/docker-registry-frontend:v2
    ports:
      - 8080:80
    volumes:
      - ./certs/frontend.crt:/etc/apache2/server.crt:ro
      - ./certs/frontend.key:/etc/apache2/server.key:ro
    environment:
      - ENV_DOCKER_REGISTRY_HOST=ip
      - ENV_DOCKER_REGISTRY_PORT=5000
```
注意：请将配置文件中的主机和端口换成自己仓库的地址

运行成功后在浏览器访问：[http://ip:5000](https://v_vincen.gitee.io/404.html)

![2](2.png)

![3](3.png)