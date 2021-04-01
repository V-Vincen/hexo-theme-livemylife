---
title: '[Mybatis] 6 MyBatis 动态 SQL '
catalog: true
date: 2019-06-26 01:53:49
subtitle: MyBatis 动态 SQL
header-img: /img/mybatis/mybatis_bg2.png
tags:
- Mybatis
---

动态 SQL，主要用于解决查询条件不确定的情况：在程序运行期间，根据用户提交的查询条件进行查询。提交的查询条件不同，执行的 SQL 语句不同。若将每种可能的情况均逐一列出，对所有条件进行排列组合，将会出现大量的 SQL 语句。此时，可使用动态 SQL 来解决这样的问题。

![1](1.png)

动态 SQL，即通过 MyBatis 提供的各种标签对条件作出判断以实现动态拼接 SQL 语句。

这里的条件判断使用的表达式为 OGNL 表达式。常用的动态 SQL 标签有 `<if>`、`<where>`、`<choose>`、`<foreach>` 等。

## 注意事项
---
在 mapper 的动态 SQL 中若出现大于号（`>`）、小于号（`<`）、大于等于号（`>=`），小于等于号（`<=`）等符号，最好将其转换为实体符号。否则，XML 可能会出现解析出错问题。

特别是对于小于号（`<`），在 XML 中是绝对不能出现的。否则，一定出错。

![2](2.png)

## if 标签
---
对于该标签的执行，当 test 的值为 true 时，会将其包含的 SQL 片断拼接到其所在的 SQL 语句中。

本例实现的功能是：查询出满足用户提交查询条件的所有学生。用户提交的查询条件可以包含一个姓名的模糊查询，同时还可以包含一个年龄的下限。当然，用户在提交表单时可能两个条件均做出了设定，也可能两个条件均不做设定，也可以只做其中一项设定。

这引发的问题是，查询条件不确定，查询条件依赖于用户提交的内容。此时，就可使用动态 SQL 语句，根据用户提交内容对将要执行的 SQL 进行拼接。

### 定义映射文件
为了解决两个条件均未做设定的情况，在 `where` 后添加了一个`“1=1”`的条件。这样就不至于两个条件均未设定而出现只剩下一个 `where`，而没有任何可拼接的条件的不完整 SQL 语句。
```
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.lusifer.mybatis.dao.DynamicStudentDao">
    <!-- if -->
    <select id="selectByIf" resultType="com.lusifer.mybatis.entity.Student">
        SELECT
            id,
            name,
            age,
            score
        FROM
            student
        WHERE 1 = 1
        <if test="name != null and name != ''">
            AND name LIKE concat('%', #{name}, '%')
        </if>
        <if test="age != null and age > 0">
            AND age > #{age}
        </if>
    </select>
</mapper>
```

## where 标签
---
`<if/>` 标签的中存在一个比较麻烦的地方：需要在 `where` 后手工添加 `1=1` 的子句。因为，若 `where` 后的所有 `<if/>` 条件均为 `false`，而 `where` 后若又没有 `1=1` 子句，则 SQL 中就会只剩下一个空的 `where`，SQL 出错。所以，在 `where` 后，需要添加永为真子句 1=1，以防止这种情况的发生。但当数据量很大时，会严重影响查询效率。

### 定义映射文件
```
<!-- where-->
<select id="selectByWhere" resultType="com.lusifer.mybatis.entity.Student">
    SELECT
        id,
        name,
        age,
        score
    FROM
      student
    <where>
        <if test="name != null and name != ''">
            AND name LIKE concat('%', #{name}, '%')
        </if>
        <if test="age != null and age > 0">
            AND age > #{age}
        </if>
    </where>
</select>
```

## choose 标签
---
该标签中只可以包含 `<when/>` `<otherwise/>`，可以包含多个 `<when/>` 与一个 `<otherwise/>`。它们联合使用，完成 Java 中的开关语句 switch..case 功能。

本例要完成的需求是，若姓名不空，则按照姓名查询；若姓名为空，则按照年龄查询；若没有查询条件，则没有查询结果。

### 定义映射文件
---
```
<!-- choose -->
<select id="selectByChoose" resultType="com.lusifer.mybatis.entity.Student">
    SELECT
        id,
        name,
        age,
        score
    FROM
      student
    <where>
        <choose>
            <when test="name != null and name != ''">
                AND name LIKE concat('%', #{name}, '%')
            </when>
            <when test="age != null and age > 0">
                AND age > #{age}
            </when>
            <otherwise>
                AND 1 != 1
            </otherwise>
        </choose>
    </where>
</select>
```

## foreach 标签 -- 遍历数组
---
`<foreach/>` 标签用于实现对于数组与集合的遍历。对其使用，需要注意：
- collection 表示要遍历的集合类型，这里是数组，即 array。
- open、close、separator 为对遍历内容的 SQL 拼接。

本例实现的需求是，查询出 id 为 2 与 4 的学生信息。

### 定义映射文件
动态 SQL 的判断中使用的都是 OGNL 表达式。OGNL 表达式中的数组使用 `array` 表示，数组长度使用 `array.length` 表示。
![3](3.png)
```
<!-- foreach -->
<select id="selectByForeach" resultType="com.lusifer.mybatis.entity.Student">
    <!-- select * from student where id in (2, 4) -->
    SELECT
        id,
        name,
        age,
        score
    FROM
      student
    <if test="array != null and array.length > 0">
        WHERE id IN
        <foreach collection="array" open="(" close=")" item="id" separator=",">
            #{id}
        </foreach>
    </if>
</select>
```

## foreach 标签 -- 遍历集合
---
遍历集合的方式与遍历数组的方式相同，只不过是将 `array` 替换成了 `list`

> ### 遍历泛型为基本类型的 List

### 定义 DAO 接口
```
/**
 * 使用 foreach 标签以 list 基本类型的形式查询
 * @param ids
 * @return
 */
public List<Student> selectByForeachWithListBase(List<Long> ids);
```
### 定义映射文件
```
<!-- foreach -->
<select id="selectByForeachWithListBase" resultType="com.lusifer.mybatis.entity.Student">
    <!-- select * from student where id in (2, 4) -->
    SELECT
        id,
        name,
        age,
        score
    FROM
      student
    <if test="list != null and list.size > 0">
        WHERE id IN
        <foreach collection="list" open="(" close=")" item="id" separator=",">
            #{id}
        </foreach>
    </if>
</select>
```

> ### 遍历泛型为自定义类型的 List

### 定义 DAO 接口
```
/**
 * 使用 foreach 标签以 list 自定义类型的形式查询
 * @param students
 * @return
 */
public List<Student> selectByForeachWithListCustom(List<Student> students);
```
### 定义映射文件
```
<!-- foreach -->
<select id="selectByForeachWithListCustom" resultType="com.lusifer.mybatis.entity.Student">
    <!-- select * from student where id in (2, 4) -->
    SELECT
        id,
        name,
        age,
        score
    FROM
      student
    <if test="list != null and list.size > 0">
        WHERE id IN
        <foreach collection="list" open="(" close=")" item="student" separator=",">
            #{student.id}
        </foreach>
    </if>
</select>
```

## sql 标签
---
`<sql/>` 标签用于定义 SQL 片断，以便其它 SQL 标签复用。而其它标签使用该 SQL 片断， 需要使用 `<include/>` 子标签。该 `<sql/>` 标签可以定义 SQL 语句中的任何部分，所以 `<include/>` 子标签可以放在动态 SQL 的任何位置。

### 修改映射文件
```
<sql id="select">
    SELECT
        id,
        name,
        age,
        score
    FROM
      student
</sql>
```

```
<!-- foreach -->
<select id="selectByForeachWithListCustom" resultType="com.lusifer.mybatis.entity.Student">
    <!-- select * from student where id in (2, 4) -->
    <include refid="select" />

    <if test="list != null and list.size > 0">
        WHERE id IN
        <foreach collection="list" open="(" close=")" item="student" separator=",">
            #{student.id}
        </foreach>
    </if>
</select>
```
![4](4.png)