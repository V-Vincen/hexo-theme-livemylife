---
title: '[ThreadPool] 2 线程池的使用练习'
catalog: true
date: 2019-12-14 13:48:46
subtitle: 线程池的使用练习
header-img: /img/threadpool/ExecutorService2.jpg
tags:
- ThreadPool
---

## `Executor`
```java
/**
 * Executor：线程池中的顶层接口
 */
public class _01_T_MyExecutor implements Executor {
    public static void main(String[] args) {
        new _01_T_MyExecutor().execute(() -> System.out.println("hello executor"));
    }

    @Override
    public void execute(Runnable command) {
        command.run();
//        new Thread(command).start();
    }
}
```

## `ExecutorService`
```java
/**
 * ExecutorService：真正的线程池接口，其继承了 Executor。
 * 提供的方法：
 *      void execute(Runnable command)：执行任务/命令，没有返回值，一般用来执行 Runnable
 *      <T> Future<T> submit(Callable<T> task)：执行任务，有返回值，一般有来执行 Callable
 *      void shutdown()：关闭连接池
 *      ...
 */
public class _02_T_ExecutorService {
}
```

## `Callable`
```java
/**
 * Callable 接口和 Runnable 接口相似，区别就是 Callable 需要实现 call 方法，而 Runnable 需要实现 run 方法；
 * 并且，call 方法还可以返回任何对象，无论是什么对象，JVM 都会当作 Object 来处理。但是如果使用了泛型，我们就不用每次都对 Object 进行转换了。
 */
public class _03_T_Callable implements Callable<Integer> {
    @Override
    public Integer call() throws Exception {
        return 1000;
    }

    public static void main(String[] args) {
        _03_T_Callable tCallable = new _03_T_Callable();

        /**
         * FutureTask
         * 1) 作为 Funture 的唯一实现类，可以得到 Callable 的返回值
         * 2) 同时实现了 Runnable 接口，可以作为 Runnable 被线程执行
         *
         */
        FutureTask<Integer> futureTask = new FutureTask<>(tCallable);

        Thread thread = new Thread(futureTask);
        thread.start();

        try {
            Integer integer = futureTask.get();
            System.out.println(integer);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }
}
```

## `Future`
```java
/**
 * Callable 接口和 Runnable 接口相似，区别就是 Callable 需要实现 call 方法，而 Runnable 需要实现 run 方法；
 * 并且，call 方法还可以返回任何对象，无论是什么对象，JVM 都会当作 Object 来处理。但是如果使用了泛型，我们就不用每次都对 Object 进行转换了。
 */
public class _03_T_Callable implements Callable<Integer> {
    @Override
    public Integer call() throws Exception {
        return 1000;
    }

    public static void main(String[] args) {
        _03_T_Callable tCallable = new _03_T_Callable();

        /**
         * FutureTask
         * 1) 作为 Funture 的唯一实现类，可以得到 Callable 的返回值
         * 2) 同时实现了 Runnable 接口，可以作为 Runnable 被线程执行
         *
         */
        FutureTask<Integer> futureTask = new FutureTask<>(tCallable);

        Thread thread = new Thread(futureTask);
        thread.start();

        try {
            Integer integer = futureTask.get();
            System.out.println(integer);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }
}
```

## `Executors`
```java
/**
 * Executors：工具类、线程池的工厂类，用于创建并返回不同类型的线程池
 *
 * Executors.newFixedThread(n)：创建一个可重用固定线程的线程池。
 * Executors.newCachedTreadPool()：创建一个可缓存的线程池，调用 execute 将重用以前构造的线程（如果线程可用）。如果没有可用的线程，则创建一个新线程并添加到池中。终止并从缓存中移除那些已有 60 秒钟未被使用的线程。
 * Executors.newSingleThreadExecutor()：创建一个只有一个线程的线程池。
 * Executors.newScheduledThreadPool(n)：创建一个线程池，它可以安排在给定延迟后运行命令或者定期地执行。
 */
public class _04_T_Executors {
}
```

## `Executor.newFixedThread(n)`
```java
/**
 * Executors.newFixedThread(n)：创建一个可重用固定线程的线程池。
 */
public class _05_T_FixedThreadPool {
    public static void main(String[] args) throws InterruptedException {
        ExecutorService service = Executors.newFixedThreadPool(5);

        for (int i = 0; i < 6; i++) {
            service.execute(() -> {
                try {
                    TimeUnit.MILLISECONDS.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName());
            });
        }

        System.out.println(service);

        service.shutdown();
        System.out.println(service.isTerminated());
        System.out.println(service.isShutdown());
        System.out.println(service);

        TimeUnit.SECONDS.sleep(5);
        System.out.println(service.isTerminated());
        System.out.println(service.isShutdown());
        System.out.println(service);
    }
}
```

**练习：**
```java
/**
 * 获取 1 到 200000 之间的所有质数，比较传统写法（不用线程池）和使用线程池之间的效率。
 */
public class _07_T_ParallelComputing {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        long start = System.currentTimeMillis();
        List<Integer> result = getPrime(1, 200000);
        long end = System.currentTimeMillis();
        System.out.println(end - start);

        final int cpuCoreNum = 4;

        ExecutorService service = Executors.newFixedThreadPool(cpuCoreNum);

        MyTask t1 = new MyTask(1, 80000);
        MyTask t2 = new MyTask(80001, 130000);
        MyTask t3 = new MyTask(130001, 170000);
        MyTask t4 = new MyTask(170001, 200000);

        Future<List<Integer>> future1 = service.submit(t1);
        Future<List<Integer>> future2 = service.submit(t2);
        Future<List<Integer>> future3 = service.submit(t3);
        Future<List<Integer>> future4 = service.submit(t4);

        start = System.currentTimeMillis();
        future1.get();
        future2.get();
        future3.get();
        future4.get();
        end = System.currentTimeMillis();
        System.out.println(end - start);

        service.shutdown();
    }

    static class MyTask implements Callable<List<Integer>> {
        int startPos, endPos;

        public MyTask(int startPos, int endPos) {
            this.startPos = startPos;
            this.endPos = endPos;
        }

        @Override
        public List<Integer> call() throws Exception {
            List<Integer> prime = getPrime(startPos, endPos);
            return prime;
        }
    }

    private static boolean isPrime(int num) {
        for (int i = 2; i < num / 2; i++) {
            if (num % i == 0) return false;
        }
        return true;
    }

    private static List<Integer> getPrime(int start, int end) {
        List<Integer> results = new ArrayList<>();
        for (int i = start; i < end; i++) {
            if (isPrime(i)) results.add(i);
        }
        return results;
    }
}
```

## `Executor.newCachedTreadPool()`
```java
/**
 * Executor.newCachedTreadPool()：创建一个可缓存的线程池，调用 execute 将重用以前构造的线程（如果线程可用）。
 * 如果没有可用的线程，则创建一个新线程并添加到池中。终止并从缓存中移除那些已有 60 秒钟未被使用的线程。
 */
public class _08_T_CachedThreadPool {
    public static void main(String[] args) throws InterruptedException {
        //自定义 CachedPool 的终止时间为 30L
//        ExecutorService service = new ThreadPoolExecutor(0, Integer.MAX_VALUE, 30L, TimeUnit.SECONDS, new SynchronousQueue<Runnable>());

        ExecutorService service = Executors.newCachedThreadPool();
        System.out.println(service);

        for (int i = 0; i < 2; i++) {
            service.execute(() -> {
                try {
                    TimeUnit.MILLISECONDS.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName());
            });
        }

        System.out.println(service);

        TimeUnit.SECONDS.sleep(70);

        System.out.println(service);
    }
}
```

## `Executors.newSingleThreadExecutor()`
```java
/**
 * Executors.newSingleThreadExecutor()：创建一个只有一个线程的线程池。
 */
public class _09_T_SingleThreadPool {
    public static void main(String[] args) {
        ExecutorService service = Executors.newSingleThreadExecutor();
        for (int i = 0; i < 5; i++) {
            final int j = i;
            service.execute(() -> {
                System.out.println(j + " " + Thread.currentThread().getName());
            });
        }

        service.shutdown();
    }
}
```

## `Executors.newScheduledThreadPool(n)`
```java
/**
 * Executors.newScheduledThreadPool(n)：创建一个线程池，它可以安排在给定延迟后运行命令或者定期地执行。
 */
public class _10_T_ScheduledThreadPool {
    public static void main(String[] args) throws InterruptedException {
        ScheduledExecutorService service = Executors.newScheduledThreadPool(4);

        /**
         * scheduleAtFixedRate(Runnable command,long initialDelay,long period,TimeUnit unit)：以固定的频率去执行任务。
         * 4个参数：
         *      Runnable command：实现 Runnable 接口
         *      long initialDelay：初始化线程启动延迟的时间
         *      long period：每隔多长时间执行任务（间隔的频率）
         *      TimeUnit unit：第三个参数的时间单位
         */
        service.scheduleAtFixedRate(() -> {
            try {
//                TimeUnit.MILLISECONDS.sleep(new Random().nextInt(1000));
                TimeUnit.MILLISECONDS.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName());
        }, 0, 500, TimeUnit.MILLISECONDS);


        TimeUnit.SECONDS.sleep(20);
        service.shutdown();
    }
}
```

## `Executors.newWorkStealingPool()`
```java
/**
 *  newWorkStealingPool（工作窃取）：适合使用在很耗时的操作，但是 newWorkStealingPool 不是 ThreadPoolExecutor 的扩展。
 * 它是新的线程池类 ForkJoinPool 的扩展（也就是说它的底层实现是 ForkJoinPool），但是都是在统一的一个 Executors 类中实现。
 * 由于能够合理的使用 CPU 进行对任务操作（并行操作），所以适合使用在很耗时的任务中。
 */
public class _11_T_WorkStealingPool {
    public static void main(String[] args) throws IOException {
        ExecutorService service = Executors.newWorkStealingPool();
        System.out.println(Runtime.getRuntime().availableProcessors());

        //daemon：守护线程
        service.execute(new R(1000));
        service.execute(new R(2000));
        service.execute(new R(2000));
        service.execute(new R(2000));
        service.execute(new R(2000));

        //由于生产的精灵线程（守护线程、后天线程），主线程不阻塞的话，看不到
        System.in.read();
    }

    static class R implements Runnable {
        int time;

        public R(int time) {
            this.time = time;
        }

        @Override
        public void run() {
            try {
                TimeUnit.MILLISECONDS.sleep(time);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(time + " " + Thread.currentThread().getName());
        }
    }
}
```

## `ForkJoinPool`
```java
public class _12_T_ForkJoinPool {
    static int[] nums = new int[1000000];
    static final int MAX_NUM = 50000;
    static Random r = new Random();

    static {
        for (int i = 0; i < nums.length; i++) {
            nums[i] = r.nextInt(100);
        }

        System.out.println(Arrays.stream(nums).sum());
    }

    //RecursiveAction 继承 ForkJoinTask，其无返回值。
    static class AddAction extends RecursiveAction {

        int start, end;

        public AddAction(int start, int end) {
            this.start = start;
            this.end = end;
        }

        @Override
        protected void compute() {
            if (end - start <= MAX_NUM) {
                long sum = 0L;
                for (int i = start; i < end; i++) {
                    sum += nums[i];
                }
                System.out.println("from:" + start + " to:" + end + " = " + sum);
            } else {
                int middle = start + (end - start) / 2;
                AddAction subAct1 = new AddAction(start, middle);
                AddAction subAct2 = new AddAction(middle, end);
                subAct1.fork();
                subAct2.fork();
            }
        }
    }

    //RecursiveTask<V> 继承 ForkJoinTask，其有返回值。
    static class AddTask extends RecursiveTask<Long> {
        int start, end;

        public AddTask(int start, int end) {
            this.start = start;
            this.end = end;
        }

        @Override
        protected Long compute() {
            if (end - start <= MAX_NUM) {
                long sum = 0L;
                for (int i = start; i < end; i++) {
                    sum += nums[i];
                }
                System.out.println("from:" + start + " to:" + end + " = " + sum);
                return sum;
            } else {
                int middle = start + (end - start) / 2;
                AddTask subTask1 = new AddTask(start, middle);
                AddTask subTask2 = new AddTask(middle, end);
                subTask1.fork();
                subTask2.fork();

                return subTask1.join() + subTask2.join();
            }
        }
    }

    public static void main(String[] args) throws IOException, ExecutionException, InterruptedException {
        ForkJoinPool fjp = new ForkJoinPool();

        /**
         * RecursiveAction 的执行方法
         */
        AddAction addAction = new AddAction(0, nums.length);
        fjp.execute(addAction);
        System.in.read();


        /**
         * RecursiveTask 的执行方法
         */
        AddTask addTask = new AddTask(0, nums.length);
//        fjp.execute(addTask);
//        Long result = addTask.join();

        Future<Long> submit = fjp.submit(addTask);
        Long result = submit.get();

        System.out.println(result);
    }
}
```