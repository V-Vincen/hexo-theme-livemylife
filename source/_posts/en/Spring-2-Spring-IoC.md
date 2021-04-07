---
title: '[Spring] 2 Spring IoC'
catalog: true
date: 2019-06-23 23:55:47
subtitle: Spring IoC
header-img: /img/spring/spring_bg.png
tags:
- Spring
---

## POM

创建一个工程名为 spring-ioc-demo 的项目，`pom.xml` 文件如下：
```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>spring-ioc-demo</artifactId>
    <version>1.0.0-SNAPSHOT</version>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>

        <spring.version>5.1.5.RELEASE</spring.version>
        <lombok.version>1.16.20</lombok.version>
        <junit.version>4.12</junit.version>
        <log4j.version>1.2.17</log4j.version>
        <slf4j.version>1.7.25</slf4j.version>
    </properties>

    <dependencies>

        <!-- Spring Begin -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-test</artifactId>
            <version>${spring.version}</version>
            <scope>test</scope>
        </dependency>

        <!-- Spring End -->

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>${junit.version}</version>
        </dependency>

        <!-- lombok Begin -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>${lombok.version}</version>
            <scope>provided</scope>
        </dependency>
        <!-- lombok End -->

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
    </build>

</project>
```
**核心包**：主要增加了 org.springframework: <font color=red size=4>**spring-context**</font> 依赖

## 案例一，基于 `xml` 配置

### 创建 `entity`
```java
@Data
public class Student {
    private int id;
    private String name;
    private String email;
    private String address;
    private Hobboy hobboy;
}
```
```java
@Data
public class Hobboy {
    private String basketball;
    private String football;
    private String running;
}
```

### 创建 Spring 配置文件
在 `src/main/resources` 目录下创建 `spring-context.xml` 配置文件，从现在开始类的实例化工作交给 Spring 容器管理（IoC），配置文件如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd http://www.springframework.org/schema/cache http://www.springframework.org/schema/cache/spring-cache.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd http://www.springframework.org/schema/task http://www.springframework.org/schema/task/spring-task.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

    <bean id="stu" class="com.example.spring.demo.entity.Student">
        <property name="id" value="10"></property>
        <property name="name" value="vincent"></property>
        <property name="email" value="601521821@qq.com"></property>
        <property name="address" value="上海市、宝山区"></property>
        <property name="hobboy" ref="hob"></property>
    </bean>
    <bean id="hob" class="com.example.spring.demo.entity.Hobboy">
        <property name="basketball" value="Nike"></property>
        <property name="football" value="Adidas"></property>
        <property name="running" value="5km"></property>
    </bean>

</beans>
```
`<bean/>`：用于定义一个实例对象。一个实例对应一个 bean 元素。

`id`：该属性是 Bean 实例的唯一标识，程序通过 id 属性访问 Bean，Bean 与 Bean 间的依赖关系也是通过 id 属性关联的。

`class`：指定该 Bean 所属的类，注意这里只能是类，不能是接口

### 测试 Spring IoC
创建一个 `GetBeanTest` 测试类，测试对象是否能够通过 Spring 来创建，代码如下：
```java
public class GetBeanTest {

    @Test
    public void testGetBean() {
    	ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("spring-context.xml");
        Student stu = (Student) applicationContext.getBean("stu");
        System.out.println(stu);
    }
}
```

测试结果：
```
Student(id=10, name=vincent, email=601521821@qq.com, address=上海市、宝山区, hobboy=Hobboy(basketball=Nike, football=Adidas, running=5km))
```

## 案例一，基于注解配置
### 改造 `entity`
```java
@Data
@Component
public class Student {
    @Value("10")
    private int id;

    @Value("Vincrnt")
    private String name;

    @Value("601521821@qq.com")
    private String email;

    @Value("上海市宝山区")
    private String address;

    @Autowired
    private Hobboy hobboy;
}
```
```java
@Data
@Component
public class Hobboy {
    @Value("Nike")
    private String basketball;

    @Value("Adidas")
    private String football;

    @Value("5km")
    private String running;
}
```

### 改造 Spring 配置文件
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd http://www.springframework.org/schema/cache http://www.springframework.org/schema/cache/spring-cache.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd http://www.springframework.org/schema/task http://www.springframework.org/schema/task/spring-task.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

    <!-- 开启自动注解 -->
    <context:annotation-config/>
    
    <!-- 扫描全部的整个项目的包 -->
    <context:component-scan base-package="com.example.spring.ioc.demo"/>

</beans>
```
### 改造测试类 Spring IoC
```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring-context.xml")
public class GetBeanTest {

    @Autowired
    private Student student;

    @Test
    public void annotationStu(){
        System.out.println(student);
    }

}
```

测试结果：
```
Student(id=10, name=vincent, email=601521821@qq.com, address=上海市、宝山区, hobboy=Hobboy(basketball=Nike, football=Adidas, running=5km))
```


## 案例二，基于 `xml` 配置
### 创建 StudentService 接口
```java
public interface StudentService {
    public void sayHi();
}
```

### 创建 UserServiceImpl 实现类
```java
public class StudentServiceImpl implements StudentService {
    public void sayHi() {
        System.out.println("Hello Spring IoC !!!");
    }
}
```

### 创建 Spring 配置文件
在 `src/main/resources` 目录下创建 `spring-context.xml` 配置文件，从现在开始类的实例化工作交给 Spring 容器管理（IoC），配置文件如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
       http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="studentService" class="com.example.spring.demo.service.impl.StudentServiceImpl" />
</beans>
```
`<bean />`：用于定义一个实例对象。一个实例对应一个 bean 元素。

`id`：该属性是 Bean 实例的唯一标识，程序通过 id 属性访问 Bean，Bean 与 Bean 间的依赖关系也是通过 id 属性关联的。

`class`：指定该 Bean 所属的类，注意这里只能是类，不能是接口。

### 测试 Spring IoC
创建一个 `GetBeanTest` 测试类，测试对象是否能够通过 Spring 来创建，代码如下：
```java
public class GetBeanTest {
    @Test
    public void sayHi() {
        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("spring-context.xml");
        StudentService studentServiceImpl = (StudentService) applicationContext.getBean("studentService");
        String sayHi = studentServiceImpl.sayHi();
        System.out.println(sayHi);
    }
}
```

测试结果
```
Hello Spring IoC ！！！
```

## 案例二，基于注解配置
### 改造实现类，加上注解 `@Service`
```java
@Service
public class StudentServiceImpl implements StudentService {
    @Override
    public String sayHi() {
        return "Hello Spring IoC ！！！";
    }
}
```

### 改造 Spring 配置文件
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd http://www.springframework.org/schema/cache http://www.springframework.org/schema/cache/spring-cache.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd http://www.springframework.org/schema/task http://www.springframework.org/schema/task/spring-task.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

    <!-- 开启自动注解 -->
    <context:annotation-config/>
    
    <!-- 扫描全部的整个项目的包 -->
    <context:component-scan base-package="com.example.spring.ioc.demo"/>

</beans>
```

### 改造测试类 Spring IoC
```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring-context.xml")
public class GetBeanTest {
    @Autowired
    private StudentService studentService;

    @Test
    public void annotationSayHi() {
        String sayHi = studentService.sayHi();
        System.out.println(sayHi);
}
```

测试结果：
```
Hello Spring IoC ！！！
```