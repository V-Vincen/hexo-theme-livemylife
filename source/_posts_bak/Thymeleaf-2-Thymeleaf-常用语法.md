---
title: '[Thymeleaf] 2 Thymeleaf 常用语法'
catalog: true
date: 2019-06-30 00:35:16
subtitle: Thymeleaf 常用语法
header-img: /img/springboot/thymeleaf_bg.png
tags:
- Thymeleaf
---

## 引入 Thymeleaf
修改 html 标签用于引入 thymeleaf 引擎，这样才可以在其他标签里使用 th:* 语法，这是下面语法的前提。
```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-spring4-4.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
```

## 获取变量值
```html
<p th:text="'Hello！, ' + ${name} + '!'" >name</p>
```
可以看出获取变量值用 `$` 符号,对于javaBean的话使用 `变量名.属性名` 方式获取,这点和 `EL` 表达式一样.

另外 `$` 表达式只能写在th标签内部,不然不会生效,上面例子就是使用 `th:text` 标签的值替换 `p` 标签里面的值,至于 `p` 里面的原有的值只是为了给前端开发时做展示用的.这样的话很好的做到了前后端分离.

## 引入 URL
Thymeleaf 对于 URL 的处理是通过语法 `@{…}` 来处理的
```html
<a th:href="@{http://www.baidu.com}">绝对路径</a>
<a th:href="@{/}">相对路径</a>
<a th:href="@{css/bootstrap.min.css}">Content路径,默认访问static下的css文件夹</a>
```
类似的标签有:th:href 和 th:src

## 字符串替换
很多时候可能我们只需要对一大段文字中的某一处地方进行替换，可以通过字符串拼接操作完成：
```html
<span th:text="'Welcome to our application, ' + ${user.name} + '!'">
```
一种更简洁的方式是：
```html
<span th:text="|Welcome to our application, ${user.name}!|">
```
当然这种形式限制比较多，|…|中只能包含变量表达式${…}，不能包含其他常量、条件表达式等。

## 运算符
在表达式中可以使用各类算术运算符，例如+, -, *, /, %
```html
th:with="isEven=(${prodStat.count} % 2 == 0)"
```
逻辑运算符>, <, <=,>=，==,!=都可以使用，唯一需要注意的是使用<,>时需要用它的HTML转义符：
```html
th:if="${prodStat.count} &gt; 1"
th:text="'Execution mode is ' + ( (${execMode} == 'dev')? 'Development' : 'Production')"
```

## 条件
### if/unless
Thymeleaf 中使用 `th:if` 和 `th:unless` 属性进行条件判断，下面的例子中，标签只有在 `th:if` 中条件成立时才显示：
```html
<a th:href="@{/login}" th:unless=${session.user != null}>Login</a>
```
`th:unless` 于 `th:if` 恰好相反，只有表达式中的条件不成立，才会显示其内容。

### switch
Thymeleaf 同样支持多路选择 Switch 结构：
```html
<div th:switch="${user.role}">
  <p th:case="'admin'">User is an administrator</p>
  <p th:case="#{roles.manager}">User is a manager</p>
</div>
```

默认属性 default 可以用 * 表示：
```html
<div th:switch="${user.role}">
  <p th:case="'admin'">User is an administrator</p>
  <p th:case="#{roles.manager}">User is a manager</p>
  <p th:case="*">User is some other thing</p>
</div>
```

## 循环
渲染列表数据是一种非常常见的场景，例如现在有 n 条记录需要渲染成一个表格，该数据集合必须是可以遍历的，使用 `th:each` 标签：
```html
<body>
  <h1>Product list</h1>

  <table>
    <tr>
      <th>NAME</th>
      <th>PRICE</th>
      <th>IN STOCK</th>
    </tr>
    <tr th:each="prod : ${prods}">
      <td th:text="${prod.name}">Onions</td>
      <td th:text="${prod.price}">2.41</td>
      <td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
    </tr>
  </table>

  <p>
    <a href="../home.html" th:href="@{/}">Return to home</a>
  </p>
</body>
```
可以看到，需要在被循环渲染的元素（这里是）中加入 `th:each` 标签，其中 `th:each="prod : ${prods}"` 意味着对集合变量 `prods` 进行遍历，循环变量是 `prod` 在循环体中可以通过表达式访问。