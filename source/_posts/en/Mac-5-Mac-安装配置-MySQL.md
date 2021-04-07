---
title: '[Mac] 5 Mac 安装配置 MySQL'
catalog: true
date: 2020-01-14 13:48:54
subtitle: Mac 安装配置 MySQL
header-img: /img/mac/mac_bg.jpg
tags:
- Mac
categories:
- Mac
---

## 常规方法安装

### 下载安装（`.dmg`）
官网下载：https://dev.mysql.com/downloads/mysql/

按照流程进行安装，注意选择 `root` 密码那一步时选择 `legacy` 

### 登陆
但是在终端命令行登陆 `MySQL`，`mysql -u root -p`，提示：`-bash: mysql: command not found`，这个是因为 `/usr/local/bin` 目录下缺失 `mysql` 导致，只需建立软链接，即可以解决：把 `mysql` 安装目录，比如 `MYSQLPATH/bin/mysql`，映射到 `/usr/local/bin` 目录下：
```shell
cd /usr/local/bin
ln -fs /usr/local/mysql-8.0.11-macos10.13-x86_64/bin/mysql mysql
```

### 修改密码
在 `MySQL 8.0.4` 以前，执行 `SET PASSWORD=PASSWORD('修改的密码');` 即可修改密码。如果 `MySQL` 是 8.0 版本以上，这样默认是不行的。因为之前，MySQL 的密码认证插件是 `mysql_native_password`，而现在使用的是 `caching_sha2_password`。因为当前有很多数据库工具和链接包都不支持 `caching_sha2_password`，为了方便，我暂时还是改回了 `mysql_native_password` 认证插件。在 `MySQL` 中执行命令：
```mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '新密码';
```

## 用 `Homebrew` 安装

### 安装命令
```shell
# 安装 mysql
brew install mysql
```

执行如下：

![1](1.png)

![2](2.png)

### 启动 `MySQL`
```shell
mysql.server start

# 或者
brew services start mysql
```
执行如下：

![3](3.png)

### 初始化
 任意路径执行命令：`mysql_secure_installation`，交互过程中不断输入 `y` 或者 `n`
```shell
Securing the MySQL server deployment.
Connecting to MySQL using a blank password.
VALIDATE PASSWORD COMPONENT can be used to test passwords
and improve security. It checks the strength of password
and allows the users to set only those passwords which are
secure enough. Would you like to setup VALIDATE PASSWORD component?

Press y|Y for Yes, any other key for No: n   //这个选yes的话密码长度就必须要设置为8位以上，但我只想要6位的
Please set the password for root here.
New password:                   //设置密码
Re-enter new password:          //再一次确认密码

By default, a MySQL installation has an anonymous user,
allowing anyone to log into MySQL without having to have
a user account created for them. This is intended only for
testing, and to make the installation go a bit smoother.
You should remove them before moving into a production
environment.

Remove anonymous users? (Press y|Y for Yes, any other key for No) : y   //移除不用密码的那个账户
Success.

Normally, root should only be allowed to connect from 'localhost'. This ensures that someone cannot guess at the root password from the network.

Disallow root login remotely? (Press y|Y for Yes, any other key for No) : n   //不接受 root 远程登录账号

... skipping.
By default, MySQL comes with a database named 'test' that anyone can access. This is also intended only for testing,and should be removed before moving into a production environment.

Remove test database and access to it? (Press y|Y for Yes, any other key for No) : y //删除 text 数据库

- Dropping test database...
Success.
- Removing privileges on test database...
Success.
Reloading the privilege tables will ensure that all changes made so far will take effect immediately.

Reload privilege tables now? (Press y|Y for Yes, any other key for No) : y

Success.
All done!
```

OK！这样 `brew` 提示中的第一步就完成！接下来就可以尝试登陆了：
```shell
# 登陆 mysql：
mysql -u root -p

# 停止 mysql：
mysql.server stop
# 或者
brew services stop mysql
```

### 查看状态 
```shell
mysql.server status 
# 或者 
ps -ef|grep mysqld
```












