---
title: '[Java 多线程高并发练习] 4 并发容器案例'
catalog: true
date: 2019-10-13 20:31:32
subtitle: ConcurrentLinkedQueue
header-img: /img/juc/exercise_bg2.png
tags:
- Java 多线程高并发练习
---

## 案例
有 N 张火车票，每张票都有一个编号，同时又 10 个窗口对外售票，请写一个模拟程序。

### 线程不安全
```java
/**
 * 有 N 张火车票，每张票都有一个编号，同时又10个窗口对外售票，请写一个模拟程序。
 * 
 * 分析下面的程序可能会产生那些问题？
 * 重复销售？超量销售？
 *
 * ArrayList 是线程不安全的，其各个方法也不是同步的。所以可能会出现，重复销售和超量销售的问题！！！
 */
public class TicketSeller1 {
    static List<String> tickets = new ArrayList<>();

    static {
        for (int i = 0; i < 10000; i++) tickets.add("票编号：" + i);
    }

    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                while (tickets.size() > 0) {
                    System.out.println("售票了--" + tickets.remove(0));
                }
            }).start();
        }
    }
}
```

### 非原子操作
```java
/**
 * 有 N 张火车票，每张票都有一个编号，同时又10个窗口对外售票，请写一个模拟程序。
 * 
 * 分析下面的程序可能会产生那些问题？
 * 重复销售？超量销售？
 *
 * 虽然说 Vector 是线程安全的，但是 while 中的操作不是原子操作，最后一张片极有可能会被多个线程同时抢占，
 * 所以下面的程序会出现 ArrayIndexOutOfBoundsException 的问题。
 */
public class TicketSeller2 {
    static Vector<String> tickets = new Vector<>();

    static {
        for (int i = 0; i < 10000; i++) tickets.add("票编号：" + i);
    }

    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                while (tickets.size() > 0) {

                    try {
                        TimeUnit.MILLISECONDS.sleep(10);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }

                    System.out.println("售票了--" + tickets.remove(0));
                }
            }).start();
        }
    }
}
```

### 同步方法
```java
/**
 * 有 N 张火车票，每张票都有一个编号，同时又10个窗口对外售票，请写一个模拟程序。
 * 
 * 分析下面的程序可能会产生那些问题？
 * 重复销售？超量销售？
 * 
 * synchronized：加了同步代码块，锁定为原子操作。所以不会出错。
 */
public class TicketSeller3 {
    static List<String> tickets = new LinkedList<>();

    static {
        for (int i = 0; i < 10000; i++) tickets.add("票编号：" + i);
    }

    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                while (true) {
                    synchronized (tickets) {
                        if (tickets.size() <= 0) break;

                        try {
                            TimeUnit.MILLISECONDS.sleep(1);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }

                        System.out.println("销售了--" + tickets.remove(0));
                    }
                }
            }).start();
        }
    }
}
```

### 并发容器
```java
/**
 * 有 N 张火车票，每张票都有一个编号，同时又10个窗口对外售票，请写一个模拟程序。
 * 
 * 分析下面的程序可能会产生那些问题？
 * 重复销售？超量销售？
 * 
 * ConcurrentLinkedQueue 的 poll 方法，采用了 CAS 机制来实现加锁，所以不会有问题。
 */
public class TicketSeller4 {
    static Queue<String> tickets = new ConcurrentLinkedQueue<>();

    static {
        for (int i = 0; i < 10000; i++) tickets.add("票编号：" + i);
    }

    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                while (true) {
                    String s = tickets.poll();
                    if (s == null) break;
                    else System.out.println(Thread.currentThread().getName() + "：销售了--" + s);
                }
            }).start();
        }
    }
}
```

源码：https://github.com/V-Vincen/threads/tree/master/src/main/java/com/example/_exercise