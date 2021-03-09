---
title: '[Java 多线程高并发练习] 1 synchronized、volatile、AtomicXXX'
catalog: true
date: 2019-10-12 19:25:11
subtitle: 多线程练习
header-img: /img/juc/exercise_bg2.png
tags:
- Java 多线程高并发练习
---

## `synchronized`
**练习一：**
```java
//synchronized 关键词：对某个对象加锁
public class _001_Synchronized_O {
    
    private int count = 10;
    private Object o = new Object();

    public void m() {
        synchronized (o) {//任何线程操作要执行下面的代码，必须拿到 o 的锁
            count--;
            System.out.println(Thread.currentThread().getName() + " count = " + count);
        }
    }
}
```

**练习二：**
```java
//synchronized 关键词：对某个对象加锁
public class _002_Synchronized_This {
    
    private int count = 10;

    public void m() {
        synchronized (this) {//任何线程操作要执行下面的代码，必须拿到 this 的锁
            count--;
            System.out.println(Thread.currentThread().getName() + " count = " + count);
        }
    }
}
```

**练习三：**
```java
//synchronized 关键词：对某个对象加锁
public class _003_Synchronized_M {
    
    private int count = 10;

    public synchronized void m() {//等同于在方法的代码执行时，要 synchronized(this)
        count--;
        System.out.println(Thread.currentThread().getName() + " count = " + count);
    }
}
```

**练习四：**
```java
//synchronized 关键词：对某个对象加锁
public class _004_Synchronized_StaticM {
    
    private static int count = 10;

    public synchronized static void m() {//这里等同于 synchronized(_004_Synchronized_StaticM.class)
        count--;
        System.out.println(Thread.currentThread().getName() + " count = " + count);
    }

    public static void mm(){
        synchronized (_004_Synchronized_StaticM.class){
            count--;
            System.out.println(Thread.currentThread().getName() + " count = " + count);
        }
    }
}
```

## `Runnable`
```java
public class _005_T_R implements Runnable {

    private int count = 10;

    @Override
    public synchronized void run() {
        count--;
        System.out.println(Thread.currentThread().getName() + " count = " + count);
    }

    public static void main(String[] args) {
        _005_T_R tR = new _005_T_R();
        for (int i = 0; i < 5; i++) {
            new Thread(tR, "Thread" + i).start();
        }
    }
}
```

## 同步和非同步方法同时调用
```java
//同步和非同步方法是否可以同时调用
public class _006_T_SynAndM {

    public synchronized void m1() {
        System.out.println(Thread.currentThread().getName() + " m1 start...");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName() + " m1 end...");
    }

    public void m2() {
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName() + " m2");
    }

    public static void main(String[] args) {
        _006_T_SynAndM t = new _006_T_SynAndM();

        new Thread(() -> t.m1(), "t1").start();
        new Thread(() -> t.m2(), "t2").start();

//        或者方法引用
//        new Thread(t::m1,"t1").start();
//        new Thread(t::m1,"t2").start();

//        或者原来的写法
//        new Thread(new Runnable() {
//            @Override
//            public void run() {
//                t.m1();
//            }
//        }, "t1").start();
//        new Thread(new Runnable() {
//            @Override
//            public void run() {
//                t.m2();
//            }
//        }, "t2").start();
    }
}
```

## 业务的读写方法都需加锁
```java
/**
 * 对业务写方法加锁
 * 对业务读方法不加锁
 * 容易产生脏读问题（dirtyRead）
 */
public class _007_T_Account {
    String name;
    double balance;

    public synchronized void set(String name, double balance) {
        this.name = name;

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        this.balance = balance;
    }

    //如果对业务读方法不加锁，很容易产生脏读问题（dirtyRead）
    public synchronized double getBalance(String name) {
        return this.balance;
    }

    public static void main(String[] args) {
        _007_T_Account account = new _007_T_Account();

        new Thread(() -> account.set("zhangsan", 100.0)).start();

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println(account.getBalance("zhangsan"));

        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println(account.getBalance("zhangsan"));
    }
}
```

## 可重入锁
**练习一：**
```java
//一个同步方法可以调用另外一个同步方法，一个线程已经拥有某个对象的锁，再次申请的时候仍然会得到该对象的锁。
// 也就是说 synchronized 获得的锁是可重入的。
public class _008_T_Syn2 {

    synchronized void m1() {
        System.out.println("m1 start");
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        m2();
    }

    synchronized void m2() {
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("m2");
    }
}
```

**练习二：**
```java
//一个同步方法可以调用另一个同步方法，一个线程已经拥有某个对象的锁，再次申请的时候仍然会得到该对象；
//也就是说 synchronized 获得的锁是可重入的；
//这里是继承中有可能发生的情形，子类调用父类的同步方法。
public class _009_T_T_Syn2 {
    synchronized void m() {
        System.out.println("m start");
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("m end");
    }

    public static void main(String[] args) {
        new TT().m();
    }
}

class TT extends _009_T_T_Syn2 {
    @Override
    synchronized void m() {
        System.out.println("child m start");
        super.m();
        System.out.println("child m end");
    }
}
```

## 多线程出现异常，默认情况锁会释放
```java
/**
 * 程序在执行过程中，如果出现异常，默认情况锁会释放。所以，在并发处理的过程中，有异常要多小心，不然可能会发生不一致的情况。
 * 比如，在一个 web app 处理过程中，多个 servlet 线程共同访问同一个资源，这时如果异常处理不合适，在第一个线程中抛出异常，
 * 其他线程就会进入同步代码区，有可能会访问到异常产生的数据。
 * 因此要非常小心的处理同步业务逻辑中的异常
 */
public class _010_T_Exception {

    int count = 0;

    synchronized void m() {
        System.out.println(Thread.currentThread().getName() + " start");
        while (true) {
            count++;
            System.out.println(Thread.currentThread().getName() + " count" + count);
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            if (count == 5) {
                int i = 1 / 0;//此处抛出异常，锁将被释放，要想不被释放，可以在这里进行 catch，然后让循环继续。
            }
        }
    }

    public static void main(String[] args) {
        _010_T_Exception tTryCatch = new _010_T_Exception();

        Runnable r = new Runnable() {
            @Override
            public void run() {
                tTryCatch.m();
            }
        };

        new Thread(r, "t1").start();

        try {
            TimeUnit.SECONDS.sleep(3);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        new Thread(r, "t2").start();
    }
}
```

## `volatile`
**练习一：**
```java
/**
 * volatile 关键词，是一个变量在多线程间可见，
 * A B 线程都用到一个变量，java 默认是线程中保留一份 copy，这样如果 B 线程改了该变量，则 A 线程未必知道，
 * 使用 volatile 关键字，会让所有线程都会读到变量的修改值。
 *
 * 在下面的代码中，running 是存在于堆内存的 t 对象中，
 * 当线程 t1 开始运行的时候，会把 running 值从内存中读到 t1 线程的工作区，在运行过程中直接使用这个 copy，
 * 并不会每次都去读取堆内存，这样，当主线程修改 running 的值之后，t1 线程感知不到，所以不会停止运行。
 *
 * 使用 volatile，将会强制所有线程都去堆内存中读取 running 的值。
 * volatile 并不能保证多个线程共同修改 running 变量时所带来的不一致问题，也就是 volatile 不能替代 synchronized。
 * 也就是说 volatile 只能保证线程数据之间的可见性，但并不能保证线程之间的原子性。
 */
public class _011_T_Volatile {

    //用 static 修饰也可以达到数据共享的效果，但是这时候需要下面的 while 方法内的程序，主动去调用 running，否则正在运行的线程不会主动去更新修改后的 running 全局类变量。
    volatile boolean running = true;//对比一下有无 volatile 的情况下，整个程序运行结果的区别

    void m() {
        System.out.println("m start");
        while (running) {
//            System.out.println(running);
        }
        System.out.println("m end!");
    }

    public static void main(String[] args) {
        _011_T_Volatile tVolatile = new _011_T_Volatile();

        new Thread(tVolatile::m, "t1").start();

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        tVolatile.running = false;
    }
}
```

**练习二：**
```java
/**
 * volatile 并不能保证多个线程共同修改 running 变量时所带来的不一致问题，也就是 volatile 不能替代 synchronized。
 * 也就是说 volatile 只能保证线程数据之间的可见性，但并不能保证线程之间的原子性。
 */
public class _012_T_VolatileAndSyn {
    volatile int count = 0;

    void m() {
        for (int i = 0; i < 10000; i++) count++;
    }

    public static void main(String[] args) {
        _012_T_VolatileAndSyn tVolatileAndSyn = new _012_T_VolatileAndSyn();

        List<Thread> threads = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            threads.add(new Thread(tVolatileAndSyn::m, "thread-" + i));
        }

        threads.forEach((o) -> o.start());

        //原来的写法
//        threads.forEach(new Consumer<Thread>() {
//            @Override
//            public void accept(Thread o) {
//                o.start();
//            }
//        });

        threads.forEach((o) -> {
            try {
                o.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        //原来的写法
//        threads.forEach(new Consumer<Thread>() {
//            @Override
//            public void accept(Thread thread) {
//                try {
//                    thread.join();
//                } catch (InterruptedException e) {
//                    e.printStackTrace();
//                }
//            }
//        });

        System.out.println(tVolatileAndSyn.count);
    }
}
```

**练习三：**
```java
/**
 * 对比上一个程序，可以用 synchronized 解决，synchronized 可以保证可见性和原子性，volatile 只能保证可见性。
 */
public class _013_T_VolatileAndSyn2 {
    int count = 0;

    synchronized void m() {
        for (int i = 0; i < 10000; i++) count++;
    }

    public static void main(String[] args) {
        _013_T_VolatileAndSyn2 tVolatileAndSyn2 = new _013_T_VolatileAndSyn2();

        List<Thread> threads = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            threads.add(new Thread(tVolatileAndSyn2::m, "thread-" + i));
        }

        threads.forEach((o) -> o.start());

        //原来的写法
//        threads.forEach(new Consumer<Thread>() {
//            @Override
//            public void accept(Thread o) {
//                o.start();
//            }
//        });

        threads.forEach((o) -> {
            try {
                o.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        //原来的写法
//        threads.forEach(new Consumer<Thread>() {
//            @Override
//            public void accept(Thread thread) {
//                try {
//                    thread.join();
//                } catch (InterruptedException e) {
//                    e.printStackTrace();
//                }
//            }
//        });

        System.out.println(tVolatileAndSyn2.count);
    }
}
```

## `AtomicXXX` 类
```java
/**
 * 解决同样的问题的更高效率的方法，使用 AtomXXX 类，
 * AtomXXX 类本身方法都是原子性的，但不能保证多个方法连续调用是原子性的。
 */
public class _014_T_Atomic {

    AtomicInteger count = new AtomicInteger(0);

    /*synchronized*/ void m() {
        for (int i = 0; i < 10000; i++) {
            count.incrementAndGet();//count++;
            System.out.println(Thread.currentThread().getName() + " count:" + count);
        }
    }

    public static void main(String[] args) {
        _014_T_Atomic tAtomic = new _014_T_Atomic();

        List<Thread> threads = new ArrayList<>();

        for (int i = 0; i < 10; i++) {
            threads.add(new Thread(tAtomic::m, "thread-" + i));
        }

        threads.forEach((thread -> thread.start()));

        threads.forEach((thread -> {
            try {
                thread.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }));

        System.out.println(tAtomic.count);
    }
}
```

## `synchronized` 优化
```java
//synchronized 优化，同步代码块中是语句越少越好，m1 和 m2 的比较
public class _015_T_SynOptimize {

    int count = 0;

    synchronized void m1(){
        //do sth need not sync
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        //业务逻辑中只有下面这句话需要 sync，这时不应该给整个方法上锁
        count++;

        //do sth need not sync
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    void m2(){
        //do sth need not sync
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        //业务逻辑中只有下面这句话需要 sync，这时不应该给整个方法上锁
        //采用细颗粒的锁，可以使线程争用时间变短，从而提高效率
        synchronized (this){
            count++;
        }

        //do sth need not sync
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

## 避免将锁定对象的引用变成另外的对象
```java
//锁定对象 o，如果 o 的属性发生改变，不影响锁的使用，但是如果 o 变成另一个对象，
//则锁定的对象发生改变，应该避免将锁定对象的引用变成另外的对象。
public class _016_T_Object {

    Object o = new Object();

    void m() {
        synchronized (o) {
            while (true) {
                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName());
            }
        }
    }

    public static void main(String[] args) {
        _016_T_Object tObject = new _016_T_Object();

        //启动第一个线程
        new Thread(tObject::m, "t1").start();

        try {
            TimeUnit.SECONDS.sleep(3);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        //创建第二个线程
        Thread t2 = new Thread(tObject::m, "t2");

        tObject.o = new Object();//锁对象发生改变，所以 t2 线程得以执行，如果注释掉这就话，线程2将永远得不到执行机会

        t2.start();
    }
}
```

## 不要以字符串的常量作为锁定对象
```java
/**
 * 不要以字符串的常量作为锁定对象
 * 在下面的例子中，m1 和 m2 其实锁定的是同一个对象，这样可能造成死锁。
 * 这种情况还会发生比较诡异的现象，比如你用到一个类库，在该类库中代码锁定了字符串“Hello”，
 * 但是你读不到源码，所以你在自己的代码中锁定了“Hello”，这时候就有可能发生非常诡异的死锁阻塞，
 * 因为你的程序和你用到的类库不经意间使用了同一把锁。
 */
public class _017_T_String {

    String s1 = "Hello";
    String s2 = "Hello";

    void m1() {
        synchronized (s1) {

        }
    }

    void m2() {
        synchronized (s2) {

        }
    }
}
```

源码：https://github.com/V-Vincen/threads/tree/master/src/main/java/com/example/_exercise