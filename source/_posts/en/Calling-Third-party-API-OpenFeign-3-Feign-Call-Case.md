---
title: '[Calling Third-party API - OpenFeign] 3 Feign Call Case'
catalog: true
date: 2021-02-03 11:53:54
subtitle: Feign is a Java to HTTP client binder inspired by Retrofit, JAXRS-2.0, and WebSocket. Feign's first goal was reducing the complexity of binding Denominator uniformly to HTTP APIs regardless of ReSTfulness...
header-img: /img/header_img/tag_bg2.jpg
tags:
- Calling Third-party API
- OpenFeign
---

上文博主已经举例并总结了 Feign 的大部分用法。那么接下来，博主结合实际真正开发中的情况，简单模拟了一个案例。需求大致如下：A 公司需要对接并获取 B 公司的用户信息和部门信息。在这里可以把 A 公司看做是调用方，B 公司是被调用方。或者说 A 公司是客户端，B 公司是服务端。那么直接上代码。

## Server
### Commons
#### ResponseDto
```java
/**
 * @param <T>
 * @author vincent
 * 返回前端数据封装
 */
public class ResponseDto<T> implements Serializable {
    private int status;
    private String msg;
    private T data;

    private ResponseDto() {
    }

    private ResponseDto(int status) {
        this.status = status;
    }

    private ResponseDto(int status, T data) {
        this.status = status;
        this.data = data;
    }

    private ResponseDto(int status, String msg, T data) {
        this.status = status;
        this.msg = msg;
        this.data = data;
    }

    private ResponseDto(int status, String msg) {
        this.status = status;
        this.msg = msg;
    }

    private ResponseDto(ResultCode responseCode, T data) {
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

### config
#### AccessTokenFilter
这里简单的写了一个 Filter 过滤器，用于对 Token 进行校验。

```java
/**
 * @author vincent
 * 一个简单的校验 token 的过滤器
 */
@Component
@WebFilter(filterName = "AccessTokenFilter", urlPatterns = "/*")
@Order(value = 1)
@Slf4j
public class AccessTokenFilter implements Filter {
    private static final List<String> NOT_ALLOWED_PATHS = ImmutableList.of("/autho/user/get", "/autho/department/list");

    public static final Map<String, List<String>> TOKEN_MAP = new ConcurrentHashMap<>(2);

    private static final String KEY = "token";

    /**
     * 假设 token 有效时间为 3 分钟
     */
    public static final Long EXPIRES_IN = 3 * 60 * 1000L;

    @Override
    public void init(FilterConfig filterConfig) {
        System.out.println();
        log.info("AccessTokenFilter init...");
        // 初始化 token
        getTokenMap();
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        String path = request.getRequestURI().substring(request.getContextPath().length());
        if (NOT_ALLOWED_PATHS.contains(path)) {
            System.out.println();
            log.info("AccessTokenFilter doFilter...");
            log.info("AccessTokenFilter check Token start !!!!!!");
            String accessToken = request.getParameter("accessToken");
            if (StringUtils.isEmpty(accessToken)) {
                log.warn("Parameter accessToken is empty...");
                TpCallCaseUtils.writeJson("Parameter accessToken is empty...", response);
                return;
            }
            log.info("Parameter accessToken is [{}]...", accessToken);

            List<String> tokenList = TOKEN_MAP.get(KEY);
            if (MapUtils.isNotEmpty(TOKEN_MAP) && TOKEN_MAP.containsKey(KEY)) {
                long expiresTime = Long.parseLong(tokenList.get(0));
                long currentTimeMillis = System.currentTimeMillis();
                if (expiresTime < currentTimeMillis) {
                    log.warn("Access Token has expired...");
                    TOKEN_MAP.clear();
                    log.info("Clear access Token...");
                    getTokenMap();
                    TpCallCaseUtils.writeJson("Access Token has expired...", response);
                    return;
                }
            }

            if (!StringUtils.equals(tokenList.get(1), accessToken)) {
                log.warn("Access Token is error...");
                TpCallCaseUtils.writeJson("Access Token is error...", response);
                return;
            }
            log.info("AccessTokenFilter check Token end !!!!!!\n");
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {
        log.info("AccessTokenFilter destroy...");
    }

    /**
     * 生成 token
     */
    private void getTokenMap() {
        long currentTimeMillis = System.currentTimeMillis();
        long expiresTime = currentTimeMillis + EXPIRES_IN;
        String token = UUID.randomUUID().toString() + "_" + Base64.getEncoder().encodeToString("token".getBytes(StandardCharsets.UTF_8));
        List<String> linkedList = Lists.newLinkedList();
        linkedList.add(String.valueOf(expiresTime));
        linkedList.add(token);
        TOKEN_MAP.put(KEY, linkedList);
        log.info("Generate access Token: [{}], Expires Time: [{}] ...\n", token, TpCallCaseUtils.millisConvertToDate(expiresTime));
    }
}
```

### Utils
#### TpCallCaseUtils
```java
/**
 * @author vincent
 */
public class TpCallCaseUtils {

    /**
     * 返回错误信息
     *
     * @param errorMsg 错误信息
     * @param response HttpServletResponse
     */
    public static void writeJson(String errorMsg, HttpServletResponse response) {
        try {
            String json = new ObjectMapper().writeValueAsString(ResponseDto.error(ResultCodeErrorEnum.TOKEN_ERROR, errorMsg));
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            PrintWriter writer = response.getWriter();
            writer.print(json);
            writer.flush();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 毫秒值转时间
     *
     * @param currentTimeMillis 毫秒值
     * @return 时间格式（yyyy-MM-dd HH:mm:ss.SSS）
     */
    public static String millisConvertToDate(Long currentTimeMillis) {
        Instant instant = Instant.ofEpochMilli(currentTimeMillis);
        LocalDateTime localDateTime = LocalDateTime.ofInstant(instant, ZoneId.of(ZoneId.SHORT_IDS.get("CTT")));
        return localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS"));
    }
}
```

### Enum
#### ResultCodeErrorEnum
```java
/**
 * @author vincent
 */
public enum ResultCodeErrorEnum implements ResultCode {
    /**
     * 业务类型错误枚举
     */
    AUTH_TYPE_ERROR(18900, "权限校验类型错误"),
    AUTH_ERROR(18901, "权限校验错误"),
    TOKEN_ERROR(18902, "Token 校验错误"),
    ;

    private final int code;
    private final String desc;

    ResultCodeErrorEnum(int code, String desc) {
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

### Dto
#### AuthServerDto
```java
/**
 * @author vincent
 */
@NoArgsConstructor
@Data
public class AuthServerDto {
    /**
     * access_token : 2e63f6f5-c546-427e-8a1c-f4db48671bf8
     * token_type : bearer
     * expires_in : 7199
     */
    @JsonProperty("access_token")
    private String accessToken;
    @JsonProperty("token_type")
    private String tokenType;
    @JsonProperty("expires_in")
    private Integer expiresIn;
}
```

#### TpUserDto
```java
/**
 * @author vincent
 */
@Data
public class TpUserDto {
    private String userId;
    private String userCode;
    private String userName;
}
```

#### TpDepartmentQueryDto
```java
/**
 * @author vincent
 */
@Data
public class TpDepartmentQueryDto {
    private Long idOrParentId;
    private String position;
}
```

#### TpDepartmentDto
```java
/**
 * @author vincent
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TpDepartmentDto {
    private Long id;
    /**
     * 部门名称
     */
    private String name;

    /**
     * 英文名称
     */
    @JsonProperty("name_en")
    private String nameEn;

    /**
     * 父亲部门id。根部门为1
     */
    @JsonProperty("parent_Id")
    private Long parentId;

    /**
     * 职位
     */
    private String position;

    /**
     * 在父部门中的次序值。order值大的排序靠前。值范围是[0, 2^32)
     */
    private Long order;
}
```

### Controller
#### AuthServerController
```java
/**
 * @author vincent
 */
@RestController
@RequestMapping(value = "/autho")
@Slf4j
public class AuthServerController {
    private static final String GRANT_TYPE = "client_credentials";
    private static final String CLIENT_ID = "client_id";
    private static final String CLIENT_SECRET = "client_secret";

    private static final String TOKEN = "token";

    @RequestMapping(value = "/token", method = RequestMethod.GET)
    public ResponseDto<AuthServerDto> getAccessToken(@RequestParam("grant_type") String grantType,
                                                     @RequestParam("client_id") String clientId,
                                                     @RequestParam("client_secret") String clientSecret) {
        log.info("GetAccessToken method request parameters -> grant_type: {}, client_id: {},client_secret: {} ...", grantType, clientId, clientSecret);
        if (!StringUtils.equals(grantType, GRANT_TYPE)) {
            return ResponseDto.error(ResultCodeErrorEnum.AUTH_TYPE_ERROR);
        }
        if (!StringUtils.equals(clientId, CLIENT_ID) && !StringUtils.equals(clientSecret, CLIENT_SECRET)) {
            return ResponseDto.error(ResultCodeErrorEnum.AUTH_ERROR);
        }
        // 获取 token, 并重置 token 的过期时间
        List<String> tokenList = AccessTokenFilter.TOKEN_MAP.get(TOKEN);
        String oldExpiresTime = tokenList.get(0);
        String token = tokenList.get(1);
        tokenList.remove(0);
        Long newExpiresTime = System.currentTimeMillis() + AccessTokenFilter.EXPIRES_IN;
        tokenList.add(0, String.valueOf(newExpiresTime));
        log.info("Update Expires Time: Old Expires Time {}, New Expires Time {} ...", TpCallCaseUtils.millisConvertToDate(Long.parseLong(oldExpiresTime)), TpCallCaseUtils.millisConvertToDate(newExpiresTime));

        AuthServerDto authDto = new AuthServerDto();
        authDto.setAccessToken(token);
        authDto.setTokenType("bearer");
        authDto.setExpiresIn(3 * 60 * 1000);
        return ResponseDto.success(authDto);
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
### Utils
#### <font color='red'> DefaultFeignClient </font>
```java
/**
 * @author vincent
 * openfeign 默认构造器
 */
@Slf4j
public class DefaultFeignClient {
    private final static Map<ContractEnum, Contract> CONTRACT_MAP = ImmutableMap.of(
            ContractEnum.DEFAULT, new Contract.Default(),
            ContractEnum.SPRINGMVC, new SpringMvcContract()
    );

    private final static SSLSocketFactory SSL_SOCKET_FACTORY;

    private final static Map<String, Object> FEIGN_CLIENT_CACHE = new HashMap<>();

    static {
        try {
            SSLContext sslContext = SSLContexts.custom().loadTrustMaterial(null, (chain, authType) -> true).build();
            SSL_SOCKET_FACTORY = sslContext.getSocketFactory();
        } catch (Exception e) {
            log.error("Init SSLSocketFactory fail...");
            throw new RuntimeException(e);
        }
    }

    /**
     * Feign 构造器
     *
     * @param apiType            请求目标类
     * @param url                请求路径
     * @param contractEnum       定义接口上有效的注释 {@link Contract},  默认 feign 自带注解 {@link Contract.Default}, 也可使用 {@link SpringMvcContract} 注解
     * @param requestInterceptor 请求拦截器 {@link RequestInterceptor}（在请求前做一些特殊需求处理，需自己实现 {@link RequestInterceptor#apply(RequestTemplate)} 接口方法）
     * @param options            请求可选设置 {@link Request.Options}, 默认设置 {@link Request.Options#Options()}, 自定义设置 {@link Request.Options#Options(long, TimeUnit, long, TimeUnit, boolean)}
     * @param retryer            请求重试设置 {@link Retryer}, 默认设置 {@link Retryer.Default#Default()}, 自定义设置 {@link Retryer.Default#Default(long, long, int)}
     * @param errorDecoder       请求返回值解码器 {@link ErrorDecoder}, 默认设置 {@link ErrorDecoder.Default#decode(String, Response)},
     *                           当 HTTP {@link Response} 的 {@link Response#status()} 值不在 2xx 范围内时，可自定义实现 {@link ErrorDecoder.Default#decode(String, Response)} 接口方法）
     * @param <T>                请求目标类泛型
     * @return 返回 DefaultFeignClient 实例
     */
    private static <T> T createClient(Class<T> apiType, String url, ContractEnum contractEnum,
                                      Consumer<RequestTemplate> requestInterceptor, Options options,
                                      Retryer retryer, BiFunction<String, Response, Exception> errorDecoder) {
        return Feign.builder()
                .logger(new Slf4jLogger())
                .logLevel(Logger.Level.FULL)
                .requestInterceptor(requestInterceptor::accept)
                .contract(CONTRACT_MAP.get(contractEnum))
                .client(new Client.Default(SSL_SOCKET_FACTORY, NoopHostnameVerifier.INSTANCE))
                .options(options)
                .retryer(retryer)
                .encoder(DefaultFeignClient::encode)
                .decoder(DefaultFeignClient::decode)
                .errorDecoder(errorDecoder::apply)
                .target(apiType, url);
    }

    /**
     * 创建 DefaultFeignClient 单例
     *
     * @param apiType            请求目标类
     * @param url                请求路径
     * @param contractEnum       定义接口上有效的注释 {@link Contract},  默认 feign 自带注解 {@link Contract.Default}, 也可使用 {@link SpringMvcContract} 注解
     * @param requestInterceptor 请求拦截器 {@link RequestInterceptor}（在请求前做一些特殊需求处理，需自己实现 {@link RequestInterceptor#apply(RequestTemplate)} 接口方法）
     * @param options            请求可选设置 {@link Request.Options}, 默认设置 {@link Request.Options#Options()}, 自定义设置 {@link Request.Options#Options(long, TimeUnit, long, TimeUnit, boolean)}
     * @param retryer            请求重试设置 {@link Retryer}, 默认设置 {@link Retryer.Default#Default()}, 自定义设置 {@link Retryer.Default#Default(long, long, int)}
     * @param errorDecoder       请求返回值解码器 {@link ErrorDecoder}, 默认设置 {@link ErrorDecoder.Default#decode(String, Response)},
     *                           当 HTTP {@link Response} 的 {@link Response#status()} 值不在 2xx 范围内时，可自定义实现 {@link ErrorDecoder.Default#decode(String, Response)} 接口方法）
     * @param <T>                请求目标类泛型
     * @return 返回 DefaultFeignClient 单例
     */
    public static <T> T getSingleClient(Class<T> apiType, String url, ContractEnum contractEnum,
                                        Consumer<RequestTemplate> requestInterceptor, Options options,
                                        Retryer retryer, BiFunction<String, Response, Exception> errorDecoder) {
        T singletonClient = CheckedCast.cast(FEIGN_CLIENT_CACHE.get(apiType.getName()));
        if (Objects.isNull(singletonClient)) {
            synchronized (FEIGN_CLIENT_CACHE) {
                singletonClient = CheckedCast.cast(FEIGN_CLIENT_CACHE.get(apiType.getName()));
                if (Objects.isNull(singletonClient)) {
                    singletonClient = createClient(apiType, url, contractEnum, requestInterceptor, options, retryer, errorDecoder);
                    FEIGN_CLIENT_CACHE.put(apiType.getName(), singletonClient);
                }
            }
        }
        return singletonClient;
    }

    /**
     * 创建 DefaultFeignClient 单例
     *
     * @param apiType      请求目标类
     * @param url          请求路径
     * @param contractEnum 定义接口上有效的注释 {@link Contract},  默认 feign 自带注解 {@link Contract.Default}, 也可使用 {@link SpringMvcContract} 注解
     * @param <T>          请求目标类泛型
     * @return 返回 DefaultFeignClient 单例
     */
    public static <T> T getSingleClient(Class<T> apiType, String url, ContractEnum contractEnum) {
        return getSingleClient(apiType, url, contractEnum, requestTemplate -> {
        }, new Options(), new Retryer.Default(), (methodKey, response) -> new ErrorDecoder.Default().decode(methodKey, response));
    }

    /**
     * 创建 DefaultFeignClient 单例, 默认使用 springmvc 注解
     *
     * @param apiType 请求目标类
     * @param url     请求路径
     * @param <T>     请求目标类泛型
     * @return 返回 DefaultFeignClient 单例
     */
    public static <T> T getSingleClient(Class<T> apiType, String url) {
        return getSingleClient(apiType, url, ContractEnum.SPRINGMVC);
    }

    /**
     * 创建 DefaultFeignClient 实例
     *
     * @param apiType            请求目标类
     * @param url                请求路径
     * @param contractEnum       定义接口上有效的注释 {@link Contract},  默认 feign 自带注解 {@link Contract.Default}, 也可使用 {@link SpringMvcContract} 注解
     * @param requestInterceptor 请求拦截器 {@link RequestInterceptor}（在请求前做一些特殊需求处理，需自己实现 {@link RequestInterceptor#apply(RequestTemplate)} 接口方法）
     * @param options            请求可选设置 {@link Request.Options}, 默认设置 {@link Request.Options#Options()}, 自定义设置 {@link Request.Options#Options(long, TimeUnit, long, TimeUnit, boolean)}
     * @param retryer            请求重试设置 {@link Retryer}, 默认设置 {@link Retryer.Default#Default()}, 自定义设置 {@link Retryer.Default#Default(long, long, int)}
     * @param errorDecoder       请求返回值解码器 {@link ErrorDecoder}, 默认设置 {@link ErrorDecoder.Default#decode(String, Response)},
     *                           当 HTTP {@link Response} 的 {@link Response#status()} 值不在 2xx 范围内时，可自定义实现 {@link ErrorDecoder.Default#decode(String, Response)} 接口方法）
     * @param <T>                请求目标类泛型
     * @return 返回 DefaultFeignClient 实例
     */
    public static <T> T getClient(Class<T> apiType, String url, ContractEnum contractEnum,
                                  Consumer<RequestTemplate> requestInterceptor, Options options,
                                  Retryer retryer, BiFunction<String, Response, Exception> errorDecoder) {
        return createClient(apiType, url, contractEnum, requestInterceptor, options, retryer, errorDecoder);
    }

    /**
     * 创建 DefaultFeignClient 实例
     *
     * @param apiType      请求目标类
     * @param url          请求路径
     * @param contractEnum 定义接口上有效的注释 {@link Contract},  默认 feign 自带注解 {@link Contract.Default}, 也可使用 {@link SpringMvcContract} 注解
     * @param <T>          请求目标类泛型
     * @return 返回 DefaultFeignClient 实例
     */
    public static <T> T getClient(Class<T> apiType, String url, ContractEnum contractEnum) {
        return getClient(apiType, url, contractEnum, requestTemplate -> {
        }, new Options(), new Retryer.Default(), (methodKey, response) -> new ErrorDecoder.Default().decode(methodKey, response));
    }

    /**
     * 创建 DefaultFeignClient 实例, 默认使用 springmvc 注解
     *
     * @param apiType 请求目标类
     * @param url     请求路径
     * @param <T>     请求目标类泛型
     * @return 返回 DefaultFeignClient 实例
     */
    public static <T> T getClient(Class<T> apiType, String url) {
        return getClient(apiType, url, ContractEnum.SPRINGMVC);
    }

    /**
     * 发送请求时的编码器
     *
     * @param object   请求体中的内容（body 中的内容）
     * @param bodyType 请求体的类型
     * @param template 请求模板
     * @throws EncodeException 编码失败时异常
     */
    private static void encode(Object object, Type bodyType, RequestTemplate template) throws EncodeException {
        if (StringUtils.equalsIgnoreCase(template.method(), HttpMethod.GET.name()) || Objects.isNull(object)) {
            return;
        }
        new SpringFormEncoder(new SpringEncoder(HttpMessageConverters::new)).encode(object, bodyType, template);
    }

    /**
     * 请求响应后进行解密处理
     *
     * @param response 请求响应
     * @param type     接口方法定义的返回类型
     * @return 返回 object（就是 type 的类型）
     * @throws IOException    IO 异常
     * @throws FeignException Feign 异常
     */
    private static Object decode(Response response, Type type) throws IOException, FeignException {
        if (type == InputStream.class) {
            return response.body().asInputStream();
        }
        return new JacksonDecoder().decode(response, type);
    }
}
```

#### <font color='red'> CheckedCast </font>
```java
/**
 * @author vincent
 * 强制类型转换
 */
public class CheckedCast {
    @SuppressWarnings("unchecked")
    public static <T> T cast(Object obj) {
        return (T) obj;
    }
}
```

#### <font color='red'> ContractEnum </font>
```java
/**
 * @author vincent
 * feign 创建实例时, 与之配套使用的注解（这里暂时只支持 feign 本身默认的注解和 springmvc 的注解）
 */
public enum ContractEnum {
    DEFAULT("feign_default"),
    SPRINGMVC("springmvc");

    private final String value;

    ContractEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
```

### Dto
#### TpConfigDto
```java
/**
 * @author vincent
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TpConfigDto {
    private String clientId;
    private String clientSecret;
    private String hostName;
}
```

### Dao
#### TpConfigDao
```java
/**
 * @author vincent
 */
@Repository
public class TpConfigDao {
    /**
     * 从数据库查询出 TpConfigDto 对象
     *
     * @param clientId 标识唯一
     * @return TpConfigDto
     */
    public TpConfigDto selectByClientId(String clientId) {
        // 当然这里你可以创建一个 TpConfigMapper, 通过 mybatis 来查询出 TpConfigDto, 并交给 spring 容器来管理（这里只是 demo 所以就简单模拟下）
        return new TpConfigDto(clientId, "client_secret", "http://localhost:8080/autho");
    }
}
```

### Feign
#### TpApi
```java
/**
 * @author vincent
 */
public interface TpApi {
    @RequestMapping(value = "/token", method = RequestMethod.GET)
    ResponseDto<AuthServerDto> getAccessToken(@RequestParam("grant_type") String grantType, @RequestParam("client_id") String clientId, @RequestParam("client_secret") String clientSecret);

    @GetMapping(value = "/user/get")
    ResponseDto<TpUserDto> getUserDto(@RequestParam("accessToken") String accessToken, @RequestParam("userId") String userId);

    @PostMapping(value = "/department/list")
    ResponseDto<List<TpDepartmentDto>> getDepartmentDtos(@RequestParam("accessToken") String accessToken, @RequestBody TpDepartmentQueryDto queryDto);
}
```

#### TpFeignClient
```java
/**
 * @author vincent
 * 可自定义一些别的需求
 */
public class TpFeignClient extends DefaultFeignClient {
}
```

### Helper
#### TpApiHelper
```java
/**
 * @author vincent
 */
public interface TpApiHelper {

    TpUserDto getUserDto(String userId);

    List<TpDepartmentDto> getDepartmentDtos(TpDepartmentQueryDto queryDto);
}
```

#### TpApiHelperImpl
```java
/**
 * @author vincent
 */
@Slf4j
public class TpApiHelperImpl implements TpApiHelper {
    private final TpApi tpApi;
    private final TpConfigDto tpConfigDto;
    private static volatile TpApiHelperImpl instance;
    private final LoadingCache<String, String> loadingCache;
    private static final Lock reentrantLock = new ReentrantLock();
    private static final String GRANT_TYPE = "client_credentials";

    public static TpApiHelperImpl getInstance(TpConfigDto tpConfigDto) {
        if (instance == null) {
            reentrantLock.lock();
            try {
                if (instance == null) {
                    instance = new TpApiHelperImpl(tpConfigDto);
                }
            } finally {
                reentrantLock.unlock();
            }
        }
        return instance;
    }

    private TpApiHelperImpl(TpConfigDto tpConfigDto) {
        Objects.requireNonNull(tpConfigDto);
        this.tpConfigDto = tpConfigDto;
        tpApi = TpFeignClient.getClient(TpApi.class, tpConfigDto.getHostName());
        loadingCache = CacheBuilder
                .newBuilder()
                .maximumSize(1)
                .expireAfterWrite(178, TimeUnit.SECONDS)
                .expireAfterAccess(180, TimeUnit.SECONDS)
                .removalListener((RemovalListener<String, String>) notification -> log.info("[ Token: {} ] is removed...", notification.getValue()))
                .build(new CacheLoader<String, String>() {
                    @Override
                    public String load(@NonNull String key) {
                        String accessToken = tpApi.getAccessToken(GRANT_TYPE, key, tpConfigDto.getClientSecret()).getData().getAccessToken();
                        log.info("Get access Token with feign client first time: [{}]...", accessToken);
                        return accessToken;
                    }
                });
    }

    @Override
    public TpUserDto getUserDto(String userId) {
        try {
            String accessToken = loadingCache.get(tpConfigDto.getClientId());
            log.info("LoadingCache get access Token: [{}]...", accessToken);
            return tpApi.getUserDto(accessToken, userId).getData();
        } catch (ExecutionException e) {
            log.error("GetUserDto is error...");
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<TpDepartmentDto> getDepartmentDtos(TpDepartmentQueryDto queryDto) {
        try {
            String accessToken = loadingCache.get(tpConfigDto.getClientId());
            log.info("LoadingCache get access Token: [{}]...", accessToken);
            return tpApi.getDepartmentDtos(accessToken, queryDto).getData();
        } catch (ExecutionException e) {
            log.error("GetDepartmentDtos is error...");
            throw new RuntimeException(e);
        }
    }
}
```

### Test
#### TpCallCaseTest
```java
/**
 * @author vincent
 */
@SpringBootTest(classes = CallingThirdPartyApiApplicationTests.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Slf4j
public class TpCallCaseTest {

    @Autowired
    private TpConfigDao tpConfigDao;

    @Test
    public void tpCallTest() {
        TpConfigDto tpConfigDto = tpConfigDao.selectByClientId("client_id");
        TpApiHelperImpl instance = TpApiHelperImpl.getInstance(tpConfigDto);

        log.info("GetUserDto method start...");
        TpUserDto tpUserDto = instance.getUserDto("userId");
        log.info("tpUserDto: {}...", tpUserDto);
        log.info("GetUserDto method end...\n");

        log.info("GetDepartmentDtos method start...");
        TpDepartmentQueryDto queryDto = new TpDepartmentQueryDto();
        queryDto.setIdOrParentId(19000L);
        queryDto.setPosition("员工");
        List<TpDepartmentDto> departmentDtos = instance.getDepartmentDtos(queryDto);
        departmentDtos.forEach(departmentDto -> log.info("departmentDto: {}...", departmentDto));
        log.info("GetDepartmentDtos method end...");
    }
}
```

**AuthServerController Log：**
```
2021-02-03 12:30:59.918  INFO 10818 --- [           main] c.v.c.o.t.config.AccessTokenFilter       : AccessTokenFilter init...
2021-02-03 12:30:59.926  INFO 10818 --- [           main] c.v.c.o.t.config.AccessTokenFilter       : Generate access Token: [98ee0324-0ac9-4e54-9710-e9d834ad19a0_dG9rZW4=], Expires Time: [2021-02-03 12:33:59.918] ...

2021-02-03 12:31:00.182  INFO 10818 --- [           main] o.s.s.concurrent.ThreadPoolTaskExecutor  : Initializing ExecutorService 'applicationTaskExecutor'
2021-02-03 12:31:00.445  INFO 10818 --- [           main] o.s.b.d.a.OptionalLiveReloadServer       : LiveReload server is running on port 35729
2021-02-03 12:31:00.598  INFO 10818 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2021-02-03 12:31:00.615  INFO 10818 --- [           main] c.v.c.CallingThirdPartyApiApplication    : Started CallingThirdPartyApiApplication in 3.719 seconds (JVM running for 12.864)
2021-02-03 12:31:31.436  INFO 10818 --- [nio-8080-exec-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring DispatcherServlet 'dispatcherServlet'
2021-02-03 12:31:31.436  INFO 10818 --- [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Initializing Servlet 'dispatcherServlet'
2021-02-03 12:31:31.437  INFO 10818 --- [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Completed initialization in 1 ms
2021-02-03 12:31:31.477  INFO 10818 --- [nio-8080-exec-1] c.v.c.o.t.c.AuthServerController         : GetAccessToken method request parameters -> grant_type: client_credentials, client_id: client_id,client_secret: client_secret ...
2021-02-03 12:31:31.487  INFO 10818 --- [nio-8080-exec-1] c.v.c.o.t.c.AuthServerController         : Update Expires Time: Old Expires Time 2021-02-03 12:33:59.918, New Expires Time 2021-02-03 12:34:31.487 ...

2021-02-03 12:31:31.851  INFO 10818 --- [nio-8080-exec-2] c.v.c.o.t.config.AccessTokenFilter       : AccessTokenFilter doFilter...
2021-02-03 12:31:31.852  INFO 10818 --- [nio-8080-exec-2] c.v.c.o.t.config.AccessTokenFilter       : AccessTokenFilter check Token start !!!!!!
2021-02-03 12:31:31.852  INFO 10818 --- [nio-8080-exec-2] c.v.c.o.t.config.AccessTokenFilter       : Parameter accessToken is [98ee0324-0ac9-4e54-9710-e9d834ad19a0_dG9rZW4=]...
2021-02-03 12:31:31.862  INFO 10818 --- [nio-8080-exec-2] c.v.c.o.t.config.AccessTokenFilter       : AccessTokenFilter check Token end !!!!!!

2021-02-03 12:31:31.865  INFO 10818 --- [nio-8080-exec-2] c.v.c.o.t.c.AuthServerController         : GetUserDto method request parameters -> accessToken: [98ee0324-0ac9-4e54-9710-e9d834ad19a0_dG9rZW4=], userId: [userId] ...

2021-02-03 12:31:31.958  INFO 10818 --- [nio-8080-exec-3] c.v.c.o.t.config.AccessTokenFilter       : AccessTokenFilter doFilter...
2021-02-03 12:31:31.958  INFO 10818 --- [nio-8080-exec-3] c.v.c.o.t.config.AccessTokenFilter       : AccessTokenFilter check Token start !!!!!!
2021-02-03 12:31:31.958  INFO 10818 --- [nio-8080-exec-3] c.v.c.o.t.config.AccessTokenFilter       : Parameter accessToken is [98ee0324-0ac9-4e54-9710-e9d834ad19a0_dG9rZW4=]...
2021-02-03 12:31:31.958  INFO 10818 --- [nio-8080-exec-3] c.v.c.o.t.config.AccessTokenFilter       : AccessTokenFilter check Token end !!!!!!

2021-02-03 12:31:32.003  INFO 10818 --- [nio-8080-exec-3] c.v.c.o.t.c.AuthServerController         : GetDepartmentDtos method request parameters -> accessToken: [98ee0324-0ac9-4e54-9710-e9d834ad19a0_dG9rZW4=], queryDto: [TpDepartmentQueryDto(idOrParentId=19000, position=员工)] ...
```

**TpCallCaseTest Log：**
```
2021-02-03 12:31:31.122  INFO 10832 --- [           main] c.v.c.o.t.TpCallCaseTest                 : GetUserDto method start...
2021-02-03 12:31:31.845  INFO 10832 --- [           main] c.v.c.o.t.helper.iml.TpApiHelperImpl     : Get access Token with feign client first time: [98ee0324-0ac9-4e54-9710-e9d834ad19a0_dG9rZW4=]...
2021-02-03 12:31:31.849  INFO 10832 --- [           main] c.v.c.o.t.helper.iml.TpApiHelperImpl     : LoadingCache get access Token: [98ee0324-0ac9-4e54-9710-e9d834ad19a0_dG9rZW4=]...
2021-02-03 12:31:31.871  INFO 10832 --- [           main] c.v.c.o.t.TpCallCaseTest                 : tpUserDto: TpUserDto(userId=userId, userCode=USERCODE_VINCENT, userName=Vincent)...
2021-02-03 12:31:31.871  INFO 10832 --- [           main] c.v.c.o.t.TpCallCaseTest                 : GetUserDto method end...

2021-02-03 12:31:31.871  INFO 10832 --- [           main] c.v.c.o.t.TpCallCaseTest                 : GetDepartmentDtos method start...
2021-02-03 12:31:31.872  INFO 10832 --- [           main] c.v.c.o.t.helper.iml.TpApiHelperImpl     : LoadingCache get access Token: [98ee0324-0ac9-4e54-9710-e9d834ad19a0_dG9rZW4=]...
2021-02-03 12:31:32.025  INFO 10832 --- [           main] c.v.c.o.t.TpCallCaseTest                 : departmentDto: TpDepartmentDto(id=19000, name=xxx公司, nameEn=xxx_company, parentId=1, position=员工, order=1)...
2021-02-03 12:31:32.026  INFO 10832 --- [           main] c.v.c.o.t.TpCallCaseTest                 : departmentDto: TpDepartmentDto(id=19580, name=人事部, nameEn=personnel_department, parentId=19000, position=员工, order=23)...
2021-02-03 12:31:32.026  INFO 10832 --- [           main] c.v.c.o.t.TpCallCaseTest                 : departmentDto: TpDepartmentDto(id=19581, name=财务部, nameEn=finance_department, parentId=19000, position=员工, order=24)...
2021-02-03 12:31:32.026  INFO 10832 --- [           main] c.v.c.o.t.TpCallCaseTest                 : departmentDto: TpDepartmentDto(id=19582, name=技术部, nameEn=technology_department, parentId=19000, position=员工, order=25)...
2021-02-03 12:31:32.026  INFO 10832 --- [           main] c.v.c.o.t.TpCallCaseTest                 : GetDepartmentDtos method end...
```

Case Source Code：https://github.com/V-Vincen/calling-third-party-api
