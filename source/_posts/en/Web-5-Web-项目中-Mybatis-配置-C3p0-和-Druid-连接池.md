---
title: '[Web] 5 Web 项目中 Mybatis 配置 C3p0 和 Druid 连接池'
catalog: true
date: 2019-06-26 03:48:28
subtitle: Web 配置 C3p0 和 Druid
header-img: /img/web/web_bg.png
tags:
- Web
---

## pom.xml 文件:
---
下面为：Web 项目中 Mybatis 配置 C3p0 和 Druid 连接池，所需要的全部依赖，其中我们主要用到的依赖有 `javax.servlet：javax.servlet-api`、`com.alibaba：druid`、`com.mchange：c3p0`、`org.mybatis：mybatis`、`mysql：mysql-connector-java`、`log4j：log4j`、`junit：junit` 等。

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>my_shop_mybatis</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <properties>
        <!-- 环境配置 -->
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>

        <!-- 统一的依赖管理 -->
        <servlet-api.version>4.0.1</servlet-api.version>
        <jstl.version>1.2</jstl.version>
        <slf4j.version>1.7.25</slf4j.version>
        <druid.version>1.1.6</druid.version>
        <c3p0.version>0.9.5.2</c3p0.version>
        <mybatis.version>3.4.6</mybatis.version>
        <mysql.version>8.0.15</mysql.version>
        <log4j.version>1.2.17</log4j.version>
        <commons-logging.version>1.2</commons-logging.version>
        <junit.version>4.12</junit.version>
        <commons-lang3.version>3.5</commons-lang3.version>

        <spring-web.version>5.1.6.RELEASE</spring-web.version>
    </properties>

    <dependencies>
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

        <!-- druid Begin -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>${druid.version}</version>
        </dependency>
        <!-- druid End -->

        <!-- c3p0 Begin -->
        <dependency>
            <groupId>com.mchange</groupId>
            <artifactId>c3p0</artifactId>
            <version>${c3p0.version}</version>
        </dependency>
        <!-- c3p0 End -->

        <!-- mybatis -->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>${mybatis.version}</version>
        </dependency>
        <!-- mybatis -->
        <!-- mysql Begin -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>${mysql.version}</version>
        </dependency>
        <!-- mysql End -->

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
        <!-- Commons-logging Begin-->
        <!--<dependency>
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
            <version>${commons-logging.version}</version>
        </dependency>-->
        <!-- Commons-logging End -->


        <!-- junit Begin -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
        <!-- junit End -->

        <!-- Commons Begin -->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
            <version>${commons-lang3.version}</version>
        </dependency>
        <!-- Commons End -->

        <!-- lombok Begin -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.16.20</version>
            <scope>provided</scope>
        </dependency>
        <!-- lombok End -->

        <!-- Spring-web Begin -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-web</artifactId>
            <version>${spring-web.version}</version>
        </dependency>
        <!-- Spring-web End -->

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

## Mybatis 配置文件：
---
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!-- 引入数据库连接配置文件 -->
    <properties resource="db.properties"></properties>


    <settings>
        <!-- 打印 SQL 语句 -->
        <!--<setting name="logImpl" value="STDOUT_LOGGING" />-->

        <!-- 设置驼峰命名规则 将数据库的字段jj_kk 自动映射到POJO 的jjKk 属性 -->
        <!-- 设置org.apache.ibatis.session.Configuration 的属性 mapUnderscoreToCamelCase-->
        <!--<setting name="mapUnderscoreToCamelCase" value="true"/>-->

        <!-- 打开延迟加载的开关 -->
        <setting name="lazyLoadingEnabled" value="true"/>
        <!-- 将积极加载改为消极加载即按需加载 -->
        <setting name="aggressiveLazyLoading" value="false"/>

        <!-- 获取自增主键 全局配置 但是insert中还是要配 keyProperty="id" -->
        <!--<setting name="useGeneratedKeys" value="true"/>-->

        <!-- 获取自增主键 全局配置 但是insert中还是要配 keyProperty="id" -->
        <setting name="useGeneratedKeys" value="true"/>
    </settings>

    <!-- 定义类的别名 -->
    <typeAliases>
        <!-- 在映射文件中使用别名 -->
        <!--<typeAlias type="com.feifan.pojo.User" alias="User"/>-->
        <!-- 多个类，可以通过配置包扫描 默认别名为类名 -->
        <package name="com.example.my.shop.mybatis.entity"/>
    </typeAliases>


    <!-- 多个 开发环境，测试环境，选择开发环境 -->
    <environments default="production">
        <environment id="development">
            <!--决定事务作用域和控制方式的事务管理器（TransactionManager)  -->
            <transactionManager type="JDBC"></transactionManager>
            <!-- 数据源采用连接池POOLED/UNPOOLED -->
            <dataSource type="POOLED">
                <property name="driver" value="${jdbcDriver}"/>
                <property name="url" value="${jdbcUrl}"/>
                <property name="username" value="${jdbcUser}"/>
                <property name="password" value="${jdbcPassword}"/>
            </dataSource>
        </environment>
        <!-- 测试环境 C3P0连接池 -->
        <environment id="test">
            <transactionManager type="JDBC"></transactionManager>
            <dataSource type="com.example.my.shop.mybatis.utils.C3P0DatasourceFactory">
                <property name="driverClass" value="${jdbcDriver}"/>
                <property name="jdbcUrl" value="${jdbcUrl}"/>
                <property name="user" value="${jdbcUser}"/>
                <property name="password" value="${jdbcPassword}"/>
                <property name="initialPoolSize" value="5"/>
                <property name="maxPoolSize" value="20"/>
                <property name="minPoolSize" value="5"/>
            </dataSource>
        </environment>

        <!-- 生产环境 -->
        <environment id="production">
            <transactionManager type="JDBC"></transactionManager>
            <dataSource type="com.example.my.shop.mybatis.utils.DruidDataSourceFactory">
                <property name="driverClassName" value="${jdbcDriver}"/>
                <property name="url" value="${jdbcUrl}"/>
                <property name="username" value="${jdbcUser}"/>
                <property name="password" value="${jdbcPassword}"/>
            </dataSource>
        </environment>

    </environments>
    <!-- 定义映射文件 -->
    <mappers>
        <!-- sql映射文件的路径 -->
        <!-- <mapper resource="com/feifan/mapper/UserMapper.xml"/>
        <mapper resource="com/feifan/mapper/tbUserMapper.xml"/>  -->
        <!-- 也可以通过配置接口的包扫描，但是xml文件路径要和接口的包路径一样-->
        <package name="com.example.my.shop.mybatis.dao"/>
    </mappers>
</configuration>
```
### 数据库链接信息：（db.properties）
```properties
jdbcDriver=com.mysql.cj.jdbc.Driver
jdbcUrl=jdbc:mysql://localhost:3306/myshop?useUnicode=true&characterEncoding=utf-8&useSSL=false
jdbcUser=root
jdbcPassword=123456
```

## 查看 sql 执行日志 log4j.properties：
---
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


# 打印sql语句:debug; 执行结果:trace
## 指定mapper配置文件中的namespace
#com.feifan.mapper.UserMapper 单个接口
#com.feifan.mapper包下面所有的
log4j.logger.com.example.my.shop.mybatis.dao =TRACE
```

## 两个 POJO 类：
---
```java
@Data
public class TbUser implements Serializable {
    private Long id;
    private String userName;
    private String passWord;
    private String phone;
    private String email;
    private Date created;
    private Date updated;
}
```

## 获取 Sqlsession 工具类：
---
```java
package com.example.my.shop.mybatis.utils;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.mapping.Environment;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;

public class MybatisUtils {
    private static SqlSessionFactory sqlSessionFactory;

    private MybatisUtils() {
    }

    static {
        String resource = "MybatisConfig.xml";
        try {
            //读取配置文件 获取sqlsessionFactory
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
            Configuration configuration = sqlSessionFactory.getConfiguration();
            System.out.println(String.format("configuration: %s ",configuration));

            Environment environment = configuration.getEnvironment();
            System.out.println(String.format("environment: %s ",environment));

            DataSource dataSource = environment.getDataSource();
            System.out.println(String.format("dataSource: %s ",dataSource));

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取sqlSession
     *
     * @return
     */
    public static SqlSession getSqlSession() {
        SqlSession sqlSession = sqlSessionFactory.openSession();
        return sqlSession;
    }
}
```

## 整合 c3p0/Druid 连接池:
---
Mybatis 没有帮开发者实现 c3p0 数据库连接池，故需要使用者自己实现 c3p0 来加载数据连接池。其实很简单的，只要继承 UnpooledDataSourceFactory 并把 dataSource 实现。我们的 mybatis 就实现了 c3p0 数据库连接池。

### C3p0 连接池
```java
package com.example.my.shop.mybatis.utils;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import org.apache.ibatis.datasource.unpooled.UnpooledDataSourceFactory;

/**
 * Mybatis 没有帮开发者实现 c3p0 数据库连接池，
 * 故需要使用者自己实现 c3p0 来加载数据连接池
 * 。其实很简单的，只要继承 UnpooledDataSourceFactory 并把 dataSource 实现。
 * 我们的 mybatis 就实现了 c3p0 数据库连接池。
 */
public class C3P0DatasourceFactory extends UnpooledDataSourceFactory {
    public C3P0DatasourceFactory() {
        this.dataSource = new ComboPooledDataSource();
    }
}
```

### Druid 连接池
```java
package com.example.my.shop.mybatis.utils;

import com.alibaba.druid.pool.DruidDataSource;
import org.apache.ibatis.datasource.unpooled.UnpooledDataSourceFactory;

public class DruidDataSourceFactory extends UnpooledDataSourceFactory {
    public DruidDataSourceFactory() {
        this.dataSource = new DruidDataSource();
    }
}
```

## Mapper 接口：
---
```java
package com.example.my.shop.mybatis.dao;

import com.example.my.shop.mybatis.entity.TbUser;
import java.util.List;

public interface TbUserMapper {

    List<TbUser> findAll();
}
```

## Mapper.xml 映射：
---
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.my.shop.mybatis.dao.TbUserMapper">

    <resultMap id="BaseResultMap" type="com.example.my.shop.mybatis.entity.TbUser">
        <id column="id" jdbcType="BIGINT" property="id"/>
        <result column="username" jdbcType="VARCHAR" property="userName"/>
        <result column="password" jdbcType="VARCHAR" property="passWord"/>
        <result column="phone" jdbcType="VARCHAR" property="phone"/>
        <result column="email" jdbcType="VARCHAR" property="email"/>
        <result column="created" jdbcType="TIMESTAMP" property="created"/>
        <result column="updated" jdbcType="TIMESTAMP" property="updated"/>
    </resultMap>

    <select id="findAll" resultMap="BaseResultMap">
        SELECT * FROM tb_user
    </select>

</mapper>
```

## 测试类：
---
```java
package com.example.my.shop.mybatis;

import com.example.my.shop.mybatis.dao.TbUserMapper;
import com.example.my.shop.mybatis.entity.TbUser;
import com.example.my.shop.mybatis.utils.MybatisUtils;
import org.apache.ibatis.session.SqlSession;
import org.junit.Test;

import java.util.List;

public class TestMybatis {

    @Test
    public void findAll(){
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        TbUserMapper tbUserMapper = sqlSession.getMapper(TbUserMapper.class);
        List<TbUser> all = tbUserMapper.findAll();
        for (TbUser tbUser : all) {
            System.out.println(tbUser);
        }

    }
}
```
### 测试结果
```
"E:\Program Files\Java\jdk1.8.0_161\bin\java.exe" -ea -Didea.test.cyclic.buffer.size=1048576 "-javaagent:E:\IDEA\IntelliJ IDEA 2019.1.1\lib\idea_rt.jar=63685:E:\IDEA\IntelliJ IDEA 2019.1.1\bin" -Dfile.encoding=UTF-8 -classpath "E:\IDEA\IntelliJ IDEA 2019.1.1\lib\idea_rt.jar;E:\IDEA\IntelliJ IDEA 2019.1.1\plugins\junit\lib\junit-rt.jar;E:\IDEA\IntelliJ IDEA 2019.1.1\plugins\junit\lib\junit5-rt.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\charsets.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\deploy.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\ext\access-bridge-64.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\ext\cldrdata.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\ext\dnsns.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\ext\jaccess.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\ext\jfxrt.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\ext\localedata.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\ext\nashorn.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\ext\sunec.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\ext\sunjce_provider.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\ext\sunmscapi.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\ext\sunpkcs11.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\ext\zipfs.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\javaws.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\jce.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\jfr.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\jfxswt.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\jsse.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\management-agent.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\plugin.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\resources.jar;E:\Program Files\Java\jdk1.8.0_161\jre\lib\rt.jar;F:\IdeaProjects\my_shop_mybatis\target\test-classes;F:\IdeaProjects\my_shop_mybatis\target\classes;E:\MavenMyRepository\javax\servlet\javax.servlet-api\4.0.1\javax.servlet-api-4.0.1.jar;E:\MavenMyRepository\javax\servlet\jstl\1.2\jstl-1.2.jar;E:\MavenMyRepository\com\alibaba\druid\1.1.6\druid-1.1.6.jar;E:\MavenMyRepository\com\mchange\c3p0\0.9.5.2\c3p0-0.9.5.2.jar;E:\MavenMyRepository\com\mchange\mchange-commons-java\0.2.11\mchange-commons-java-0.2.11.jar;E:\MavenMyRepository\org\mybatis\mybatis\3.4.6\mybatis-3.4.6.jar;E:\MavenMyRepository\mysql\mysql-connector-java\8.0.15\mysql-connector-java-8.0.15.jar;E:\MavenMyRepository\com\google\protobuf\protobuf-java\3.6.1\protobuf-java-3.6.1.jar;E:\MavenMyRepository\org\slf4j\slf4j-api\1.7.25\slf4j-api-1.7.25.jar;E:\MavenMyRepository\org\slf4j\slf4j-log4j12\1.7.25\slf4j-log4j12-1.7.25.jar;E:\MavenMyRepository\org\slf4j\jcl-over-slf4j\1.7.25\jcl-over-slf4j-1.7.25.jar;E:\MavenMyRepository\org\slf4j\jul-to-slf4j\1.7.25\jul-to-slf4j-1.7.25.jar;E:\MavenMyRepository\log4j\log4j\1.2.17\log4j-1.2.17.jar;E:\MavenMyRepository\junit\junit\4.12\junit-4.12.jar;E:\MavenMyRepository\org\hamcrest\hamcrest-core\1.3\hamcrest-core-1.3.jar;E:\MavenMyRepository\org\apache\commons\commons-lang3\3.5\commons-lang3-3.5.jar;E:\MavenMyRepository\org\projectlombok\lombok\1.16.20\lombok-1.16.20.jar;E:\MavenMyRepository\org\springframework\spring-web\5.1.6.RELEASE\spring-web-5.1.6.RELEASE.jar;E:\MavenMyRepository\org\springframework\spring-beans\5.1.6.RELEASE\spring-beans-5.1.6.RELEASE.jar;E:\MavenMyRepository\org\springframework\spring-core\5.1.6.RELEASE\spring-core-5.1.6.RELEASE.jar;E:\MavenMyRepository\org\springframework\spring-jcl\5.1.6.RELEASE\spring-jcl-5.1.6.RELEASE.jar" com.intellij.rt.execution.junit.JUnitStarter -ideVersion5 -junit4 com.example.my.shop.mybatis.TestMybatis,findAll
configuration: org.apache.ibatis.session.Configuration@6cc7b4de 
environment: org.apache.ibatis.mapping.Environment@32cf48b7 
dataSource: {
	CreateTime:"2019-05-25 20:05:44",
	ActiveCount:0,
	PoolingCount:0,
	CreateCount:0,
	DestroyCount:0,
	CloseCount:0,
	ConnectCount:0,
	Connections:[
	]
} 
2019-05-25 20:05:45,033 INFO [com.alibaba.druid.pool.DruidDataSource] - {dataSource-1} inited
2019-05-25 20:05:45,374 DEBUG [com.example.my.shop.mybatis.dao.TbUserMapper.findAll] - ==>  Preparing: SELECT * FROM tb_user 
2019-05-25 20:05:45,463 DEBUG [com.example.my.shop.mybatis.dao.TbUserMapper.findAll] - ==> Parameters: 
2019-05-25 20:05:45,515 TRACE [com.example.my.shop.mybatis.dao.TbUserMapper.findAll] - <==    Columns: id, username, password, phone, email, created, updated
2019-05-25 20:05:45,517 TRACE [com.example.my.shop.mybatis.dao.TbUserMapper.findAll] - <==        Row: 1, Vincent, e10adc3949ba59abbe56e057f20f883e, 15021074475, 601521821@qq.com, 2019-05-01 22:16:33, 2019-05-01 22:16:36
2019-05-25 20:05:45,522 TRACE [com.example.my.shop.mybatis.dao.TbUserMapper.findAll] - <==        Row: 2, admin, e10adc3949ba59abbe56e057f20f883e, 13800000000, admin@admin.com, 2019-05-03 15:56:27, 2019-05-03 15:56:27
2019-05-25 20:05:45,523 TRACE [com.example.my.shop.mybatis.dao.TbUserMapper.findAll] - <==        Row: 3, 111, 698d51a19d8a121ce581499d7b701668, 13800000001, test@111.com, 2019-05-06 10:21:21, 2019-05-06 10:21:21
2019-05-25 20:05:45,525 TRACE [com.example.my.shop.mybatis.dao.TbUserMapper.findAll] - <==        Row: 4, 222, 698d51a19d8a121ce581499d7b701668, 13800000002, test@222.com, 2019-05-06 10:21:34, 2019-05-06 10:21:34
2019-05-25 20:05:45,527 TRACE [com.example.my.shop.mybatis.dao.TbUserMapper.findAll] - <==        Row: 5, 333, 310dcbbf4cce62f762a2aaa148d556bd, 13800000003, test@333.com, 2019-05-06 10:21:50, 2019-05-06 10:21:50
2019-05-25 20:05:45,529 TRACE [com.example.my.shop.mybatis.dao.TbUserMapper.findAll] - <==        Row: 33, Test, 123456, 13816000987, test@qq.com, 2019-05-14 01:13:34, 2019-05-14 01:13:34
2019-05-25 20:05:45,530 DEBUG [com.example.my.shop.mybatis.dao.TbUserMapper.findAll] - <==      Total: 6
TbUser{id=1, userName='Vincent', passWord='e10adc3949ba59abbe56e057f20f883e', phone='15021074475', email='601521821@qq.com', created=Wed May 01 22:16:33 CST 2019, updated=Wed May 01 22:16:36 CST 2019}
TbUser{id=2, userName='admin', passWord='e10adc3949ba59abbe56e057f20f883e', phone='13800000000', email='admin@admin.com', created=Fri May 03 15:56:27 CST 2019, updated=Fri May 03 15:56:27 CST 2019}
TbUser{id=3, userName='111', passWord='698d51a19d8a121ce581499d7b701668', phone='13800000001', email='test@111.com', created=Mon May 06 10:21:21 CST 2019, updated=Mon May 06 10:21:21 CST 2019}
TbUser{id=4, userName='222', passWord='698d51a19d8a121ce581499d7b701668', phone='13800000002', email='test@222.com', created=Mon May 06 10:21:34 CST 2019, updated=Mon May 06 10:21:34 CST 2019}
TbUser{id=5, userName='333', passWord='310dcbbf4cce62f762a2aaa148d556bd', phone='13800000003', email='test@333.com', created=Mon May 06 10:21:50 CST 2019, updated=Mon May 06 10:21:50 CST 2019}
TbUser{id=33, userName='Test', passWord='123456', phone='13816000987', email='test@qq.com', created=Tue May 14 01:13:34 CST 2019, updated=Tue May 14 01:13:34 CST 2019}

Process finished with exit code 0
```