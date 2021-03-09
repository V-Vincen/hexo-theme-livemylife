---
title: '[JUnit] 1 JUnit 用法'
catalog: true
date: 2019-06-24 01:02:45
subtitle: JUnit 单元测试
header-img: /img/junit/junit_bg.png
tags:
- JUnit
---

## JUnit 4 注解
| 注解                                        | 描述                                                                                                   |
|-------------------------------------------|------------------------------------------------------------------------------------------------------|
| `@Test`  public void method()               | 测试注释指示该公共无效方法它所附着可以作为一个测试用例。                                                                         |
| `@Before`  public void method()             | Before 注释表示，该方法必须在类中的每个测试之前执行，以便执行测试某些必要的先决条件。                                                       |
| `@BeforeClass`  public static void method() | BeforeClass 注释指出这是附着在静态方法必须执行一次并在类的所有测试之前。发生这种情况时一般是测试计算共享配置方法(如连接到数据库)。                             |
| `@After`  public void method()              | After 注释指示，该方法在执行每项测试后执行(如执行每一个测试后重置某些变量，删除临时变量等)                                                    |
| `@AfterClass`  public static void method()  | 当需要执行所有的测试在 JUnit 测试用例类后执行，AfterClass 注解可以使用以清理建立方法，(从数据库如断开连接)。注意：附有此批注(类似于 BeforeClass)的方法必须定义为静态。 |
| `@Ignore`  public static void method()      | 当想暂时禁用特定的测试执行可以使用忽略注释。每个被注解为 @Ignore 的方法将不被执行。                                                       |

## JUnit 4 单元测试
### POM
`pom.xml` 文件如下：
```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.funtl</groupId>
    <artifactId>hello-spring</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>4.3.17.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```
主要增加了 `junit:junit` 依赖

### 创建测试类
在测试包下 `src/main/test` 创建一个名为 `MyTest` 的测试类，代码如下：
```
package com.funtl.hello.spring.test;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class MyTest {

    /**
     * 执行测试方法前执行
     */
    @Before
    public void before() {
        System.out.println("执行 before() 方法");
    }

    /**
     * 执行测试方法后执行
     */
    @After
    public void after() {
        System.out.println("执行 after() 方法");
    }

    @Test
    public void testSayHi() {
        System.out.println("Hi Log4j");
    }

    @Test
    public void testSayHello() {
        System.out.println("Hello Log4j");
    }
}
```

## 	Junit 5 与 Junit 4 区别
| 特性                                             | Junit 4      | Junit 5     |
|------------------------------------------------|--------------|-------------|
| 在当前类的所有测试方法之前执行。注解在静态方法上。此方法可以包含一些初始化代码。       | @BeforeClass | @BeforeAll  |
| 在当前类中的所有测试方法之后执行。注解在静态方法上。此方法可以包含一些清理代码。       | @AfterClass  | @AfterAll   |
| 在每个测试方法之前执行。注解在非静态方法上。可以重新初始化测试方法所需要使用的类的某些属性。 | @Before      | @BeforeEach |
| 在每个测试方法之后执行。注解在非静态方法上。可以回滚测试方法引起的数据库修改。        | @After       | @AfterEach  |


### 执行顺序

![1](1.png)

