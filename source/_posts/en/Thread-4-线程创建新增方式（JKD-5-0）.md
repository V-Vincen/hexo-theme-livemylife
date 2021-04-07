---
title: '[Thread] 4 线程创建新增方式（JKD 5.0）'
catalog: true
date: 2019-09-09 13:38:22
subtitle: JKD 5.0 线程创建新增方式
header-img: /img/thread/thread_bg.png
tags:
- Thread
---

## 新增方式一：实现 `Callable` 接口

### 与使用 `Runnable` 相比，`Callable` 功能更强大些
- 相比 `run()` 方法，可以有返回值
- 方法可以抛出异常
- 支持泛型的返回值
- 需要借助 `FutureTask` 类，比如获取返回结果

### `Future` 接口
- 可以对具体 `Runnable`、`Callable` 任务的执行结果进行取消、查询是否完成、获取结果等。
- `FutureTask` 是 `Future` 的唯一的实现类
- `FutureTask` 同时实现了 `Runnable`、`Future` 接口。它既可以作为 `Runnable` 被线程执行，又可以作为 `Funture` 得到 `Callable` 的返回值。

### 创建的步骤
1. 创建一个实现 `Callable` 接口的实现类。
2. 实现 `call` 方法（重写 `Callable` 接口的 `call()` 方法），将此线程需要执行的操作声明在 `call()` 方法中。
3. 创建 `Callable` 接口实现类的对象
4.将 `Callable` 接口的实现类的对象作为参数，传递到 `FutureTask` 构造器中，创建 `FutureTask` 的对象。
5. 将 `FutureTask` 的对象作为参数，传递到 `Thread` 类的构造器中，创建 `Thread` 对象，并调用 `start()` 方法。
6. 获取 `Callable` 接口实现类中的 `call()` 方法的返回值。

### 案例
```java
public class CallableDemo {
    public static void main(String[] args) {
        MyCallable myCallable = new MyCallable();

        /**
         * FutureTask
         * 1) 作为 Funture 的唯一实现类，可以得到 Callable 的返回值
         * 2) 同时实现了 Runnable 接口，可以作为 Runnable 被线程执行
         *
         */
        FutureTask futureTask = new FutureTask(myCallable);

        Thread thread = new Thread(futureTask);
        thread.start();

        try {

            //get() 返回值即为 FutrueTask 构造参数 Callable 实现类重写的 call() 的返回值
            Object sum = futureTask.get();
            System.out.println("总和为：" + sum);

        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }
}

class MyCallable implements Callable {

    @Override
    public Object call() throws Exception {
        int sum = 0;
        for (int i = 1; i < 101; i++) {
            if (i % 2 == 0) {
                System.out.println(i);
                sum += i;
            }
        }
        return sum;
    }
}
```

## 新增方式二：使用线程池

**背景：** 经常创建和销毁、使用量特别大的资源，比如并发情况下的线程，对性能影响很大。

**思路：** 提前创建好多个线程，放入线程池中，使用时直接获取，使用完放回池中。可以避免频繁创建销毁、实现重复利用。类似生活中的公共交通工具。

**好处：**
- 提高响应速度（减少了创建新线程的时间）
- 降低资源消耗（重复利用线程池中线程，不需要每次都创建）
- 便于线程管理
  - `corePoolSize`：核心池的大小
  - `maximumPoolSize`：最大线程数
  - `keepAliveTime`：线程没有任务时最多保持多长时间后会终止
  - ...
  
### 线程池相关 API
JDK 5.0 起提供了线程相关的 API：`ExecutorService` 和 `Executors`

**`ExecutorService`：真正的线程池接口。常见子类 `ThreadPoolExecutor`**
- `void execute(Runnable command)`：执行任务/命令，没有返回值，一般用来执行 `Runnable`
- `<T> Future<T> submit(Callable<T> task)`：执行任务，有返回值，一般有来执行 `Callable`
- `void shutdown()`：关闭连接池

**Executors：工具类、线程池的工厂类，用于创建并返回不同类型的线程池**
- `Executors.newCachedTreadPool()`：创建一个可缓存的线程池，调用 `execute` 将重用以前构造的线程（如果线程可用）。如果没有可用的线程，则创建一个新线程并添加到池中。终止并从缓存中移除那些已有 60 秒钟未被使用的线程。
- `Executors.newFixedThread(n)`：创建一个可重用固定线程的线程池。
- `Executors.newSingleThreadExecutor()`：创建一个只有一个线程的线程池。
-`Executors.newScheduledThreadPool(n)`：创建一个线程池，它可以安排在给定延迟后运行命令或者定期地执行。

### 案例
```java
public class ThreadPool {
    public static void main(String[] args) {
        ExecutorService executorService = Executors.newFixedThreadPool(2);

        //创建线程池的初始化参数
//        ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor) executorService;
//        threadPoolExecutor.setCorePoolSize();
//        threadPoolExecutor.setMaximumPoolSize();
//        threadPoolExecutor.setKeepAliveTime();


        //适用于 Runnable
        executorService.execute(new MyThreadPool());

        //适用于 Callable
        Future submit = executorService.submit(new MyThreadPool2());

        try {
            int sum = (int) submit.get();
            System.out.println(sum);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

        executorService.shutdown();
    }
}

class MyThreadPool implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i < 101; i++) {
            if (i % 2 == 0) {
                System.out.println(Thread.currentThread().getName() + ":" + i);
            }
        }
    }

}

class MyThreadPool2 implements Callable {
    int sum = 0;

    @Override
    public Object call() {
        for (int i = 0; i < 101; i++) {
            if (i % 2 != 0) {
                System.out.println(Thread.currentThread().getName() + ":" + i);
                sum += i;
            }
        }
        return sum;
    }
}
```

案例源码：https://github.com/V-Vincen/threads