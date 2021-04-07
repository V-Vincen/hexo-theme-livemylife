---
title: '[Calling Third-party API - WebService] 1 WebService'
catalog: true
date: 2020-03-14 16:24:59
subtitle: WebService
header-img: /img/webservice/webservice_bg.jpg
tags:
- Calling Third-party API
- WebService
---

## WebService 概述

### WebService 是什么
**WebService 是一种跨编程语言和跨操作系统平台的远程调用技术。**

Web service 是一个平台独立的，低耦合的，自包含的、基于可编程的 web 的应用程序，可使用开放的 XML（标准通用标记语言下的一个子集）标准来描述、发布、发现、协调和配置这些应用程序，用于开发分布式的互操作的应用程序。

Web Service 技术，能使得运行在不同机器上的不同应用无须借助附加的、专门的第三方软件或硬件，就可相互交换数据或集成。依据 Web Service 规范实施的应用之间，无论它们所使用的语言、 平台或内部协议是什么， 都可以相互交换数据。Web Service是自描述、 自包含的可用网络模块，可以执行具体的业务功能。Web Service 也很容易部署，因为它们基于一些常规的产业标准以及已有的一些技术，诸如标准通用标记语言下的子集XML、HTTP。Web Service 减少了应用接口的花费。Web Service 为整个企业甚至多个组织之间的业务流程的集成提供了一个通用机制。

### WebService 能做什么
- 不同系统、不同平台、不同语言之间的通信访问和远程调用。
- 应用程序的集成，不同业务的整合。


### WebService 官方定义
- Web 服务是一种服务导向架构的技术，通过标准的 Web 协议提供服务，目的是保证不同平台的应用服务可以互操作。
- 表面上看 WebService 就是一个应用程序，它向外界暴露出一个能够通过Web进行调用的方法 API，能用编程的方法通过 Web 调用来实现某个功能的应用程序。
- 深层次上看 WebService 是一种新的 Web 应用程序分支，它们是自包含、自描述模块化的应用，可以在网络中被描述、发布、查找以及通过 Web 来调用。

### WebService 的两种类型
- 一种是以 SOAP 协议风格的 Webservice
- 一种是 Restful 风格的 Webservice

### WebService 核心组件
![1](1.jpg)

- SOAP（simple object access protocal）：简单对象访问协议，SOAP 协议 = HTTP 协议 + XML 数据格式
- WSDL（web service definition language）：WebService 描述语言
- UDDI（Universal Description、Discovery and Integration）：统一描述、发现和集成协议

#### SOAP = HTTP + XML
WebService 通过 HTTP 协议发送请求和接收结果时，发送的请求内容和结果内容都采用 XML 格式封装，并增加了一些特定的 HTTP 消息头，以说明 HTTP 消息的内容格式，这些特定的 HTTP 消息头和 XML 内容格式就是 SOAP 协议。SOAP 提供了标准的 RPC 方法来调用 Web Service。
SOAP 协议定义了 SOAP 消息的格式，是基于 HTTP 的协议、XML 和 XSD，XML 是 SOAP 的数据编码方式。打个比 喻：HTTP 就是普通公路，XML 就是中间的绿色隔离带和两边的防护栏，SOAP 就是普通公路经过加隔离带和防护栏改造过的高速公路。

#### WSDL
用机器能阅读的方式提供一个正式的描述文档。Web service 描述语言（WSDL）就是这样一个基于 XML（标准通用标记语言下的一个子集）的语言，用于描述 Web service 及其函数、参数和返回值。WSDL 既是机器可阅读的，又是人可阅读的，这将是一个很大的好处。一些最新的开发工具既能根据你的 Web service 生成 WSDL 文档，又能导入 WSDL 文档，生成调用相应 Web service 的代码。

#### UDDI
为加速 Web Service 的推广、加强 Web Service 的互操作能力而推出的一个计划，基于标准的服务描述和发现的规范（specification）。以资源共享的方式由多个运作者一起以 Web Service 的形式运作 UDDI 商业注册中心。UDDI 计划的核心组件是 UDDI 商业注册，它使用 XML 文档来描述企业及其提供的 Web Service。

## WebService 主流框架

![2](2.jpg)


### AXIS
- AXIS（Apache eXtensible Interaction System）阿帕奇可扩展交互系统
- AXIS 是一款开源的 WebService 运行引擎，本质上就是一个 SOAP 引擎，提供创建服务器端、客户端和网关 SOAP 操作的基本框架。
- AXIS 分为 1.x系列和 2系列，两个系列体系结构和使用上有较大的区别，相对而言，Axis1.x 更加稳定，文档也比较齐全。
- 官网：http://axis.apache.org/

### XFire
- XFire 是下一代的 java SOAP 框架。XFire 提供了非常方便的 API，使用这些 API 可以开发面向服务（SOA）的程序。它支持各种标准，性能优良（基于低内存的 STAX 模型）。
- 官网：http://xfire.codehaus.org/

### CXF
- Apache CXF = Celtix + XFire
- Apache CXF 的前身叫 Apache CeltiXfire，现在已经正式更名为 Apache CXF 了，以下简称为 CXF。CXF 继承了 Celtix 和 XFire 两大开源项目的精华，提供了对 JAX-WS 全面的支持，并且提供了多种 Binding 、DataBinding、Transport 以及各种 Format 的支持，并且可以根据实际项目的需要，采用代码优先（Code First）或者 WSDL 优先（WSDL First）来轻松地实现 Web Services 的发布和使用。Apache CXF 已经是一个正式的 Apache 顶级项目。
- 官网：http://cxf.apache.org/
