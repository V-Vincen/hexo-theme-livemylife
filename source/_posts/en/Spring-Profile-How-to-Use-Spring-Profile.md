---
title: '[Spring Profile] How to Use Spring Profile'
catalog: true
date: 2021-01-18 17:48:34
subtitle: Profiles are a core feature of the framework — allowing us to map our beans to different profiles — for example, dev, test, and prod....
header-img: /img/header_img/archive_bg4.jpg
tags:
- Spring Profile
---

## 简介
Profile 的意思是配置，对于应用程序来说，不同的环境需要不同的配置。
比如：

* 开发环境，应用需要连接一个可供调试的数据库单机进程
* 生产环境，应用需要使用正式发布的数据库，通常是高可用的集群
* 测试环境，应用只需要使用内存式的模拟数据库

Spring 框架提供了多 profile 的管理功能，我们可以使用 profile 功能来区分不同环境的配置。

## 区分 Bean 对象
首先，我们先看看如何基于 Profile 来定义一个 Bean。通过 `@Profile` 注解可以为一个 Bean 赋予对应的 profile 名称，如下：
```java
@Component
@Profile("dev")
public class DevDatasourceConfig
```
上面的 DevDatasourceConfig 被定义为 profile=dev，于是该 Bean 只会在 dev（开发环境）模式下被启用。如果需要定义为非 dev 环境，可以使用这样的形式：
```java
@Component
@Profile("!dev")
public class DevDatasourceConfig
```

### XML 风格配置
上面的例子也可以使用 XML 配置文件达到同样的目的，如下：
```xml
<beans profile="dev">
    <bean id="devDatasourceConfig" class="org.baeldung.profiles.DevDatasourceConfig" />
</beans>
```

### 读取 Profile
通过 ConfigurableEnvironment 这个 Bean 可以获得当前的 Profile，如下：
```java
public class ProfileManager {
    @Autowired
    Environment environment;

    public void getActiveProfiles() {
        for (final String profileName : environment.getActiveProfiles()) {
            System.out.println("Currently active profile - " + profileName);
        }   
    }
}
```

## 设置 Profile
接下来，为了让容器 **仅仅注册那些所需要的 Bean**，我们需要通过一些手段来设置当前的 profile。有很多方法可以达到这个目的，下面一一介绍。

### WebApplicationInitializer 接口
在 Web 应用程序中，通过 WebApplicationInitializer 可以对当前的 ServletContext 进行配置。如下，通过注入 `spring.profiles.active` 变量可以为 Spring 上下文指定当前的 profile：
```java
@Configuration
public class MyWebApplicationInitializer implements WebApplicationInitializer {

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException{
        servletContext.setInitParameter("spring.profiles.active", "dev");
    }
}
```

### 通过 web.xml 定义
与上面的方法类似，在 web.xml 中通过 context-param 元素也可以设置 profile。但前提是当前应用程序使用了 xml 的配置文件风格，如下：
```xml
<context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>/WEB-INF/app-config.xml</param-value>
</context-param>
<context-param>
    <param-name>spring.profiles.active</param-name>
    <param-value>dev</param-value>
</context-param>
```

### JVM 启动参数
通过 Java 程序启动参数同样可以对 profile 进行设定，如下：
```
java -jar application.jar -Dspring.profiles.active=dev
```

### 环境变量
在 Unix/Linux 环境中，可以通过环境变量注入 profile 的值：
```shell
export spring_profiles_active=dev
java -jar application.jar
```

### application.properties
可以在 `application.properties` 配置文件中指定 `spring.profiles.active` 属性：
```properties
spring.profiles.active=dev
```
SpringBoot 默认会加载并读取该配置，当发现为 profile=dev 时，会同时关联加载 `application-dev.properties` 这个配置。这种方式非常简单，可以实现对不同环境采用单独的配置文件进行隔离。

### Maven Profile
Maven 本身也提供了 profile 的功能，可以通过 Maven 的 profile 配置来指定 Spring 的 Profile。这种做法稍微有点复杂，需要先在 pom.xml 中设定不同的 maven profile，如下：
```xml
<profiles>
    <profile>
        <id>dev</id>
        <activation>
            <activeByDefault>true</activeByDefault>
        </activation>
        <properties>
            <spring.profiles.active>dev</spring.profiles.active>
        </properties>
    </profile>
    <profile>
        <id>prod</id>
        <properties>
            <spring.profiles.active>prod</spring.profiles.active>
        </properties>
    </profile>
</profiles>
```

这里，分别声明了 dev 和 prod 两个 profile，每个 profile 都包含了一个`spring.profiles.active` 属性，这个属性用来注入到 Spring 中的 profile 入参。在  SpringBoot 的配置文件 `application.properties` 中，需要替换为这个 maven 传入的property：
```properties
# 使用 Maven 的属性进行替换
spring.profiles.active=@spring.profiles.active@
```

接下来，需要让 Maven 在打包时能将 `application.properties` 进行过滤处理，同时替换掉变量，需编辑 pom.xml 如下：
```xml
<build>
    <resources>
        <resource>
            <directory>src/main/resources</directory>
            <filtering>true</filtering>
        </resource>
    </resources>
</build>
```

这里定义了 filtering=true，因此 Resource 打包插件会对配置文件执行过滤。如果你的项目 pom 定义继承自 spring-boot-starter-parent，那么可以不需要配置这个 filter。最后，在 maven 打包时指定参数如下：
```mvn
mvn clean package -Pprod
```

### 使用 `@ActiveProfiles`
`@ActiveProfile` 是用于单元测试场景的注解，可以为测试代码指定一个隔离的 profile，如下：
```java
@ActiveProfiles("test")
public void ApiTest{
  ...
}
```

### 使用 ConfigurableEnvironment
ConfigurableEnvironment 这个 Bean 封装了当前环境的配置信息，你可以在启动应用前进行设定操作：
```java
SpringApplication application = new SpringApplication(MyApplication.class);

// 设置 environment 中的 profile
ConfigurableEnvironment environment = new StandardEnvironment();
environment.setActiveProfiles("dev","join_dev");

application.setEnvironment(environment);
application.run(args)
```

### SpringApplication.setAdditionalProfiles
SpringApplication 这个类还提供了 setAdditionalProfiles 方法，用来让我们实现 **附加** 式的 profile。这些 profile 会同时被启用，而不是替换原来的 active profile，如下：
```java
SpringApplication application = new SpringApplication(MyApplication.class);
application.setAdditionalProfiles("new_dev");
```

这种方式可以实现无条件的启用 profile，优先级是最高的。 当然，还可以通过设定 **spring.profiles.include** 来达到同样的目的。

## 优先级
至此，我们已经提供了很多种方法来设定 Spring 应用的 profile，当它们同时存在时则会根据一定优先级来抉择，参考如下：

1. SpringApplication.setAdditionalProfiles
2. ConfigurableEnvironment、@ActiveProfiles
3. Web.xml的 context-param
4. WebApplicationInitializer
5. JVM 启动参数
6. 环境变量
7. Maven profile、application.properties

从上至下，优先级从高到低排列。 其中，Maven profile 与配置文件的方式相同，环境变量以及 JVM 启动参数会覆盖配置文件的内容。1 和 2 则属于进程内的控制逻辑，优先级更高。 如果在启动 SpringBoot 应用前对当前 ConfigurableEnvironment 对象注入了 profile，则会优先使用这个参数，ActiveProfiles 用于测试环境，其原理与此类似。SpringApplication.setAdditionalProfiles 则是无论如何都会附加的 profile，优先级最高。

## 案例
最后，我们在 SpringBoot 中演示一个使用 Profile 的例子。一般，在开发环境和生产环境中的数据源配置是不同的，借助 Profile 我们可以定义出不同环境的数据源 Bean。首先我们先创建一个接口：
```java
public interface DatasourceConfig {
    public void setup();
}
```

对于开发环境，DatasourceConfig 实现如下：
```java
@Component
@Profile("dev")
public class DevDatasourceConfig implements DatasourceConfig {
    @Override
    public void setup() {
        System.out.println("Setting up datasource for DEV environment. ");
    }
}
```

同样，为生产环境也实现一个 DatasourceConfig：
```java
@Component
@Profile("production")
public class ProductionDatasourceConfig implements DatasourceConfig {
    @Override
    public void setup() {
       System.out.println("Setting up datasource for PRODUCTION environment. ");
    }
}
```

接下来，我们声明一个 Bean，对数据源执行初始化方法：
```java
@Component
public class SpringProfilesTest {
    @Autowired
    DatasourceConfig datasourceConfig;

    @PostConstruct
    public void setupDatasource() {
        datasourceConfig.setup();
    }
}
```

之后，在 application.properties 的配置为：
```properties
spring.profiles.active=dev
```
启动 SpringBoot 应用，发现输出如下：
```
Setting up datasource for DEV environment.
```
此时说明 dev 的 profile 被启用了！

参靠：https://www.baeldung.com/spring-profiles
参靠：https://www.cnblogs.com/huahua-test/p/11576907.html