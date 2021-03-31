---
title: '[Mac] 6 Mac 安装配置 Redis'
catalog: true
date: 2020-01-14 13:49:15
subtitle: Mac 安装配置 Redis
header-img: /img/mac/mac_bg.jpg
tags:
- Mac
categories:
- Mac
---

## 回顾 `Homebrew` 的命令
```shell
brew search **    //查找某个软件包
brew list         //列出已经安装的软件的包
brew install **   //安装某个软件包,默认安装的是稳定版本
brew uninstall ** //卸载某个软件的包
brew upgrade **   //更新某个软件包
brew info **      //查看指定软件包的说明
brew cleanup      //清理缓存(自动移除旧版本的软件包)
```

另外，如果嫌麻烦的话，可以按下面的方式添加命令别名：
```shell
alias brewski='brew update && brew upgrade && brew cleanup; brew doctor'
```

## 用 `Homebrew` 来安装 `Redis`
首先我们查看下已有的 `Redis` 各个版本：
```shell
brew search redis
```

输出如下，我们以安装 `Redis` 版本为例进行说明：
```shell
==> Formulae
hiredis         redis ✔         redis-leveldb   redis@3.2       redis@4.0

==> Casks
another-redis-desktop-manager            redis
```

安装命令：
```shell
brew install redis
```

启动 `Redis`：
```shell
redis-server

# 或者（后台启动）
brew services start redis
```

最后可以采用如下命令检查 `Redis` 是否启动成功：
```shell
# 查看端口是否在
lsof -i:6379

# 查看进程是否存在
 ps -ef | grep redis
```