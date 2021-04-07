---
title: '[Spring Boot] 6 Spring Boot 整合 Druid、MyBatis 和 PageHelper'
catalog: true
date: 2019-06-30 00:52:22
subtitle: 整合 Druid、MyBatis 和 PageHelper
header-img: /img/springboot/pagehelper_bg.png
tags:
- Spring Boot
- Druid
- PageHelper
---

## Spring Boot 整合 Druid

### 概述
Druid 是阿里巴巴开源平台上的一个项目，整个项目由数据库连接池、插件框架和 SQL 解析器组成。该项目主要是为了扩展 JDBC 的一些限制，可以让程序员实现一些特殊的需求，比如向密钥服务请求凭证、统计 SQL 信息、SQL 性能收集、SQL 注入检查、SQL 翻译等，程序员可以通过定制来实现自己需要的功能。

Druid 是目前最好的数据库连接池，在功能、性能、扩展性方面，都超过其他数据库连接池，包括 DBCP、C3P0、BoneCP、Proxool、JBoss DataSource。Druid 已经在阿里巴巴部署了超过 600 个应用，经过多年生产环境大规模部署的严苛考验。Druid 是阿里巴巴开发的号称为监控而生的数据库连接池！

### 引入依赖
---
在 `pom.xml` 文件中引入 `druid-spring-boot-starter` 依赖
```xml
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid-spring-boot-starter</artifactId>
        <version>1.1.10</version>
    </dependency>
```

引入数据库连接依赖
```xml
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <scope>runtime</scope>
    </dependency>
```

### 配置 `application.yml`
在 `application.yml` 中配置数据库连接
```ym
spring:
  datasource:
    druid:
      url: jdbc:mysql://ip:port/dbname?useUnicode=true&characterEncoding=utf-8&useSSL=false
      username: root
      password: 123456
      initial-size: 1
      min-idle: 1
      max-active: 20
      test-on-borrow: true
      # MySQL 8.x: com.mysql.cj.jdbc.Driver
      driver-class-name: com.mysql.jdbc.Driver
```


## Spring Boot 整合 tk.mybatis
###  概述
tk.mybatis 是在 MyBatis 框架的基础上提供了很多工具，让开发更加高效

### 引入依赖
---
在 `pom.xml` 文件中引入 `mapper-spring-boot-starter` 依赖，该依赖会自动引入MyBaits相关依赖
```xml
    <dependency>
        <groupId>tk.mybatis</groupId>
        <artifactId>mapper-spring-boot-starter</artifactId>
        <version>2.0.2</version>
    </dependency>
```

### 配置 `application.yml`
配置 MyBatis
```yml
mybatis:
 type-aliases-package: 实体类的存放路径，如：com.funtl.hello.spring.boot.entity
 mapper-locations: classpath:mapper/*.xml
```

### 创建一个通用的父级接口
---
主要作用是让 DAO 层的接口继承该接口，以达到使用 tk.mybatis 的目的
```java
    package com.funtl.utils;
    
    import tk.mybatis.mapper.common.Mapper;
    import tk.mybatis.mapper.common.MySqlMapper;
    
    /**
     * 自己的 Mapper
     * 特别注意，该接口不能被扫描到，否则会出错
     * <p>Title: MyMapper</p>
     * <p>Description: </p>
     *
     * @author Lusifer
     * @version 1.0.0
     * @date 2018/5/29 0:57
     */
    public interface MyMapper<T> extends Mapper<T>, MySqlMapper<T> {
    }
```

## Spring Boot 整合 PageHelper
### 概述
PageHelper 是 Mybatis 的分页插件，支持多数据库、多数据源。可以简化数据库的分页查询操作，整合过程也极其简单，只需引入依赖即可。

### 引入依赖
在 `pom.xml` 文件中引入 `pagehelper-spring-boot-starter` 依赖
```xml
	<dependency>
	    <groupId>com.github.pagehelper</groupId>
	    <artifactId>pagehelper-spring-boot-starter</artifactId>
	    <version>1.2.10</version>
	</dependency>
```

