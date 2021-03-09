---
title: '[Dubbo Zookeeper] 7 什么是 Dubbo'
catalog: true
date: 2020-01-17 11:06:30
subtitle: 什么是 Dubbo
header-img: /img/dubbozookeeper/dubbozookeeper_bg.jpg
tags:
- Dubbo Zookeeper
---

## 概述
`Apache Dubbo (incubating) |ˈdʌbəʊ|` 是一款高性能、轻量级的开源 `Java RPC` 分布式服务框架，它提供了三大核心能力：面向接口的远程方法调用，智能容错和负载均衡，以及服务自动注册和发现。她最大的特点是按照分层的方式来架构，使用这种方式可以使各个层之间解耦合（或者最大限度地松耦合）。从服务模型的角度来看，`Dubbo` 采用的是一种非常简单的模型，要么是提供方提供服务，要么是消费方消费服务，所以基于这一点可以抽象出服务提供方（`Provider`）和服务消费方（`Consumer`）两个角色。

官网：http://dubbo.apache.org/zh-cn
GitHub：https://github.com/apache/incubator-dubbo

## Dubbo 的服务治理

![1](1.png)

| 特性     | 描述                                        |
|--------|-------------------------------------------|
| 透明远程调用 | 就像调用本地方法一样调用远程方法；只需简单配置，没有任何 API 侵入       |
| 负载均衡机制 | Client 端 LB，可在内网替代 F5 等硬件负载均衡器            |
| 容错重试机制 | 服务 Mock 数据，重试次数、超时机制等                     |
| 自动注册发现 | 注册中心基于接口名查询服务提 供者的 IP 地址，并且能够平滑添加或删除服务提供者 |
| 性能日志监控 | Monitor 统计服务的调用次调和调用时间的监控中心               |
| 服务治理中心 | 路由规则，动态配置，服务降级，访问控制，权重调整，负载均衡，等手动配置       |
| 自动治理中心 | 无，比如：熔断限流机制、自动权重调整等                       |


## Dubbo 的核心功能

- `Remoting`：远程通讯，提供对多种 `NIO` 框架抽象封装，包括“同步转异步”和“请求-响应”模式的信息交换方式。
- `Cluster`：服务框架，提供基于接口方法的透明远程过程调用，包括多协议支持，以及软负载均衡，失败容错，地址路由，动态配置等集群支持。
- `Registry`：服务注册中心，服务自动发现: 基于注册中心目录服务，使服务消费方能动态的查找服务提供方，使地址透明，使服务提供方可以平滑增加或减少机器。


## Dubbo 的组件角色

![2](2.png)

| 组件角色      | 说明                  |
|-----------|---------------------|
| Provider  | 暴露服务的服务提供方          |
| Consumer  | 调用远程服务的服务消费方        |
| Registry  | 服务注册与发现的注册中心        |
| Monitor   | 统计服务的调用次调和调用时间的监控中心 |
| Container | 服务运行容器              |

调用关系说明：

- 服务容器 `Container` 负责启动，加载，运行服务提供者。
- 服务提供者 `Provider` 在启动时，向注册中心注册自己提供的服务。
- 服务消费者 `Consumer` 在启动时，向注册中心订阅自己所需的服务。
- 注册中心 `Registry` 返回服务提供者地址列表给消费者，如果有变更，注册中心将基于长连接推送变更数据给消费者。
- 服务消费者 `Consumer`，从提供者地址列表中，基于软负载均衡算法，选一台提供者进行调用，如果调用失败，再选另一台调用。
- 服务消费者 `Consumer` 和提供者 `Provider`，在内存中累计调用次数和调用时间，定时每分钟发送一次统计数据到监控中心 `Monitor`。


## Dubbo Admin 管理控制台

管理控制台为内部裁剪版本，开源部分主要包含：路由规则，动态配置，服务降级，访问控制，权重调整，负载均衡，等管理功能。

GitHub：https://github.com/apache/incubator-dubbo-ops

![3](3.png)

### 项目运行方法
**GitHub README 说明：https://github.com/apache/dubbo-admin/blob/develop/README_ZH.md**

- 下载代码: `git clone https://github.com/apache/dubbo-admin.git`
- 在 `dubbo-admin-server/src/main/resources/application.properties` 中指定注册中心地址
- 构建 `mvn clean package`
- 启动
  - mvn --projects dubbo-admin-server spring-boot:run
  - 或者 `cd dubbo-admin-distribution/target; java -jar dubbo-admin-0.1.jar`
- 访问 `http://localhost:8080`

### 遇到的问题处理
**NodeJS**

- 现象：使用 `mvn clean package` 构建 DubboAdmin 控制台时会出现 `npm install` 操作
- 解决：新版控制台已改为前后分离模式，前端采用 Vue.js 开发，故需要 NodeJS 支持，请自行安装（运行到此处时会自动下载安装）。官网地址：http://nodejs.cn/
- 其他：配置淘宝镜像加速。官网地址：http://npm.taobao.org/
```
# 安装 cnpm 命令行工具
npm install -g cnpm --registry=https://registry.npm.taobao.org

# 安装模块
cnpm install [name]
```


