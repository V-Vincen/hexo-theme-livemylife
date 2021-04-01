---
title: '[Spring Cloud Netflix] 1 Spring Cloud Netflix 简介'
catalog: true
date: 2019-07-03 23:46:45
subtitle: 分布式框架
header-img: /img/springcloudnetflix/springcloudnetflix_bg.png
tags:
- Spring Cloud Netflix
---

## 目前市场上主流的套微服务架构解决方案：

- <font color=red>**Spring Boot + Spring Cloud Netflix = Java 原生云开发**</font>
- **Spring Boot + Dubbo + Zookeeper**

## 概述

  Spring Cloud 是一个相对比较新的微服务框架，2016 才推出 1.0 的 Release 版本. 但是其更新特别快，几乎每 1-2 个月就有一次更新，虽然 Spring Cloud 时间最短, 但是相比 Dubbo 等 RPC 框架, Spring Cloud 提供的全套的分布式系统解决方案。

  Spring Cloud 为开发者提供了在分布式系统（**配置管理，服务发现，熔断，路由，微代理，控制总线，一次性 Token，全居琐，Leader 选举，分布式 Session，集群状态**）中快速构建的工具，使用 Spring Cloud 的开发者可以快速的启动服务或构建应用、同时能够快速和云平台资源进行对接。

## 先来说说 Netflix OSS

  Netflix 是一家互联网流媒体播放商,是美国视频巨头，随着 Netflix 转型为一家云计算公司，它也开始积极参与开源项目。

  Netflix OSS（Open Source Software）就是由 Netflix 公司主持开发的一套代码框架和库，目的是解决上了规模之后的分布式系统可能出现的一些有趣问题。

## 再看 Spring Cloud Netflix 

  Spring Cloud 是基于 Spring Boot 的一整套实现微服务的框架。Spring Cloud 包含了非常多的子框架，其中 Spring Cloud Netflix 就是其中一套框架，由 Netflix 开发后来又并入 Spring Cloud 大家庭。
  所以，Spring Cloud Netflix 是在 Netflix OSS 基础之上的封装。

### 官网概述

  Spring Cloud Netflix provides Netflix OSS integrations for Spring Boot apps through autoconfiguration and binding to the Spring Environment and other Spring programming model idioms. With a few simple annotations you can quickly enable and configure the common patterns inside your application and build large distributed systems with battle-tested Netflix components. The patterns provided include Service Discovery (Eureka), Circuit Breaker (Hystrix), Intelligent Routing (Zuul) and Client Side Load Balancing (Ribbon)..

### Features

Spring Cloud Netflix features:

- Service Discovery: Eureka instances can be registered and clients can discover the instances using Spring-managed beans
- Service Discovery: an embedded Eureka server can be created with declarative Java configuration
- Circuit Breaker: Hystrix clients can be built with a simple annotation-driven method decorator
- Circuit Breaker: embedded Hystrix dashboard with declarative Java configuration
- Declarative REST Client: Feign creates a dynamic implementation of an interface decorated with JAX-RS or Spring MVC annotations
- Client Side Load Balancer: Ribbon
- External Configuration: a bridge from the Spring Environment to Archaius (enables native configuration of Netflix components using Spring Boot conventions)
- Router and Filter: automatic regsitration of Zuul filters, and a simple convention over configuration approach to reverse proxy creation

## Spring Cloud Netflix 组件以及部署

### Spring Cloud Netflix 包含的组件及其主要功能：

1. `Eureka`：服务注册和发现，它提供了一个服务注册中心、服务发现的客户端，还有一个方便的查看所有注册的服务的界面。 所有的服务使用 Eureka 的服务发现客户端来将自己注册到 Eureka 的服务器上。
2. `Zuul`：网关，所有的客户端请求通过这个网关访问后台的服务。他可以使用一定的路由配置来判断某一个 URL 由哪个服务来处理。并从 Eureka 获取注册的服务来转发请求。
3. `Ribbon`：即负载均衡，Zuul 网关将一个请求发送给某一个服务的应用的时候，如果一个服务启动了多个实例，就会通过 Ribbon 来通过一定的负载均衡策略来发送给某一个服务实例。
4. `Feign`：服务客户端，服务之间如果需要相互访问，可以使用 RestTemplate，也可以使用 Feign 客户端访问。它默认会使用 Ribbon 来实现负载均衡。
5. `Hystrix`：监控和断路器。我们只需要在服务接口上添加 Hystrix 标签，就可以实现对这个接口的监控和断路器功能。
6. `Hystrix Dashboard`：监控面板，他提供了一个界面，可以监控各个服务上的服务调用所消耗的时间等。
7. `Turbine`：监控聚合，使用 Hystrix 监控，我们需要打开每一个服务实例的监控信息来查看。而 Turbine 可以帮助我们把所有的服务实例的监控信息聚合到一个地方统一查看。这样就不需要挨个打开一个个的页面一个个查看。

下面就是使用上述的子框架实现的为服务架构的组架构图： 

![1](1.jpg)

在上图中，有几个需要说明的地方：

- ZUUL 网关也在注册中心注册，把它也当成一个服务来统一查看。
- 负载均衡不是一个独立的组件，它运行在网关、服务调用等地方，每当需要访问一个服务的时候，就会通过 Ribbon 来获得一个该服务的实例去掉用。Ribbon 从 Eureka 注册中心获得服务和实例的列表，而不是发送每个请求的时候从注册中心获得。
- 我们可以使用 RestTemplate 来进行服务间调用，也可以配置 FeignClient 来使用，不管什么方式，只要使用服务注册，就会默认使用 Ribbon 负载均衡。（RestTemplate 需要添加 @LoadBalanced）
- 每个服务都可以开启监控功能，开启监控的服务会提供一个 servlet 接口 /hystrix.stream，如果你需要监控这个服务的某一个方法的运行统计，就在这个方法上加一个 @HystrixCommand 的标签。
- 查看监控信息，就是在 Hystrix Dashboard 上输入这个服务的监控 url：[http://serviceIp:port/hystrix.stream](http://serviceip:port/hystrix.stream)，就可以用图表的方式查看运行监控信息。
- 如果要把所有的服务的监控信息聚合在一起统一查看，就需要使用 Turbine 来聚合所需要的服务的监控信息。

### 我们也可以从上图中看出该架构的部署方式：

1. 独立部署一个网关应用
2. 服务注册中心和监控可以配置在一个应用里，也可以是2个应用。
3. 服务注册中心也可以部署多个，通过区域 zone 来区分，来实现高可用。
4. 每个服务，根据负载和高可用的需要，部署一个或多个实例。

参考：

https://spring.io/projects/spring-cloud-netflix

https://www.funtl.com/zh/guide/Spring-Cloud-Netflix.html

https://blog.csdn.net/lovebird321/article/details/78850505

