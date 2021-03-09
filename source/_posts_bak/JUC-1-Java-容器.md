---
title: '[JUC] 1 Java 容器'
catalog: true
date: 2019-10-10 13:01:21
subtitle: 同步容器和并发容器
header-img: /img/juc/juc_bg.png
tags:
- JUC
---

Java 中的容器主要可以分为四个大类，分别是 `List`、`Map`、`Set` 和 `Queue`，但并不是所有的 Java 容器都是线程安全的。说到线程安全的问题，我们先来理解两个名词 `同步容器` 和 `并发容器`。

## 同步容器
在 Java 中，同步容器主要包括 2 类：

### `Vector`、`Stack`、`HashTable`
- `Vector` 实现了 `List` 接口，`Vector` 实际上就是一个数组，和 `ArrayList` 类似，但是 `Vector` 中的方法都是 `synchronized` 方法，即进行了同步措施。
- `Stack` 也是一个同步容器，它的方法也用 `synchronized` 进行了同步，它实际上是继承于 `Vector` 类。
- `HashTable` 实现了 `Map` 接口，它和 `HashMap` 很相似，但是 `HashTable` 进行了同步处理，而 `HashMap` 没有。

部分源码如下：
```java
//Vector
public synchronized int size() {};
public synchronized E get(int index) {};

//HashTable 
public synchronized V put(K key, V value) {};
public synchronized V remove(Object key) {};
```

### `Collections` 类中提供的静态工厂方法创建的类
由 `Collections.synchronizedXxxx` 等方法，来实现容器的同步。比如下面的示例代码中，分别把 `ArrayList`、`HashSet` 和 `HashMap` 包装成了线程安全的 `List`、`Set` 和 `Map`。
```java
List list = Collections.synchronizedList(new ArrayList());

Set set = Collections.synchronizedSet(new HashSet());

Map map = Collections.synchronizedMap(new HashMap());
```

**同步容器的缺陷**
- 性能问题：由于被 `synchronized` 修饰的方法，每次只允许一个线程执行，其他试图访问这个方法的线程只能等待。显然，这种方式比没有使用 `synchronized` 的容器性能要差。

- 安全问题：同步容器真的一定安全吗？未必。同步容器未必真的安全。在做复合操作时，仍然需要加锁来保护。

可以通过下面的代码来说明这个问题：
```java
public static void deleteVector(){
    int index = vectors.size() - 1;
    vectors.remove(index);
}
```
代码中对 `Vector` 进行了两步操作，首先获取 `size`，然后移除最后一个元素，多线程情况下如果两个线程交叉执行，`A` 线程调用 `size` 后，`B` 线程移除最后一个元素，这时 `A` 线程继续 `remove` 将会抛出索引超出的错误。

那么怎么解决这个问题呢？最直接的修改方案就是对代码块加锁来防止多线程同时执行：
```java
public static void deleteVector(){
    synchronized (vectors) {
        int index = vectors.size() - 1;
        vectors.remove(index);
    }
}
```

如果上面的问题通过加锁来解决没有太直观的影响，那么来看看对 `vectors` 进行迭代的情况：
```java
public static void foreachVector(){
    synchronized (vectors) {
        for (int i = 0; i < vectors.size(); i++) {
            System.out.println(vectors.get(i).toString());
        }
    }
}
```
为了避免多线程情况下在迭代的过程中其他线程对 `vectors` 进行了修改，就不得不对整个迭代过程加锁，想象这么一个场景，如果迭代操作非常频繁，或者 `vectors` 元素很大，那么所有的修改和读取操作将不得不在锁外等待，这将会对多线程性能造成极大的影响。那么有没有什么方式能够很好的对容器的迭代操作和修改操作进行分离，在修改时不影响容器的迭代操作呢？这就需要 `java.util.concurrent` 包中的各种并发容器了出场了。

**案例：**
```java
public class _03_T_SynchronizedList {
    public static void main(String[] args) {
        //未加锁
        List<String> list = new ArrayList<>();

        //已加锁
        List<String> synchronizedList = Collections.synchronizedList(list);
    }
}
```

## 并发容器
Java 在 1.5 版本之前所谓的线程安全的容器，主要指的就是 `同步容器`，当然因为所有方法都用 `synchronized` 来保证互斥，串行度太高了，性能太差了。因此 Java 在 1.5 及之后版本提供了性能更高的容器，我们一般称为 `并发容器`。

并发容器虽然数量非常多，但依然是前面我们提到的四大类：`List`、`Map`、`Set` 和 `Queue`。

![1](1.png)

并发容器关系图。

我们先来简单的了解下，JDK 的 `java.util.concurrent` 包（即 `juc`）中提供了几个非常有用的 `并发容器`。

- `CopyOnWriteArrayList` - 线程安全的 `ArrayList`。
- `CopyOnWriteArraySet` - 线程安全的 `Set`，它内部包含了一个 `CopyOnWriteArrayList`，因此本质上是由 `CopyOnWriteArrayList` 实现的。
- `ConcurrentSkipListSet` - 相当于线程安全的 `TreeSet`。它是有序的 `Set`。它由 `ConcurrentSkipListMap` 实现。
- `ConcurrentHashMap` - 线程安全的 `HashMap`。采用分段锁实现高效并发。
- `ConcurrentSkipListMap` - 线程安全的有序 `Map`。使用跳表实现高效并发。
- `ConcurrentLinkedQueue` - 线程安全的无界队列。底层采用单链表。支持 `FIFO`。
- `ConcurrentLinkedDeque` - 线程安全的无界双端队列。底层采用双向链表。支持 `FIFO` 和 `FILO`。
- `ArrayBlockingQueue` - 数组实现的阻塞队列。
- `LinkedBlockingQueue` - 链表实现的阻塞队列。
- `LinkedBlockingDeque` - 双向链表实现的双端阻塞队列。

后续我们再来具体的学习并发容器。