---
title: '[Spring MVC] 5 Maven 模块化开发'
catalog: true
date: 2019-06-24 03:25:11
subtitle: Maven 模块化开发
header-img: /img/maven/maven_bg.png
tags:
- Spring MVC
- Maven
---

##  概述
---
在多人协同开发时，特别是规模较大的项目，为了方便日后的代码维护和管理，我们会将每个开发人员的工作细分到具体的功能和模块上。随着项目的不断扩大，模块也会越来越多，后续会更加难以维护和扩展，为了应对这种情况后期我们还会采用微服务架构的方式进行开发。

以当前教程为例，我们可以将模块划分为如下形式：
- 统一的依赖管理（dependencies）
- 通用的工具类（commons）
- 领域模型（domain）
- 管理后台（admin）
- 商城前端（ui）
- 接口模块（api）
  整个模块化开发过程主要是在开发思想上稍作了一些转变，只需要按照下面的流程操作即可。

## 创建根项目（工程）
---
创建一个名为 `my-shop` 的工程，`pom.xml` 文件如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.funtl</groupId>
    <artifactId>my-shop</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>
    
    <modules>
    
    </modules>
</project>
```

该项目称之为 Root 项目，主要作用是管理整个工程的全部模块，当有新模块加入时需要在 modules 元素下配置对应的模块目录

## 创建统一的依赖管
---
创建一个名为 `my-shop-dependencies` 的项目，`pom.xml` 文件如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.funtl</groupId>
        <artifactId>my-shop</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../pom.xml</relativePath>
    </parent>

    <artifactId>my-shop-dependencies</artifactId>
    <packaging>pom</packaging>

    <name>my-shop-dependencies</name>
    <description></description>

    <properties>
        <!-- 环境配置 -->
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>

        <!-- 统一的依赖管理 -->
        <commons-lang3.version>3.5</commons-lang3.version>
        <jstl.version>1.2</jstl.version>
        <log4j.version>1.2.17</log4j.version>
        <servlet-api.version>3.1.0</servlet-api.version>
        <slf4j.version>1.7.25</slf4j.version>
        <spring.version>4.3.17.RELEASE</spring.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <!-- Spring Begin -->
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-context</artifactId>
                <version>${spring.version}</version>
            </dependency>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-webmvc</artifactId>
                <version>${spring.version}</version>
            </dependency>
            <!-- Spring End -->

            <!-- Servlet Begin -->
            <dependency>
                <groupId>javax.servlet</groupId>
                <artifactId>javax.servlet-api</artifactId>
                <version>${servlet-api.version}</version>
                <scope>provided</scope>
            </dependency>
            <dependency>
                <groupId>javax.servlet</groupId>
                <artifactId>jstl</artifactId>
                <version>${jstl.version}</version>
            </dependency>
            <!-- Servlet End -->

            <!-- Log Begin -->
            <dependency>
                <groupId>org.slf4j</groupId>
                <artifactId>slf4j-api</artifactId>
                <version>${slf4j.version}</version>
            </dependency>
            <dependency>
                <groupId>org.slf4j</groupId>
                <artifactId>slf4j-log4j12</artifactId>
                <version>${slf4j.version}</version>
            </dependency>
            <dependency>
                <groupId>org.slf4j</groupId>
                <artifactId>jcl-over-slf4j</artifactId>
                <version>${slf4j.version}</version>
            </dependency>
            <dependency>
                <groupId>org.slf4j</groupId>
                <artifactId>jul-to-slf4j</artifactId>
                <version>${slf4j.version}</version>
            </dependency>
            <dependency>
                <groupId>log4j</groupId>
                <artifactId>log4j</artifactId>
                <version>${log4j.version}</version>
            </dependency>
            <!-- Log End -->

            <!-- Commons Begin -->
            <dependency>
                <groupId>org.apache.commons</groupId>
                <artifactId>commons-lang3</artifactId>
                <version>${commons-lang3.version}</version>
            </dependency>
            <!-- Commons End -->
        </dependencies>
    </dependencyManagement>

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
PS：别忘记在 `my-shop` 工程的 `pom.xml` 中增加 `<module>my-shop-dependencies</module>` 配置

## 创建通用的工具类
---xml
创建一个名为 `my-shop-commons` 的项目，`pom.xml` 文件如下：
```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.funtl</groupId>
        <artifactId>my-shop-dependencies</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../my-shop-dependencies/pom.xml</relativePath>
    </parent>

    <artifactId>my-shop-commons</artifactId>
    <packaging>jar</packaging>

    <name>my-shop-commons</name>
    <description></description>

</project>
```
PS：别忘记在 `my-shop` 工程的 `pom.xml` 中增加 `<module>my-shop-commons</module>` 配置

## 创建领域模型
---
创建一个名为 `my-shop-domain` 的项目，`pom.xml` 文件如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.funtl</groupId>
        <artifactId>my-shop-dependencies</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../my-shop-dependencies/pom.xml</relativePath>
    </parent>

    <artifactId>my-shop-domain</artifactId>
    <packaging>jar</packaging>

    <name>my-shop-domain</name>
    <description></description>

</project>
```
PS：别忘记在 `my-shop` 工程的 `pom.xml` 中增加 `<module>my-shop-domain</module>` 配置

## 创建管理后台
---
创建一个名为 `my-shop-web-admin` 的项目，`pom.xml` 文件如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.funtl</groupId>
        <artifactId>my-shop-dependencies</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../my-shop-dependencies/pom.xml</relativePath>
    </parent>

    <artifactId>my-shop-web-admin</artifactId>
    <packaging>war</packaging>

    <name>my-shop-web-admin</name>
    <description></description>

    <dependencies>
        <dependency>
            <groupId>com.funtl</groupId>
            <artifactId>my-shop-commons</artifactId>
            <version>${project.parent.version}</version>
        </dependency>
        <dependency>
            <groupId>com.funtl</groupId>
            <artifactId>my-shop-domain</artifactId>
            <version>${project.parent.version}</version>
        </dependency>
    </dependencies>

</project>
```
PS：别忘记在 `my-shop` 工程的 `pom.xml` 中增加 `<module>my-shop-web-admin</module>` 配置

## 创建商城前端
---
创建一个名为 `my-shop-web-ui` 的项目，`pom.xml` 文件如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.funtl</groupId>
        <artifactId>my-shop-dependencies</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../my-shop-dependencies/pom.xml</relativePath>
    </parent>

    <artifactId>my-shop-web-ui</artifactId>
    <packaging>war</packaging>

    <name>my-shop-web-ui</name>
    <description></description>

    <dependencies>
        <dependency>
            <groupId>com.funtl</groupId>
            <artifactId>my-shop-commons</artifactId>
            <version>${project.parent.version}</version>
        </dependency>
    </dependencies>

</project>

```
PS：别忘记在 `my-shop` 工程的 `pom.xml` 中增加 `<module>my-shop-web-ui</module>` 配置

## 创建接口模块
---
创建一个名为 `my-shop-web-api` 的项目，`pom.xml` 文件如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.funtl</groupId>
        <artifactId>my-shop-dependencies</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../my-shop-dependencies/pom.xml</relativePath>
    </parent>

    <artifactId>my-shop-web-api</artifactId>
    <packaging>war</packaging>

    <name>my-shop-web-api</name>
    <description></description>

    <dependencies>
        <dependency>
            <groupId>com.funtl</groupId>
            <artifactId>my-shop-commons</artifactId>
            <version>${project.parent.version}</version>
        </dependency>
    </dependencies>

</project>
```
PS：别忘记在 `my-shop` 工程的 `pom.xml` 中增加 `<module>my-shop-web-api</module>` 配置

## 清理、编译、打包
---
至此一个完整的模块化工程创建完毕，此时的 Root 工程 `pom.xml` 文件如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.funtl</groupId>
    <artifactId>my-shop</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <modules>
        <module>my-shop-dependencies</module>
        <module>my-shop-commons</module>
        <module>my-shop-domain</module>
        <module>my-shop-web-admin</module>
        <module>my-shop-web-ui</module>
        <module>my-shop-web-api</module>
    </modules>
</project>
```
我们可以在 Root 工程中使用 Maven 提供的 `mvn clean` 命令测试一下效果，控制台输出如下：
```
[INFO] Scanning for projects...
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Build Order:
[INFO]
[INFO] my-shop
[INFO] my-shop-dependencies
[INFO] my-shop-commons
[INFO] my-shop-domain
[INFO] my-shop-web-admin
[INFO] my-shop-web-ui
[INFO] my-shop-web-api
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] Building my-shop 1.0.0-SNAPSHOT
[INFO] ------------------------------------------------------------------------
[INFO]
[INFO] --- maven-clean-plugin:2.5:clean (default-clean) @ my-shop ---
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] Building my-shop-dependencies 1.0.0-SNAPSHOT
[INFO] ------------------------------------------------------------------------
[INFO]
[INFO] --- maven-clean-plugin:2.5:clean (default-clean) @ my-shop-dependencies ---
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] Building my-shop-commons 1.0.0-SNAPSHOT
[INFO] ------------------------------------------------------------------------
[INFO]
[INFO] --- maven-clean-plugin:2.5:clean (default-clean) @ my-shop-commons ---
[INFO] Deleting D:\Workspace\my-shop\my-shop-commons\target
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] Building my-shop-domain 1.0.0-SNAPSHOT
[INFO] ------------------------------------------------------------------------
[INFO]
[INFO] --- maven-clean-plugin:2.5:clean (default-clean) @ my-shop-domain ---
[INFO] Deleting D:\Workspace\my-shop\my-shop-domain\target
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] Building my-shop-web-admin 1.0.0-SNAPSHOT
[INFO] ------------------------------------------------------------------------
[INFO]
[INFO] --- maven-clean-plugin:2.5:clean (default-clean) @ my-shop-web-admin ---
[INFO] Deleting D:\Workspace\my-shop\my-shop-web-admin\target
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] Building my-shop-web-ui 1.0.0-SNAPSHOT
[INFO] ------------------------------------------------------------------------
[INFO]
[INFO] --- maven-clean-plugin:2.5:clean (default-clean) @ my-shop-web-ui ---
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] Building my-shop-web-api 1.0.0-SNAPSHOT
[INFO] ------------------------------------------------------------------------
[INFO]
[INFO] --- maven-clean-plugin:2.5:clean (default-clean) @ my-shop-web-api ---
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Summary:
[INFO]
[INFO] my-shop ............................................ SUCCESS [  0.158 s]
[INFO] my-shop-dependencies ............................... SUCCESS [  0.004 s]
[INFO] my-shop-commons .................................... SUCCESS [  0.020 s]
[INFO] my-shop-domain ..................................... SUCCESS [  0.016 s]
[INFO] my-shop-web-admin .................................. SUCCESS [  0.033 s]
[INFO] my-shop-web-ui ..................................... SUCCESS [  0.012 s]
[INFO] my-shop-web-api .................................... SUCCESS [  0.008 s]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 0.400 s
[INFO] Finished at: 2018-06-12T07:47:58+08:00
[INFO] Final Memory: 8M/241M
[INFO] ------------------------------------------------------------------------
```