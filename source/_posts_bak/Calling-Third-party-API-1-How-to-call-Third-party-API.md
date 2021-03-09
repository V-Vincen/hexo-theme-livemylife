---
title: '[Calling Third-party API] 1 How to call Third-party API'
catalog: true
date: 2020-11-07 16:29:22
subtitle: Making HTTP requests is a core feature of modern programming, and is often one of the first things you want to do when learning a new programming language. For Java programmers there are many ways to do it - core libraries in the JDK and third-party libraries...
header-img: /img/header_img/tag_bg2.jpg
tags:
- Calling Third-party API
---

## 概述
我们在日常开发过程中，有不少场景会对接第三方的 API，例如第三方账号登录，第三方服务等等。第三方服务会提供 API 或者 SDK，早些年 Maven 还没那么广泛使用，通常要对接第三方服务的时候会去下载第三方服务的 SDK 开发包，也就是 jar 包，拷贝到自己的工程中进行开发。但现如今，几乎所有的大中小企业都使用 Maven 进行依赖管理，第三方服务通过提供 SDK 包的情况越来越少，有的 SDK 也早已处于不再更新的状态。并且现在流行的微服务以及轻量级的 RESTful 通信方式，使得第三方服务主要提供 API 接口。

API 接口，指的是通过 HTTP 的方式提供服务对接，也就需要对接方发起 HTTP 请求，解析第三方服务返回的数据；而 SDK 开发包，指的是对接方直接调用第三方服务提供的 Java 方法进行调用，不再对第三方服务发起 HTTP 请求。从便利性上讲，以 SDK 的方式对接第三方服务，的确能更加方便地进行开发对接工作。而从目前的趋势看，以 RESTful 通信的微服务正逐渐成为主流，服务的提供方也不再对外提供 SDK 开发包，因为这涉及开发量以及包的依赖问题。

记得早年对接第三方 API 时的场景，业务要求能通过微信发起 WiFi 连接，这自然需要对接微信提供的 API 接口。那时我用了“最低级”的对接方式，也就是使用原生 JDK 发起 HTTP 请求，以及对 HTTP 响应的 JSON 数据进行解析获取我想要的数据。这其中的坑不胜其数，手写的 HTTP 请求客户端本身的不健壮，解析响应数据时经常抛出空指针，其中的苦恼不尽其数。

后陆续也和一些客服企业对接过，业务需求是获取客户公司的人员信息、组织架构、成本中心等主数据。但是并不是每家客户公司，提供的都是时下主流的 RESTful 风格的 API 接口，其中不乏一些客户公司，提供的还是以 SOAP 协议风格的 WebService 接口。

本文在这里梳理下，调用第三方接口大部分方式。以便大家根据不同的业务场景来选择。

## 第三方接口调用分类

### Core Java
- HttpURLConnection
- HttpClient

### Popular Libraries
- WebService
- ApacheHttpClient
- RestTemplate（SpringBoot）
- OpenFeign