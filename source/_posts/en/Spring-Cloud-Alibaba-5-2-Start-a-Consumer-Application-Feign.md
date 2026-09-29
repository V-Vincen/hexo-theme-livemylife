---
title: '[Spring Cloud Alibaba] 5.2 Start a Consumer Application - Feign'
catalog: true
lang: en
date: 2021-05-27 13:41:03
subtitle: Access the service by using RestTemplate and FeignClient with load balancing...
header-img: /img/springcloudalibaba/springcloudalibaba_bg.png
tags:
- Spring Cloud Alibaba
---

## 概述
Feign 是一个声明式的伪 Http 客户端，它使得写 Http 客户端变得更简单。使用 Feign，只需要创建一个接口并注解。它具有可插拔的注解特性，可使用 Feign 注解和 JAX-RS 注解。Feign 支持可插拔的编码器和解码器。Feign 默认集成了 Ribbon，Nacos 也很好的兼容了 Feign，默认实现了负载均衡的效果。更多详情可查看：https://v-vincen.github.io/tags/#OpenFeign

- Feign 采用的是基于接口的注解。
- Feign 整合了 ribbon。


## 案例
### POM
创建一个工程名为 `hello-spring-cloud-alibaba-nacos-consumer-feign` 的服务消费者项目，`pom.xml` 配置如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.example</groupId>
        <artifactId>hello-spring-cloud-alibaba</artifactId>
        <version>0.0.1-SNAPSHOT</version>
    </parent>

    <artifactId>hello-spring-cloud-alibaba-nacos-consumer-feign</artifactId>
    <packaging>jar</packaging>

    <name>hello-spring-cloud-alibaba-nacos-consumer-feign</name>
    <version>${parent.version}</version>
    <url>https://v-vincen.life</url>
    <inceptionYear>2021-Now</inceptionYear>
    <description>Demo project for Nacos Consumer Feign</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <!-- Spring Boot Begin -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!-- Spring Boot End -->

        <!-- Spring Cloud Begin -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
        <!-- Spring Cloud Begin -->

        <!-- Spring Cloud Alibaba Begin -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-loadbalancer</artifactId>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <!-- Spring Cloud Alibaba End -->

    </dependencies>

    <build>
        <finalName>${project.artifactId}</finalName>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <executions>
                    <execution>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```
主要增加了 `org.springframework.cloud:spring-cloud-starter-openfeign` 依赖。

### Application
```java
/**
 * @author vincent 
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class HelloSpringCloudAlibabaNacosConsumerFeignApplication {
    public static void main(String[] args) {
        SpringApplication.run(HelloSpringCloudAlibabaNacosConsumerFeignApplication.class, args);
    }
}
```

### Feign 接口、EchoServiceFallback、Configuration
通过 `@FeignClient("服务名")` 注解来指定调用哪个服务，代码如下。
```java
/**
 * @author vincent
 */
@FeignClient(name = "nacos-provider", fallback = EchoServiceFallback.class, configuration = FeignConfiguration.class)
public interface EchoService {
    @GetMapping(value = "/echo/{message}")
    String echo(@PathVariable("message") String message);

    @GetMapping(value = "/echo/feignLoadBalanced/{message}")
    @LoadBalanced
    String echoFeignLoadBalanced(@PathVariable("message") String message);
}
```

```java
/**
 * @author vincent
 */
public class EchoServiceFallback implements EchoService {
    @Override
    public String echo(String message) {
        return "echo fallback";
    }

    @Override
    public String echoFeignLoadBalanced(String message) {
        return "echoFeignLoadBalanced fallback";
    }
}
```

```java
/**
 * @author vincent
 */
@Configuration
public class FeignConfiguration {
    @Bean
    public EchoServiceFallback echoServiceFallback() {
        return new EchoServiceFallback();
    }
}
```

### Controller
创建一个名为 NacosConsumerFeignController 测试用的 Controller。
```java
/**
 * @author vincent
 */
@RestController
public class NacosConsumerFeignController {
    @Autowired
    private EchoService echoService;

    @GetMapping(value = "/echo")
    public String echo() {
        return echoService.echo("Hi Feign");
    }

    @GetMapping(value = "/echo/feignLoadBalanced")
    public String echoFeignLoadBalanced() {
        return echoService.echoFeignLoadBalanced("Hi Feign");
    }
}
```

### application.yml
```yml
spring:
  application:
    name: nacos-consumer-feign
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848

server:
  port: 9092

management:
  endpoints:
    web:
      exposure:
        include: "*"
```

## 启动工程
通过浏览器访问 [http://localhost:8848/nacos](https://v-vincen.github.io/404.html)，即 Nacos Server 网址。

![nacos_consumer_feign](nacos_consumer_feign.png)

你会发现多了一个名为 `nacos-consumer-feign` 的服务，这时打开 [http://localhost:9092/echo](https://v-vincen.github.io/404.html) ，你都会在浏览器上看到：
```
Hello Nacos Discovery Hi Feign
```

## 测试负载均衡
启动多个 `consumer-provider` 实例，效果图如下：

![consumer-provider](consumer-provider.png)

修改 `consumer-provider` 项目中的 Controller 代码，用于确定负载均衡生效。
```java
/**
 * @author vincent
 */
@RestController
public class NacosProviderController {
    @GetMapping(value = "/echo/{message}")
    public String echo(@PathVariable String message) {
        return "Hello Nacos Discovery " + message;
    }

    @Value("${server.port}")
    private String port;

    @GetMapping(value = "/echo/feignLoadBalanced/{message}")
    public String echoFeignLoadBalanced(@PathVariable String message) {
        return "Hello Nacos Discovery " + message + " i am from port " + port;
    }
}
```

在浏览器上多次访问 [http://localhost:9092/echo/feignLoadBalanced](https://v-vincen.github.io/404.html) ，浏览器交替显示：
```
Hello Nacos Discovery Hi Feign i am from port 8081
Hello Nacos Discovery Hi Feign i am from port 8082
```

