---
title: '[Spring MVC] 1 Spring MVC 简介'
catalog: true
date: 2019-06-24 02:11:21
subtitle: Spring MVC 简介
header-img: /img/springmvc/springmvc_bg.png
tags:
- Spring MVC
---

## 概述
Spring MVC 也叫 Spring Web MVC ，属于展示层框架。SpringMVC 是 Spring 框架的一部分。

Spring Web MVC 框架提供了 MVC (模型 - 视图 - 控制器) 架构和用于开发灵活和松散耦合的 Web 应用程序的组件。 MVC 模式导致应用程序的不同方面(输入逻辑，业务逻辑和 UI 逻辑)分离，同时提供这些元素之间的松散耦合。
- 模型 (Model)：封装了应用程序数据，通常它们将由 POJO 类组成。
- 视图 (View)：负责渲染模型数据，一般来说它生成客户端浏览器可以解释 HTML 输出。
- 控制器 (Controller)：负责处理用户请求并构建适当的模型，并将其传递给视图进行渲染。

## DispatcherServlet 组件类
Spring Web MVC 框架是围绕 DispatcherServlet 设计的，它处理所有的 HTTP 请求和响应。

Spring Web MVC DispatcherServlet 的请求处理工作流如下图所示：
![1](1.jpeg)
以下是对应于到 DispatcherServlet 的传入 HTTP 请求的事件顺序：
- 在接收到 HTTP 请求后，DispatcherServlet 会查询 HandlerMapping 以调用相应的 Controller。
- Controller 接受请求并根据使用的 GET 或 POST 方法调用相应的服务方法。 服务方法将基于定义的业务逻辑设置模型数据，并将视图名称返回给 DispatcherServlet。
- DispatcherServlet 将从 ViewResolver 获取请求的定义视图。
- 当视图完成，DispatcherServlet 将模型数据传递到最终的视图，并在浏览器上呈现。

所有上述组件，即: HandlerMapping，Controller 和 ViewResolver 是 WebApplicationContext 的一部分，它是普通 ApplicationContext 的扩展，带有 Web 应用程序所需的一些额外功能。