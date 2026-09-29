---
title: '[Spring Cloud Alibaba] 2 Create a Unified Parent Dependency Management'
catalog: true
lang: en
date: 2021-05-26 17:21:29
subtitle: Dependency Management...
header-img: /img/springcloudalibaba/springcloudalibaba_bg.png
tags:
- Spring Cloud Alibaba
---

## 概述
Spring Cloud Alibaba 项目都是基于 Spring Cloud，而 Spring Cloud 项目又是基于 Spring Boot 进行开发，并且都是使用 Maven 做项目管理工具。在实际开发中，我们一般都会创建一个依赖管理项目作为 Maven 的 Parent 项目使用，这样做可以极大的方便我们对 Jar 包版本的统一管理。

## 版本说明
### 组件版本关系

 **Spring Cloud Alibaba Version**                          | **Sentinel Version** | **Nacos Version** | **RocketMQ Version** | **Dubbo Version** | **Seata Version** 
-----------------------------------------------------------|----------------------|-------------------|----------------------|-------------------|-------------------
 2021.1 or 2.2.5.RELEASE or 2.1.4.RELEASE or 2.0.4.RELEASE | 1.8.0                | 1.4.1             | 4.4.0                | 2.7.8             | 1.3.0             
 2.2.3.RELEASE or 2.1.3.RELEASE or 2.0.3.RELEASE           | 1.8.0                | 1.3.3             | 4.4.0                | 2.7.8             | 1.3.0             
 2.2.1.RELEASE or 2.1.2.RELEASE or 2.0.2.RELEASE           | 1.7.1                | 1.2.1             | 4.4.0                | 2.7.6             | 1.2.0             
 2.2.0.RELEASE                                             | 1.7.1                | 1.1.4             | 4.4.0                | 2.7.4.1           | 1.0.0             
 2.1.1.RELEASE or 2.0.1.RELEASE or 1.5.1.RELEASE           | 1.7.0                | 1.1.4             | 4.4.0                | 2.7.3             | 0.9.0             
 2.1.0.RELEASE or 2.0.0.RELEASE or 1.5.0.RELEASE           | 1.6.3                | 1.1.1             | 4.4.0                | 2.7.3             | 0.7.1             

### 毕业版本依赖关系（推荐使用）

 **Spring Cloud Version**    | **Spring Cloud Alibaba Version** | **Spring Boot Version** 
-----------------------------|----------------------------------|-------------------------
 Spring Cloud 2020.0.0       | 2021.1                           | 2.4.2                   
 Spring Cloud Hoxton.SR8     | 2.2.5.RELEASE                    | 2.3.2.RELEASE           
 Spring Cloud Greenwich.SR6  | 2.1.4.RELEASE                    | 2.1.13.RELEASE          
 Spring Cloud Hoxton.SR3     | 2.2.1.RELEASE                    | 2.2.5.RELEASE           
 Spring Cloud Hoxton.RELEASE | 2.2.0.RELEASE                    | 2.2.X.RELEASE           
 Spring Cloud Greenwich      | 2.1.2.RELEASE                    | 2.1.X.RELEASE           
 Spring Cloud Finchley       | 2.0.4.RELEASE(停止维护，建议升级)         | 2.0.X.RELEASE           
 Spring Cloud Edgware        | 1.5.1.RELEASE(停止维护，建议升级)         | 1.5.X.RELEASE           

更多详情查看官网文档：https://github.com/alibaba/spring-cloud-alibaba/wiki/%E7%89%88%E6%9C%AC%E8%AF%B4%E6%98%8E


## 创建依赖管理
创建一个父工程 `hello-spring-cloud-alibaba` 项目，`pom.xml` 配置文件如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>hello-spring-cloud-alibaba</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>pom</packaging>

    <name>hello-spring-cloud-alibaba</name>
    <url>https://v-vincen.life</url>
    <inceptionYear>2021-Now</inceptionYear>
    <description>Demo project for Spring Cloud Alibaba</description>

    <properties>
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <spring-boot.version>2.4.2</spring-boot.version>
        <spring-cloud.version>2020.0.0</spring-cloud.version>
        <spring-cloud-alibaba.version>2021.1</spring-cloud-alibaba.version>

        <lombok.version>1.18.20</lombok.version>
        <pagehelper-spring-boot-starter.version>1.3.0</pagehelper-spring-boot-starter.version>
        <hutool-all.version>5.6.3</hutool-all.version>
        <guava.version>30.1.1-jre</guava.version>
        <commons-collections4.version>4.4</commons-collections4.version>
        <commons-lang3.version>3.12.0</commons-lang3.version>
        <commons-io.version>2.8.0</commons-io.version>
        <fastjson.version>1.2.75</fastjson.version>
        <vavr.version>1.0.0-alpha-3</vavr.version>

        <!-- Maven Plugin Versions -->
        <maven-compiler-plugin.version>3.7.0</maven-compiler-plugin.version>
    </properties>

    <!-- 依赖声明 -->
    <dependencyManagement>
        <dependencies>
            <!-- Spring Boot -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>

            <!-- Spring Cloud -->
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>

            <!-- Spring Cloud Alibaba -->
            <dependency>
                <groupId>com.alibaba.cloud</groupId>
                <artifactId>spring-cloud-alibaba-dependencies</artifactId>
                <version>${spring-cloud-alibaba.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>


            <!-- common tools Begin -->
            <!-- lombok -->
            <dependency>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
                <scope>provided</scope>
            </dependency>

            <!-- pagehelper-spring-boot-starter -->
            <dependency>
                <groupId>com.github.pagehelper</groupId>
                <artifactId>pagehelper-spring-boot-starter</artifactId>
                <version>${pagehelper-spring-boot-starter.version}</version>
            </dependency>

            <!-- hutool-all -->
            <dependency>
                <groupId>cn.hutool</groupId>
                <artifactId>hutool-all</artifactId>
                <version>${hutool-all.version}</version>
            </dependency>

            <!-- guava -->
            <dependency>
                <groupId>com.google.guava</groupId>
                <artifactId>guava</artifactId>
                <version>${guava.version}</version>
            </dependency>

            <!-- commons-collections4 -->
            <dependency>
                <groupId>org.apache.commons</groupId>
                <artifactId>commons-collections4</artifactId>
                <version>${commons-collections4.version}</version>
            </dependency>

            <!-- commons-lang3 -->
            <dependency>
                <groupId>org.apache.commons</groupId>
                <artifactId>commons-lang3</artifactId>
                <version>${commons-lang3.version}</version>
            </dependency>

            <!-- commons-io -->
            <dependency>
                <groupId>commons-io</groupId>
                <artifactId>commons-io</artifactId>
                <version>${commons-io.version}</version>
            </dependency>

            <!-- fastjson -->
            <dependency>
                <groupId>com.alibaba</groupId>
                <artifactId>fastjson</artifactId>
                <version>${fastjson.version}</version>
            </dependency>

            <!-- vavr -->
            <dependency>
                <groupId>io.vavr</groupId>
                <artifactId>vavr</artifactId>
                <version>${vavr.version}</version>
            </dependency>
            <!-- common tools End -->

        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>${maven-compiler-plugin.version}</version>
                <configuration>
                    <source>${java.version}</source>
                    <target>${java.version}</target>
                    <encoding>${project.build.sourceEncoding}</encoding>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>${spring-boot.version}</version>
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

    <repositories>
        <repository>
            <id>aliyun-repos</id>
            <name>Aliyun Repository</name>
            <url>http://maven.aliyun.com/nexus/content/groups/public</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </repository>

        <repository>
            <id>sonatype-repos</id>
            <name>Sonatype Repository</name>
            <url>https://oss.sonatype.org/content/groups/public</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </repository>
        <repository>
            <id>sonatype-repos-s</id>
            <name>Sonatype Repository</name>
            <url>https://oss.sonatype.org/content/repositories/snapshots</url>
            <releases>
                <enabled>false</enabled>
            </releases>
            <snapshots>
                <enabled>true</enabled>
            </snapshots>
        </repository>

        <repository>
            <id>spring-snapshots</id>
            <name>Spring Snapshots</name>
            <url>https://repo.spring.io/snapshot</url>
            <snapshots>
                <enabled>true</enabled>
            </snapshots>
        </repository>
        <repository>
            <id>spring-milestones</id>
            <name>Spring Milestones</name>
            <url>https://repo.spring.io/milestone</url>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </repository>
    </repositories>

    <pluginRepositories>
        <pluginRepository>
            <id>aliyun-repos</id>
            <name>Aliyun Repository</name>
            <url>http://maven.aliyun.com/nexus/content/groups/public</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </pluginRepository>
    </pluginRepositories>
</project>
```

**说明：** `spring-boot-dependencies`：在这里并没有用，
```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.4.2</version>
</parent>
```
继承 Spring Boot 的 Parent 的方式创建；
    
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-dependencies</artifactId>
    <version>${spring-boot.version}</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```
而是依赖 `spring-boot-dependencies` 的方式创建父工程，当然这两种方式其实都可以，可根据项目需求自行创建。


## 与 Spring Cloud Netflix 的区别
主要增加了 `org.springframework.cloud:spring-cloud-alibaba-dependencies`：
```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>2021.1</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

