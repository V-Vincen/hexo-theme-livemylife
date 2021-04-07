---
title: '[Calling Third-party API - OpenFeign] 2 DefaultFeignClient Case and Summary'
catalog: true
date: 2021-01-31 15:59:30
subtitle: Feign is a Java to HTTP client binder inspired by Retrofit, JAXRS-2.0, and WebSocket. Feign's first goal was reducing the complexity of binding Denominator uniformly to HTTP APIs regardless of ReSTfulness...
header-img: /img/header_img/tag_bg2.jpg
tags:
- Calling Third-party API
- OpenFeign
---

## Summary
根据 [GitHub OpenFeign](https://github.com/OpenFeign/feign) 官方文档，博主在这里对 `Feign.builder()` 模式进行了简要的封装。 同时对 `Feign.builder()` 配置协约 `.contract(Contract contract)` 做了进一步的说明和举例。`contract` 我暂时把它翻译为协约，这个属性在构造 `Feign` 对象实例时，用于定义 `Feign` 对象实例与之配合使用的注解。如果不设置 `contract` 属性，那么 `Feign` 默认使用自带的注解。博主在下文的封装中，同时提供了 `SpringMvc` 注解配置。用不习惯 `Feign` 自带的注解的话，不妨转换为 `SpringMvc` 的注解，毕竟 `SpringMvc` 的注解对于我们来说再熟悉不过了，同时也大大减少了我们的学习成本。那么博主这里直接上案例。

## Case
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

### Controller
#### FeignServerController
```java
/**
 * @author vincent
 */
@RestController
@RequestMapping(value = "/feign")
@Slf4j
public class FeignServerController {
    private final static String PATH = "/Users/vincent/IDEA_Project/my_project/calling-third-party-api/src/main/java/com/vincent/callingthirdpartyapi/open_feign/defandspmvc_contract";

    @PostMapping(value = "/postPhone")
    public ResponseDto<PhoneDto> postPhone(@RequestBody PhoneQueryDto queryDto, @RequestParam("param") String param) throws JsonProcessingException {
        log.info("postPhone 请求参数 queryDto: {}, param: {}...", queryDto, param);
        if (Objects.isNull(queryDto.getApp())) {
            return ResponseDto.error();
        }
        String jsonString = "{\n" +
                "    \"status\": \"ALREADY_ATT\",\n" +
                "    \"phone\": \"13800138000\",\n" +
                "    \"area\": \"010\",\n" +
                "    \"postno\": \"100000\",\n" +
                "    \"att\": \"中国,北京\",\n" +
                "    \"ctype\": \"北京移动全球通卡\",\n" +
                "    \"par\": \"1380013\",\n" +
                "    \"prefix\": \"138\",\n" +
                "    \"operators\": \"移动\",\n" +
                "    \"style_simcall\": \"中国,北京\",\n" +
                "    \"style_citynm\": \"中华人民共和国,北京市\"\n" +
                "}";
        PhoneDto phoneDto = new ObjectMapper().readValue(jsonString, PhoneDto.class);
        return ResponseDto.success(phoneDto);
    }

    @PostMapping(value = "/postFormTime")
    public ResponseDto<TimeDto> postFormTime(TimeQueryDto queryDto) throws JsonProcessingException {
        log.info("postFormTime 请求参数 queryDto: {}...", queryDto);
        if (Objects.isNull(queryDto.getApp())) {
            return ResponseDto.error();
        }
        String jsonString = "{\n" +
                "    \"timestamp\": \"1611728644\",\n" +
                "    \"datetime_1\": \"2021-01-27 14:24:04\",\n" +
                "    \"datetime_2\": \"2021年01月27日 14时24分04秒\",\n" +
                "    \"week_1\": \"3\",\n" +
                "    \"week_2\": \"星期三\",\n" +
                "    \"week_3\": \"周三\",\n" +
                "    \"week_4\": \"Wednesday\"\n" +
                "}";
        TimeDto timeDto = new ObjectMapper().readValue(jsonString, TimeDto.class);
        return ResponseDto.success(timeDto);
    }

    @GetMapping(value = "/getIDCard")
    public ResponseDto<IDCardDto> getIdCard(@RequestParam("app") String app,
                                            @RequestParam("idcard") String idcard,
                                            @RequestParam("appkey") String appkey,
                                            @RequestParam("sign") String sign,
                                            @RequestParam("format") String format) throws JsonProcessingException {
        log.info("getIDCard 请求参数 app: {}, idcard: {}, appkey: {}, sign: {}, format: {}...", app, idcard, appkey, sign, format);
        if (StringUtils.isBlank(app)) {
            return ResponseDto.error();
        }
        String jsonString = "{\n" +
                "    \"status\": \"ALREADY_ATT\",\n" +
                "    \"idcard\": \"110101199001011114\",\n" +
                "    \"par\": \"110101\",\n" +
                "    \"born\": \"1990年01月01日\",\n" +
                "    \"sex\": \"男\",\n" +
                "    \"att\": \"北京市 东城区 \",\n" +
                "    \"postno\": \"100000\",\n" +
                "    \"areano\": \"010\",\n" +
                "    \"style_simcall\": \"中国,北京\",\n" +
                "    \"style_citynm\": \"中华人民共和国,北京市\"\n" +
                "}";
        IDCardDto idCardDto = new ObjectMapper().readValue(jsonString, IDCardDto.class);
        return ResponseDto.success(idCardDto);
    }

    @GetMapping(value = "/getRestFul/{param}")
    public ResponseDto<String> getRestFul(@PathVariable("param") String param) {
        log.info("getRestFul 请求参数 param: {}...", param);
        if (Objects.isNull(param)) {
            return ResponseDto.error();
        }
        return ResponseDto.success("请求成功, 返回 param: " + param);
    }

    @PostMapping(value = "/upload")
    public ResponseDto<String> upload(@RequestParam("file") MultipartFile file) throws IOException {
        log.info("upload 请求参数 MultipartFile file: {}...", file);
        String name = file.getOriginalFilename();
        log.info("File name: {}...", name);
        file.transferTo(Paths.get(PATH).resolve("file2.txt"));
        return ResponseDto.success(name + " upload success...");
    }

    @GetMapping(value = "/downloadBySpringMvc")
    public FileSystemResource downloadBySpringMvc(@RequestParam("fileName") String fileName, HttpServletResponse response) throws UnsupportedEncodingException {
        log.info("downloadBySpringMvc 请求参数 String fileName: {}...", fileName);
        Path filePath = Paths.get(PATH).resolve(fileName);
        response.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + URLEncoder.encode("fileName.txt", "UTF-8"));
        return new FileSystemResource(filePath);
    }

    @GetMapping(value = "/downloadByHttpServlet")
    public void downloadByHttpServlet(@RequestParam("fileName") String fileName, HttpServletResponse response) throws Exception {
        log.info("downloadByHttpServlet 请求参数 String fileName: {}...", fileName);
//        Path filePath = Paths.get(PATH).resolve(fileName);
//        response.getOutputStream().write(Files.readAllBytes(filePath));
//        IOUtils.copy(Files.newInputStream(filePath), response.getOutputStream());

        response.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + URLEncoder.encode("fileName.txt", "UTF-8"));
        response.getOutputStream().write((fileName + "download success...").getBytes(StandardCharsets.UTF_8));
    }
}
```

### Dto
#### PhoneDto
```java
/**
 * @author vincent
 */
@Data
public class PhoneDto implements Serializable {
    /**
     * status : ALREADY_ATT
     * phone : 13800138000
     * area : 010
     * postno : 100000
     * att : 中国,北京
     * ctype : 北京移动全球通卡
     * par : 1380013
     * prefix : 138
     * operators : 移动
     * style_simcall : 中国,北京
     * style_citynm : 中华人民共和国,北京市
     */

    @JsonProperty("status")
    private String status;
    /**
     * 查询的手机号
     */
    @JsonProperty("phone")
    private String phone;
    /**
     * 区号
     */
    @JsonProperty("area")
    private String area;
    /**
     * 邮编
     */
    @JsonProperty("postno")
    private String postno;
    /**
     * 归属地样式1
     */
    @JsonProperty("att")
    private String att;
    /**
     * 卡类型
     */
    @JsonProperty("ctype")
    private String ctype;
    /**
     * 手机号前缀
     */
    @JsonProperty("par")
    private String par;
    /**
     * 号段
     */
    @JsonProperty("prefix")
    private String prefix;
    /**
     * 所属运营商
     */
    @JsonProperty("operators")
    private String operators;
    /**
     * 归属地样式1
     */
    @JsonProperty("style_simcall")
    private String styleSimcall;
    /**
     * 归属地样式2
     */
    @JsonProperty("style_citynm")
    private String styleCitynm;
}
```

#### PhoneQueryDto
```java
/**
 * @author vincent
 */
@Data
public class PhoneQueryDto implements Serializable {

    private String app;
    /**
     * 手机号码, 例如:13800138000
     */
    private String phone;
    /**
     * 使用 API 的唯一凭证
     */
    private String appkey;
    /**
     * md5 后的 32 位密文
     */
    private String sign;
    /**
     * 返回数据格式: json、xml
     */
    private String format;
}
```

#### TimeDto
```java
/**
 * @author vincent
 */
@Data
public class TimeDto implements Serializable {

    /**
     * timestamp : 1611728644
     * datetime_1 : 2021-01-27 14:24:04
     * datetime_2 : 2021年01月27日 14时24分04秒
     * week_1 : 3
     * week_2 : 星期三
     * week_3 : 周三
     * week_4 : Wednesday
     */

    @JsonProperty("timestamp")
    private String timestamp;
    /**
     * datetime1
     */
    @JsonProperty("datetime_1")
    private String datetime1;
    /**
     * datetime2
     */
    @JsonProperty("datetime_2")
    private String datetime2;
    /**
     * week1
     */
    @JsonProperty("week_1")
    private String week1;
    /**
     * week2
     */
    @JsonProperty("week_2")
    private String week2;
    /**
     * week3
     */
    @JsonProperty("week_3")
    private String week3;
    /**
     * week4
     */
    @JsonProperty("week_4")
    private String week4;
}
```

#### TimeQueryDto
```java
/**
 * @author vincent
 */
@Data
public class TimeQueryDto implements Serializable {

    private String app;

    /**
     * 使用 API 的唯一凭证
     */
    private String appkey;
    /**
     * md5 后的 32 位密文
     */
    private String sign;
    /**
     * 返回数据格式: json、xml
     */
    private String format;
}
```

#### IDCardDto
```java
/**
 * @author vincent
 */
@Data
public class IDCardDto implements Serializable {
    /**
     * status : ALREADY_ATT
     * idcard : 110101199001011114
     * par : 110101
     * born : 1990年01月01日
     * sex : 男
     * att : 北京市东城区
     * postno : 100000
     * areano : 010
     * style_simcall : 中国,北京
     * style_citynm : 中华人民共和国,北京市
     */

    @JsonProperty("status")
    private String status;
    /**
     * 查询的身份证号码
     */
    @JsonProperty("idcard")
    private String idcard;
    /**
     * 身份证前缀
     */
    @JsonProperty("par")
    private String par;
    /**
     * 出生年月日
     */
    @JsonProperty("born")
    private String born;
    /**
     * 性别
     */
    @JsonProperty("sex")
    private String sex;
    /**
     * 归属地
     */
    @JsonProperty("att")
    private String att;
    /**
     * 邮编
     */
    @JsonProperty("postno")
    private String postno;
    /**
     * 区号
     */
    @JsonProperty("areano")
    private String areano;
    /**
     * 地区1
     */
    @JsonProperty("style_simcall")
    private String styleSimcall;
    /**
     * 地区2
     */
    @JsonProperty("style_citynm")
    private String styleCitynm;
}
```

### FeignContract
#### DefaultContract
##### FeignDefaultContractApi
```java
/**
 * @author vincent
 */
public interface FeignDefaultContractApi {

    @RequestLine("POST /postPhone?param={param}")
    ResponseDto<PhoneDto> postPhone(PhoneQueryDto queryDto, @Param("param") String param);

    @RequestLine("POST /postFormTime")
    @Headers("Content-Type: application/x-www-form-urlencoded")
    ResponseDto<TimeDto> postFormTime(TimeQueryDto queryDto);

    @RequestLine("GET /getIDCard?app={app}&idcard={idcard}&appkey={appkey}&sign={sign}&format={format}")
    ResponseDto<IDCardDto> getIdCard(@Param("app") String app,
                                     @Param("idcard") String idcard,
                                     @Param("appkey") String appkey,
                                     @Param("sign") String sign,
                                     @Param("format") String format);

    @RequestLine("GET /getRestFul/{param}")
    ResponseDto<String> getRestFul(@Param("param") String param);

    @RequestLine("POST /upload")
    @Headers("Content-Type: multipart/form-data")
    ResponseDto<String> upload(@Param("file") File file);

    @RequestLine("GET /downloadBySpringMvc?fileName={fileName}")
    InputStream downloadBySpringMvc(@Param("fileName") String fileName);

    @RequestLine("GET /downloadByHttpServlet?fileName={fileName}")
    InputStream downloadByHttpServlet(@Param("fileName") String fileName);
}
```

##### FeignDefaultContractTest
```java
@Slf4j
public class FeignDefaultContractTest {

    private final static String PATH = "/Users/vincent/IDEA_Project/my_project/calling-third-party-api/src/test/java/com/vincent/callingthirdpartyapi/open_feign/defandspmvc_contract";

    private final static String URL = "http://localhost:8080/feign";

    private static FeignDefaultContractApi singleClient;

    @BeforeAll
    public static void createFeignClint() {
        singleClient = DefaultFeignClient.getSingleClient(FeignDefaultContractApi.class, URL, ContractEnum.DEFAULT);
    }

    @Test
    public void postTest() throws JsonProcessingException {
        PhoneQueryDto phoneQueryDto = new PhoneQueryDto();
        phoneQueryDto.setApp("phone.get");
        phoneQueryDto.setPhone("15021074475");
        phoneQueryDto.setAppkey("10003");
        phoneQueryDto.setSign("b59bc3ef6191eb9f747dd4e83c99f2a4");
        phoneQueryDto.setFormat("json");
        ResponseDto<PhoneDto> responseDto = singleClient.postPhone(phoneQueryDto, "phone");
        log.info(new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(responseDto));
    }

    @Test
    public void postFormTest() throws JsonProcessingException {
        TimeQueryDto timeQueryDto = new TimeQueryDto();
        timeQueryDto.setApp("life.time");
        timeQueryDto.setAppkey("10003");
        timeQueryDto.setSign("b59bc3ef6191eb9f747dd4e83c99f2a4");
        timeQueryDto.setFormat("json");
        ResponseDto<TimeDto> responseDto = singleClient.postFormTime(timeQueryDto);
        log.info(new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(responseDto));
    }

    @Test
    public void getTest() throws JsonProcessingException {
        ResponseDto<IDCardDto> responseDto = singleClient.getIdCard("idcard.get", "110101199001011114", "appkey", "sign", "json");
        log.info(new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(responseDto));
    }

    @Test
    public void getRestFulTest() throws JsonProcessingException {
        ResponseDto<String> responseDto = singleClient.getRestFul("restful");
        log.info(new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(responseDto));
    }

    @Test
    public void uploadTest() throws IOException {
        String name = "file.txt";
        Path filePath = Paths.get(PATH).resolve(name);
        ResponseDto<String> responseDto = singleClient.upload(filePath.toFile());
        log.info(new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(responseDto));
    }

    @Test
    public void downloadTest() throws IOException {
        Path path = Paths.get(PATH);
        InputStream inSpring = singleClient.downloadBySpringMvc("file.txt");
        IOUtils.copy(inSpring, Files.newOutputStream(path.resolve("downbyspring.txt")));

        InputStream inServlet = singleClient.downloadByHttpServlet("file.txt");
        IOUtils.copy(inServlet, Files.newOutputStream(path.resolve("downbyservlet.txt")));
    }
}
```

**FeignServerController 日志结果：**
```
2021-02-02 18:21:11.908  INFO 6571 --- [nio-8080-exec-1] c.v.c.o.d.c.FeignServerController        : upload 请求参数 MultipartFile file: org.springframework.web.multipart.support.StandardMultipartHttpServletRequest$StandardMultipartFile@4aa3360c...
2021-02-02 18:21:11.908  INFO 6571 --- [nio-8080-exec-1] c.v.c.o.d.c.FeignServerController        : File name: file.txt...
2021-02-02 18:21:13.055  INFO 6571 --- [nio-8080-exec-2] c.v.c.o.d.c.FeignServerController        : postFormTime 请求参数 queryDto: TimeQueryDto(app=life.time, appkey=10003, sign=b59bc3ef6191eb9f747dd4e83c99f2a4, format=json)...
2021-02-02 18:21:13.143  INFO 6571 --- [nio-8080-exec-3] c.v.c.o.d.c.FeignServerController        : getIDCard 请求参数 app: idcard.get, idcard: 110101199001011114, appkey: appkey, sign: sign, format: json...
2021-02-02 18:21:13.820  INFO 6571 --- [nio-8080-exec-4] c.v.c.o.d.c.FeignServerController        : postPhone 请求参数 queryDto: PhoneQueryDto(app=phone.get, phone=15021074475, appkey=10003, sign=b59bc3ef6191eb9f747dd4e83c99f2a4, format=json), param: phone...
2021-02-02 18:21:13.845  INFO 6571 --- [nio-8080-exec-5] c.v.c.o.d.c.FeignServerController        : downloadBySpringMvc 请求参数 String fileName: file.txt...
2021-02-02 18:21:13.911  INFO 6571 --- [nio-8080-exec-6] c.v.c.o.d.c.FeignServerController        : downloadByHttpServlet 请求参数 String fileName: file.txt...
2021-02-02 18:21:13.934  INFO 6571 --- [nio-8080-exec-7] c.v.c.o.d.c.FeignServerController        : getRestFul 请求参数 param: restful...
```

**FeignDefaultContractTest 日志结果：**
```
18:21:11.571 [main] DEBUG feign.Logger - [FeignDefaultContractApi#upload] ---> POST http://localhost:8080/feign/upload HTTP/1.1
18:21:11.578 [main] DEBUG feign.Logger - [FeignDefaultContractApi#upload] Content-Length: 167
18:21:11.578 [main] DEBUG feign.Logger - [FeignDefaultContractApi#upload] Content-Type: multipart/form-data; charset=UTF-8; boundary=1776242a7f3
18:21:11.579 [main] DEBUG feign.Logger - [FeignDefaultContractApi#upload] 
18:21:11.579 [main] DEBUG feign.Logger - [FeignDefaultContractApi#upload] Binary data
18:21:11.579 [main] DEBUG feign.Logger - [FeignDefaultContractApi#upload] ---> END HTTP (167-byte body)
18:21:12.138 [main] DEBUG feign.Logger - [FeignDefaultContractApi#upload] <--- HTTP/1.1 200 (449ms)
18:21:12.138 [main] DEBUG feign.Logger - [FeignDefaultContractApi#upload] connection: keep-alive
18:21:12.138 [main] DEBUG feign.Logger - [FeignDefaultContractApi#upload] content-type: application/json
18:21:12.138 [main] DEBUG feign.Logger - [FeignDefaultContractApi#upload] date: Tue, 02 Feb 2021 10:21:12 GMT
18:21:12.139 [main] DEBUG feign.Logger - [FeignDefaultContractApi#upload] keep-alive: timeout=60
18:21:12.139 [main] DEBUG feign.Logger - [FeignDefaultContractApi#upload] transfer-encoding: chunked
18:21:12.139 [main] DEBUG feign.Logger - [FeignDefaultContractApi#upload] 
18:21:12.145 [main] DEBUG feign.Logger - [FeignDefaultContractApi#upload] {"status":0,"msg":"SUCCESS","data":"file.txt upload success..."}
18:21:12.146 [main] DEBUG feign.Logger - [FeignDefaultContractApi#upload] <--- END HTTP (64-byte body)
18:21:13.011 [main] INFO com.vincent.callingthirdpartyapi.open_feign.defandspmvc_contract.defaultcontract.FeignDefaultContractTest - {
  "status" : 0,
  "msg" : "SUCCESS",
  "data" : "file.txt upload success..."
}
18:21:13.028 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postFormTime] ---> POST http://localhost:8080/feign/postFormTime HTTP/1.1
18:21:13.029 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postFormTime] Content-Length: 76
18:21:13.030 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postFormTime] Content-Type: application/x-www-form-urlencoded; charset=UTF-8
18:21:13.030 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postFormTime] 
18:21:13.031 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postFormTime] app=life.time&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json&appkey=10003
18:21:13.031 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postFormTime] ---> END HTTP (76-byte body)
18:21:13.114 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postFormTime] <--- HTTP/1.1 200 (83ms)
18:21:13.114 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postFormTime] connection: keep-alive
18:21:13.115 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postFormTime] content-type: application/json
18:21:13.115 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postFormTime] date: Tue, 02 Feb 2021 10:21:13 GMT
18:21:13.115 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postFormTime] keep-alive: timeout=60
18:21:13.115 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postFormTime] transfer-encoding: chunked
18:21:13.115 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postFormTime] 
18:21:13.116 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postFormTime] {"status":0,"msg":"SUCCESS","data":{"timestamp":"1611728644","datetime_1":"2021-01-27 14:24:04","datetime_2":"2021年01月27日 14时24分04秒","week_1":"3","week_2":"星期三","week_3":"周三","week_4":"Wednesday"}}
18:21:13.116 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postFormTime] <--- END HTTP (219-byte body)
18:21:13.130 [main] INFO com.vincent.callingthirdpartyapi.open_feign.defandspmvc_contract.defaultcontract.FeignDefaultContractTest - {
  "status" : 0,
  "msg" : "SUCCESS",
  "data" : {
    "timestamp" : "1611728644",
    "datetime_1" : "2021-01-27 14:24:04",
    "datetime_2" : "2021年01月27日 14时24分04秒",
    "week_1" : "3",
    "week_2" : "星期三",
    "week_3" : "周三",
    "week_4" : "Wednesday"
  }
}
18:21:13.136 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getIdCard] ---> GET http://localhost:8080/feign/getIDCard?app=idcard.get&idcard=110101199001011114&appkey=appkey&sign=sign&format=json HTTP/1.1
18:21:13.136 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getIdCard] ---> END HTTP (0-byte body)
18:21:13.168 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getIdCard] <--- HTTP/1.1 200 (31ms)
18:21:13.168 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getIdCard] connection: keep-alive
18:21:13.168 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getIdCard] content-type: application/json
18:21:13.168 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getIdCard] date: Tue, 02 Feb 2021 10:21:13 GMT
18:21:13.168 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getIdCard] keep-alive: timeout=60
18:21:13.168 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getIdCard] transfer-encoding: chunked
18:21:13.168 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getIdCard] 
18:21:13.169 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getIdCard] {"status":0,"msg":"SUCCESS","data":{"status":"ALREADY_ATT","idcard":"110101199001011114","par":"110101","born":"1990年01月01日","sex":"男","att":"北京市 东城区 ","postno":"100000","areano":"010","style_simcall":"中国,北京","style_citynm":"中华人民共和国,北京市"}}
18:21:13.169 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getIdCard] <--- END HTTP (287-byte body)
18:21:13.185 [main] INFO com.vincent.callingthirdpartyapi.open_feign.defandspmvc_contract.defaultcontract.FeignDefaultContractTest - {
  "status" : 0,
  "msg" : "SUCCESS",
  "data" : {
    "status" : "ALREADY_ATT",
    "idcard" : "110101199001011114",
    "par" : "110101",
    "born" : "1990年01月01日",
    "sex" : "男",
    "att" : "北京市 东城区 ",
    "postno" : "100000",
    "areano" : "010",
    "style_simcall" : "中国,北京",
    "style_citynm" : "中华人民共和国,北京市"
  }
}
18:21:13.776 [main] DEBUG org.springframework.cloud.openfeign.support.SpringEncoder - Writing [PhoneQueryDto(app=phone.get, phone=15021074475, appkey=10003, sign=b59bc3ef6191eb9f747dd4e83c99f2a4, format=json)] using [org.springframework.http.converter.json.MappingJackson2HttpMessageConverter@72737dba]
18:21:13.806 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postPhone] ---> POST http://localhost:8080/feign/postPhone?param=phone HTTP/1.1
18:21:13.806 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postPhone] Content-Length: 116
18:21:13.806 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postPhone] Content-Type: application/json
18:21:13.806 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postPhone] 
18:21:13.806 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postPhone] {"app":"phone.get","phone":"15021074475","appkey":"10003","sign":"b59bc3ef6191eb9f747dd4e83c99f2a4","format":"json"}
18:21:13.806 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postPhone] ---> END HTTP (116-byte body)
18:21:13.827 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postPhone] <--- HTTP/1.1 200 (20ms)
18:21:13.827 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postPhone] connection: keep-alive
18:21:13.827 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postPhone] content-type: application/json
18:21:13.827 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postPhone] date: Tue, 02 Feb 2021 10:21:13 GMT
18:21:13.827 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postPhone] keep-alive: timeout=60
18:21:13.827 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postPhone] transfer-encoding: chunked
18:21:13.827 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postPhone] 
18:21:13.828 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postPhone] {"status":0,"msg":"SUCCESS","data":{"status":"ALREADY_ATT","phone":"13800138000","area":"010","postno":"100000","att":"中国,北京","ctype":"北京移动全球通卡","par":"1380013","prefix":"138","operators":"移动","style_simcall":"中国,北京","style_citynm":"中华人民共和国,北京市"}}
18:21:13.828 [main] DEBUG feign.Logger - [FeignDefaultContractApi#postPhone] <--- END HTTP (303-byte body)
18:21:13.835 [main] INFO com.vincent.callingthirdpartyapi.open_feign.defandspmvc_contract.defaultcontract.FeignDefaultContractTest - {
  "status" : 0,
  "msg" : "SUCCESS",
  "data" : {
    "status" : "ALREADY_ATT",
    "phone" : "13800138000",
    "area" : "010",
    "postno" : "100000",
    "att" : "中国,北京",
    "ctype" : "北京移动全球通卡",
    "par" : "1380013",
    "prefix" : "138",
    "operators" : "移动",
    "style_simcall" : "中国,北京",
    "style_citynm" : "中华人民共和国,北京市"
  }
}
18:21:13.838 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadBySpringMvc] ---> GET http://localhost:8080/feign/downloadBySpringMvc?fileName=file.txt HTTP/1.1
18:21:13.839 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadBySpringMvc] ---> END HTTP (0-byte body)
18:21:13.883 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadBySpringMvc] <--- HTTP/1.1 200 (43ms)
18:21:13.883 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadBySpringMvc] accept-ranges: bytes
18:21:13.883 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadBySpringMvc] connection: keep-alive
18:21:13.883 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadBySpringMvc] content-disposition: attachment; filename=fileName.txt
18:21:13.883 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadBySpringMvc] content-length: 4
18:21:13.883 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadBySpringMvc] content-type: application/json
18:21:13.883 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadBySpringMvc] date: Tue, 02 Feb 2021 10:21:13 GMT
18:21:13.883 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadBySpringMvc] keep-alive: timeout=60
18:21:13.884 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadBySpringMvc] 
18:21:13.884 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadBySpringMvc] file
18:21:13.884 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadBySpringMvc] <--- END HTTP (4-byte body)
18:21:13.908 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadByHttpServlet] ---> GET http://localhost:8080/feign/downloadByHttpServlet?fileName=file.txt HTTP/1.1
18:21:13.908 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadByHttpServlet] ---> END HTTP (0-byte body)
18:21:13.913 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadByHttpServlet] <--- HTTP/1.1 200 (4ms)
18:21:13.913 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadByHttpServlet] connection: keep-alive
18:21:13.913 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadByHttpServlet] content-disposition: attachment; filename=fileName.txt
18:21:13.913 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadByHttpServlet] content-length: 27
18:21:13.914 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadByHttpServlet] content-type: application/octet-stream
18:21:13.914 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadByHttpServlet] date: Tue, 02 Feb 2021 10:21:13 GMT
18:21:13.914 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadByHttpServlet] keep-alive: timeout=60
18:21:13.914 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadByHttpServlet] 
18:21:13.914 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadByHttpServlet] file.txtdownload success...
18:21:13.914 [main] DEBUG feign.Logger - [FeignDefaultContractApi#downloadByHttpServlet] <--- END HTTP (27-byte body)
18:21:13.921 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getRestFul] ---> GET http://localhost:8080/feign/getRestFul/restful HTTP/1.1
18:21:13.922 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getRestFul] ---> END HTTP (0-byte body)
18:21:13.940 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getRestFul] <--- HTTP/1.1 200 (17ms)
18:21:13.940 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getRestFul] connection: keep-alive
18:21:13.940 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getRestFul] content-type: application/json
18:21:13.941 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getRestFul] date: Tue, 02 Feb 2021 10:21:13 GMT
18:21:13.941 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getRestFul] keep-alive: timeout=60
18:21:13.941 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getRestFul] transfer-encoding: chunked
18:21:13.941 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getRestFul] 
18:21:13.941 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getRestFul] {"status":0,"msg":"SUCCESS","data":"请求成功, 返回 param: restful"}
18:21:13.942 [main] DEBUG feign.Logger - [FeignDefaultContractApi#getRestFul] <--- END HTTP (73-byte body)
18:21:13.947 [main] INFO com.vincent.callingthirdpartyapi.open_feign.defandspmvc_contract.defaultcontract.FeignDefaultContractTest - {
  "status" : 0,
  "msg" : "SUCCESS",
  "data" : "请求成功, 返回 param: restful"
}
```

#### SpringMvcContract
##### FeignSpringMvcContractApi
```java
/**
 * @author vincent
 */
public interface FeignSpringMvcContractApi {

    @PostMapping(value = "/postPhone")
    ResponseDto<PhoneDto> postPhone(@RequestBody PhoneQueryDto queryDto, @RequestParam("param") String param);

    @PostMapping(value = "/postFormTime", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    ResponseDto<TimeDto> postFormTime(TimeQueryDto queryDto);

    @GetMapping(value = "/getIDCard")
    ResponseDto<IDCardDto> getIdCard(@RequestParam("app") String app,
                                     @RequestParam("idcard") String idcard,
                                     @RequestParam("appkey") String appkey,
                                     @RequestParam("sign") String sign,
                                     @RequestParam("format") String format);

    @GetMapping(value = "/getRestFul/{param}")
    ResponseDto<String> getRestFul(@PathVariable("param") String param);

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseDto<String> upload(@RequestPart("file") MultipartFile file);

    @GetMapping(value = "/downloadBySpringMvc")
    InputStream downloadBySpringMvc(@RequestParam("fileName") String fileName);

    @GetMapping(value = "/downloadByHttpServlet")
    InputStream downloadByHttpServlet(@RequestParam("fileName") String fileName);
}
```

##### FeignSpringMvcContractTest
```java
@Slf4j
public class FeignSpringMvcContractTest {

    private final static String PATH = "/Users/vincent/IDEA_Project/my_project/calling-third-party-api/src/test/java/com/vincent/callingthirdpartyapi/open_feign/defandspmvc_contract";

    private final static String URL = "http://localhost:8080/feign";

    private static FeignSpringMvcContractApi singleClient;

    @BeforeAll
    public static void createFeignClint() {
        singleClient = DefaultFeignClient.getSingleClient(FeignSpringMvcContractApi.class, URL, ContractEnum.SPRINGMVC);
    }

    @Test
    public void postTest() throws JsonProcessingException {
        PhoneQueryDto phoneQueryDto = new PhoneQueryDto();
        phoneQueryDto.setApp("phone.get");
        phoneQueryDto.setPhone("15021074475");
        phoneQueryDto.setAppkey("10003");
        phoneQueryDto.setSign("b59bc3ef6191eb9f747dd4e83c99f2a4");
        phoneQueryDto.setFormat("json");
        ResponseDto<PhoneDto> responseDto = singleClient.postPhone(phoneQueryDto, "phone");
        log.info(new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(responseDto));
    }

    @Test
    public void postFormTest() throws JsonProcessingException {
        TimeQueryDto timeQueryDto = new TimeQueryDto();
        timeQueryDto.setApp("life.time");
        timeQueryDto.setAppkey("10003");
        timeQueryDto.setSign("b59bc3ef6191eb9f747dd4e83c99f2a4");
        timeQueryDto.setFormat("json");
        ResponseDto<TimeDto> responseDto = singleClient.postFormTime(timeQueryDto);
        log.info(new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(responseDto));
    }

    @Test
    public void getTest() throws JsonProcessingException {
        ResponseDto<IDCardDto> responseDto = singleClient.getIdCard("idcard.get", "110101199001011114", "appkey", "sign", "json");
        log.info(new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(responseDto));
    }

    @Test
    public void getRestFulTest() throws JsonProcessingException {
        ResponseDto<String> responseDto = singleClient.getRestFul("restful");
        log.info(new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(responseDto));
    }

    @Test
    public void uploadTest() throws IOException {
        String name = "file.txt";
        Path filePath = Paths.get(PATH).resolve(name);
        String originalFileName = "file.txt";
        String contentType = "application/octet-stream";
        byte[] content = Files.readAllBytes(filePath);
        MultipartFile multipartFile = new MockMultipartFile(name, originalFileName, contentType, content);
        ResponseDto<String> responseDto = singleClient.upload(multipartFile);
        log.info(new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(responseDto));
    }

    @Test
    public void downloadTest() throws IOException {
        Path path = Paths.get(PATH);
        InputStream inSpring = singleClient.downloadBySpringMvc("file.txt");
        IOUtils.copy(inSpring, Files.newOutputStream(path.resolve("downbyspring.txt")));

        InputStream inServlet = singleClient.downloadByHttpServlet("file.txt");
        IOUtils.copy(inServlet, Files.newOutputStream(path.resolve("downbyservlet.txt")));
    }
}
```

**FeignServerController 日志结果：**
```
2021-02-02 18:23:09.929  INFO 6571 --- [nio-8080-exec-9] c.v.c.o.d.c.FeignServerController        : upload 请求参数 MultipartFile file: org.springframework.web.multipart.support.StandardMultipartHttpServletRequest$StandardMultipartFile@62082936...
2021-02-02 18:23:09.929  INFO 6571 --- [nio-8080-exec-9] c.v.c.o.d.c.FeignServerController        : File name: file.txt...
2021-02-02 18:23:10.877  INFO 6571 --- [io-8080-exec-10] c.v.c.o.d.c.FeignServerController        : postFormTime 请求参数 queryDto: TimeQueryDto(app=life.time, appkey=10003, sign=b59bc3ef6191eb9f747dd4e83c99f2a4, format=json)...
2021-02-02 18:23:10.917  INFO 6571 --- [nio-8080-exec-1] c.v.c.o.d.c.FeignServerController        : getIDCard 请求参数 app: idcard.get, idcard: 110101199001011114, appkey: appkey, sign: sign, format: json...
2021-02-02 18:23:11.376  INFO 6571 --- [nio-8080-exec-2] c.v.c.o.d.c.FeignServerController        : postPhone 请求参数 queryDto: PhoneQueryDto(app=phone.get, phone=15021074475, appkey=10003, sign=b59bc3ef6191eb9f747dd4e83c99f2a4, format=json), param: phone...
2021-02-02 18:23:11.398  INFO 6571 --- [nio-8080-exec-3] c.v.c.o.d.c.FeignServerController        : downloadBySpringMvc 请求参数 String fileName: file.txt...
2021-02-02 18:23:11.421  INFO 6571 --- [nio-8080-exec-4] c.v.c.o.d.c.FeignServerController        : downloadByHttpServlet 请求参数 String fileName: file.txt...
2021-02-02 18:23:11.435  INFO 6571 --- [nio-8080-exec-5] c.v.c.o.d.c.FeignServerController        : getRestFul 请求参数 param: restful...
```

**FeignSpringMvcContractTest 日志结果：**
```
18:23:09.894 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#upload] ---> POST http://localhost:8080/feign/upload HTTP/1.1
18:23:09.899 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#upload] Content-Length: 181
18:23:09.899 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#upload] Content-Type: multipart/form-data; charset=UTF-8; boundary=1776244763d
18:23:09.899 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#upload] 
18:23:09.899 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#upload] Binary data
18:23:09.899 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#upload] ---> END HTTP (181-byte body)
18:23:10.053 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#upload] <--- HTTP/1.1 200 (38ms)
18:23:10.053 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#upload] connection: keep-alive
18:23:10.053 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#upload] content-type: application/json
18:23:10.053 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#upload] date: Tue, 02 Feb 2021 10:23:09 GMT
18:23:10.053 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#upload] keep-alive: timeout=60
18:23:10.054 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#upload] transfer-encoding: chunked
18:23:10.054 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#upload] 
18:23:10.062 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#upload] {"status":0,"msg":"SUCCESS","data":"file.txt upload success..."}
18:23:10.063 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#upload] <--- END HTTP (64-byte body)
18:23:10.849 [main] INFO com.vincent.callingthirdpartyapi.open_feign.defandspmvc_contract.springmvccontract.FeignSpringMvcContractTest - {
  "status" : 0,
  "msg" : "SUCCESS",
  "data" : "file.txt upload success..."
}
18:23:10.870 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postFormTime] ---> POST http://localhost:8080/feign/postFormTime HTTP/1.1
18:23:10.870 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postFormTime] Content-Length: 76
18:23:10.871 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postFormTime] Content-Type: application/x-www-form-urlencoded; charset=UTF-8
18:23:10.871 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postFormTime] 
18:23:10.871 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postFormTime] app=life.time&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json&appkey=10003
18:23:10.871 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postFormTime] ---> END HTTP (76-byte body)
18:23:10.885 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postFormTime] <--- HTTP/1.1 200 (13ms)
18:23:10.885 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postFormTime] connection: keep-alive
18:23:10.885 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postFormTime] content-type: application/json
18:23:10.885 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postFormTime] date: Tue, 02 Feb 2021 10:23:09 GMT
18:23:10.885 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postFormTime] keep-alive: timeout=60
18:23:10.885 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postFormTime] transfer-encoding: chunked
18:23:10.885 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postFormTime] 
18:23:10.886 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postFormTime] {"status":0,"msg":"SUCCESS","data":{"timestamp":"1611728644","datetime_1":"2021-01-27 14:24:04","datetime_2":"2021年01月27日 14时24分04秒","week_1":"3","week_2":"星期三","week_3":"周三","week_4":"Wednesday"}}
18:23:10.886 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postFormTime] <--- END HTTP (219-byte body)
18:23:10.902 [main] INFO com.vincent.callingthirdpartyapi.open_feign.defandspmvc_contract.springmvccontract.FeignSpringMvcContractTest - {
  "status" : 0,
  "msg" : "SUCCESS",
  "data" : {
    "timestamp" : "1611728644",
    "datetime_1" : "2021-01-27 14:24:04",
    "datetime_2" : "2021年01月27日 14时24分04秒",
    "week_1" : "3",
    "week_2" : "星期三",
    "week_3" : "周三",
    "week_4" : "Wednesday"
  }
}
18:23:10.914 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getIdCard] ---> GET http://localhost:8080/feign/getIDCard?app=idcard.get&idcard=110101199001011114&appkey=appkey&sign=sign&format=json HTTP/1.1
18:23:10.914 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getIdCard] ---> END HTTP (0-byte body)
18:23:10.924 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getIdCard] <--- HTTP/1.1 200 (9ms)
18:23:10.924 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getIdCard] connection: keep-alive
18:23:10.924 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getIdCard] content-type: application/json
18:23:10.924 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getIdCard] date: Tue, 02 Feb 2021 10:23:09 GMT
18:23:10.925 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getIdCard] keep-alive: timeout=60
18:23:10.925 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getIdCard] transfer-encoding: chunked
18:23:10.925 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getIdCard] 
18:23:10.925 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getIdCard] {"status":0,"msg":"SUCCESS","data":{"status":"ALREADY_ATT","idcard":"110101199001011114","par":"110101","born":"1990年01月01日","sex":"男","att":"北京市 东城区 ","postno":"100000","areano":"010","style_simcall":"中国,北京","style_citynm":"中华人民共和国,北京市"}}
18:23:10.925 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getIdCard] <--- END HTTP (287-byte body)
18:23:10.937 [main] INFO com.vincent.callingthirdpartyapi.open_feign.defandspmvc_contract.springmvccontract.FeignSpringMvcContractTest - {
  "status" : 0,
  "msg" : "SUCCESS",
  "data" : {
    "status" : "ALREADY_ATT",
    "idcard" : "110101199001011114",
    "par" : "110101",
    "born" : "1990年01月01日",
    "sex" : "男",
    "att" : "北京市 东城区 ",
    "postno" : "100000",
    "areano" : "010",
    "style_simcall" : "中国,北京",
    "style_citynm" : "中华人民共和国,北京市"
  }
}
18:23:11.338 [main] DEBUG org.springframework.cloud.openfeign.support.SpringEncoder - Writing [PhoneQueryDto(app=phone.get, phone=15021074475, appkey=10003, sign=b59bc3ef6191eb9f747dd4e83c99f2a4, format=json)] using [org.springframework.http.converter.json.MappingJackson2HttpMessageConverter@5e54d2a2]
18:23:11.371 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postPhone] ---> POST http://localhost:8080/feign/postPhone?param=phone HTTP/1.1
18:23:11.371 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postPhone] Content-Length: 116
18:23:11.371 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postPhone] Content-Type: application/json
18:23:11.371 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postPhone] 
18:23:11.371 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postPhone] {"app":"phone.get","phone":"15021074475","appkey":"10003","sign":"b59bc3ef6191eb9f747dd4e83c99f2a4","format":"json"}
18:23:11.372 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postPhone] ---> END HTTP (116-byte body)
18:23:11.380 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postPhone] <--- HTTP/1.1 200 (8ms)
18:23:11.381 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postPhone] connection: keep-alive
18:23:11.381 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postPhone] content-type: application/json
18:23:11.381 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postPhone] date: Tue, 02 Feb 2021 10:23:11 GMT
18:23:11.381 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postPhone] keep-alive: timeout=60
18:23:11.381 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postPhone] transfer-encoding: chunked
18:23:11.381 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postPhone] 
18:23:11.381 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postPhone] {"status":0,"msg":"SUCCESS","data":{"status":"ALREADY_ATT","phone":"13800138000","area":"010","postno":"100000","att":"中国,北京","ctype":"北京移动全球通卡","par":"1380013","prefix":"138","operators":"移动","style_simcall":"中国,北京","style_citynm":"中华人民共和国,北京市"}}
18:23:11.381 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#postPhone] <--- END HTTP (303-byte body)
18:23:11.391 [main] INFO com.vincent.callingthirdpartyapi.open_feign.defandspmvc_contract.springmvccontract.FeignSpringMvcContractTest - {
  "status" : 0,
  "msg" : "SUCCESS",
  "data" : {
    "status" : "ALREADY_ATT",
    "phone" : "13800138000",
    "area" : "010",
    "postno" : "100000",
    "att" : "中国,北京",
    "ctype" : "北京移动全球通卡",
    "par" : "1380013",
    "prefix" : "138",
    "operators" : "移动",
    "style_simcall" : "中国,北京",
    "style_citynm" : "中华人民共和国,北京市"
  }
}
18:23:11.394 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadBySpringMvc] ---> GET http://localhost:8080/feign/downloadBySpringMvc?fileName=file.txt HTTP/1.1
18:23:11.395 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadBySpringMvc] ---> END HTTP (0-byte body)
18:23:11.403 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadBySpringMvc] <--- HTTP/1.1 200 (7ms)
18:23:11.403 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadBySpringMvc] accept-ranges: bytes
18:23:11.403 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadBySpringMvc] connection: keep-alive
18:23:11.403 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadBySpringMvc] content-disposition: attachment; filename=fileName.txt
18:23:11.404 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadBySpringMvc] content-length: 4
18:23:11.404 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadBySpringMvc] content-type: application/json
18:23:11.404 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadBySpringMvc] date: Tue, 02 Feb 2021 10:23:11 GMT
18:23:11.404 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadBySpringMvc] keep-alive: timeout=60
18:23:11.404 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadBySpringMvc] 
18:23:11.404 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadBySpringMvc] file
18:23:11.404 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadBySpringMvc] <--- END HTTP (4-byte body)
18:23:11.418 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadByHttpServlet] ---> GET http://localhost:8080/feign/downloadByHttpServlet?fileName=file.txt HTTP/1.1
18:23:11.418 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadByHttpServlet] ---> END HTTP (0-byte body)
18:23:11.425 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadByHttpServlet] <--- HTTP/1.1 200 (5ms)
18:23:11.425 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadByHttpServlet] connection: keep-alive
18:23:11.426 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadByHttpServlet] content-disposition: attachment; filename=fileName.txt
18:23:11.426 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadByHttpServlet] content-length: 27
18:23:11.427 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadByHttpServlet] content-type: application/octet-stream
18:23:11.427 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadByHttpServlet] date: Tue, 02 Feb 2021 10:23:11 GMT
18:23:11.427 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadByHttpServlet] keep-alive: timeout=60
18:23:11.427 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadByHttpServlet] 
18:23:11.428 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadByHttpServlet] file.txtdownload success...
18:23:11.428 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#downloadByHttpServlet] <--- END HTTP (27-byte body)
18:23:11.432 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getRestFul] ---> GET http://localhost:8080/feign/getRestFul/restful HTTP/1.1
18:23:11.432 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getRestFul] ---> END HTTP (0-byte body)
18:23:11.436 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getRestFul] <--- HTTP/1.1 200 (4ms)
18:23:11.437 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getRestFul] connection: keep-alive
18:23:11.437 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getRestFul] content-type: application/json
18:23:11.437 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getRestFul] date: Tue, 02 Feb 2021 10:23:11 GMT
18:23:11.437 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getRestFul] keep-alive: timeout=60
18:23:11.437 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getRestFul] transfer-encoding: chunked
18:23:11.437 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getRestFul] 
18:23:11.437 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getRestFul] {"status":0,"msg":"SUCCESS","data":"请求成功, 返回 param: restful"}
18:23:11.437 [main] DEBUG feign.Logger - [FeignSpringMvcContractApi#getRestFul] <--- END HTTP (73-byte body)
18:23:11.443 [main] INFO com.vincent.callingthirdpartyapi.open_feign.defandspmvc_contract.springmvccontract.FeignSpringMvcContractTest - {
  "status" : 0,
  "msg" : "SUCCESS",
  "data" : "请求成功, 返回 param: restful"
}
```

Case Source Code：https://github.com/V-Vincen/calling-third-party-api
