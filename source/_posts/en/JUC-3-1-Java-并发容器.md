---
title: '[JUC] 3.1 Java 并发容器'
catalog: true
date: 2019-10-12 15:06:18
subtitle: Java 并发容器
header-img: /img/juc/juc_bg.png
tags:
- JUC
---

Java 在 1.5 版本之前所谓的线程安全的容器，主要指的就是 `同步容器`，当然因为所有方法都用 `synchronized` 来保证互斥，串行度太高了，性能太差了。因此 Java 在 1.5 及之后版本提供了性能更高的容器，我们一般称为 `并发容器`。

并发容器虽然数量非常多，但依然是前面我们提到的四大类：`List`、`Map`、`Set` 和 `Queue`。

![1](1.png)

并发容器关系图。

## `List`
`CopyOnWriteArrayList`：提供高效地读取操作，使用在读多写少的场景。`CopyOnWriteArrayList` 读取操作不用加锁，且是安全的；写操作时，先 copy 一份原有数据数组，再对复制数据进行写入操作，最后将复制数据替换原有数据，从而保证写操作不影响读操作。

下面看下 `CopyOnWriteArrayList` 的核心代码，体会下 `CopyOnWrite` 的思想：
```java
//添加元素
public boolean add(E e) {
    //独占锁
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        Object[] elements = getArray();
        int len = elements.length;
        //复制一个新的数组newElements
        Object[] newElements = Arrays.copyOf(elements, len + 1);
        newElements[len] = e;
        //修改后指向新的数组
        setArray(newElements);
        return true;
    } finally {
        lock.unlock();
    }
}

public E get(int index) {
    //未加锁，直接获取
    return get(getArray(), index);
}
```
**案例：**
```java
/**
 * 写时复制容器：copy on write
 * 多线程环境下，写时效率低，读是效率高
 * 适合用在写少读多的环境
 */
public class _02_T_CopyOnWriteList {
    public static void main(String[] args) {
        List<String> list = new CopyOnWriteArrayList<>();
//        List<String> list = new ArrayList<>();
//        List<String> list = new Vector<>();

        Random random = new Random();
        Thread[] threads = new Thread[100];
        for (int i = 0; i < threads.length; i++) {
            Runnable runnable = new Runnable() {
                @Override
                public void run() {
                    for (int j = 0; j < 1000; j++) list.add("a" + random.nextInt(10000));
                }
            };
            threads[i] = new Thread(runnable);
        }

        runAndComputeTime(threads);

        System.out.println(list.size());
    }

    private static void runAndComputeTime(Thread[] threads) {
        long start = System.currentTimeMillis();
        Arrays.asList(threads).forEach(thread -> thread.start());
        Arrays.asList(threads).forEach(thread -> {
            try {
                thread.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        long end = System.currentTimeMillis();
        System.out.println(end - start);
    }
}
```
## `Map`
`ConcurrentHashMap`：在 JDK8 做了优化，以前是通过分段锁来实现 -- 初始化时容器分成16段，JDK8 摒弃了 `Segment` 的概念，使用 `CAS + Synchronzied` 来实现。

`ConcurrentSkipListMap`：它是一个线程安全有序的 `Map`，采用跳表实现有序高效并发；相当于 `TreeMap` -- 采用红黑树实现排序。

**两者的区别：**
- `ConcurrentHashMap` 的 `key` 是**无序**的，而 `ConcurrentSkipListMap` 的 `key` 是**有序**的。所以如果你需要保证 `key` 的顺序，就只能使用 `ConcurrentSkipListMap`。
- 使用 `ConcurrentHashMap` 和 `ConcurrentSkipListMap` 需要注意的地方是，它们的 `key` 和 `value` 都不能为空，否则会抛出 `NullPointerException` 这个运行时异常。

下面这个表格总结了 `Map` 相关的实现类对于 `key` 和 `value` 的要求。

![2](2.png)

`ConcurrentSkipListMap` 里面的 `SkipList` 本身就是一种数据结构，中文一般都翻译为“跳表”。跳表插入、删除、查询操作平均的时间复杂度是 O(log n)，理论上和并发线程数没有关系，所以在并发度非常高的情况下，若你对 `ConcurrentHashMap` 的性能还不满意，可以尝试一下 `ConcurrentSkipListMap`。

**案例：**
```java
public class _01_T_ConcurrentMap {
    public static void main(String[] args) {
        Map<String,String> map = new ConcurrentHashMap<>();
//        Map<String,String> map = new ConcurrentSkipListMap<>();//高并发并且排序

//        Map<String, String> map = new Hashtable<>();
//        Map<String,String> map = new HashMap<>();

        Random r = new Random();
        Thread[] ths = new Thread[100];
        CountDownLatch latch = new CountDownLatch(ths.length);

        long start = System.currentTimeMillis();
        for (int i = 0; i < ths.length; i++) {
            ths[i] = new Thread(() -> {
                for (int j = 0; j < 10000; j++) map.put("a" + r.nextInt(100000), "a" + r.nextInt(100000));
                latch.countDown();
            });
        }

        List<Thread> threads = Arrays.asList(ths);
        threads.forEach(thread -> thread.start());

        try {
            //main线程阻塞，直到计数器变为0，才会继续执行
            latch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        long end = System.currentTimeMillis();

        System.out.println(end - start);
    }
}
```

## `Set`
`Set` 接口的两个实现是 `CopyOnWriteArraySet` 和 `ConcurrentSkipListSet`，使用场景可以参考前面讲述的 `CopyOnWriteArrayList` 和 `ConcurrentSkipListMap`，它们的原理都是一样的，这里就不再赘述了。

## `Queue`
具体请看 [Java 并发容器 -- 队列](https://v_vincen.gitee.io/2019/10/12/JUC-3-2-Java-%E5%B9%B6%E5%8F%91%E5%AE%B9%E5%99%A8-%E9%98%9F%E5%88%97/) 