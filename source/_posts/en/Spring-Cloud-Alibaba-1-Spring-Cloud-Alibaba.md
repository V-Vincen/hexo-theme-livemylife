---
title: '[Spring Cloud Alibaba] 1 Spring Cloud Alibaba'
catalog: true
lang: en
date: 2021-05-19 18:47:05
subtitle: Spring Cloud Alibaba provides a one-stop solution for distributed application development. It contains all the components required to develop distributed applications, making it easy for you to develop your applications using Spring Cloud...
header-img: /img/springcloudalibaba/springcloudalibaba_bg.png
tags:
- Spring Cloud Alibaba
---
 
在学习 Spring Cloud Alibaba 之前，先来简单回顾下。

## 目前市场上主流的套微服务架构解决方案：
- **Spring Boot + Spring Cloud Netflix = Java 原生云开发**
- **Spring Boot + Dubbo + Zookeeper**

## 回顾
博主在之前的博文中，对于上面的两套方案也做了简单是总结和案例练习。今天博主想要讲述的是基于 Spring Cloud 的另一套解决方案。先简单回顾下 Spring Cloud 的概念。
 
Spring Cloud 为开发人员提供了快速构建分布式系统中一些常见模式的工具（例如配置管理，服务发现，断路器，智能路由，微代理，控制总线）。分布式系统的协调导致了样板模式, 使用 Spring Cloud 开发人员可以快速地支持实现这些模式的服务和应用程序。他们将在任何分布式环境中运行良好，包括开发人员自己的笔记本电脑，裸机数据中心，以及 Cloud Foundry 等托管平台。对 Spring Cloud 使用最广的就是 Spring Cloud Netflix 了。

[【官方新闻】Spring Cloud Greenwich.RC1 available now](https://spring.io/blog/2018/12/12/spring-cloud-greenwich-rc1-available-now)

但是在 2018 年 12 月 12 日，Netflix 宣布 Spring Cloud Netflix 系列技术栈进入维护模式（不再添加新特性）。Netflix 在前两年也宣布 Hystrix 进入维护模式。自 2016 年以来，Ribbon 已处于类似状态。虽然 Hystrix 和 Ribbon 现已处于维护模式，但它们仍然在 Netflix 大规模部署。Hystrix Dashboard 和 Turbine 已被 Atlas 取代。这些项目的最后一次提交都是在多年前。Zuul1 和 Archaius1 都被后来不兼容的版本所取代。

以下 Spring Cloud Netflix 模块和相应的 Starter 将进入维护模式：
- spring-cloud-netflix-archaius
- spring-cloud-netflix-hystrix-contract
- spring-cloud-netflix-hystrix-dashboard
- spring-cloud-netflix-hystrix-stream
- spring-cloud-netflix-hystrix
- spring-cloud-netflix-ribbon
- spring-cloud-netflix-turbine-stream
- spring-cloud-netflix-turbine
- spring-cloud-netflix-zuul


### 什么是维护模式
将模块置于维护模式，意味着 Spring Cloud 团队将不会再向模块添加新功能。修复 block 级别的 bug 以及安全问题，也会考虑并审查社区的小型 pull request。

### 替代品
官方建议对这些模块提供的功能进行以下替换。

 **CURRENT** | **REPLACEMENT** 
---|---
 Hystrix | Resilience4j 
 Hystrix Dashboard / Turbine | Micrometer + Monitoring System 
 Ribbon | Spring Cloud Loadbalancer 
 Zuul 1 | Spring Cloud Gateway 
 Archaius 1 | Spring Boot external config + Spring Cloud Config 

#### 其它补充
**Netflix Concurrency Limits**：并发限制模块，它是 Netflix 开源的限流器项目，Spring Cloud 在 Greenwich 版本中引入 spring-cloud-netflix-concurrency-limits。

**Archaius 1**：有些人对它可能比较陌生，也是 Netflix 公司开源项目，基于 Java 的配置管理类库（apache common configuration 类库的扩展），主要用于多配置存储的动态获取。它主要的特性：
- 动态类型化属性
- 高效和线程安全的配置操作
- 配置改变时的回调机制
- 轮询框架
- JMX，通过Jconsole检查和调用操作属性
- 组合配置

**Resilience4j**：目前还中孵化中，Spring 可能是要抽象一个断路器的统一规范，让不同的断路器（Hystrix、Resilience4j、**Sentinel（阿里开源）**）选择使用。

**Micrometer**：Spring Boot 2 中的 Spring Boot Actuator 底层用的就是 Micrometer，它是 **Pivotal** 公司（也就是 Spring 所在的公司）开源的监控门面，类似于监控世界的 Slf4j。**Resilience4j 自带整合了 Micrometer**；目前还无法判断是否比 Hystrix Dashboard、Turbine 的更强大，更好用。

**Spring Cloud Loadbalancer**：目前还中孵化中，使用上和 Ribbon 区别不大。

**Spring Cloud Gateway**：Zuul 持续跳票 1 年多，1.x 是一个基于阻塞 IO 的 API Gateway 以及 Servlet；直到 2018 年 5 月，Zuul 2.x（基于 Netty，也是非阻塞的，支持长连接）才发布，但 Spring Cloud 暂时还没有整合计划。Spring Cloud Gateway 比 Zuul 1.x 系列的性能和功能整体要好。

**Spring Boot external config + Spring Cloud Config**：Netflix 开源的组件（Archaius 1、Ribbon、Hystrix）都没有使用 Spring Boot 的规范（spring-boot-configuration-processor），根本没有 metadata.json 文件，于是这部分配置 IDE 无法给你提示。

上述提到的部分替代解决方法，实质在国内市场上被应用的并不广泛。而现在市面上主流，使用 Spring Cloud Alibaba 方案来替代 Spring Cloud Netflix。


## 目前市场上主流的第三套微服务架构解决方案：
- Spring Boot + Spring Cloud Alibaba

官网：https://spring.io/projects/spring-cloud-alibaba
Github：https://github.com/alibaba/spring-cloud-alibaba

## 概述
2018年10月31日的凌晨，Spring Cloud Alibaba 正式入驻了 Spring Cloud 官方孵化器，并在 Maven 中央库发布了第一个版本。[Spring Cloud for Alibaba 0.2.0 released](https://spring.io/blog/2018/10/30/spring-cloud-for-alibaba-0-2-0-released)

> The Spring Cloud Alibaba project, consisting of Alibaba’s open-source components and several Alibaba Cloud products, aims to implement and expose well known Spring Framework patterns and abstractions to bring the benefits of Spring Boot and Spring Cloud to Java developers using Alibaba products.
> 
> Spring Cloud for Alibaba，它是由一些阿里巴巴的开源组件和云产品组成的。这个项目的目的是为了让大家所熟知的 Spring 框架，其优秀的设计模式和抽象理念，以给使用阿里巴巴产品的 Java 开发者带来使用 Spring Boot 和 Spring Cloud 的更多便利。

Spring Cloud Alibaba 致力于提供微服务开发的一站式解决方案。此项目包含开发分布式应用微服务的必需组件，方便开发者通过 Spring Cloud 编程模型轻松使用这些组件来开发分布式应用服务。依托 Spring Cloud Alibaba，您只需要添加一些注解和少量配置，就可以将 Spring Cloud 应用接入阿里微服务解决方案，通过阿里中间件来迅速搭建分布式应用系统。

参考文档请查看 [WIKI](https://github.com/alibaba/spring-cloud-alibaba/wiki) 。

## 主要功能

* **服务限流降级**：默认支持 WebServlet、WebFlux, OpenFeign、RestTemplate、Spring Cloud Gateway, Zuul, Dubbo 和 RocketMQ 限流降级功能的接入，可以在运行时通过控制台实时修改限流降级规则，还支持查看限流降级 Metrics 监控。
* **服务注册与发现**：适配 Spring Cloud 服务注册与发现标准，默认集成了 Ribbon 的支持。
* **分布式配置管理**：支持分布式系统中的外部化配置，配置更改时自动刷新。
* **消息驱动能力**：基于 Spring Cloud Stream 为微服务应用构建消息驱动能力。
* **分布式事务**：使用 @GlobalTransactional 注解， 高效并且对业务零侵入地解决分布式事务问题。
* **阿里云对象存储**：阿里云提供的海量、安全、低成本、高可靠的云存储服务。支持在任何应用、任何时间、任何地点存储和访问任意类型的数据。
* **分布式任务调度**：提供秒级、精准、高可靠、高可用的定时（基于 Cron 表达式）任务调度服务。同时提供分布式的任务执行模型，如网格任务。网格任务支持海量子任务均匀分配到所有 Worker（schedulerx-client）上执行。
* **阿里云短信服务**：覆盖全球的短信服务，友好、高效、智能的互联化通讯能力，帮助企业迅速搭建客户触达通道。


更多功能请参考 [Roadmap](https://github.com/alibaba/spring-cloud-alibaba/blob/master/Roadmap-zh.md)。

## 组件

- **[Sentinel](https://github.com/alibaba/Sentinel)**：把流量作为切入点，从流量控制、熔断降级、系统负载保护等多个维度保护服务的稳定性。
- **[Nacos](https://github.com/alibaba/Nacos)**：一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。
- **[RocketMQ](https://rocketmq.apache.org/)**：一款开源的分布式消息系统，基于高可用分布式集群技术，提供低延时的、高可靠的消息发布与订阅服务。
- **[Dubbo](https://github.com/apache/dubbo)**：Apache Dubbo™ 是一款高性能 Java RPC 框架。
- **[Seata](https://github.com/seata/seata)**：阿里巴巴开源产品，一个易于使用的高性能微服务分布式事务解决方案。
- **[Alibaba Cloud OSS](https://www.aliyun.com/product/oss)**: 阿里云对象存储服务（Object Storage Service，简称 OSS），是阿里云提供的海量、安全、低成本、高可靠的云存储服务。您可以在任何应用、任何时间、任何地点存储和访问任意类型的数据。
- **[Alibaba Cloud SchedulerX](https://help.aliyun.com/document_detail/43136.html)**: 阿里中间件团队开发的一款分布式任务调度产品，提供秒级、精准、高可靠、高可用的定时（基于 Cron 表达式）任务调度服务。
- **[Alibaba Cloud SMS](https://www.aliyun.com/product/sms)**: 覆盖全球的短信服务，友好、高效、智能的互联化通讯能力，帮助企业迅速搭建客户触达通道。
 
更多组件请参考 [Roadmap](https://github.com/alibaba/spring-cloud-alibaba/blob/master/Roadmap-zh.md)。



