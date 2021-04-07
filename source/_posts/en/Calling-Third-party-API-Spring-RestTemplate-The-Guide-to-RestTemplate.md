---
title: '[Calling Third-party API - Spring RestTemplate] The Guide to RestTemplate'
catalog: true
date: 2020-11-12 18:37:48
subtitle: Synchronous client to perform HTTP requests, exposing a simple, template method API over underlying HTTP client libraries such as the JDK HttpURLConnection, Apache HttpComponents, and others...
header-img: /img/header_img/tag_bg2.jpg
tags:
- Calling Third-party API
- Spring RestTemplate
---

首先在我们学习使用 RestTemplate 之前，先认识下这个类，来看 Spring 官方怎么描述的。 从官方 API 文档 [RestTemplate javadoc](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html) 可以找该类的描述如下：

> Synchronous client to perform HTTP requests, exposing a simple, template method API over underlying HTTP client libraries such as the JDK HttpURLConnection, Apache HttpComponents, and others.
The RestTemplate offers templates for common scenarios by HTTP method, in addition to the generalized exchange and execute methods that support of less frequent cases.

从这里可以清楚地了解到 RestTemplate 采用同步方式执行 HTTP 请求的类，底层使用 JDK 原生 `HttpURLConnection API`，或者 `HttpComponents` 等其他 HTTP 客户端请求类库。还有一处强调的就是 RestTemplate 提供模板化的方法让开发者能更简单地发送 HTTP 请求。值得注意的是，RestTemplate 类是在 Spring Framework 3.0 开始引入的，这里我们使用的 Spring 版本为当前最新的 `GA 版本 5.3.1`。而在 5.0 以上，官方标注了更推荐使用非阻塞的响应式 HTTP 请求处理类 `org.springframework.web.reactive.client.WebClient` 来替代 RestTemplate，尤其是对应异步请求处理的场景上 。这里我们先简单总结下什么是 RestTemplate：RestTemplate 就是 Spring 封装的处理同步 HTTP 请求的类。具体如何使用这个类进行 HTTP 请求操作，可见下文。

## RestTemplate methods
接下来我们看下 RestTemplate 类提供的 API 有哪些，RestTemplate 提供了将近 30 个请求方法，其中多数是单个方法重载实现，这里主要参考官方文档 [rest-resttemplate](https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#rest-resttemplate) 进行如下分类：
<table id="rest-overview-of-resttemplate-methods-tbl" class="tableblock frame-all grid-all stretch">
<caption class="title">Table 1. RestTemplate methods</caption>
<colgroup>
<col style="width: 25%;">
<col style="width: 75%;">
</colgroup>
<thead>
<tr>
<th class="tableblock halign-left valign-top">Method group</th>
<th class="tableblock halign-left valign-top">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>getForObject</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Retrieves a representation via GET.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>getForEntity</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Retrieves a <code>ResponseEntity</code> (that is, status, headers, and body) by using GET.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>headForHeaders</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Retrieves all headers for a resource by using HEAD.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>postForLocation</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Creates a new resource by using POST and returns the <code>Location</code> header from the response.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>postForObject</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Creates a new resource by using POST and returns the representation from the response.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>postForEntity</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Creates a new resource by using POST and returns the representation from the response.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>put</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Creates or updates a resource by using PUT.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>patchForObject</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Updates a resource by using PATCH and returns the representation from the response.
Note that the JDK <code>HttpURLConnection</code> does not support the <code>PATCH</code>, but Apache
HttpComponents and others do.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>delete</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Deletes the resources at the specified URI by using DELETE.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>optionsForAllow</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Retrieves allowed HTTP methods for a resource by using ALLOW.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>exchange</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">More generalized (and less opinionated) version of the preceding methods that provides extra
flexibility when needed. It accepts a <code>RequestEntity</code> (including HTTP method, URL, headers,
and body as input) and returns a <code>ResponseEntity</code>.</p>
<p class="tableblock">These methods allow the use of <code>ParameterizedTypeReference</code> instead of <code>Class</code> to specify
a response type with generics.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>execute</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">The most generalized way to perform a request, with full control over request
preparation and response extraction through callback interfaces.</p></td>
</tr>
</tbody>
</table>

## Building RestTemplate Bean
默认构造函数使用 java.net.HttpURLConnection 来执行请求。您可以使用 ClientHttpRequestFactory 的实现切换到其他 HTTP 库。内置支持以下内容：
- Apache HttpComponents
- Netty
- OkHttp

例如，要切换到Apache HttpComponents，可以使用下面的写法：
```java
RestTemplate template = new RestTemplate(new HttpComponentsClientHttpRequestFactory());
```

再来看几个简单的例子：
### Using RestTemplateBuilder
```java
@Bean
public RestTemplate restTemplate(RestTemplateBuilder builder) {
    return builder
            .setConnectTimeout(Duration.ofMillis(3000))
            .setReadTimeout(Duration.ofMillis(3000))
            .build();
}
```

### Using SimpleClientHttpRequestFactory
```java
@Bean
public RestTemplate restTemplate() {
 
    var factory = new SimpleClientHttpRequestFactory();
    factory.setConnectTimeout(3000);
    factory.setReadTimeout(3000);
    return new RestTemplate(factory);
}
```

### Using Apache HTTPClient
```java
@Autowired
CloseableHttpClient httpClient;
 
@Bean
public RestTemplate restTemplate() {
 
    RestTemplate restTemplate = new RestTemplate(clientHttpRequestFactory());
    return restTemplate;
}
 
@Bean
public HttpComponentsClientHttpRequestFactory clientHttpRequestFactory() {
 
    HttpComponentsClientHttpRequestFactory clientHttpRequestFactory = new HttpComponentsClientHttpRequestFactory();
    clientHttpRequestFactory.setHttpClient(httpClient);
    return clientHttpRequestFactory;
}
```

最后依赖注入就可以了。
```java
@Autowired
private RestTemplate restTemplate;
```

## RestTemplate Example
### HTTP GET Example
**HTTP GET REST APIs**
```java
/**
 * @author vincent
 */
@RequestMapping(value = "/product")
@RestController
public class ProductController {

    @GetMapping("/getProductByNoParams")
    public Product getProductByNoParams() {
        return new Product(1, "ProductA", BigDecimal.valueOf(6666.0), new Date());
    }

    @GetMapping("/getProductById")
    public Product getProductById(Integer id) {
        return new Product(id, "ProductC", BigDecimal.valueOf(6666.0), new Date());
    }
}
```

**Consume REST API**
```java
@Configuration
public class BeanConfig {
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
                .setConnectTimeout(Duration.ofMillis(3000))
                .setReadTimeout(Duration.ofMillis(3000))
                .build();
    }
}
```
```java
/**
 * @author vincent
 */
@SpringBootTest(classes = CallingThirdPartyApiApplicationTests.class, webEnvironment = WebEnvironment.RANDOM_PORT)
class RestTemplateTest {

    private static final String URL = "http://localhost:8080/product";

    @Autowired
    private RestTemplate restTemplate;

    @Test
    void getProductByNoParams() {
        String url = URL + "/getProductByNoParams";

        //方式一：GET 方式获取 JSON 串数据
        String strProduct = restTemplate.getForObject(url, String.class);
        System.out.println("strProduct:" + strProduct);

        //方式二：GET 方式获取 JSON 数据映射后的 Product 实体对象
        Product product = restTemplate.getForObject(url, Product.class);
        System.out.println("product:" + product);

        //方式三：GET 方式获取包含 Product 实体对象 的响应实体 ResponseEntity 对象，用 getBody() 获取
        ResponseEntity<Product> productEntity = restTemplate.getForEntity(url, Product.class);
        System.out.println("productEntity:" + productEntity);
        Product productEntityBody = productEntity.getBody();
        System.out.println("productEntityBody:" + productEntityBody);

        //方式四：1.构建请求实体 HttpEntity 对象，用于配置 Header 信息和请求参数
        LinkedMultiValueMap<String, String> header = new LinkedMultiValueMap<>();
        header.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        HttpEntity requestEntity = new HttpEntity<>(header);
        //方式一：2.执行请求获取包含 Product 实体对象的响应实体 ResponseEntity 对象，用 getBody() 获取
        ResponseEntity<Product> exchange = restTemplate.exchange(url, HttpMethod.GET, requestEntity, Product.class);
        System.out.println("exchange:" + exchange);

        //方式五：根据 RequestCallback 接口实现类设置Header信息，用 ResponseExtractor 接口实现类读取响应数据
        String execute = restTemplate.execute(url, HttpMethod.GET,
                clientHttpRequest -> clientHttpRequest.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE),
                clientHttpResponse -> IOUtils.toString(clientHttpResponse.getBody(), StandardCharsets.UTF_8));
        System.out.println("execute:" + execute);
    }

    @Test
    void getProductById() {
        String url = URL + "/getProductById?id={id}";

        //方式一：将参数的值存在可变长度参数里，按照顺序进行参数匹配
        ResponseEntity<Product> productEntity = restTemplate.getForEntity(url, Product.class, 101);
        System.out.println("productEntity" + productEntity);
        Product productEntityBody = productEntity.getBody();
        System.out.println("productEntityBody:" + productEntityBody);

        //方式二：将请求参数以键值对形式存储到 Map 集合中，用于请求时 URL 上的拼接
        Map<String, Object> uriVariables = Maps.newHashMap();
        uriVariables.put("id", 109);
        Product product = restTemplate.getForObject(url, Product.class, uriVariables);
        System.out.println("product" + product);
    }
}
```

**Output getProductByNoParams() Method:**
```java
strProduct:{"id":1,"name":"ProductA","price":6666.0,"date":"2020-11-17T07:24:43.385+00:00"}
product:Product(id=1, name=ProductA, price=6666.0, date=Tue Nov 17 15:24:43 CST 2020)
productEntity:<200,Product(id=1, name=ProductA, price=6666.0, date=Tue Nov 17 15:24:43 CST 2020),[Content-Type:"application/json", Transfer-Encoding:"chunked", Date:"Tue, 17 Nov 2020 07:24:43 GMT", Keep-Alive:"timeout=60", Connection:"keep-alive"]>
productEntityBody:Product(id=1, name=ProductA, price=6666.0, date=Tue Nov 17 15:24:43 CST 2020)
exchange:<200,Product(id=1, name=ProductA, price=6666.0, date=Tue Nov 17 15:24:43 CST 2020),[Content-Type:"application/json", Transfer-Encoding:"chunked", Date:"Tue, 17 Nov 2020 07:24:43 GMT", Keep-Alive:"timeout=60", Connection:"keep-alive"]>
execute:{"id":1,"name":"ProductA","price":6666.0,"date":"2020-11-17T07:24:43.462+00:00"}
```

**Output getProductById() Method:**
```java
productEntity<200,Product(id=101, name=ProductC, price=6666.0, date=Tue Nov 17 15:27:34 CST 2020),[Content-Type:"application/json", Transfer-Encoding:"chunked", Date:"Tue, 17 Nov 2020 07:27:34 GMT", Keep-Alive:"timeout=60", Connection:"keep-alive"]>
productEntityBody:Product(id=101, name=ProductC, price=6666.0, date=Tue Nov 17 15:27:34 CST 2020)
productProduct(id=109, name=ProductC, price=6666.0, date=Tue Nov 17 15:27:34 CST 2020)
```


### HTTP POST Example
**HTTP POST REST APIs**
```java
    @PostMapping("/postProductByForm")
    public String postProductByForm(Product product) {
        return product.toString();
    }

    @PostMapping("/postProductByObject")
    public String postProductByObject(@RequestBody Product product) {
        return product.toString();
    }
```

**Consume REST API**
```java
    @Test
    void postProductByForm() {
        String url = URL + "/postProductByForm";
        Product product = new Product(201, "MacBook Pro", BigDecimal.valueOf(2148.99), new Date());
        
        MultiValueMap<String, String> header = new LinkedMultiValueMap<>();
        // 设置请求的 Content-Type 为：application/x-www-form-urlencoded
        header.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE);

        //方式一： 将请求参数以键值对形式存储在 MultiValueMap 集合，发送请求时使用
        MultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
        map.add("id", product.getId());
        map.add("name", product.getName());
        map.add("price", product.getPrice());
        map.add("date", product.getDate());

        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(map, header);
        ResponseEntity<String> exchange = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
        System.out.println("exchange:" + exchange);

        //方式二： 将请求参数值以 K=V 方式用 & 拼接，发送请求使用
        String productStr = "id=" + product.getId() + "&name=" + product.getName() + "&price=" + product.getPrice() + "&date=" + product.getDate();
        HttpEntity request2 = new HttpEntity<>(productStr, header);
        ResponseEntity<String> exchange2 = restTemplate.exchange(url, HttpMethod.POST, request2, String.class);
        System.out.println("exchange2: " + exchange2);
    }

    @Test
    void postProductByObject() {
        String url = URL + "/postProductByObject";

        // 设置请求的 Content-Type 为：application/json
        MultiValueMap<String, String> header = new LinkedMultiValueMap<>();
        header.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        // 设置 Accept 向服务器表明客户端可处理的内容类型
        header.add(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);
        // 直接将实体 Product 作为请求参数传入，底层利用 Jackson 框架序列化成 JSON 串发送请求
        HttpEntity<Product> request = new HttpEntity<>(new Product(2, "Macbook Pro", BigDecimal.valueOf(10000), new Date()), header);
        ResponseEntity<String> exchange = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
        System.out.println("exchange: " + exchange);
    }
```

**Output postProductByForm() Method:**
```
exchange:<200,Product(id=201, name=MacBook Pro, price=2148.99, date=Wed Nov 18 05:29:47 CST 2020),[Content-Type:"text/plain;charset=UTF-8", Content-Length:"83", Date:"Tue, 17 Nov 2020 07:29:47 GMT", Keep-Alive:"timeout=60", Connection:"keep-alive"]>
exchange2: <200,Product(id=201, name=MacBook Pro, price=2148.99, date=Wed Nov 18 05:29:47 CST 2020),[Content-Type:"text/plain;charset=UTF-8", Content-Length:"83", Date:"Tue, 17 Nov 2020 07:29:47 GMT", Keep-Alive:"timeout=60", Connection:"keep-alive"]>
```

**Output postProductByObject() Method:**
```
exchange: <200,Product(id=2, name=Macbook Pro, price=10000, date=Tue Nov 17 15:31:33 CST 2020),[Content-Type:"application/json", Content-Length:"79", Date:"Tue, 17 Nov 2020 07:31:33 GMT", Keep-Alive:"timeout=60", Connection:"keep-alive"]>
```


### HTTP PUT Example
**HTTP PUT REST APIs**
```java
    @PutMapping("/putByproduct")
    public String putByproduct(Product product) {
        System.out.println(product);
        return String.format("%s 的产品更新成功", product.toString());
    }

    @PutMapping(value = "/putProductById/{id}")
    public ResponseEntity<Product> putProductById(@PathVariable("id") int id, @RequestBody Product product) {
        System.out.println("id:" + id);
        System.out.println(product);
        //TODO: Save employee details
        return new ResponseEntity<>(product, HttpStatus.OK);
    }
```

**Consume REST API**
```java
    @Test
    void putByproduct() {
        String url = URL + "/putByproduct";

        // PUT 方法请求
        MultiValueMap<String, String> header = new LinkedMultiValueMap<>();
        header.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE);
        Product product = new Product(101, "iWatch", BigDecimal.valueOf(2333), new Date());
        String productStr = "id=" + product.getId() + "&name=" + product.getName() + "&price=" + product.getPrice() + "&date=" + product.getDate();
        HttpEntity<String> request = new HttpEntity<>(productStr, header);
        restTemplate.put(url, request);
    }

    @Test
    void putProductById() {
        String url = URL + "/putProductById/{id}";

        // PUT 方法请求
        Map<String, String> params = Maps.newHashMap();
        params.put("id", "108");
        Product product = new Product(108, "Nike", BigDecimal.valueOf(888.88), new Date());
        restTemplate.put(url, product, params);
    }
```

**Output on the server: putByproduct()**
```
Product(id=101, name=iWatch, price=2333, date=Wed Nov 18 05:33:28 CST 2020)
```

**Output on the server: putProductById()**
```
id:108
Product(id=108, name=Nike, price=888.88, date=Tue Nov 17 15:36:08 CST 2020)
```

### HTTP DELETE Example
**HTTP DELETE REST APIs**
```java
    @DeleteMapping("/delete/{id}")
    public String deleteByRestful(@PathVariable int id) {
        System.out.println(String.format("编号为 %s 的产品删除成功", id));
        return String.format("编号为 %s 的产品删除成功", id);
    }
```

**Consume REST API**
```java
    @Test
    void deleteByRestful() {
        String url = URL + "/delete/{id}";

        // DELETE RESTful 方法请求
        restTemplate.delete(url, 101);
    }
```

**Output on the server: deleteByRestful()**
```
编号为 101 的产品删除成功
```

### HTTP File Upload Example
**HTTP File Upload APIs**
```java
    @PostMapping("/upload")
    public String upload(@RequestParam("file") MultipartFile file) throws IOException {
        String name = file.getOriginalFilename();
        System.out.println(String.format("File name: %s", name));

        //todo save to a file via multipartFile.getInputStream()
        byte[] bytes = file.getBytes();
        System.out.println(String.format("File uploaded content:\n%s", new String(bytes)));
        return "file uploaded";
    }

    @PostMapping("/upload2")
    public String upload2(MultipartRequest request) {
        // Spring MVC 使用 MultipartRequest 接受带文件的 HTTP 请求
        MultipartFile file = request.getFile("file");
        String originalFilename = Optional.ofNullable(file).map(MultipartFile::getOriginalFilename).orElse(null);
        return String.format("upload success filename: %s", originalFilename);
    }
```

**Consume File Upload API**
```java
    @Test
    void upload() throws IOException {
        // Controller 有两种接收方法
        // 1. @RequestParam("file") MultipartFile file
        String url = URL + "/upload";

        // 2. MultipartRequest request
//        String url2 = URL + "/upload2";

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", getUserFileResource());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
        System.out.println("upload: " + responseEntity);
        System.out.println("response body: " + responseEntity.getBody());

    }

    private static Resource getUserFileResource() throws IOException {
        Path path = Paths.get("/Users/vincent/IDEA_Project/my_project/calling-third-party-api/src/test/java/com/vincent/callingthirdpartyapi/resttemplate");

        // todo replace tempFile with a real file
        Path tempFile = Files.createTempFile(path, "upload", ".txt");
        Files.write(tempFile, "some test content...\nline1\nline2".getBytes());
        System.out.println("uploading: " + tempFile);
        File file = tempFile.toFile();
        //to upload in-memory bytes use ByteArrayResource instead
        return new FileSystemResource(file);
    }
```

**Output upload() Method:**
```
uploading: /Users/vincent/IDEA_Project/my_project/calling-third-party-api/src/test/java/com/vincent/callingthirdpartyapi/resttemplate/upload3398915595164176126.txt
upload: <200,file uploaded,[Content-Type:"text/plain;charset=UTF-8", Content-Length:"13", Date:"Tue, 17 Nov 2020 07:40:55 GMT", Keep-Alive:"timeout=60", Connection:"keep-alive"]>
response body: file uploaded
```

**Output on the server: upload()**
```
File name: upload3398915595164176126.txt
File uploaded content:
some test content...
line1
line2
```

## Message Conversion

Spring-Web 模块包含 HttpMessageConverter 协定，用于通过 InputStream 和 OutputStream 读取和写入 HTTP 请求和响应的正文。 HttpMessageConverter 实例在客户端（例如：RestTemplate）和服务器端（例如：Spring MVC REST）中被使用。 Spring 框架中提供了主流媒体（MIME）类型的具体实现，默认情况下，这些实现在客户端 RestTemplate 和服务器端的 RequestMethodHandlerAdapter 中被注册（详情参考 [消息转换器配置](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-config-message-converters)）。

以下介绍 HttpMessageConverter 的具体实现。对于所有转换器，都使用默认的媒体类型，但是可以通过设置 supportedMediaTypes bean 属性来覆盖它。下表描述了每种实现：

<table id="rest-message-converters-tbl" class="tableblock frame-all grid-all stretch">
<caption class="title">Table 2. HttpMessageConverter Implementations</caption>
<colgroup>
<col style="width: 25%;">
<col style="width: 75%;">
</colgroup>
<thead>
<tr>
<th class="tableblock halign-left valign-top">MessageConverter</th>
<th class="tableblock halign-left valign-top">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>StringHttpMessageConverter</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">An <code>HttpMessageConverter</code> implementation that can read and write <code>String</code> instances from the HTTP
request and response. By default, this converter supports all text media types
(<code>text/*</code>) and writes with a <code>Content-Type</code> of <code>text/plain</code>.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>FormHttpMessageConverter</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">An <code>HttpMessageConverter</code> implementation that can read and write form data from the HTTP
request and response. By default, this converter reads and writes the
<code>application/x-www-form-urlencoded</code> media type. Form data is read from and written into a
<code>MultiValueMap&lt;String, String&gt;</code>. The converter can also write (but not read) multipart
data read from a <code>MultiValueMap&lt;String, Object&gt;</code>. By default, <code>multipart/form-data</code> is
supported. As of Spring Framework 5.2, additional multipart subtypes can be supported for
writing form data. Consult the javadoc for <code>FormHttpMessageConverter</code> for further details.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>ByteArrayHttpMessageConverter</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">An <code>HttpMessageConverter</code> implementation that can read and write byte arrays from the
HTTP request and response. By default, this converter supports all media types (<code>*/*</code>)
and writes with a <code>Content-Type</code> of <code>application/octet-stream</code>. You can override this
by setting the <code>supportedMediaTypes</code> property and overriding <code>getContentType(byte[])</code>.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>MarshallingHttpMessageConverter</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">An <code>HttpMessageConverter</code> implementation that can read and write XML by using Spring’s
<code>Marshaller</code> and <code>Unmarshaller</code> abstractions from the <code>org.springframework.oxm</code> package.
This converter requires a <code>Marshaller</code> and <code>Unmarshaller</code> before it can be used. You can inject these
through constructor or bean properties. By default, this converter supports
<code>text/xml</code> and <code>application/xml</code>.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>MappingJackson2HttpMessageConverter</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">An <code>HttpMessageConverter</code> implementation that can read and write JSON by using Jackson’s
<code>ObjectMapper</code>. You can customize JSON mapping as needed through the use of Jackson’s
provided annotations. When you need further control (for cases where custom JSON
serializers/deserializers need to be provided for specific types), you can inject a custom <code>ObjectMapper</code>
through the <code>ObjectMapper</code> property. By default, this
converter supports <code>application/json</code>.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>MappingJackson2XmlHttpMessageConverter</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">An <code>HttpMessageConverter</code> implementation that can read and write XML by using
<a href="https://github.com/FasterXML/jackson-dataformat-xml">Jackson XML</a> extension’s
<code>XmlMapper</code>. You can customize XML mapping as needed through the use of JAXB
or Jackson’s provided annotations. When you need further control (for cases where custom XML
serializers/deserializers need to be provided for specific types), you can inject a custom <code>XmlMapper</code>
through the <code>ObjectMapper</code> property. By default, this
converter supports <code>application/xml</code>.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>SourceHttpMessageConverter</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">An <code>HttpMessageConverter</code> implementation that can read and write
<code>javax.xml.transform.Source</code> from the HTTP request and response. Only <code>DOMSource</code>,
<code>SAXSource</code>, and <code>StreamSource</code> are supported. By default, this converter supports
<code>text/xml</code> and <code>application/xml</code>.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>BufferedImageHttpMessageConverter</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">An <code>HttpMessageConverter</code> implementation that can read and write
<code>java.awt.image.BufferedImage</code> from the HTTP request and response. This converter reads
and writes the media type supported by the Java I/O API.</p></td>
</tr>
</tbody>
</table>


## Multipart

要发送多部分数据，您需要提供一个 `MultiValueMap`，其值可能是某些部分内容的一个对象，一个文件资源或者是 headers 部分内容的 HttpEntity。例如：
```java
MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();

parts.add("fieldPart", "fieldValue");
parts.add("filePart", new FileSystemResource("...logo.png"));
parts.add("jsonPart", new Person("Jason"));

HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.APPLICATION_XML);
parts.add("xmlPart", new HttpEntity<>(myBean, headers));
```

在大多数情况下，您不必为每个部分指定 Content-Type。内容类型是根据 HttpMessageConverter 选择序列化的方式自动确定的，或者对于基于文件扩展名的 Resource 自动确定的。如有必要，可以为 MediaType 提供 HttpEntity 的包装器。准备好 MultiValueMap 之后，可以将其传递给 RestTemplate，如下所示：
```java
MultiValueMap<String, Object> parts = ...;
template.postForObject("https://example.com/upload", parts, Void.class);
```

如果 MultiValueMap 包含至少一个非 String 值，则 FormHttpMessageConverter 将 Content-Type 设置为 `multipart/form-data`。如果 MultiValueMap 具有字符串值，则 Content-Type 默认为 `application/x-www-form-urlencoded`。如有必要，还可以明确设置 Content-Type。


## Using AsyncRestTemplate (Deprecated)
AsyncRestTemplate 已不被推荐使用。如果你需要异步 Http 请求的话，Spring 官方推荐 `WebClient`。WebClient 是从 Spring WebFlux 5.0 版本开始提供的一个非阻塞的基于响应式编程的进行 Http 请求的客户端工具。它的响应式编程的基于 Reactor 的。WebClient 中提供了标准 Http 请求方式对应的 get、post、put、delete 等方法，可以用来发起相应的请求。（详情参考 [WebClient](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html#webflux-client)）这里简单写个例子：

```java
    @Test
    void webClientTest() throws InterruptedException {
        WebClient webClient = WebClient.create(URL);
        webClient.get()
                .uri("/getProductByNoParams")
                .retrieve()
                .bodyToMono(String.class)
                .subscribe(CheckedConsumer.of(s -> {
                            TimeUnit.SECONDS.sleep(3);
                            System.out.println(String.format("webClient 发出异步 http 请求，并且开始睡三秒。获取异步 http 请求后的返回值：%s", s));
                        }).unchecked()
                );
        System.out.println("主线程阻塞开始睡 8 秒：======================================================");
        TimeUnit.SECONDS.sleep(8);
    }
```

**Output:**
```
主线程阻塞开始睡 8 秒：======================================================
webClient 发出异步 http 请求，并且开始睡三秒。获取异步 http 请求后的返回值：{"id":1,"name":"ProductA","price":6666.0,"date":"2020-11-17T08:40:58.337+00:00"}
```

Reference：https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#rest-client-access
Reference：https://www.baeldung.com/rest-template
Reference：https://juejin.im/post/6844903842065154061#heading-8
Reference：https://howtodoinjava.com/spring-boot2/resttemplate/spring-restful-client-resttemplate-example/
Reference：https://www.javaguides.net/2019/06/spring-resttemplate-get-post-put-and-delete-example.html
Reference：https://www.logicbig.com/tutorials/spring-framework/spring-integration/rest-template-file-upload.html

Case Source Code：https://github.com/V-Vincen/calling-third-party-api


