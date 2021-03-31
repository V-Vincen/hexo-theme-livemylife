---
title: '[Mybatis] 7 MyBatis 一对一、一对多、多对多查询'
catalog: true
date: 2019-07-21 19:25:35
subtitle: 一对一、一对多、多对多查询
header-img: /img/mybatis/mybatis_bg2.png
tags:
- Mybatis
---

## 场景
**使用三张数据表：**

- `student` 学生表
- `teacher` 教师表
- `position` 职位表

一个学生可以有多为老师、一位老师可以有多个学生、但是一个老师只能有一个职位：教授、副教授、讲师；但是一个职位可以有多个老师：例如教授可以多人

**这里则产生了：**
- 一对一关系，从老师角度：老师对职位一对一
- 一对多关系，从职位角度：职位对老师一对多
- 多对多关系：查找被教授教导的所有学生（首先职位对老师一对多，老师再对学生再对多、这里便有了一对多对多）

### 数据表 `.sql` 如下：
**老师表：**
```sql
CREATE TABLE `tb_teacher` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `t_no` varchar(20) DEFAULT NULL,
 `t_name` varchar(20) DEFAULT NULL,
 `position_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
 
/*Data for the table `tb_teacher` */
insert into `tb_teacher`(`id`,`t_no`,`t_name`,`position_id`) values
(1,'163314001','张文远',1),
(2,'163314002','赵传智',1),
(3,'163314003','风清扬',2),
(4,'163314004','王汇智',2),
(5,'163314005','汪思远',3);
```

**学生表：**
```sql
CREATE TABLE `tb_student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `t_stu_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
 
/*Data for the table `tb_student` */
insert  into `tb_student`(`id`,`t_stu_name`) values 
(1,'赵依'),
(2,'钱迩'),
(3,'张山'),
(4,'李石'),
(5,'王武'),
(6,'马柳');
```

**职位表：**
```sql
CREATE TABLE `tb_position` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `t_pos_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
 
/*Data for the table `tb_position` */
 
insert  into `tb_position`(`id`,`t_pos_name`) values 
(1,'教授'),
(2,'副教授'),
(3,'讲师');
```

**最后是教师学生关系表：**
```sql
CREATE TABLE `tb_stu_teach` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `t_stu_id` int(11) DEFAULT NULL,
  `t_teach_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
 
/*Data for the table `tb_stu_teach` */
 
insert  into `tb_stu_teach`(`id`,`t_stu_id`,`t_teach_id`) values 
(1,1,1),
(2,1,2),
(3,1,3),
(4,2,2),
(5,2,3),
(6,2,4),
(7,3,3),
(8,3,4),
(9,3,5),
(10,4,4),
(11,4,5),
(12,4,1);
```

## 在 eclipse 中的目录结构如下：
![1](1.png)

`sqlMapConfig` 该如何配置，以及 `jdbc.properties` 和 `log4j` 的作用，请自行百度。

##  `POJO` 中的三个实体
**注意**：以下的 `POJO` 都用了 `lombok` 来快速生成 `setter` 和 `getter` 等， `lomok` 具体使用，请自行百度。

### `Position.java`
```java
package com.pojo;
 
import java.io.Serializable;
import lombok.Data;
 
@Data
public class Position implements Serializable {
	private int id;
	private String name;
	private Teacher teacher;
}
```

### `Student.java`
```java
package com.pojo;
 
import java.io.Serializable;
import java.util.List;
import lombok.Data;
 
@Data
public class Student implements Serializable {
	private String id;
	private String name;
	private List<Teacher> list;
}
```

### `Teacher.java`
```java
package com.pojo;
 
import java.io.Serializable;
import java.util.List;
 
import lombok.Data;
 
@Data
public class Teacher implements Serializable {
	private int id;
	private String no;
	private String name;
	private List<Student> studentList;
	private Position pos;
}
```
**注意：关系表不用以实体表示出来，表示外键关系的 `ID` 也不用写在实体中（一般我们也不使用外键）**

## 再贴另一个 `MybatisUtil.java` 工具类
```java
package com.util;
 
import java.io.IOException;
import java.io.InputStream;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
 
public class MyBatisUtil {
	private static SqlSessionFactory sqlSessionFactory = null;
	
	static {
		String resource = "sqlMapConfig.xml";
		// 首先要加载核心配置文件：从classpath下开始找。
		InputStream in;
		try {
			in = Resources.getResourceAsStream(resource);
			
			sqlSessionFactory = new SqlSessionFactoryBuilder().build(in);
		} catch (IOException e) {
			throw new RuntimeException(e.getMessage());
		}	
	}
	
	public static SqlSession getSqlSession() {
		
		return sqlSessionFactory.openSession();
	}
	
	public static SqlSessionFactory getSqlSessionFactory() {
		return sqlSessionFactory;
	}
}
```

## 一对一：老师对职位
### `TeacherMapper.xml`
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.mapper.TeacherMapper">
	<resultMap type="Teacher" id="teacherPositionResultMap">
		<id property="id" column="id"/>
		<result property="no" column="t_no"/>
		<result property="name" column="t_name"/>
		<!-- association：配置的一对一属性 -->
		<!-- property：名字
			 javaType：类型
		 -->
		<association property="pos" javaType="Position">
			<id property="id" column="id"/>
			<result property="name" column="t_pos_name"/>
		</association>
	</resultMap>
	
	<!-- 一对一关联查询，查询老师及其对应的职位 -->
	<!-- 注意：id不能相同，当多个值传入，比如包装类的时候，我们才能够用SQL片段的形式来做if判断，单个值是不行的 -->
	<select id="queryTeacherPositionResultMapById" resultMap="teacherPositionResultMap" parameterType="Integer">
		SELECT *
		FROM tb_teacher t
		LEFT JOIN tb_position p
		ON t.position_id = p.id
		where t.id = #{id}
	</select>
 
	<select id="queryTeacherPositionResultMap" resultMap="teacherPositionResultMap">
		SELECT *
		FROM tb_teacher t
		LEFT JOIN tb_position p
		ON t.`position_id` = p.id
	</select> 
</mapper>
```

### `TeacherMapper.java` 接口
```java
package com.mapper;
 
import java.util.List;
import com.pojo.Teacher;

public interface TeacherMapper {
	public List<Teacher> queryTeacherPositionResultMap();
	public Teacher queryTeacherPositionResultMapById(Integer id);
}
```

### 测试一对一：
```java
package com.test;
 
import java.util.List;
import org.apache.ibatis.session.SqlSession;
import org.junit.Test;
import com.mapper.TeacherMapper;
import com.pojo.Teacher;
import com.util.MyBatisUtil;
 
public class TestOneToOne {
	@Test
	public void testOneToOne() {
		SqlSession sqlSession = MyBatisUtil.getSqlSession();
		System.err.println(sqlSession);
		
		TeacherMapper teacherMapper = sqlSession.getMapper(TeacherMapper.class);
		
		List<Teacher> list = teacherMapper.queryTeacherPositionResultMap();
		
		System.out.println(list);
		
		Teacher teacher = teacherMapper.queryTeacherPositionResultMapById(1);
		System.out.println(teacher);
	}
}
```

## 一对多：职位对老师
### `PositionMapper.xml`
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.mapper.PositionMapper"> 
	<resultMap type="Position" id="positionTeacherResultMap">
		<id property="id" column="id"/>
		<result property="name" column="t_pos_name"/> <!-- t_name -->
		<!-- 
		property同association中的一样是属性名称(javaBean中的)；
		javaType也同association中的是类型，
		最后多了一个OfType，因为一对多，不像一对一是单个的！我们这里是List集合，list和List都可以。
		一对多其中是放的一个集合所以这个是集合的泛型的类型，这里我们的list中放的是Teacher：
		所以这里是Teacher。
		 -->
		<collection property="teacherList" javaType="List" ofType="Teacher" >
			<!-- 
				一对多出现的问题：
					当数据库表中，主表的主键id和明细表的 ...
					当表中的字段名相同时怎么办？多表联查？
					
					注意：Mybatis中做多表联查的时候，不管是
					一对一、一对多、一对多对多：多对多：
					都不能有字段重名的情况：不管是主键还是普通字段。
					一旦字段重名的话，就会造成数据少自动赋值，或者覆盖，甚至重复赋值！
					规避和解决此类问题的方法：
						1.尽量不要表间重名，mybatis里处理起来很麻烦！id和普通字段都是。
						但是在表多的时候，很难不会出现字段重名的情况。主键id最容易重名！
						那么就要用以下的办法了！
						
						2.在mybatis中写原生SQL进行查询的时候，查的字段尽可能的少，这
						也影响速率，强烈禁止使用*，用多少查多少！这样也能及时发现字段重
						名的情况！
						
						3.最后如果真的需要查出重名的字段，并且修改数据库字段名造成的更改
						过大，这里推荐的方式是给字段取别名，在写resultMap映射的时候，其
						中的column属性就填写SQL语句中查出字段取的别名，这样就能解决重复
						问题了！
			 -->
			<id property="id" column="t_id"/>
			<result property="no" column="t_no"/>
			<result property="name" column="t_name"/>	
		</collection>
	</resultMap>
	
	<select id="queryPositionTeacherResultMapById" resultMap="positionTeacherResultMap" 
		parameterType="Integer">
		<!-- 
		SELECT *
		FROM tb_position p
		LEFT JOIN tb_teacher t
		ON p.id = t.position_id
		WHERE p.id = #{id}
		-->
		
		SELECT 
		p.*, 
		t.id t_id,
		t.t_name,
		t.t_no
		FROM tb_position p
		LEFT JOIN tb_teacher t
		ON p.id = t.position_id
		WHERE p.id = #{id}
	</select>
	
	<select id="queryPositionTeacherResultMap" resultMap="positionTeacherResultMap" >
		<!-- 
		SELECT *
		FROM tb_position p
		LEFT JOIN tb_teacher t
		ON p.id = t.position_id
		-->
		
		SELECT 
		p.*, 
		t.id t_id,
		t.t_name,
		t.t_no
		FROM tb_position p
		LEFT JOIN tb_teacher t
		ON p.id = t.position_id
		
	</select>
</mapper>
```

### `TeacherMapper.java` 接口
```java
package com.mapper;
 
import java.util.List;
import com.pojo.Position;
 
public interface PositionMapper {
	public Position queryPositionTeacherResultMapById(Integer id);
	
	public List<Position> queryPositionTeacherResultMap();
}
```

### 测试一对多：
```java
package com.test;
 
import java.util.List;
import org.apache.ibatis.session.SqlSession;
import org.junit.Test;
import com.mapper.PositionMapper;
import com.pojo.Position;
import com.util.MyBatisUtil;
 
public class TestOneToMany {
	
	@Test
	public void testOneToMany() {
		SqlSession sqlSession = MyBatisUtil.getSqlSession();
		PositionMapper positionMapper = sqlSession.getMapper(PositionMapper.class);
		List<Position> list = positionMapper.queryPositionTeacherResultMap();
		
		System.out.println(list);
		
		Position pos = positionMapper.queryPositionTeacherResultMapById(1);
		
		System.out.println(pos);
	}
}
```

## 多对多：查找被教授教导的所有学生
一对多对多：只要你愿意可以一直对多下去...

### `PositionMapper.xml`
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.mapper.PositionMapper"> 
	<resultMap type="Position" id="positionStudentResultMap">
		<!-- <id property="id" column="id"/> -->
		<result property="name" column="t_pos_name"/>
		<collection property="teacherList" javaType="List" ofType="Teacher" >
			<result property="name" column="t_name"/>	
			<collection property="studentList" javaType="List" ofType="Student">
				<result property="name" column="t_stu_name"/>
			</collection>
		</collection>
	</resultMap>
	
	<select id="selectPositionStudentByPosId" resultMap="positionStudentResultMap" parameterType="Integer">
		SELECT p.t_pos_name, t.t_name, s.t_stu_name
		FROM tb_position p
		INNER JOIN tb_teacher t ON p.id = t.position_id
		LEFT JOIN tb_stu_teach st ON st.t_teach_id = t.id
		LEFT JOIN tb_student s ON s.id = st.t_stu_id
		WHERE p.id = #{id}
	</select>
</mapper>
```

### `PositionMapper.java` 接口
```java
package com.mapper;
 
import com.pojo.Position;
 
public interface PositionMapper {
	public Position selectPositionStudentByPosId(Integer id);
	
}
```

### 测试：
```java
package com.test;
 
import org.apache.ibatis.session.SqlSession;
import org.junit.Test;
import com.mapper.PositionMapper;
import com.pojo.Position;
import com.util.MyBatisUtil;
 
public class TestManyToMany {
	
	@Test
	public void testManyToMany() {
		SqlSession sqlSession = MyBatisUtil.getSqlSession();
		PositionMapper positionMapper = sqlSession.getMapper(PositionMapper.class);
		Position pos = positionMapper.selectPositionStudentByPosId(1);
		
		System.out.println(pos);
	}
}
```