---
title: '[JDK8] 8 ParallelStream'
catalog: true
date: 2021-01-12 19:17:09
subtitle: ParallelStream...
header-img: /img/header_img/categories_bg7.jpg
tags:
- JDK8
---

## 前言
在 Java7 之前，如果想要并行处理一个集合，我们需要以下几步
- 手动分成几部分
- 为每部分创建线程
- 在适当的时候合并

并且还需要关注多个线程之间共享变量的修改问题。而 Java8 为我们提供了并行流，可以一键开启并行模式。是不是很酷呢？让我们来看看吧。

## 认识和开启并行流
**什么是并行流**： 并行流就是将一个流的内容分成多个数据块，并用不同的线程分别处理每个不同数据块的流。

例如有这么一个需求：有一个 List 集合，而 list 中每个 apple 对象只有重量，我们也知道 apple 的单价是 5元/kg，现在需要计算出每个 apple 的单价。

传统的方式是这样：
```java
List<Apple> appleList = new ArrayList<>(); // 假装数据是从库里查出来的
for (Apple apple : appleList) {
    apple.setPrice(5.0 * apple.getWeight() / 1000);
}
```

我们通过迭代器遍历 list 中的 apple 对象，完成了每个 apple 价格的计算。而这个算法的时间复杂度是 O(list.size()) 随着 list 大小的增加，耗时也会跟着线性增加。并行流可以大大缩短这个时间。并行流处理该集合的方法如下：
```java
appleList.parallelStream().forEach(apple -> apple.setPrice(5.0 * apple.getWeight() / 1000));
```

和普通流的区别是这里调用的 `parallelStream()` 方法。当然也可以通过 `stream.parallel()` 将普通流转换成并行流。并行流也能通过 `sequential()` 方法转换为顺序流。

**但要注意**：流的并行和顺序转换不会对流本身做任何实际的变化，仅仅是打了个标记而已。并且在一条流水线上对流进行多次并行、顺序的转换，生效的是最后一次的方法调用。

**并行流如此方便，它的线程从那里来呢？有多少个？怎么配置呢？**

并行流内部使用了默认的 `ForkJoinPool` 线程池。默认的线程数量就是处理器的核心数，而配置系统核心属性：`java.util.concurrent.ForkJoinPool.common.parallelism` 可以改变线程池大小。不过该值是全局变量。改变他会影响所有并行流。目前还无法为每个流配置专属的线程数。一般来说采用处理器核心数是不错的选择。


## 测试并行流的性能
为了更容易的测试性能，我们在每次计算完苹果价格后，让线程睡 1s，表示在这期间执行了其他 IO 相关的操作，并输出程序执行耗时，顺序执行的耗时：
```xml
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
</dependency>

<!-- lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.12</version>
</dependency>

<!-- guava -->
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>28.2-jre</version>
</dependency>

<!-- commons-collections4 -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-collections4</artifactId>
    <version>4.4</version>
</dependency>

<!-- vavr -->
<dependency>
    <groupId>io.vavr</groupId>
    <artifactId>vavr</artifactId>
    <version>0.10.2</version>
</dependency>

<!-- commons-lang3 -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.9</version>
</dependency>

<!-- fastjson -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.68</version>
</dependency>

<!-- slf4j-api -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.30</version>
</dependency>

<!-- logback-classic -->
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.3</version>
</dependency>
```

```java
/**
 * @author vincent
 */
@Slf4j
public class LambdaTest2 {
    @Data
    private static class Apple {
        private Integer weight;
        private Double price;

        public Apple(Integer weight) {
            this.weight = weight;
        }
    }

    public List<Apple> initAppleList() {
        return Lists.newArrayList(
                new Apple(98),
                new Apple(88),
                new Apple(77)
        );
    }

    @Test
    public void streamTest() throws InterruptedException {
        List<Apple> appleList = initAppleList();
        Date begin = new Date();
        for (Apple apple : appleList) {
            apple.setPrice(5.0 * apple.getWeight() / 1000);
            Thread.sleep(1000);
        }
        Date end = new Date();
        log.info("苹果数量：{}个, 耗时：{}s", appleList.size(), (end.getTime() - begin.getTime()) / 1000);
        //14:56:26.666 [main] INFO com.example.jdk_18.lambda_exercise.LambdaTest2 - 苹果数量：3个, 耗时：3s
    }
}
```

并行版本：

```java
    @Test
    public void parallelStreamTest() {
        List<Apple> appleList = initAppleList();
        Date begin = new Date();
        appleList.parallelStream().forEach(
                CheckedConsumer.<Apple>of(apple -> {
                    apple.setPrice(5.0 * apple.getWeight() / 1000);
                    Thread.sleep(1000);
                }).unchecked()
        );
        Date end = new Date();
        log.info("苹果数量：{}个, 耗时：{}s", appleList.size(), (end.getTime() - begin.getTime()) / 1000);
        //14:56:45.434 [main] INFO com.example.jdk_18.lambda_exercise.LambdaTest2 - 苹果数量：3个, 耗时：1s
    }
```

耗时情况：
```
14:56:26.666 [main] INFO com.example.jdk_18.lambda_exercise.LambdaTest2 - 苹果数量：3个, 耗时：3s

14:56:45.434 [main] INFO com.example.jdk_18.lambda_exercise.LambdaTest2 - 苹果数量：3个, 耗时：1s
```
跟我们的预测一致，我的电脑是四核 I5 处理器，开启并行后四个处理器每人执行一个线程，最后 1s 完成了任务！

## 并行流可以随便用吗？
### 可拆分性影响流的速度
通过上面的测试，有的人会轻易得到一个结论：并行流很快，我们可以完全放弃 foreach、fori、iter 外部迭代，使用 Stream 提供的内部迭代来实现了。

事实真的是这样吗？并行流真的如此完美吗？答案当然是否定的。大家可以复制下面的代码，在自己的电脑上测试。测试完后可以发现，并行流并不总是最快的处理方式。

- 对于 iterate 方法来处理的前 n 个数字来说，不管并行与否，它总是慢于循环的，非并行版本可以理解为流化操作没有循环，其更偏向底层导致的慢。 可并行版本是为什么慢呢？这里有两个需要注意的点：
    - iterate 生成的是装箱的对象，必须拆箱成数字才能求和。
    - 我们很难把 iterate 分成多个独立的块来并行执行。

这个问题很有意思，我们必须意识到某些流操作比其他操作更容易并行化。对于 iterate 来说，每次应用这个函数都要依赖于前一次应用的结果。因此在这种情况下，我们不仅不能有效的将流划分成小块处理。反而还因为并行化再次增加了开支。


- 而对于 `LongStream.rangeClosed()` 方法来说，就不存在 iterate 的第两个痛点了。 它生成的是基本类型的值，不用拆装箱操作，另外它可以直接将要生成的数字 1 - n 拆分成 1 - n/4， 1n/4 - 2n/4， ... 3n/4 - n 这样四部分。因此并行状态下的 `rangeClosed()` 是快于 for 循环外部迭代的。
    
案例如下：
```java
/**
 * @author vincent
 */
public class ParallelStreams {
    public static long iterativeSum(long n) {
        long result = 0;
        for (long i = 0; i <= n; i++) {
            result += i;
        }
        return result;
    }

    public static long sequentialSum(long n) {
        return Stream.iterate(1L, i -> i + 1).limit(n).reduce(Long::sum).get();
    }

    public static long parallelSum(long n) {
        return Stream.iterate(1L, i -> i + 1).limit(n).parallel().reduce(Long::sum).get();
    }

    public static long rangedSum(long n) {
        return LongStream.rangeClosed(1, n).reduce(Long::sum).getAsLong();
    }

    public static long parallelRangedSum(long n) {
        return LongStream.rangeClosed(1, n).parallel().reduce(Long::sum).getAsLong();
    }
}
```

```java
/**
 * @author vincent
 */
public class ParallelStreamsHarness {
    @Test
    public void parallelStreamsTest() {
        System.out.println("Iterative Sum done in: " + measurePerf(ParallelStreams::iterativeSum, 10_000_000L) + " msecs");
        System.out.println("Sequential Sum done in: " + measurePerf(ParallelStreams::sequentialSum, 10_000_000L) + " msecs");
        System.out.println("Parallel forkJoinSum done in: " + measurePerf(ParallelStreams::parallelSum, 10_000_000L) + " msecs");
        System.out.println("Range forkJoinSum done in: " + measurePerf(ParallelStreams::rangedSum, 10_000_000L) + " msecs");
        System.out.println("Parallel range forkJoinSum done in: " + measurePerf(ParallelStreams::parallelRangedSum, 10_000_000L) + " msecs");
    }

    public static <T, R> long measurePerf(Function<T, R> f, T input) {
        long fastest = Long.MAX_VALUE;
        for (int i = 0; i < 10; i++) {
            long start = System.nanoTime();
            R result = f.apply(input);
            long duration = (System.nanoTime() - start) / 1_000_000;
            System.out.println("Result: " + result);
            if (duration < fastest) fastest = duration;
        }
        return fastest;
    }
}
```
    
运行结果如下：
```java
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Iterative Sum done in: 2 msecs
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Sequential Sum done in: 117 msecs
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Parallel forkJoinSum done in: 66 msecs
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Range forkJoinSum done in: 11 msecs
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Parallel range forkJoinSum done in: 1 msecs  
```

### 共享变量修改的问题
并行流虽然轻易的实现了多线程，但是仍未解决多线程中共享变量的修改问题。下面代码中存在共享变量 total，分别使用顺序流和并行流计算前n个自然数的和。

案例如下：
```java
/**
 * @author vincent
 */
public class ParallelStreams {
    public static long sideEffectSum(long n) {
        Accumulator accumulator = new Accumulator();
        LongStream.rangeClosed(1, n).forEach(accumulator::add);
        return accumulator.total;
    }

    public static long sideEffectParallelSum(long n) {
        Accumulator accumulator = new Accumulator();
        LongStream.rangeClosed(1, n).parallel().forEach(accumulator::add);
        return accumulator.total;
    }

    public static class Accumulator {
        private long total = 0;

        public void add(long value) {
            total += value;
        }
    }
}
```

```java
/**
 * @author vincent
 */
public class ParallelStreamsHarness {
    @Test
    public void sideEffectSumTest() {
        System.out.println("Accumulator total done in: " + measurePerf(ParallelStreams::sideEffectSum, 10_000_000L) + " msecs");
        System.out.println("Parallel Accumulator total done in: " + measurePerf(ParallelStreams::sideEffectParallelSum, 10_000_000L) + " msecs");
    }

    public static <T, R> long measurePerf(Function<T, R> f, T input) {
        long fastest = Long.MAX_VALUE;
        for (int i = 0; i < 10; i++) {
            long start = System.nanoTime();
            R result = f.apply(input);
            long duration = (System.nanoTime() - start) / 1_000_000;
            System.out.println("Result: " + result);
            if (duration < fastest) fastest = duration;
        }
        return fastest;
    }
}
```

运行结果如下：
```java
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Result: 50000005000000
Accumulator total done in: 3 msecs
Result: 11695953584942
Result: 5394799726282
Result: 5846259035620
Result: 3802950419445
Result: 5266984217391
Result: 3537132159524
Result: 3929992403038
Result: 1925471324552
Result: 3275463236811
Result: 3878563230141
Parallel Accumulator total done in: 0 msecs
```

顺序执行每次输出的结果都是：50000005000000，而并行执行的结果却五花八门了。这是因为每次访问 totle 都会存在数据竞争，关于数据竞争的原因，大家可以看看关于 volatile 的博客。因此当代码中存在修改共享变量的操作时，是不建议使用并行流的。

### 并行流的使用注意
在并行流的使用上有下面几点需要注意：

- **尽量使用 `LongStream、IntStream、DoubleStream` 等原始数据流代替 Stream 来处理数字，以避免频繁拆装箱带来的额外开销。**

- **要考虑流的操作流水线的总计算成本** ，假设 N 是要操作的任务总数，Q 是每次操作的时间。N * Q 就是操作的总时间，Q 值越大就意味着使用并行流带来收益的可能性越大。

> 例如：前端传来几种类型的资源，需要存储到数据库。每种资源对应不同的表。我们可以视作类型数为 N，存储数据库的网络耗时 + 插入操作耗时为 Q。一般情况下网络耗时都是比较大的。因此该操作就比较适合并行处理。当然当类型数目大于核心数时，该操作的性能提升就会打一定的折扣了。更好的优化方法在日后的博客会为大家奉上。

- 对于较少的数据量，不建议使用并行流。
- 容易拆分成块的流数据，建议使用并行流。
    
以下是一些常见的集合框架对应流的可拆分性能表

| **源**           | **可拆分性** |
| ---------------- |------------|
| ArrayList        | 极佳        |
| LinkedList       | 差         |
| IntStream.range  | 极佳       |
| Stream.iterate   | 差         |
| HashSet          | 好         |
| TreeSet          | 好         |

案例源码：https://github.com/V-Vincen/jdk_18/tree/master/src/main/java/com/example/jdk_18/lambda_exercise2

参考：https://mp.weixin.qq.com/s/CsHkAlPiOyasZzRnBIBHDg











