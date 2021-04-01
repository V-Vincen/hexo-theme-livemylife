---
title: '[Java 多线程高并发练习] 2 ReentrantLock、ThreadLocal、线程安全单例'
catalog: true
date: 2019-10-13 17:30:59
subtitle: 多线程练习
header-img: /img/juc/exercise_bg2.png
tags:
- Java 多线程高并发练习
---

## `ReentrantLock`
**练习一：**

```java
/**
 * ReentrantLock 用于替代 Synchronized，本例中由于 m1 锁定 this，只有 m1 执行完毕的时候，m2 才能执行，
 * 这里是复习 Synchronized 最原始的语义。
 */
public class ReentrantLock1 {

    synchronized void m1() {
        for (int i = 0; i < 10; i++) {
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(i);
        }
    }

    synchronized void m2() {
        System.out.println("m2...");
    }

    public static void main(String[] args) {
        ReentrantLock1 rL = new ReentrantLock1();

        new Thread(rL::m1).start();

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        new Thread(rL::m2).start();
    }
}
```

**练习二：**
```java
/**
 * ReentrantLock 用于替代 Synchronized，本例中由于 m1 锁定 this，只有 m1 执行完毕的时候，m2 才能执行，
 * 这里是复习 Synchronized 最原始的语义。
 * 
 * 使用 ReentrantLock 可以完成同样的功能
 * 需要注意的是，必须要手动释放锁，使用 syn 锁定的话如果遇到异常，JVM 会自动释放锁，但是 lock 必须手动释放锁，因此经常在 finally 中进行锁的释放。
 */
public class ReentrantLock2 {
    Lock lock = new ReentrantLock();

    void m1() {
        try {
            lock.lock();//synchronized(this)
            for (int i = 0; i < 10; i++) {
                TimeUnit.SECONDS.sleep(1);

                System.out.println(i);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }

    }

    void m2() {
        lock.lock();
        System.out.println("m2...");
        lock.unlock();
    }

    public static void main(String[] args) {
        ReentrantLock2 rL = new ReentrantLock2();

        new Thread(rL::m1).start();

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        new Thread(rL::m2).start();
    }
}
```

**练习三：**
```java
/**
 * ReentrantLock 用于替代 Synchronized，本例中由于 m1 锁定 this，只有 m1 执行完毕的时候，m2 才能执行，
 * 这里是复习 Synchronized 最原始的语义。
 * 
 * 使用 ReentrantLock 可以完成同样的功能
 * 需要注意的是，必须要手动释放锁，使用 syn 锁定的话如果遇到异常，JVM 会自动释放锁，但是 lock 必须手动释放锁，因此经常在 finally 中进行锁的释放。
 *
 * 使用 ReentrantLock 可以进行“尝试锁定” tryLock，这样无法锁定，或者在指定时间内无法锁定，线程可以决定是否继续等待。
 */
public class ReentrantLock3 {
    Lock lock = new ReentrantLock();

    void m1() {
        try {
            lock.lock();//synchronized(this)
            for (int i = 0; i < 10; i++) {
                TimeUnit.SECONDS.sleep(1);

                System.out.println(i);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    /**
     * 使用 tryLock 进行尝试锁定，然后可以根据 tryLock 的返回值来判定是否锁定，再根据业务需求进行编码；
     * 也可以指定 tryLock 的时间，由于 tryLock(time) 抛出异常，所以要注意 unlock 的处理，必须放在 finally 中。
     */
    void m2() {
//        boolean locked = lock.tryLock();
//        System.out.println("m2..." + locked);
//        if (locked) lock.unlock();

        boolean locked = false;

        try {
            lock.tryLock(5, TimeUnit.SECONDS);
            System.out.println("m2..." + locked);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            if (locked) lock.unlock();
        }
    }

    public static void main(String[] args) {
        ReentrantLock3 rL = new ReentrantLock3();

        new Thread(rL::m1).start();

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        new Thread(rL::m2).start();
    }
}
```

**练习四：**
```java
/**
 * ReentrantLock 用于替代 Synchronized，本例中由于 m1 锁定 this，只有 m1 执行完毕的时候，m2 才能执行，
 * 这里是复习 synchronized 最原始的语义。
 * 
 * 使用 ReentrantLock 可以完成同样的功能
 * 需要注意的是，必须要手动释放锁，使用 syn 锁定的话如果遇到异常，JVM 会自动释放锁，但是 lock 必须手动释放锁，因此经常在 finally 中进行锁的释放。
 * 
 * 使用 ReentrantLock 可以进行“尝试锁定” tryLock，这样无法锁定，或者在指定时间内无法锁定，线程可以决定是否继续等待。
 * 
 * 使用 ReentrantLock 还可以调用 lockInterruptibly 方法，可以对线程 interrupt 方法做出响应，在一个线程等待锁的过程中，可以被打断。
 */
public class ReentrantLock4 {
    /**
     * 线程1现在持有 lock 这把锁，在线程1启动后，其无限睡死了；
     * 这时线程2启动了，同时线程2，也去申请 lock 这把锁，但是由于线程1，在无限制的持有 lock 这把锁，所以线程2拿不到 lock 这把锁，只能进行等待；
     * 如果想要打断正在等待中的线程2，这时我们就要用 t2.interrupt() 方法来打断线程2，
     * 而 lock.lockInterruptibly() 方法可以对 t2.interrupt() 方法做出响应，并且捕获 InterruptedException 异常。
     */
    public static void main(String[] args) {
        Lock lock = new ReentrantLock();

        boolean locked = false;

        Thread t1 = new Thread(() -> {
            try {
                lock.lock();//synchronized(this)
                System.out.println("t1 start");

                TimeUnit.SECONDS.sleep(Integer.MAX_VALUE);

                System.out.println("t1 end");
            } catch (InterruptedException e) {
                System.out.println("interrupted! t1");
            } finally {
                lock.unlock();
            }
        });
        t1.start();

        Thread t2 = new Thread(() -> {
            try {
//                lock.lock();//synchronized(this)
                lock.lockInterruptibly();//可以对 interrupt() 方法做出响应
                System.out.println("t2 start");

                TimeUnit.SECONDS.sleep(5);

                System.out.println("t2 end");
            } catch (InterruptedException e) {
                System.out.println("interrupted! t2");
            } finally {
                if (locked) lock.unlock();
            }
        });
        t2.start();

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        t2.interrupt();//打断线程2的等待
    }
}
```

**练习五：**
```java
/**
 * ReentrantLock 用于替代 Synchronized，本例中由于 m1 锁定 this，只有 m1 执行完毕的时候，m2 才能执行，
 * 这里是复习 synchronized 最原始的语义。
 * 
 * 使用 ReentrantLock 可以完成同样的功能
 * 需要注意的是，必须要手动释放锁，使用 syn 锁定的话如果遇到异常，JVM 会自动释放锁，但是 lock 必须手动释放锁，因此经常在 finally 中进行锁的释放。
 * 
 * 使用 ReentrantLock 可以进行“尝试锁定” tryLock，这样无法锁定，或者在指定时间内无法锁定，线程可以决定是否继续等待。
 * 
 * 使用 ReentrantLock 还可以调用 lockInterruptibly 方法，可以对线程 interrupt 方法做出响应，在一个线程等待锁的过程中，可以被打断。
 * 
 * ReentrantLock 还可以指定为公平锁
 */
public class ReentrantLock5 extends Thread {

    public static ReentrantLock lock = new ReentrantLock(true);//加上参数 true 为公平锁

    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {
            lock.lock();
            try {
                System.out.println(Thread.currentThread().getName() + "获得锁");
            } finally {
                lock.unlock();
            }
        }
    }

    public static void main(String[] args) {
        ReentrantLock5 rL = new ReentrantLock5();

        Thread t1 = new Thread(rL);
        Thread t2 = new Thread(rL);

        t1.start();
        t2.start();
    }
}
```

## `ThreadLocal`
**练习一：**
```java
// ThreadLocal 线程局部变量
public class ThreadLocal1 {
    volatile static Person p = new Person();

    public static void main(String[] args) {
        new Thread(() -> {
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(p.name);
        }).start();

        new Thread(() -> {
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            p.name = "lisi";
        }).start();
    }
}

class Person {
    String name = "zhangsan";
}
```


**练习二：**
```java
/**
 * ThreadLocal 线程局部变量
 * 
 * ThreadLocal 是使用空间换时间，synchronized 是使用时间换空间；
 * 比如在 hibernate 中 session 就存在于 ThreadLocal 中，避免 synchronized 的使用。
 */
public class ThreadLocal2 {
    /**
     * ThreadLocal：线程局部变量
     * 下面程序运行结果为：
     *      t2:zhangsan
     *      t1:null
     * 因为线程t2中 tL.set(new Person())，而线程t1并没有；
     * 所以 ThreadLocal 是线程局部变量，线程t2需要用就自己 set，线程t1是共享不了的。
     */
    static ThreadLocal<Person> tl = new ThreadLocal<>();

    public static void main(String[] args) {
        new Thread(() -> {
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName() + ":" + tl.get());
        }, "t1").start();

        new Thread(() -> {
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            tl.set(new Person());
            System.out.println(Thread.currentThread().getName() + ":" + tl.get().name);
        }, "t2").start();
    }

    static class Person {
        String name = "zhangsan";
    }
}
```

## 线程安全的单例模式
```java
/**
 * 线程安全的单例模式：
 * （更多相关可阅读：https://wvincen.gitee.io/2019/08/05/Java-%E6%9D%82%E8%AE%B0-GoF-%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F/）
 *
 * 更好的采用下面的方式：既不用加锁，也能实现懒加载
 */
public class Singleton {
    private Singleton(){
        System.out.println("single");
    }

    private static class Inner{
        private static Singleton s = new Singleton();
    }

    private static Singleton getInstance(){
        return Inner.s;
    }

    public static void main(String[] args) {
        Thread[] ths = new Thread[200];

        for (int i = 0; i < ths.length; i++) {
            ths[i] = new Thread(() -> {
                Singleton.getInstance();
            });
        }

        List<Thread> threads = Arrays.asList(ths);

        //原来的写法
//        threads.forEach(new Consumer<Thread>() {
//            @Override
//            public void accept(Thread thread) {
//                thread.start();
//            }
//        });

        //lambda 表达式
        threads.forEach(thread -> thread.start());
    }
}
```

源码：https://github.com/V-Vincen/threads/tree/master/src/main/java/com/example/_exercise