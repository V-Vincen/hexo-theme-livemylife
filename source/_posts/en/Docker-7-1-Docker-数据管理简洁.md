---
title: '[Docker] 7.1 Docker 数据管理简洁'
catalog: true
date: 2019-07-18 18:04:00
subtitle: Docker 数据管理简洁
header-img: /img/docker/docker_bg4.png
tags:
- Docker
categories:
- Docker
---

这一章介绍如何在 Docker 内部以及容器之间管理数据，在容器中管理数据主要有两种方式：

- 数据卷（Volumes）
- 挂载主机目录 (Bind mounts)

## 数据卷
数据卷用来保存对容器的修改/数据，可供容器之间共享和重用，数据卷独立于容器，不会随着容器删除而删除。

**创建数据卷**
```sh
docker volume create my-vol
```

**数据卷列表**
```sh
docker volume ls
```

**查看数据卷具体信息**
```sh
docker volume inspect my-vol
```

**删除数据卷**
```sh
docker volume rm my-vol
```

**清除无主的数据卷**
```sh
docker volume prune
```

**启动一个容器并挂载一个数据卷到容器的/webapp目录（两种方式：）**
```sh
docker run -d -P --name nginx -v my-vol:/webapp nginx
```
```sh
docker run -d -P --name nginx --mount source=my-vol,target=/webapp nginx
```

<font color=red>**要点：**</font>

- 如果本地数据卷或者本地目录尚未创建，-v命令则会自动创建,--mount则会报错
- 如果是容器里的目录不存在，两者都会自动创建
- --mount命令解析：
  - 由多个键=值组成
  - 有 type = bind/volume/tmpfs，（省略该字段则默认为volume）
  - 可使用source/src =本机目录文件，（省略该字段则为匿名卷）
  - target/destination/dst =容器目录
  - 可指定 readonly

### 测试
测试一下两个容器通过数据卷来数据共享（<font color=red>注意：数据卷仅仅保存挂载目录里的数据</font>）

**容器一：**
```sh
docker run -d -p 82:80 --name nginx-v -v my-vol-test:/webapp nginx
```
进入 nginx-v 容器，到挂载的目录下创建一个文件 test
```sh
docker exec -it nginx-v bash
cd webapp/
touch test
```

**容器二：**
```sh
docker run -d -p 83:80 --name nginx-v1 --mount src=my-vol-test,target=/mywebapp nginx
```
进入 nginx-v1 容器，到挂载目录下查看是否有 test 文件
```sh
docker exec -it nginx-v1 bash
cd mywebapp/
ls
```

## 挂载目录
将一个本地绝对路径挂载到 tomcat 容器的绝对路径，可通过此方法来部署 web 应用
```sh
docker run -d -p 8082:8080 --name tomcat-mount -v /usr/local/kun/aa:/usr/local/tomcat/webapps/aa tomcat
```
或者
```sh
docker run -d -p 8082:8080 --name tomcat-mount --mount type=bind,src=/usr/local/kun/aa,target=/usr/local/tomcat/webapps/aa tomcat
```

<font color=red>**注意：**</font>
- 容器里必须是绝对路径，如果 /usr/local/tomcat/webapps 换成 /webapps 经过验证是不行的
- 如果想要访问本地 /usr/local/kun/aa 下的 test.html，容器里的目录 /usr/local/tomcat/webapps 必须加多一层目录 /usr/local/tomcat/webapps/aa


参考：https://blog.csdn.net/deel_feel/article/details/82902836