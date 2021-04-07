---
title: '[PageHelper] Mybatis 分页插件 PageHelper'
catalog: true
date: 2019-06-30 02:45:18
subtitle: Mybatis 分页插件 PageHelper
header-img: /img/springboot/pagehelper_bg2.png
tags:
- PageHelper
---

在实际的项目开发中，常常需要使用到分页，分页方式分为两种：前端分页和后端分页。

## 前端分页
一次 ajax 请求数据的所有记录，然后在前端缓存并且计算 count 和分页逻辑，一般前端组件（例如 dataTable）会提供分页动作。
特点是：简单，很适合小规模的 web 平台；当数据量大的时候会产生性能问题，在查询和网络传输的时间会很长。

## 后端分页
在 ajax 请求中指定页码 pageNum 和每页的大小 pageSize ，后端查询出当页的数据返回，前端只负责渲染。
特点是：复杂一些；性能瓶颈在MySQL的查询性能，这个当然可以调优解决。一般来说，开发使用的是这种方式。

## 不使用分页插件的分页操作
在没有使用分页插件的时候需要先写一个查询 `count` 的 `select` 语句，然后再写一个真正分页查询的语句，MySQL 中有对分页的支持，是通过 limit 子句

`limit` 关键字的用法是: `LIMIT [offset,] rows`

`offset` 是相对于首行的偏移量(首行是0)，`rows` 是返回条数。

例如：

每页5条记录，取第一页，返回的是前5条记录
```
select * from tableA limit 0,5;
```
每页5条记录，取第二页，返回的是第6条记录，到第10条记录，
```
select * from tableA limit 5,5;
```
不过当偏移量逐渐增大的时候，查询速度可能就会变慢，性能会有所下降。

## 使用Mybatis分页插件PageHelper
---
PageHelper 是一款好用的开源免费的 Mybatis 第三方物理分页插件

Github 地址：https://github.com/pagehelper/Mybatis-PageHelper

官方地址：https://pagehelper.github.io/

## 在 SpringBoot 中使用 PageHelper
---
### 引入依赖
在 `pom.xml` 文件中引入 `pagehelper-spring-boot-starter` 依赖
```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.2.10</version>
</dependency>
```
<font color=red>**注意：无需任何多余配置**</font>


## 在 Spring 中使用 PageHelper
---
### 首先要在 `pom.xml` 中配置 `PageHelper` 的依赖
在 http://www.mvnrepository.com/ 中可以发现 `pagehelper` 有 `4.x` 和 `5.x` 两个版本，用法有所不同，并不是向下兼容，在使用 `5.x` 版本的时候可能会报错
```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>4.2.1</version>
</dependency>
```

### 在 Mybatis 的配置文件中配置 PageHelper 插件
假如不配置在后面使用 `PageInfo` 类时就会出现问题，输出结果的 `PageInfo` 属性值基本上都是错的
配置如下：
```xml
<plugins>
        <!-- com.github.pagehelper为PageHelper类所在包名 -->
        <plugin interceptor="com.github.pagehelper.PageHelper">
            <property name="dialect" value="mysql"/>
            <!-- 该参数默认为false -->
            <!-- 设置为true时，会将RowBounds第一个参数offset当成pageNum页码使用 -->
            <!-- 和startPage中的pageNum效果一样-->
            <property name="offsetAsPageNum" value="false"/>
            <!-- 该参数默认为false -->
            <!-- 设置为true时，使用RowBounds分页会进行count查询 -->
            <property name="rowBoundsWithCount" value="false"/>
            <!-- 设置为true时，如果pageSize=0或者RowBounds.limit = 0就会查询出全部的结果 -->
            <!-- （相当于没有执行分页查询，但是返回结果仍然是Page类型）-->
            <property name="pageSizeZero" value="true"/>
            <!-- 3.3.0版本可用 - 分页参数合理化，默认false禁用 -->
            <!-- 启用合理化时，如果pageNum<1会查询第一页，如果pageNum>pages会查询最后一页 -->
            <!-- 禁用合理化时，如果pageNum<1或pageNum>pages会返回空数据 -->
            <property name="reasonable" value="true"/>
            <!-- 3.5.0版本可用 - 为了支持startPage(Object params)方法 -->
            <!-- 增加了一个`params`参数来配置参数映射，用于从Map或ServletRequest中取值 -->
            <!-- 可以配置pageNum,pageSize,count,pageSizeZero,reasonable,不配置映射的用默认值 -->
            <!--<property name="params" value="pageNum=start;pageSize=limit;pageSizeZero=zero;reasonable=heli;count=contsql"/>-->
        </plugin>
    </plugins>
```
上面是 `PageHelper` 官方给的配置和注释，虽然写的很多，不过确实描述的很明白。
- **`dialect`**：标识是哪一种数据库，设计上必须。
- **`offsetAsPageNum`**：将 `RowBounds` 第一个参数 `offset` 当成 `pageNum` 页码使用
- **`rowBoundsWithCount`**：设置为 `true` 时，使用 `RowBounds` 分页会进行 `count` 查询
- **`reasonable`**：`value=true` 时，`pageNum` 小于1会查询第一页，如果 `pageNum` 大于 `pageSize` 会查询最后一页

<font color=red>**注：**</font>上面的配置只针对于 pagehelper4.x 版本的，如果你用的是 pagehelper5.x 版本就要这样配置

## 官方推荐
### 在 MyBatis 配置 xml 中配置拦截器插件
```xml
<!-- 
    plugins在配置文件中的位置必须符合要求，否则会报错，顺序如下:
    properties?, settings?, 
    typeAliases?, typeHandlers?, 
    objectFactory?,objectWrapperFactory?, 
    plugins?, 
    environments?, databaseIdProvider?, mappers?
-->
<plugins>
    <!-- com.github.pagehelper为PageHelper类所在包名 -->
    <plugin interceptor="com.github.pagehelper.PageInterceptor">
        <!-- 使用下面的方式配置参数，后面会有所有的参数介绍 -->
        <property name="param1" value="value1"/>
    </plugin>
</plugins>
```
###  或者在 Spring 配置文件中配置拦截器插件
```xml
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
  <!-- 注意其他配置 -->
  <property name="plugins">
    <array>
      <bean class="com.github.pagehelper.PageInterceptor">
        <property name="properties">
          <!--使用下面的方式配置参数，一行配置一个 -->
          <value>
            params=value1
          </value>
        </property>
      </bean>
    </array>
  </property>
</bean>
```
### 个人推荐使用第一种，配置如下
```xml
<!-- 配置分页插件 -->
    <plugins>
        <plugin interceptor="com.github.pagehelper.PageInterceptor">
            <!-- 设置数据库类型 Oracle,Mysql,MariaDB,SQLite,Hsqldb,PostgreSQL六种数据库-->
            <property name="helperDialect" value="mysql"/>
        </plugin>
    </plugins>
```
**如果 4.x 的版本用了 5.x 的版本报错信息如下**

**`springboot` 在启动项目的时候就会报错,报错信息有很多，主要是因为**
```
Caused by: org.apache.ibatis.builder.BuilderException: 
Error resolving class. Cause: org.apache.ibatis.type.TypeException: 
Could not resolve type alias 'com.github.pagehelper.PageInterceptor'.
Caused by: org.apache.ibatis.type.TypeException: 
Could not resolve type alias 'com.github.pagehelper.PageInterceptor'.
Caused by: java.lang.ClassNotFoundException: 
Cannot find class: com.github.pagehelper.PageInterceptor
```

**总的来说就是缺少了 `com.github.pagehelper.PageInterceptor`,这个是新版拦截器，5.x 版本才开始使用，所以在 4.x 版本这样配置是不行的**

**那么 5.x 版本的配置在 pagehelper4.x 上能生效吗？答案是不行**

报错信息如下：
```
Caused by: org.apache.ibatis.builder.BuilderException: 
Error parsing SQL Mapper Configuration. Cause: 
java.lang.ClassCastException: com.github.pagehelper.PageHelper 
cannot be cast to org.apache.ibatis.plugin.Interceptor
Caused by: java.lang.ClassCastException: 
com.github.pagehelper.PageHelper 
cannot be cast to org.apache.ibatis.plugin.Interceptor
```
新版的拦截器 PageInterceptor 不能和旧版拦截器相互转换，所以还是不行的。

**总的来说，pagehelper4.x 就该用 4.x 的配置，pagehelper5.x 就用 5.x 的配置（官方推荐）**

## 案例
---
### 项目中使用方法和结果
在配置完 mybatis 后，我简单的说下 pagehelper 的业务用法，就以分页查询用户列表为例
添加查询所以用户的 `mapper` 接口，对应的sql语句我就不写了
```java
List<UserVo> listUser();
```

### 重点来了，然后在 `service` 中,先开启分页，然后把查询结果集放入 `PageInfo` 中
```java
public PageInfo listUserByPage(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<UserVo> userVoList=userMapper.listUser();
        PageInfo pageInfo=new PageInfo(userVoList);
        return pageInfo;
    }
```
`PageHelper.startPage(pageNum, pageSize)`；**这句非常重要，这段代码表示分页的开始，意思是从第 `pageNum` 页开始，每页显示 `pageSize` 条记录。**

`PageInfo` 这个类是插件里的类，这个类里面的属性会在输出结果中显示,
使用 `PageInfo` 这个类,你需要将查询出来的 `list` 放进去:

### PageHelper 输出的数据结构
然后在 `controller` 层调用该方法设置对应的 `pageNum` 和 `pageSize` 就可以了，我设置 `pageNum` 为1, `pageSize` 为5，看个输出结果吧
```json
{
    "msg": "获取第1页用户信息成功",
    "code": 200,
    "data": {
        "pageNum": 1,
        "pageSize": 5,
        "size": 5,
        "orderBy": null,
        "startRow": 1,
        "endRow": 5,
        "total": 11,
        "pages": 3,
        "list": [
            {
                "userId": "a24d0c3b-2786-11e8-9835-e4f89cdc0d1f",
                "username": "2015081040"
            },
            {
                "userId": "b0bc9e45-2786-11e8-9835-e4f89cdc0d1f",
                "username": "2015081041"
            },
            {
                "userId": "b44fd6ac-2786-11e8-9835-e4f89cdc0d1f",
                "username": "2015081042"
            },
            {
                "userId": "b7ac58f7-2786-11e8-9835-e4f89cdc0d1f",
                "username": "2015081043"
            },
            {
                "userId": "bbdeb5d8-2786-11e8-9835-e4f89cdc0d1f",
                "username": "2015081044"
            }
        ],
        "prePage": 0,
        "nextPage": 2,
        "isFirstPage": true,
        "isLastPage": false,
        "hasPreviousPage": false,
        "hasNextPage": true,
        "navigatePages": 8,
        "navigatepageNums": [
            1,
            2,
            3
        ],
        "navigateFirstPage": 1,
        "navigateLastPage": 3,
        "firstPage": 1,
        "lastPage": 3
    },
    "success": true,
    "error": null
}
```

#### PageInfo这个类里面的属性:
- **`pageNum`** 当前页
- **`pageSize`** 每页的数量
- **`size`** 当前页的数量
- **`orderBy`** 排序
- **`startRow`** 当前页面第一个元素在数据库中的行号
- **`endRow`** 当前页面最后一个元素在数据库中的行号
- **`total`** 总记录数(在这里也就是查询到的用户总数)
- **`pages`** 总页数 (这个页数也很好算，每页5条，总共有11条，需要3页才可以显示完)
- **`list`** 结果集
- **`prePage`** 前一页
- **`nextPage`** 下一页
- **`isFirstPage`** 是否为第一页
- **`isLastPage`** 是否为最后一页
- **`hasPreviousPage`** 是否有前一页
- **`hasNextPage`** 是否有下一页
- **`navigatePages`** 导航页码数
- **`navigatepageNums`** 所有导航页号
- **`navigateFirstPage`** 导航第一页
- **`navigateLastPage`** 导航最后一页
- **`firstPage`** 第一页
- **`lastPage`** 最后一页

### 安全性
---
#### PageHelper 安全调用
  1.  使用 RowBounds 和 PageRowBounds参数方式是极其安全的
  2.  使用参数方式是极其安全的
  3.  使用 ISelect 接口调用是极其安全的
    `ISelect`接口方式除了可以保证安全外，还特别实现了将查询转换为单纯的 count 查询方式，这个方法可以将任意的查询方法，变成一个 `select count(*)` 的查询方法。
  4.  什么时候会导致不安全的分页？
    PageHelper 方法使用了静态的 `ThreadLocal` 参数，分页参数和线程是绑定的。

**只要你可以保证在 PageHelper 方法调用后紧跟 MyBatis 查询方法，这就是安全的。**
因为 PageHelper 在 `finally` 代码段中自动清除了 `ThreadLocal` 存储的对象。

**如果代码在进入 `Executor`  前发生异常，就会导致线程不可用，这属于人为的 Bug（例如接口方法和 XML 中的不匹配，导致找不到 `MappedStatement`  时）， 这种情况由于线程不可用，也不会导致 ThreadLocal 参数被错误的使用。**

**但是如果你写出下面这样的代码，就是不安全的用法：**
```java
PageHelper.startPage(1, 10);
List<Country> list;
if(param1 != null){
    list = countryMapper.selectIf(param1);
} else {
    list = new ArrayList<Country>();
}
```
这种情况下由于 `param1` 存在 `null` 的情况，就会导致 PageHelper  生产了一个分页参数，但是没有被消费，这个参数就会一直保留在这个线程上。当这个线程再次被使用时，就可能导致不该分页的方法去消费这个分页参数，这就产生了莫名其妙的分页。

**上面这个代码，应该写成下面这个样子：**
```java
List<Country> list;
if(param1 != null){
    PageHelper.startPage(1, 10);
    list = countryMapper.selectIf(param1);
} else {
    list = new ArrayList<Country>();
}
```
**这种写法就能保证安全。**