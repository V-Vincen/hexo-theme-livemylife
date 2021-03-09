---
title: '[Calling Third-party API - OpenFeign] 5 Feign Spring Cloud upload、download File'
catalog: true
date: 2021-02-08 17:02:33
subtitle: Feign is a Java to HTTP client binder inspired by Retrofit, JAXRS-2.0, and WebSocket. Feign's first goal was reducing the complexity of binding Denominator uniformly to HTTP APIs regardless of ReSTfulness...
header-img: /img/header_img/tag_bg2.jpg
tags:
- Calling Third-party API
- OpenFeign
---

## 前言

上文中讲到了 `Feign` 结合 `SpringBoot` 注解的具体用法以及 `CircuitBreaker Fallbacks` 的用法。具体可阅览 [Feign Spring Cloud CircuitBreaker Fallbacks](https://v-vincen.github.io/2021/02/06/Calling-Third-party-API-OpenFeign-4-Feign-Spring-Cloud-CircuitBreaker-Fallbacks/)。今天博主要总结的是如何运用 Spring Cloud Feign 来实现文件上传下载功能。还是老规矩直接上案例代码。


## Serveer
`pom.xml` 和 `Commons` 类同上  [Feign Spring Cloud CircuitBreaker Fallbacks](https://v-vincen.github.io/2021/02/06/Calling-Third-party-API-OpenFeign-4-Feign-Spring-Cloud-CircuitBreaker-Fallbacks/) 中一样，这里就不再赘述了。

### Controller
#### ServerUpDownloadFileController
```java
/**
 * @author vincent
 */
@RestController
@Slf4j
@RequestMapping(value = "/file")
public class ServerUpDownloadFileController {

    private final static String PATH = "/Users/vincent/IDEA_Project/my_project/calling-third-party-api/src/main/java/com/vincent/callingthirdpartyapi/open_feign/spring_cloud_open_feign";

    @PostMapping(value = "/upload")
    public ResponseDto<String> upload(@RequestParam("file") MultipartFile file) throws IOException {
        log.info("Upload Method Params MultipartFile file: {}...", file);
        String name = file.getOriginalFilename();
        log.info("File name: {}...", name);
        file.transferTo(Paths.get(PATH).resolve("upload_file.txt"));
        return ResponseDto.success(name + " upload success...");
    }

    /**
     * Spring 提供的类：FileSystemResource
     *
     * @param fileName 文件名
     * @param response 响应
     * @return FileSystemResource
     * @throws UnsupportedEncodingException 异常
     */
    @GetMapping(value = "/download")
    public FileSystemResource download(@RequestParam("fileName") String fileName, HttpServletResponse response) throws UnsupportedEncodingException {
        log.info("Download Method Params String fileName: {}...", fileName);
        Path filePath = Paths.get(PATH).resolve(fileName);
        response.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + URLEncoder.encode("download_file.txt", StandardCharsets.UTF_8.toString()));
        return new FileSystemResource(filePath);
    }

    @GetMapping(value = "/download2")
    public void download2(@RequestParam("fileName") String fileName, HttpServletResponse response) throws Exception {
        log.info("Download2 Method Params String fileName: {}...", fileName);
        Path filePath = Paths.get(PATH).resolve(fileName);
        response.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + URLEncoder.encode("fileName.txt", "UTF-8"));
//        IOUtils.copy(Files.newInputStream(filePath), response.getOutputStream());//这个写法和下面的写法是一个意思
        response.getOutputStream().write(Files.readAllBytes(filePath));
    }
}
```

## Client
### Utils
#### ClassUtils
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

#### <font color='red'> DefaultFallbackFactory </font>
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

### Config
#### <font color='red'> CircuitBreakerConfig </font>
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

#### <font color='red'> FeignConfig </font>
```java
@Configuration
public class FeignConfig {
    /**
     * doNotCloseAfterDecode(): 该构造方法的作用为，当响应返回的 response 进行解码器解析后，对其不进行关闭。
     * 这里主要用于文件下载时，以流的形式成功返回后，防止流的关闭。
     * 如果不设置该值，在调用第三方的下载接口时，会抛出 java.io.IOException: stream is closed 异常。
     *
     * @return Feign.Builder
     */
    @Bean
    public Feign.Builder doNotCloseAfterDecode() {
        return Feign.builder().doNotCloseAfterDecode();
    }

    @Autowired
    private ObjectFactory<HttpMessageConverters> messageConverters;

    /**
     * 编码器: 支持以下三种请求格式
     * 1. application/json
     * 2. application/x-www-form-urlencoded
     * 3. multipart/form-data
     *
     * @return Encoder
     */
    @Bean
    public Encoder feignFormEncoder() {
        return new SpringFormEncoder(new SpringEncoder(messageConverters));
    }

    /**
     * 解码器: 支持两种响应格式
     * 1. 返回值类型为 InputStream（主要用于文件下载）
     * 2. 其余返回值类型，以 json 数据格式进行解析
     *
     * @return Decoder
     */
    @Bean
    public Decoder feignFormDecoder() {
        return (response, type) -> {
            if (type == InputStream.class) {
                return response.body().asInputStream();
            }
            return new JacksonDecoder().decode(response, type);
        };
    }
}
```
 在里有一点需要注意：关于解码器 `Decoder feignFormDecoder()` 方法的配置，博主在这里是将 `response` 转换为流的形式进行相关处理，但并不是就这一种方式。大致可以分成三种方式：
 - `InputStream`：转换为输入流，上述案例就是。
 - `MultipartFile[]`：转换为 MultipartFile，官网 [feign-form](https://github.com/OpenFeign/feign-form#spring-multipartfile-and-spring-cloud-netflix-feignclient-support) 给出了相关案例，如下：
    ```java
    @FeignClient(
        name = "${feign.name}",
        url = "${feign.url}"
        configuration = DownloadClient.ClientConfiguration.class
    )
    public interface DownloadClient {
    
      @RequestMapping("/multipart/download/{fileId}")
      MultipartFile[] download(@PathVariable("fileId") String fileId);
    
      class ClientConfiguration {
    
        @Autowired
        private ObjectFactory<HttpMessageConverters> messageConverters;
    
        @Bean
        public Decoder feignDecoder () {
          List<HttpMessageConverter<?>> springConverters =
                messageConverters.getObject().getConverters();
    
          List<HttpMessageConverter<?>> decoderConverters =
                new ArrayList<HttpMessageConverter<?>>(springConverters.size() + 1);
    
          decoderConverters.addAll(springConverters);
          decoderConverters.add(new SpringManyMultipartFilesReader(4096));
    
          HttpMessageConverters httpMessageConverters = new HttpMessageConverters(decoderConverters);
    
          return new SpringDecoder(new ObjectFactory<HttpMessageConverters>() {
    
            @Override
            public HttpMessageConverters getObject() {
              return httpMessageConverters;
            }
          });
        }
      }
    }
    ```

- `byte[]`：转换成 byte[] 来处理，这种案例网上有很多，可自行搜索。在 [Spring Cloud Netflix Issues](https://github.com/spring-cloud/spring-cloud-netflix/issues/2246) 中，我看到了这样一个案例写法，如下：
    ```
    <dependency>
        <groupId>io.github.openfeign.form</groupId>
	    <artifactId>feign-form</artifactId>
	    <version>2.2.1</version>
    </dependency>
    
    <dependency>
    	<groupId>io.github.openfeign.form</groupId>
    	<artifactId>feign-form-spring</artifactId>
    	<version>2.2.1</version>
    </dependency>
    ```
    ```java
    import org.springframework.util.FileCopyUtils;
    import org.springframework.web.multipart.MultipartFile;
    
    import java.io.*;
    
    public class InMemoryMultipartFile implements MultipartFile {
    
        private final String name;
        private final String originalFileName;
        private final String contentType;
        private final byte[] payload;
    
        public InMemoryMultipartFile(File file) throws IOException {
            this.originalFileName = file.getName();
            this.payload = FileCopyUtils.copyToByteArray(file);
            this.name = "file";
            this.contentType = "application/octet-stream";
        }
    
        public InMemoryMultipartFile(String originalFileName, byte[] payload) {
            this.originalFileName = originalFileName;
            this.payload = payload;
            this.name = "file";
            this.contentType = "application/octet-stream";
        }
    
        public InMemoryMultipartFile(String name, String originalFileName, String contentType, byte[] payload) {
            if (payload == null) {
                throw new IllegalArgumentException("Payload cannot be null.");
            }
            this.name = name;
            this.originalFileName = originalFileName;
            this.contentType = contentType;
            this.payload = payload;
        }
    
        @Override
        public String getName() {
            return name;
        }
    
        @Override
        public String getOriginalFilename() {
            return originalFileName;
        }
    
        @Override
        public String getContentType() {
            return contentType;
        }
    
        @Override
        public boolean isEmpty() {
            return payload.length == 0;
        }
    
        @Override
        public long getSize() {
            return payload.length;
        }
    
        @Override
        public byte[] getBytes() throws IOException {
            return payload;
        }
    
        @Override
        public InputStream getInputStream() throws IOException {
            return new ByteArrayInputStream(payload);
        }
    
        @Override
        public void transferTo(File dest) throws IOException, IllegalStateException {
            new FileOutputStream(dest).write(payload);
        }
    }
    ```
    ```java
    @FeignClient(value = "material", configuration = MaterialClient.MultipartSupportConfig.class)
    public interface MaterialClient {
    
        @PostMapping("/uploadFile")
        @Headers("Content-Type: multipart/form-data")
        ResponseMO uploadFile(@RequestPart("file") MultipartFile file);
    
    
        @GetMapping("/oss/downFile")
        MultipartFile downFile(@RequestParam("key") String key);
    
    
        class MultipartSupportConfig {
    
            @Autowired
            ObjectFactory<HttpMessageConverters> messageConverters;
    
            @Bean
            @Primary
            @Scope("prototype")
            public Encoder multipartFormEncoder() {
                return new SpringFormEncoder(new SpringEncoder(messageConverters));
            }
    
            @Bean
            @Primary
            @Scope("prototype")
            public Decoder decoder() {
                Decoder decoder = (response, type) -> {
                    if (type instanceof Class && MultipartFile.class.isAssignableFrom((Class) type)) {
                        Collection<String> contentTypes = response.headers().get("content-type");
                        String contentType = "application/octet-stream";
                        if (contentTypes.size() > 0) {
                            String[] temp = new String[contentTypes.size()];
                            contentTypes.toArray(temp);
                            contentType = temp[0];
                        }
    
    
                        byte[] bytes = StreamUtils.copyToByteArray(response.body().asInputStream());
                        InMemoryMultipartFile inMemoryMultipartFile = new InMemoryMultipartFile("file","", contentType,bytes);
                        return inMemoryMultipartFile;
                    }
                    return new SpringDecoder(messageConverters).decode(response, type);
                };
                return new ResponseEntityDecoder(decoder);
            }
        }
    }
    ```
    **注意：** 这段代码的解码器配置，是将 `response` 转换为 MultipartFile 来处理，但其主要是通过 `byte[]` 进行相关处理的，所以我把它归在 `byte[]` 处理方式这类中。那么这个案例是否正确，博主本人并没有尝试过（应该是可行的），也并不想探讨这个问题。而是想说，如果将输入流转换为 `byte[]` 来进行文件的处理，会存在一个很大的风险。那就是 `byte[]` 可接收的字节是存在上线的，转换如果超出了这个上线，必然会抛出异常，甚至可能会造成项目崩溃。所以博主在这里不建议这么用。当然你可以通过限制被下载文件的大小来解决这个问题。
    这里还有一个案例 [spring cloud feign file upload and file download](https://programming.vip/docs/spring-cloud-feign-file-upload-and-file-download.html)：
    ```java
    /**
     * @author lr
     */
    @FeignClient(name = ClientUrl.SYSTEM_NAME, fallbackFactory = FileTestClientFallbackFactory.class)
    @Component
    public interface FileTestClient {
    
        /**
         * Upload file test
         *
         * @return
         */
        @PostMapping(value = ClientUrl.PRE_REQUEST_RUL + "/file/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        Object upload(MultipartFile file);
    
        /**
         * Download File Test
         */
        @RequestMapping(value = ClientUrl.PRE_REQUEST_RUL + "/file/download", method = RequestMethod.GET)
        Response download();
    
    }
    ```
    ```java
    /**
     * @author lr
     */
    @Slf4j
    @Component
    public class FileTestClientFallbackFactory implements FallbackFactory<FileTestClient> {
        @Override
        public FileTestClient create(Throwable cause) {
    
            return new FileTestClient() {
                @Override
                public Object upload(MultipartFile file) {
                    log.error("fallback; file upload reason was: " + cause.getMessage());
                    return null;
                }
    
                @Override
                public Response download() {
                    log.error("fallback; file download reason was: " + cause.getMessage());
                    return null;
                }
            };
        }
    }
    ```
    ```java
    @RestController
    @Slf4j
    public class FileController {
    
        @Autowired
        FileTestClient fileTestClient;
    
        @Log("File upload test")
        @PostMapping("/upload")
        public Object upload(MultipartFile file) {
            log.info("Use feign Call service, file upload");
            return fileTestClient.upload(file);
        }
    
        @Log("File download test")
        @RequestMapping(value = "/download", method = RequestMethod.GET)
        public ResponseEntity<byte[]> downFile() {
            log.info("Use feign Call service file download");
    
            ResponseEntity<byte[]> result = null;
            InputStream inputStream = null;
            try {
                // feign File download
                Response response = fileTestClient.download();
                Response.Body body = response.body();
                inputStream = body.asInputStream();
                byte[] b = new byte[inputStream.available()];
                inputStream.read(b);
                HttpHeaders heads = new HttpHeaders();
                heads.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=lr.xls");
                heads.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
    
                result = new ResponseEntity<byte[]>(b, heads, HttpStatus.OK);
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                if (inputStream != null) {
                    try {
                        inputStream.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
            return result;
        }
    }
    ```
    这个案例的下载，是直接把 `response` 整体都进行了返回，然后再通过 `byte[]` 进行处理。
    ```java
    Response response = fileTestClient.download();
    Response.Body body = response.body();
    inputStream = body.asInputStream();
    byte[] b = new byte[inputStream.available()];
    ```
    所以我也把它归在 `byte[]` 处理方式这一类中。该案例也同样有上述所说的问题 `byte[] b = new byte[inputStream.available()];`，当 `inputStream.available()` 超出 `byte[]` 容纳上线时就会出现问题。
    

### ApiClient
#### UpDownloadFileApiClient
```java
/**
 * @author vincent
 */
@FeignClient(name = "UpDownloadFileApiClient", url = "http://localhost:8080/file",
        configuration = FeignConfig.class,
        fallbackFactory = UpDownloadFileApiClient.UpDownloadFileApiClientFactory.class
)
public interface UpDownloadFileApiClient {
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseDto<String> upload(@RequestPart("file") MultipartFile file);

    @GetMapping(value = "/download")
    InputStream download(@RequestParam("fileName") String fileName);

    @GetMapping(value = "/download2")
    InputStream download2(@RequestParam("fileName") String fileName);


    @Component
    class UpDownloadFileApiClientFactory implements DefaultFallbackFactory<UpDownloadFileApiClient> {
        private static final Map<Class<?>, Function<Throwable, Object>> WRAPPER_EXCEPTION = ImmutableMap.of(
                // 如果返回类型是 InputStream, 在 http 调用失败的情况下抛出 RuntimeException(e)
                InputStream.class, e -> {
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
#### CloudFeignUpDownloadFileTest
```java
@SpringBootTest(classes = CallingThirdPartyApiApplicationTests.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        value = {"feign.circuitbreaker.enabled=true"}
)
@Slf4j
public class CloudFeignUpDownloadFileTest {
    private final static String PATH = "/Users/vincent/IDEA_Project/my_project/calling-third-party-api/src/test/java/com/vincent/callingthirdpartyapi/open_feign/spring_cloud_open_feign";

    @Autowired
    private UpDownloadFileApiClient upDownloadFileApiClient;

    @Test
    public void uploadTest() throws IOException {
        String name = "upload_test_file.txt";
        Path filePath = Paths.get(PATH).resolve(name);
        String originalFileName = "upload_test_file.txt";
        String contentType = "application/octet-stream";
        byte[] content = Files.readAllBytes(filePath);
        MultipartFile multipartFile = new MockMultipartFile(name, originalFileName, contentType, content);
        ResponseDto<String> responseDto = upDownloadFileApiClient.upload(multipartFile);
        log.info(new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(responseDto));
    }

    @Test
    public void downloadTest() throws IOException {
        Path path = Paths.get(PATH);
        InputStream inputStream = upDownloadFileApiClient.download("upload_file.txt");
        IOUtils.copy(inputStream, Files.newOutputStream(path.resolve("down_file.txt")));

        InputStream inputStream2 = upDownloadFileApiClient.download("upload_file.txt");
        IOUtils.copy(inputStream2, Files.newOutputStream(path.resolve("down_file2.txt")));
    }
}
```

**注意：** 启动 `CloudFeignUpDownloadFileTest` 别忘了先创建一个 `upload_test_file.txt` 文本文件。

## How to Download a File from a URL in Java
其实文件的下载还有更简单的方法，并不一定要用 `Feign Spring Cloud`。我在这里简单的举个例子：
```java
InputStream inputStream = new URL("http://example.com/my-file-path.txt").openStream();
IOUtils.copy(inpuStream, Files.newOutputStream(Paths.get("/Users/username/Documents").resolve("file_name.txt")));
```
搞定，是不是很简单。更多方法可以阅读 [How to Download a File from a URL in Java](https://v-vincen.github.io/2021/01/31/IO-5-How-to-Download-a-File-from-a-URL-in-Java/)。


Reference Resources：https://github.com/OpenFeign/feign-form
Reference Resources：https://github.com/spring-cloud/spring-cloud-netflix/issues/2246
Reference Resources：https://programming.vip/docs/spring-cloud-feign-file-upload-and-file-download.html

Case Source Code：https://github.com/V-Vincen/calling-third-party-api




    
    
 



