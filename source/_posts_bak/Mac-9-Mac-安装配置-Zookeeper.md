---
title: '[Mac] 9 Mac 安装配置 Zookeeper'
catalog: true
date: 2020-01-22 18:00:32
subtitle: Mac 安装配置 Zookeeper
header-img: /img/mac/mac_bg.jpg
tags:
- Mac
categories:
- Mac
---

## 使用 `brew` 查看 `zookeeper` 信息
```shell
brew info zookeeper
```
得到输出信息

![1](1.png)

## 用 `Homebrew` 来安装 `Zookeeper`
```shell
brew install zookeeper
```

### 查看配置文件
缺省的配置文件在以下目录中
```
cd /usr/local/etc/zookeeper/
```

![2](2.png)

### 修改配置文件 `zoo.cfg `（可保持默认状态）
```shell
tickTime=2000
dataDir=/usr/local/zookeeper-3.4.14/data
dataLogDir=/usr/local/zookeeper-3.4.14/logs
clientPort=2181
```

注：个人认为 `brew` 安装下的 `zookeeper` 的版本较低，可参考：[Linux 下手动安装 Zookeeper
](https://v_vincen.gitee.io/2020/01/16/Dubbo-Zookeeper-5-2-Linux-%E4%B8%8B%E6%89%8B%E5%8A%A8%E5%AE%89%E8%A3%85-Zookeeper/)


