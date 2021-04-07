---
title: '[Log4j] 1 Log4j 简介'
catalog: true
date: 2019-06-24 01:18:16
subtitle: Log4j 简介
header-img: /img/log4j/log4j_bg.png
tags:
- Log4j
---

## Log4j 日志级别
---
为了方便对于日志信息的输出显示，对日志内容进行了分级管理。日志级别由高到低，共分 6 个级别：
- fatal(致命的)
- error
- warn
- info
- debug
- trace(堆栈)

## Log4j 日志输出控制文件
---
### 日志输出简介
Log4j 的日志输出控制文件，主要由三个部分构成：
- 日志信息的输出位置：控制日志信息将要输出的位置，是控制台还是文件等。
- 日志信息的输出格式：控制日志信息的显示格式，即以怎样的字符串形式显示。
- 日志信息的输出级别：控制日志信息的显示内容，即显示哪些级别的日志信息。

有了日志输出控制文件，代码中只要设置好日志信息内容及其级别即可，通过控制文件便可控制这些日志信息的输出了。

### 日志属性配置文件
日志属性文件 log4j.properties 是专门用于控制日志输出的。其主要进行三方面控制：
- 输出位置：控制日志将要输出的位置，是控制台还是文件等。
- 输出布局：控制日志信息的显示形式。
- 输出级别：控制要输出的日志级别。

日志属性文件由两个对象组成：日志附加器与根日志。

根日志，即为 Java 代码中的日志记录器，其主要由两个属性构成：日志输出级别与日志附加器。

日志附加器，则由日志输出位置定义，由其它很多属性进行修饰，如输出布局、文件位置、文件大小等。

### 什么是日志附加器？
所谓日志附加器，就是为日志记录器附加上很多其它设置信息。附加器的本质是一个接口，其定义语法为： `log4j.appender.appenderName` = `输出位置`

### 常用的附加器实现类
- `org.apache.log4j.ConsoleAppender`：日志输出到控制台
- `org.apache.log4j.FileAppender`：日志输出到文件
- `org.apache.log4j.RollingFileAppender`：当日志文件大小到达指定尺寸的时候将产生一个新的日志文件
- `org.apache.log4j.DailyRollingFileAppender`：每天产生一个日志文件

### 常用布局类型
- `org.apache.log4j.HTMLLayout`：网页布局，以 HTML 表格形式布局
- `org.apache.log4j.SimpleLayout`：简单布局，包含日志信息的级别和信息字符串
- `org.apache.log4j.PatternLayout`：匹配器布局，可以灵活地指定布局模式。其主要是通过设置 PatternLayout 的 ConversionPattern 属性值来控制具体输出格式的 。

打印参数: Log4J 采用类似 C 语言中的 printf 函数的打印格式格式化日志信息
- `%m`：输出代码中指定的消息
- `%p`：输出优先级，即 `DEBUG`，`INFO`，`WARN`，`ERROR`，FATAL
- `%r`：输出自应用启动到输出该 log 信息耗费的毫秒数
- `%c`：输出所属的类目，通常就是所在类的全名
- `%t`：输出产生该日志事件的线程名
- `%n`：输出一个回车换行符，Windows 平台为 `/r/n`，Unix 平台为 `/n`
- `%d`：输出日志时间点的日期或时间，默认格式为 ISO8601，也可以在其后指定格式，比如：`%d{yyy MMM dd HH:mm:ss , SSS}`，输出类似：2002年10月18日 22:10:28,921
- `%l`：输出日志事件的发生位置，包括类目名、发生的线程，以及在代码中的行数。举例：Testlog4.main(TestLog4.java: 10 )