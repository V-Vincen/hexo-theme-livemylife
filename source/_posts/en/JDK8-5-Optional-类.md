---
title: '[JDK8] 5 Optional 类'
catalog: true
date: 2020-03-10 18:02:02
subtitle: A container object which may or may not contain a non-null value.
header-img: /img/java8/java8_bg.png
tags:
- JDK8
---

## 概述
到目前为止，臭名昭著的空指针异常是导致 Java 应用程序失败的最常见原因。以前，为了解决空指针异常，Google 公司著名的 Guava 项目引入了 `Optional` 类， Guava 通过使用检查空值的方式来防止代码污染，它鼓励程序员写更干净的代码。受到 Google Guava 的启发，`Optional` 类已经成为 Java 8 类库的一部分。

`Optional<T>` 类（`java.util.Optional`）是一个容器类，它可以保存类型 T 的值，代表这个值存在。或者仅仅保存 null，表示这个值不存在。原来用 null 表示一个值不存在，现在 `Optional` 可以更好的表达这个概念。并且可以避免空指针异常。

`Optional` 类的 Javadoc 描述如下：这是一个可以为 null 的容器对象。如果值存在则 `isPresent()` 方法会返回 true，调用 `get()` 方法会返回该对象。

`Optional` 提供很多有用的方法，这样我们就不用显式进行空值检测。 

我们先来看一段代码：
```java
public static String getGender(Student student){
    if(null == student) {
        return "Unkown";
    }
    return student.getGender();
}
```
这是一个获取学生性别的方法，方法入参为一个 Student 对象，为了防止 student 对象为 null， 做了防御性检查：如果值为 null，返回 "Unkown"。
再看使用 `Optional` 优化后的方法：
```java
public static String getGender(Student student) {
    return Optional.ofNullable(student).map(u -> u.getGender()).orElse("Unkown");
}
```
可以看到，`Optional` 类结合 [`lambda` 表达式](https://wvincen.gitee.io/2019/09/10/Java8-1-Lambda-%E8%A1%A8%E8%BE%BE%E5%BC%8F/) 的使用能够让开发出的代码更简洁和优雅。


## 创建 `Optional` 类对象的方法
我们看下 `Optional` 类的部分源码：
```java
private static final Optional<?> EMPTY = new Optional<>();

private final T value;

private Optional() {
    this.value = null;
}

public static<T> Optional<T> empty() {
    @SuppressWarnings("unchecked")
    Optional<T> t = (Optional<T>) EMPTY;
    return t;
}

private Optional(T value) {
    this.value = Objects.requireNonNull(value);
}

public static <T> Optional<T> of(T value) {
    return new Optional<>(value);
}

public static <T> Optional<T> ofNullable(T value) {
    return value == null ? empty() : of(value);
}
```

- `Optional.of(T t)`：创建一个 Optional 实例，t 必须非空。
- `Optional.empty()`：创建一个空的 Optional 实例。
- `Optional.ofNullable(T t)`：t 可以为 null。


## 判断 `Optional` 容器中是否包含对象
- `boolean isPresent()`：判断是否包含对象。

- `void ifPresent(Consumer<? super T> consumer)`：如果有值，就执行 `Consumer` 接口的实现代码，并且该值会作为参数传给它。部分源码：
    ```java
    public void ifPresent(Consumer<? super T> consumer) {
        if (value != null)
            consumer.accept(value);
    }
    ```
    
    **示例：**
    ```java
    public static void printName(Student student) {
        Optional.ofNullable(student).ifPresent(u ->  System.out.println("The student name is : " + u.getName()));
    }
    ```
    上述示例用于打印学生姓名，由于 `ifPresent()` 方法内部做了 `null` 值检查，调用前无需担心 `NPE（NullPointerException）` 问题。


## 获取 `Optional` 容器的对象
- `T get()`：如果调用对象包含值，返回该值，否则抛异常。
- `T orElse(T other)`：如果有值则将其返回，否则返回指定的 other 对象。部分源码：
    ```java
    public T orElse(T other) {
        return value != null ? value : other;
    }
    ```
    
    **示例：**
    ```java
    public static String getGender(Student student) {
       return Optional.ofNullable(student).map(u -> u.getGender()).orElse("Unkown");
    }
    ```


- `T orElseGet(Supplier<? extends T> other)`：如果有值则将其返回，否则返回由 Supplier 接口实现提供的对象。部分源码：
    ```java
    public T orElseGet(Supplier<? extends T> other) {
        return value != null ? value : other.get();
    }
    ```
    **示例：**
    ```java
    public static String getGender(Student student) {
        return Optional.ofNullable(student).map(u -> u.getGender()).orElseGet(() -> "Unkown");      
    }
    ```


- `T orElseThrow(Supplier<? extends X> exceptionSupplier)`：如果有值则将其返回，否则抛出由 Supplier 接口实现提供的异常。

    **示例：**
    ```java
    public static String getGender1(Student student) {
        return Optional.ofNullable(student).map(u -> u.getGender()).orElseThrow(() -> new RuntimeException("Unkown"));      
    }
    ```