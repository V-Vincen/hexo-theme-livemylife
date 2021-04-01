---
title: '[Mybatis] 8 MyBatis 中 jdbcType、javaType、ofType 的区别'
catalog: true
date: 2019-07-21 20:19:05
subtitle: jdbcType、javaType、ofType 的区别
header-img: /img/mybatis/mybatis_bg2.png
tags:
- Mybatis
---

## MyBatis 中何时使用 jdbcType
这个 `SQL` 有时候这样写：`select * from user where name = #{name}` ,有时候可以这样写: `select * from user where name = #{name,jdbcType=VARCHAR}` ,到底什么时候使用 `jdbcType` 呢,什么时候不使用呢?

- 当传入的参数 `name`  的值为空的时候,这个需要带上 `jdbcType=VARCHAR` 这个,其他不为空的情况下就不用带
  `jdbcType=VARCHAR`

- 如果参入的参数 `name` 的值为空,而没有加上 `jdbcType` 这个来限定类型的话,执行的 `SQL` 会报异常：
```
Error querying database.  Cause: org.postgresql.util.PSQLException: ERROR: could not determine data type of parameter $1
```

## `MyBatis` 的 `jdbcType` 和 `javaType` 什么时候用
如果数据库 `id` 字段是 `int` 类型，那么它的 `jdbc` 就是 `Integer` 类型。当实体类的这个映射属性 `id` 为 `Long` 类型时，如果不设置 `jdbcType` 和 `javaType` 的话，查询的结果返回给实体时就会转换错误，写了这两个 `mybatis` 就会帮我们转换成相应的类型，从来避免发生错误。

## `ofType` 和 `javaType` 的区别
`JavaType` 和 `ofType` 都是用来指定对象类型的，但是 `JavaType`  是用来指定 `pojo` 中属性的类型，而 `ofType` 指定的是映射到 `list` 集合属性中 `pojo` 的类型。

### `pojo` 类：
```
publicclass User {
    privateint id;
    privateString username;
    privateString mobile;
    privateList<Post>posts;
}
```

### `user.xml`：
```
<resultMap type="User" id="resultUserMap">
    <result property="id" javaType="int" column="user_id" />
    <result property="username" javaType="string" column="username" />
    <result property="mobile"  column="mobile" />
        <!--javatype指定的是user对象的属性的类型（例如id，posts），而oftype指定的是映射到list集合属性中pojo的类型（本例指的是post类型）-->
        <collection property="posts" ofType="com.spenglu.Post" javaType="java.util.ArrayList" column="userid">
        	<id property="id" column="post_id" javaType="int" jdbcType="INTEGER"/>   
            <result property="title" column="title" javaType="string" jdbcType="VARCHAR"/>
            <result property="content" column="content" javaType="string" jdbcType="VARCHAR"/>
        </collection>
</resultMap>
```

## `Mybatis` 中 `jdbcType` 和 `javaType` 以及数据库类型的对应关系

| jdbcType      | javaType                        | mysql              | oracle         |
| ------------- | ------------------------------- | ------------------ | -------------- |
| CHAR          | String                          | CHAR               | CHAR           |
| VARCHAR       | String                          | VARCHAR            | VARCHAR        |
| LONGVARCHAR   | String                          | VARCHAR            | LONG           |
| NUMERIC       | java.math.BigDecimal            | NUMERIC            | NUMERIC/NUMBER |
| DECIMAL       | java.math.BigDecimal            | DECIMAL            | DECIMAL        |
| BIT           | boolean                         |                    | BIT            |
| BOOLEAN       | boolean                         |                    |                |
| TINYINT       | byte                            | TINYINT            | TINYINT        |
| SMALLINT      | short                           | SMALLINT           | SMALLINT       |
| INTEGER       | int                             | INTEGER            | INTEGER        |
| BIGINT        | long                            | BIGINT             |                |
| REAL          | float                           | REAL               | REAL           |
| FLOAT         | double                          | FLOAT              | FLOAT          |
| DOUBLE        | double                          | DOUBLE             | NUMBER         |
| BINARY        | byte[]                          |                    |                |
| VARBINARY     | byte[]                          |                    |                |
| LONGVARBINARY | byte[]                          |                    |                |
| DATE          | java.sql.Date                   | DATE               | DATE           |
| TIME          | java.sql.Time                   |                    | TIME           |
| TIMESTAMP     | java.sql.Timestamp              | TIMESTAMP/DATETIME | TIMESTAMP      |
| CLOB          | Clob                            | CLOB               | CLOB           |
| BLOB          | Blob                            | BLOB               | BLOB           |
| ARRAY         | Array                           |                    |                |
| DISTINCT      | mapping of underlying type      |                    |                |
| STRUCT        | Struct                          |                    |                |
| REF           | Ref                             |                    |                |
| DATALINK      | java.net.URL                    |                    |                |
| NCLOB         |                                 |                    | NCLOB          |

