---
title: '[Microservices] 2 微服务的特征'
catalog: true
date: 2019-07-01 19:57:51
subtitle: Microservices are a modern approach to software whereby application code is delivered in small, manageable pieces, independent of others...
header-img: /img/microservices/microservices_bg.png
tags:
- Microservices
---

## 特征
### 官方的定义
- 一系列的独立的服务共同组成系统
- 单独部署，跑在自己的进程中
- 每个服务为独立的业务开发
- 分布式管理
- 非常强调隔离性

### 大概的标准
- 分布式服务组成的系统
- 按照业务，而不是技术来划分组织
- 做有生命的产品而不是项目
- 强服务个体和弱通信（ Smart endpoints and dumb pipes ）
- 自动化运维（ DevOps ）
- 高度容错性
- 快速演化和迭代

## SOA 和微服务的区别
### SOA 喜欢重用，微服务喜欢重写
**SOA** 的主要目的是为了企业各个系统更加容易地融合在一起。说到 SOA 不得不说ESB（EnterpriseService Bus）。ESB 是什么? 可以把 ESB 想象成一个连接所有企业级服务的脚手架。通过 service broker，它可以把不同数据格式或模型转成 canonical 格式，把 XML 的输入转成 CSV 传给 legacy 服务，把 SOAP 1.1 服务转成 SOAP 1.2 等等。它还可以把一个服务路由到另一个服务上，也可以集中化管理业务逻辑，规则和验证等等。它还有一个重要功能是消息队列和事件驱动的消息传递，比如把 JMS 服务转化成 SOAP 协议。各服务间可能有复杂的依赖关系。

**微服务** 通常由重写一个模块开始。要把整个巨石型的应用重写是有很大的风险的，也不一定必要。我们向微服务迁移的时候通常从耦合度最低的模块或对扩展性要求最高的模块开始，把它们一个一个剥离出来用敏捷地重写，可以尝试最新的技术和语言和框架，然后单独布署。它通常不依赖其他服务。微服务中常用的 API  Gateway 的模式主要目的也不是重用代码，而是减少客户端和服务间的往来。API Gateway 模式不等同与Facade 模式，我们可以使用如 future 之类的调用，甚至返回不完整数据。

### SOA 喜欢水平服务，微服务喜欢垂直服务
**SOA** 设计喜欢给服务分层（如 Service Layers 模式）。我们常常见到一个 Entity 服务层的设计，美其名曰 Data Access Layer。这种设计要求所有的服务都通过这个 Entity 服务层来获取数据。这种设计非常不灵活，比如每次数据层的改动都可能影响到所有业务层的服务。而每个微服务通常有它自己独立的 data store。我们在拆分数据库时可以适当的做些去范式化（denormalization），让它不需要依赖其他服务的数据。

**微服务** 通常是直接面对用户的，每个微服务通常直接为用户提供某个功能。类似的功能可能针对手机有一个服务，针对机顶盒是另外一个服务。在 SOA 设计模式中这种情况通常会用到 Multi-ChannelEndpoint 的模式返回一个大而全的结果兼顾到所有的客户端的需求。

### SOA 喜欢自上而下，微服务喜欢自下而上
**SOA** 架构在设计开始时会先定义好服务合同（service contract）。它喜欢集中管理所有的服务，包括集中管理业务逻辑，数据，流程，schema，等等。它使用 Enterprise Inventory 和 Service Composition 等方法来集中管理服务。SOA 架构通常会预先把每个模块服务接口都定义好。模块系统间的通讯必须遵守这些接口，各服务是针对他们的调用者。SOA 架构适用于 TOGAF 之类的架构方法论。

**微服务** 则敏捷得多。只要用户用得到，就先把这个服务挖出来。然后针对性的，快速确认业务需求，快速开发迭代。
