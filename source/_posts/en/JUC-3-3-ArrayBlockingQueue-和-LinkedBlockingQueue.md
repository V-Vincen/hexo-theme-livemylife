---
title: '[JUC] 3.3 ArrayBlockingQueue 和 LinkedBlockingQueue'
catalog: true
date: 2019-10-12 16:55:00
subtitle: Java 并发容器
header-img: /img/juc/juc_bg3.png
tags:
- JUC
---

## ArrayBlockingQueue
### 概述
`ArrayBlockingQueue`，顾名思义：基于数组的阻塞队列。数组是要指定长度的，所以使用 `ArrayBlockingQueue` 时必须指定长度，也就是它是一个有界阻塞队列。（有界是指他的容量大小是固定的，不能扩充容量，在初始化时就必须确定队列大小。）

它实现了 `BlockingQueue`接口，有着队列、集合以及阻塞队列的所有方法。它内部使用 `ReentrantLock` 来保证线程安全。`ArrayBlockingQueue` 支持对生产者线程和消费者线程进行公平的调度，默认情况下是不保证公平性的。公平性通常会降低吞吐量，但是减少了可变性和避免了线程饥饿问题。

### 常用操作
**取数据**
- `take()`：首选，当队列为空时阻塞。
- `poll()`：弹出队顶元素，队列为空时，返回空。
- `peek()`：和 `poll` 类似，返回队顶元素，但顶元素不弹出。队列为空时返回 `null`。
- `remove(Object o)`：移除某个元素，队列为空时抛出异常。成功移除返回 `true`。

**添加数据**
- `put()`：首选，队满时阻塞。
- `add()`：插入元素到队尾，插入成功返回 `true`，没有可用空间抛出异常 `IllegalStateException`。
- `offer()`：队满时返回 `false`。（插入元素到队尾，插入成功返回 `true`，否则返回 `false`。）

### 总结
`ArrayBlockingQueue` 是一个阻塞队列，内部由 `ReentrantLock` 来实现线程安全，由 `Condition` 的 `await` 和 `signal` 来实现等待唤醒的功能。它的数据结构是数组，准确的说是一个循环数组（可以类比一个圆环），所有的下标在到达最大长度时自动从 0 继续开始。


### 案例：
```java
/**
 * ArrayBlockingQueue：是一个底层用数组（准确的说是一个循环数组（可以类比一个圆环），所有的下标在到达最大长度时自动从0继续开始。）实现的有界阻塞队列，有界是指他的容量大小是固定的，不能扩充容量，在初始化时就必须确定队列大小。
 *                    它通过可重入的独占锁 ReentrantLock 来控制并发，Condition 来实现阻塞。
 * 其主要的方法为：
 * 1.取数据：
 *      take()：首选，当队列为空时阻塞。
 *      poll()：弹出队顶元素，队列为空时，返回空。
 *      peek()：和 poll 类似，返回队顶元素，但顶元素不弹出。队列为空时返回 null。
 *      remove(Object o)：移除某个元素，队列为空时抛出异常。成功移除返回 true。
 * 2.添加数据：
 *      put()：首选，队满时阻塞。
 *      add()：插入元素到队尾，插入成功返回 true，没有可用空间抛出异常 IllegalStateException。
 *      offer()：队满时返回 false。（插入元素到队尾，插入成功返回 true，否则返回 false。）
 */
public class _06_T_ArrayBlockingQueue {

    static BlockingQueue<String> aBQ = new ArrayBlockingQueue<>(10);

    static Random r = new Random();

    public static void main(String[] args) throws InterruptedException {
        for (int i = 0; i < 10; i++) {
            aBQ.put("a" + i);
        }

        //满了时，会阻塞
        aBQ.put("aaa");

        //add(E e)：插入元素到队尾，插入成功返回 true，没有可用空间抛出异常 IllegalStateException。
//        aBQ.add("aaa");

        //offer(E e)：插入元素到队尾，插入成功返回 true，否则返回 false。
//        boolean offer = aBQ.offer("aaa");
//        aBQ.offer("aaa",1, TimeUnit.SECONDS);

        System.out.println(aBQ);
    }
}
```

## LinkedBlockingQueue
### 概述
`LinkedBlockingQueue` 内部由单链表实现，只能从 `head` 取元素，从 `tail` 添加元素。添加元素和获取元素都有独立的锁，也就是说 `LinkedBlockingQueue` 是读写分离的，读写操作可以并行执行。`LinkedBlockingQueue` 采用可重入锁（`ReentrantLock`）来保证在并发情况下的线程安全。

### 构造器
`LinkedBlockingQueue` 一共有三个构造器，分别是无参构造器、可以指定容量的构造器、可以穿入一个容器的构造器。如果在创建实例的时候调用的是无参构造器，`LinkedBlockingQueue` 的默认容量是 `Integer.MAX_VALUE`，这样做很可能会导致队列还没有满，但是内存却已经满了的情况（内存溢出）。
```java
//设置容量为 Integer.MAX
public LinkedBlockingQueue()；   

//设置指定容量
public LinkedBlockingQueue(int capacity)；  

//穿入一个容器，如果调用该构造器，容量默认也是 Integer.MAX_VALUE
public LinkedBlockingQueue(Collection<? extends E> c)；  
```

### 常用操作
**取数据**
- `take()`：首选，当队列为空时阻塞。
- `poll()`：弹出队顶元素，队列为空时，返回空。
- `peek()`：和 `poll` 类似，返回队顶元素，但顶元素不弹出。队列为空时返回 `null`。
- `remove(Object o)`：移除某个元素，队列为空时抛出异常。成功移除返回 `true`。

**添加数据**
- `put()`：首选，队满时阻塞。
- `add()`：插入元素到队尾，插入成功返回 `true`，没有可用空间抛出异常 `IllegalStateException`。
- `offer()`：队满时返回 `false`。（插入元素到队尾，插入成功返回 `true`，否则返回 `false`。）

**判断队列是否为空**
- `size()` 方法会遍历整个队列，时间复杂度为 O(n)，所以最好选用 `isEmtpy()`。

### 总结
`LinkedBlockingQueue` 是一个阻塞队列，内部由两个 `ReentrantLock` 来实现出入队列的线程安全，由各自的 `Condition` 对象的 `await` 和 `signal` 来实现等待和唤醒功能。它和 `ArrayBlockingQueue` 的不同点在于：

- 队列大小有所不同，`ArrayBlockingQueue` 是有界的初始化必须指定大小，而 `LinkedBlockingQueue` 可以是有界的也可以是无界的（`Integer.MAX_VALUE`），对于后者而言，当添加速度大于移除速度时，在无界的情况下，可能会造成内存溢出等问题。

- 数据存储容器不同，`ArrayBlockingQueue` 采用的是数组作为数据存储容器，而 `LinkedBlockingQueue` 采用的则是以 `Node` 节点作为连接对象的链表。

- 由于 `ArrayBlockingQueue` 采用的是数组的存储容器，因此在插入或删除元素时不会产生或销毁任何额外的对象实例，而 `LinkedBlockingQueue` 则会生成一个额外的 `Node` 对象。这可能在长时间内需要高效并发地处理大批量数据的时，对于 `GC` 可能存在较大影响。

- 两者的实现队列添加或移除的锁不一样，`ArrayBlockingQueue` 实现的队列中的锁是没有分离的，即添加操作和移除操作采用的同一个 `ReenterLock` 锁，而 `LinkedBlockingQueue` 实现的队列中的锁是分离的，其添加采用的是 `putLock`，移除采用的则是 `takeLock`，这样能大大提高队列的吞吐量，也意味着在高并发的情况下生产者和消费者可以并行地操作队列中的数据，以此来提高整个队列的并发性能。


### 案例：
```java
/**
 * 下面的程序是 Java 提供的生产者、消费者模式的阻塞式的一种实现。
 * LinkedBlockingQueue：是一个底层用单向链表实现，可以是有界的也可以是无界的（Integer.MAX_VALUE）阻塞队列，
 *                     采用 ReentrantLock 来控制并发，添加采用的是 putLock，移除采用的则是 takeLock，使用两个独占锁来控制消费和生产。
 * 其主要的方法为：
 * 1.取数据：
 *      take()：首选，当队列为空时阻塞。
 *      poll()：弹出队顶元素，队列为空时，返回空。
 *      peek()：和 poll 类似，返回队顶元素，但顶元素不弹出。队列为空时返回 null。
 *      remove(Object o)：移除某个元素，队列为空时抛出异常。成功移除返回 true。
 * 2.添加数据：
 *      put()：首选，队满时阻塞。
 *      add()：插入元素到队尾，插入成功返回 true，没有可用空间抛出异常 IllegalStateException。
 *      offer()：队满时返回 false。（插入元素到队尾，插入成功返回 true，否则返回 false。）
 *
 * 3.判断队列是否为空：size() 方法会遍历整个队列，时间复杂度为 O(n)，所以最好选用 isEmtpy()。
 */
public class _05_T_LinkedBlockingQueue {

    static BlockingQueue<String> lBQ = new LinkedBlockingQueue<>();

    static Random r = new Random();

    public static void main(String[] args) {
        new Thread(() -> {
            for (int i = 0; i < 100; i++) {
                try {
                    //put()：首选，队满时阻塞。
                    lBQ.put("a" + i);
                    TimeUnit.MILLISECONDS.sleep(r.nextInt(1000));
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "p1").start();

        for (int i = 0; i < 5; i++) {
            new Thread(() -> {
                for (; ; ) {//是循环，for(;;) 指令少，不占用寄存器，而且没有判断跳转，比 while(xx) 好。
                    try {
                        System.out.println(Thread.currentThread().getName() + " take -" + lBQ.take());
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }, "c" + i).start();
        }
    }
}
```