---
title: '[Spring MVC] 4 Spring MVC 拦截器的使用'
catalog: true
date: 2019-06-24 03:20:17
subtitle: Spring MVC 拦截器
header-img: /img/springmvc/springmvc_bg.png
tags:
- Spring MVC
---

##  拦截器简介
---
Spring Web MVC 的处理器拦截器，类似于 Servlet 开发中的过滤器 Filter，用于对处理器进行预处理和后处理。

##  常见应用场景
---
- 日志记录：记录请求信息的日志，以便进行信息监控、信息统计、计算 PV（Page View）等
- 权限检查：如登录检测，进入处理器检测检测是否登录，如果没有直接返回到登录页面
- 性能监控：有时候系统在某段时间莫名其妙的慢，可以通过拦截器在进入处理器之前记录开始时间，在处理完后记录结束时间，从而得到该请求的处理时间
- 通用行为：读取 Cookie 得到用户信息并将用户对象放入请求，从而方便后续流程使用，还有如提取 Locale、Theme 信息等，只要是多个处理器都需要的即可使用拦截器实现

## Spring MVC 拦截器
---
Spring MVC 拦截器需要实现 `HandlerInterceptor` 接口，该接口定义了 3 个方法，分别为 `preHandle()`、`postHandle()` 和 `afterCompletion()`，咱们就是通过重写这 3 个方法来对用户的请求进行拦截处理的。

- `preHandle(HttpServletRequest request, HttpServletResponse response, Object handle)`：该方法在请求处理之前进行调用。Spring MVC 中的 Interceptor 是链式调用的，在一个应用中或者说是在一个请求中可以同时存在多个 Interceptor 。每个 Interceptor 的调用会依据它的声明顺序依次执行，而且最先执行的都是 Interceptor 中的 `preHandle` 方法，所以可以在这个方法中进行一些前置初始化操作或者是对当前请求做一个预处理，也可以在这个方法中进行一些判断来决定请求是否要继续进行下去。该方法的返回值是布尔值 `Boolean` 类型的，当它返回为 `false` 时，表示请求结束，后续的 Interceptor 和 Controller 都不会再执行；当返回值为 `true` 时，就会继续调用下一个 Interceptor 的 `preHandle` 方法，如果已经是最后一个 Interceptor 的时候，就会是调用当前请求的 Controller 中的方法。
- `postHandle(HttpServletRequest request, HttpServletResponse response, Object handle, ModelAndView modelAndView)`：通过 `preHandle` 方法的解释咱们知道这个方法包括后面要说到的 `afterCompletion` 方法都只能在当前所属的 Interceptor 的 `preHandle` 方法的返回值为 true 的时候，才能被调用。postHandle 方法在当前请求进行处理之后，也就是在 Controller 中的方法调用之后执行，但是它会在 `DispatcherServlet` 进行视图返回渲染之前被调用，所以咱们可以在这个方法中对 Controller 处理之后的 `ModelAndView` 对象进行操作。`postHandle` 方法被调用的方向跟 `preHandle` 是相反的，也就是说，先声明的 Interceptor 的 `postHandle` 方法反而会后执行。
- `afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handle, Exception ex)`：也是需要当前对应的 Interceptor 的 `preHandle` 方法的返回值为 `true` 时才会执行。因此，该方法将在整个请求结束之后，也就是在 `DispatcherServlet` 渲染了对应的视图之后执行，这个方法的主要作用是用于进行资源清理的工作。

### 创建登录拦截器
我们知道对系统的相关操作是需要登录后才可以使用的，当未登录时是无法直接访问需要登录权限的操作的，为了做到这个效果，我们使用登录拦截器来判断用户是否登录，如果用户已登录则放行让用户继续操作，否则就将其跳转到登录页。

定义一个名为 `LoginInterceptor` 的拦截器，代码如下：
```java
package com.funtl.my.shop.web.interceptor;

import com.funtl.my.shop.entity.User;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 登录拦截器
 * <p>Title: LoginInterceptor</p>
 * <p>Description: </p>
 *
 * @author Lusifer
 * @version 1.0.0
 * @date 2018/6/12 5:44
 */
public class LoginInterceptor implements HandlerInterceptor {
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {
        User user = (User) httpServletRequest.getSession().getAttribute("user");

        // 判断用户是否登录
        if (user == null) {
            // 用户未登录，重定向到登录页
            httpServletResponse.sendRedirect("/login");
            return false;
        }

        // 放行
        return true;
    }

    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {
        // 如果请求来自登录页
        if (modelAndView.getViewName().endsWith("login")) {
            // 则直接重定向到首页不再显示登录页
            httpServletResponse.sendRedirect("/main");
        }
    }

    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
```

### 在 spring-mvc.xml 中配置拦截器
拦截器定义后还需要在 `spring-mvc.xml` 中配置拦截器，代码如下：
```xml
<!-- 拦截器配置，拦截顺序：先执行后定义的，排在第一位的最后执行。-->
<mvc:interceptors>
    <mvc:interceptor>
        <mvc:mapping path="/**"/>
        <mvc:exclude-mapping path="/static/**"/>
        <mvc:exclude-mapping path="/login"/>
        <bean class="com.funtl.my.shop.web.interceptor.LoginInterceptor"/>
    </mvc:interceptor>
</mvc:interceptors>
```
相关配置说明：
- `mvc:interceptor`：定义一个拦截器
    - `mvc:mapping`：映射路径，需要拦截的请求路径
    - `mvc:exclude-mapping`：需要排除的请求路径，比如登录页本身是不需要拦截的，这里还包括了静态资源路径也是不需要拦截的
    - `bean class`：配置指定的拦截器对象