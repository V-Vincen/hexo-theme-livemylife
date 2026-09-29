---
title: '[Spring Cloud Alibaba] 5.1 Start a Consumer Application - LoadBalancer'
catalog: true
lang: en
date: 2021-05-27 13:37:28
subtitle: Combining the LoadBalanceClient and RestTemolate explicitly to access the RESTful service...
header-img: /img/springcloudalibaba/springcloudalibaba_bg.png
tags:
- Spring Cloud Alibaba
---

## 概述
服务消费者的创建与服务提供者大同小异，这里采用最原始的一种方式，即显示的使用 LoadBalanceClient 和 RestTemplate 结合的方式来访问。

## 案例
### POM
创建一个工程名为 `hello-spring-cloud-alibaba-nacos-consumer` 的服务消费者项目，`pom.xml` 配置如下：
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

    <artifactId>hello-spring-cloud-alibaba-nacos-consumer</artifactId>
    <packaging>jar</packaging>

    <name>hello-spring-cloud-alibaba-nacos-consumer</name>
    <version>${parent.version}</version>
    <url>https://v-vincen.life</url>
    <inceptionYear>2021-Now</inceptionYear>
    <description>Demo project for Nacos Consumer</description>

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
            <artifactId>spring-cloud-loadbalancer</artifactId>
        </dependency>
        <!-- Spring Cloud End -->

        <!-- Spring Cloud Alibaba Begin -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <!-- Spring Cloud Alibaba End -->

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
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

### Application
```java
/**
 * @author vincent 
 */
@SpringBootApplication
@EnableDiscoveryClient
public class HelloSpringCloudAlibabaNacosConsumerApplication {
    public static void main(String[] args) {
        SpringApplication.run(HelloSpringCloudAlibabaNacosConsumerApplication.class, args);
    }
}
```

### Configuration
创建一个名为 NacosConsumerConfiguration 的 Java 配置类，主要作用是为了注入 RestTemplate。
```java
/**
 * @author vincent
 */
@Configuration
public class NacosConsumerConfiguration {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

### Controller
创建一个名为 NacosConsumerController 测试用的 Controller。
```java
/**
 * @author vincent
 */
@RestController
@Slf4j
public class NacosConsumerController {
    @Autowired
    private LoadBalancerClient loadBalancerClient;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${spring.application.name}")
    private String appName;

    @GetMapping("/echo/loadBalancerClient")
    public String echoLoadBalancerClient() {
        // Access through the combination of LoadBalanceClient and RestTemplate
        ServiceInstance serviceInstance = loadBalancerClient.choose("nacos-provider");
        String path = String.format("http://%s:%s/echo/%s", serviceInstance.getHost(), serviceInstance.getPort(), appName);
        log.info("request path: {}", path);
        return restTemplate.getForObject(path, String.class);
    }


    @Autowired
    private DiscoveryClient discoveryClient;

    @GetMapping(value = "/echo/discoveryClient")
    public String echoDiscoveryClient() {
        ServiceInstance instance = discoveryClient.getInstances("nacos-provider").stream().findFirst().orElse(null);
        if (Objects.isNull(instance)) {
            return "not find nacos-provider";
        }
        String url = String.format("%s/echo/%s", instance.getUri(), appName);
        return restTemplate.getForObject(url, String.class);
    }
}
```

### application.yml
```yml
spring:
  application:
    name: nacos-consumer
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848

server:
  port: 9091

management:
  endpoints:
    web:
      exposure:
        include: '*'
```

## 启动工程
通过浏览器访问 [http://localhost:8848/nacos](https://v-vincen.github.io/404.html)，即 Nacos Server 网址。

![nacos_consumer](nacos_consumer.png)

你会发现多了一个名为 `nacos-consumer` 的服务，这时打开 [http://localhost:9091/echo/loadBalancerClient](https://v-vincen.github.io/404.html) 或者 [http://localhost:9091/echo/discoveryClient](https://v-vincen.github.io/404.html) ，你都会在浏览器上看到：
```
Hello Nacos Discovery nacos-consumer
```

### 服务的端点检查
通过浏览器访问 [http://localhost:9091/actuator/nacosdiscovery](https://v-vincen.github.io/404.html) 你会在浏览器上看到：
```
{
  "subscribe": [
    {
      "name": "nacos-consumer",
      "groupName": "DEFAULT_GROUP",
      "clusters": "DEFAULT",
      "cacheMillis": 1000,
      "hosts": [
        {
          "instanceId": "192.168.0.138#9091#DEFAULT#DEFAULT_GROUP@@nacos-consumer",
          "ip": "192.168.0.138",
          "port": 9091,
          "weight": 1.0,
          "healthy": true,
          "enabled": true,
          "ephemeral": true,
          "clusterName": "DEFAULT",
          "serviceName": "DEFAULT_GROUP@@nacos-consumer",
          "metadata": {
            "preserved.register.source": "SPRING_CLOUD"
          },
          "ipDeleteTimeout": 30000,
          "instanceHeartBeatInterval": 5000,
          "instanceHeartBeatTimeOut": 15000
        }
      ],
      "lastRefTime": 0,
      "checksum": "",
      "allIPs": false,
      "valid": true
    }
  ],
  "NacosDiscoveryProperties": {
    "serverAddr": "127.0.0.1:8848",
    "username": "",
    "password": "",
    "endpoint": "",
    "namespace": "",
    "watchDelay": 30000,
    "logName": "",
    "service": "nacos-consumer",
    "weight": 1.0,
    "clusterName": "DEFAULT",
    "group": "DEFAULT_GROUP",
    "namingLoadCacheAtStart": "false",
    "metadata": {
      "preserved.register.source": "SPRING_CLOUD"
    },
    "registerEnabled": true,
    "ip": "192.168.0.138",
    "networkInterface": "",
    "port": 9091,
    "secure": false,
    "accessKey": "",
    "secretKey": "",
    "heartBeatInterval": null,
    "heartBeatTimeout": null,
    "ipDeleteTimeout": null,
    "instanceEnabled": true,
    "ephemeral": true,
    "nacosProperties": {
      "secretKey": "",
      "namespace": "",
      "username": "",
      "namingLoadCacheAtStart": "false",
      "serverAddr": "127.0.0.1:8848",
      "com.alibaba.nacos.naming.log.filename": "",
      "clusterName": "DEFAULT",
      "password": "",
      "accessKey": "",
      "endpoint": ""
    }
  }
}
```


