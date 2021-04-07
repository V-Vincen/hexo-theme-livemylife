---
title: '[Spring] 7 使用 Spring 注解管理事务'
catalog: true
date: 2019-06-24 00:35:13
subtitle: Spring @Transactional
header-img: /img/spring/spring_bg.png
tags:
- Spring
---

## 概述
通过 `@Transactional` 注解方式，也可将事务织入到相应方法中。而使用注解方式，只需在配置文件中加入一个 `tx` 标签，以告诉 Spring 使用注解来完成事务的织入。该标签只需指定一个属性，事务管理器。
```xml
<!-- 配置事务管理器 -->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource"/>
</bean>
    
<!-- 开启事务注解驱动 -->
<tx:annotation-driven transaction-manager="transactionManager" />
```

### `@Transactional` 注解简介
`@Transactional` 的所有可选属性：

- `propagation`：用于设置事务传播属性。该属性类型为 Propagation 枚举，默认值为 `Propagation.REQUIRED`。
- `isolation`：用于设置事务的隔离级别。该属性类型为 Isolation 枚举 ，默认值为 `Isolation.DEFAULT`。
- `readOnly`：用于设置该方法对数据库的操作是否是只读的。该属性为 boolean，默认值为 `false`。
- `timeout`：用于设置本操作与数据库连接的超时时限。单位为秒，类型为 int，默认值为 -1，即没有时限。
- `rollbackFor`：指定需要回滚的异常类。类型为 `Class[]`，默认值为空数组。当然，若只有一个异常类时，可以不使用数组。
- `rollbackForClassName`：指定需要回滚的异常类类名。类型为 `String[]`，默认值为空数组。当然，若只有一个异常类时，可以不使用数组。
- `noRollbackFor`：指定不需要回滚的异常类。类型为 Class[]，默认值为空数组。当然，若只有一个异常类时，可以不使用数组。
- `noRollbackForClassName`： 指定不需要回滚的异常类类名。类型为 `String[]`，默认值为空数组。当然，若只有一个异常类时，可以不使用数组。

需要注意的是，`@Transactional` 若用在方法上，只能用于 `public` 方法上。对于其他非 `public` 方法，如果加上了注解 `@Transactional`，虽然 Spring 不会报错，但不会将指定事务织入到该方法中。因为 Spring 会忽略掉所有非 `public` 方法上的 `@Transaction` 注解。

若 @Transaction 注解在类上，则表示该类上所有的方法均将在执行时织入事务。

### 使用 @Transactional 注解
使用起来很简单，只需要在需要增加事务的业务类上增加 `@Transactional` 注解即可，案例代码如下：
```
package com.hello.spring.transaction.aspectsj.aop.service.impl;

import com.hello.spring.transaction.aspectsj.aop.dao.TbContentCategoryDao;
import com.hello.spring.transaction.aspectsj.aop.domain.TbContent;
import com.hello.spring.transaction.aspectsj.aop.domain.TbContentCategory;
import com.hello.spring.transaction.aspectsj.aop.service.TbContentCategoryService;
import com.hello.spring.transaction.aspectsj.aop.service.TbContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service(value = "tbContentCategoryService")
public class TbContentCategoryServiceImpl implements TbContentCategoryService {

    @Autowired
    private TbContentCategoryDao tbContentCategoryDao;

    @Autowired
    private TbContentService tbContentService;

    public void save(TbContentCategory tbContentCategory, TbContent tbContent) {
        tbContentCategoryDao.insert(tbContentCategory);
        tbContentService.save(tbContent);
    }
}
```