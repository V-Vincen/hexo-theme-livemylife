---
title: '[Spring MVC] 6 Spring MVC 表单标签库'
catalog: true
date: 2019-06-24 04:05:27
subtitle: Spring MVC 标签库
header-img: /img/springmvc/springmvc_bg.png
tags:
- Spring MVC
---

## 声明表单标签库
在使用 SpringMVC 的时候我们可以使用 Spring 封装的一系列表单标签，这些标签都可以访问到 ModelMap 中的内容。我们需要先在 JSP 中声明使用的标签，具体做法是在 JSP 文件的顶部加入以下指令：
```jsp
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
```

## 表单标签
**`<form:form />`**

使用 Spring MVC 的 form 标签主要有两个作用，第一是它会自动的绑定来自 Model 中的一个属性值到当前 form 对应的实体对象，默认是 command 属性，这样我们就可以在 form 表单体里面方便的使用该对象的属性了。第二是它支持我们在提交表单的时候使用除 GET 和 POST 之外的其他方法进行提交，包括 DELETE 和 PUT 等。
```jsp
<form:form action="formTag/form.do" method="post">  
    <table>  
        <tr>  
            <td>Name:</td><td><form:input path="name"/></td>  
        </tr>  
        <tr>  
            <td>Age:</td><td><form:input path="age"/></td>  
        </tr>  
        <tr>  
            <td colspan="2"><input type="submit" value="提交"/></td>  
        </tr>  
    </table>  
</form:form>  
```

## 文本框
**`<form:input />`**

使用 `<form:input path="name" />` 标签来渲染一个 HTML 文本框，等同于：
```jsp
<input id="name" name="name" type="text" value=""/>
```

## 密码框
**`<form:password />`**

使用 `<form:password path="password" />` 标签来渲染一个 HTML 密码框，等同于：
```jsp
<input id="password" name="password" type="password" value=""/>
```

## 文本域
**`<form:textarea />`**

使用 `<form:textarea path="address" rows="5" cols="30" />` 标签来渲染一个 HTML 文本域，等同于：
```jsp
<textarea id="address" name="address" rows="5" cols="30">
```

## 复选框
**`<form:checkbox />`**

使用 `<form:checkbox path="receivePaper" />` 标签来渲染一个 HTML 复选框，等同于：
```jsp
<input id="receivePaper1" name="receivePaper" type="checkbox" value="true"/>
<input type="hidden" name="_receivePaper" value="on"/>
```

## 复选框（多选）
**`<form:checkboxes />`**

使用 `<form:checkboxes items="${webFrameworkList}" path="favoriteFrameworks" />` 标签来渲染一个 HTML 多选复选框，等同于：
```jsp
<span>
    <input id="favoriteFrameworks1" name="favoriteFrameworks" type="checkbox" value="Spring MVC" checked="checked"/>
    <label for="favoriteFrameworks1">Spring MVC</label>
</span>
<span>
    <input id="favoriteFrameworks2" name="favoriteFrameworks" type="checkbox" value="Struts 1"/>
    <label for="favoriteFrameworks2">Struts 1</label>
</span>
<span>
    <input id="favoriteFrameworks3" name="favoriteFrameworks" type="checkbox" value="Struts 2" checked="checked"/>
    <label for="favoriteFrameworks3">Struts 2</label>
</span>
<span>
    <input id="favoriteFrameworks4" name="favoriteFrameworks" type="checkbox" value="Apache Wicket"/>
    <label for="favoriteFrameworks4">Apache Wicket</label>
</span>
<input type="hidden" name="_favoriteFrameworks" value="on"/>
```

## 单选按钮
**`<form:radiobutton />`**

使用 `<form:radiobutton />` 标签来渲染一个 HTML 单选按钮，等同于：
```jsp
<form:radiobutton path="gender" value="M" label="男" />
<form:radiobutton path="gender" value="F" label="女" />
```
```jsp
<input id="gender1" name="gender" type="radio" value="M" checked="checked"/><label for="gender1">男</label>
<input id="gender2" name="gender" type="radio" value="F"/><label for="gender2">女</label>
```

## 单选按钮（多选）
**`<form:radiobuttons />`**

使用 `<form:radiobuttons path="favoriteNumber" items="${numbersList}" />` 标签来渲染一个 HTML 多项单选按钮，等同于：
```jsp
<span>
    <input id="favoriteNumber1" name="favoriteNumber" type="radio" value="1"/>
    <label for="favoriteNumber1">1</label>
</span>
<span>
    <input id="favoriteNumber2" name="favoriteNumber" type="radio" value="2"/>
    <label for="favoriteNumber2">2</label>
</span>
<span>
    <input id="favoriteNumber3" name="favoriteNumber" type="radio" value="3"/>
    <label for="favoriteNumber3">3</label>
</span>
<span>
    <input id="favoriteNumber4" name="favoriteNumber" type="radio" value="4"/>
    <label for="favoriteNumber4">4</label>
</span>
```

## 下拉列表
使用 `<form:select />`, `<form:option />，<form:options />` 标签来渲染一个 HTML 下拉列表，等同于：
```jsp
<form:select path="country">
   <form:option value="NONE" label="Select"/>
   <form:options items="${countryList}" />
</form:select>
```
```jsp
<select id="country" name="country">
   <option value="NONE">请选择...</option>
   <option value="US">United States</option>
   <option value="CH">China</option>
   <option value="MY">Malaysia</option>
   <option value="SG">Singapore</option>
</select>
```

## 下拉列表（多选）
使用 `<form:select />` 标签及其属性 multiple=true 来渲染一个 HTML 多选下拉列表，等同于：
```jsp
<form:select path="skills" items="${skillsList}" multiple="true" />
```
```jsp
<select id="skills" name="skills" multiple="multiple">
   <option value="Struts">Struts</option>
   <option value="Hibernate">Hibernate</option>
   <option value="Apache Wicket">Apache Hadoop</option>
   <option value="Spring">Spring</option>
</select>
<input type="hidden" name="_skills" value="1"/>
```

## 隐藏字段域
**`<form:hidden />`**

使用 `<form:hidden path="id" value="1000"/>` 标签来渲染一个 HTML 隐藏字段域，等同于：
```jsp
<input id="id" name="id" type="hidden" value="1000"/>
```