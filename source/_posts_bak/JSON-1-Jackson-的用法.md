---
title: '[JSON] 1 Jackson 的用法'
catalog: true
date: 2019-06-26 03:31:30
subtitle: Jackson 的用法
header-img: /img/json/json_bg.png
tags:
- JSON
- Web
---

## Jackson 简介
Jackson 是一个简单基于 Java 应用库，Jackson 可以轻松的将 Java 对象转换成 json 对象和 xml 文档，同样也可以将 json、xml 转换成 Java 对象。Jackson 所依赖的 jar 包较少，简单易用并且性能也要相对高些，并且 Jackson 社区相对比较活跃，更新速度也比较快。

## Jackson 特点
容易使用 - jackson API 提供了一个高层次外观，以简化常用的用例。
无需创建映射 - API提供了默认的映射大部分对象序列化。
性能高 - 快速，低内存占用，适合大型对象图表或系统。
干净的 JSON - jackson 创建一个干净和紧凑的 JSON 结果，这是让人很容易阅读。
不依赖 - 库不需要任何其他的库，除了 JDK。
开源代码 - jackson 是开源的，可以免费使用。

## Jackson 注解
Jackson 类库包含了很多注解，可以让我们快速建立 Java 类与 JSON 之间的关系。

### `@JsonProperty`
`@JsonProperty` 注解指定一个属性用于 JSON 映射，默认情况下映射的 JSON 属性与注解的属性名称相同，不过可以使用该注解的 `value` 值修改 JSON 属性名，该注解还有一个 `index` 属性指定生成 JSON 属性的顺序，如果有必要的话。

### `@JsonIgnore`
`@JsonIgnore` 注解用于排除某个属性，这样该属性就不会被 Jackson 序列化和反序列化。

### `@JsonIgnoreProperties`
`@JsonIgnoreProperties` 注解是类注解。在序列化为 JSON 的时候，`@JsonIgnoreProperties({"prop1", "prop2"})` 会忽略 `pro1` 和 `pro2` 两个属性。在从 JSON 反序列化为 Java 类的时候，`@JsonIgnoreProperties(ignoreUnknown=true)` 会忽略所有没有 `Getter` 和 `Setter` 的属性。该注解在 Java 类和 JSON 不完全匹配的时候很有用。

### `@JsonIgnoreType`
`@JsonIgnoreType` 也是类注解，会排除所有指定类型的属性。

### `@JsonPropertyOrder`
`@JsonPropertyOrder` 和 `@JsonProperty` 的 `index` 属性类似，指定属性序列化时的顺序。

### `@JsonRootName`
`@JsonRootName` 注解用于指定 JSON 根属性的名称。


## Jackson 使用实例
### 需要用到的依赖
```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.9.8</version>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-core</artifactId>
    <version>2.9.8</version>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-annotations</artifactId>
    <version>2.9.8</version>
</dependency>
```

### 对象的序列化与反序列化
```java
package com.funtl.hello.httpclient;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class JsonTester {
    public static void main(String[] args) {
        // 创建 ObjectMapper 对象
        ObjectMapper mapper = new ObjectMapper();
        String jsonString = "{\"name\":\"Mahesh\", \"age\":21}";

        try {
            // 反序列化 JSON 到对象
            Student student = mapper.readValue(jsonString, Student.class);
            System.out.println(student);

            // 序列化对象到 JSON
            String json = mapper.writeValueAsString(student);
            System.out.println(json);
        } catch (JsonParseException e) {
            e.printStackTrace();
        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

class Student {
    private String name;
    private int age;

    public Student() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String toString() {
        return "Student [ name: " + name + ", age: " + age + " ]";
    }
}
```

### 集合的序列化与反序列化
```
package com.funtl.hello.httpclient;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class JsonTester {
    public static void main(String[] args) {
        // 创建 ObjectMapper 对象
        ObjectMapper mapper = new ObjectMapper();
        String jsonString = "{\"draw\":1,\"recordsTotal\":1,\"recordsFiltered\":1,\"data\":[{\"id\":33,\"title\":\"ad1\",\"subTitle\":\"ad1\",\"titleDesc\":\"ad1\",\"url\":\"https://sale.jd.com/act/XkCzhoisOMSW.html\",\"pic\":\"https://m.360buyimg.com/babel/jfs/t20164/187/1771326168/92964/b42fade7/5b359ab2N93be3a65.jpg\",\"pic2\":\"\",\"content\":\"<p><br></p>\"}],\"error\":null}";

        try {
            // 反序列化 JSON 到树
            JsonNode jsonNode = mapper.readTree(jsonString);

            // 从树中读取 data 节点
            JsonNode jsonData = jsonNode.findPath("data");
            System.out.println(jsonData);

            // 反序列化 JSON 到集合
            //List<TbContent> tbContents = objectMapper.readValue(data.toString(),new TypeReference<List<TbConent>>(){});
            //或者
            JavaType javaType = mapper.getTypeFactory().constructParametricType(ArrayList.class, TbContent.class);
            List<TbContent> tbContents = mapper.readValue(jsonData.toString(), javaType);
            
            
            for (TbContent tbContent : tbContents) {
                System.out.println(tbContent);
            }

            // 序列化集合到 JSON
            String json = mapper.writeValueAsString(tbContents);
            System.out.println(json);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

class TbContent {
    private Long id;
    private String title;
    private String subTitle;
    private String titleDesc;
    private String url;
    private String pic;
    private String pic2;
    private String content;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubTitle() {
        return subTitle;
    }

    public void setSubTitle(String subTitle) {
        this.subTitle = subTitle;
    }

    public String getTitleDesc() {
        return titleDesc;
    }

    public void setTitleDesc(String titleDesc) {
        this.titleDesc = titleDesc;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPic() {
        return pic;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }

    public String getPic2() {
        return pic2;
    }

    public void setPic2(String pic2) {
        this.pic2 = pic2;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "TbContent{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", subTitle='" + subTitle + '\'' +
                ", titleDesc='" + titleDesc + '\'' +
                ", url='" + url + '\'' +
                ", pic='" + pic + '\'' +
                ", pic2='" + pic2 + '\'' +
                ", content='" + content + '\'' +
                '}';
    }
}
```