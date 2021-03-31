---
title: '[Calling Third-party API - WebService] 2 CXF 服务端开发'
catalog: true
date: 2020-03-17 02:04:40
subtitle: CXF 服务端开发
header-img: /img/webservice/webservice_bg.jpg
tags:
- Calling Third-party API
- WebService
---

## CXF 简介
- Apache CXF = Celtix + XFire
- Apache CXF 的前身叫 Apache CeltiXfire，现在已经正式更名为 Apache CXF 了，以下简称为 CXF。CXF 继承了 Celtix 和 XFire 两大开源项目的精华，提供了对 JAX-WS 全面的支持，并且提供了多种 Binding 、DataBinding、Transport 以及各种 Format 的支持，并且可以根据实际项目的需要，采用代码优先（Code First）或者 WSDL 优先（WSDL First）来轻松地实现 Web Services 的发布和使用。Apache CXF 已经是一个正式的 Apache 顶级项目。
- 官网：http://cxf.apache.org/

## 创建 Maven 工程
**pom.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>webservice</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <java.version>1.8</java.version>

        <cxf.version>3.3.4</cxf.version>
    </properties>

    <dependencies>
        <!-- cxf 3.3.5 start -->
        <!-- cxf-rt-frontend-jaxws -->
        <dependency>
            <groupId>org.apache.cxf</groupId>
            <artifactId>cxf-rt-frontend-jaxws</artifactId>
            <version>${cxf.version}</version>
        </dependency>
        <!-- cxf-rt-transports-http-jetty -->
        <dependency>
            <groupId>org.apache.cxf</groupId>
            <artifactId>cxf-rt-transports-http-jetty</artifactId>
            <version>${cxf.version}</version>
        </dependency>
        <!-- cxf 3.3.5 end -->

    </dependencies>

    <build>
        <plugins>
            <!-- Compiler 插件, 设定 JDK 版本 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.7.0</version>
                <configuration>
                    <source>${java.version}</source>
                    <target>${java.version}</target>
                    <encoding>${project.build.sourceEncoding}</encoding>
                    <showWarnings>true</showWarnings>
                </configuration>
            </plugin>
        </plugins>

        <!-- 资源文件配置 -->
        <resources>
            <resource>
                <directory>src/main/java</directory>
                <excludes>
                    <exclude>**/*.java</exclude>
                </excludes>
            </resource>
            <resource>
                <directory>src/main/resources</directory>
            </resource>
        </resources>
    </build>
</project>
```

## WebService 服务端接口
**WebServiceI 接口**
```java
/**
 * @ProjectName:
 * @Package: com.example.webservice.jdk
 * @ClassName: WebServiceI
 * @Description:
 * @Author: Mr.Vincent
 * @CreateDate: 2020/3/15 15:31
 * @Version: 1.0.0
 */
@WebService
public interface WebServiceI {

    @WebMethod
    String sayHello(String name);

    @WebMethod(operationName = "webserviceSave")
    String save(String name, String pwd);

}
```

**WebServiceImpl 实现类**
```java
/**
 * @ProjectName:
 * @Package: com.example.webservice.jdk
 * @ClassName: WebServiceImpl
 * @Description: 使用 @WebService 注解标注 WebServiceI 接口的实现类 WebServiceImpl
 * @Author: Mr.Vincent
 * @CreateDate: 2020/3/15 15:34
 * @Version: 1.0.0
 */
@WebService
public class WebServiceImpl implements WebServiceI {

    //使用 @WebMethod 注解标注 WebServiceImpl 实现类中的方法
    @WebMethod
    @Override
    public String sayHello(String name) {
        System.out.println("WebService sayHello:" + name);
        return "sayHello" + name;
    }

    //operationName 定义发布接口中方法的名字
    @WebMethod(operationName = "webserviceSave")
    @Override
    public String save(String name, String pwd) {
        System.out.println("WebService save:" + name + "," + pwd);
        return "save Success";
    }
}
```

## 发布方式
### 用 JaxWsServerFactoryBean 类发布
```java
/**
 * @author vincent
 * WebService 服务端
 */
public class WebServicePublish {
    public static void main(String[] args) {
        JaxWsServerFactoryBean jaxWsServerFactoryBean = new JaxWsServerFactoryBean();
        //设置发布的地址
        jaxWsServerFactoryBean.setAddress("http://127.0.0.1:8989/webservice/cxf");
        //设置服务的接口
        jaxWsServerFactoryBean.setServiceClass(WebServiceI.class);
        //设置服务的实现对象
        jaxWsServerFactoryBean.setServiceBean(new WebServiceImpl());
        //通过工厂创建服务
        jaxWsServerFactoryBean.create();
        System.out.println("发布 webservice 成功！");
    }
}
```

### 用 ServletContextListener 监听器发布
```java
/**
 * @author vincent
 * 使用 Servlet3.0 提供的 @WebListener 注解将实现了 ServletContextListener 接口的 WebServicePublishListener
 * 类标注为一个 Listener
 */
@WebListener
public class WebServicePublishListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        JaxWsServerFactoryBean jaxWsServerFactoryBean = new JaxWsServerFactoryBean();
        //设置发布的地址
        jaxWsServerFactoryBean.setAddress("http://127.0.0.1:8080/webservice/cxf");
        //设置服务的接口
        jaxWsServerFactoryBean.setServiceClass(WebServiceI.class);
        //设置服务的实现对象
        jaxWsServerFactoryBean.setServiceBean(new WebServiceImpl());
        //通过工厂创建服务
        jaxWsServerFactoryBean.create();
        System.out.println("发布 webservice 成功！");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
    }
}
```

### 用 Servlet 发布
```java
/**
 * @author vincent
 * 用于发布 WebService 的 Servlet
 * 使用 Servlet3.0 提供的 @WebServlet 注解将继承 HttpServlet 类的普通 Java 类标注为一个 Servlet
 * 1.将 value 属性设置为空字符串，这样 WebServicePublishServlet 就不提供对外访问的路径
 * 2.loadOnStartup 属性设置 WebServicePublishServlet 的初始化时机
 */
@WebServlet(value = "", loadOnStartup = 0)
public class WebServicePublishServlet extends HttpServlet {

    /**
     * (non-Javadoc)
     *
     * @see javax.servlet.GenericServlet#init()
     * 在 WebServicePublishServlet 初始化时发布 WebService
     */
    @Override
    public void init() throws ServletException {
        JaxWsServerFactoryBean jaxWsServerFactoryBean = new JaxWsServerFactoryBean();
        //设置发布的地址
        jaxWsServerFactoryBean.setAddress("http://127.0.0.1:8888/webservice/cxf");
        //设置服务的接口
        jaxWsServerFactoryBean.setServiceClass(WebServiceI.class);
        //设置服务的实现对象
        jaxWsServerFactoryBean.setServiceBean(new WebServiceImpl());
        //通过工厂创建服务
        jaxWsServerFactoryBean.create();
        System.out.println("发布 webservice 成功！");
    }
}
```

案例源码：https://github.com/V-Vincen/webservice

参考：https://blog.csdn.net/hgx_suiyuesusu/article/details/88918192
