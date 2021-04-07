---
title: '[Thread] 2 线程的安全问题'
catalog: true
date: 2019-09-06 22:39:25
subtitle: 线程的安全问题
header-img: /img/thread/thread_bg.png
tags:
- Thread
---

## 假设一个场景
需求：创建三个窗口卖票，总票数为100张。

线程安全问题：卖票过程中，出现了重票、错票。

问题的原因：当某个线程操作车票的过程中，尚未操作完成时，其他线程参与进来，也操作车票。

如何解决：当一个线程a 在操作 `ticket` 的时候，其他线程不能参与进来。直到线程a 操作完 `ticket` 时，其他线程才可以操作 ticket 。这种情况即使线程a 出现了阻塞，也不能改变。

在 Java 中，我们通过同步机制，来解决线程的安全问题。
- `synchronized`
- `Lock` （JDK 5.0 新增）

## `synchronized`
### 同步代码块
```java
synchronized（同步监视器）{
    //需要被同步的代码
}
```
这个同步监视器一般称为 `同步锁`。

同步的前提：同步中必须有多 个线程并使用同一个锁。

同步的好处：解决了线程的安全问题。

同步的弊端：相对降低了效率，因为同步外的线程的都会判断同步锁。

#### 实现 `Runnable` 接口
```java
public class WindowRunnable {
    public static void main(String[] args) {
        WindowR window = new WindowR();

        Thread t1 = new Thread(window);
        Thread t2 = new Thread(window);
        Thread t3 = new Thread(window);

        t1.setName("窗口1");
        t2.setName("窗口2");
        t3.setName("窗口3");

        t1.start();
        t2.start();
        t3.start();
    }
}

class WindowR implements Runnable {

    private int ticket = 100;
    Object obj = new Object();

    public void run() {
        while (true) {
            synchronized (obj) {

                /**
                 * 或者使用 this：表示当前类的对象，也就是 WindowR 的对象
                 */
                //synchronized (this) {

                if (ticket > 0) {

                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }

                    System.out.println(Thread.currentThread().getName() + "：卖票，票号为：" + ticket);
                    ticket--;
                } else {
                    break;
                }
            }
        }
    }
}
```
**说明：**
- `同步的代码`：操作共享数据的代码，即为需要被同步的代码。
- `共享数据`：多个线程共同操作的变量。比如：本案例中 `ticket` 就是共享数据。
- `同步监视器`，俗称：`锁`。任何一个类的对象，都可以充当锁。（**注意：多线程必须要共用同一把锁。**）

**补充：**

在实现 `Runnable` 接口创建多线程的方式中，我们可以考虑用 `this` 充当同步监视器。


#### 继承 `Thread` 类
```java
public class WindowThread {
    public static void main(String[] args) {
        WindowT t1 = new WindowT();
        WindowT t2 = new WindowT();
        WindowT t3 = new WindowT();

        t1.setName("窗口1");
        t2.setName("窗口2");
        t3.setName("窗口3");

        t1.start();
        t2.start();
        t3.start();
    }
}

class WindowT extends Thread {
    private static int ticket = 100;
    private static Object obj = new Object();

    @Override
    public void run() {
        while (true) {
            synchronized(obj) {

                /**
                 * 或者使用 WindowT.class：这里的 WindowT.class 也是个对象，相当于 Class clazz = WindowT.class，类是唯一的，在 JVM 中只会加载一次；
                 * 这里就不能用 this 了，因为这时候的 this 表示 t1、t2、t3 三个对象，相当于是三把锁了，并不是同一把锁。
                 */
                //synchronized (WindowT.class){
                if (ticket > 0) {

                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }

                    System.out.println(Thread.currentThread().getName() + "：卖票，票号为：" + ticket);
                    ticket--;
                } else {
                    break;
                }
            }
        }
    }
}
```
**说明：**

在继承 `Thread` 类创建多线程的方式中，**慎用** `this` 充当同步监视器，考虑使用当前类充当同步监视器。

### 同步方法
如果操作共享数据的代码完整的声明在一个方法中，我们不妨将此方法声明同步的。

#### 实现 `Runnable` 接口
```java
public class WindowRunnable {
     public static void main(String[] args) {
         WindowR windowR = new WindowR();

         Thread t1 = new Thread(windowR);
         Thread t2 = new Thread(windowR);
         Thread t3 = new Thread(windowR);

         t1.setName("窗口1");
         t2.setName("窗口2");
         t3.setName("窗口3");

         t1.start();
         t2.start();
         t3.start();
     }
}

class WindowR implements Runnable{

    private int ticket = 100;

    @Override
    public void run() {
        for (int i = 1; i < 101; i++) {
            show();
        }
    }

    //同步监视器：this 表示为当前类的对象
    public synchronized void show() {
        if (ticket > 0) {

            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            System.out.println(Thread.currentThread().getName() + "：卖票，票号为：" + ticket);
            ticket--;
        }
    }

}
```

#### 继承 `Thread` 类
```java
public class WindowThread {
    public static void main(String[] args) {
        WindowT t1 = new WindowT();
        WindowT t2 = new WindowT();
        WindowT t3 = new WindowT();

        t1.setName("窗口1");
        t2.setName("窗口2");
        t3.setName("窗口3");

        t1.start();
        t2.start();
        t3.start();

    }

}

class WindowT extends Thread{

    private static int ticket = 100;


    @Override
    public void run() {
        for (int i = 1; i < 101; i++) {
            show();
        }
    }

    private static synchronized void show() {

    /**
     *下面这种写法是错误的，因为这时候的同步监听器为 this 表示 t1、t2、t3 三个对象。
     */
    //private synchronized void show() {

        if (ticket > 0) {
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            System.out.println(Thread.currentThread().getName() + "：卖票，票号为：" + ticket);
            ticket--;
        }
    }
}
```

**总结：**
- 同步方法仍然涉及到同步监视器，只是不需要我们显式的声明。
- 非静态的同步方法，同步监视器是 this；静态的同步方法，同步监视器是当前类的本身。


### 对比
同步方法（函数）和同步代码块的区别：
- 同步方法（函数）的锁是固定的`this`。
- 同步代码块的锁是任意的对象。

## 线程死锁问题
### 死锁
- 不同的线程分别占用对方需要的同步资源不放弃，都在等待对方放弃自己需要的同步资源，就形成了线程的死锁。
- 出现死锁后，不会出现提示，只是所有的线程都处于阻塞状态，无法继续。

### 案例
```java
public class ThreadDeadLock {
    public static void main(String[] args) {
        StringBuffer s1 = new StringBuffer();
        StringBuffer s2 = new StringBuffer();

        new Thread(){
            @Override
            public void run() {

                synchronized (s1){
                    s1.append("a");
                    s2.append("1");

                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }

                    synchronized (s2){
                        s1.append("b");
                        s2.append("2");

                        System.out.println(s1);
                        System.out.println(s2);
                    }
                }
            }
        }.start();

        new Thread(new Runnable() {
            @Override
            public void run() {

                synchronized(s2){
                    s1.append("c");
                    s2.append("3");

                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }

                    synchronized(s1){
                        s1.append("d");
                        s2.append("4");

                        System.out.println(s1);
                        System.out.println(s2);
                    }
                }
            }
        }).start();
    }
}

```
**解决方法**
- 专门的算法、原则
- 尽量减少同步资源的定义
- 尽量避免嵌套同步


## `Lock` （JDK 5.0 新增）
从 JDK 5.0 开始，Java 提供了更强大的线程同步机制--通过显式定义同步锁对象来实现同步。同步锁使用 `Lock` 对象充当。

`java.util.concurrent.locks.Lock` 接口是控制多线程对共享资源进行访问的工具。锁提供了对共享资源的独占访问，每次只能有一个线程对 `Lock` 对象加锁，线程开始访问共享资源之前应先获得 `Lock` 对象。

`ReentrantLock`（可重入锁）类实现了 `Lock`，它拥有与 `synchronized` 相同的并发性和内存语义，在实现线程安全的控制，比较常用的是 `ReentrantLock`，可以显式加锁、释放锁。

### 案例
```java
public class LockTest {
    public static void main(String[] args) {
        Window w = new Window();

        Thread t1 = new Thread(w);
        Thread t2 = new Thread(w);
        Thread t3 = new Thread(w);

        t1.setName("窗口1");
        t2.setName("窗口2");
        t3.setName("窗口3");

        t1.start();
        t2.start();
        t3.start();
    }
}

class Window implements Runnable {

    private int ticket = 100;

    //实例化 ReentrantLock
    //如果是有参构造：new ReentrantLock(true) --> 表示为公平调度，结果为 t1、t2、t3 三个线程轮流调度
    private ReentrantLock lock = new ReentrantLock();

    @Override
    public void run() {
        while (true) {

            try {

                //调用锁定方法 lock()
                lock.lock();

                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                if (ticket > 0) {
                    System.out.println(Thread.currentThread().getName() + "：售票，票号为 " + ticket);
                    ticket--;
                } else {
                    break;
                }

            } finally {

                //调用解锁方法 unlock()
                lock.unlock();
            }
        }
    }
}
```

### `synchronized` 与 `Lock` 的对比
- `Lock` 是显式锁（手动开启和关闭，别忘记关闭锁），`synchronized` 是隐式锁，出了作用域自动释放
- `Lock` 只有代码块锁，`synchronized` 有代码块和方法锁
- 使用 `Lock` 锁，JVM 将花费较少的时间来调度线程，性能更好。并且有有更好的扩展性（提供更多的子类）

**优先使用顺序：**

`Lock` --> 同步代码块（已经进入方法体，分配了相应资源） --> 同步方法（在方法体之外） 

案例源码：https://github.com/V-Vincen/threads