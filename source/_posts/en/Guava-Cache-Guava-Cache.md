---
title: '[Guava Cache] Guava Cache'
catalog: true
date: 2020-04-30 19:05:04
subtitle: Guava provides a very powerful memory based caching mechanism by an interface LoadingCache<K,V>...
header-img: /img/guava/guava_bg.png
tags:
- Guava Cache
---

`Guava Cache` 是在内存中缓存数据，相比较于数据库或 `redis` 存储，访问内存中的数据会更加高效。`Guava` 官网介绍，下面的这几种情况可以考虑使用 `Guava Cache`：

- 愿意消耗一些内存空间来提升速度。

- 预料到某些键会被多次查询。

- 缓存中存放的数据总量不会超出内存容量。

所以，可以将程序频繁用到的少量数据存储到 `Guava Cache` 中，以改善程序性能。下面对 `Guava Cache` 的用法进行详细的介绍。

## 构建缓存对象
接口 `Cache` 代表一块缓存，它有如下方法：
```java
public interface Cache<K, V> {
    V get(K key, Callable<? extends V> valueLoader) throws ExecutionException;

    ImmutableMap<K, V> getAllPresent(Iterable<?> keys);

    void put(K key, V value);

    void putAll(Map<? extends K, ? extends V> m);

    void invalidate(Object key);

    void invalidateAll(Iterable<?> keys);

    void invalidateAll();

    long size();

    CacheStats stats();

    ConcurrentMap<K, V> asMap();

    void cleanUp();
}
```

可以通过 `CacheBuilder` 类构建一个缓存对象，`CacheBuilder` 类采用 `builder` 设计模式，它的每个方法都返回 `CacheBuilder` 本身，直到 `build` 方法被调用。构建一个缓存对象代码如下。
```java
public class StudyGuavaCache {
    public static void main(String[] args) {
        Cache<String,String> cache = CacheBuilder.newBuilder().build();
        cache.put("word","Hello Guava Cache");
        System.out.println(cache.getIfPresent("word"));
    }
}
```
上面的代码通过 `CacheBuilder.newBuilder().build()` 这句代码创建了一个 `Cache` 缓存对象，并在缓存对象中存储了 `key` 为 **word**，`value` 为 **Hello Guava Cache**的一条记录。可以看到 `Cache` 非常类似于 JDK 中的 `Map`，但是相比于 `Map`，`Guava Cache` 提供了很多更强大的功能。

### `maximumSize`
`Guava Cache` 可以在构建缓存对象时指定缓存 `maximumSize` 所能够存储的最大记录数量。当 `Cache` 中的记录数量达到最大值后再调用 `put` 方法向其中添加对象，`Guava` 会先从当前缓存的对象记录中选择一条删除掉，腾出空间后再将新的对象存储到 `Cache` 中。

**eg：**
```java
public class StudyGuavaCache {
    public static void main(String[] args) {
        Cache<String,String> cache = CacheBuilder.newBuilder()
                .maximumSize(2)
                .build();
        cache.put("key1","value1");
        cache.put("key2","value2");
        cache.put("key3","value3");
        System.out.println("第一个值：" + cache.getIfPresent("key1"));
        System.out.println("第二个值：" + cache.getIfPresent("key2"));
        System.out.println("第三个值：" + cache.getIfPresent("key3"));
    }
}
```

程序执行结果：
```
第一个值：null
第二个值：value2
第三个值：value3
```

### `expireAfterAccess`、`expireAfterWrite`
在构建 `Cache` 对象时，可以通过 `CacheBuilder` 类的 `expireAfterAccess` 和 `expireAfterWrite` 两个方法为缓存中的对象指定过期时间，过期的对象将会被缓存自动删除。其中，`expireAfterWrite` 方法指定对象被写入到缓存后多久过期，`expireAfterAccess` 指定对象多久没有被访问后过期。

**eg：** `expireAfterWrite` 方法指定 `put` 到 `Cache` 中的对象在3秒后会过期。
```java
public class StudyGuavaCache {
    public static void main(String[] args) throws InterruptedException {
        Cache<String,String> cache = CacheBuilder.newBuilder()
                .maximumSize(2)
                .expireAfterWrite(3,TimeUnit.SECONDS)
                .build();
        cache.put("key1","value1");
        int time = 1;
        while(true) {
            System.out.println("第" + time++ + "次取到key1的值为：" + cache.getIfPresent("key1"));
            Thread.sleep(1000);
        }
    }
}
```


程序执行结果：
```
第1次取到key1的值为：value1
第2次取到key1的值为：value1
第3次取到key1的值为：value1
第4次取到key1的值为：null
第5次取到key1的值为：null
第6次取到key1的值为：null
第7次取到key1的值为：null
.
.
.
```


**eg：** `expireAfterAccess` 方法指定超过3秒没有被访问就会过期。
```java
public class StudyGuavaCache {
    public static void main(String[] args) throws InterruptedException {
        Cache<String,String> cache = CacheBuilder.newBuilder()
                .maximumSize(2)
                .expireAfterAccess(3,TimeUnit.SECONDS)
                .build();
        cache.put("key1","value1");
        int time = 1;
        while(true) {
            Thread.sleep(time*1000);
            System.out.println("睡眠" + time++ + "秒后取到key1的值为：" + cache.getIfPresent("key1"));
        }
    }
}
```

程序执行结果：
```
睡眠1秒后取到key1的值为：value1
睡眠2秒后取到key1的值为：value1
睡眠3秒后取到key1的值为：null
睡眠4秒后取到key1的值为：null
睡眠5秒后取到key1的值为：null
睡眠6秒后取到key1的值为：null
.
.
.
```

**注：** 可同时用 `expireAfterAccess` 和 `expireAfterWrite` 方法指定过期时间，这时只要对象满足两者中的一个条件就会被自动过期删除。


### `weakKeys`、`weakValues`
可以通过`weakKeys`、`weakValues`方法指定 `Cache` 只保存对缓存记录 `key` 和 `value` 的弱引用。这样当没有其他强引用指向 `key` 和 `value` 时，`key` 和 `value` 对象就会被垃圾回收器回收。

```java
public class StudyGuavaCache {
    public static void main(String[] args) throws InterruptedException {
        Cache<String,Object> cache = CacheBuilder.newBuilder()
                .maximumSize(2)
                .weakValues()
                .build();
        Object value = new Object();
        cache.put("key1",value);

        value = new Object();//原对象不再有强引用
        System.gc();
        System.out.println(cache.getIfPresent("key1"));
    }
}
```

上面代码的打印结果是 `null`。构建 `Cache` 时通过 `weakValues` 方法指定 `Cache` 只保存记录值的一个弱引用。当给 `value` 引用赋值一个新的对象之后，就不再有任何一个强引用指向原对象。`System.gc()` 触发垃圾回收后，原对象就被清除了。

### `removalListener`
可以为 `Cache` 对象添加一个移除监听器，这样当有记录被删除时可以感知到这个事件。

**eg：**
```java
public class StudyGuavaCache {
    public static void main(String[] args) throws InterruptedException {
        RemovalListener<String, String> listener = new RemovalListener<String, String>() {
            public void onRemoval(RemovalNotification<String, String> notification) {
                System.out.println("[" + notification.getKey() + ":" + notification.getValue() + "] is removed!");
            }
        };
        Cache<String,String> cache = CacheBuilder.newBuilder()
                .maximumSize(3)
                .removalListener(listener)
                .build();
        Object value = new Object();
        cache.put("key1","value1");
        cache.put("key2","value2");
        cache.put("key3","value3");
        cache.put("key4","value3");
        cache.put("key5","value3");
        cache.put("key6","value3");
        cache.put("key7","value3");
        cache.put("key8","value3");
    }
}
```

程序执行结果：
```
[key1:value1] is removed!
[key2:value2] is removed!
[key3:value3] is removed!
[key4:value4] is removed!
.
.
.
```


### `invalidate`、`invalidateAll`
可以调用 `Cache` 的 `invalidateAll`、`invalidate` 方法显示删除 `Cache` 中的记录。`invalidate` 方法一次只能删除 `Cache` 中一个记录，接收的参数是要删除记录的 `key`。`invalidateAll` 方法可以批量删除 `Cache` 中的记录，当没有传任何参数时，`invalidateAll` 方法将清除 `Cache` 中的全部记录。`invalidateAll` 也可以接收一个 `Iterable` 类型的参数，参数中包含要删除记录的所有 `key` 值。

**eg：** 
```java
public class StudyGuavaCache {
    public static void main(String[] args) throws InterruptedException {
        Cache<String,String> cache = CacheBuilder.newBuilder().build();
        Object value = new Object();
        cache.put("key1","value1");
        cache.put("key2","value2");
        cache.put("key3","value3");

        List<String> list = new ArrayList<String>();
        list.add("key1");
        list.add("key2");

        cache.invalidateAll(list);//批量清除list中全部key对应的记录
        System.out.println(cache.getIfPresent("key1"));
        System.out.println(cache.getIfPresent("key2"));
        System.out.println(cache.getIfPresent("key3"));
    }
}
```
代码中构造了一个集合 `list` 用于保存要删除记录的 `key` 值，然后调用 `invalidateAll` 方法批量删除 `key1` 和 `key2` 对应的记录，只剩下 `key3` 对应的记录没有被删除。


### `get(K key, Callable<? extends V> valueLoader)`
`Cache` 的 `get` 方法有两个参数，第一个参数是要从 `Cache` 中获取记录的key，第二个记录是一个 `Callable` 对象。当缓存中已经存在 `key` 对应的记录时，`get` 方法直接返回 `key` 对应的记录。如果缓存中不包含 `key` 对应的记录，`Guava` 会启动一个线程执行 `Callable` 对象中的 `call` 方法，`call` 方法的返回值会作为 `key` 对应的值被存储到缓存中，并且被 `get` 方法返回。

**eg：**
```java
public class StudyGuavaCache {

    private static Cache<String,String> cache = CacheBuilder.newBuilder()
            .maximumSize(3)
            .build();

    public static void main(String[] args) throws InterruptedException {
        
        new Thread(new Runnable() {
            public void run() {
                System.out.println("thread1");
                try {
                    String value = cache.get("key", new Callable<String>() {
                        public String call() throws Exception {
                            System.out.println("load1"); //加载数据线程执行标志
                            Thread.sleep(1000); //模拟加载时间
                            return "auto load by Callable";
                        }
                    });
                    System.out.println("thread1 " + value);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();

        new Thread(new Runnable() {
            public void run() {
                System.out.println("thread2");
                try {
                    String value = cache.get("key", new Callable<String>() {
                        public String call() throws Exception {
                            System.out.println("load2"); //加载数据线程执行标志
                            Thread.sleep(1000); //模拟加载时间
                            return "auto load by Callable";
                        }
                    });
                    System.out.println("thread2 " + value);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }
}
```

这段代码中有两个线程共享同一个 `Cache` 对象，两个线程同时调用 `get` 方法获取同一个 `key` 对应的记录。由于 `key` 对应的记录不存在，所以两个线程都在 `get` 方法处阻塞。此处在 `call` 方法中调用 `Thread.sleep(1000)` 模拟程序从外存加载数据的时间消耗。

程序执行结果：
```
thread1
thread2
load1
thread2 auto load by Callable
thread1 auto load by Callable
```

从结果中可以看出，虽然是两个线程同时调用 `get` 方法，但只有一个 `get` 方法中的 `Callable` 会被执行（没有打印出 load2）。`Guava` 可以保证当有多个线程同时访问 `Cache` 中的一个 `key` 时，如果 `key` 对应的记录不存在，`Guava` 只会启动一个线程执行 `get` 方法中 `Callable` 参数对应的任务加载数据存到缓存。当加载完数据后，任何线程中的 `get` 方法都会获取到 `key` 对应的值。


### `recordStats`
可以对 `Cache` 的命中率、加载数据时间等信息进行统计。在构建 `Cache` 对象时，可以通过 `CacheBuilder` 的 `recordStats` 方法开启统计信息的开关。开关开启后 `Cache` 会自动对缓存的各种操作进行统计，调用 `Cache` 的 `stats` 方法可以查看统计后的信息。

**eg：**
```java
public class StudyGuavaCache {
    public static void main(String[] args) throws InterruptedException {
        Cache<String,String> cache = CacheBuilder.newBuilder()
                .maximumSize(3)
                .recordStats() //开启统计信息开关
                .build();
        cache.put("key1","value1");
        cache.put("key2","value2");
        cache.put("key3","value3");
        cache.put("key4","value4");

        cache.getIfPresent("key1");
        cache.getIfPresent("key2");
        cache.getIfPresent("key3");
        cache.getIfPresent("key4");
        cache.getIfPresent("key5");
        cache.getIfPresent("key6");

        System.out.println(cache.stats()); //获取统计信息
    }
}
```

程序执行结果：
```
CacheStats{hitCount=3, missCount=3, loadSuccessCount=0, loadExceptionCount=0, totalLoadTime=0, evictionCount=1}
```
这些统计信息对于调整缓存设置是至关重要的，在性能要求高的应用中应该密切关注这些数据。


## `LoadingCache`

`LoadingCache` 是 `Cache` 的子接口，相比较于 `Cache`，当从 `LoadingCache` 中读取一个指定 `key` 的记录时，如果该记录不存在，则 `LoadingCache` 可以自动执行加载数据到缓存的操作。`LoadingCache` 接口的定义如下：
```java
public interface LoadingCache<K, V> extends Cache<K, V>, Function<K, V> {

    V get(K key) throws ExecutionException;

    V getUnchecked(K key);

    ImmutableMap<K, V> getAll(Iterable<? extends K> keys) throws ExecutionException;

    V apply(K key);

    void refresh(K key);

    @Override
    ConcurrentMap<K, V> asMap();
}
```

与构建 `Cache` 类型的对象类似，`LoadingCache` 类型的对象也是通过 `CacheBuilder` 进行构建。不同的是，在调用 `CacheBuilder的build` 方法时，必须传递一个 `CacheLoader` 类型的参数，`CacheLoader` 的 `load` 方法需要我们提供实现。当调用 `LoadingCache` 的 `get` 方法时，如果缓存不存在对应 `key` 的记录，则 `CacheLoader` 中的 `load` 方法会被自动调用从外存加载数据，`load` 方法的返回值会作为 `key` 对应的 `value` 存储到 `LoadingCache` 中，并从 `get` 方法返回。


**eg：**
```
public class StudyGuavaCache {
    public static void main(String[] args) throws Exception {
        CacheLoader<String, String> loader = new CacheLoader<String, String> () {
            public String load(String key) throws Exception {
                Thread.sleep(1000); //休眠1s，模拟加载数据
                System.out.println(key + " is loaded from a cacheLoader!");
                return key + "'s value";
            }
        };

        LoadingCache<String,String> loadingCache = CacheBuilder.newBuilder()
                .maximumSize(3)
                .build(loader);//在构建时指定自动加载器

        loadingCache.get("key1");
        loadingCache.get("key2");
        loadingCache.get("key3");
    }
}
```

程序执行结果：
```
key1 is loaded from a cacheLoader!
key2 is loaded from a cacheLoader!
key3 is loaded from a cacheLoader!
```

## 场景案例
**调取第三方服务的 Token 缓存到内存**

### Guava Cache

`expiresIn` 为 token 有效期。第一次获取的 token 的时间 + `expiresIn` = 最终有限期的时间；在第二次获取 token 时，先要比较此时的时间是否大于第一次的最终有限期的时间，如果大于说明 token 过期，重新获取；反之直接从 `Cache` 缓存中获取。

**eg：**
```xml
<!-- guava -->
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>28.2-jre</version>
</dependency>
```

```java
@Slf4j
public class CacheTest {
    private static final String TOKEN = "token";
    private static final String SYS_CODE = "xxx";
    private static final String SECRET_KEY = "xxxxxxxxxxxxxxxxxxxxxxxx";
    private static final String TOKEN_URL = "https://get.token.com.cn/xx/xxx/v1/oauth";

    private Cache<String, List<String>> build = CacheBuilder
            .newBuilder()
            .maximumSize(1)
            .removalListener(
                    (RemovalListener<String, List<String>>) notification -> {
                        String key = notification.getKey();
                        List<String> value = notification.getValue();
                        if (CollectionUtils.isNotEmpty(value)) {
                            log.debug("删除旧的 token：{} ......", value);
                        }
                    }
            )
            .build();

    @Test
    public void t() {
        try {
            List<String> list;
            list = build.get(TOKEN, () -> getAccessToken());

            //模拟 token 过期
//            SECONDS.sleep(2);

            if (CollectionUtils.isNotEmpty(list)) {
                Long expiresTime = Long.parseLong(list.get(0));
                Long currentTimeMillis = System.currentTimeMillis();
                if (expiresTime <= currentTimeMillis) {
                    log.debug("token 过期 ......");
                    build.invalidate(TOKEN);
                    list = build.get(TOKEN, () -> getAccessToken());
//                    build.put(TOKEN, getAccessToken());
//
//                    log.debug("从 Cache 中，获取缓存的 token ......");
//                    list = build.get(TOKEN, () -> getAccessToken());
                }
            } else {
                list = build.get(TOKEN, () -> getAccessToken());
            }
            log.debug("最终获取的 token：{} ......", list);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<String> getAccessToken() {
        HashMap<String, String> map = Maps.newHashMap();
        map.put("sysCode", SYS_CODE);
        map.put("secretKey", SECRET_KEY);
        String postJson = HttpClientUtils.postJson(map, TOKEN_URL);
        List<String> list = Lists.newArrayList();
        if (StringUtils.isNotBlank(postJson)) {
            JSONObject jsonObject = JSON.parseObject(postJson);
            String state = jsonObject.getString("state");
            if (StringUtils.equals("true", state)) {
                String expiresIn = jsonObject.getString("expiresIn");
                String token = jsonObject.getString("token");
                Long expiresTime = System.currentTimeMillis() + Long.parseLong(expiresIn);
//                Long expiresTime = System.currentTimeMillis() + 2000;
                list.add(String.valueOf(expiresTime));
                list.add(token);
            }
        }
        log.debug("请求新的 token：{} ......", list);
        return list;
    }
```

程序执行结果：
```
2020-04-30 18:56:41,733 DEBUG [com.tem.integration.workflow.CacheTest]  - token 过期 ......
2020-04-30 18:56:41,741 DEBUG [com.tem.integration.workflow.CacheTest]  - 删除旧的 token：[1588244201721, eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ6dHJpcCIsImV4cCI6MTU4ODMzMDU5OSwiaWF0IjoxNTg4MjQ0MTk5fQ.cwGT6KFf7TjW7ZfHbWKd5HHYjGlM9XXnGPHaZlKddg90T67M_a8_KiCejzRlp5Ay8_kqoVt8EW6yNUqw5Xc4uQ] ......
2020-04-30 18:56:41,911 DEBUG [com.tem.integration.workflow.CacheTest]  - 请求新的 token：[1588244203911, eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ6dHJpcCIsImV4cCI6MTU4ODMzMDYwMSwiaWF0IjoxNTg4MjQ0MjAxfQ.rZB0BHmc_hWf0_v7TJ4CyqhPpj792Lwtj0naAOMcyLydyqAevaHsMqeBj8H9kPlFCw1ooTthxGXnBKPWnsJTng] ......
2020-04-30 18:56:41,911 DEBUG [com.tem.integration.workflow.CacheTest]  - 最终获取的 token：[1588244203911, eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ6dHJpcCIsImV4cCI6MTU4ODMzMDYwMSwiaWF0IjoxNTg4MjQ0MjAxfQ.rZB0BHmc_hWf0_v7TJ4CyqhPpj792Lwtj0naAOMcyLydyqAevaHsMqeBj8H9kPlFCw1ooTthxGXnBKPWnsJTng] ......

```

当然如果觉得 `Guava Cache` 用起来有点麻烦的话，没关系我们也可以使用 JDK 自带的并发容器 `ConcurrentHashMap` 来做缓存。

### `ConcurrentHashMap`
```java
@Slf4j
public class CacheTest {
    private static final String TOKEN = "token";
    private static final String SYS_CODE = "xxx";
    private static final String SECRET_KEY = "xxxxxxxxxxxxxxxxxxxxxxxx";
    private static final String TOKEN_URL = "https://get.token.com.cn/xx/xxx/v1/oauth";
    
    /**
     * 缓存token
     */
    private static final Map<String, List<String>> KeyMap = new ConcurrentHashMap<>(2);

    @Test
    public void t2(){
        String token = getToken();
    }

    public String getToken() {
        //模拟缓存中已经有 token 了
//        KeyMap.put(TOKEN, Lists.newArrayList(
//                String.valueOf(System.currentTimeMillis() + 4000),
//                "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ6dHJpcCIsImV4cCI6MTU4ODkwOTc0MSwiaWF0IjoxNTg4ODIzMzQxfQ.f8j_W5TZnet1142B9AMtmS6aKPc64x3ek09ogVfAX-m8SmCbDLAG0lMScyb5G2hNJogey0_mW6H9bVbWSIlT1w"
//        ));

        //先去 ConcurrentHashMap 中获取 token，如果为空则重新获取；如果不为空则判断 token 是否过期
        if (KeyMap != null && !KeyMap.isEmpty()) {
            List<String> list = KeyMap.get(TOKEN);
            if (CollectionUtils.isNotEmpty(list)) {

                //模拟 token 已经存储了2秒
//                try {
//                    SECONDS.sleep(2);
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }

                Long expiresTime = Long.parseLong(list.get(0));
                Long currentTimeMillis = System.currentTimeMillis();
                //有效时间是否大于当前时间，大于则没过期，直接获取
                if (expiresTime > currentTimeMillis) {
                    String token = list.get(1);
                    log.debug("从缓存中获取到 token：{}", token);
                    return token;
                } else {
                    //小于则说明已过期，清空缓存
                    log.debug("token 过期 ......");
                    KeyMap.clear();
                }
            }
        }

        HashMap<String, String> map = Maps.newHashMap();
        map.put("sysCode", SYS_CODE);
        map.put("secretKey", SECRET_KEY);
        String token = null;

        List<String> list = Lists.newArrayList();
        try {
            String postJson;
            synchronized (HttpClientUtils.class) {
                postJson = HttpClientUtils.postJson(map, TOKEN_URL);
            }
            if (postJson != null && postJson != "") {
                JSONObject jsonObject = JSON.parseObject(postJson);
                String state = jsonObject.getString("state");
                if (StringUtils.equals("true", state)) {
                    //expiresIn 为 token 有效期的时长
                    String expiresIn = jsonObject.getString("expiresIn");
                    token = jsonObject.getString("token");
                    Long expiresTime = System.currentTimeMillis() + Long.parseLong(expiresIn);
                    list.add(String.valueOf(expiresTime));
                    list.add(token);

                    //把获取到的 token 存储到 ConcurrentHashMap 中
                    KeyMap.put(TOKEN, list);
                }
            }
            log.debug("请求新的 token：{} ......", list);
            return token;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
```


官网：https://www.baeldung.com/guava-cache
参考：https://segmentfault.com/a/1190000011105644