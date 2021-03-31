---
title: '[Mybatis] Mybatis 思维导图'
catalog: true
date: 2019-06-26 18:48:28
subtitle: 图解 Mybatis
header-img: /img/mybatis/mybatis_bg2.png
tags:
- Mybatis
---

参考：https://www.jianshu.com/p/06b73e8d9f56

## 写在前面
Mybatis 与 Hibernate 相比：简单上手和掌握；sql 语句和代码分开，方便统一管理和优化；当然缺点也有：sql 工作量很大，尤其是字段多、关联表多时，更是如此。而且 sql 依赖于数据库，导致数据库移植性差。

## Mybatis简介
MyBatis 是支持普通 SQL 查询，存储过程和高级映射的优秀持久层框架。MyBatis 消除了几乎所有的 JDBC 代码和参数的手工设置以及结果集的检索。MyBatis 使用简单的 XML 或注解用于配置和原始映射，将接口和 Java 的 POJOs（Plain Old Java Objects，普通的 Java 对象）映射成数据库中的记录。

## 直接上思维导图
### mybatis 简介
![1](1.png)

### 与 hibernate 对比
![2](2.png)

### 几个关键类
![3](3.png)

### mybatis 执行浅析
![4](4.png)

### MyBatis 框架整体设计
![5](5.png)

### mybatis 初始化与执行 sql 过程
![6](6.png)


### mybatis 源码的几个主要部件
![7](7.png)

### XML 映射配置文件（一）
![8](8.png)

### XML 映射配置文件（二）
![9](9.png)

### XML 映射配置文件（三）
![10](10.png)


## 写在最后
这一篇只写了 Mybatis 的原理和配置文件的基本实用。