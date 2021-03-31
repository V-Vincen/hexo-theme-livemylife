---
title: '[Java 杂记] GoF 单例模式'
catalog: true
date: 2019-08-05 01:20:14
subtitle: 单例模式
header-img: /img/java杂记/gof_bg2.png
tags:
- Java 杂记
---

## 简介
单例对象（Singleton）是一种常用的设计模式。在Java应用中，单例对象能保证在一个 JVM 中，该对象只有一个实例存在。这样的模式有几个好处：

**单例模式的优点：**
- 由于单例模式只生产一个实例，减少了系统性能开销，当一个对象的产生需要比较多的资源时，如读取配置、产生其他依赖对象时，则可以通过在应用启动时直接产生一个单例对象，然后永久驻留内存的方式来解决
- 单例模式可以在系统设置全局的访问点，优化环境共享资源访问，例如可以设计一个单例类，负责所以数据表的映射处理

**常见的五种单例模式实现方式**：
- 主要：
  - 饿汉式（线程安全，调用效率高；但是，不能延迟加载）
  - 懒汉式（线程安全，调用效率不高；但是，可以延迟加载）
- 其他：
  - 双重检测锁式（由于 JVM 底层内部模型原因，偶尔会出问题，不建议使用）
  - 静态内部类式（线程安全，调用效率高；但是，可以延时加载）
  - 枚举单例（线程安全，调用效率高，不能延时加载）

### 饿汉式
```java
/**
 * @ProjectName:
 * @Package:        com.example.gof23.creational_patterns.singleton
 * @ClassName:      SingletonHg
 * @Description:    饿汉式单例模式（Hungry）
 * @Author:         Mr.Vincent
 * @CreateDate:     2019/8/4 23:33
 * @Version:        1.0.0
 */
public class SingletonHungry {

    //类初始化时，立即加载这个对象
    //（在类加载器加载时，是天然的线程安全模式；同时因为是立即加载，所以没有延迟加载的优势）
    private static SingletonHungry instance = new SingletonHungry();

    //私有化构造器
    private SingletonHungry() {
    }

    //方法没有同步，调用效率高
    public static SingletonHungry getInstance() {
        return instance;
    }
}
```

### 懒汉式
```java
/**
 * @ProjectName:
 * @Package:        com.example.gof23.creational_patterns.singleton
 * @ClassName:      SingletonLazy
 * @Description:    懒汉式单例模式（Lazy）
 * @Author:         Mr.Vincent
 * @CreateDate:     2019/8/4 23:44
 * @Version:        1.0.0
 */
public class SingletonLazy {

    //类初始化时，不初始化这个对象（实现懒加载 或者叫 延迟加载（lazy load），真正用到的时候才加载）
    private static SingletonLazy instance;

    //私有化构造器
    private SingletonLazy() {
    }

    //方法同步，调用效率低
    public static synchronized SingletonLazy getInstance() {
        if (instance == null) {
            instance = new SingletonLazy();
        }
        return instance;
    }
}
```

### 双重检测锁式
```java
/**
 * @ProjectName:
 * @Package:        com.example.gof23.creational_patterns.singleton
 * @ClassName:      SingletonDC
 * @Description:    双重检测锁式单例模式（Double Checked Locking）
 * @Author:         Mr.Vincent
 * @CreateDate:     2019/8/5 0:14
 * @Version:        1.0.0
 */
public class SingletonDC {

    //使用了volatile关键字后，重排序被禁止，所有的写（write）操作都将发生在读（read）操作之前
    private volatile static SingletonDC instance;

    //私有化构造器
    private SingletonDC() {
    }

    //双重检测锁式
    public SingletonDC getInstance() {
        if (instance == null) {
            synchronized (SingletonDC.class) {
                if (instance == null) {
                    instance = new SingletonDC();
                }
            }
        }
        return instance;
    }
}
```

### 静态内部类式
```java
/**
 * @ProjectName:
 * @Package:        com.example.gof23.creational_patterns.singleton
 * @ClassName:      SingletonSIC
 * @Description:    静态内部类式单例模式（Static Inner Class）
 * @Author:         Mr.Vincent
 * @CreateDate:     2019/8/5 0:28
 * @Version:        1.0.0
 */
public class SingletonSIC {

    private static class SingletonClassInstance {
        private static final SingletonSIC instance = new SingletonSIC();
    }

    //私有化构造器
    private SingletonSIC() {
    }

    public static SingletonSIC getInstance(){
        return SingletonClassInstance.instance;
    }
}
```

### 枚举单例
```java
/**
 * @ProjectName:
 * @Package:        com.example.gof23.creational_patterns.singleton
 * @ClassName:      SingletonEnum
 * @Description:    枚举类单例模式（Enum）
 * @Author:         Mr.Vincent
 * @CreateDate:     2019/8/5 0:40
 * @Version:        1.0.0
 */
public enum SingletonEnum {

    //这个枚举元素，本身就是单例对象（没有延时加载）
    INSTANCE;

    //添加自己需要的操作
    public void singletonOperation() {

    }
}
```

## 测试

### 测试单例模式：
```java
public class Client {
    public static void main(String[] args) {
        //测试饿汉式单例模式（Hungry）
        SingletonHungry hungry1 = SingletonHungry.getInstance();
        SingletonHungry hungry2 = SingletonHungry.getInstance();
        System.out.println(hungry1);
        System.out.println(hungry2);

        //测试懒汉式单例模式
        SingletonLazy lazy1 = SingletonLazy.getInstance();
        SingletonLazy lazy2 = SingletonLazy.getInstance();
        System.out.println(lazy1);
        System.out.println(lazy2);

        //测试双重检测锁单例模式
        SingletonDC dc1 = SingletonDC.getInstance();
        SingletonDC dc2 = SingletonDC.getInstance();
        System.out.println(dc1);
        System.out.println(dc2);

        //测试静态内部类式单例模式
        SingletonSIC sic1 = SingletonSIC.getInstance();
        SingletonSIC sic2 = SingletonSIC.getInstance();
        System.out.println(sic1);
        System.out.println(sic2);

        //测试枚举单例模式
        SingletonEnum anEnum1 = SingletonEnum.INSTANCE;
        SingletonEnum anEnum2 = SingletonEnum.INSTANCE;
        System.out.println(anEnum1==anEnum2);
    }
}
```
结果为：
```
饿汉式：com.example.gof23.creational_patterns.singleton.SingletonHungry@1540e19d
饿汉式：com.example.gof23.creational_patterns.singleton.SingletonHungry@1540e19d
懒汉式：com.example.gof23.creational_patterns.singleton.SingletonLazy@677327b6
懒汉式：com.example.gof23.creational_patterns.singleton.SingletonLazy@677327b6
双重检测锁：com.example.gof23.creational_patterns.singleton.SingletonDC@14ae5a5
双重检测锁：com.example.gof23.creational_patterns.singleton.SingletonDC@14ae5a5
静态内部类：com.example.gof23.creational_patterns.singleton.SingletonSIC@7f31245a
静态内部类：com.example.gof23.creational_patterns.singleton.SingletonSIC@7f31245a
枚举单例：true
```

### 测试五种单例模式在多线程环境下的效率
（关注相对值即可，不同的环境下测试值完全不一样）

五种单例模式                | 时间
---|---
饿汉式（SingletonHungry）   | 26ms
懒汉式（SingletonLazy）     | 186ms
双重检测锁式（SingletonDC） | 40ms
静态内部类式（SingletonSIC）| 31ms
枚举单例（SingletonEnum）   | 37ms

- `CountDownLatch`
  - 同步辅助类，在完全一组正在其他线程中执行的操作之前，它允许一个或多个线程一直等待
  - `countDown()`：当前线程调用此方法，则计数减一（建议放在 finally 里执行）
  - `await()`：调用此方法会一直阻塞当前线程，直到计时器的值为0

```java
public class ClientTimes {
    public static void main(String[] args) throws InterruptedException {

        long start = System.currentTimeMillis();
        int threadNum = 10;
        final CountDownLatch countDownLatch = new CountDownLatch(threadNum);

        for (int i = 0; i < threadNum; i++) {
            new Thread(new Runnable() {
                public void run() {
                    for (int i = 0; i < 1000000; i++) {
                        //分别对下面的单例模式进行测试
                        SingletonHungry hungry = SingletonHungry.getInstance();
//                        SingletonLazy lazy = SingletonLazy.getInstance();
//                        SingletonDC dc = SingletonDC.getInstance();
//                        SingletonSIC sic = SingletonSIC.getInstance();
//                        SingletonEnum anEnum = SingletonEnum.INSTANCE;
                    }
                    countDownLatch.countDown();
                }
            }).start();
        }

        //main线程阻塞，直到计数器变为0，才会继续执行
        countDownLatch.await();
        long end = System.currentTimeMillis();
        System.out.println("总耗时：" + (end - start));
    }
}
```
测试结果如上表格

## 问题（拓展）
- 反射可以破解上面几种（不包含枚举式）实现反式（可以在构造方法中手动抛出异常控制）
- 反序列化可以破解上面几种（不包含枚举式）实现方式（可以通过定义 readResolver() 防止获得不同的对象）
  - 反序列化时，如果对象所在的类定义了 readResolver()，（实际是一种回调），定义返回那个对象

### 例：反射破解单例模式
```java
package com.example.gof23.creational_patterns.singleton.expand;

public class SingletonDemo {

    private static SingletonDemo instance = new SingletonDemo();

    //私有化构造器
    private SingletonDemo() {
    }

    public static SingletonDemo getInstance() {
        return instance;
    }

}
```
```java
public class Test_reflect {

    public static void main(String[] args) throws Exception {

        //通过反射来破解单例模式（通过反射的方式直接调用私有化构造器）
        Class<SingletonDemo> clazz = (Class<SingletonDemo>) Class.forName("com.example.gof23.creational_patterns.singleton.expand.SingletonDemo");
        Constructor<SingletonDemo> c = clazz.getDeclaredConstructor(null);
        c.setAccessible(true);//跳过权限的检测，使其可以访问私有的方法
        SingletonDemo sd1 = c.newInstance();
        SingletonDemo sd2 = c.newInstance();

        System.out.println(sd1);
        System.out.println(sd2);

    }
}
```
结果为：
```
com.example.gof23.creational_patterns.singleton.expand.SingletonDemo@1540e19d
com.example.gof23.creational_patterns.singleton.expand.SingletonDemo@677327b6
```

防止反射破解单例模式：在构造方法中手动抛出异常控制
```java
package com.example.gof23.creational_patterns.singleton.expand;

public class SingletonDemo {

    private static SingletonDemo instance = new SingletonDemo();

    //私有化构造器
    private SingletonDemo() {
        //防止反射获取私有化的构造方法，从而破解单例模式
        if (instance != null) {
            throw new RuntimeException();
        }
    }

    public static SingletonDemo getInstance() {
        return instance;
    }

}
```
再运行的结果为：
```java
com.example.gof23.creational_patterns.singleton.expand.SingletonDemo@135fbaa4
com.example.gof23.creational_patterns.singleton.expand.SingletonDemo@135fbaa4
```

### 例：反序列化破解单例模式
```java
package com.example.gof23.creational_patterns.singleton.expand;

import java.io.Serializable;

public class SingletonDemo implements Serializable {

    private static SingletonDemo instance = new SingletonDemo();

    //私有化构造器
    private SingletonDemo() {
    }

    public static SingletonDemo getInstance() {
        return instance;
    }

}
```
```java
public class Test_serializable {

    public static void main(String[] args) throws Exception {

        //通过反序列化的方式构造多个对象
        SingletonDemo instance1 = SingletonDemo.getInstance();

        FileOutputStream fos = new FileOutputStream("e:/a.txt");
        ObjectOutputStream oos = new ObjectOutputStream(fos);
        oos.writeObject(instance1);

        FileInputStream fis = new FileInputStream("e:/a.txt");
        ObjectInputStream ois = new ObjectInputStream(fis);
        SingletonDemo instance2 = (SingletonDemo) ois.readObject();

        System.out.println(instance1);
        System.out.println(instance2);
    }
}
```
结果为：
```
com.example.gof23.creational_patterns.singleton.expand.SingletonDemo@135fbaa4
com.example.gof23.creational_patterns.singleton.expand.SingletonDemo@58372a00
```
防止反序列化破解单例模式：通过定义 readResolver() 防止获得不同的对象
```
package com.example.gof23.creational_patterns.singleton.expand;

import java.io.Serializable;

public class SingletonDemo implements Serializable {

    private static SingletonDemo instance = new SingletonDemo();

    //私有化构造器
    private SingletonDemo() {
        //防止反射获取私有化的构造方法，从而破解单例模式
        if (instance != null) {
            throw new RuntimeException();
        }
    }

    public static SingletonDemo getInstance() {
        return instance;
    }

    //在反序列化时，如果定义了此方法，则直接返回此方法中的对象，无需单独再创建新对象
    private Object readResolve() {
        return instance;
    }

}
```
再运行结果为：
```
com.example.gof23.creational_patterns.singleton.expand.SingletonDemo@135fbaa4
com.example.gof23.creational_patterns.singleton.expand.SingletonDemo@135fbaa4
```

## 总结：如何用
- 单例对象占用资源少，不需要延迟加载：
  - 枚举式 好于 饿汉式 
- 单例对象占用资源大，需要延迟加载：
  - 静态内部类式 好于 懒汉式

参考源码：https://github.com/V-Vincen/GOF23