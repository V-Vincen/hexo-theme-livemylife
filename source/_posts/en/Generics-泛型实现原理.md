---
title: '[Generics] 泛型实现原理'
catalog: true
lang: en
date: 2021-04-27 16:58:34
subtitle: Generic implementation principle... 
header-img: /img/generics/generics_bg.png
tags:
- Generics
---

## 泛型实现原理
JDK 1.5增加的新特性里面有一个就是泛型。对于泛型的评价，褒贬不一，废话不多说，先来看看他的原理。泛型是提供给 javac 编译器使用的，可以限定集合中的输入类型，让编译器拦截源程序中的非法输入，编译器编译带类型说明的集合时会去掉类型信息，对于参数化得泛型类型，getClass() 方法的返回值和原始类型完全一样。

对于下面这个源程序：
```java
public class Oliver {  
    public static void main(String[] args) {  
        ArrayList<String> list = new ArrayList<String>();  
        list.add("str1");  
        list.add("str2");  
        String str = list.get(0);  
    }  
}  
```

编译成 Oliver.class 后反编译的内容：
```java
public class Oliver {  
    public Oliver() {  
    }  
  
    public static void main(String[] args) {  
        ArrayList list = new ArrayList();  
        list.add("str1");  
        list.add("str2");  
        String str = (String) list.get(0);  
    }  
}  
```
也就是说 java 的泛型只是在编译器做了参数限制，其实对性能并没有什么优化！由于编译生成的字节码会去掉泛型的类型信息，只要能跳过编译器，就可以往某个泛型集合中加入其它的类型数据。下面代码展示利用反射机制跳过编译器检查：
```java
public class Oliver {  
    public static void main(String[] args) throws Exception {  
        ArrayList<Integer> list = new ArrayList<Integer>();  
        list.getClass().getMethod("add", Object.class).invoke(list, "ssss");  
        System.out.println("list:" + list.get(0));  
    }  
}
```

输出结果：
```
list:ssss
```