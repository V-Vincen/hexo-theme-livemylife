---
title: '[Spring Cloud Alibaba] 3 Nacos Dynamic Naming and Configuration Service'
catalog: true
lang: en
date: 2021-05-21 15:18:03
subtitle:  An easy-to-use dynamic service discovery, configuration and service management platform for building cloud native applications...
header-img: /img/springcloudalibaba/nacos_bg.png
tags:
- Spring Cloud Alibaba
---

## 概述
在 Spring Cloud Netflix 阶段我们采用 Eureka 做作为我们的服务注册与发现服务器，现利用 Spring Cloud Alibaba 提供的 Nacos 组件替代该方案。

## 什么是 Nacos
Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。

Nacos 帮助您更敏捷和容易地构建、交付和管理微服务平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式) 的服务基础设施。

官网：https://nacos.io/zh-cn/index.html
Github：https://github.com/alibaba/Nacos

## 基本架构及概念

![nacos](nacos.jpeg)

- 服务 (Service)：服务是指一个或一组软件功能（例如特定信息的检索或一组操作的执行），其目的是不同的客户端可以为不同的目的重用（例如通过跨进程的网络调用）。Nacos 支持主流的服务生态，如 Kubernetes Service、gRPC|Dubbo RPC Service 或者 Spring Cloud RESTful Service。
- 服务注册中心 (Service Registry)：服务注册中心，它是服务，其实例及元数据的数据库。服务实例在启动时注册到服务注册表，并在关闭时注销。服务和路由器的客户端查询服务注册表以查找服务的可用实例。服务注册中心可能会调用服务实例的健康检查 API 来验证它是否能够处理请求。
- 服务元数据 (Service Metadata)：服务元数据是指包括服务端点(endpoints)、服务标签、服务版本号、服务实例权重、路由规则、安全策略等描述服务的数据。
- 服务提供方 (Service Provider)：是指提供可复用和可调用服务的应用方。
- 服务消费方 (Service Consumer)：是指会发起对某个服务调用的应用方。
- 配置 (Configuration)：在系统开发过程中通常会将一些需要变更的参数、变量等从代码中分离出来独立管理，以独立的配置文件的形式存在。目的是让静态的系统工件或者交付物（如 WAR，JAR 包等）更好地和实际的物理运行环境进行适配。配置管理一般包含在系统部署的过程中，由系统管理员或者运维人员完成这个步骤。配置变更是调整系统运行时的行为的有效手段之一。
- 配置管理 (Configuration Management)：在数据中心中，系统中所有配置的编辑、存储、分发、变更管理、历史版本管理、变更审计等所有与配置相关的活动统称为配置管理。
- 名字服务 (Naming Service)：提供分布式系统中所有对象(Object)、实体(Entity)的“名字”到关联的元数据之间的映射管理服务，例如 ServiceName -> Endpoints Info, Distributed Lock Name -> Lock Owner/Status Info, DNS Domain Name -> IP List, 服务发现和 DNS 就是名字服务的2大场景。
- 配置服务 (Configuration Service)：在服务或者应用运行过程中，提供动态配置或者元数据以及配置管理的服务提供者。

## 逻辑架构及其组件介绍

![nacos_architecture](nacos_architecture.png)

- 服务管理：实现服务CRUD，域名CRUD，服务健康状态检查，服务权重管理等功能
- 配置管理：实现配置管CRUD，版本管理，灰度管理，监听管理，推送轨迹，聚合数据等功能
- 元数据管理：提供元数据CURD 和打标能力
- 插件机制：实现三个模块可分可合能力，实现扩展点SPI机制
- 事件机制：实现异步化事件通知，sdk数据变化异步通知等逻辑
- 日志模块：管理日志分类，日志级别，日志可移植性（尤其避免冲突），日志格式，异常码+帮助文档
- 回调机制：sdk通知数据，通过统一的模式回调用户处理。接口和数据结构需要具备可扩展性
- 寻址模式：解决ip，域名，nameserver、广播等多种寻址模式，需要可扩展
- 推送通道：解决server与存储、server间、server与sdk间推送性能问题
- 容量管理：管理每个租户，分组下的容量，防止存储被写爆，影响服务可用性
- 流量管理：按照租户，分组等多个维度对请求频率，长链接个数，报文大小，请求流控进行控制
- 缓存机制：容灾目录，本地缓存，server缓存机制。容灾目录使用需要工具
- 启动模式：按照单机模式，配置模式，服务模式，dns模式，或者all模式，启动不同的程序+UI
- 一致性协议：解决不同数据，不同一致性要求情况下，不同一致性机制
- 存储模块：解决数据持久化、非持久化存储，解决数据分片问题
- Nameserver：解决namespace到clusterid的路由问题，解决用户环境与nacos物理环境映射问题
- CMDB：解决元数据存储，与三方cmdb系统对接问题，解决应用，人，资源关系
- Metrics：暴露标准metrics数据，方便与三方监控系统打通
- Trace：暴露标准trace，方便与SLA系统打通，日志白平化，推送轨迹等能力，并且可以和计量计费系统打通
- 接入管理：相当于阿里云开通服务，分配身份、容量、权限过程
- 用户管理：解决用户管理，登录，sso等问题
- 权限管理：解决身份识别，访问控制，角色管理等问题
- 审计系统：扩展接口方便与不同公司审计系统打通
- 通知系统：核心数据变更，或者操作，方便通过SMS系统打通，通知到对应人数据变更
- OpenAPI：暴露标准Rest风格HTTP接口，简单易用，方便多语言集成
- Console：易用控制台，做服务管理、配置管理等操作
- SDK：多语言sdk
- Agent：dns-f类似模式，或者与mesh等方案集成
- CLI：命令行对产品进行轻量化管理，像git一样好用

## 领域模型
### 数据模型
Nacos 数据模型 Key 由三元组唯一确定, Namespace默认是空串，公共命名空间（public），分组默认是 DEFAULT_GROUP。

![data_model](data_model.jpeg)

### 服务领域模型

![service_domain_model](service_domain_model.jpeg)


### 配置领域模型
围绕配置，主要有两个关联的实体，一个是配置变更历史，一个是服务标签（用于打标分类，方便索引），由 ID 关联。

![configure_domain_model](configure_domain_model.jpeg)


## 下载安装
### 版本选择
您可以在 Nacos 的 [release notes](https://github.com/alibaba/nacos/releases) 及 [博客中](https://nacos.io/zh-cn/blog/index.html) 找到每个版本支持的功能的介绍，当前推荐的稳定版本为1.4.2或2.0.1。

### 预备环境准备
Nacos 依赖 Java 环境来运行。如果您是从代码开始构建并运行 Nacos，还需要为此配置 Maven 环境，请确保是在以下版本环境中安装使用:
- 64 bit OS，支持 Linux/Unix/Mac/Windows，推荐选用 Linux/Unix/Mac。
- 64 bit JDK 1.8+。
- Maven 3.2.x+。

### 下载源码或者安装包
你可以通过源码和发行包两种方式来获取 Nacos。

#### 从 Github 上下载源码方式
```shell
git clone https://github.com/alibaba/nacos.git
cd nacos/
mvn -Prelease-nacos -Dmaven.test.skip=true clean install -U  
ls -al distribution/target/

// change the $version to your actual path
cd distribution/target/nacos-server-$version/nacos/bin
```

#### 下载编译后压缩包方式
您可以从 [最新稳定版本](https://github.com/alibaba/nacos/releases) 下载 nacos-server-$version.zip 包。
```shell
unzip nacos-server-$version.zip 或者 tar -xvf nacos-server-$version.tar.gz
cd nacos/bin
```

### 启动服务器
#### Linux、Unix、Mac
启动命令（standalone 代表着单机模式运行，非集群模式）:
```shell
sh startup.sh -m standalone
```

如果您使用的是 ubuntu 系统，或者运行脚本报错提示[[符号找不到，可尝试如下运行：
```shell
bash startup.sh -m standalone
```

#### Windows
启动命令（standalone代表着单机模式运行，非集群模式）:
```shell
startup.cmd -m standalone
```

### 服务注册、发现和配置管理
打开浏览器访问：[http://localhost:8848/nacos](https://v-vincen.life/404.html)

![nacos_dashboard](nacos_dashboard.png)

#### 服务注册
```
curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'
```

#### 服务发现
```
curl -X GET 'http://127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=nacos.naming.serviceName'
```

#### 发布配置
```
curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=HelloWorld"
```

#### 获取配置
```
curl -X GET "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"
```

### 关闭服务器
#### Linux、Unix、Mac
```shell
sh shutdown.sh
```

#### Windows
```shell
shutdown.cmd
```
或者双击 `shutdown.cmd` 运行文件。