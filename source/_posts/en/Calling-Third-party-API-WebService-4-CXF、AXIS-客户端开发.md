---
title: '[Calling Third-party API - WebService] 4 CXF、AXIS 客户端开发'
catalog: true
date: 2020-03-22 00:05:25
subtitle: CXF、AXIS 客户端开发
header-img: /img/webservice/webservice_bg.jpg
tags:
- Calling Third-party API
- WebService
---

## JAX-WS 规范
AX-WS（Java API For XML Web Service），JAX-WS 规范是一组 XML web services 的 JAVA API，它运行时实现会将这些 API 的调用转换成为对应的 SOAP 消息，是 Sun 公司提出的一套关于 WebService 的开发标准。

## CXF 开发客户端
### 创建 Maven 工程
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

### 通过 `wsdl` 生成 `java` 代码
#### 命令行生成
- 下载的压缩包里面包含了工具,下载地址：http://cxf.apache.org/download.html
- bin 目录下运行 `wsdl2java` 命令，通过 `wsdl` 生成 `java` 代码，例：
    ```
    ➜  bin ./wsdl2java http://127.0.0.1:8989/webservice/cxf\?wsdl
    ```
    正常执行后，在 bin 目录下会生成一个文件包，里面内容如下：
    ![14](14.png)

#### idea 直接生成
- 需先在 idea 中配置 webservice 的 CXF，如下图：
    ![15](15.png)

- 通过 `wsdl` 生成 `java` 代码如下图：
    ![16](16.png)
    ![17](17.png)

### 客户端
```java
/**
 * @author vincent
 * WebService 服务端，cxf 开发
 */
public class WebServiceClient {
    public static void main(String[] args) {
        JaxWsProxyFactoryBean jaxWsProxyFactoryBean = new JaxWsProxyFactoryBean();
        //设置服务的地址
        jaxWsProxyFactoryBean.setAddress("http://127.0.0.1:8989/webservice/cxf");
        //设置服务的接口
        jaxWsProxyFactoryBean.setServiceClass(WebServiceI.class);
        //通过工厂获取服务
        WebServiceI webServiceI = (WebServiceI) jaxWsProxyFactoryBean.create();
        //调用发布的服务方法
        String result = webServiceI.sayHello("Vincent");
        System.out.println(result);
        System.out.println();

        //调用发布的服务方法
        result = webServiceI.webserviceSave("Vincent", "24");
        System.out.println(result);
    }
}
```

## AXIS 开发客户端
### 创建 Maven 工程
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

        <axis.version>1.4</axis.version>
    </properties>

    <dependencies>
        <!-- axis 1.4 start -->
        <dependency>
            <groupId>org.apache.axis</groupId>
            <artifactId>axis</artifactId>
            <version>${axis.version}</version>
        </dependency>
        <dependency>
            <groupId>commons-discovery</groupId>
            <artifactId>commons-discovery</artifactId>
            <version>0.2</version>
            <exclusions>
                <exclusion>
                    <groupId>commons-logging</groupId>
                    <artifactId>commons-logging</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <dependency>
            <groupId>org.apache.axis</groupId>
            <artifactId>axis-jaxrpc</artifactId>
            <version>${axis.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.axis</groupId>
            <artifactId>axis-saaj</artifactId>
            <version>${axis.version}</version>
        </dependency>
        <dependency>
            <groupId>wsdl4j</groupId>
            <artifactId>wsdl4j</artifactId>
            <version>${axis.version}</version>
        </dependency>
        <!-- axis 1.4 end -->

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

### 通过 `wsdl` 生成 `java` 代码
通过 idea 直接生成（个人推荐 axis 生成，因为 axis 生成的文件最少）

![18](18.png)


### 客户端
```java
/**
 * @author vincent
 * WebService 服务端，axis 开发
 */
public class WebServiceAxisClient {
    public static void main(String[] args) throws Exception {
        WebServiceIServiceLocator serviceLocator = new WebServiceIServiceLocator();
        String address = "http://127.0.0.1:8989/webservice/cxf";
        WebServiceI webServiceI = serviceLocator.getWebServiceIPort(new URL(address));
        String result = webServiceI.sayHello("Vincent");
        System.out.println(result);
        System.out.println();

        result = webServiceI.webserviceSave("Vincent", "18");
        System.out.println(result);
    }
}
```

案例源码：https://github.com/V-Vincen/webservice

参考：https://blog.csdn.net/hgx_suiyuesusu/article/details/88918192



