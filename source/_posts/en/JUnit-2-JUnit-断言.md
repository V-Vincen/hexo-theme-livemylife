---
title: '[JUnit] 2 JUnit 断言'
catalog: true
date: 2019-06-24 01:13:38
subtitle: JUnit 断言
header-img: /img/junit/junit_bg.png
tags:
- JUnit
---

## 什么是断言
---
断言是编程术语，表示为一些布尔表达式，程序员相信在程序中的某个特定点该表达式值为真，可以在任何时候启用和禁用断言验证，因此可以在测试时启用断言而在部署时禁用断言。同样，程序投入运行后，最终用户在遇到问题时可以重新启用断言。

使用断言可以创建更稳定、品质更好且 不易于出错的代码。当需要在一个值为 false 时中断当前操作的话，可以使用断言。单元测试必须使用断言（Junit/JunitX）。

## 常用断言方法
---
| 断言                                                         | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| void assertEquals([String message], expected value, actual value) | 断言两个值相等。值可能是类型有 int, short, long, byte, char or java.lang.Object. 第一个参数是一个可选的字符串消息 |
| void assertTrue([String message], boolean condition)         | 断言一个条件为真                                             |
| void assertFalse([String message],boolean condition)         | 断言一个条件为假                                             |
| void assertNotNull([String message], java.lang.Object object) | 断言一个对象不为空(null)                                     |
| void assertNull([String message], java.lang.Object object)   | 断言一个对象为空(null)                                       |
| void assertSame([String message], java.lang.Object expected, java.lang.Object actual) | 断言，两个对象引用相同的对象                                 |
| void assertNotSame([String message], java.lang.Object unexpected, java.lang.Object actual) | 断言，两个对象不是引用同一个对象                             |
| void assertArrayEquals([String message], expectedArray, resultArray) | 断言预期数组和结果数组相等。数组的类型可能是 int, long, short, char, byte or java.lang.Object. |

## 测试断言效果
---
在之前的单元测试类中创建一个名为 `testAssert` 方法来查看断言效果
```java
/**
 * 测试断言
 */
@Test
public void testAssert() {
    String obj1 = "junit";
    String obj2 = "junit";
    String obj3 = "test";
    String obj4 = "test";
    String obj5 = null;
    int var1 = 1;
    int var2 = 2;
    int[] arithmetic1 = {1, 2, 3};
    int[] arithmetic2 = {1, 2, 3};

    assertEquals(obj1, obj2);

    assertSame(obj3, obj4);

    assertNotSame(obj2, obj4);

    assertNotNull(obj1);

    assertNull(obj5);

    assertTrue("为真", var1 == var2);

    assertArrayEquals(arithmetic1, arithmetic2);
}
```