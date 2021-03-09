---
title: '[JSON] 2 FastJson 的用法'
catalog: true
date: 2020-03-24 17:33:04
subtitle: FastJson 的用法
header-img: /img/json/json_bg.png
tags:
- JSON
---

## 前言
### FastJson的介绍
JSON 协议使用方便，越来越流行，JSON 的处理器有很多,这里我介绍一下 FastJson，FastJson 是阿里的开源框架，被不少企业使用,是一个极其优秀的Json 框架，Github 地址: https://github.com/alibaba/fastjson

### FastJson 的特点
- FastJson 速度快，无论序列化和反序列化，都是当之无愧的 fast
- 功能强大（支持普通 JDK 类包括任意Java Bean Class、Collection、Map、Date 或 enum）
- 零依赖（没有依赖其它任何类库）

### FastJson 的简单说明
FastJson 对于 JSON 格式字符串的解析主要用到了下面三个类：
- JSON：fastJson 的解析器，用于 JSON 格式字符串与 JSON 对象及 javaBean 之间的转换
- JSONObject：fastJson 提供的 json 对象
- JSONArray：fastJson 提供 json 数组对象

## FastJson 的用法
引入 maven 依赖：
```xml
<!-- fastjson -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.62</version>
</dependency>
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13</version>
</dependency>
<!-- lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.10</version>
    <scope>provided</scope>
</dependency>
```

先写几个类：
```java
@Data
public class Student {
    private String studentName;
    private Integer studentAge;

    public Student(String studentName, Integer studentAge) {
        this.studentName = studentName;
        this.studentAge = studentAge;
    }
}
```

```java
@Data
public class Course {
    private String courseName;
    private Integer code;
}
```

```java
@Data
public class Teacher {
    private String teacherName;
    private Integer teacherAge;
    private Course course;
    private List<Student> students;
}
```

再定义三个 json 格式的字符串：
```java
//json字符串-简单对象型
private static final String JSON_OBJ_STR = "{\"studentName\":\"lily\",\"studentAge\":12}";

//json字符串-数组类型
private static final String JSON_ARRAY_STR = "[{\"studentName\":\"lily\",\"studentAge\":12},{\"studentName\":\"lucy\",\"studentAge\":15}]";

//复杂格式json字符串
private static final String COMPLEX_JSON_STR = "{\"teacherName\":\"crystall\",\"teacherAge\":27,\"course\":{\"courseName\":\"english\",\"code\":1270},\"students\":[{\"studentName\":\"lily\",\"studentAge\":12},{\"studentName\":\"lucy\",\"studentAge\":15}]}";
```

### json 字符串与 JSONObject 之间的转换
案例：
```java
    /**
     * json Str <-> JSONObject 之间的转换
     */
    @Test
    public void testJSONStrTransformJSONObject() {
        //例1：
        //json Str -> JSONObject 的转换
        JSONObject jsonObject = JSON.parseObject(JSON_OBJ_STR);
        String studentName = jsonObject.getString("studentName");
        Integer studentAge = jsonObject.getInteger("studentAge");
        System.out.println(String.format("studentName：%s，studentAge：%s", studentName, studentAge));

        //JSONObject -> json Str 的转换
        String jsonString = JSON.toJSONString(jsonObject);
        System.out.println(jsonString);


        //例2：
        //复杂 json StrComplex -> JSONObject 的转换
        JSONObject jsonObjCom = JSON.parseObject(COMPLEX_JSON_STR);
        String teacherNameCom = jsonObjCom.getString("teacherName");
        Integer teacherAgeCom = jsonObjCom.getInteger("teacherAge");
        System.out.println("teacherName:  " + teacherNameCom + "   teacherAge:  " + teacherAgeCom);

        JSONObject jsonObjCourseCom = jsonObjCom.getJSONObject("course");
        String courseNameCom = jsonObjCourseCom.getString("courseName");
        Integer codeCom = jsonObjCourseCom.getInteger("code");
        System.out.println("courseName:  " + courseNameCom + "   code:  " + codeCom);

        JSONArray jsonArrayStudentCom = jsonObjCom.getJSONArray("students");
        for (Object object : jsonArrayStudentCom) {
            JSONObject jsonObjectOne = (JSONObject) object;
            String studentNameCom = jsonObjectOne.getString("studentName");
            Integer studentAgeCom = jsonObjectOne.getInteger("studentAge");
            System.out.println("studentName:  " + studentNameCom + "   studentAge:  " + studentAgeCom);
        }

        //JSONObject -> 复杂 json StrComplex 的转换
        String jsonStringCom = JSON.toJSONString(jsonObjCom);
        System.out.println(jsonStringCom);
    }
```

### json 字符串与 JavaBean 之间的转换
案例：
```java
    /**
     * json Str <-> JavaBean 之间的转换
     */
    @Test
    public void testJSONStrTransformJavaBean() {
        //例1：
        //json Str -> JavaBean 的转换
        //方法一：
        Student student = JSON.parseObject(JSON_OBJ_STR, Student.class);
        System.out.println(student);

        //方法二：
        //或者使用 TypeReference<T> 类，由于其构造方法使用 protected 进行修饰，故创建其子类
        Student studentTR = JSON.parseObject(JSON_OBJ_STR, new TypeReference<Student>() {
        });
        System.out.println(studentTR);

        //JavaBean -> json Str 的转换
        String jsonStrStu = JSON.toJSONString(student);
        System.out.println(jsonStrStu);


        //例2：
        //复杂 json StrComplex -> JavaBean 的转换
        //方法一：
        Teacher teacher = JSON.parseObject(COMPLEX_JSON_STR, Teacher.class);
        System.out.println(teacher);

        //方法二：
        Teacher teacherTR = JSON.parseObject(COMPLEX_JSON_STR, new TypeReference<Teacher>() {
        });
        System.out.println(teacherTR);

        //复杂 json StrComplex -> json Str 的转换
        String jsonStrTea = JSON.toJSONString(teacher);
        System.out.println(jsonStrTea);
    }
```

### json 字符串（数组类型）与 JavaBean_List 之间的转换
案例：
```java
    /**
     * json StrArray <-> JavaBean_List 之间的转换
     */
    @Test
    public void testJSONStrArrayTransformJavaBeanList() {
        //json StrArray -> JavaBean_List 的转换
        //方法一：遍历（硬编码，不推荐）
        JSONArray jsonArray = JSON.parseArray(JSON_ARRAY_STR);
        List<Student> students = new ArrayList<>();
        Student student;
        for (Object object : jsonArray) {
            JSONObject jsonObject = (JSONObject) object;
            String studentName = jsonObject.getString("studentName");
            Integer studentAge = jsonObject.getInteger("studentAge");
            student = new Student(studentName, studentAge);
            students.add(student);
        }
        System.out.println(students);

        //方法二：或者使用 parseArray（推荐）
        List<Student> studentsArr = JSON.parseArray(JSON_ARRAY_STR, Student.class);
        System.out.println(studentsArr);

        //方法三：或者使用 TypeReference<T> 类，由于其构造方法使用 protected 进行修饰，故创建其子类
        List<Student> studentsTR = JSON.parseObject(JSON_ARRAY_STR, new TypeReference<ArrayList<Student>>() {
        });
        System.out.println(studentsTR);


        //JavaBean_List -> json StrArray 的转换
        String jsonString = JSON.toJSONString(studentsArr);
        System.out.println(jsonString);
    }
```

