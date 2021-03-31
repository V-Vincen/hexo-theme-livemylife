---
title: '[Java 杂记] Java 中 Char 数组转换为 List 集合'
catalog: true
date: 2020-09-06 18:44:34
subtitle: Char 数组转换为 List 集合
header-img: /img/header_img/categories_bg5.jpg
tags: 
- Java 杂记
---

近期在做公司需求的时候，碰到要将一个 String 转成 Char 数组再转换成 List 集合来操作的问题。在 Java 自带的 JDK 中并没有提供直接可以将 Char 数组转换成 List 集合的方法。刚开始我用了 `Arrays.asList(char[])` 来转换，但是这个方法转换后的结果是有问题的，并不是我想要的结果。那么我们接下来，来看下具体应该怎么做。直接看代码。

## 例一
```java
    @Test
    public void t() {
        String str = "小王Vincent";

        char[] chars = str.toCharArray();
        for (char aChar : chars) {
            System.out.println(aChar);
        }
        System.out.println();

        List<char[]> charsArray = Arrays.asList(chars);
        System.out.println(charsArray);
        charsArray.forEach(System.out::println);
    }
```

运行结果：
```
小
王
V
i
n
c
e
n
t

[[C@76ccd017]
小王Vincent
```

我们再来看一个例子，如下。

## 例二

```java
    @Test
    public void t2() {
        int[] array = new int[]{3, 10, 4, 0, 2};
        List<int[]> ints = Arrays.asList(array);
        List<int[]> ints2 = Collections.singletonList(array);
        System.out.println(ints);

        Integer[] arr = new Integer[]{3, 10, 4, 0, 2};
        List<Integer> integers = Arrays.asList(arr);
        System.out.println(integers);
    }
```

运行结果：
```
[[I@38cccef]
[3, 10, 4, 0, 2]
```
从这个例子中我们可以看出当数组是基本数据类型的时候，`Arrays.asList(T... a)` 方法最后得到的结果，并不是把数组里的每一个元素 `add` 到集合中的，而是直接将整个数组当做一个元素 `add` 到集合中。
如果你用的是 Idea 同时安装了阿里代码规范检测插件，那么当你写案例中的第二行代码时 `Arrays.asList(array)`，`asList` 应该会报黄色的警告，根据警告提示进行修改的话，他会直接把 `Arrays.asList(array)` 这行代码转换为第三行代码 `Collections.singletonList(array)`，它就等同于 `Arrays.asList(array)` ，而我们从这个转换后的方法名也可以看出返回的 `List<int[]>` 是一个单元素集合。
回到第一个例子中，例一和例二是一样。那么问题来了，我们到底应该用什么方法才能把 `char[] chars = str.toCharArray();` 转换成 `List<Character>`。我们再来看一个案例。

## 例三
最简单粗暴的方法，如下：
```java
List<Character> list = Lists.newArrayList();
for (char aChar : chars) {
    list.add(aChar);
}
System.out.println(list);
```

运行结果：
```
[小, 王, V, i, n, c, e, n, t]
```
没毛病，这就是我们要的结果，但是这样简单粗暴的写法完全体现不出我们编码上的逼格，那么如何写才能体现出我们高大上的编码逼格呢。如下例。

## 例四
两种写法，第一种方法是 `Guava` jar 包提供的 `Chars.asList（`）方法；第二种方法是利用 JDK 8 提供的 `lambda` 流式编程。如下：
```java
    @Test
    public void t3() {
        String str = "小王Vincent";
        List<Character> characters = Chars.asList(str.toCharArray());
        System.out.println(characters);

        List<Character> characters2 = str.chars().mapToObj(c -> (char) c).collect(Collectors.toList());
        System.out.println(characters2);
    }
```

运行结果：
```
[小, 王, V, i, n, c, e, n, t]
[小, 王, V, i, n, c, e, n, t]
```
这样的写法是不是瞬间提高了我们编码逼格，精简干练。这只是我推荐的两种写法，当然还有其他写法。大家可以根据个人喜好来选择。



