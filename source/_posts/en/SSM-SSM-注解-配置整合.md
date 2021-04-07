---
title: '[SSM] SSM 注解 配置整合'
catalog: true
date: 2019-08-04 19:08:07
subtitle: 注解配置整合
header-img: /img/ssm/ssm_bg.png
tags:
- SSM
---

## 基本概念

`SSM：Spring+SpringMVC+MyBatis`

**Spring**

Spring 是一个开源框架，Spring 是于2003年兴起的一个轻量级的Java 开发框架，由 Rod Johnson 在其著作 Expert One-On-One J2EE Development and Design 中阐述的部分理念和原型衍生而来。它是为了解决企业应用开发的复杂性而创建的。Spring 使用基本的 JavaBean 来完成以前只可能由 EJB 完成的事情。然而，Spring 的用途不仅限于服务器端的开发。从简单性、可测试性和松耦合的角度而言，任何 Java 应用都可以从 Spring 中受益。 简单来说，Spring 是一个轻量级的控制反转（IOC）和面向切面（AOP）的容器框架。

**SpringMVC**

Spring MVC 属于 SpringFrameWork 的后续产品，已经融合在 Spring Web Flow 里面。Spring MVC  分离了控制器、模型对象、分派器以及处理程序对象的角色，这种分离让它们更容易进行定制。

**MyBatis**

MyBatis 本是 apache 的一个开源项目 iBatis, 2010年这个项目由 apache software foundation 迁移到了 google code，并且改名为 MyBatis 。MyBatis 是一个基于 Java 的持久层框架。iBATIS 提供的持久层框架包括 SQL Maps 和 Data Access Objects（DAO）MyBatis 消除了几乎所有的 JDBC 代码和参数的手工设置以及结果集的检索。MyBatis 使用简单的 XML 或注解用于配置和原始映射，将接口和 Java 的 POJOs（Plain Old Java Objects，普通的 Java 对象）映射成数据库中的记录。

SSM 框架整合是当下最流行的企业级项目技术选型，三个框架分别负责不同的功能，整合起来共同来支持企业级项目的开发需求，与 SSH 的思想是一样，只不过替换了更优秀的框架，用 SpringMVC 替代 Struts2，用 MyBatis 替代 Hibernate。SpringMVC 负责 MVC 设计模式的实现，MyBatis 负责数据持久层，Spring 的 IOC 来管理 SpringMVC 和 MyBatis 相关对象的创建注入，Spring 的 AOP 负责事务管理。

此次 `SSM` 整合，以 `注解` 配置为主

## 配置 `pom.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>ssm-anno</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <java.version>1.8</java.version>

        <spring.version>5.1.5.RELEASE</spring.version>
        <commons-logging.version>1.2</commons-logging.version>
        <mysql.version>8.0.16</mysql.version>
        <mybatis.version>3.4.6</mybatis.version>
        <druid.version>1.1.10</druid.version>
        <mybatis-spring.version>1.3.2</mybatis-spring.version>
        <javax.servlet-api.version>4.0.1</javax.servlet-api.version>
        <lombok.version>1.18.8</lombok.version>
        <log4j.version>1.2.17</log4j.version>
        <slf4j.version>1.7.25</slf4j.version>
        <junit.version>4.12</junit.version>

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
            <artifactId>spring-webmvc</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-aspects</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
            <version>${commons-logging.version}</version>
        </dependency>
        <!-- Spring End -->

        <!-- Database Begin -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>${mysql.version}</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>${mybatis.version}</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>${druid.version}</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>${mybatis-spring.version}</version>
        </dependency>
        <!-- Database End -->

        <!-- Servlet Begin -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>${javax.servlet-api.version}</version>
        </dependency>
        <!-- Servlet End -->

        <!-- Lombok Begin -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>${lombok.version}</version>
        </dependency>
        <!-- Lombok End -->

        <!-- Test Begin -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-test</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>${junit.version}</version>
        </dependency>
        <!-- Test End -->

        <!-- Log4j Begin -->
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
        <!-- Log4j End -->
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

## 配置 `web.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <servlet>
        <servlet-name>DispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextClass</param-name>
            <param-value>org.springframework.web.context.support.AnnotationConfigWebApplicationContext</param-value>
        </init-param>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>com.example.my.shop.config.WebMvcConfig</param-value>
        </init-param>
    </servlet>

    <servlet-mapping>
        <servlet-name>DispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>


    <!-- 配置 encodingFilter 过滤器 -->
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

    <!-- 配置 DruidStatView（配置 Druid 监控中心） -->
    <servlet>
        <servlet-name>DruidStatView</servlet-name>
        <servlet-class>com.alibaba.druid.support.http.StatViewServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>DruidStatView</servlet-name>
        <url-pattern>/druid/*</url-pattern>
    </servlet-mapping>


    <welcome-file-list>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>
</web-app>
```


## 配置 `WebMvcConfig` 类
`WebMvcConfig` 类相当于 `spring-mvc.xml` 配置文件
```java
//定义当前类为配置信息类
@Configuration

//开启 WebMvc 功能，初始化 mvc 各项配置
@EnableWebMvc

//扫描当前包和递归子包的下的组件（这里主要扫描 @Controller 注解）
@ComponentScan("com.example.ssm.anno.controller")

//引入 "application.properties" 配置文件
@PropertySource("classpath:application.properties")

//导入 "AppConfig.class" 配置类
@Import(value = AppConfig.class)
public class WebMvcConfig implements WebMvcConfigurer {

    //通过上下文环境，获取 "application.properties" 中的配置信息
    @Autowired
    private Environment environment;

    //配置 InternalResourceViewResolver（视图解析器）
    @Bean
    public InternalResourceViewResolver viewResolver() {
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix(environment.getProperty("web.view.prefix"));
        viewResolver.setSuffix(environment.getProperty("web.view.suffix"));
        return viewResolver;
    }

    //配置静态资源映射
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**").addResourceLocations("/static/").setCachePeriod(31536000);
    }

}
```

### 配置 `application.properties` 
```properties
#============================#
#==== Framework settings ====#
#============================#

# Spring MVC 视图解析器
web.view.prefix=/WEB-INF/views/
web.view.suffix=.jsp


#============================#
#======= JDBC settings ======#
#============================#
# JDBC
# MySQL 8.x: com.mysql.cj.jdbc.Driver
jdbc.driverClass=com.mysql.cj.jdbc.Driver
jdbc.connectionURL=jdbc:mysql://localhost:3306/springmvc?useUnicode=true&characterEncoding=utf-8&useSSL=false
jdbc.username=root
jdbc.password=123456

# JDBC Pool
jdbc.pool.init=1
jdbc.pool.minIdle=3
jdbc.pool.maxActive=20

```

## 配置 `AppConfig` 类
`AppConfig` 类相当于 `spring-context.xml` 配置文件
```java
//定义当前类为配置信息类
@Configuration

//扫描当前包和递归子包的下的组件（这里主要扫描 @Service 注解）
@ComponentScan("com.example.ssm.anno.service")

//扫描 Mapper 接口（这里主要扫描 @Mapper 注解）
@MapperScan("com.example.ssm.anno.dao")

//引入 "application.properties" 配置文件
@PropertySource("classpath:application.properties")

//开启 Aop 代理模式
@EnableAspectJAutoProxy

//开启事务管理器注解
@EnableTransactionManagement
public class AppConfig {

    //通过上下文环境，获取 "application.properties" 中的配置信息
    @Autowired
    private Environment environment;

    //配置 Druid 数据库连接池
    @Bean
    public DruidDataSource druidDataSource() {
        DruidDataSource druidDataSource = new DruidDataSource();
        druidDataSource.setDriverClassName(environment.getProperty("jdbc.driverClass"));
        druidDataSource.setUrl(environment.getProperty("jdbc.connectionURL"));
        druidDataSource.setUsername(environment.getProperty("jdbc.username"));
        druidDataSource.setPassword(environment.getProperty("jdbc.password"));
        druidDataSource.setInitialSize(Integer.parseInt(environment.getProperty("jdbc.pool.init")));
        druidDataSource.setMinIdle(Integer.parseInt(environment.getProperty("jdbc.pool.minIdle")));
        druidDataSource.setMaxActive(Integer.parseInt(environment.getProperty("jdbc.pool.maxActive")));
        return druidDataSource;
    }

    //配置 MyBatis 的 SqlSession
    @Bean
    public SqlSessionFactoryBean sqlSessionFactoryBean(@Autowired DruidDataSource druidDataSource) throws IOException {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(druidDataSource);
        factoryBean.setTypeAliasesPackage("com.example.ssm.anno.entity");

        ClassPathResource classPathResource = new ClassPathResource("mybatis-config.xml");
        factoryBean.setConfigLocation(classPathResource);

        //动态获取 SqlMapper
        PathMatchingResourcePatternResolver resourcePatternResolver = new PathMatchingResourcePatternResolver();
        factoryBean.setMapperLocations(resourcePatternResolver.getResources("classpath:/mapperxml/**/*.xml"));
        return factoryBean;
    }

    //配置事务管理器
    @Bean
    public PlatformTransactionManager dataSourceTransactionManager(@Autowired DruidDataSource druidDataSource) {
        DataSourceTransactionManager dstm = new DataSourceTransactionManager();
        dstm.setDataSource(druidDataSource);
        return dstm;
    }

    //配置 JdbcTemplate 数据持久层模板
    @Bean
    public JdbcTemplate jdbcTemplate(@Autowired DruidDataSource druidDataSource){
        JdbcTemplate jdbcTemplate = new JdbcTemplate();
        jdbcTemplate.setDataSource(druidDataSource);
        return jdbcTemplate;
    }
}
```

### 配置 `mybatis-config.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- 全局参数 -->
    <settings>
        <!-- 打印 SQL 语句 -->
        <!-- <setting name="logImpl" value="STDOUT_LOGGING" />-->

        <!-- 使全局的映射器启用或禁用缓存。 -->
        <setting name="cacheEnabled" value="false"/>

        <!-- 全局启用或禁用延迟加载。当禁用时，所有关联对象都会即时加载。 -->
        <setting name="lazyLoadingEnabled" value="true"/>

        <!-- 当启用时，有延迟加载属性的对象在被调用时将会完全加载任意属性。否则，每种属性将会按需要加载。 -->
        <setting name="aggressiveLazyLoading" value="true"/>

        <!-- 是否允许单条 SQL 返回多个数据集 (取决于驱动的兼容性) default:true -->
        <setting name="multipleResultSetsEnabled" value="true"/>

        <!-- 是否可以使用列的别名 (取决于驱动的兼容性) default:true -->
        <setting name="useColumnLabel" value="true"/>

        <!-- 允许 JDBC 生成主键。需要驱动器支持。如果设为了 true，这个设置将强制使用被生成的主键，有一些驱动器不兼容不过仍然可以执行。 default:false  -->
        <setting name="useGeneratedKeys" value="false"/>

        <!-- 指定 MyBatis 如何自动映射 数据基表的列 NONE：不映射 PARTIAL：部分 FULL:全部  -->
        <setting name="autoMappingBehavior" value="PARTIAL"/>

        <!-- 这是默认的执行类型 （SIMPLE: 简单； REUSE: 执行器可能重复使用prepared statements语句；BATCH: 执行器可以重复执行语句和批量更新） -->
        <setting name="defaultExecutorType" value="SIMPLE"/>

        <!-- 使用驼峰命名法转换字段。 -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>

        <!-- 设置本地缓存范围 session:就会有数据的共享 statement:语句范围 (这样就不会有数据的共享 ) defalut:session -->
        <setting name="localCacheScope" value="SESSION"/>

        <!-- 设置 JDBC 类型为空时,某些驱动程序 要指定值, default:OTHER，插入空值时不需要指定类型 -->
        <setting name="jdbcTypeForNull" value="NULL"/>
    </settings>
</configuration>
```

## 配置 `log4j.properties`
```properties
log4j.rootLogger=INFO, console, file

log4j.appender.console=org.apache.log4j.ConsoleAppender
log4j.appender.console.layout=org.apache.log4j.PatternLayout
log4j.appender.console.layout.ConversionPattern=%d %p [%c] - %m%n

log4j.appender.file=org.apache.log4j.DailyRollingFileAppender
log4j.appender.file.File=logs/log.log
log4j.appender.file.layout=org.apache.log4j.PatternLayout
log4j.appender.A3.MaxFileSize=1024KB
log4j.appender.A3.MaxBackupIndex=10
log4j.appender.file.layout.ConversionPattern=%d %p [%c] - %m%n


log4j.logger.com.example.ssm.anno.dao = TRACE
```

## 测试
### 编写 `TestController` controller
```java
@Controller
public class TestController {
    @RequestMapping(value = "test",method = RequestMethod.GET)
    public String springMVCTest(@RequestParam("name") String name, Model model){
        model.addAttribute("result",name);
        return "test";
    }
}
```

### 编写 `User` entity
```java
@Data
public class User {
    private Integer id;
    private String username;
    private String password;
    private String realname;
    private String email;
    private String phone;
    private String sex;
    private Date birth;
}
```

### 编写 `UserMapper` dao（mapper）
```java
@Mapper
public interface UserMapper {
	List<User> selectAll();
}
```
### 编写 `UserMapper.xml` mapperxml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.ssm.anno.dao.UserMapper">
    <resultMap id="BaseResultMap" type="com.example.ssm.anno.entity.User">
        <!--@mbg.generated-->
        <id column="id" jdbcType="INTEGER" property="id"/>
        <result column="userName" jdbcType="VARCHAR" property="username"/>
        <result column="password" jdbcType="VARCHAR" property="password"/>
        <result column="realName" jdbcType="VARCHAR" property="realname"/>
        <result column="email" jdbcType="VARCHAR" property="email"/>
        <result column="phone" jdbcType="VARCHAR" property="phone"/>
        <result column="sex" jdbcType="VARCHAR" property="sex"/>
        <result column="birth" jdbcType="TIMESTAMP" property="birth"/>
    </resultMap>

    <sql id="Base_Column_List">
        <!--@mbg.generated-->
        id, userName, `password`, realName, email, phone, sex, birth
    </sql>

    <!--auto generated by MybatisCodeHelper on 2019-08-02-->
    <select id="selectAll" resultMap="BaseResultMap">
        select
        <include refid="Base_Column_List"/>
        from user
    </select>

</mapper>
```

### 先编写 `springContextTest` 测试类：
```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = AppConfig.class)
public class springContextTest {

    // 测试 "AppConfig.class" 配置类
    // 1.测试 dao 层（mybatis）
    @Autowired
    private UserMapper userMapper;

    @Test
    public void selectAll(){
        List<User> users = userMapper.selectAll();
        for (User user : users) {
            System.out.println(user);
        }
    }

    // 2.测试 JdbcTemplate
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void jdbcTemplateTest() {
        String sql = "select * from user";
        List<User> users = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(User.class));
        for (User user : users) {
            System.out.println(user);
        }
    }
}
```

### 再编写 `springMVCTest` 测试类：
```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = WebMvcConfig.class)
@WebAppConfiguration
public class springMVCTest {

    // 测试 "WebMvcConfig.class" 配置类
    // web spring 容器实例
    @Autowired
    private WebApplicationContext wac;

    // 控制器单元测试入口
    private MockMvc mockMvc;

    // 初始化 web 测试环境
    @Before
    public void initMockMvc() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Test
    public void testHello() throws Exception {
        mockMvc.perform(get("/test?name=Vincent"))
                .andExpect(status().isOk()) //Http 状态码 200
                .andExpect(view().name("test")) //返回的 jsp 视图名
                .andExpect(model().attribute("result", "Vincent")); //模型数据细节
    }
}
```

案例源码：https://gitee.com/V_Vincen/ssm-anno