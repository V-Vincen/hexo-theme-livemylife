---
title: '[Docker] 8.2 Docker 部署 MySQL 8.0.17'
catalog: true
date: 2019-08-21 03:04:31
subtitle: Docker 部署 MySQL 8.0.17
header-img: /img/docker/docker_bg4.png
tags:
- Docker
categories:
- Docker
---

## 搜索 `MySQL` 镜像
`docker` 官网：https://hub.docker.com/_/mysql
```sh
docker search mysql
```

## 下载 `MySQL` 镜像
默认最新版本
```sh
docker pull mysql
```

## 运行 `MySQL` 容器
```sh
docker run -p 3306:3306 --name mysql \
-v /usr/local/docker/mysql/conf:/etc/mysql/conf.d/ \
-v /usr/local/docker/mysql/logs:/var/log/mysql \
-v /usr/local/docker/mysql/data:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=123456 \
-d mysql
```
命令参数：
- `-p 3306:3306`：将容器的3306端口映射到主机的3306端口
- `-v /usr/local/docker/mysql/conf:/etc/mysql/conf.d/`：将主机当前目录下的 `conf` 挂载到容器的 `/etc/mysql/conf.d/` 
- `-v /usr/local/docker/mysql/logs:/var/log/mysql`：将主机当前目录下的 `logs` 目录挂载到容器的 `/var/log/mysql`
- `-v /usr/local/docker/mysql/data:/var/lib/mysql`：将主机当前目录下的 `data` 目录挂载到容器的 `/var/lib/mysql`
- `-e MYSQL_ROOT_PASSWORD=123456`：初始化 `root` 用户的密码
- 

## 查看容器是否运行
```sh
docker ps
```

## 进入 `MySQL` 容器
```sh
docker exec -it mysql bash
```

## 在容器内登陆 `MySQL`
```sh
mysql -uroot -p123456
```

## 查看用户信息并赋予访问权限
```sql
select host,user,plugin,authentication_string from mysql.user;
```
结果：
```
mysql> select host,user,plugin,authentication_string from mysql.user;
+-----------+------------------+-----------------------+------------------------------------------------------------------------+
| host      | user             | plugin                | authentication_string                                                  |
+-----------+------------------+-----------------------+------------------------------------------------------------------------+
| %         | root             | caching_sha2_password | $A$005$f+WN\N>cQO#;SqoIG3n5hmq/r6LF5EV2/O4lp5VMw3JQXQfz6DzHeqWV0 |
| localhost | mysql.infoschema | caching_sha2_password | $A$005$THISISACOMBINATIONOFINVALIDSALTANDPASSWORDTHATMUSTNEVERBRBEUSED |
| localhost | mysql.session    | caching_sha2_password | $A$005$THISISACOMBINATIONOFINVALIDSALTANDPASSWORDTHATMUSTNEVERBRBEUSED |
| localhost | mysql.sys        | caching_sha2_password | $A$005$THISISACOMBINATIONOFINVALIDSALTANDPASSWORDTHATMUSTNEVERBRBEUSED |
| localhost | root             | caching_sha2_password | $A$005$I	T9Cz|
                                                                             VE\ 
9AXGgVLqIOitU4MzwycwC/jRXmroU2M.pObTLs9T5tz7 |
+-----------+------------------+-----------------------+------------------------------------------------------------------------+
5 rows in set (0.00 sec)
```
备注：
- `host` 为 `%` 表示不限制 `ip`   
- `localhost` 表示本机使用
- `plugin` 非 `mysql_native_password` 则需要修改密码

```sql
ALTER user 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456';

FLUSH PRIVILEGES; 
```
再次查询：
```
mysql> select host,user,plugin,authentication_string from mysql.user;
+-----------+------------------+-----------------------+------------------------------------------------------------------------+
| host      | user             | plugin                | authentication_string                                                  |
+-----------+------------------+-----------------------+------------------------------------------------------------------------+
| %         | root             | mysql_native_password | *6BB4837EB74329105EE4568DDA7DC67ED2CA2AD9                              |
| localhost | mysql.infoschema | caching_sha2_password | $A$005$THISISACOMBINATIONOFINVALIDSALTANDPASSWORDTHATMUSTNEVERBRBEUSED |
| localhost | mysql.session    | caching_sha2_password | $A$005$THISISACOMBINATIONOFINVALIDSALTANDPASSWORDTHATMUSTNEVERBRBEUSED |
| localhost | mysql.sys        | caching_sha2_password | $A$005$THISISACOMBINATIONOFINVALIDSALTANDPASSWORDTHATMUSTNEVERBRBEUSED |
| localhost | root             | caching_sha2_password | $A$005$I	T9Cz|
                                                                             VE\ 
9AXGgVLqIOitU4MzwycwC/jRXmroU2M.pObTLs9T5tz7 |
+-----------+------------------+-----------------------+------------------------------------------------------------------------+
5 rows in set (0.01 sec)
```

最后退出：
```sql
exit; 
```