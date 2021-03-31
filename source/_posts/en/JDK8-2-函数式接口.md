---
title: '[JDK8] 2 函数式接口'
catalog: true
date: 2019-09-10 11:34:58
subtitle: 函数式接口
header-img: /img/java8/java8_bg.png
tags:
- JDK8
---

## 什么是函数式（`Functional`）接口
- 只包含一个抽象方法的接口，称为**函数式接口**
- 你可以通过 `Lambda` 表达式来创建接口的对象。（若 `Lambda` 表达式抛出一个受检异常 -- 即：非运行时异常，那么该异常需要在目标接口的抽象方法上进行声明）。
- 我们可以在一个接口上使用 `@FunctionalInterface` 注解，这样做可以检查它是否是一个函数式接口。同时 `javadoc` 也会包含一条声明，说明这个借口是一个函数式接口。
- 在 `java.util.function` 包下定义了 Java 8 的丰富的函数式接口

## 自定义函数
示例一：
```java
@FunctionalInterface
public interface MyNumber{
    public double getValue();
}
```

示例二：（函数式接口中使用泛型）
```java
@FunctionalInterface
public interface MyFunction<T>{
    public  T  getValue(T t);
}
```

## 作为参数传递Lambda表达式
示例：
```java
public String strHandler(String str, MyFunction<String> mf) {
        return mf.getValue(str);
}

//作为参数传递 Lambda 表达式（自定义函数式接口）
@Test
public void m() {
    //原来写法
    String handler = strHandler("帅是没有道理的 ", new MyFunction<String>() {
        @Override
        public String getValue(String s) {
            return s.trim();
        }
    });
    System.out.println(handler);

    //Lambda 表达式的写法
    String trimStr = strHandler("帅是没有道理的 ", str -> str.trim());
    System.out.println(trimStr);
    
    String upperStr = strHandler("abcdefg", (str) -> str.toUpperCase());
    System.out.println(upperStr);
    
    String newStr = strHandler("have a good night", (str) -> str.substring(2, 5));
    System.out.println(newStr);
}
```
**作为参数传递 `Lambda` 表达式：为了将 `Lambda` 表达式作为参数传递，接收 `Lambda` 表达式的参数类型必须是与该 `Lambda` 表达式兼容的函数式接口的类型。**

## Java 内置四大核心函数式接口

在学习 `lambda` 表达式的时候，我们知道，要使用 `lambda` 表达式，我们就要创建一个函数式接口，那每次用 `lambda` 表达式的时候岂不是很麻烦，这时候，Java 给我们内置了四大核心函数式接口。

![1](1.png)

还有一些其他接口

![2](2.png)


## 四大接口示例
### `Consumer<T>`：消费型接口，`void accept(T t)`
```java
@Test
public void m1() {
    //原来的写法
    happyTime(500, new Consumer<Double>() {
        @Override
        public void accept(Double aDouble) {
            System.out.println("学习太累，去上人间买了瓶矿泉水，价格为：" + aDouble);
        }
    });

    //Lambda 表达式的写法
    happyTime(500, money -> System.out.println("学习太累，去天上人间买了瓶矿泉水，价格为：" + money));
}

public void happyTime(double money, Consumer<Double> consumer) {
    consumer.accept(money);
}
```

### `Supplier<T>`：供给型接口，`T get()`
```java
@Test
public void m3() {
    //原来的写法
    List<Integer> numList = getNumList(10, new Supplier<Integer>() {
        @Override
        public Integer get() {
            return (int) (Math.random() * 100);
        }
    });
    System.out.println(numList);

    //Lambda 表达式的写法
    List<Integer> numListL = getNumList(10, () -> (int) (Math.random() * 100));
    System.out.println(numListL);
}

//需求：生成指定个数的整数，并放入集合中
public List<Integer> getNumList(int num, Supplier<Integer> supplier) {
    List<Integer> arrayList = new ArrayList<>();
    for (int i = 0; i < num; i++) {
        Integer n = supplier.get();
        arrayList.add(n);
    }
    return arrayList;
}
```

### `Function<T, R>`：函数型接口，`R apply(T t)`
```java
@Test
public void m4() {
    //原来的写法
    String s = sHandler("\t\t Vincent帅到掉渣...  ", new Function<String, String>() {
        @Override
        public String apply(String s) {
            return s.trim();
        }
    });
    System.out.println(s);

    //Lambda 表达式的写法
    String sL = strHandler("\t\t Vincent帅到掉渣...  ", str -> str.trim());
    System.out.println(sL);
}

//需求：用于处理字符串
public String sHandler(String str, Function<String, String> function) {
    return function.apply(str);
}
```


### `Predicate<T>`：断言型接口，`boolean test(T t)`
```java
@Test
public void m2(){
    //原来的写法
    List<String> list = Arrays.asList("北京", "南京", "天津", "东京", "西京", "普京");
    List<String> filterStrs = filterString(list, new Predicate<String>() {
        @Override
        public boolean test(String s) {
            return s.contains("京");
        }
    });
    System.out.println(filterStrs);

    //Lambda 表达式的写法
    List<String> filterStrsL = filterString(list, s -> s.contains("京"));
    System.out.println(filterStrsL);
}

//需求：根据给定的规则，过滤集合中的字符串，此规则由 Predicate 的方法决定
public List<String> filterString(List<String> list, Predicate<String> predicate) {
    ArrayList<String> filterList = new ArrayList<>();
    for (String s : list) {
        if (predicate.test(s)) {
            filterList.add(s);
        }
    }
    return filterList;
}
```

案例源码：https://github.com/V-Vincen/jdk_18