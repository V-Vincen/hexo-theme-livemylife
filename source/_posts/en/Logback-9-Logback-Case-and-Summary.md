---
title: '[Logback] 9 Logback Case and Summary'
catalog: true
date: 2021-01-18 15:39:40
subtitle: Case and Summary...
header-img: /img/header_img/categories_bg5.jpg
tags:
- Logback
---

## 为什么使用 Logback
记得前几年工作的时候，公司使用的日志框架还是 log4j，大约从16年中到现在，日志框架基本都换成了logback，总结一下，logback 大约有以下的一些优点：
* 内核重写、测试充分、初始化内存加载更小，这一切让 logback 性能和 log4j 相比有诸多倍的提升。
* logback 非常自然地直接实现了 slf4j，这个严格来说算不上优点，只是这样，再理解 slf4j 的前提下会很容易理解 logback，也同时很容易用其他日志框架替换 logback。
* logback 有比较齐全的200多页的文档。
* logback 当配置文件修改了，支持自动重新加载配置文件，扫描过程快且安全，它并不需要另外创建一个扫描线程。
* 支持自动去除旧的日志文件，可以控制已经产生日志文件的最大数量。

总而言之，如果大家的项目里面需要选择一个日志框架，那么我个人非常建议使用 logback。

## Logback 加载
我们简单分析一下 logback 加载过程，当我们使用 logback-classic.jar 时，应用启动，那么 logback 会按照如下顺序进行扫描：

* logback 会在类路径下寻找名为 logback-test.xml 的文件。
* 如果没有找到，logback 会继续寻找名为 logback.groovy 的文件。
* 如果没有找到，logback 会继续寻找名为 logback.xml 的文件。
* 如果没有找到，将会通过 JDK 提供的 ServiceLoader 工具在类路径下寻找文件 `META-INFO/services/ch.qos.logback.classic.spi.Configurator`，该文件的内容为实现了 `Configurator` 接口的实现类的全限定类名。
* 如果以上都没有成功，logback 会通过 [BasicConfigurator](https://logback.qos.ch/xref/ch/qos/logback/classic/BasicConfigurator.html) 为自己进行配置，并且日志将会全部在控制台打印出来。

最后一步的目的是为了保证在所有的配置文件都没有被找到的情况下，提供一个默认的（但是是非常基础的）配置（默认日志输出格式为 `%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n`）。如果你使用的是 maven，你可以在 src/test/resources 下新建 logback-test.xml。maven 会确保它不会被生成。所以你可以在测试环境中给配置文件命名为 logback-test.xml，在生产环境中命名为 logback.xml。更多内容可查看 [[Logback] 3 Logback 的配置](https://V-Vincen.github.io/2020/12/31/Logback-3-Logback%20%E7%9A%84%E9%85%8D%E7%BD%AE/)。

## 案例
###  SpringBoot Logging 配置
在网上搜了些 Logging 配置，发现千篇一律。基本上没讲述全的，在这推荐大家直接看 spring boot 官方文档：[Spring Boot docs – Boot Features Logging](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-logging)

#### `application.properties` 基础配置
```properties
# 将运行输出保存到本地文件
logging.file.name=log/my.log

# root 代表全局默认设置
logging.level.root=info
logging.level.org.springframework.web=debug

# 用于配置外部 logback-spring.xml
#logging.config=classpath:config/logback-spring.xml
```

> 日志级别的排序为：TRACE < DEBUG < INFO < WARN < ERROR。

### Logback 配置
#### pom.xml
```xml
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-access</artifactId>
    <version>1.2.3</version>
</dependency>
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.3</version>
</dependency>
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-core</artifactId>
    <version>1.2.3</version>
</dependency>
```

#### `application.properties`
```properties
# 用于配置外部 logback-spring.xml
logging.config=classpath:config/logback-spring.xml
```

#### `logback-spring.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>

<!-- debug="true"：获取 logback 的内部状态信息。-->
<!-- scan="true"：配置文件改变的时候自动去扫描（默认情况下，一分钟扫描一次配置文件）；scanPeriod：指定扫描周期。-->
<!-- packagingData="true"：展示包数据，在堆栈的每一行显示 jar 包的名字以及 jar 的版本号（在频繁报错的情况下代价比较高）。-->
<configuration scan="true" scanPeriod="60 seconds" packagingData="true">
    <!-- 强制输出 logback 的内部状态信息，等同于上面的 debug="true" -->
    <!--    <statusListener class="ch.qos.logback.core.status.OnConsoleStatusListener" />-->

    <property name="log.path" value="log"/>

    <!--输出到控制台-->
    <!-- 此日志 appender 是为开发使用，只配置最底级别。 -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <!-- ThresholdFilter：基于给定的临界值来过滤事件。如果事件的级别等于或高于给定的临界值，将会返回 NEUTRAL。低于临界值将会被拒绝。-->
        <!-- <filter class="ch.qos.logback.classic.filter.ThresholdFilter">-->
        <!--    <level>info</level>-->
        <!-- </filter>-->
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
            <!-- 设置字符集 -->
            <charset>UTF-8</charset>
        </encoder>
    </appender>

    <!--输出到文件-->
    <timestamp key="bySecond" datePattern="yyyy_MM_dd"/>

    <!-- DEBUG 日志 -->
    <appender name="DEBUG_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!-- 正在记录的日志文件的路径及文件名 -->
        <file>${log.path}/debug_log_${bySecond}.log</file>
        <!-- immediateFlush：立即刷新（默认值为 true）。
                            1.设置这个属性为 true 时，立即刷新输出流可以确保日志事件被立即写入，并且可以保证一旦你的应用没有正确关闭 appender，日志事件也不会丢失。
                            2.设置这个属性为 false 时，有可能会使日志的吞吐量翻两番（视情况而定）。但是，设置为 false，当应用退出的时候没有正确关闭 appender，会导致日志事件没有被写入磁盘，可能会丢失。-->
        <immediateFlush>false</immediateFlush>
        <!-- 日志文件输出格式 -->
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
            <!-- 设置字符集 -->
            <charset>UTF-8</charset>
        </encoder>

        <!-- 日志归档：日志记录器的滚动策略，按日期，按大小记录 -->
        <!-- SizeAndTimeBasedRollingPolicy：基于时间和日志文件大小定义轮转策略。-->
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <!-- fileNamePattern：推断轮转周期（下面是按天来轮转的）。-->
            <fileNamePattern>${log.path}/debug/debug-log.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <!-- maxFileSize：控制归档文件每个日志文件的大小，当达到这个大小后，递增索引（%i）从0开始归档。-->
            <maxFileSize>100MB</maxFileSize>
            <!-- maxHistory：控制归档文件保留的最大数目，并删除旧的文件。（15天）-->
            <maxHistory>15</maxHistory>
            <!-- totalSizeCap：控制所有归档文件总的大小，当达到这个大小后，旧的归档文件将会被异步的删除。（最大大小为10GB）-->
            <totalSizeCap>10GB</totalSizeCap>
        </rollingPolicy>
        <!-- LevelFilter：基于级别来过滤日志事件。如果事件的级别与配置的级别相等，过滤器会根据配置的 onMatch 与 onMismatch 属性，接受或者拒绝事件（此日志文件只记录 debug 级别的）。-->
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>debug</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <!--INFO 日志 -->
    <appender name="INFO_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${log.path}/info_log_${bySecond}.log</file>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>

        <!-- 日志归档：日志记录器的滚动策略，按日期，按大小记录 -->
        <!-- TimeBasedRollingPolicy：基于时间和日志文件大小定义轮转策略。-->
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${log.path}/info/info-log.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <!-- maxFileSize：控制归档文件每个日志文件的大小，当达到这个大小后，递增索引（%i）从0开始归档。-->
            <maxFileSize>100MB</maxFileSize>
            <!-- maxHistory：控制归档文件保留的最大数目，并删除旧的文件。（15天）-->
            <maxHistory>15</maxHistory>
            <!-- totalSizeCap：控制所有归档文件总的大小，当达到这个大小后，旧的归档文件将会被异步的删除。（最大大小为10GB）-->
            <totalSizeCap>10GB</totalSizeCap>
        </rollingPolicy>
        <!-- LevelFilter：基于级别来过滤日志事件。如果事件的级别与配置的级别相等，过滤器会根据配置的 onMatch 与 onMismatch 属性，接受或者拒绝事件（此日志文件只记录 info 级别的）。-->
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>info</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <!-- WARN 日志 -->
    <appender name="WARN_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${log.path}/warn_log_${bySecond}.log</file>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>

        <!-- 日志归档：日志记录器的滚动策略，按日期，按大小记录 -->
        <!-- TimeBasedRollingPolicy：基于时间和日志文件大小定义轮转策略。-->
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${log.path}/warn/warn-log.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <!-- maxFileSize：控制归档文件每个日志文件的大小，当达到这个大小后，递增索引（%i）从0开始归档。-->
            <maxFileSize>100MB</maxFileSize>
            <!-- maxHistory：控制归档文件保留的最大数目，并删除旧的文件。（15天）-->
            <maxHistory>15</maxHistory>
            <!-- totalSizeCap：控制所有归档文件总的大小，当达到这个大小后，旧的归档文件将会被异步的删除。（最大大小为10GB）-->
            <totalSizeCap>10GB</totalSizeCap>
        </rollingPolicy>
        <!-- LevelFilter：基于级别来过滤日志事件。如果事件的级别与配置的级别相等，过滤器会根据配置的 onMatch 与 onMismatch 属性，接受或者拒绝事件（此日志文件只记录 warn 级别的）。-->
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>warn</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <!-- ERROR 日志 -->
    <appender name="ERROR_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${log.path}/error_log_${bySecond}.log</file>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>

        <!-- 日志归档：日志记录器的滚动策略，按日期，按大小记录 -->
        <!-- TimeBasedRollingPolicy：基于时间和日志文件大小定义轮转策略。-->
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${log.path}/error/error-log.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <!-- maxFileSize：控制归档文件每个日志文件的大小，当达到这个大小后，递增索引（%i）从0开始归档。-->
            <maxFileSize>100MB</maxFileSize>
            <!-- maxHistory：控制归档文件保留的最大数目，并删除旧的文件。（15天）-->
            <maxHistory>15</maxHistory>
            <!-- totalSizeCap：控制所有归档文件总的大小，当达到这个大小后，旧的归档文件将会被异步的删除。（最大大小为10GB）-->
            <totalSizeCap>10GB</totalSizeCap>
        </rollingPolicy>
        <!-- LevelFilter：基于级别来过滤日志事件。如果事件的级别与配置的级别相等，过滤器会根据配置的 onMatch 与 onMismatch 属性，接受或者拒绝事件（此日志文件只记录 error 级别的）。-->
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>error</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <!-- 异步输出 -->
    <!-- AsyncAppender：异步的打印 ILoggingEvent。它仅仅是作为一个事件调度器的存在，因此必须调用其它的 appender 来完成操作 -->
    <appender name="ASYNC" class="ch.qos.logback.classic.AsyncAppender">
        <!-- queueSize：队列的最大容量，默认为 256。-->
        <queueSize>256</queueSize>
        <!-- discardingThreshold：默认，当队列还剩余 20% 的容量时，会丢弃级别为 TRACE, DEBUG 与 INFO 的日志，仅仅只保留 WARN 与 ERROR 级别的日志。想要保留所有的事件，可以设置为 0。-->
        <discardingThreshold>0</discardingThreshold>
        <!-- includeCallerData：表示是否提取调用者数据，这个值被设置为 true  的代价是相当昂贵的，默认情况下不会获取调用者的信息。-->
        <!-- <includeCallerData>true</includeCallerData>-->
        <!-- appender-ref：表示 AsyncAppender 使用哪个具体的 <appender> 进行日志输出，最多只能添加一个。-->
        <appender-ref ref="INFO_FILE"/>
    </appender>

    <!--开发环境：打印控制台-->
    <springProfile name="dev">
        <!-- com.example.logback 依赖被调用 logger 的有效日志级别是 debug，
        所以其子类 com.example.logback.LogbackApplicationTests 所依赖的有效 logger 日志级别也是 debug；
        而不是 appender，name="CONSOLE" 所依附的 logger（也就是 root）的级别 info；
        总结就是 com.example.logback.LogbackApplicationTests 类的有效 logger 日志级别是 debug。-->
        <logger name="com.example.logback" level="debug"/>
        <root level="info">
            <appender-ref ref="CONSOLE"/>
            <appender-ref ref="DEBUG_FILE"/>
            <appender-ref ref="INFO_FILE"/>
            <appender-ref ref="WARN_FILE"/>
            <appender-ref ref="ERROR_FILE"/>
        </root>
    </springProfile>

    <!--测试环境：打印控制台-->
    <springProfile name="test">
        <!-- 1.将 com.example.logback 包下的 debug 级别的日志单独记录到 log_debug.log 文件中，根据当前 logger 的日志级别来判断是否写入日志文件中：
                1.1 当前 logger 的日志级别是 debug，会拿到大于等于 debug 的全部日志，同时该包的 appender name="DEBUG_FILE" 只匹配 debug 级别的日志，所以会写入 log_debug.log 文件中；
                1.2 如果当前 logger 没用设置 level="debug" 该属性，那么会寻找父级的日志级别，而当前包的父级为 root，root 的日志级别为 info，所以只能拿到大于等于 info 的全部日志，
                    但是该包的 appender name="DEBUG_FILE" 只匹配 debug 级别的日志，所以没用任何的日志会写入 log_debug.log 文件中。
             2.additivity 属性：为叠加输出（默认为 true）：
                2.1 当 additivity="true" 时，因为当前 logger 的日志级别是 debug，所以该包下的日志会全部向父级传递，并会全部打印在控制台；
                2.2 当 additivity="false" 时，该包下的全部日志不会向父级传递，控制台不会打印任何日志。-->
        <logger name="com.example.logback" level="debug" additivity="false">
            <appender-ref ref="DEBUG_FILE"/>
        </logger>
        <root level="info">
            <appender-ref ref="CONSOLE"/>
        </root>
    </springProfile>

    <!--生产环境:输出到文件-->
    <springProfile name="prod">
        <logger name="com.example.logback" level="debug"/>
        <root level="info">
            <appender-ref ref="CONSOLE"/>
            <appender-ref ref="DEBUG_FILE"/>
            <appender-ref ref="INFO_FILE"/>
            <appender-ref ref="WARN_FILE"/>
            <appender-ref ref="ERROR_FILE"/>
        </root>
    </springProfile>
</configuration>
```

注：`Spring Profile` 的用法可参靠 [[Spring Profile] How to Use Spring Profile](http://V-Vincen.github.io/2021/01/18/Spring-Profile-How-to-Use-Spring-Profile/)

#### 测试类
**Foo.class**
```java
package com.example.logback.testlogback;

import lombok.extern.slf4j.Slf4j;

/**
 * @author vincent
 */
@Slf4j
public class Foo {
    public void doIt() throws NoSuchMethodException {
        log.debug("Did it again!");
    }
}
```

**LogbackApplicationTests.class**
```java
package com.example.logback;

import com.example.logback.testlogback.Foo;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@Slf4j
@SpringBootTest
@ActiveProfiles("dev")
class LogbackApplicationTests {

    @Test
    void contextLoads() {
    }

    @Test
    public void logTest() {
        log.debug("logback debug...");
        log.info("logback info..");
        log.warn("logback warn..");
        log.error("logback error..");
    }

    @Test
    public void fooTest() throws NoSuchMethodException {
        log.info("Entering application...");
        Foo foo = new Foo();
        foo.doIt();
        log.info("Exiting application...");
    }
}
```

案例源码：https://github.com/V-Vincen/logback
