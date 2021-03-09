---
title: '[Java 杂记] Java 中精度丢失问题'
catalog: true
date: 2020-08-21 13:56:50
subtitle: 使用 BigDecimal 的 string 构造函数
header-img: /img/java杂记/bigdecimal.png
tags:
- Java 杂记
---

Java 开发过程中我们有时会遇到一些有必要的运算，而一些项目尤其是金融相关的项目对这些运算的精度要求较高。那么为什么会出现精度丢失的情况，我们又该如何解决这种问题呢？

## 问题原因
首先计算机进行的是二进制运算，我们输入的十进制数字会先转换成二进制，进行运算后再转换为十进制输出。 Float 和 Double 提供了快速的运算，然而问题在于转换为二进制的时候，有些数字不能完全转换，只能无限接近于原本的值，这就导致了在后来的运算会出现不正确结果的情况。

## 解决办法
Java 提供了 `BigDecimal` 方法。具体用法如下（假设传入和设置的值的类型均为 `Double`）：

```java
    @Test
    public void t2() {
        String str = "40964.38";
        double parseDouble = Double.parseDouble(str);
        System.out.println(parseDouble);
        Double valueOf = parseDouble * 100D;
        int intValue = valueOf.intValue();
        System.out.println(intValue);
        System.out.println();

        BigDecimal bigDecimal = new BigDecimal(str);
        System.out.println(bigDecimal);
        BigDecimal multiply = BigDecimalUtils.multiply(bigDecimal, 100);
        System.out.println(multiply);
        int intValue2 = multiply.intValue();
        System.out.println(intValue2);
        System.out.println();

        int value = BigDecimalUtils.multiply(new BigDecimal(str), 100).intValue();
        System.out.println(value);
    }
```

显示结果：
```
40964.38
4096437

40964.38
4096438.00
4096438

4096438
```
