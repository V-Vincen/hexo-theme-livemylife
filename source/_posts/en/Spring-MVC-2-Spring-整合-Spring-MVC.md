---
title: '[Spring MVC] 2 Spring 整合 Spring MVC'
catalog: true
date: 2019-06-24 03:10:45
subtitle: Spring MVC 配置
header-img: /img/springmvc/springmvc_bg.png
tags:
- Spring MVC
---

##  POM
---
在 `pom.xml` 配置文件中增加 `org.springframework:spring-webmvc` 依赖
```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
    <version>4.3.17.RELEASE</version>
</dependency>
```

## 配置 web.xml
---
###  CharacterEncodingFilter
配置字符集过滤器，用于解决中文编码问题
```xml
<filter>
    <filter-name>encodingFilter</filter-name>
    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
    <init-param>
        <param-name>encoding</param-name>
        <param-value>UTF-8</param-value>
    </init-param>
    <init-param>
        <param-name>forceEncoding</param-name>
        <param-value>true</param-value>
    </init-param>
</filter>
<filter-mapping>
    <filter-name>encodingFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

### DispatcherServlet
配置 Spring 的 Servlet 分发器处理所有 HTTP 的请求和响应
```xml
<servlet>
    <servlet-name>springServlet</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath*:/spring-mvc*.xml</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
</servlet>
<servlet-mapping>
    <servlet-name>springServlet</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>
```

## 配置 Spring MVC
---
创建一个名为 `spring-mvc.xml` 文件来配置 MVC
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <description>Spring MVC Configuration</description>

    <!-- 加载配置属性文件 -->
    <context:property-placeholder ignore-unresolvable="true" location="classpath:myshop.properties"/>

    <!-- 使用 Annotation 自动注册 Bean,只扫描 @Controller -->
    <context:component-scan base-package="com.lusifer.myshop" use-default-filters="false">
        <context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>

    <!-- 默认的注解映射的支持 -->
    <mvc:annotation-driven />

    <!-- 定义视图文件解析 -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="${web.view.prefix}"/>
        <property name="suffix" value="${web.view.suffix}"/>
    </bean>

    <!-- 静态资源映射 -->
    <mvc:resources mapping="/static/**" location="/static/" cache-period="31536000"/>
</beans>
```
相关配置说明：
- `context:property-placeholder`：动态加载属性配置文件以变量的方式引用需要的值
- `context:component-scan`：当前配置文件为 MVC 相关，故只需要扫描包含 `@Controller` 的注解即可，由于 `spring-context.xml` 配置文件中也配置了包扫描，所以还需要排除 `@Controller` 的注解扫描。
- `InternalResourceViewResolver`：视图文件解析器的一种，用于配置视图资源的路径和需要解释的视图资源文件类型，这里有两个需要配置的属性 `prefix`（前缀）以及 `suffix`（后缀）。

    - `refix`：配置视图资源路径，如：/WEB-INF/views/
    - `suffix`：配置视图资源类型，如：.jsp
- `mvc:resources`：静态资源映射，主要用于配置静态资源文件存放路径，如：JS、CSS、Image 等

### 系统相关配置
在 `spring-mvc.xml` 中，我们配置了
```xml
<context:property-placeholder ignore-unresolvable="true" location="classpath:myshop.properties"/>
```
用于动态加载属性配置文件，实际开发中我们会将系统所需的一些配置信息封装到 .properties 配置文件中便于统一的管理。

创建一个名为 myshop.properties 的配置文件，内容如下：
```properties
#============================#
#==== Framework settings ====#
#============================#

# \u89c6\u56fe\u6587\u4ef6\u5b58\u653e\u8def\u5f84
web.view.prefix=/WEB-INF/views/
web.view.suffix=.jsp
```

### 去掉 Spring 配置的重复扫描
由于 `spring-mvc.xml` 中已经配置了 `@Controller` 注解的扫描而 `spring-context.xml` 中配置的是扫描全部注解，故在这里需要将 `@Controller` 注解的扫描配置排除。

修改 `spring-context.xml` 配置：
```xml
<!-- 使用 Annotation 自动注册 Bean，在主容器中不扫描 @Controller 注解，在 SpringMVC 中只扫描 @Controller 注解。-->
<context:component-scan base-package="com.funtl.my.shop">
    <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
</context:component-scan>
```