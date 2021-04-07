---
title: '[Ubuntu] 6 Ubuntu 安装 MySQL 5.7'
catalog: true
date: 2019-07-14 05:21:44
subtitle: Ubuntu 安装 MySQL 5.7
header-img: /img/linux/ubuntu_bg.jpg
tags:
- Ubuntu
categories:
- Ubuntu
---

## 安装
### 更新数据源
```sh
    apt-get update
```

### 安装 MySQL
```sh
    apt-get install mysql-server
```
系统将提示您在安装过程中创建 root 密码。选择一个安全的密码，并确保你记住它，因为你以后需要它。接下来，我们将完成 MySQL 的配置。

## 配置
因为是全新安装，您需要运行附带的安全脚本。这会更改一些不太安全的默认选项，例如远程 root 登录和示例用户。在旧版本的 MySQL 上，您需要手动初始化数据目录，但 Mysql 5.7 已经自动完成了。

运行安全脚本：
```sh
    mysql_secure_installation
```

这将提示您输入您在之前步骤中创建的 root 密码。您可以按 Y，然后 ENTER 接受所有后续问题的默认值，但是要询问您是否要更改 root 密码。您只需在之前步骤中进行设置即可，因此无需现在更改。

## 测试
按上边方式安装完成后，MySQL 应该已经开始自动运行了。要测试它，请检查其状态。
```sh
    lusifer@ubuntu:~$ systemctl status mysql.service
    ● mysql.service - MySQL Community Server
       Loaded: loaded (/lib/systemd/system/mysql.service; enabled; vendor preset: enabled)
       Active: active (running) since Tue 2017-11-21 13:04:34 CST; 3min 24s ago
     Main PID: 2169 (mysqld)
       CGroup: /system.slice/mysql.service
               └─2169 /usr/sbin/mysqld
    
    Nov 21 13:04:33 ubuntu systemd[1]: Starting MySQL Community Server...
    Nov 21 13:04:34 ubuntu systemd[1]: Started MySQL Community Server.
```

查看 MySQL 版本：
```sh
    mysqladmin -p -u root version
```

## 配置远程访问
### 修改配置文件
```sh
    nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

### 注释掉(语句前面加上 # 即可)：
```sh
    bind-address = 127.0.0.1
```

### 重启 MySQL
```sh
    service mysql restart
```

### 登录 MySQL
```sh
    mysql -u root -p
```

### 授权 root 用户允许所有人连接
```sh
    grant all privileges on *.* to 'root'@'%' identified by '你的 mysql root 账户密码';
```

## 因弱口令无法成功授权解决步骤
### 查看和设置密码安全级别
```sh
    select @@validate_password_policy;
    set global validate_password_policy=0;
```

### 查看和设置密码长度限制
```sh
    select @@validate_password_length;
    set global validate_password_length=1;
```

## 常用命令
### 启动
```sh
    service mysql start
```

### 停止
```sh
    service mysql stop
```

### 重启
```sh
    service mysql restart
```

## 其它配置
修改配置`mysqld.cnf`配置文件
```sh
    vi /etc/mysql/mysql.conf.d/mysqld.cnf
```
### 配置默认字符集
在`[mysqld]`节点上增加如下配置
```sh
    [client]
    default-character-set=utf8
```
在`[mysqld]`节点底部增加如下配置
```sh
    default-storage-engine=INNODB
    character-set-server=utf8
    collation-server=utf8_general_ci
```
### 配置忽略数据库大小写敏感
在`[mysqld]`节点底部增加如下配置
```sh
    lower-case-table-names = 1
```