---
title: '[Spring Cloud Netflix] 8 HystrixDashboard  使用熔断器仪表盘监控'
catalog: true
date: 2019-07-04 02:25:31
subtitle: 使用熔断器仪表盘监控
header-img: /img/springcloudnetflix/springcloudnetflix_bg2.png
tags:
- Spring Cloud Netflix
---

## 概述
在 Ribbon 和 Feign 项目增加 Hystrix 仪表盘功能，两个项目的改造方式相同

## 创建熔断器仪表盘
### 在 `pom.xml` 中增加依赖
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix-dashboard</artifactId>
</dependency>
```

### 在 Application 中增加 `@EnableHystrixDashboard` 注解
```java
package com.funtl.hello.spring.cloud.web.admin.ribbon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;
import org.springframework.cloud.netflix.hystrix.dashboard.EnableHystrixDashboard;

@SpringBootApplication
@EnableDiscoveryClient
@EnableHystrix
@EnableHystrixDashboard
public class WebAdminRibbonApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebAdminRibbonApplication.class, args);
    }
}
```

### 创建 hystrix.stream 的 Servlet 配置
Spring Boot 2.x 版本开启 Hystrix Dashboard 与 Spring Boot 1.x 的方式略有不同，需要增加一个 `HystrixMetricsStreamServlet` 的配置，代码如下：
```java
package com.funtl.hello.spring.cloud.web.admin.ribbon.config;

import com.netflix.hystrix.contrib.metrics.eventstream.HystrixMetricsStreamServlet;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HystrixDashboardConfiguration {

    @Bean
    public ServletRegistrationBean getServlet() {
        HystrixMetricsStreamServlet streamServlet = new HystrixMetricsStreamServlet();
        ServletRegistrationBean registrationBean = new ServletRegistrationBean(streamServlet);
        registrationBean.setLoadOnStartup(1);
        registrationBean.addUrlMappings("/hystrix.stream");
        registrationBean.setName("HystrixMetricsStreamServlet");
        return registrationBean;
    }
}
```

### 测试 Hystrix Dashboard
浏览器端访问 [http://localhost:8764/hystrix](https://v_vincen.gitee.io/404.html) ，界面如下：
![1](1.png)

点击 Monitor Stream，进入下一个界面，访问 [http://localhost:8764/hi?message=HelloRibbon](https://v_vincen.gitee.io/404.html) 此时会出现监控界面：
![2](2.png)

## 附：Hystrix 说明
### 什么情况下会触发 `fallback` 方法
| 名字                   | 描述                               | 触发fallback |
| ---------------------- | ---------------------------------- | ------------ |
| EMIT                   | 值传递                             | NO           |
| SUCCESS                | 执行完成，没有错误                 | NO           |
| FAILURE                | 执行抛出异常                       | YES          |
| TIMEOUT                | 执行开始，但没有在允许的时间内完成 | YES          |
| BAD\_REQUEST           | 执行抛出HystrixBadRequestException | NO           |
| SHORT\_CIRCUITED       | 断路器打开，不尝试执行             | YES          |
| THREAD\_POOL\_REJECTED | 线程池拒绝，不尝试执行             | YES          |
| SEMAPHORE\_REJECTED    | 信号量拒绝，不尝试执行             | YES          |

### `fallback` 方法在什么情况下会抛出异常
| 名字               | 描述                           | 抛异常 |
| ------------------ | ------------------------------ | ------ |
| FALLBACK\_EMIT     | Fallback值传递                 | NO     |
| FALLBACK\_SUCCESS  | Fallback执行完成，没有错误     | NO     |
| FALLBACK\_FAILURE  | Fallback执行抛出出错           | YES    |
| FALLBACK\_REJECTED | Fallback信号量拒绝，不尝试执行 | YES    |
| FALLBACK\_MISSING  | 没有Fallback实例               | YES    |

### Hystrix Dashboard 界面监控参数
![3](3.png)

### Hystrix 常用配置信息
#### 超时时间（默认1000ms，单位：ms）
- `hystrix.command.default.execution.isolation.thread.timeoutInMilliseconds`：在调用方配置，被该调用方的所有方法的超时时间都是该值，优先级低于下边的指定配置
- `hystrix.command.HystrixCommandKey.execution.isolation.thread.timeoutInMilliseconds`：在调用方配置，被该调用方的指定方法（HystrixCommandKey 方法名）的超时时间是该值

#### 线程池核心线程数
- `hystrix.threadpool.default.coreSize`：默认为 10

#### Queue
- `hystrix.threadpool.default.maxQueueSize`：最大排队长度。默认 -1，使用 `SynchronousQueue`。其他值则使用 `LinkedBlockingQueue`。如果要从 -1 换成其他值则需重启，即该值不能动态调整，若要动态调整，需要使用到下边这个配置
- `hystrix.threadpool.default.queueSizeRejectionThreshold`：排队线程数量阈值，默认为 5，达到时拒绝，如果配置了该选项，队列的大小是该队列

**注意**： 如果 `maxQueueSize=-1` 的话，则该选项不起作用

#### 断路器
- `hystrix.command.default.circuitBreaker.requestVolumeThreshold`：当在配置时间窗口内达到此数量的失败后，进行短路。默认 20 个（10s 内请求失败数量达到 20 个，断路器开）
- `hystrix.command.default.circuitBreaker.sleepWindowInMilliseconds`：短路多久以后开始尝试是否恢复，默认 5s
- `hystrix.command.default.circuitBreaker.errorThresholdPercentage`：出错百分比阈值，当达到此阈值后，开始短路。默认 50%

#### fallback
- `hystrix.command.default.fallback.isolation.semaphore.maxConcurrentRequests`：调用线程允许请求 `HystrixCommand.GetFallback()` 的最大数量，默认 10。超出时将会有异常抛出，注意：该项配置对于 THREAD 隔离模式也起作用

#### 属性配置参数
- 参数说明：https://github.com/Netflix/Hystrix/wiki/Configuration
- HystrixProperty 参考代码：http://www.programcreek.com/java-api-examples/index.php?source_dir=Hystrix-master/hystrix-contrib/hystrix-javanica/src/test/java/com/netflix/hystrix/contrib/javanica/test/common/configuration/command/BasicCommandPropertiesTest.java


案例源码：https://github.com/V-Vincen/hello-spring-cloud
