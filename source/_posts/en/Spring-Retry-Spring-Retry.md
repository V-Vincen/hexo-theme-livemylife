---
title: '[Spring Retry] Spring Retry'
catalog: true
date: 2020-04-30 01:55:06
subtitle: Spring Retry provides an ability to automatically re-invoke a failed operation. 
header-img: /img/springretry/springretry_bg.png
tags:
- Spring Retry
---

日常开发中经常遇到调用外部接口失败的情况，这时候我们需要去设置失败重试机制。正常情况我们的重试机制是：如果出错了，一般是网络抖动或者延迟的情况，设置重试一次，或者几次。方案如下：

`try-catch-redo` 简单重试模式：
```java
try{
    doSomething();
} catch {
    redo();
}
```

如果想定制什么时候重试，重试几次，就需要我们自己定义重试策略，那么我们的代码就稍微复杂一些，可能是如下方案：

`try-catch-redo-retry strategy` 策略重试模式：
```java
try{
    doSomething();
} catch {
    redo(retryTime,interval);
}
```

如上是我们一般的处理方案，由上我们大致可以看出如果想要实现一个优雅的重试方案，需要我们详细的去考虑重试机制，重试策略，重试失败措施，重试代码如何做到不侵入业务代码等等。所以，这样的一个小功能我们也是可以做成很有意思的小组件的。现代分布式系统中系统调用如此频繁，重试机制也是大家开发中的重复性劳动，所以这种不必要的代码已经有人给我们写好了，分别是 Java 中的 `Spring-Retry` 和 `Guava-Retrying`。

其中 `Spring-Retry` 是基于 `Throwable` 类型的重试机制，即针对可捕获异常执行重试策略，并提供相应的回滚策略；而 `Guava-Retrying` 提供了更为丰富的重试源定义，譬如多个异常或者多个返回值。那我们就先来学习下 `Spring-Retry`。


## 概述
**官方定义：**
> This project provides declarative retry support for Spring applications. It is used in Spring Batch, Spring Integration, and others. Imperative retry is also supported for explicit usage.

## 类结构说明

![1](1.jpg)

概览
- `RetryCallback`：封装你需要重试的业务逻辑（上文中的 doSth）；
- `RecoverCallback`：封装在多次重试都失败后你需要执行的业务逻辑（上文中的 doSthWhenStillFail）
- `RetryContext`：重试语境下的上下文，可用于在多次 `Retry` 或者 `Retry 和 Recover 之间`传递参数或状态（在多次 `doSth` 或者 `doSth 与 doSthWhenStillFail 之间`传递参数）；
- `RetryOperations`：定义了“重试”的基本框架（模板），要求传入 `RetryCallback`，可选传入 `RecoveryCallback`；
- `RetryListener`：典型的“监听者”，在重试的不同阶段通知“监听者”（例如 doSth，wait 等阶段时通知）；
- `RetryPolicy`：重试的策略或条件，可以简单的进行多次重试，可以是指定超时时间进行重试（上文中的 someCondition）；
- `BackOffPolicy`：重试的回退策略，在业务逻辑执行发生异常时。如果需要重试，我们可能需要等一段时间（可能服务器过于繁忙，如果一直不间隔重试可能拖垮服务器）， 当然这段时间可以是 0，也可以是固定的，可以是随机的（参见 tcp 的拥塞控制算法中的回退策略）。回退策略在上文中体现为 wait()；
- `RetryTemplate`：`RetryOperations` 的具体实现，组合了 `RetryListener[]，BackOffPolicy，RetryPolicy`。

## 核心功能
### `RetryOperations` 接口
```java
public interface RetryOperations {

    <T> T execute(RetryCallback<T> retryCallback) throws Exception;

    <T> T execute(RetryCallback<T> retryCallback, RecoveryCallback<T> recoveryCallback)
        throws Exception;

    <T> T execute(RetryCallback<T> retryCallback, RetryState retryState)
        throws Exception, ExhaustedRetryException;

    <T> T execute(RetryCallback<T> retryCallback, RecoveryCallback<T> recoveryCallback,
        RetryState retryState) throws Exception;

}
```

### `RetryCallback` 接口
```java
public interface RetryCallback<T> {

    T doWithRetry(RetryContext context) throws Throwable;

}
```
回调被执行，如果它失败（通过抛出异常），它将被重试，直到它成功，或者实现决定中止。在 `RetryOperations` 接口中有许多重载的执行方法，当所有的重试尝试都结束时，它们处理各种用于恢复的用例，以及重试状态（允许客户机和实现在调用之间存储信息）。

###  重试策略
**`RetryPolicy` 接口**
```java
public interface RetryPolicy extends Serializable {

    // canRetry 在每次重试的时候调用，是否可以继续重试的判断条件
    boolean canRetry(RetryContext context); 

    // open 重试开始前调用，会创建一个重试上下文到 RetryContext，保存重试的堆栈等信息 registerThrowable 每次重试异常时调用（有异常会继续重试）；
    // 例：SimpleRetryPolicy 当重试次数达到3（默认3次）停止重试，重试次数保存在重试上下文中。
    RetryContext open(RetryContext parent); 

    void close(RetryContext context);

    void registerThrowable(RetryContext context, Throwable throwable);

}
```

**常见策略**

- `NeverRetryPolicy`：只允许调用 `RetryCallback` 一次，不允许重试。

- `AlwaysRetryPolicy`：允许无限重试，直到成功，此方式逻辑不当会导致死循环。

- `SimpleRetryPolicy`：固定次数重试策略，默认重试最大次数为3次，`RetryTemplate` 默认使用的策略。
    
    **eg：**
    ```java
    SimpleRetryPolicy simpleRetryPolicy = new SimpleRetryPolicy();
    simpleRetryPolicy.setMaxAttempts(4);
    ```
    
- `TimeoutRetryPolicy`：可以实现指定时间内的重试。超时时间通过参数 timeout 进行设置。
    
    **eg：** 默认超时时间1s，使用方式如下
    ```java
    // all spend 1s
    TimeoutRetryPolicy timeoutRetryPolicy = new TimeoutRetryPolicy(); 
    timeoutRetryPolicy.setTimeout(2000L);
    ```
    
- `ExceptionClassifierRetryPolicy`：设置不同异常的重试策略，类似组合重试策略，区别在于这里只区分不同异常的重试。

    **eg：**
    ```java
    ExceptionClassifierRetryPolicy retryPolicy = new ExceptionClassifierRetryPolicy();
    Map<Class<? extends Throwable>, RetryPolicy> policyMap = Maps.newHashMap();
    
    policyMap.put(NullPointerException.class, new SimpleRetryPolicy());
    policyMap.put(ArithmeticException.class, new TimeoutRetryPolicy());
    
    retryPolicy.setPolicyMap(policyMap);
    ```
    上述示例中，我们针对重试业务抛出的空指针异常使用 `SimpleRetryPolicy` 策略，而对于算术异常采用 `TimeoutRetryPolicy` 策略。实际的重试过程中，这两中情况有可能交替出现，但不管如何，只要有一个重试策略达到终止状态，则整个重试调用终止。
    
- `CircuitBreakerRetryPolicy`：有熔断功能的重试策略，需设置3个参数 `openTimeout`、`resetTimeout` 和 `delegate`。

- `CompositeRetryPolicy`：实现了重试策略的组合。通过其 `policies` 字段，可以为其添加多个重试策略。组合策略执行的过程中，所有策略只要有一个达成终止条件，那么该重试结束。我们可以用组合重试策略实现一些相对比较复杂的重试。
    
    **eg：** 比如我们要实现在指定时间1s内重试3次，每次重试间隔0.2秒，就可以使用以下方法
    ```java
    CompositeRetryPolicy compositeRetryPolicy = new CompositeRetryPolicy();

    SimpleRetryPolicy simpleRetryPolicy = new SimpleRetryPolicy();
    
    TimeoutRetryPolicy timeoutRetryPolicy = new TimeoutRetryPolicy();
    
    FixedBackOffPolicy fixedBackOffPolicy = new FixedBackOffPolicy();
    fixedBackOffPolicy.setBackOffPeriod(200); // 每次重试间隔200ms
    
    compositeRetryPolicy.setPolicies(new RetryPolicy[]{ 
    		simpleRetryPolicy,
    		timeoutRetryPolicy,
    });
    ```

### 重试回退策略
重试策略 `RetryPolicy` 只是实现了基本的重试功能，也就是核心的循环逻辑，形如以下的代码：
```java
do ... while
```

那么每次重试之间的相关场景该如何处理呢？为此，`Spring Retry` 将重试间可能有的重试等待策略抽像成了 `BackoffPolicy` 接口，并提供了一些简单的实现。默认情况下是立即重试，如果需要配置等待一段时间后重试则需要指定回退策略 `BackoffRetryPolicy`。在使用 `RetryTemplate` 时，可以通过 `setBackOffPolicy` 方法进行设置。

- `NoBackOffPolicy`：无回退算法策略，每次重试时立即重试。

- `FixedBackOffPolicy`：应该是最常用的重试间隔策略。有两个基本属性：`backOffPeriod`（设定间隔时间）和 `sleeper`（等待策略）。`sleeper` 默认是 `Thread.sleep` -- 即线程休眠，`backOffPeriod` 指定休眠时间，默认1秒。
   
     **eg:**
    ```java
    FixedBackOffPolicy fixedBackOffPolicy = new FixedBackOffPolicy();
    fixedBackOffPolicy.setBackOffPeriod(1500);
    ```
 
- `UniformRandomBackOffPolicy`：允许给定最大，最小等待时间，然后让每次的重试在其之间进行随机等待。参数 `minBackOffPeriod` 和 `maxBackOffPeriod` 的默认值分别为500ms和1500ms，具体的计算方式是：

- `ExponentialBackOffPolicy`：类提供了指数级重试间隔的实现。通过该类，可以使重试之间的等待按指数级增长。其中：
    - `initialInterval` 属性为初始默认间隔，默认值是100毫秒；
    - `maxInterval` 属性为最大默认间隔。当实际计算出的间隔超过该值时，使用该值。默认为30秒；
    - `multiplier` 为乘数。默认2，当其等于1时，其行为同 `FixedBackOffPolicy` 为固定时间间隔。建议不要使用1，会造成重试过快；

- `ExponentialRandomBackOffPolicy`：继承自 `ExponentialBackOffPolicy`，只是重写了获取重试时间间隔的方法。在获取重试间隔后，在加上一些随机的时间。


### 有状态重试、无状态重试
所谓**无状态重试**是指重试**在一个线程上下文中完成**的重试，反之**不在一个线程上下文完成**重试的就是**有状态重试**。 之前的 `SimpleRetryPolicy` 就属于无状态重试，因为重试是在一个循环中完成的。那么什么时候后会出现或者说需要有状态重试呢？通常有两种情况：**事务回滚**和**熔断**。

数据库操作异常 `DataAccessException`，不能执行重试，而如果抛出其他异常可以重试。

熔断的意思不在当前循环中处理重试，而是全局重试模式（不是线程上下文）。熔断会跳出循环，那么必然会丢失线程上下文的堆栈信息。 那么肯定需要一种“全局模式”保存这种信息，目前的实现放在一个 cache（map 实现的）中，下次从缓存中获取就能继续重试了。

**eg：**
```xml
<dependency>
    <groupId>org.springframework.retry</groupId>
    <artifactId>spring-retry</artifactId>
    <version>1.2.5.RELEASE</version>
</dependency>
```

```java
/**
 * @author vincent
 */
@Slf4j
public class SpringRetry {

    /**
     * 调取上海当前天气的情况
     *
     * @return
     */
    public WeatherInfo getWeather() {
        //上海区域编码
        String AreaCode = "101020100";
        String url = "http://www.weather.com.cn/data/sk/" + AreaCode + ".html";
        String json = HttpUtil.get(url, CharsetUtil.CHARSET_UTF_8);
        JSON parse = JSONUtil.parse(json);
        WeatherInfo weatherinfo = parse.getByPath("weatherinfo", WeatherInfo.class);
        return weatherinfo;
    }

    /**
     * @throws Throwable
     */
    public WeatherInfo retryDoSomething() throws Throwable {
        // 构建重试模板实例
        RetryTemplate retryTemplate = new RetryTemplate();
        // 设置重试策略，主要设置重试次数
        SimpleRetryPolicy policy = new SimpleRetryPolicy(3, Collections.singletonMap(Exception.class, true));
        // 设置重试回退操作策略，主要设置重试间隔时间
        FixedBackOffPolicy fixedBackOffPolicy = new FixedBackOffPolicy();
        fixedBackOffPolicy.setBackOffPeriod(100);

        retryTemplate.setRetryPolicy(policy);
        retryTemplate.setBackOffPolicy(fixedBackOffPolicy);

        log.debug("开始调取外部接口......");
        WeatherInfo execute = retryTemplate.execute(new RetryCallback<WeatherInfo, Throwable>() {
            // 通过RetryCallback 重试回调实例包装正常逻辑逻辑，第一次执行和重试执行执行的都是这段逻辑
            @Override
            public WeatherInfo doWithRetry(RetryContext retryContext) throws Throwable {
                //RetryContext 重试操作上下文约定，统一 spring-try 包装

                log.debug("第 {} 次重试.....", retryContext.getRetryCount());
                WeatherInfo weather = null;
                try {
                    weather = getWeather();

                    //模拟调取外部接口时发生异常
                    int a = 1 / 0;
                } catch (Exception e) {
//                    e.printStackTrace();
                    log.error("捕获到的异常{}......",e.getMessage());
                    throw new RuntimeException();//这个点特别注意，重试的根源通过 Exception 返回
                }
                return weather;
            }
        }, new RecoveryCallback<WeatherInfo>() {
            // 通过 RecoveryCallback 重试流程正常结束或者达到重试上限后的退出恢复操作实例
            @Override
            public WeatherInfo recover(RetryContext retryContext) throws Exception {
                log.info("do recory operation...");
                return null;
            }
        });
        log.debug("调取外部接口结束......");

        return execute;
    }

    @Test
    public void t2() throws Throwable {
        WeatherInfo weatherInfo = retryDoSomething();
        log.info("调用返回的天气情况{}!!!", weatherInfo);
        log.info("go on with something...");
    }
}

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
```

结果为：
```
23:49:57.575 [main] DEBUG com.example.retrymechanism.spring_retry.SpringRetry - 开始调取外部接口......
23:49:57.583 [main] DEBUG org.springframework.retry.support.RetryTemplate - Retry: count=0
23:49:57.583 [main] DEBUG com.example.retrymechanism.spring_retry.SpringRetry - 第 0 次重试.....
四月 29, 2020 11:49:57 下午 java.net.CookieManager put
SEVERE: Invalid cookie for http://www.weather.com.cn/data/sk/101020100.html: HttpOnly
23:49:57.754 [main] ERROR com.example.retrymechanism.spring_retry.SpringRetry - 捕获到的异常/ by zero......
23:49:57.858 [main] DEBUG org.springframework.retry.support.RetryTemplate - Checking for rethrow: count=1
23:49:57.858 [main] DEBUG org.springframework.retry.support.RetryTemplate - Retry: count=1
23:49:57.858 [main] DEBUG com.example.retrymechanism.spring_retry.SpringRetry - 第 1 次重试.....
四月 29, 2020 11:49:57 下午 java.net.CookieManager put
SEVERE: Invalid cookie for http://www.weather.com.cn/data/sk/101020100.html: HttpOnly
23:49:57.875 [main] ERROR com.example.retrymechanism.spring_retry.SpringRetry - 捕获到的异常/ by zero......
23:49:57.980 [main] DEBUG org.springframework.retry.support.RetryTemplate - Checking for rethrow: count=2
23:49:57.980 [main] DEBUG org.springframework.retry.support.RetryTemplate - Retry: count=2
23:49:57.980 [main] DEBUG com.example.retrymechanism.spring_retry.SpringRetry - 第 2 次重试.....
四月 29, 2020 11:49:57 下午 java.net.CookieManager put
SEVERE: Invalid cookie for http://www.weather.com.cn/data/sk/101020100.html: HttpOnly
23:49:57.994 [main] ERROR com.example.retrymechanism.spring_retry.SpringRetry - 捕获到的异常/ by zero......
23:49:57.994 [main] DEBUG org.springframework.retry.support.RetryTemplate - Checking for rethrow: count=3
23:49:57.994 [main] DEBUG org.springframework.retry.support.RetryTemplate - Retry failed last attempt: count=3
23:49:57.994 [main] INFO com.example.retrymechanism.spring_retry.SpringRetry - do recory operation...
23:49:57.994 [main] DEBUG com.example.retrymechanism.spring_retry.SpringRetry - 调取外部接口结束......
23:49:57.994 [main] INFO com.example.retrymechanism.spring_retry.SpringRetry - 调用返回的天气情况 null!!!
23:49:57.994 [main] INFO com.example.retrymechanism.spring_retry.SpringRetry - go on with something......
```

屏蔽 `int a = 1 / 0;` 后，请求正常的结果：

```
23:51:24.342 [main] DEBUG com.example.retrymechanism.spring_retry.SpringRetry - 开始调取外部接口......
23:51:24.350 [main] DEBUG org.springframework.retry.support.RetryTemplate - Retry: count=0
23:51:24.350 [main] DEBUG com.example.retrymechanism.spring_retry.SpringRetry - 第 0 次重试.....
四月 29, 2020 11:51:24 下午 java.net.CookieManager put
SEVERE: Invalid cookie for http://www.weather.com.cn/data/sk/101020100.html: HttpOnly
23:51:24.527 [main] DEBUG com.example.retrymechanism.spring_retry.SpringRetry - 调取外部接口结束......
23:51:24.527 [main] INFO com.example.retrymechanism.spring_retry.SpringRetry - 调用返回的天气情况 WeatherInfo(city=上海, cityid=101020100, temp=23.5, WD=东北风, WS=小于3级, SD=80%, AP=1006.4hPa, njd=2903, WSE=<3, time=17:00, sm=1.1, isRadar=1, Radar=JC_RADAR_AZ9210_JB)!!!
23:51:24.527 [main] INFO com.example.retrymechanism.spring_retry.SpringRetry - go on with something......
```

## 声明式（基于注解）
最后我们了解下如何使用注解实现重试机制。最基本的，我们需要以下这几个注解：

- `@EnableRetry`：能否重试。注解类的，其 `proxyTargetClass` 属性为 `true` 时，使用 `CGLIB` 代理。默认使用标准 JAVA 注解。当类中有 `@Retryable` 注释的方法时，对该方法生成代理。

- `@Retryable`：注解需要被重试的方法。
    - `include` 指定处理的异常类，默认所有异常。
    - `maxAttempts` 最大重试次数，默认3次。
    - `backoff` 重试等待策略。默认使用 `@Backoff` 注解。

- `@Backoff`：重试等待策略。
    - 不设置参数时，默认使用 `FixedBackOffPolicy` 重试等待1000ms。
    - 只设置 `delay()` 属性时，使用 `FixedBackOffPolicy` 重试等待指定的毫秒数。
    - 当设置 `delay()` 和 `maxDealy()` 属性时，重试等待在这两个值之间均态分布。
    - 使用 `delay()`、`maxDealy()` 和 `multiplier()` 属性时，使用 `ExponentialBackOffPolicy`。
    - 当设置 `multiplier()` 属性不等于0时，同时也设置了 `random()` 属性时，使用 `ExponentialRandomBackOffPolicy`。

- `@Recover`：用于方法。用于 `@Retryable` 失败时的“兜底”处理方法。`@Recover` 注释的方法参数为 `@Retryable` 异常类，返回值应与重试方法返回相同，否则无法识别！因此可以针对可能异常设置多个 `@Recover` 方法进行“兜底”处理。

**eg：**
```java
@Service
@EnableRetry()
public class AnnoService {
    public Logger logger = LoggerFactory.getLogger(AnnoService.class);

    @Retryable(maxAttempts = 5, backoff = @Backoff(random = true))
    public String someService() {
        int random = (int) (Math.random() * 10);

        if (random < 4) {
            logger.info("random={} Null Pointer Excep", random);
            throw new NullPointerException();
        } else if (random < 9) {
            logger.info("random={} Arithmetic Excep", random);
            throw new ArithmeticException();
        }

        logger.info("random={} ok !!!!", random);
        return "ok";
    }

    @Recover
    public String recover(NullPointerException ne) {
        logger.info("{}", "NullPointerException");
        return "null pointer recover";
    }

    @Recover
    public String recover(ArithmeticException ne) {
        logger.info("{}", "ArithmeticException");
        return "ArithmeticException recover";
    }

}

public class Main {
    public static void main(String[] args) throws Exception {

        ApplicationContext context = new AnnotationConfigApplicationContext("com.leeyee.spring.retry.*");

        AnnoService annoService = context.getBean(AnnoService.class);
        String result = annoService.someService();
        System.out.println(result);
    }
}
```

Source Code：https://github.com/V-Vincen/retry-mechanism

官网：https://github.com/spring-projects/spring-retry
参考：https://www.baeldung.com/spring-retry



