---
title: '[Docker] 4.4 Dockerfile 指令详解'
catalog: true
date: 2019-07-14 19:52:24
subtitle: Dockerfile 指令详解
header-img: /img/docker/docker_bg4.png
tags:
- Docker
categories:
- Docker
---

使用 Dockerfile 去构建镜像好比堆积木、使用 pom 去构建 maven 项目一样，有异曲同工之妙，下面就把 Dockerfile 中主要的命令介绍一下。

## 组成部分
| 部分               | 命令                                                     |
| ------------------ | -------------------------------------------------------- |
| 基础镜像信息       | FROM                                                     |
| 维护者信息         | MAINTAINER                                               |
| 镜像操作指令       | RUN、COPY、ADD、EXPOSE、WORKDIR、ONBUILD、USER、VOLUME等 |
| 容器启动时执行指令 | CMD、ENTRYPOINT                                          |

## 各命令详解
### FROM
指定哪种镜像作为新镜像的基础镜像，如：
```sh
FROM ubuntu:14.04
```

### MAINTAINER
指明该镜像的作者和其电子邮件，如：
```sh
MAINTAINER vector4wang "xxxxxxx@qq.com"
```

### RUN
在新镜像内部执行的命令，比如安装一些软件、配置一些基础环境，可使用`\`来换行，如：
```sh
RUN echo 'hello docker!' \
    > /usr/local/file.txt
```
也可以使用 `exec` 格式 `RUN ["executable", "param1", "param2"]`的命令，如：
```sh
RUN ["apt-get","install","-y","nginx"]
```

要注意的是，**`executable` 是命令，后面的 `param` 是参数**

### COPY
将主机的文件复制到镜像内，如果目的位置不存在，Docker 会自动创建所有需要的目录结构，但是它只是单纯的复制，并不会去做文件提取和解压工作。如：
```sh
COPY application.yml /etc/springboot/hello-service/src/resources
```

**注意：需要复制的目录一定要放在 Dockerfile 文件的同级目录下**
原因：

> 因为构建环境将会上传到 Docker 守护进程，而复制是在 Docker 守护进程中进行的。任何位于构建环境之外的东西都是不可用的。COPY 指令的目的的位置则必须是容器内部的一个绝对路径。
> ---《THE DOCKER BOOK》

### ADD
将主机的文件复制到镜像中，跟 `COPY` 一样，限制条件和使用方式都一样，如：
```sh
ADD application.yml /etc/springboot/hello-service/src/resources
```

但是 `ADD` 会对压缩文件（`tar`, `gzip`, `bzip2`, `etc`）做提取和解压操作。

### EXPOSE
暴露镜像的端口供主机做映射，启动镜像时，使用 `-P` 参数来讲镜像端口与宿主机的随机端口做映射。使用方式（可指定多个）：
```sh
EXPOSE 8080 
EXPOSE 8081
...
```

### WORKDIR
在构建镜像时，指定镜像的工作目录，之后的命令都是基于此工作目录，如果不存在，则会创建目录。如
```sh
WORKDIR /usr/local
WORKDIR webservice
RUN echo 'hello docker' > text.txt
...
```

最终会在 `/usr/local/webservice/` 目录下生成 text.txt 文件。

### ONBUILD
当一个包含 `ONBUILD` 命令的镜像被用作其他镜像的基础镜像时(比如用户的镜像需要从某为准备好的位置添加源代码，或者用户需要执行特定于构建镜像的环境的构建脚本)，该命令就会执行。
如创建镜像 `image-A` 
```sh
FROM ubuntu
...
ONBUILD ADD . /var/www
...
```

然后创建镜像 `image-B` ，指定 `image-A` 为基础镜像，如
```sh
FROM image-A
...
```

然后在构建 `image-B` 的时候，日志上显示如下:
```sh
Step 0 : FROM image-A
# Execting 1 build triggers
Step onbuild-0 : ADD . /var/www
...
```

### USER
指定该镜像以什么样的用户去执行，如：
```sh
USER mongo
```

### VOLUME
用来向基于镜像创建的容器添加卷。比如你可以将 `mongodb` 镜像中存储数据的 `data` 文件指定为主机的某个文件。(容器内部建议不要存储任何数据)
如：
```sh
VOLUME /data/db /data/configdb
```
**注意**：`VOLUME 主机目录 容器目录`

### CMD
容器启动时需要执行的命令，如：
```sh
CMD /bin/bash
```
同样可以使用 `exec` 语法，如
```sh
CMD ["/bin/bash"]
```
当有多个 `CMD` 的时候，只有最后一个生效。

### ENTRYPOINT
作用和用法和 `CMD` 一模一样

### CMD和ENTRYPOINT的区别
`CMD` 和 `ENTRYPOINT` 同样作为容器启动时执行的命令，区别有以下几点：

- `CMD` 的命令会被 `docker run` 的命令覆盖而 `ENTRYPOINT` 不会

如使用 `CMD ["/bin/bash"]` 或 `ENTRYPOINT ["/bin/bash"]` 后，再使用 `docker run -ti  image` 启动容器，它会自动进入容器内部的交互终端，如同使用 `docker run -ti image /bin/bash`。

但是如果启动镜像的命令为 `docker run -ti image /bin/ps`，使用 `CMD` 后面的命令就会被覆盖转而执行 `bin/ps` 命令，而 `ENTRYPOINT` 的则不会，而是会把 `docker run`  后面的命令当做 `ENTRYPOINT` 执行命令的参数。
以下例子比较容易理解：

Dockerfile 中为
```sh
...
ENTRYPOINT ["/user/sbin/nginx"]
```
然后通过启动 build 之后的容器
```sh
docker run -ti image -g "daemon off"
```

此时 `-g "daemon off"` 会被当成参数传递给 `ENTRYPOINT` ，最终的命令变成了
```sh
/user/sbin/nginx -g "daemon off"
```

- `CMD` 和 `ENTRYPOINT` 都存在时

`CMD` 和 `ENTRYPOINT` 都存在时，`CMD` 的指令变成了 `ENTRYPOINT` 的参数，并且此 `CMD` 提供的参数会被 `docker run` 后面的命令覆盖，如：
```sh
...
ENTRYPOINT ["echo","hello","i am"]
CMD ["docker"]
```

之后启动构建之后的容器

- 使用 `docker run -ti image`

输出
```sh
"hello i am docker"
```

- 使用 `docker run -ti image world`

输出
```sh
"hello i am world"
```
指令比较多，可以通过分类（如开头的表格）的办法去记忆

### 示例
自己写了个简单的示例，非常简单
```sh
FROM ubuntu
MAINTAINER vector4wang xxxx@qq.com

WORKDIR /usr/local/docker
ADD temp.zip ./add/
COPY temp.zip ./copy/
EXPOSE 22
RUN groupadd -r vector4wang && useradd -r -g vector4wang vector4wang
USER vector4wang

ENTRYPOINT ["/bin/bash"]
```
下面是运行过程

![1](1.jpg)

![2](2.jpg)

参考简书：https://www.jianshu.com/p/10ed530766af