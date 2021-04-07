---
title: '[Log4j] 2 Log4j 日志文件'
catalog: true
date: 2019-06-24 02:00:09
subtitle: Slf4j 简介
header-img: /img/log4j/log4j_bg.png
tags:
- Log4j
---

## Slf4j 简介
---
slf4j 的全称是 Simple Loging Facade For Java，即它仅仅是一个为 Java 程序提供日志输出的统一接口，并不是一个具体的日志实现方案，就比如 JDBC 一样，只是一种规则而已。所以单独的 slf4j 是不能工作的，必须搭配其他具体的日志实现方案，比如 apache 的 org.apache.log4j.Logger，JDK 自带的 java.util.logging.Logger 以及 log4j 等。

## POM
---
继续之前的项目，`pom.xml` 配置如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.funtl</groupId>
    <artifactId>hello-spring</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>4.3.17.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
            <version>1.7.25</version>
        </dependency>
    </dependencies>
</project>
```

主要增加了 `org.slf4j:slf4j-log4j12` 依赖

## 创建 `log4j.properties` 配置文件
---
在 `src/main/resources` 目录下创建名为 `log4j.properties` 的属性配置文件
```properties
log4j.rootLogger=INFO, console, file

log4j.appender.console=org.apache.log4j.ConsoleAppender
log4j.appender.console.layout=org.apache.log4j.PatternLayout
log4j.appender.console.layout.ConversionPattern=%d %p [%c] - %m%n

log4j.appender.file=org.apache.log4j.DailyRollingFileAppender
log4j.appender.file.File=logs/log.log
log4j.appender.file.layout=org.apache.log4j.PatternLayout
log4j.appender.A3.MaxFileSize=1024KB
log4j.appender.A3.MaxBackupIndex=10
log4j.appender.file.layout.ConversionPattern=%d %p [%c] - %m%n
```
日志配置相关说明：

- log4j.rootLogger：根日志，配置了日志级别为 INFO，预定义了名称为 console、file 两种附加器 
- log4j.appender.console：console 附加器，日志输出位置在控制台
- log4j.appender.console.layout：console 附加器，采用匹配器布局模式
- log4j.appender.console.layout.ConversionPattern：console 附加器，日志输出格式为：日期 日志级别 [类名] - 消息换行符 
- log4j.appender.file：file 附加器，每天产生一个日志文件
- log4j.appender.file.File：file 附加器，日志文件输出位置 logs/log.log
- log4j.appender.file.layout：file 附加器，采用匹配器布局模式
- log4j.appender.A3.MaxFileSize：日志文件最大值
- log4j.appender.A3.MaxBackupIndex：最多纪录文件数
- log4j.appender.file.layout.ConversionPattern：file 附加器，日志输出格式为：日期 日志级别 [类名] - 消息换行符

## 测试日志输出
---
创建一个测试类，并测试日志输出效果，代码如下：
```java
package com.funtl.hello.spring;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MyTest {

    public static final Logger logger = LoggerFactory.getLogger(MyTest.class);

    public static void main(String[] args) {
        logger.info("slf4j for info");
        logger.debug("slf4j for debug");
        logger.error("slf4j for error");
        logger.warn("slf4j for warn");

        String message = "Hello SLF4J";
        logger.info("slf4j message is : {}", message);
    }
}
```
此时控制台显示为：
```
2018-06-07 05:15:42,914 INFO [com.funtl.hello.spring.MyTest] - slf4j for info
2018-06-07 05:15:42,915 ERROR [com.funtl.hello.spring.MyTest] - slf4j for error
2018-06-07 05:15:42,915 WARN [com.funtl.hello.spring.MyTest] - slf4j for warn
2018-06-07 05:15:42,916 INFO [com.funtl.hello.spring.MyTest] - slf4j message is : Hello SLF4J
```
项目根目录下也会多出 `logs/log.log` 目录及文件

## 附：占位符说明
---
打日志的时候使用了 `{}` 占位符，这样就不会有字符串拼接操作，减少了无用 `String` 对象的数量，节省了内存。并且，记住，在生产最终日志信息的字符串之前，这个方法会检查一个特定的日志级别是不是打开了，这不仅降低了内存消耗而且预先降低了 `CPU` 去处理字符串连接命令的时间。