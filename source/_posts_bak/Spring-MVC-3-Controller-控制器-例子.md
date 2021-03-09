---
title: '[Spring MVC] 3 Controller 控制器(例子)'
catalog: true
date: 2019-06-24 03:16:21
subtitle: Spring MVC 注解
header-img: /img/springmvc/springmvc_bg.png
tags:
- Spring MVC
---

## 概述
---
```java
package com.funtl.my.shop.web.controller;

import com.funtl.my.shop.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = {"", "login"}, method = RequestMethod.GET)
    public String login() {
        return "login";
    }

    @RequestMapping(value = "login", method = RequestMethod.POST)
    public String login(@RequestParam(required = true) String email, @RequestParam(required = true) String password) {
        return "redirect:/main";
    }
}
```

## 注解说明
---
### @Controller
在 Spring MVC 中，控制器 `Controller` 负责处理由 `DispatcherServlet` 分发的请求，它把用户请求的数据经过业务处理层处理之后封装成一个 Model ，然后再把该 Model 返回给对应的 View 进行展示。在 Spring MVC 中提供了一个非常简便的定义 Controller 的方法，你无需继承特定的类或实现特定的接口，只需使用 `@Controller` 标记一个类是 Controller ，然后使用 `@RequestMapping` 和 `@RequestParam` 等一些注解用以定义 URL 请求和 Controller 方法之间的映射，这样的 Controller 就能被外界访问到。此外 Controller 不会直接依赖于 `HttpServletRequest` 和 `HttpServletResponse` 等 `HttpServlet` 对象，它们可以通过 Controller 的方法参数灵活的获取到。

`@Controller` 用于标记在一个类上，使用它标记的类就是一个 Spring MVC Controller 对象。分发处理器将会扫描使用了该注解的类的方法，并检测该方法是否使用了 `@RequestMapping` 注解。`@Controller` 只是定义了一个控制器类，而使用 `@RequestMapping` 注解的方法才是真正处理请求的处理器。

### @RequestMapping
RequestMapping 是一个用来处理请求地址映射的注解，可用于类或方法上。用于类上，表示类中的所有响应请求的方法都是以该地址作为父路径。

RequestMapping 注解有六个属性：
- value， method
    - value：指定请求的实际地址，指定的地址可以是 URI Template 模式
    - method：指定请求的method类型， GET、POST、PUT、DELETE 等
- consumes，produces
    - consumes：指定处理请求的提交内容类型（Content-Type），例如 application/json, text/html
    - produces: 指定返回的内容类型，仅当 request 请求头中的(Accept)类型中包含该指定类型才返回
- params，headers
    - params：指定 request 中必须包含某些参数值是，才让该方法处理
    - headers：指定 request 中必须包含某些指定的 header 值，才能让该方法处理请求