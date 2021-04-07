---
title: '[Spring] 5 Spring 事务管理'
catalog: true
date: 2019-06-24 00:02:19
subtitle: Spring 事务管理
header-img: /img/spring/spring_bg.png
tags:
- Spring
---

## 概述
事务原本是数据库中的概念，用于数据访问层。但一般情况下，需要将事务提升到业务层，即 Service 层。这样做是为了能够使用事务的特性来管理具体的业务。

## 事务特性：`ACID`
- `原子性（Atomicity）`：原子性是指事务是一个不可分割的工作单位，事务中的操作要么都发生，要么都不发生。
- `一致性（Consistency）`：事务前后数据的完整性必须保持一致。
- `隔离性（Isolation）`：事务的隔离性是多个用户并发访问数据库时，数据库为每一个用户开启的事务，不能被其他事务的操作数据所干扰，多个并发事务之间要相互隔离。
- `持久性（Durability）`：持久性是指一个事务一旦被提交，它对数据库中数据的改变就是永久性的，接下来即使数据库发生故障也不应该对其有任何影响。

## Spring 框架的事务管理支持两种方式
### 编程式事务
编程式事务就是指通过在代码中嵌入事务控制代码来手动控制事务，这个方式的优点是可以在方法体中的代码块级别进行控制事务，粒度较细，缺点是要侵入我们的业务代码，不推荐使用。

### 申明式事务
申明式事务是基于 Spring 的框架 AOP 技术，把事务当做一个“切面”,在需要做事务控制的代码上织入，可以控制到方法层面，其优点是无需侵入目标代码，而且 Spring 针对不同的底层持久层实现提供了不同的事务管理 API ，非常方便。

而在 Spring 申明式事务中通常可以通过以下三种方式来实现对事务的管理：

- 使用 Spring 的事务代理工厂管理事务（已过时）
- 使用 Spring 的事务注解管理事务
- 使用 AspectJ 的 AOP 配置管理事务

## Spring 事务管理 API
下面的图示可以很清晰地展示 Spring 框架的事务 API 结构：
![1](1.jpg)

### 事务管理器接口
`PlatformTransactionManager`：是事务管理器接口对象。其主要用于完成事务的提交、回滚，及获取事务的状态信息。该接口定义了 3 个事务方法：
- `getTransaction`：获取事务的状态
- `commit`：事务的提交
- `rollback`：事务的回滚

Spring并不直接管理事务，而是提供了多种事务管理器，常用的两个实现类：
- `DataSourceTransactionManager`：使用 `JDBC` 或 `MyBatis` 进行持久化数据时使用。

- `HibernateTransactionManager`：使用 `Hibernate` 进行持久化数据时使用。

### Spring 的回滚方式
Spring 事务的默认回滚方式是：发生运行时异常回滚

**例子：**
- 多个异常类型，用数组：`@Transactional(rollbackFor={IOException.class,FileNoteFoundException})`
- 如果要指定遇到几个 RuntimeException 的时候不回滚：`@Transactional(noRollbackFor={NullPointerException.class,IndexOutOfBoundsException.class})`

### 事务定义接口
事务定义接口 TransactionDefinition 中定义了事务描述相关的三类常量：**事务隔离级别（isolation）**、**事务传播行为（propagation）**、**事务默认超时时限**，及对它们的操作。

#### 事务的四种隔离级别
- DEFAULT：采用 DB 默认的事务隔离级别。MySql 默认为 REPEATABLE_READ；Oracle 默认为：READ_COMMITTED；
- READ_UNCOMMITTED：读未提交。未解决任何并发问题。
- READ_COMMITTED：读已提交。解决脏读，存在不可重复读与幻读。
- REPEATABLE_READ：可重复读。解决脏读、不可重复读。存在幻读。
- SERIALIZABLE：串行化。不存在并发问题。

**例子：属性 isolation**
事务隔离级别是数据库的概念，在多个事务对一批记录进行操作的时候，可能出现各种冲突的情况该属性的可能值有：
- **`Isolation.DEFAULT`**：数据库默认隔离级别

- **`Isolation.READ_UNCOMMITED`**：读未提交。可以读到其他事务未提交的数据。导致脏读（dirty read）

- **`Isolation.READ_COMMITED`**：读已提交。这是很多数据库的默认隔离级别，但不是 MySQL 的。不能读到其他事务未提交的数据，只能读到已提交的数据。解决了脏读，可导致不可重复读和幻读。
    - 不可重复读：在预读之后，commit 之前，其他事务更新了数据，导致两次读到的数据不相同
    - 幻读：在预读之后，commit 之前，其他事务插入数据，导致两次读到的数据条数不相同

- **`Isolation.REPEATABLE_READ`**：可重复读。这是 MySQL 的默认事务隔离级别。解决了脏读，不可重复读，但依然存在幻读问题。

- **`Isolation.SERIALIZABLE`**：可串行化。最高的事务隔离级别。解决了脏读、不可重复读、幻读，但导致大量的超时和锁竞争。


#### 事务的七种传播行为
所谓事务传播行为是指，处于不同事务中的方法在相互调用时，执行期间事务的维护情况。如，A 事务中的方法 a() 调用 B 事务中的方法 b()，在调用执行期间事务的维护情况，就称为事务传播行为。事务传播行为是加在方法上的。

- REQUIRED：指定的方法必须在事务内执行。若当前存在事务，就加入到当前事务中；若当前没有事务，则创建一个新事务。这种传播行为是最常见的选择，也是 Spring 默认的事务传播行为。
- SUPPORTS：指定的方法支持当前事务，但若当前没有事务，也可以以非事务方式执行。
- MANDATORY：指定的方法必须在当前事务内执行，若当前没有事务，则直接抛出异常。
- REQUIRES_NEW：总是新建一个事务，若当前存在事务，就将当前事务挂起，直到新事务执行完毕。
- NOT_SUPPORTED：指定的方法不能在事务环境中执行，若当前存在事务，就将当前事务挂起。
- NEVER：指定的方法不能在事务环境下执行，若当前存在事务，就直接抛出异常。
- NESTED：指定的方法必须在事务内执行。若当前存在事务，则在嵌套事务内执行；若当前没有事务，则创建一个新事务。

**例子：属性 propagation**
> 
> A.f1() 有事务 A
>
> B.f2() 有事务 B
>

当 A.f1() 调用 B.f2() 的时候，B.f2() 中的代码执行哪个事务
该属性可能的值有（以下属性值加在 B.f2() 上来理解）：
- **`Propagation.REQUIRED`**：如果 A.f1() 调用 B.f2() ，那么执行 A  事务；如果 A 没有事务，那就执行自己的事务 B 。接受，给就收下，不给就用自己的。
- **`Propagation.SUPPORTS`**：如果 A.f1() 调用 B.f2()，那么执行 A  事务；如果被没有事务的方法调用，那么就在没有事务的环境下执行。接受，给就收下，不给也不要。
- **`Propagation.MANDATORY`**：B.f2() 不能开启自己的事务，只能被开启了事务的 A.f1() 调用，如果被没有开启事务其他的方法调用，则抛异常。自己没有，给，必须给，不给就哭。
- **`Propagation.REQUIRES_NEW`**：如果 A.f1() 调用 B.f2() ，那么事务 A 被挂起，重新创建一个事务 B ，B.f2() 在事务 B 中执行，B 执行完毕再继续 A 事务。接受，给的不收，用自己的。
- **`Propagation.NOT_SUPPORTED`**：B.f2() 不需要在事务中执行。如果被需要事务 A 的 A.f1() 调用，那么事务 A 被挂起，B.f2() 执行完毕 A 才恢复。不接受，硬给也不收。
- **`Propagation.NEVER`**：B.f2() 不能在任何事务下执行，如果 A.f1()  调用它，那么抛异常。绝不接受，硬给就拼命。
- **`Propagation.NESTED`**：如果 A.f1() 调用 B.f2() ，那么 B 嵌套在 A 中执行，形成嵌套事务。


##  事务注解例子：
###  `@Transactianal` 注解有一些属性
```
//控制事务传播。默认是Propagation.REQUIRED
@Transactional(propagation=Propagation.REQUIRED)  


//控制事务隔离级别。默认跟数据库的默认隔离级别相同
@Transactional(isolation=Isolation.DEFAULT)        


//控制事务可读写(默认可读写)
@Transactional(readOnly=false)

//只可读，这样可以节约一些资源开销
@Transactional(readOnly=true)


//控制事务的超时时间，单位秒。默认跟数据库的事务控制系统相同，又说是30秒
@Transactional(timeout=30)        


//控制事务遇到哪些异常才会回滚。默认是RuntimeException
@Transactional(rollbackFor=RuntimeException.class) 

//同上
@Transactional(rollbackForClassName=RuntimeException)


//控制事务遇到哪些异常不会回滚。默认遇到非RuntimeException不会回滚
@Transactional(noRollbackFor=NullPointerException.class)   


//同上
@Transactional(noRollbackForClassName=NullPointerException)
```
**<font color=red>注意</font>：`@Transactional` 应当添加在具体的实现类而不是接口上**



