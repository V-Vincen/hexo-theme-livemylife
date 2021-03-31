---
title: '[Docker] Docker 常用命令'
catalog: true
date: 2019-08-23 10:57:13
subtitle: Docker 常用命令
header-img: /img/docker/docker_bg3.png
tags:
- Docker
categories:
- Docker
---

## 查看 Docker 版本
```sh
docker version
```

## 构建 Docker 镜像
### `commit` 构建
> 先启动一个基本容器生成，然后在该容器中完成自己所需的操作，最后用 `commit` 命令来生成一个新的 `image`。
>
> 下命令中：
> 
> `<CONTAINER ID>`：为在基础容器中完成需求后的容器 id；
>
> `<image-name>`：为自定义的镜像名，也就是最终所要生成的 `imgae` 的 `REPOSITORY `；

```sh
docker commit <CONTAINER ID> <image-name>
```

### `build` 构建
> <image-name>：为自定义镜像名；
> 
> <docker-file-location>：一般为 `.` 表上下文目录，同时一般我们也会将 `Dockefile` 的文件放入该目录中；

```sh
docker build -t <image-name> <docker-file-location>
```


## 镜像命令
### 拉取镜像
```
docker pull <镜像名:版本号>
```

例子：
```sh
$ docker pull ubuntu:16.04
```

### 查看镜像
> 只显示顶层镜像

```sh
docker image ls
# 或
docker images
```

> 显示中间层镜像在内的所有镜像

```sh
docker image ls -a
```

例子：
```sh
$ docker image ls
REPOSITORY           TAG                 IMAGE ID            CREATED             SIZE
redis                latest              5f515359c7f8        5 days ago          183 MB
nginx                latest              05a60462f8ba        5 days ago          181 MB
mongo                3.2                 fe9198c04d62        5 days ago          342 MB
<none>               <none>              00285df0df87        5 days ago          342 MB
ubuntu               16.04               f753707788c5        4 weeks ago         127 MB
ubuntu               latest              f753707788c5        4 weeks ago         127 MB
ubuntu               14.04               1e0c3dd64ccd        4 weeks ago         188 MB
```

### 删除本地镜像
> 如果是短 IMAGE ID ，一般取前3个字符以上

```sh
docker image rm <REPOSITORY>
# 或
docker image rm <短 IMAGE ID>
# 或
docker image rm <长 IMAGE ID>
# 或
docker rmi <REPOSITORY>
# 或
docker rmi <短 IMAGE ID>
# 或
docker rmi <长 IMAGE ID>
...
```

例子：
```sh
$ docker image ls
REPOSITORY                  TAG                 IMAGE ID            CREATED             SIZE
centos                      latest              0584b3d2cf6d        3 weeks ago         196.5 MB
redis                       alpine              501ad78535f0        3 weeks ago         21.03 MB
docker                      latest              cf693ec9b5c7        3 weeks ago         105.1 MB
nginx                       latest              e43d811ce2f4        5 weeks ago         181.5 MB

$ docker image rm centos
Untagged: centos:latest
Untagged: centos@sha256:b2f9d1c0ff5f87a4743104d099a3d561002ac500db1b9bfa02a783a46e0d366c
Deleted: sha256:0584b3d2cf6d235ee310cf14b54667d889887b838d3f3d3033acd70fc3c48b8a
Deleted: sha256:97ca462ad9eeae25941546209454496e1d66749d53dfa2ee32bf1faabd239d38

$ docker image rm 501
Untagged: redis:alpine
Untagged: redis@sha256:f1ed3708f538b537eb9c2a7dd50dc90a706f7debd7e1196c9264edeea521a86d
Deleted: sha256:501ad78535f015d88872e13fa87a828425117e3d28075d0c117932b05bf189b7
Deleted: sha256:96167737e29ca8e9d74982ef2a0dda76ed7b430da55e321c071f0dbff8c2899b
Deleted: sha256:32770d1dcf835f192cafd6b9263b7b597a1778a403a109e2cc2ee866f74adf23
Deleted: sha256:127227698ad74a5846ff5153475e03439d96d4b1c7f2a449c7a826ef74a2d2fa
Deleted: sha256:1333ecc582459bac54e1437335c0816bc17634e131ea0cc48daa27d32c75eab3
Deleted: sha256:4fc455b921edf9c4aea207c51ab39b10b06540c8b4825ba57b3feed1668fa7c7
```

**1. 删除所有镜像**
> `-r`：强制（可选参数）

```sh
docker rmi [-r] $(docker images -q)
```

**2. 删除虚悬镜像**

```sh
docker image prune
# 或
docker rmi $(docker images -q -f dangling=true)
```


## 容器命令
### 运行容器
**1. 以主进程的方式运行容器**

```sh
docker run <镜像名:版本号>
```

**2. 以守护态运行容器**
> `-d`：后台运行容器

```sh
docker run <镜像名:版本号> -d
```

**3. 以交互的方式启动容器**
> `--rm`：退出容器后自动删除容器

```sh
docker run -it --rm <镜像名:版本号> bash
```

例子：
```sh
$ docker run -it --rm \
    ubuntu:16.04 \
    bash
```

### 进入容器
> 当 `exit` 退出容器的交互界面后，会导致容器的停止

```sh
docker attach <NAMES>
```

> 当 `exit` 退出容器的交互界面后，不会导致容器的停止
> 
> `docker exec` 后边可以跟多个参数，这里主要说明 `-i` `-t` 参数。
>
> 只用 `-i` 参数时，由于没有分配伪终端，界面没有我们熟悉的 Linux 命令提示符，但命令执行结果仍然可以返回；
>
> 当 `-i` `-t` 参数一起使用时，则可以看到我们熟悉的 Linux 命令提示符。

```sh
docker exec [-it] <NAMES> bash
# 或
docker exec [-it] <CONTAINER ID> bash
```

例子：
```sh
$ docker run -dit ubuntu
69d137adef7a8a689cbcb059e94da5489d3cddd240ff675c640c8d96e84fe1f6

$ docker container ls
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
69d137adef7a        ubuntu:latest       "/bin/bash"         18 seconds ago      Up 17 seconds                           zealous_swirles

$ docker exec -i 69d1 bash
ls
bin
boot
dev
...

$ docker exec -it 69d1 bash
root@69d137adef7a:/#
```

### 停止运行容器
```sh
docker stop <CONTAINER ID>
# 或
docker stop <NAMES>
```


### 查看容器
**1. 查看正在运行的容器**
```sh
docker ps
# 或
docker container ls
```

**2. 查看全部容器**
```sh
docker ps -a
# 或
docker container ls -a
```

### 删除容器
**1. 删除指定的终止容器**
```sh
docker container rm <CONTAINER ID>
# 或
docker container rm <NAMES>
# 或
docker rm <CONTAINER ID>
# 或
docker rm <NAMES>
```

**2. 删除全部的终止容器**
```sh
docker container prune
```

例子：
```sh
root@ubuntu:~# docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                     PORTS               NAMES
ffaa86bd3601        tomcat              "bash"              4 minutes ago       Exited (0) 3 minutes ago                       vigorous_bohr

root@ubuntu:~# docker rm vigorous_bohr
vigorous_bohr
```

## 数据卷命令
### 查看所有数据卷
```sh
docker volume ls
```

### 删除数据卷
**1. 删除指定数据卷**
```sh
docker volume rm <volume_name>
```

**2. 删除所有未关联的数据卷**
```sh
docker volume prune
# 或
docker volume rm $(docker volume ls -qf dangling=true)
```