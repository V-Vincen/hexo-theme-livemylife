---
title: '[Dubbo Zookeeper] 5.2 Linux 下手动安装 Zookeeper'
catalog: true
date: 2020-01-16 16:41:52
subtitle: Linux 下手动安装 Zookeeper
header-img: /img/dubbozookeeper/dubbozookeeper_bg.jpg
tags:
- Dubbo Zookeeper
---

## 概述
Zookeeper 部署有三种方式，单机模式、集群模式、伪集群模式，以下采用手动安装的方式部署。

**注意**： 集群为大于等于3个奇数，如 3、5、7,不宜太多，集群机器多了选举和数据同步耗时长，不稳定。

## 单机模式
### 下载
进入要下载的版本的目录，选择 `.tar.gz` 文件下载，下载链接：http://archive.apache.org/dist/zookeeper/

### 安装
注意： 需要先安装 `Java`

使用 `tar` 解压要安装的目录即可，以 `3.5.6` 版本为例，解压到 `/usr/local/zookeeper-3.5.6`
```shell
tar -zxvf zookeeper-3.5.6.tar.gz -C /usr/local
```

### 配置
在根目录下创建 `data` 和 `logs` 两个目录用于存储数据和日志
```shell
cd /usr/local/zookeeper-3.5.6
mkdir data
mkdir logs
```

在 `conf` 目录下新建 `zoo.cfg` 文件，写入以下内容保存
```shell
tickTime=2000
dataDir=/usr/local/zookeeper-3.5.6/data
dataLogDir=/usr/local/zookeeper-3.5.6/logs
clientPort=2181
```

### 启动和停止
进入 `bin` 目录，启动、停止、重启和查看当前节点状态
```shell
./zkServer.sh start
./zkServer.sh stop
./zkServer.sh restart
./zkServer.sh status
```

## 伪集群模式
伪集群模式就是在同一主机启动多个 zookeeper 并组成集群，下边以在 192.168.10.134 主机上创 3 个 zookeeper 组集群为例。

将通过单机模式安装的 zookeeper，复制成 zookeeper1、zookeeper2、zookeeper3 三份。

### zookeeper1
**修改配置文件**
```shell
tickTime=2000
dataDir=/usr/local/zookeeper1/data
dataLogDir=/usr/local/zookeeper1/logs
clientPort=2181
initLimit=5
syncLimit=2
server.1=192.168.10.134:2888:3888
server.2=192.168.10.134:4888:5888
server.3=192.168.10.134:6888:7888
```

**设置服务器 ID**
```shell
echo '1' > data/myid
```

### zookeeper2
**修改配置文件**
```shell
tickTime=2000
dataDir=/usr/local/zookeeper2/data
dataLogDir=/usr/local/zookeeper2/logs
clientPort=2181
initLimit=5
syncLimit=2
server.1=192.168.10.134:2888:3888
server.2=192.168.10.134:4888:5888
server.3=192.168.10.134:6888:7888
```

**设置服务器 ID**
```shell
echo '2' > data/myid
```

### zookeeper3
**修改配置文件**
```shell
tickTime=2000
dataDir=/usr/local/zookeeper3/data
dataLogDir=/usr/local/zookeeper3/logs
clientPort=2181
initLimit=5
syncLimit=2
server.1=192.168.10.134:2888:3888
server.2=192.168.10.134:4888:5888
server.3=192.168.10.134:6888:7888
```

**设置服务器 ID**
```shell
echo '3' > data/myid
```

## 启动和停止
分别启动服务器，顺序无所谓
```shell
./zkServer.sh start
./zkServer.sh stop
./zkServer.sh restart
./zkServer.sh status
```

## 集群模式
集群模式就是在不同主机上安装 zookeeper 然后组成集群的模式，操作步骤同上，此处不再赘述。