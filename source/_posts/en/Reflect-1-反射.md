---
title: '[Reflect] 1 反射'
catalog: true
date: 2020-04-08 18:09:52
subtitle: Reflect
header-img: /img/reflect/reflect_bg.jpg
tags:
- Reflect
---

## 反射机制概述
Reflection（反射）是被视为动态语言的关键，反射机制允许程序在执行期借助于 Reflection API 取得任何类的内部信息，并能直接操作任意对象的内部属性及方法。

加载完类之后，在堆内存的方法区中就产生了一个 Class 类型的对象（ 一个类只有一个 Class 对象），这个对象就包含了完整的类的结构信息 。我们可以通过这个对象看到类的结构。这个对象就像一面镜子 ，透过这个镜子看到类的结构，所以我们形象的称之为：反射。

### 反射机制研究及应用
- 在运行时判断任意一个对象所属的类
- 在运行时构造任意一个类的对象
- 在运行时判断任意一个类所具有的成员变量和方法
- 在运行时获取泛型信息
- 在运行时调用任意一个对象的成员变量和方法
- 在运行时处理注解 
- 生成动态代理

### 反射相关的主要 API
- `java.lang.Class`：代表一个类
- `java.lang.reflect.Method`：代表类的方法
- `java.lang.reflect.Field`：代表类的成员变量
- `java.lang.reflect.Constructor`：代表类的构造器


## 理解 Class 类并获取 Class 的实例
在 Object 类中定义了以下的方法，此方法 将被所有子类继承：`public final Class getClass()`。这个方法返回值的类型是一个 Class 类， 此类是Java反射的源头，实际上所谓反射从程序的运行结果来看也很好理解，即：可以通过对象反射求出类的名称。

对象照镜子后可以得到的信息：某个类的属性、方法和构造器、某个类到底实现了哪些接口。对于每个类而言，JRE 都为其保留一个不变的 Class 类型的对象。一个 Class 对象包含了特定某个结构（`class/interface/enum/annotation/primitive type/void/[]`）的有关信息。
- Class 本身也是一个类
- Class 对象只能由系统建立对象
- 一个加载的类在 JVM 中只会有一个 Class 实例
- 一个 Class 对象对应的是一个加载到 JVM 中的一个 .class 文件
- 每个类的实例都会记得自己是由哪个 Class 实例所生成
- 通过 Class 可以完整地得到一个类中的所有被加载的结构
- Class 类是 Reflection 的根源，针对任何你想动态加载、运行的类，唯有先获得相应的 Class 对象

### Class 类的常用方法
| 方法名                                             | 功能说明                                                               |
|----------------------------------------------------|------------------------------------------------------------------------|
| static Class forName\(String name\)                | 返回指定类名 name 的 Class 对象                                        |
| Object newInstance\(\)                             | 调用缺省构造函数，返回该 Class 对象的一个实例                          |
| getName\(\)                                        | 返回此 Class 对象所表示的实体（类、接口、数组类、基本类型或 void）名称 |
| Class getSuperClass\(\)                            | 返回当前 Class 对象的父类的 Class 对象                                 |
| Class \[\] getInterfaces\(\)                       | 获取当前 Class 对象的接口                                              |
| ClassLoader getClassLoader\(\)                     | 返回该类的类加载器                                                     |
| Class getSuperclass\(\)                            | 返回表示此 Class 所表示的实体的超类的 Class                            |
| Constructor\[\] getConstructors\(\)                | 返回一个包含某些 Constructor 对象的数组                                |
| Field\[\] getDeclaredFields\(\)                    | 返回 Field 对象的一个数组                                              |
| Method getMethod\(String name,Class … paramTypes\) | 返回一个 Method 对象，此对象的形参类型为 paramType                     |

### 获取 Class 类的实例（四种方法）
1. 前提：若已知具体的类，通过类的 class 属性获取，该方法最为安全可靠， 程序性能最高。例：`Class clazz = String.class;`
2. 前提：已知某个类的实例，调用该实例的 `getClass()` 方法获取 Class 对象。例：`Class clazz = “www.atguigu.com”.getClass();` 
3. 前提：已知一个类的全类名，且该类在类路径下，可通过 Class 类的静态方法 `forName()` 获取，可能抛出 `ClassNotFoundException`。例：`Class clazz = Class.forName(“java.lang.String”);`
4. 其他方式
```java
ClassLoader cl = this.getClass().getClassLoader();
Class clazz4 = cl.loadClass("类的全类名"); 
```

### 哪些类型可以有 Class 对象？
- class： 外部类，成员(成员内部类，静态内部类)，局部内部类，匿名内部类
- interface：接口
- []：数组
- enum：枚举
- annotation：注解 @interface
- primitive type：基本数据类型
- void

```java
Class c1 = Object.class;
Class c2 = Comparable.class;
Class c3 = String[].class;
Class c4 = int[][].class;
Class c5 = ElementType.class;
Class c6 = Override.class;
Class c7 = int.class;
Class c8 = void.class; Class c9 = Class.class;

int[] a = new int[10]; 
int[] b = new int[100]; 
Class c10 = a.getClass(); 
Class c11 = b.getClass(); 
// 只要元素类型与维度一样，就是同一个 Class
System.out.println(c10 == c11);
```

## 创建运行时类的对象
有了 Class 对象，能做什么？
创建类的对象：调用 Class 对象的 `newInstance()` 方法。要求：
- 类必须有一个无参数的构造器。
- 类的构造器的访问权限需要足够。

难道没有无参的构造器就不能创建对象了吗？不是！只要在操作的时候明确的调用类中的构造器，并将参数传递进去之后，才可以实例化操作。步骤如下：
- 通过 Class 类的 `getDeclaredConstructor(Class … parameterTypes)` 取得本类的指定形参类型的构造器。
- 向构造器的形参中传递一个对象数组进去，里面包含了构造器中所需的各个参数。
- 通过 `Constructor` 实例化对象。

示例：
```java
//1. 根据全类名获取对应的 Class 对象 
String name = "atguigu.java.Person";
Class clazz = Class.forName(name);
//2. 调用指定参数结构的构造器，生成 Constructor 的实例
Constructor con = clazz.getConstructor(String.class,Integer.class); 
//3. 通过 Constructor 的实例创建对应类的对象，并初始化类属性
Person p2 = (Person) con.newInstance("Peter",20);
System.out.println(p2);
```

