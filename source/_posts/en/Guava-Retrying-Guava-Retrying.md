---
title: '[Guava Retrying] Guava Retrying'
catalog: true
date: 2020-04-30 16:18:54
subtitle: This is a small extension to Google's Guava library to allow for the creation of configurable retrying strategies for an arbitrary function call...
header-img:  /img/guava/guava_bg.png
tags:
- Guava Retrying
---

上章节我们学习了 `Spring Retry` 的重试机制，本章将学习另一种重试机制 `Guava Retrying`。
在学习前，我们先来回顾下重试的使用场景。

## 重试的使用场景
在很多业务场景中，为了排除系统中的各种不稳定因素，以及逻辑上的错误，并最大概率保证获得预期的结果，重试机制都是必不可少的。尤其是调用远程服务，在高并发场景下，很可能因为服务器响应延迟或者网络原因，造成我们得不到想要的结果，或者根本得不到响应。这个时候，一个优雅的重试调用机制，可以让我们更大概率保证得到预期的响应。

![1](1.png)

通常情况下，我们会通过**定时任务**进行重试。例如某次操作失败，则记录下来，当定时任务再次启动，则将数据放到定时任务的方法中，重新跑一遍。最终直至得到想要的结果为止。无论是基于定时任务的重试机制，还是我们自己写的简单的重试器，缺点都是重试的机制太单一，而且实现起来不优雅。那么问题来了如何优雅地设计重试实现？

一个完备的重试实现，要很好地解决如下问题：
- 什么条件下重试
- 什么条件下停止
- 如何停止重试
- 停止重试等待多久
- 如何等待
- 请求时间限制
- 如何结束
- 如何监听整个重试过程

并且，为了更好地封装性，重试的实现一般分为两步：

- 使用工厂模式构造重试器
- 执行重试方法并得到结果

一个完整的重试流程可以简单示意为：

![2](2.png)

接下来就让我们看看 `guava-retrying` 是怎么实现的重试机制的。

## 基础用法

`guava-retrying` 是基于谷歌的核心类库 `guava` 的重试机制实现，可以说是一个重试利器。下面就快速看一下它的用法。

### `pom.xml`
```xml
<!-- guava-retrying -->
<dependency>
    <groupId>com.github.rholder</groupId>
    <artifactId>guava-retrying</artifactId>
    <version>2.0.0</version>
</dependency>
```
需要注意的是，此版本依赖的是 27.0.1 版本的 `guava`。如果你项目中的 `guava` 低几个版本没问题，但是低太多就不兼容了。这个时候你需要升级你项目的`guava`版本，或者直接去掉你自己的
`guava` 依赖，使用 `guava-retrying` 传递过来的 `guava` 依赖。


### 实现 `Callable`
```java
Callable<Boolean> callable = new Callable<Boolean>() {
    public Boolean call() throws Exception {
        return true; // do something useful here
    }
};
```
`Callable` 的 `call` 方法中是你自己实际的业务调用。

### 通过 `RetryerBuilder` 构造 `Retryer`
```java
Retryer<Boolean> retryer = RetryerBuilder.<Boolean>newBuilder()
        .retryIfResult(Predicates.<Boolean>isNull())
        .retryIfExceptionOfType(IOException.class)
        .retryIfRuntimeException()
        .withStopStrategy(StopStrategies.stopAfterAttempt(3))
        .build();
```

### 使用重试器执行你的业务
```java
retryer.call(callable);
```

**eg：**
```java
public Boolean test() throws Exception {
    //定义重试机制
    Retryer<Boolean> retryer = RetryerBuilder.<Boolean>newBuilder()
            //retryIf 重试条件
            .retryIfException()
            .retryIfRuntimeException()
            .retryIfExceptionOfType(Exception.class)
            .retryIfException(Predicates.equalTo(new Exception()))
            .retryIfResult(Predicates.equalTo(false))

            //等待策略：每次请求间隔1s
            .withWaitStrategy(WaitStrategies.fixedWait(1, TimeUnit.SECONDS))

            //停止策略 : 尝试请求6次
            .withStopStrategy(StopStrategies.stopAfterAttempt(6))

            //时间限制 : 某次请求不得超过2s , 类似: TimeLimiter timeLimiter = new SimpleTimeLimiter();
            .withAttemptTimeLimiter(AttemptTimeLimiters.fixedTimeLimit(2, TimeUnit.SECONDS))

            .build();

    //定义请求实现
    Callable<Boolean> callable = new Callable<Boolean>() {
        int times = 1;

        @Override
        public Boolean call() throws Exception {
            log.info("call times={}", times);
            times++;

            if (times == 2) {
                throw new NullPointerException();
            } else if (times == 3) {
                throw new Exception();
            } else if (times == 4) {
                throw new RuntimeException();
            } else if (times == 5) {
                return false;
            } else {
                return true;
            }

        }
    };
    //利用重试器调用请求
   return  retryer.call(callable);
}
```

## 实现原理
`guava-retrying` 的核心是 `Attempt` 类、`Retryer` 类以及一些 `Strategy(策略)` 相关的类。

### `Attempt` 
`Attempt` 既是一次重试请求（call），也是请求的结果，并记录了当前请求的次数、是否包含异常和请求的返回值。

```java
/**
 * An attempt of a call, which resulted either in a result returned by the call,
 * or in a Throwable thrown by the call.
 *
 * @param <V> The type returned by the wrapped callable.
 * @author JB
 */
public interface Attempt<V>
```

### `Retryer`
`Retryer` 通过 `RetryerBuilder` 这个工厂类进行构造。`RetryerBuilder` 负责将定义的重试策略赋值到 `Retryer` 对象中。在 `Retryer` 执行 `call` 方法的时候，会将这些重试策略一一使用。下面就看一下Retryer的call方法的具体实现。

```java
/**
    * Executes the given callable. If the rejection predicate
    * accepts the attempt, the stop strategy is used to decide if a new attempt
    * must be made. Then the wait strategy is used to decide how much time to sleep
    * and a new attempt is made.
    *
    * @param callable the callable task to be executed
    * @return the computed result of the given callable
    * @throws ExecutionException if the given callable throws an exception, and the
    *                            rejection predicate considers the attempt as successful. The original exception
    *                            is wrapped into an ExecutionException.
    * @throws RetryException     if all the attempts failed before the stop strategy decided
    *                            to abort, or the thread was interrupted. Note that if the thread is interrupted,
    *                            this exception is thrown and the thread's interrupt status is set.
    */
   public V call(Callable<V> callable) throws ExecutionException, RetryException {
       long startTime = System.nanoTime();
       //说明：根据 attemptNumber 进行循环 —— 也就是重试多少次
       for (int attemptNumber = 1; ; attemptNumber++) {
           //说明：进入方法不等待，立即执行一次
           Attempt<V> attempt;
           try {
                //说明：执行 callable 中的具体业务
                //attemptTimeLimiter 限制了每次尝试等待的时常
               V result = attemptTimeLimiter.call(callable);
               //利用调用结果构造新的 attempt
               attempt = new ResultAttempt<V>(result, attemptNumber, TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTime));
           } catch (Throwable t) {
               attempt = new ExceptionAttempt<V>(t, attemptNumber, TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTime));
           }

           //说明：遍历自定义的监听器
           for (RetryListener listener : listeners) {
               listener.onRetry(attempt);
           }

           //说明：判断是否满足重试条件，来决定是否继续等待并进行重试
           if (!rejectionPredicate.apply(attempt)) {
               return attempt.get();
           }

           //说明：此时满足停止策略，因为还没有得到想要的结果，因此抛出异常
           if (stopStrategy.shouldStop(attempt)) {
               throw new RetryException(attemptNumber, attempt);
           } else {
                //说明：执行默认的停止策略 —— 线程休眠
               long sleepTime = waitStrategy.computeSleepTime(attempt);
               try {
                   //说明：也可以执行定义的停止策略
                   blockStrategy.block(sleepTime);
               } catch (InterruptedException e) {
                   Thread.currentThread().interrupt();
                   throw new RetryException(attemptNumber, attempt);
               }
           }
       }
   }
```

Retryer执行过程如下：

![3](3.png)


**eg：**

```java
/**
 * @author vincent
 */
@Slf4j
public class GuavaRetrying {
    @Data
    class WeatherInfo {
        /**
         * city : 上海
         * cityid : 101190408
         * temp : 23.5
         * WD : 东北风
         * WS : 小于3级
         * SD : 80%
         * AP : 1006.4hPa
         * njd : 2903
         * WSE : <3
         * time : 17:00
         * sm : 1.1
         * isRadar : 1
         * Radar : JC_RADAR_AZ9210_JB)!!!
         */
        private String city;
        private String cityid;
        private String temp;
        private String WD;
        private String WS;
        private String SD;
        private String AP;
        private String njd;
        private String WSE;
        private String time;
        private String sm;
        private String isRadar;
        private String Radar;
    }

    /**
     * Guava retryer: 重试机制
     * .retryIfException() -> 抛出异常会进行重试
     * .retryIfResult(Predicates.equalTo(false)) -> 如果接口返回的结果不符合预期,也需要重试
     * .withWaitStrategy(WaitStrategies.fixedWait(1, TimeUnit.SECONDS)) -> 重试策略, 此处设置的是重试间隔时间
     * .withStopStrategy(StopStrategies.stopAfterAttempt(3)) -> 重试次数
     * .withAttemptTimeLimiter(AttemptTimeLimiters.fixedTimeLimit(2, TimeUnit.SECONDS)) -> 某次请求不得超过2s，
     *                        使用这个属性会报 "java.lang.NoSuchMethodError: com.google.common.util.concurrent.SimpleTimeLimiter: method <init>()V not found" 个人感觉是 jar 暂时没找到原因
     */
    private Retryer<WeatherInfo> retryer = RetryerBuilder.<WeatherInfo>newBuilder()
            .retryIfException()
            .withWaitStrategy(WaitStrategies.fixedWait(1, TimeUnit.SECONDS))
            .withStopStrategy(StopStrategies.stopAfterAttempt(3))
//            .withAttemptTimeLimiter(AttemptTimeLimiters.fixedTimeLimit(3, TimeUnit.SECONDS))
            .withRetryListener(new RetryListener() {
                @Override
                public <WeatherInfo> void onRetry(Attempt<WeatherInfo> attempt) {
                    // attempt.getAttemptNumber() -> 第几次重试,(注意:第一次重试其实是第一次调用)
                    log.debug("第 retryTime = {}次重试......", attempt.getAttemptNumber());
                    // attempt.getDelaySinceFirstAttempt() -> 距离第一次重试的延迟
                    log.debug("距离上一次重试的 delay = {}......", attempt.getDelaySinceFirstAttempt());
                    if (attempt.hasException()) {
                        // attempt.hasException() -> 是异常终止
                        log.debug("异常终止 causeBy = {}......", attempt.getExceptionCause().toString());
                    } else {
                        // attempt.hasResult() -> 是正常返回
                        log.debug("成功获取结果为 {}......", attempt.getResult());
                    }
                }
            })
            .build();

    /**
     * 调取上海当前天气的情况
     *
     * @return
     */
    public WeatherInfo getWeather() {
        //上海区域编码
        String AreaCode = "101020100";
        String url = "http://www.weather.com.cn/data/sk/" + AreaCode + ".html";
        //这里用的是 hutool 工具类，进行 HttpClient 请求和 Json 转化
        String json = HttpUtil.get(url, CharsetUtil.CHARSET_UTF_8);
        JSON parse = JSONUtil.parse(json);
        WeatherInfo weatherinfo = parse.getByPath("weatherinfo", WeatherInfo.class);

        //模拟调取外部接口时发生异常
        int a = 1 / 0;
        return weatherinfo;
    }

    @Test
    public void t2() throws Throwable {
        log.debug("开始调取外部接口......");
        WeatherInfo weatherInfo = retryer.call(() -> getWeather());
        log.debug("调取外部接口结束......");
        log.info("调用返回的天气情况 {}!!!", weatherInfo);
        log.info("go on with something......");
    }
}
```

案例源码：https://github.com/V-Vincen/retry-mechanism
参考：https://juejin.im/post/5c77e3bcf265da2d914da410#heading-3