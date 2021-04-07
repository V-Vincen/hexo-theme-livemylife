---
title: '[Dubbo Zookeeper] 6 Zookeeper 配置说明'
catalog: true
date: 2020-01-16 16:42:17
subtitle: Zookeeper 配置说明
header-img: /img/dubbozookeeper/dubbozookeeper_bg.jpg
tags:
- Dubbo Zookeeper
---

## Zookeeper 的三种工作模式
- 单机模式：存在单点故障。
- 集群模式：在多台机器上部署 Zookeeper 集群，适合线上环境使用。
- 伪集群模式：在一台机器同时运行多个 Zookeeper 实例，仍然有单点故障问题，当然其中配置的端口号要错开的，适合实验环境模拟集群使用。

## Zookeeper 的三种端口号
- `2181`：客户端连接 Zookeeper 集群使用的监听端口号。
- `3888`：选举 leader 使用。
- `2888`：集群内机器通讯使用（Leader 和 Follower 之间数据同步使用的端口号，Leader 监听此端口）。

## Zookeeper 单机模式配置文件
配置文件路径：`/conf/zoo.cfg`
```shell
clientPort=2181
dataDir=/data
dataLogDir=/datalog
tickTime=2000
```

- `clientPort`：这个端口就是客户端连接 Zookeeper 服务器的端口，Zookeeper 会监听这个端口，接受客户端的访问请求。
- `dataDir`：Zookeeper 保存数据的目录。
- `dataLogDir`：Zookeeper 保存日志的目录。
- `tickTime`：这个时间是作为 Zookeeper 服务器之间或客户端与服务器之间维持心跳的时间间隔，也就是每隔 tickTime 时间就会发送一个心跳。

## Zookeeper 集群模式配置文件
配置文件路径：`/conf/zoo.cfg`
```shell
clientPort=2181
dataDir=/data
dataLogDir=/datalog
tickTime=2000
initLimit=5
syncLimit=2
autopurge.snapRetainCount=3
autopurge.purgeInterval=0
maxClientCnxns=60
server.1=192.168.0.1:2888:3888
server.2=192.168.0.2:2888:3888
server.3=192.168.0.3:2888:3888
```

- `initLimit`：配置 Zookeeper 接受客户端（这里所说的客户端不是用户连接 Zookeeper 服务器的客户端，而是 Zookeeper 服务器集群中连接到 Leader 的 Follower 服务器）初始化连接时最长能忍受多少个心跳时间间隔数。当已经超过 initLimit（默认为 10） 个心跳的时间（也就是 tickTime）长度后 Zookeeper 服务器还没有收到客户端的返回信息，那么表明这个客户端连接失败。总的时间长度就是 5 * 2000 = 10 秒
- `syncLimit`：配置 Leader 与 Follower 之间发送消息，请求和应答时间长度，最长不能超过多少个 tickTime 的时间长度，总的时间长度就是 2 * 2000 = 4 秒
- `定时清理`（Zookeeper 从 3.4.0 开始提供了自动清理快照和事务日志的功能）以下两个参数配合使用：
  - `autopurge.purgeInterval`：指定了清理频率，单位是小时，需要填写一个 1 或更大的整数，默认是 0，表示不开启自己清理功能。
  - `autopurge.snapRetainCount`：指定了需要保留的文件数目。默认是保留 3 个。
- `maxClientCnxns`：限制连接到 Zookeeper 的客户端的数量，限制并发连接的数量，它通过 IP 来区分不同的客户端。此配置选项可以用来阻止某些类别的 Dos 攻击。将它设置为 0 或者忽略而不进行设置将会取消对并发连接的限制。
- `server.A=B:C:D`：
    - 集群时：
        - `A` 是一个数字，表示这个是第几号服务器。
        - `B` 是这个服务器的 IP 地址。
        - `C` 表示的是这个服务器与集群中的 Leader 服务器交换信息的端口(`2888`)；
        - `D` 表示的是万一集群中的 Leader 服务器挂了，需要一个端口来重新进行选举，选出一个新的 Leader，而这个端口就是用来执行选举时服务器相互通信的端口(`3888`)。
    - 如果是伪集群的配置方式时：
        - 由于 B 都是一样，所以不同的 Zookeeper 实例通信端口号不能一样，所以要给它们分配不同的端口号。

**注意**： `server.A` 中的 `A` 是在 `dataDir` 配置的目录中创建一个名为 `myid` 的文件里的值（如：1）

## Zookeeper 常用命令

### zkServer
**启动服务**
```shell
./zkServer.sh start
```

**停止服务**
```shell
./zkServer.sh stop
```

**重启服务**
```shell
./zkServer.sh restart
```

**执行状态**
```
./zkServer.sh status
```

### zkClient
**客户端连接服务器并进入 `Bash` 模式**
```shell
./zkCli.sh -server <ip>:<port>

# 命令参数
ZooKeeper -server host:port cmd args
	stat path [watch]
	set path data [version]
	ls path [watch]
	delquota [-n|-b] path
	ls2 path [watch]
	setAcl path acl
	setquota -n|-b val path
	history 
	redo cmdno
	printwatches on|off
	delete path [version]
	sync path
	listquota path
	rmr path
	get path [watch]
	create [-s] [-e] path data acl
	addauth scheme auth
	quit 
	getAcl path
	close 
	connect host:port
```
	
**创建节点（Bash 模式）**
```shell
create /test "hello zookeeper"
```

**查询节点（Bash 模式）**
```shell
get /test

# 输出如下
Hello Zookeeper
cZxid = 0x100000004
ctime = Fri Oct 19 05:11:47 GMT 2018
mZxid = 0x100000004
mtime = Fri Oct 19 05:11:47 GMT 2018
pZxid = 0x100000004
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 15
numChildren = 0
```

**删除节点（Bash 模式）**
```shell
delete /test
```
