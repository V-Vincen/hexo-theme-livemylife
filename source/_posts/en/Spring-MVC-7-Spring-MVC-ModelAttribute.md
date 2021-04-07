---
title: '[Spring MVC] 7 Spring MVC @ModelAttribute'
catalog: true
date: 2019-06-24 04:07:41
subtitle: Spring MVC @ModelAttribute
header-img: /img/springmvc/springmvc_bg.png
tags:
- Spring MVC
---

## 简介
**`@ModelAttribute`** 具有如下三个作用：
- 绑定请求参数到命令对象：放在功能处理方法的入参上时，用于将多个请求参数绑定到一个命令对象，从而简化绑定流程，而且自动暴露为模型数据用于视图页面展示时使用
- 暴露 @RequestMapping 方法返回值为模型数据：放在功能处理方法的返回值上时，是暴露功能处理方法的返回值为模型数据，用于视图页面展示时使用
- 暴露表单引用对象为模型数据：放在处理器的一般方法（非功能处理方法）上时，是为表单准备要展示的表单引用对象，如注册时需要选择的所在城市等，而且在执行功能处理方法（@RequestMapping 注解的方法）之前，自动添加到模型对象中，用于视图页面展示时使用

## 例子
暴露表单引用对象为模型数据的例子
```java
@ModelAttribute
public User get(@RequestParam(required = false) String id) {
    User entity = null;
    if (StringUtils.isNotBlank(id)) {
        entity = userService.get(id);
    }
    if (entity == null) {
        entity = new User();
    }
    return entity;
}
```