---
title: '[Java 多线程高并发练习] 3 经典面试题'
catalog: true
date: 2019-10-13 20:12:18
subtitle: wait、notify/notifyAll；Lock、Condition；CountDownLatch
header-img: /img/juc/exercise_bg2.png
tags:
- Java 多线程高并发练习
---

## 面试题一
写一个固定容量同步容器，拥有 `put` 和 `get` 方法，以及 `getCount` 方法，能够支持 2 个生成者线程和 10 个消费者线程的阻塞调用。

### `wait`、`notify/notifyAll` 方法
```java
/**
 * 面试题：写一个固定容量同步容器，拥有 put 和 get 方法，以及 getCount 方法，
 * 能够支持2个生成者线程和10个消费者线程的阻塞调用。
 * 
 * 使用 wait 和 notify/notifyAll 来实现
 */
public class MyContainer1<T> {
    final private LinkedList<T> lists = new LinkedList<>();
    final private int MAX = 10;
    private int count = 0;

    public synchronized void put(T t) {
        while (lists.size() == MAX) {
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        lists.add(t);
        ++count;
        this.notifyAll();//通知消费者线程进行消费
    }

    public synchronized T get() {
        T t = null;
        while (lists.size() == 0) {
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        t = lists.removeFirst();
        count--;
        this.notifyAll();//通知生成者进行生成
        return t;
    }

    public static void main(String[] args) {
        MyContainer1<String> c = new MyContainer1<>();

        //启动消费者线程
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                for (int j = 0; j < 5; j++) {
                    System.out.println(c.get());
                }
            }, "c" + i).start();
        }

        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        //启动生成者线程
        for (int i = 0; i < 2; i++) {
            new Thread(() -> {
                for (int j = 0; j < 25; j++) {
                    c.put(Thread.currentThread().getName() + " " + j);
                }
            }, "p" + i).start();
        }
    }
}
```

### `Lock`、`Condition` 方法
```java
/**
 * 面试题：写一个固定容量同步容器，拥有 put 和 get 方法，以及 getCount 方法，
 * 能够支持2个生成者线程和10个消费者线程的阻塞调用。
 * 
 * 使用 wait 和 notify/notifyAll 来实现
 * 
 * 使用 Lock 和 Condition 来实现
 * 对比两种方法，Condition 的方法可以更加精确的指定哪些线程被唤醒
 */
public class MyContainer2<T> {
    final private LinkedList<T> lists = new LinkedList<>();
    final private int MAX = 10;//最多10个元素
    private int count = 0;

    private Lock lock = new ReentrantLock();
    private Condition producer = lock.newCondition();
    private Condition consumer = lock.newCondition();

    public void put(T t) {
        try {
            lock.lock();
            while (lists.size() == MAX) {
                producer.await();
            }
            lists.add(t);
            ++count;
            consumer.signalAll();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    public T get() {
        T t = null;
        try {
            lock.lock();
            while (lists.size() == 0) {
                consumer.await();
            }
            t = lists.removeFirst();
            count--;
            producer.signalAll();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
        return t;
    }

    public static void main(String[] args) {
        MyContainer2<String> c = new MyContainer2<>();
        //启动消费者线程
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                for (int j = 0; j < 5; j++) {
                    System.out.println(c.get());
                }
            }, "c" + i).start();
        }

        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        //启动生成者线程
        for (int i = 0; i < 2; i++) {
            new Thread(() -> {
                for (int j = 0; j < 25; j++) {
                    c.put(Thread.currentThread().getName() + " " + j);
                }
            }, "p" + i).start();
        }
    }
}
```

## 面试题二
实现一个容器，提供两个方法 `add`、`size`。写两个线程，线程1 添加 10 个元素到容器中，线程2 实现监控元素的个数，当个数到 5 个时，线程2 给出提示并结束。

### `volatile` 方法
**错误写法：**
```java
/**
 * 曾经的面试题：
 * 实现一个容器，提供两个方法，add，size。
 * 写两个线程，线程1添加10个元素到容器中，线程2实现监控元素的个数，当个数到5个时，线程2给出提示并结束。
 * 
 * 分析下面程序能完成这个功能吗？
 */
public class MyContainer1 {

    List lists = new ArrayList();

    public void add(Object o) {
        lists.add(o);
    }

    public int size() {
        return lists.size();
    }

    public static void main(String[] args) {
        MyContainer1 c = new MyContainer1();

        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                c.add(new Object());
                System.out.println("add " + i);

                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "t1").start();


        new Thread(() -> {
            while (true) {
                if (c.size() == 5) {
                    break;
                }
            }
            System.out.println("t2 结束");
        }, "t2").start();
    }
}
```

**纠正上面写法：**
```java
/**
 * 曾经的面试题：
 * 实现一个容器，提供两个方法，add，size。
 * 写两个线程，线程1添加10个元素到容器中，线程2实现监控元素的个数，当个数到5个时，线程2给出提示并结束。
 *
 * 给 lists 添加 volatile 之后，t2 能够接到通知，但是，t2线程的死循环很浪费 cpu，如果不用死循环，改怎么做呢？
 */
public class MyContainer2 {

    //添加 volatile，使t2能够得到通知
    volatile List lists = new ArrayList();

    public void add(Object o) {
        lists.add(o);
    }

    public int size() {
        return lists.size();
    }

    public static void main(String[] args) {
        MyContainer2 c = new MyContainer2();

        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                c.add(new Object());
                System.out.println("add " + i);

                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "t1").start();


        new Thread(() -> {
            while (true) {
                if (c.size() == 5) {
                    break;
                }
            }
            System.out.println("t2 结束");
        }, "t2").start();
    }
}
```

### `wait`、`notify`方法
**错误写法：**
```java
/**
 * 曾经的面试题：
 * 实现一个容器，提供两个方法，add，size。
 * 写两个线程，线程1添加10个元素到容器中，线程2实现监控元素的个数，当个数到5个时，线程2给出提示并结束。
 * 
 * 给 lists 添加 volatile 之后，t2 能够接到通知，但是，t2线程的死循环很浪费 cpu，如果不用死循环，改怎么做呢？
 * 
 * 这里使用 wait 和 notify 做到，wait 会释放锁，而 notify 不会释放锁，
 * 需要注意的是，运用这种方法，必须要保证 t2 先执行，也就是首先让 t2 监听才可以。
 * 
 * 阅读下面的程序，并分析输出结果：
 * 可以读到输出结果并不是 size=5 时 t2 退出，而是 t1 结束时 t2 才接收到通知而退出。
 * 想想这是为什么？
 */
public class MyContainer3 {

    //添加 volatile，使t2能够得到通知
    volatile List lists = new ArrayList();

    public void add(Object o) {
        lists.add(o);
    }

    public int size() {
        return lists.size();
    }

    public static void main(String[] args) {
        MyContainer3 c = new MyContainer3();

        final Object lock = new Object();

        new Thread(() -> {
            synchronized (lock) {
                System.out.println("t2 启动");
                if (c.size() != 5) {
                    try {
                        lock.wait();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                System.out.println("t2 结束");
            }
        }, "t2").start();


        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        new Thread(() -> {
            System.out.println("t1 启动");
            synchronized (lock) {
                for (int i = 0; i < 10; i++) {
                    c.add(new Object());

                    System.out.println("add " + i);

                    if (c.size() == 5) {
                        lock.notify();
                    }

                    try {
                        TimeUnit.SECONDS.sleep(1);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }, "t1").start();
    }
}
```

**纠正上面的写法：**
```java
/**
 * 曾经的面试题：
 * 实现一个容器，提供两个方法，add，size。
 * 写两个线程，线程1添加10个元素到容器中，线程2实现监控元素的个数，当个数到5个时，线程2给出提示并结束。
 * 
 * 给 lists 添加 volatile 之后，t2 能够接到通知，但是，t2线程的死循环很浪费 cpu，如果不用死循环，改怎么做呢？
 * 
 * 这里使用 wait 和 notify 做到，wait 会释放锁，而 notify 不会释放锁，
 * 需要注意的是，运用这种方法，必须要保证 t2 先执行，也就是首先让 t2 监听才可以。
 * 
 * 阅读下面的程序，并分析输出结果：
 * 可以读到输出结果并不是 size=5 时 t2 退出，而是 t1 结束时 t2 才接收到通知而退出。
 * 想想这是为什么？
 *
 * notify 之后，t1 必须释放锁，t2 退出后，也必须 notify，通知 t1 继续执行，
 * 整个通信过程比较繁琐。
 */
public class MyContainer4 {

    //添加 volatile，使t2能够得到通知
    volatile List lists = new ArrayList();

    public void add(Object o) {
        lists.add(o);
    }

    public int size() {
        return lists.size();
    }

    public static void main(String[] args) {
        MyContainer4 c = new MyContainer4();

        final Object lock = new Object();

        new Thread(() -> {
            synchronized (lock) {
                System.out.println("t2 启动");
                if (c.size() != 5) {
                    try {
                        lock.wait();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                System.out.println("t2 结束");

                //通知 t1 继续执行
                lock.notify();
            }
        }, "t2").start();


        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        new Thread(() -> {
            System.out.println("t1 启动");
            synchronized (lock) {
                for (int i = 0; i < 10; i++) {
                    c.add(new Object());

                    System.out.println("add " + i);

                    if (c.size() == 5) {
                        lock.notify();

                        //释放锁，让 t2 得以执行
                        try {
                            lock.wait();
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }

                    try {
                        TimeUnit.SECONDS.sleep(1);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }, "t1").start();
    }
}
```

### `CountDownLatch` 方法（最优方法）

```java
/**
 * 曾经的面试题：
 * 实现一个容器，提供两个方法，add，size。
 * 写两个线程，线程1添加10个元素到容器中，线程2实现监控元素的个数，当个数到5个时，线程2给出提示并结束。
 * 
 * 给 lists 添加 volatile 之后，t2 能够接到通知，但是，t2线程的死循环很浪费 cpu，如果不用死循环，改怎么做呢？
 * 
 * 这里使用 wait 和 notify 做到，wait 会释放锁，而 notify 不会释放锁，
 * 需要注意的是，运用这种方法，必须要保证 t2 先执行，也就是首先让 t2 监听才可以。
 * 
 * 阅读下面的程序，并分析输出结果：
 * 可以读到输出结果并不是 size=5 时 t2 退出，而是 t1 结束时 t2 才接收到通知而退出。
 * 想想这是为什么？
 * 
 * notify 之后，t1 必须释放锁，t2 退出后，也必须 notify，通知 t1 继续执行，
 * 整个通信过程比较繁琐。
 * 
 * 使用 Latch（门闩）替代 wait notify 来进行通知：
 * 好处是通信方式简单，同时也可以指定等待时间，使用 await 和 countDown 方法替代 wait 和 notify；
 * CountDownLatch 不涉及锁定，当 count 的值为零时当前线程继续运行，当不涉及同步，只是涉及线程通信的时候，用 synchronized + wait/notify 就显得太重了，
 * 这时应该考虑 CountDownLatch/cyclicbarrier/semapjore
 */
public class MyContainer5 {

    //添加 volatile，使t2能够得到通知
    volatile List lists = new ArrayList();

    public void add(Object o) {
        lists.add(o);
    }

    public int size() {
        return lists.size();
    }

    public static void main(String[] args) {
        MyContainer5 c = new MyContainer5();

        CountDownLatch latch = new CountDownLatch(1);

        new Thread(() -> {
            System.out.println("t2 启动");
            if (c.size() != 5) {
                try {
                    latch.await();

                    //也可以指定等待时间
                    //latch.await(5000,TimeUnit.MICROSECONDS);

                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            System.out.println("t2 结束");
        }, "t2").start();


        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        new Thread(() -> {
            System.out.println("t1 启动");
            for (int i = 0; i < 10; i++) {
                c.add(new Object());

                System.out.println("add " + i);

                if (c.size() == 5) {
                    //打开门闩，让 t2 的以执行
                    latch.countDown();
                }

                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "t1").start();
    }
}
```

源码：https://github.com/V-Vincen/threads/tree/master/src/main/java/com/example/_exercise