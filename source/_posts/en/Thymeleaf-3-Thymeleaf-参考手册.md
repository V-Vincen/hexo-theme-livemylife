---
title: '[Thymeleaf] 3 Thymeleaf 参考手册'
catalog: true
date: 2019-06-30 00:38:19
subtitle: Thymeleaf 参考手册
header-img: /img/springboot/thymeleaf_bg.png
tags:
- Thymeleaf
---

本章为 Thymeleaf 语法参考，主要介绍如：循环、判断、模板布局、内置对象等。

## 声明
修改 html 标签用于引入 thymeleaf 引擎，这样才可以在其他标签里使用 th:* 语法。
```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-spring4-4.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
```

## 使用文本
| 语法                     | 说明                                                         |
| ------------------------ | ------------------------------------------------------------ |
| `{home.welcome}`         | 使用国际化文本,国际化传参直接追加 (value…)                   |
| `${user.name}`           | 使用会话属性                                                 |
| `@{}` 表达式中使用超链接 | `<link rel="stylesheet" type="text/css" media="all"href="../../css/gtvg.css" th:href="@{/css/gtvg.css}" />` |
| -                        | -                                                            |
| `${}`                    | 表达式中基本对象                                             |
| param                    | 获取请求参数，比如 `${param.name}`, `http://localhost:8080?name=jeff` |
| session                  | 获取 session 的属性                                          |
| application              | 获取 application 的属性                                      |
| execInfo                 | 有两个属性 templateName 和 now (是 java 的 Calendar 对象)    |
| ctx                      |                                                              |
| vars                     |                                                              |
| locale                   |                                                              |
| httpServletRequest       |                                                              |
| httpSession              |                                                              |
| -                        | -                                                            |
| th 扩展标签              |                                                              |
| `th:text`                | 普通字符串                                                   |
| `th:utext`               | 转义文本                                                     |
| `th:href`                | 链接                                                         |
| `th:attr` 设置元素属性   | `<img src="../../images/gtvglogo.png" th:attr="src=@{/images/gtvglogo.png},title=#{logo},alt=#{logo}" />` |
| `th:with`                | 定义常量                                                     |
| `th:attrappend`          | 追加属性                                                     |
| `th:classappend`         | 追加类样式                                                   |
| `th:styleappend`         | 追加样式                                                     |

## 其他标签
| 语法                 | 说明 |
| -------------------- | ---- |
| `th:abbr`            |      |
| `th:accept`          |      |
| `th:accept-charset`  |      |
| `th:accesskey`       |      |
| `th:action`          |      |
| `th:align`           |      |
| `th:alt`             |      |
| `th:archive`         |      |
| `th:audio`           |      |
| `th:autocomplete`    |      |
| `th:axis`            |      |
| `th:background`      |      |
| `th:bgcolor`         |      |
| `th:border`          |      |
| `th:cellpadding`     |      |
| `th:cellspacing`     |      |
| `th:challenge`       |      |
| `th:charset`         |      |
| `th:cite`            |      |
| `th:class`           |      |
| `th:classid`         |      |
| `th:codebase`        |      |
| `th:codetype`        |      |
| `th:cols`            |      |
| `th:colspan`         |      |
| `th:compact`         |      |
| `th:content`         |      |
| `th:contenteditable` |      |
| `th:contextmenu`     |      |
| `th:data`            |      |
| `th:datetime`        |      |
| `th:dir`             |      |
| `th:draggable`       |      |
| `th:dropzone`        |      |
| `th:enctype`         |      |
| `th:for`             |      |
| `th:form`            |      |
| `th:formaction`      |      |
| `th:formenctype`     |      |
| `th:formmethod`      |      |
| `th:formtarget`      |      |
| `th:frame`           |      |
| `th:frameborder`     |      |
| `th:headers`         |      |
| `th:height`          |      |
| `th:high`            |      |
| `th:href`            |      |
| `th:hreflang`        |      |
| `th:hspace`          |      |
| `th:http-equiv`      |      |
| `th:icon`            |      |
| `th:id`              |      |
| `th:keytype`         |      |
| `th:kind`            |      |
| `th:label`           |      |
| `th:lang`            |      |
| `th:list`            |      |
| `th:longdesc`        |      |
| `th:low`             |      |
| `th:manifest`        |      |
| `th:marginheight`    |      |
| `th:marginwidth`     |      |
| `th:max`             |      |
| `th:maxlength`       |      |
| `th:media`           |      |
| `th:method`          |      |
| `th:min`             |      |
| `th:name`            |      |
| `th:optimum`         |      |
| `th:pattern`         |      |
| `th:placeholder`     |      |
| `th:poster`          |      |
| `th:preload`         |      |
| `th:radiogroup`      |      |
| `th:rel`             |      |
| `th:rev`             |      |
| `th:rows`            |      |
| `th:rowspan`         |      |
| `th:rules`           |      |
| `th:sandbox`         |      |
| `th:scheme`          |      |
| `th:scope`           |      |
| `th:scrolling`       |      |
| `th:size`            |      |
| `th:sizes`           |      |
| `th:span`            |      |
| `th:spellcheck`      |      |
| `th:src`             |      |
| `th:srclang`         |      |
| `th:standby`         |      |
| `th:start`           |      |
| `th:step`            |      |
| `th:style`           |      |
| `th:summary`         |      |
| `th:tabindex`        |      |
| `th:target`          |      |
| `th:title`           |      |
| `th:type`            |      |
| `th:usemap`          |      |
| `th:value`           |      |
| `th:valuetype`       |      |
| `th:vspace`          |      |
| `th:width`           |      |
| `th:wrap`            |      |
| `th:xmlbase`         |      |
| `th:xmllang`         |      |
| `th:xmlspace`        |      |
| `th:alt-title`       |      |
| `th:lang-xmllang`    |      |

## 循环
```html
<tr th:each="prod : ${prods}">
    <td th:text="${prod.name}">Onions</td>
    <td th:text="${prod.price}">2.41</td>
    <td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
</tr>

<table> 
    <tr>
        <th>NAME</th>
        <th>PRICE</th>
        <th>IN STOCK</th>
    </tr>
    <tr th:each="prod,iterStat : ${prods}" th:class="${iterStat.odd}? 'odd'">
    <td th:text="${prod.name}">Onions</td>
    <td th:text="${prod.price}">2.41</td>
    <td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
  </tr>
</table>
```
迭代器的状态：
- index: 当前的索引，从0开始
- count: 当前的索引，从1开始
- size：总数
- current:
- even/odd:
- first
- last

## 判断
### if
```html
<a href="comments.html" th:href="@{/product/comments(prodId=${prod.id})}" th:if="${not #lists.isEmpty(prod.comments)}">view</a>
```

### unless
```html
<a href="comments.html" th:href="@{/comments(prodId=${prod.id})}" th:unless="${#lists.isEmpty(prod.comments)}">view</a>
```

### switch
```
<div th:switch="${user.role}">
    <p th:case="'admin'">User is an administrator</p> <p th:case="#{roles.manager}">User is a manager</p>
</div>

<div th:switch="${user.role}">
    <p th:case="'admin'">User is an administrator</p> <p th:case="#{roles.manager}">User is a manager</p> <p th:case="*">User is some other thing</p>
</div>
```

## th:block
```html
<table>
    <th:block th:each="user : ${users}">
    <tr>
        <td th:text="${user.login}">...</td> <td th:text="${user.name}">...</td>
    </tr>
    <tr>
        <td colspan="2" th:text="${user.address}">...</td> 
    </tr>
    </th:block>
</table>
```

推荐下面写法（编译前看不见）
```html
<table>
    <tr>
        <td th:text="${user.login}">...</td>
        <td th:text="${user.name}">...</td> </tr>
        <tr>
        <td colspan="2" th:text="${user.address}">...</td>
    </tr>
    <!--/*/ </th:block> /*/--> 
</table>
```

## th:inline
**`th:inline` 用法**

th:inline 可以等于 text , javascript(dart) , none

**text: [[…]]**
```html
<p th:inline="text">Hello, [[#{test}]]</p>
```

**javascript: /[[…]]/**
```html
<script th:inline="javascript">
    var username = /*[[
        #{test}
    ]]*/;
    var name = /*[[
        ${param.name[0]}+${execInfo.templateName}+'-'+${#dates.createNow()}+'-'+${#locale}
    ]]*/;
</script>
```
```html
<script th:inline="javascript">

/*<![CDATA[*/

    var username = [[#{test}]];

    var name = [[${param.name[0]}+${execInfo.templateName}+'-'+${#dates.createNow()}+'-'+${#locale}]];

/*]]>*/

</script>
```

**`adding code: /* [+…+]*/`**
```html
var x = 23;
/*[+
var msg = 'Hello, ' + [[${session.user.name}]]; +]*/
var f = function() {
...
```

**`removind code: /[- / and /* -]*/`**
```html
var x = 23;
/*[- */
var msg = 'This is a non-working template'; /* -]*/
var f = function() {
...
```