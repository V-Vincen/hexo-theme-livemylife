---
title: '[JDK8] 1 Lambda 表达式'
catalog: true
date: 2019-09-10 11:34:45
subtitle: Lambda 表达式
header-img: /img/java8/java8_bg.png
tags:
- JDK8
---

## `Lambda` 表达式简介
`Lambda` 是一个简洁匿名函数，我们可以把 `Lambda` 表达式理解为是一段可以传递的代码（将代码像数据一样进行传递）。可以写出更简洁、更灵活的代码。作为一种更紧凑的代码风格，使 Java 的语言表达能力得到了提升。

## `Lambda` 表达式的应用范围
`Lambda` 表达式本质：作为函数式接口（只有一个抽象方法的接口）的实例，`Lambda` 表达式和方法引用,只能用在函数式接口上。
1. 只能是接口：否则报 `Target type of a lambda conversion must be an interface`
2. 只能有一个 `abstract` 方法：否则报 `Multiple non-overriding abstract methods found xxx`

## `Lambda` 表达式的语法
基础语法：`Java8` 中引入了一个新的操作符 `->` 该操作符称为`箭头操作符`或 `Lambda 操作符`。

箭头操作符将 `Lambda` 表达式拆分成两部分：
- 左侧：`Lambda` 表达式的参数列表
- 右侧：`Lambda` 表达式中所需执行的功能， 即 `Lambda` 体

### 语法格式
1. 无参数，无返回值
2. 一个参数，无返回值
3. 数据类型可以省略，因为可由编译器推断得出，称为“类型推断”
4. 若只需一个参数，参数的小括号可以省略
5. 需要两个或两个以上的参数，多条执行语句，并且可以有返回值
6. Lambda 体只有一条语句时，return 与大括号若有，都可省略

**示例**

```java
public class Lambda {
    //语法格式一：无参，无返回值
    @Test
    public void m1() {
        //原来的写法
        Runnable runnable = new Runnable() {
            public void run() {
                System.out.println("Vincent帅到掉渣...");
            }
        };
        runnable.run();


        //Lambda 表达式的写法
        Runnable rL = () -> {
            System.out.println("Vincent帅到掉渣...");
        };
        rL.run();
    }


    //语法格式二：一个参数，无返回值
    @Test
    public void m2() {
        //原来的写法
        Consumer<String> consumer = new Consumer<String>() {
            @Override
            public void accept(String s) {
                System.out.println(s);
            }
        };
        consumer.accept("谎言和誓言的区别是什么呢？");


        //Lambda 表达式的写法
        Consumer<String> cL = (String s) -> {
            System.out.println(s);
        };
        cL.accept("一个是听得人当真了，一个是说的人当真了......");
    }


    //语法格式三：数据类型可以省略，因为可由编译器推断得出，称为“类型推断”
    @Test
    public void m3() {
        //原来的写法
        Consumer<String> consumer = new Consumer<String>() {
            @Override
            public void accept(String s) {
                System.out.println(s);
            }
        };
        consumer.accept("Vincent帅到吐血...");


        //Lambda 表达式的写法（类型推断）
        Consumer<String> cL = (s) -> {
            System.out.println(s);
        };
        cL.accept("Vincent帅到吐血...");
    }


    //语法格式四：若只需一个参数，参数的小括号可以省略
    @Test
    public void m4() {
        //原来的写法
        Consumer<String> consumer = new Consumer<String>() {
            @Override
            public void accept(String s) {
                System.out.println(s);
            }
        };
        consumer.accept("Vincent帅到喷汁...");


        //Lambda 表达式的写法（类型推断）
        Consumer<String> cL = s -> {
            System.out.println(s);
        };
        cL.accept("Vincent帅到喷汁...");
    }


    //语法格式五：需要两个或两个以上的参数，多条执行语句，并且可以有返回值
    @Test
    public void m5() {
        //原来的写法
        Comparator<Integer> comparator = new Comparator<Integer>() {
            @Override
            public int compare(Integer o1, Integer o2) {
                System.out.println("o1:" + o1);
                System.out.println("o2:" + o2);
                return o1.compareTo(o2);
            }
        };
        int compare = comparator.compare(100, 99);
        System.out.println(compare);


        //Lambda 表达式的写法
        Comparator<Integer> cL = (o1, o2) -> {
            System.out.println("o1:" + o1);
            System.out.println("o2:" + o2);
            return o1.compareTo(o2);
        };
        int compareL = cL.compare(520, 1314);
        System.out.println(compareL);
    }


    //语法格式五：Lambda 体只有一条语句时，return 与大括号若有，都可省略
    @Test
    public void m6() {
        //原来的写法
        Comparator<Integer> comparator = new Comparator<Integer>() {
            @Override
            public int compare(Integer o1, Integer o2) {
                return o1.compareTo(o2);
            }
        };
        int compare = comparator.compare(100, 99);
        System.out.println(compare);


        //Lambda 表达式的写法
        Comparator<Integer> cL = (o1, o2) -> o1.compareTo(o2);
        int compareL = cL.compare(520, 1314);
        System.out.println(compareL);
    }
}
```
**总结**
- `->` 左边：`lambda` 形参列表的参数类型可以省略（类型推断）；如果 `lambda` 形参列表只有一个参数，其 `()` 可以省略
- `->` 右边：`lambda` 体应该使用 `{}` 包裹；如果 `lambda` 体只有一条执行语句（可以是 `return` 语句），可以省略 `{}` 和 `return` 关键字

案例源码：https://github.com/V-Vincen/jdk_18