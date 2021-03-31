---
title: '[IO] 1 IO 基础概念'
catalog: true
date: 2020-08-29 15:08:15
subtitle: Provides for system input and output through data streams, serialization and the file system...
header-img: /img/io/io_bg.png
tags:
- IO
---

## 概述
流是一组有顺序的，有起点和终点的字节集合，是对数据传输的总称或抽象。即数据在两设备间的传输称为流，流的本质是数据传输，根据数据传输特性将流抽象为各种类，方便更直观的进行数据操作。IO 其实有两类，一类是 BIO（BlockingIO），一类是 NIO（Non-BlockingIO），不过我们通常说的是 IO 默认指的是 BIO。

## 相关知识概念
### 基础概念
- 字符：是指人们使用的记号，抽象意义上的一个符号，比如1、2、3、·#￥%。
- 字节：是计算机中存储数据的单元，一个8位的二进制数，是一个很具体的存储空间。
- 字符编码（Character encoding）：是一套法则，使用该法则能够对自然语言的字符的一个集合（如字母表或音节表），与其他东西的一个集合进行配对。各个国家和地区所制定的不同 ANSI 编码标准中，都只规定了各自语言所需的字符。

### 常见的编码方式
- ASCII 编码：美国制定了一套字符编码，对英语字符与二进制位之间的关系，做了统一规定。这被称为 ASCII 码，一直沿用至今。
- 非 ASCII 编码：英语用128个符号编码就够了，但是用来表示其他语言，128个符号是不够的，所以在别的国家编码符号会比128要多，所以问题就出现了，不同的国家有不同的字母，因此，哪怕它们都使用256个符号的编码方式，代表的字母却不一样。
- UTF-8 编码：UTF-8 最大的一个特点，就是它是一种变长的编码方式。它可以使用1~4个字节表示一个符号，根据不同的符号而变化字节长度。UTF-8 就是在互联网上使用最广的一种 Unicode 的实现方式。其他实现方式还包括 UTF-16（字符用两个字节或四个字节表示）和 UTF-32（字符用四个字节表示），不过在互联网上基本不用。重复一遍，这里的关系是，UTF-8 是 Unicode 的实现方式之一。

### 联系与区别
很多时候我们经常提及到字符跟字节之间的关系，这个问题的前提是基于某一种编程语言比如说 Java 或者 C 来说的，因为字符跟字节之间的关系跟字符编码是有着紧密联系的，所以单独讨论字符跟字节之间的关系没有意义，下面简单来看一下他们在不同编码上的的对应关系：

语言 | 中文字符| 英文字符
-----|---------|---------
GBK  | 2个字节 | 1个字节
UTF-8| 2个字节 | 2个字节

Java 语言默认是采用 UTF-8 来进行编码的，下面用 Java 来测试一下：
- 测试 GBK 编码
    ```java
    @Test
    public void t() {
        String str = "Hello_安卓";
        int byteLen = 0;
        try {
            byteLen = str.getBytes("gbk").length;
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        System.out.println("字节长度：" + byteLen);
    }
    ```
    
    ```java
    字节长度：10
    ```
   
- 测试 UTF-8 编码
    ```java
    @Test
    public void t2() {
        String str = "Hello_安卓";
        int byteLen = str.getBytes().length;
        System.out.println("字节长度：" + byteLen);
    }
    ```
    
    ```java
    字节长度：12
    ```
输出的结果，跟之前的规则是一致的，到这里，字节，编码方式，字符，以及他们之间的联系基本上介绍完了，理解了他们之间的关系，下面的 File 类跟 IO 之间的关系也就比较好理解了。

