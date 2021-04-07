---
title: '[Calling Third-party API - OpenFeign] 4 Feign Spring Cloud CircuitBreaker Fallbacks'
catalog: true
date: 2021-02-06 16:26:04
subtitle: Feign is a Java to HTTP client binder inspired by Retrofit, JAXRS-2.0, and WebSocket. Feign's first goal was reducing the complexity of binding Denominator uniformly to HTTP APIs regardless of ReSTfulness...
header-img: /img/header_img/tag_bg2.jpg
tags:
- Calling Third-party API
- OpenFeign
---

## 前言
-  [Feign makes writing java http clients easier](https://v-vincen.github.io/2020/11/18/Calling-Third-party-API-OpenFeign-1-Feign-makes-writing-java-http-clients-easier/) ：主要讲述了 `Feign` 的基本用法。
-  [DefaultFeignClient Case and Summary](https://v-vincen.github.io/2021/01/31/Calling-Third-party-API-OpenFeign-2-DefaultFeignClient-Case-and-Summary/)：主要举例 `Feign` 原生注解调用第三方服务、`Feign` 结合 `SpringMvc` 注解调用第三方服务，并且简要封装了一个创建 `Feign` 构造器的工具类。
-  [Feign Call Case](https://v-vincen.github.io/2021/02/03/Calling-Third-party-API-OpenFeign-3-Feign-Call-Case/)：通过 `Feign` 结合 `SpringMvc` 注解的构造方式，简要模拟实际开发过程中的调用第三方服务的案例。

那么博主今天主要举例并总结的是，`Feign` 结合 `SpringBoot` 注解的具体用法，并且添加了熔断机制。老规矩直接上代码案例。


## Server
### Pom
```xml
    <properties>
        <feign.version>10.10.1</feign.version>
        <feign-form.version>3.8.0</feign-form.version>

        <!-- Spring Settings -->
        <spring-cloud.version>2020.0.0</spring-cloud.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
        <!-- feign-form -->
        <dependency>
            <groupId>io.github.openfeign.form</groupId>
            <artifactId>feign-form</artifactId>
            <version>${feign-form.version}</version>
        </dependency>
        <!-- feign-form-spring -->
        <dependency>
            <groupId>io.github.openfeign.form</groupId>
            <artifactId>feign-form-spring</artifactId>
            <version>${feign-form.version}</version>
        </dependency>
    </dependencies>
```

版本的说明：`spring-cloud-dependencies` 用的是当前最新版本，`spring-cloud-starter-openfeign` 版本为 3.0.0，从 3.0.0 开始 `spring-cloud-starter-openfeign` 的依赖中已经移除了 `feign-hystrix` 该依赖。也就是说 `spring-cloud-starter-openfeign` 3.0.0 及之后的版本不能在直接与 `Hystrix` 结合使用。当然你也可以自行添加 `feign-hystrix` 这个依赖，继续配合使用 `Hystrix` 所提供的熔断机制，不过这种方式只是博主理论上的认为可行，博主也没有真正尝试过，毕竟是否会有依赖上的冲突，只有真正尝试过后才知道。 说到这里，读者可能会问，那么 `spring-cloud-starter-openfeign` 3.0.0 及以后的版本，熔断机制应该如何处理。通过翻阅 [spring-cloud-openfeign](https://docs.spring.io/spring-cloud-openfeign/docs/current/reference/html/#spring-cloud-feign-circuitbreaker-fallback) 官网文档以及 [spring-cloud-openfeign Issues](https://github.com/spring-cloud/spring-cloud-circuitbreaker/issues/3) 的查看，大致可以有两中解决方法：
- 添加 `Resilience4J` 依赖来代替 `Hystrix`，具体可看官网的 [spring-cloud-openfeign Issues](https://github.com/spring-cloud/spring-cloud-circuitbreaker/issues/3)。
- `spring-cloud-starter-openfeign` 3.0.0 后增加了 `CircuitBreakerFactory` 这个类来处理熔断。

### Commons
#### ResponseDto
```java
/**
 * @param <T>
 * @author vincent
 * 返回前端数据封装
 */
@Data
@NoArgsConstructor
public class ResponseDto<T> implements Serializable {
    private int status;
    private String msg;
    private T data;

    public ResponseDto(int status) {
        this.status = status;
    }

    public ResponseDto(int status, T data) {
        this.status = status;
        this.data = data;
    }

    public ResponseDto(int status, String msg, T data) {
        this.status = status;
        this.msg = msg;
        this.data = data;
    }

    public ResponseDto(int status, String msg) {
        this.status = status;
        this.msg = msg;
    }

    public ResponseDto(ResultCode responseCode, T data) {
        this(responseCode, null, data);
    }

    private ResponseDto(ResultCode responseCode, String detailMsg, T data) {
        this.status = responseCode.getCode();
        this.msg = Optional.ofNullable(detailMsg)
                .map(deMsg -> String.format("%s : %s", responseCode.getDesc(), deMsg))
                .orElse(responseCode.getDesc());
        this.data = data;
    }

    @JsonIgnore
    public boolean isSuccess() {
        return this.status == ResultCode.SUCCESS.getCode();
    }

    public int getStatus() {
        return status;
    }

    public String getMsg() {
        return msg;
    }

    public T getData() {
        return data;
    }

    public static <T> ResponseDto<T> success() {
        return success(null);
    }

    public static <T> ResponseDto<T> success(T data) {
        return new ResponseDto<>(ResultCode.SUCCESS, data);
    }

    public static <T> ResponseDto<T> success(String msg, T data) {
        return new ResponseDto<>(ResultCode.SUCCESS, msg, data);
    }

    public static <T> ResponseDto<T> error() {
        return error(ResultCode.ERROR, null);
    }

    public static <T> ResponseDto<T> error(String errorMsg) {
        return new ResponseDto<>(ResultCode.ERROR, errorMsg, null);
    }

    public static <T> ResponseDto<T> error(ResultCode responseCode) {
        return error(responseCode, null, null);
    }

    public static <T> ResponseDto<T> error(ResultCode responseCode, String errorMsg) {
        return error(responseCode, errorMsg, null);
    }

    public static <T> ResponseDto<T> error(ResultCode responseCode, String errorMsg, T data) {
        return new ResponseDto<>(responseCode, errorMsg, data);
    }

    public static <T> ResponseDto<T> exception(String exceptionMsg) {
        return new ResponseDto<>(ResultCode.EXCEPTION, exceptionMsg, null);
    }
}
```

#### ResultCode
```java
/**
 * @author vincent
 */
public interface ResultCode {
    /**
     * 获取 code
     *
     * @return int
     */
    int getCode();

    /**
     * 获取 desc
     *
     * @return String
     */
    String getDesc();

    BaseResultCode SUCCESS = BaseResultCode.SUCCESS;
    BaseResultCode ERROR = BaseResultCode.ERROR;
    BaseResultCode EXCEPTION = BaseResultCode.EXCEPTION;
}
```

#### BaseResultCode
```java
/**
 * @author vincent
 * 返回状态的枚举
 */
public enum BaseResultCode implements ResultCode {
    /**
     * SUCCESS: 0
     * ERROR: 1
     * Exception: -1
     */
    SUCCESS(0, "SUCCESS"),
    ERROR(1, "ERROR"),
    EXCEPTION(-1, "Exception");

    private final int code;
    private final String desc;

    BaseResultCode(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    @Override
    public int getCode() {
        return code;
    }

    @Override
    public String getDesc() {
        return desc;
    }
}
```

### Controller
#### ServerSimulatorController
```java
/**
 * @author vincent
 */
@RestController
@RequestMapping(value = "/server")
@Slf4j
public class ServerSimulatorController {
    @RequestMapping(value = "/token", method = RequestMethod.GET)
    public AuthServerDto getAccessToken(@RequestParam("grant_type") String grantType,
                                        @RequestParam("client_id") String clientId,
                                        @RequestParam("client_secret") String clientSecret) {
        log.info("GetAccessToken method request parameters -> grant_type: {}, client_id: {},client_secret: {} ...", grantType, clientId, clientSecret);
        // token 的校验，这里就不再赘述了，上一篇文章中已经举了一个简单的例子
        AuthServerDto authDto = new AuthServerDto();
        authDto.setAccessToken(UUID.randomUUID().toString());
        authDto.setTokenType("bearer");
        authDto.setExpiresIn(3 * 60 * 1000);
        return authDto;
    }

    @GetMapping(value = "/user/get")
    public ResponseDto<TpUserDto> getUserDto(@RequestParam("accessToken") String accessToken, @RequestParam("userId") String userId) {
        log.info("GetUserDto method request parameters -> accessToken: [{}], userId: [{}] ...", accessToken, userId);
        TpUserDto userDto = new TpUserDto();
        userDto.setUserId(userId);
        userDto.setUserCode("USERCODE_VINCENT");
        userDto.setUserName("Vincent");
        return ResponseDto.success(userDto);
    }

    @PostMapping(value = "/department/list")
    public ResponseDto<List<TpDepartmentDto>> getDepartmentDtos(@RequestParam("accessToken") String accessToken, @RequestBody TpDepartmentQueryDto queryDto) {
        log.info("GetDepartmentDtos method request parameters -> accessToken: [{}], queryDto: [{}] ...", accessToken, queryDto);
        return ResponseDto.success(Lists.newArrayList(
                new TpDepartmentDto(19000L, "xxx公司", "xxx_company", 1L, queryDto.getPosition(), 1L),
                new TpDepartmentDto(19580L, "人事部", "personnel_department", 19000L, queryDto.getPosition(), 23L),
                new TpDepartmentDto(19581L, "财务部", "finance_department", 19000L, queryDto.getPosition(), 24L),
                new TpDepartmentDto(19582L, "技术部", "technology_department", 19000L, queryDto.getPosition(), 25L)
        ));
    }
}
```

## Client
### Application
#### CallingThirdPartyApiApplicationTests
```java
@SpringBootApplication
@EnableFeignClients
public class CallingThirdPartyApiApplicationTests {

    public static void main(String[] args) {
        SpringApplication.run(CallingThirdPartyApiApplicationTests.class, args);
    }

}
```

### Config
#### <font color='red'> CircuitBreakerConfig </font>
上文已经说过 `spring-cloud-starter-openfeign` 3.0.0 以及之后的版本，移除了 `feign-hystrix` 依赖，而该依赖就是用来处理熔断回滚的。所以 `spring-cloud-starter-openfeign` 3.0.0 以及之后的版本，需要添加额外的熔断配置。具体配置如下（参考 spring-cloud-starter-openfeign 官方案例 [CircuitBreakerTests](https://github.com/spring-cloud/spring-cloud-openfeign/blob/v3.0.1/spring-cloud-openfeign-core/src/test/java/org/springframework/cloud/openfeign/circuitbreaker/CircuitBreakerTests.java)）：
```java
@Slf4j
@Configuration
public class CircuitBreakerConfig {
    @Bean
    MyCircuitBreaker myCircuitBreaker() {
        return new MyCircuitBreaker();
    }

    @SuppressWarnings("rawtypes")
    @Bean
    CircuitBreakerFactory circuitBreakerFactory(MyCircuitBreaker myCircuitBreaker) {
        return new CircuitBreakerFactory() {
            @Override
            public CircuitBreaker create(String id) {
                log.info("Creating a circuit breaker with id [" + id + "]");
                return myCircuitBreaker;
            }

            @Override
            protected ConfigBuilder configBuilder(String id) {
                return Object::new;
            }

            @Override
            public void configureDefault(Function defaultConfiguration) {

            }
        };
    }

    static class MyCircuitBreaker implements CircuitBreaker {

        AtomicBoolean runWasCalled = new AtomicBoolean();

        @Override
        public <T> T run(Supplier<T> toRun) {
            try {
                this.runWasCalled.set(true);
                return toRun.get();
            }
            catch (Throwable throwable) {
                throw new NoFallbackAvailableException("No fallback available.", throwable);
            }
        }

        @Override
        public <T> T run(Supplier<T> toRun, Function<Throwable, T> fallback) {
            try {
                return run(toRun);
            }
            catch (Throwable throwable) {
                return fallback.apply(throwable);
            }
        }

        public void clear() {
            this.runWasCalled.set(false);
        }
    }
}
```

### Two Circuit Breaker Methods
-  [Fallback](#Fallback)：在 `@FeignClient` 注解属性中，需要定义 `fallback` 该属性，而该属性需要自定义实现第三方调用接口，这句话看着有点晕，那么直接看下面的案例。如：`TpApiClient` 这个类是客户端根据服务端定义的第三方调用接口，当服务端出现故障或者网络等问题时，为了确保客户端不会因为这些问题而影响运行。那么最实用的做法就是，客户端自定义一个熔断机制。当客户端调用服务端接口时，服务端发生故障时，那么客户端就会自行触发该熔断机制。`spring-cloud-starter-openfeign` 就已经为我们提供了这套逻辑处理，具体的做法就是，我们需要额外自定义实现 `TpApiClient` 该接口，当调用 `TpApiClient` 该接口下的方法不成功时，那么就会触发熔断机制 `TpApiClientFallback` 实现类中对应的方法。
-  [FallbackFactory](#FallbackFactory)：在 `@FeignClient` 注解属性中，还提供了一个属性 `fallbackFactory`，通过属性名我们大致就能明白其含义。该属性提供给我们以工厂模式的方式来自定义熔断机制。如下案例：我们需要实现 `FallbackFactory<T>` 接口，并重写 `public TpApiClientWithFactory create(Throwable cause)` 方法，该方法就是我们具体需要实现的熔断方法。

#### Fallback
##### TpApiClient
```java
/**
 * @author vincent
 */
@FeignClient(name = "tpApiClient", url = "http://localhost:8080/server", fallback = TpApiClient.TpApiClientFallback.class)
public interface TpApiClient {
    @RequestMapping(value = "/token", method = RequestMethod.GET)
    AuthServerDto getAccessToken(@RequestParam("grant_type") String grantType, @RequestParam("client_id") String clientId, @RequestParam("client_secret") String clientSecret);

    @GetMapping(value = "/user/get")
    ResponseDto<TpUserDto> getUserDto(@RequestParam("accessToken") String accessToken, @RequestParam("userId") String userId);

    @PostMapping(value = "/department/list")
    ResponseDto<List<TpDepartmentDto>> getDepartmentDtos(@RequestParam("accessToken") String accessToken, @RequestBody TpDepartmentQueryDto queryDto);

    /**
     * @author vincent
     * 熔断器
     */
    @Slf4j
    @Component
    class TpApiClientFallback implements TpApiClient {
        @Override
        public AuthServerDto getAccessToken(String grantType, String clientId, String clientSecret) {
            log.error("Did not get to token...");
            throw new NoFallbackAvailableException("Boom!", new RuntimeException("Did not get to token..."));
        }

        @Override
        public ResponseDto<TpUserDto> getUserDto(String accessToken, String userId) {
            log.error("Not Find TpUserDto...");
            return ResponseDto.error("Not Find TpUserDto...");
        }

        @Override
        public ResponseDto<List<TpDepartmentDto>> getDepartmentDtos(String accessToken, TpDepartmentQueryDto queryDto) {
            log.error("Not Find TpDepartmentDtos...");
            return ResponseDto.error("Not Find TpDepartmentDtos...");
        }
    }
}
```

#### FallbackFactory
- [WithFactory](#WithFactory)：[spring-cloud-starter-openfeign](https://docs.spring.io/spring-cloud-openfeign/docs/current/reference/html/#spring-cloud-feign-circuitbreaker-fallback) 官网给出的熔断回滚工厂模式案例。
- [WrapFactory](#WrapFactory)：根据官网给出的熔断回滚工厂模式，进行了简要的封装。

##### WithFactory
###### TpApiClientWithFactory
```java
/**
 * @author vincent
 */
@FeignClient(name = "TpApiClientWithFactory", url = "http://localhost:8080/server", fallbackFactory = TpApiClientWithFactory.TpApiClientFallbackFactory.class)
public interface TpApiClientWithFactory {
    @RequestMapping(value = "/token", method = RequestMethod.GET)
    AuthServerDto getAccessToken(@RequestParam("grant_type") String grantType, @RequestParam("client_id") String clientId, @RequestParam("client_secret") String clientSecret);

    @GetMapping(value = "/user/get")
    ResponseDto<TpUserDto> getUserDto(@RequestParam("accessToken") String accessToken, @RequestParam("userId") String userId);

    @PostMapping(value = "/department/list")
    ResponseDto<List<TpDepartmentDto>> getDepartmentDtos(@RequestParam("accessToken") String accessToken, @RequestBody TpDepartmentQueryDto queryDto);


    @Component
    class TpApiClientFallbackFactory implements FallbackFactory<TpApiClientWithFactory> {
        @Override
        public TpApiClientWithFactory create(Throwable cause) {
            return new TpApiClientWithFactory() {
                @Override
                public AuthServerDto getAccessToken(String grantType, String clientId, String clientSecret) {
                    throw new RuntimeException(cause);
                }

                @Override
                public ResponseDto<TpUserDto> getUserDto(String accessToken, String userId) {
                    return new ResponseDto<>(-100, cause.getClass().getName() + ": detailMessage[ " + Optional.ofNullable(cause.getMessage()).orElse("") + " ]");
                }

                @Override
                public ResponseDto<List<TpDepartmentDto>> getDepartmentDtos(String accessToken, TpDepartmentQueryDto queryDto) {
                    return new ResponseDto<>(-100, cause.getClass().getName() + ": detailMessage[ " + Optional.ofNullable(cause.getMessage()).orElse("") + " ]");
                }
            };
        }
    }
}
```
写到这里，按道理来说应该已经算是结束了，但是我不经会有这样一个疑问。如果客户端需要大量的调用服务端的接口，可能是 50 个接口甚至更多的接口，那么我们是不是也得实现并重写这么多接口，来完成熔断机制的编写呢。这无疑会是一个很大的工作量，是否有更为简单高效的方法呢。当然有，博主在 `FallbackFactory<T>` 接口的基础上，简要的封装了一个工具类，该工具类中通过 `spring` 所提供的动态代理 `cglib` 的方式来帮我们动态生成泛型 `T`（也就是第三方调用接口）的实现类（也就是我们所需要定义的熔断机制）。这话看着有点绕，还是老规矩直接上代码。

##### WrapFactory
###### ClassUtils
```java
/**
 * @author vincent
 */
public class ClassUtils {
    public static <T> Class<T> getGenericBySuperClass(Class<?> clazz) {
        // getGenericSuperclass: 获取父类的泛型
        Type genericSuperclass = clazz.getGenericSuperclass();
        return getGenericType(genericSuperclass);
    }

    public static <T> Class<T> getGenericByInterface(Class<?> clazz) {
        /*
         * getGenericInterfaces: 获取父接口的泛型
         * 例: 父接口 -> interface A<T>
         *     子实现类 -> class B implements A<T>
         *     Class<B> clazz = B.class
         *     clazz.getGenericInterfaces(): 获取 A 接口的泛型（因为接口是多实现的, 所以该方法返回的是 Type[] ）
         */
        Type[] genericInterfaces = clazz.getGenericInterfaces();
        if (ArrayUtils.isEmpty(genericInterfaces)) {
            return null;
        }

        Type genericInterface = genericInterfaces[0];
        return getGenericType(genericInterface);
    }

    @SuppressWarnings("unchecked")
    private static <T> Class<T> getGenericType(Type genericSuperclass) {
        // ParameterizedType 是一个接口，这个类可以用来检验泛型是否被参数化
        if (!(genericSuperclass instanceof ParameterizedType)) {
            return null;
        }

        ParameterizedType parameterizedType = (ParameterizedType) genericSuperclass;
        //  .getActualTypeArguments(): 获取这个泛型, 实例化后的具体类型
        Type[] actualTypeArguments = parameterizedType.getActualTypeArguments();
        if (ArrayUtils.isEmpty(actualTypeArguments)) {
            return null;
        }

        Type actualTypeArgument = actualTypeArguments[0];
        if (!(actualTypeArgument instanceof Class)) {
            return null;
        }
        return (Class<T>) actualTypeArgument;
    }
}
```

###### <font color='red'> DefaultFallbackFactory </font>
```java
/**
 * @author vincent
 * 熔断器工厂
 */
public interface DefaultFallbackFactory<T> extends FallbackFactory<T> {

    Map<Class<?>, Function<Throwable, Object>> wrapperException();

    static ResponseDto<?> simpleFailResponseDto(Throwable cause) {
        ResponseDto<?> responseDto = new ResponseDto<>();
        responseDto.setStatus(-100);
        responseDto.setMsg(cause.getClass().getName() + ": detailMessage[ " + Optional.ofNullable(cause.getMessage()).orElse("") + " ]");
        return responseDto;
    }

    @Override
    default T create(Throwable cause) {
        return simpleFailClient(cause);
    }

    @SuppressWarnings("unchecked")
    default T simpleFailClient(Throwable cause) {
        Class<Object> clazz = ClassUtils.getGenericByInterface(this.getClass());
        Map<Class<?>, Function<Throwable, Object>> map = Optional.ofNullable(wrapperException()).orElse(Collections.emptyMap());
        // 动态代理 cglib, 这里是动态生成 T 的实现类
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(clazz);
        enhancer.setCallback((InvocationHandler) (o, method, objects) -> {
            Class<?> returnType = method.getReturnType();
            if (map.containsKey(returnType)) {
                return map.get(returnType).apply(cause);
            }
            return new RuntimeException(cause);
        });
        return (T) enhancer.create();
    }
}
```

###### TpApiClientWrapFactory
```java
/**
 * @author vincent
 */
@FeignClient(name = "TpApiClientWrapFactory", url = "http://localhost:8080/server", fallbackFactory = TpApiClientFallbackFactory.class)
public interface TpApiClientWrapFactory {
    @RequestMapping(value = "/token", method = RequestMethod.GET)
    AuthServerDto getAccessToken(@RequestParam("grant_type") String grantType, @RequestParam("client_id") String clientId, @RequestParam("client_secret") String clientSecret);

    @GetMapping(value = "/user/get")
    ResponseDto<TpUserDto> getUserDto(@RequestParam("accessToken") String accessToken, @RequestParam("userId") String userId);

    @PostMapping(value = "/department/list")
    ResponseDto<List<TpDepartmentDto>> getDepartmentDtos(@RequestParam("accessToken") String accessToken, @RequestBody TpDepartmentQueryDto queryDto);


    @Component
    class TpApiClientFallbackFactory implements DefaultFallbackFactory<TpApiClientWrapFactory> {

        private static final Map<Class<?>, Function<Throwable, Object>> WRAPPER_EXCEPTION = ImmutableMap.of(
                // 如果返回类型是 AuthServerDto, 在 http 调用失败的情况下抛出 RuntimeException(e)
                AuthServerDto.class, e -> {
                    throw new RuntimeException(e);
                },
                // 如果返回类型是 ResponseDto, 在 http 调用失败的情况下返回 simpleFailResponseDto(cause)
                ResponseDto.class, DefaultFallbackFactory::simpleFailResponseDto
        );

        @Override
        public Map<Class<?>, Function<Throwable, Object>> wrapperException() {
            return WRAPPER_EXCEPTION;
        }
    }
}
```

### Test
#### CloudFeignFallbackTest
```java
@SpringBootTest(classes = CallingThirdPartyApiApplicationTests.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        value = {"feign.circuitbreaker.enabled=true"})
@Slf4j
public class CloudFeignFallbackTest {

    @Qualifier("com.vincent.callingthirdpartyapi.open_feign.spring_cloud_open_feign.fallback.TpApiClient")
    @Autowired
    private TpApiClient tpApiClient;

    @Autowired
    private TpApiClientWithFactory tpApiClientWithFactory;

    @Autowired
    private TpApiClientWrapFactory tpApiClientWrapFactory;

    @Test
    public void tpApiClientTest() throws JsonProcessingException {
        AuthServerDto accessToken = tpApiClient.getAccessToken("client_credentials", "client_id", "client_secret");
        log.info("GetAccessToken Method: {}", new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(accessToken));

        ResponseDto<TpUserDto> tpUserDtos = tpApiClient.getUserDto(UUID.randomUUID().toString(), "userId");
        log.info("GetUserDto Method: {}", new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(tpUserDtos));

        TpDepartmentQueryDto queryDto = new TpDepartmentQueryDto();
        queryDto.setIdOrParentId(19000L);
        queryDto.setPosition("员工");
        ResponseDto<List<TpDepartmentDto>> departmentDtos = tpApiClient.getDepartmentDtos(UUID.randomUUID().toString(), queryDto);
        log.info("GetDepartmentDtos Method: {}", new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(departmentDtos));
    }
    
    @Test
    public void tpApiClientWithFactoryTest() throws JsonProcessingException {
        AuthServerDto accessToken = tpApiClientWithFactory.getAccessToken("client_credentials", "client_id", "client_secret");
        log.info("GetAccessToken Method: {}", new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(accessToken));

        ResponseDto<TpUserDto> tpUserDtos = tpApiClientWithFactory.getUserDto(UUID.randomUUID().toString(), "userId");
        log.info("GetUserDto Method: {}", new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(tpUserDtos));

        TpDepartmentQueryDto queryDto = new TpDepartmentQueryDto();
        queryDto.setIdOrParentId(19000L);
        queryDto.setPosition("员工");
        ResponseDto<List<TpDepartmentDto>> departmentDtos = tpApiClientWithFactory.getDepartmentDtos(UUID.randomUUID().toString(), queryDto);
        log.info("GetDepartmentDtos Method: {}", new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(departmentDtos));
    }

    @Test
    public void tpApiClientWrapFactoryTest() throws JsonProcessingException {
        AuthServerDto accessToken = tpApiClientWrapFactory.getAccessToken("client_credentials", "client_id", "client_secret");
        log.info("GetAccessToken Method: {}", new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(accessToken));

        ResponseDto<TpUserDto> tpUserDtos = tpApiClientWrapFactory.getUserDto(UUID.randomUUID().toString(), "userId");
        log.info("GetUserDto Method: {}", new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(tpUserDtos));

        TpDepartmentQueryDto queryDto = new TpDepartmentQueryDto();
        queryDto.setIdOrParentId(19000L);
        queryDto.setPosition("员工");
        ResponseDto<List<TpDepartmentDto>> departmentDtos = tpApiClientWrapFactory.getDepartmentDtos(UUID.randomUUID().toString(), queryDto);
        log.info("GetDepartmentDtos Method: {}", new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(departmentDtos));
    }
}
```
**主要：**启动测试类时，服务端不需要启动。

#### TpApiClientTest Log
```
2021-02-06 19:13:45.485  INFO 30116 --- [           main] c.v.c.o.s.config.CircuitBreakerConfig    : Creating a circuit breaker with id [tpApiClient_getAccessToken]
2021-02-06 19:13:45.498 ERROR 30116 --- [           main] .c.o.s.f.TpApiClient$TpApiClientFallback : Did not get to token...

java.lang.IllegalStateException: java.lang.reflect.InvocationTargetException

	at org.springframework.cloud.openfeign.FeignCircuitBreakerInvocationHandler.lambda$invoke$0(FeignCircuitBreakerInvocationHandler.java:88)
	at com.vincent.callingthirdpartyapi.open_feign.spring_cloud_open_feign.config.CircuitBreakerConfig$MyCircuitBreaker.run(CircuitBreakerConfig.java:66)
	at org.springframework.cloud.openfeign.FeignCircuitBreakerInvocationHandler.invoke(FeignCircuitBreakerInvocationHandler.java:91)
	at com.sun.proxy.$Proxy86.getAccessToken(Unknown Source)
	at com.vincent.callingthirdpartyapi.open_feign.spring_cloud_open_feign.CloudFeignFallbackTest.tpApiClientTest(CloudFeignFallbackTest.java:41)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.junit.platform.commons.util.ReflectionUtils.invokeMethod(ReflectionUtils.java:688)
	at org.junit.jupiter.engine.execution.MethodInvocation.proceed(MethodInvocation.java:60)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain$ValidatingInvocation.proceed(InvocationInterceptorChain.java:131)
	at org.junit.jupiter.engine.extension.TimeoutExtension.intercept(TimeoutExtension.java:149)
	at org.junit.jupiter.engine.extension.TimeoutExtension.interceptTestableMethod(TimeoutExtension.java:140)
	at org.junit.jupiter.engine.extension.TimeoutExtension.interceptTestMethod(TimeoutExtension.java:84)
	at org.junit.jupiter.engine.execution.ExecutableInvoker$ReflectiveInterceptorCall.lambda$ofVoidMethod$0(ExecutableInvoker.java:115)
	at org.junit.jupiter.engine.execution.ExecutableInvoker.lambda$invoke$0(ExecutableInvoker.java:105)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain$InterceptedInvocation.proceed(InvocationInterceptorChain.java:106)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain.proceed(InvocationInterceptorChain.java:64)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain.chainAndInvoke(InvocationInterceptorChain.java:45)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain.invoke(InvocationInterceptorChain.java:37)
	at org.junit.jupiter.engine.execution.ExecutableInvoker.invoke(ExecutableInvoker.java:104)
	at org.junit.jupiter.engine.execution.ExecutableInvoker.invoke(ExecutableInvoker.java:98)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$invokeTestMethod$6(TestMethodTestDescriptor.java:210)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.invokeTestMethod(TestMethodTestDescriptor.java:206)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:131)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:65)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$5(NodeTestTask.java:139)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$7(NodeTestTask.java:129)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:127)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:126)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:84)
	at java.util.ArrayList.forEach(ArrayList.java:1257)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:38)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$5(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$7(NodeTestTask.java:129)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:127)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:126)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:84)
	at java.util.ArrayList.forEach(ArrayList.java:1257)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:38)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$5(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$7(NodeTestTask.java:129)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:127)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:126)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:84)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:32)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:51)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:108)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:88)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.lambda$execute$0(EngineExecutionOrchestrator.java:54)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.withInterceptedStreams(EngineExecutionOrchestrator.java:67)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:52)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:96)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:75)
	at com.intellij.junit5.JUnit5IdeaTestRunner.startRunnerWithArgs(JUnit5IdeaTestRunner.java:71)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater.startRunnerWithArgs(IdeaTestRunner.java:33)
	at com.intellij.rt.junit.JUnitStarter.prepareStreamsAndStart(JUnitStarter.java:220)
	at com.intellij.rt.junit.JUnitStarter.main(JUnitStarter.java:53)
Caused by: java.lang.reflect.InvocationTargetException
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.springframework.cloud.openfeign.FeignCircuitBreakerInvocationHandler.lambda$invoke$0(FeignCircuitBreakerInvocationHandler.java:85)
	... 69 more
Caused by: org.springframework.cloud.client.circuitbreaker.NoFallbackAvailableException: Boom!
	at com.vincent.callingthirdpartyapi.open_feign.spring_cloud_open_feign.fallback.TpApiClient$TpApiClientFallback.getAccessToken(TpApiClient.java:45)
	... 74 more
Caused by: java.lang.RuntimeException: Did not get to token...
	... 75 more

2021-02-06 19:14:42.360  INFO 30128 --- [           main] c.v.c.o.s.config.CircuitBreakerConfig    : Creating a circuit breaker with id [tpApiClient_getUserDto]
2021-02-06 19:14:42.376 ERROR 30128 --- [           main] .c.o.s.f.TpApiClient$TpApiClientFallback : Not Find TpUserDto...
2021-02-06 19:14:42.421  INFO 30128 --- [           main] c.v.c.o.s.CloudFeignFallbackTest         : GetUserDto Method: {
  "status" : 1,
  "msg" : "ERROR : Not Find TpUserDto...",
  "data" : null
}
2021-02-06 19:14:42.421  INFO 30128 --- [           main] c.v.c.o.s.config.CircuitBreakerConfig    : Creating a circuit breaker with id [tpApiClient_getDepartmentDtos]
2021-02-06 19:14:42.434 ERROR 30128 --- [           main] .c.o.s.f.TpApiClient$TpApiClientFallback : Not Find TpDepartmentDtos...
2021-02-06 19:14:42.435  INFO 30128 --- [           main] c.v.c.o.s.CloudFeignFallbackTest         : GetDepartmentDtos Method: {
  "status" : 1,
  "msg" : "ERROR : Not Find TpDepartmentDtos...",
  "data" : null
}
```

#### TpApiClientWithFactoryTest Log
```
2021-02-06 19:20:42.279  INFO 30174 --- [           main] c.v.c.o.s.config.CircuitBreakerConfig    : Creating a circuit breaker with id [TpApiClientWithFactory_getAccessToken]

java.lang.IllegalStateException: java.lang.reflect.InvocationTargetException

	at org.springframework.cloud.openfeign.FeignCircuitBreakerInvocationHandler.lambda$invoke$0(FeignCircuitBreakerInvocationHandler.java:88)
	at com.vincent.callingthirdpartyapi.open_feign.spring_cloud_open_feign.config.CircuitBreakerConfig$MyCircuitBreaker.run(CircuitBreakerConfig.java:66)
	at org.springframework.cloud.openfeign.FeignCircuitBreakerInvocationHandler.invoke(FeignCircuitBreakerInvocationHandler.java:91)
	at com.sun.proxy.$Proxy87.getAccessToken(Unknown Source)
	at com.vincent.callingthirdpartyapi.open_feign.spring_cloud_open_feign.CloudFeignFallbackTest.tpApiClientWithFactoryTest(CloudFeignFallbackTest.java:56)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.junit.platform.commons.util.ReflectionUtils.invokeMethod(ReflectionUtils.java:688)
	at org.junit.jupiter.engine.execution.MethodInvocation.proceed(MethodInvocation.java:60)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain$ValidatingInvocation.proceed(InvocationInterceptorChain.java:131)
	at org.junit.jupiter.engine.extension.TimeoutExtension.intercept(TimeoutExtension.java:149)
	at org.junit.jupiter.engine.extension.TimeoutExtension.interceptTestableMethod(TimeoutExtension.java:140)
	at org.junit.jupiter.engine.extension.TimeoutExtension.interceptTestMethod(TimeoutExtension.java:84)
	at org.junit.jupiter.engine.execution.ExecutableInvoker$ReflectiveInterceptorCall.lambda$ofVoidMethod$0(ExecutableInvoker.java:115)
	at org.junit.jupiter.engine.execution.ExecutableInvoker.lambda$invoke$0(ExecutableInvoker.java:105)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain$InterceptedInvocation.proceed(InvocationInterceptorChain.java:106)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain.proceed(InvocationInterceptorChain.java:64)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain.chainAndInvoke(InvocationInterceptorChain.java:45)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain.invoke(InvocationInterceptorChain.java:37)
	at org.junit.jupiter.engine.execution.ExecutableInvoker.invoke(ExecutableInvoker.java:104)
	at org.junit.jupiter.engine.execution.ExecutableInvoker.invoke(ExecutableInvoker.java:98)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$invokeTestMethod$6(TestMethodTestDescriptor.java:210)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.invokeTestMethod(TestMethodTestDescriptor.java:206)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:131)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:65)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$5(NodeTestTask.java:139)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$7(NodeTestTask.java:129)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:127)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:126)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:84)
	at java.util.ArrayList.forEach(ArrayList.java:1257)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:38)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$5(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$7(NodeTestTask.java:129)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:127)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:126)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:84)
	at java.util.ArrayList.forEach(ArrayList.java:1257)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:38)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$5(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$7(NodeTestTask.java:129)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:127)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:126)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:84)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:32)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:51)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:108)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:88)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.lambda$execute$0(EngineExecutionOrchestrator.java:54)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.withInterceptedStreams(EngineExecutionOrchestrator.java:67)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:52)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:96)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:75)
	at com.intellij.junit5.JUnit5IdeaTestRunner.startRunnerWithArgs(JUnit5IdeaTestRunner.java:71)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater.startRunnerWithArgs(IdeaTestRunner.java:33)
	at com.intellij.rt.junit.JUnitStarter.prepareStreamsAndStart(JUnitStarter.java:220)
	at com.intellij.rt.junit.JUnitStarter.main(JUnitStarter.java:53)
Caused by: java.lang.reflect.InvocationTargetException
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.springframework.cloud.openfeign.FeignCircuitBreakerInvocationHandler.lambda$invoke$0(FeignCircuitBreakerInvocationHandler.java:85)
	... 69 more
Caused by: java.lang.RuntimeException: org.springframework.cloud.client.circuitbreaker.NoFallbackAvailableException: No fallback available.
	at com.vincent.callingthirdpartyapi.open_feign.spring_cloud_open_feign.fallbackwithfactory.TpApiClientWithFactory$TpApiClientFallbackFactory$1.getAccessToken(TpApiClientWithFactory.java:43)
	... 74 more
Caused by: org.springframework.cloud.client.circuitbreaker.NoFallbackAvailableException: No fallback available.
	at com.vincent.callingthirdpartyapi.open_feign.spring_cloud_open_feign.config.CircuitBreakerConfig$MyCircuitBreaker.run(CircuitBreakerConfig.java:56)
	at com.vincent.callingthirdpartyapi.open_feign.spring_cloud_open_feign.config.CircuitBreakerConfig$MyCircuitBreaker.run(CircuitBreakerConfig.java:63)
	... 68 more
Caused by: feign.RetryableException: Connection refused (Connection refused) executing GET http://localhost:8080/server/token?grant_type=client_credentials&client_id=client_id&client_secret=client_secret
	at feign.FeignException.errorExecuting(FeignException.java:249)
	at feign.SynchronousMethodHandler.executeAndDecode(SynchronousMethodHandler.java:129)
	at feign.SynchronousMethodHandler.invoke(SynchronousMethodHandler.java:89)
	at org.springframework.cloud.openfeign.FeignCircuitBreakerInvocationHandler.lambda$asSupplier$1(FeignCircuitBreakerInvocationHandler.java:99)
	at com.vincent.callingthirdpartyapi.open_feign.spring_cloud_open_feign.config.CircuitBreakerConfig$MyCircuitBreaker.run(CircuitBreakerConfig.java:53)
	... 69 more
Caused by: java.net.ConnectException: Connection refused (Connection refused)
	at java.net.PlainSocketImpl.socketConnect(Native Method)
	at java.net.AbstractPlainSocketImpl.doConnect(AbstractPlainSocketImpl.java:350)
	at java.net.AbstractPlainSocketImpl.connectToAddress(AbstractPlainSocketImpl.java:206)
	at java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:188)
	at java.net.SocksSocketImpl.connect(SocksSocketImpl.java:392)
	at java.net.Socket.connect(Socket.java:606)
	at sun.net.NetworkClient.doConnect(NetworkClient.java:175)
	at sun.net.www.http.HttpClient.openServer(HttpClient.java:463)
	at sun.net.www.http.HttpClient.openServer(HttpClient.java:558)
	at sun.net.www.http.HttpClient.<init>(HttpClient.java:242)
	at sun.net.www.http.HttpClient.New(HttpClient.java:339)
	at sun.net.www.http.HttpClient.New(HttpClient.java:357)
	at sun.net.www.protocol.http.HttpURLConnection.getNewHttpClient(HttpURLConnection.java:1226)
	at sun.net.www.protocol.http.HttpURLConnection.plainConnect0(HttpURLConnection.java:1162)
	at sun.net.www.protocol.http.HttpURLConnection.plainConnect(HttpURLConnection.java:1056)
	at sun.net.www.protocol.http.HttpURLConnection.connect(HttpURLConnection.java:990)
	at sun.net.www.protocol.http.HttpURLConnection.getInputStream0(HttpURLConnection.java:1570)
	at sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1498)
	at java.net.HttpURLConnection.getResponseCode(HttpURLConnection.java:480)
	at feign.Client$Default.convertResponse(Client.java:108)
	at feign.Client$Default.execute(Client.java:104)
	at feign.SynchronousMethodHandler.executeAndDecode(SynchronousMethodHandler.java:119)
	... 72 more

2021-02-06 19:21:15.473  INFO 30180 --- [           main] c.v.c.o.s.config.CircuitBreakerConfig    : Creating a circuit breaker with id [TpApiClientWithFactory_getUserDto]
2021-02-06 19:21:15.531  INFO 30180 --- [           main] c.v.c.o.s.CloudFeignFallbackTest         : GetUserDto Method: {
  "status" : -100,
  "msg" : "org.springframework.cloud.client.circuitbreaker.NoFallbackAvailableException: detailMessage[ No fallback available. ]",
  "data" : null
}
2021-02-06 19:21:15.531  INFO 30180 --- [           main] c.v.c.o.s.config.CircuitBreakerConfig    : Creating a circuit breaker with id [TpApiClientWithFactory_getDepartmentDtos]
2021-02-06 19:21:15.544  INFO 30180 --- [           main] c.v.c.o.s.CloudFeignFallbackTest         : GetDepartmentDtos Method: {
  "status" : -100,
  "msg" : "org.springframework.cloud.client.circuitbreaker.NoFallbackAvailableException: detailMessage[ No fallback available. ]",
  "data" : null
}
```

#### TpApiClientWrapFactoryTest Log
```
2021-02-06 19:22:07.251  INFO 30189 --- [           main] c.v.c.o.s.config.CircuitBreakerConfig    : Creating a circuit breaker with id [TpApiClientWrapFactory_getAccessToken]

java.lang.IllegalStateException: java.lang.reflect.InvocationTargetException

	at org.springframework.cloud.openfeign.FeignCircuitBreakerInvocationHandler.lambda$invoke$0(FeignCircuitBreakerInvocationHandler.java:88)
	at com.vincent.callingthirdpartyapi.open_feign.spring_cloud_open_feign.config.CircuitBreakerConfig$MyCircuitBreaker.run(CircuitBreakerConfig.java:66)
	at org.springframework.cloud.openfeign.FeignCircuitBreakerInvocationHandler.invoke(FeignCircuitBreakerInvocationHandler.java:91)
	at com.sun.proxy.$Proxy88.getAccessToken(Unknown Source)
	at com.vincent.callingthirdpartyapi.open_feign.spring_cloud_open_feign.CloudFeignFallbackTest.tpApiClientWrapFactoryTest(CloudFeignFallbackTest.java:71)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.junit.platform.commons.util.ReflectionUtils.invokeMethod(ReflectionUtils.java:688)
	at org.junit.jupiter.engine.execution.MethodInvocation.proceed(MethodInvocation.java:60)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain$ValidatingInvocation.proceed(InvocationInterceptorChain.java:131)
	at org.junit.jupiter.engine.extension.TimeoutExtension.intercept(TimeoutExtension.java:149)
	at org.junit.jupiter.engine.extension.TimeoutExtension.interceptTestableMethod(TimeoutExtension.java:140)
	at org.junit.jupiter.engine.extension.TimeoutExtension.interceptTestMethod(TimeoutExtension.java:84)
	at org.junit.jupiter.engine.execution.ExecutableInvoker$ReflectiveInterceptorCall.lambda$ofVoidMethod$0(ExecutableInvoker.java:115)
	at org.junit.jupiter.engine.execution.ExecutableInvoker.lambda$invoke$0(ExecutableInvoker.java:105)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain$InterceptedInvocation.proceed(InvocationInterceptorChain.java:106)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain.proceed(InvocationInterceptorChain.java:64)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain.chainAndInvoke(InvocationInterceptorChain.java:45)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain.invoke(InvocationInterceptorChain.java:37)
	at org.junit.jupiter.engine.execution.ExecutableInvoker.invoke(ExecutableInvoker.java:104)
	at org.junit.jupiter.engine.execution.ExecutableInvoker.invoke(ExecutableInvoker.java:98)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$invokeTestMethod$6(TestMethodTestDescriptor.java:210)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.invokeTestMethod(TestMethodTestDescriptor.java:206)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:131)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:65)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$5(NodeTestTask.java:139)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$7(NodeTestTask.java:129)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:127)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:126)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:84)
	at java.util.ArrayList.forEach(ArrayList.java:1257)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:38)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$5(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$7(NodeTestTask.java:129)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:127)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:126)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:84)
	at java.util.ArrayList.forEach(ArrayList.java:1257)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:38)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$5(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$7(NodeTestTask.java:129)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:127)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:126)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:84)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:32)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:51)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:108)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:88)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.lambda$execute$0(EngineExecutionOrchestrator.java:54)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.withInterceptedStreams(EngineExecutionOrchestrator.java:67)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:52)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:96)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:75)
	at com.intellij.junit5.JUnit5IdeaTestRunner.startRunnerWithArgs(JUnit5IdeaTestRunner.java:71)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater.startRunnerWithArgs(IdeaTestRunner.java:33)
	at com.intellij.rt.junit.JUnitStarter.prepareStreamsAndStart(JUnitStarter.java:220)
	at com.intellij.rt.junit.JUnitStarter.main(JUnitStarter.java:53)
Caused by: java.lang.reflect.InvocationTargetException
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.springframework.cloud.openfeign.FeignCircuitBreakerInvocationHandler.lambda$invoke$0(FeignCircuitBreakerInvocationHandler.java:85)
	... 69 more
Caused by: java.lang.RuntimeException: org.springframework.cloud.client.circuitbreaker.NoFallbackAvailableException: No fallback available.
	at com.vincent.callingthirdpartyapi.open_feign.spring_cloud_open_feign.fallbackwrapfactory.TpApiClientWrapFactory$TpApiClientFallbackFactory.lambda$static$0(TpApiClientWrapFactory.java:44)
	at com.vincent.callingthirdpartyapi.open_feign.spring_cloud_open_feign.fallbackwrapfactory.DefaultFallbackFactory.lambda$simpleFailClient$0(DefaultFallbackFactory.java:44)
	at com.vincent.callingthirdpartyapi.open_feign.spring_cloud_open_feign.fallbackwrapfactory.TpApiClientWrapFactory$$EnhancerByCGLIB$$6a2a2665.getAccessToken(<generated>)
	... 74 more
Caused by: org.springframework.cloud.client.circuitbreaker.NoFallbackAvailableException: No fallback available.
	at com.vincent.callingthirdpartyapi.open_feign.spring_cloud_open_feign.config.CircuitBreakerConfig$MyCircuitBreaker.run(CircuitBreakerConfig.java:56)
	at com.vincent.callingthirdpartyapi.open_feign.spring_cloud_open_feign.config.CircuitBreakerConfig$MyCircuitBreaker.run(CircuitBreakerConfig.java:63)
	... 68 more
Caused by: feign.RetryableException: Connection refused (Connection refused) executing GET http://localhost:8080/server/token?grant_type=client_credentials&client_id=client_id&client_secret=client_secret
	at feign.FeignException.errorExecuting(FeignException.java:249)
	at feign.SynchronousMethodHandler.executeAndDecode(SynchronousMethodHandler.java:129)
	at feign.SynchronousMethodHandler.invoke(SynchronousMethodHandler.java:89)
	at org.springframework.cloud.openfeign.FeignCircuitBreakerInvocationHandler.lambda$asSupplier$1(FeignCircuitBreakerInvocationHandler.java:99)
	at com.vincent.callingthirdpartyapi.open_feign.spring_cloud_open_feign.config.CircuitBreakerConfig$MyCircuitBreaker.run(CircuitBreakerConfig.java:53)
	... 69 more
Caused by: java.net.ConnectException: Connection refused (Connection refused)
	at java.net.PlainSocketImpl.socketConnect(Native Method)
	at java.net.AbstractPlainSocketImpl.doConnect(AbstractPlainSocketImpl.java:350)
	at java.net.AbstractPlainSocketImpl.connectToAddress(AbstractPlainSocketImpl.java:206)
	at java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:188)
	at java.net.SocksSocketImpl.connect(SocksSocketImpl.java:392)
	at java.net.Socket.connect(Socket.java:606)
	at sun.net.NetworkClient.doConnect(NetworkClient.java:175)
	at sun.net.www.http.HttpClient.openServer(HttpClient.java:463)
	at sun.net.www.http.HttpClient.openServer(HttpClient.java:558)
	at sun.net.www.http.HttpClient.<init>(HttpClient.java:242)
	at sun.net.www.http.HttpClient.New(HttpClient.java:339)
	at sun.net.www.http.HttpClient.New(HttpClient.java:357)
	at sun.net.www.protocol.http.HttpURLConnection.getNewHttpClient(HttpURLConnection.java:1226)
	at sun.net.www.protocol.http.HttpURLConnection.plainConnect0(HttpURLConnection.java:1162)
	at sun.net.www.protocol.http.HttpURLConnection.plainConnect(HttpURLConnection.java:1056)
	at sun.net.www.protocol.http.HttpURLConnection.connect(HttpURLConnection.java:990)
	at sun.net.www.protocol.http.HttpURLConnection.getInputStream0(HttpURLConnection.java:1570)
	at sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1498)
	at java.net.HttpURLConnection.getResponseCode(HttpURLConnection.java:480)
	at feign.Client$Default.convertResponse(Client.java:108)
	at feign.Client$Default.execute(Client.java:104)
	at feign.SynchronousMethodHandler.executeAndDecode(SynchronousMethodHandler.java:119)
	... 72 more

2021-02-06 19:22:37.164  INFO 30197 --- [           main] c.v.c.o.s.config.CircuitBreakerConfig    : Creating a circuit breaker with id [TpApiClientWrapFactory_getUserDto]
2021-02-06 19:22:37.222  INFO 30197 --- [           main] c.v.c.o.s.CloudFeignFallbackTest         : GetUserDto Method: {
  "status" : -100,
  "msg" : "org.springframework.cloud.client.circuitbreaker.NoFallbackAvailableException: detailMessage[ No fallback available. ]",
  "data" : null
}
2021-02-06 19:22:37.222  INFO 30197 --- [           main] c.v.c.o.s.config.CircuitBreakerConfig    : Creating a circuit breaker with id [TpApiClientWrapFactory_getDepartmentDtos]
2021-02-06 19:22:37.237  INFO 30197 --- [           main] c.v.c.o.s.CloudFeignFallbackTest         : GetDepartmentDtos Method: {
  "status" : -100,
  "msg" : "org.springframework.cloud.client.circuitbreaker.NoFallbackAvailableException: detailMessage[ No fallback available. ]",
  "data" : null
}
```

Reference Resources：https://docs.spring.io/spring-cloud-openfeign/docs/current/reference/html/#spring-cloud-feign-circuitbreaker-fallback
Reference Resources：https://github.com/spring-cloud/spring-cloud-openfeign/blob/v3.0.1/spring-cloud-openfeign-core/src/test/java/org/springframework/cloud/openfeign/circuitbreaker/CircuitBreakerTests.java

Case Source Code：https://github.com/V-Vincen/calling-third-party-api





