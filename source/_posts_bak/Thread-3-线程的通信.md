---
title: '[Thread] 3 线程的通信'
catalog: true
date: 2019-09-07 01:18:45
subtitle: 线程的通信
header-img: /img/thread/thread_bg.png
tags:
- Thread
---

## 假设一个场景
需求：使用两个线程打印 1-100。线程1、线程2交替打印。

### 涉及到三个方法
- `wait()`：一旦执行此方法，当前线程就进入阻塞状态，并释放同步监视器。
- `notify()`：一旦执行此方法，就会唤醒被 `wait()` 的一个线程。如果有多个线程被 `wait()`，就唤醒优先级高的那个。
- `notifyAll()`：一旦执行此方法，就会唤醒所以被 `wait()` 的线程。

```java
public class WaitNotify {
    public static void main(String[] args) {
        Number n = new Number();

        Thread t1 = new Thread(n);
        Thread t2 = new Thread(n);

        t1.setName("线程1");
        t2.setName("线程2");

        t1.start();
        t2.start();
    }
}

class Number implements Runnable {

    private int number = 1;

    Object obj = new Object();

    @Override
    public void run() {
        while (true) {
            synchronized (obj) {

                //线程唤醒
                obj.notify();

                if (number <= 100) {

                    try {
                        Thread.sleep(10);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }

                    System.out.println(Thread.currentThread().getName() + ":" + number);
                    number++;

                    try {
                        //线程等待
                        obj.wait();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                } else {
                    break;
                }
            }
        }
    }
}
```
**说明：**
- `wait()`、`notify()`、`notifyAll()` 这三个方法必须使用在同步代码块或同步方法中。
- `wait()`、`notify()`、`notifyAll()` 这三个方法的调用者必须是同步代码块或同步方法中的同步监视器，否则会出现 `IllegalMonitorStateException` 异常。
- `wait()`、`notify()`、`notifyAll()` 这三个方法是定义在 `java.lang.Object` 类中的。

## `sleep()` 和 `wait()` 的异同
**相同点：**一旦执行方法，都可以使用当前的线程进入阻塞状态。

**不同点：**
- 两个方法声明的位置不同：`Thread` 类中声明 `sleep()`，`Object` 类中声明 `wait()`。
- 调用的要求不同：`sleep()` 可以在任何需要的场景下调用。`wait()` 必须使用在同步代码块或同步方法中调用。
- 关于同步监视器：如果两个方法都使用在同步代码块或同步方法中，`sleep()` 不会释放锁，`wait()` 会释放锁。
- `sleep()` 方法需要抛异常，`wait()`方法不需要。


## 线程通讯的应用
经典案例：生产者/消费者

场景：生产者（Productor）将产品交给店员（Clerk）,而消费者（Customer）从店员外取走产品，店员一次只能持有固定数量的产品（比如：20），如果生产者试图生成更多的产品，店员会叫生产者听一下，如果店中有空位放产品了再通知生产者继续生成；如果店中没有产品了，店员会告诉消费者等一下，如果店中有产品了再通知消费者来取走产品。

### 解答
```java
public class P_C_Thread {
     public static void main(String[] args) {
         Clerk clerk = new Clerk();

         Producer producer = new Producer(clerk);
         producer.setName("生产者1");

         Consumer consumer = new Consumer(clerk);
         consumer.setName("消费者1");

         producer.start();
         consumer.start();
     }
}


//资源
class Clerk {

    private int productCount = 0;

    //生成产品
    public synchronized void produceProduct() {
        if (productCount < 20) {
            productCount++;
            System.out.println(Thread.currentThread().getName() + "：开始生产第 " + productCount + " 个产品");

            //唤醒
            notify();
        } else {
            //等待
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    //消费产品
    public synchronized void consumeProduct() {
        if (productCount > 0) {
            System.out.println(Thread.currentThread().getName() + "：开始消费第 " + productCount + " 个产品");
            productCount--;

            //唤醒
            notify();
        } else {
            //等待
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}


//生成者
class Producer extends Thread {

    private Clerk clerk;

    public Producer(Clerk clerk) {
        this.clerk = clerk;
    }

    @Override
    public void run() {
        System.out.println(getName() + "：开始生成产品......");

        while (true) {

            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            clerk.produceProduct();
        }
    }
}


//消费者
class Consumer extends Thread {

    private Clerk clerk;

    public Consumer(Clerk clerk) {
        this.clerk = clerk;
    }

    @Override
    public void run() {
        System.out.println(getName() + "：开始消费产品......");

        while (true) {

            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            clerk.consumeProduct();
        }
    }
}
```

案例源码：https://github.com/V-Vincen/threads