---
title: '[Calling Third-party API - Apache HttpClient] HttpClient Tutorial'
catalog: true
date: 2020-11-18 14:11:48
subtitle: HttpClient is a HTTP/1.1 compliant HTTP agent implementation based on HttpCore. It also provides reusable components for client-side authentication, HTTP state management, and HTTP connection management...
header-img: /img/header_img/tag_bg2.jpg
tags:
- Calling Third-party API
- Apache HttpClient
---

## Apache HttpClient 简介
> HttpClient 是 Apache Jakarta Common 下的子项目，用来提供高效的、最新的、功能丰富的支持 HTTP 协议的客户端编程工具包，并且它支持 HTTP 协议最新的版本和建议。HttpClient 已经应用在很多的项目中，比如 Apache Jakarta 上很著名的另外两个开源项目 Cactus 和 HTMLUnit 都使用了 HttpClient。

HttpClient 相比传统 JDK 自带的 URLConnection，增加了易用性和灵活性，它不仅是客户端发送 HTTP 请求变得容易，而且也方便了开发人员测试接口（基于 HTTP 协议的），即提高了开发的效率，也方便提高代码的健壮性。因此熟练掌握 HttpClient 是很重要的必修内容，掌握 HttpClient 后，相信对于 HTTP 协议的了解会更加深入。

**Apache HttpClient 官网:** http://hc.apache.org/httpcomponents-client-4.5.x/index.html
**HttpClient Tutorial:** http://hc.apache.org/httpcomponents-client-4.5.x/tutorial/html/index.html


## Apache HttpClient 特性
- 基于标准、纯净的 Java 语言。实现了 HTTP 1.0 和 HTTP 1.1
- 以可扩展的面向对象的结构实现了 HTTP 全部的方法（GET, POST, PUT, DELETE, HEAD, OPTIONS, and TRACE）。
- 支持 HTTPS 协议。
- 通过 HTTP 代理建立透明的连接。
- 利用 CONNECT 方法通过 HTTP 代理建立隧道的 HTTPS 连接。
- Basic, Digest, NTLMv1, NTLMv2, NTLM2 Session, SNPNEGO/Kerberos 认证方案。
- 插件式的自定义认证方案。
- 便携可靠的套接字工厂使它更容易的使用第三方解决方案。
- 连接管理器支持多线程应用。支持设置最大连接数，同时支持设置每个主机的最大连接数，发现并关闭过期的连接。
- 自动处理 Set-Cookie 中的 Cookie。
- 插件式的自定义 Cookie 策略。
- Request 的输出流可以避免流中内容直接缓冲到 Socket 服务器。
- Response 的输入流可以有效的从 Socket 服务器直接读取相应内容。
- 在 HTTP 1.0 和 HTTP 1.1 中利用 KeepAlive 保持持久连接。
- 直接获取服务器发送的 response code 和 headers。
- 设置连接超时的能力。
- 实验性的支持 HTTP 1.1 response caching。
- 源代码基于 Apache License 可免费获取。

## Apache HttpClient 主要依赖
当我们使用 HttpClient 调用第三方接口的时候，主要用的就是下面三个依赖：
- `org.apache.httpcomponents:httpclient`：核心包。
- `org.apache.httpcomponents:fluent-hc`：是 Apache HttpClient 官方下的一个子项目，提供链式调用风格的 API，支持常用的 HTTP Method，支持 proxy，支持添加 Header，支持异步 API，如果想做其他个性化配置，也预留了 API，让用户使用自己配置的 HttpClient。详情可参考 [Fluent API](http://hc.apache.org/httpcomponents-client-4.5.x/tutorial/html/fluent.html)。
- `org.apache.httpcomponents:httpmime`：HttpClient 通过 POST 来上传文件，而不是通过流的形式，并在服务端进行解析，其就是通过 httpmime 来操作的。

## Apache HttpClient 使用流程
使用 HttpClient 发送请求、接收响应很简单，一般需要如下几步即可。

- 创建 `HttpClient` 对象。
- 创建请求方法的实例，并指定请求 URL。如果需要发送 GET 请求，创建 `HttpGet` 对象；如果需要发送 POST 请求，创建 `HttpPost` 对象。
- 如果需要发送请求参数，可调用 `HttpGet`、`HttpPost` 共同的 `setParams(HttpParams params)` 方法来添加请求参数；对于 `HttpPost` 对象而言，也可调用 `setEntity(HttpEntity entity)` 方法来设置请求参数。
- 调用 `HttpClient` 对象的 `execute(HttpUriRequest request)` 发送请求，该方法返回一个 `HttpResponse`。
- 调用 `HttpResponse` 的 `getAllHeaders()`、`getHeaders(String name)` 等方法可获取服务器的响应头；调用 `HttpResponse` 的 `getEntity()` 方法可获取 `HttpEntity` 对象，该对象包装了服务器的响应内容。程序可通过该对象获取服务器的响应内容。
- 释放连接。无论执行方法是否成功，都必须释放连接

## Apache HttpClient 使用实例
### POM
pom.xml 配置如下：
```
<!-- Apache Http Begin -->
<!-- httpclient -->
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>4.5.13</version>
</dependency>
<!-- fluent-hc -->
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>fluent-hc</artifactId>
    <version>4.5.13</version>
</dependency>
<!-- httpmime -->
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpmime</artifactId>
    <version>4.5.13</version>
</dependency>
<!-- Apache Http End -->
```

### 官网案例
官网案例：http://hc.apache.org/httpcomponents-client-4.5.x/quickstart.html
```java
    @Test
    void officialCasesTest() throws IOException {
        CloseableHttpClient httpclient = HttpClients.createDefault();

        // HTTP GET Example
        HttpGet httpGet = new HttpGet("http://targethost/homepage");
        // The underlying HTTP connection is still held by the response object
        // to allow the response content to be streamed directly from the network socket.
        // In order to ensure correct deallocation of system resources
        // the user MUST call CloseableHttpResponse#close() from a finally clause.
        // Please note that if response content is not fully consumed the underlying
        // connection cannot be safely re-used and will be shut down and discarded
        // by the connection manager.
        try (CloseableHttpResponse response1 = httpclient.execute(httpGet)) {
            System.out.println(response1.getStatusLine());
            HttpEntity entity1 = response1.getEntity();
            // do something useful with the response body
            // and ensure it is fully consumed
            EntityUtils.consume(entity1);
        }

        // HTTP POST Example
        HttpPost httpPost = new HttpPost("http://targethost/login");
        List<NameValuePair> nvps = Lists.newArrayList();
        nvps.add(new BasicNameValuePair("username", "vip"));
        nvps.add(new BasicNameValuePair("password", "secret"));
        httpPost.setEntity(new UrlEncodedFormEntity(nvps));

        try (CloseableHttpResponse response2 = httpclient.execute(httpPost)) {
            System.out.println(response2.getStatusLine());
            HttpEntity entity2 = response2.getEntity();
            // do something useful with the response body
            // and ensure it is fully consumed
            EntityUtils.consume(entity2);
        }
    }
    
    @Test
    void fluentApiTest() throws IOException {
        // The fluent API relieves the user from having to deal with manual deallocation of system
        // resources at the cost of having to buffer response content in memory in some cases.
        Request.Get("http://targethost/homepage")
                .execute()
                .returnContent();

        Request.Post("http://targethost/login")
                .bodyForm(Form.form().add("username", "vip").add("password", "secret").build())
                .execute()
                .returnContent();
    }
```

### 流式编程案例
案例代码如下：
```java
    @Test
    void httpclientGetTest() throws IOException {
        /*
         * https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY，访问后的 json 数据格式如下：
         * {
         *   "date": "2020-11-17",
         *   "explanation": "What's creating these long glowing streaks in the sky? No one is sure.  Known as Strong Thermal Emission Velocity Enhancements (STEVEs), these luminous light-purple sky ribbons may resemble regular auroras, but recent research reveals significant differences. A STEVE's great length and unusual colors, when measured precisely, indicate that it may be related to a subauroral ion drift (SAID), a supersonic river of hot atmospheric ions thought previously to be invisible.  Some STEVEs are now also thought to be accompanied by green picket fence structures, a series of sky slats that can appear outside of the main auroral oval that does not involve much glowing nitrogen. The featured wide-angle composite image shows a STEVE in a dark sky above Childs Lake, Manitoba, Canada in 2017, crossing in front of the central band of our Milky Way Galaxy.",
         *   "hdurl": "https://apod.nasa.gov/apod/image/2011/SteveMilkyWay_NasaTrinder_6144.jpg",
         *   "media_type": "image",
         *   "service_version": "v1",
         *   "title": "A Glowing STEVE and the Milky Way",
         *   "url": "https://apod.nasa.gov/apod/image/2011/SteveMilkyWay_NasaTrinder_960.jpg"
         * }
         */
        ObjectMapper mapper = new ObjectMapper();
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpGet request = new HttpGet("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY");
            APOD response = client.execute(request, httpResponse -> mapper.readValue(httpResponse.getEntity().getContent(), APOD.class));
            System.out.println(response.title);// A Glowing STEVE and the Milky Way
        }
    }
```

### 创建 HttpGet 请求
案例代码如下：
```java
    /**
     * 无参 get 请求
     * @throws IOException
     */
    @Test
    void doGet() throws IOException {
        String uri = "http://www.baidu.com";

        //普通写法
        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpGet httpGet = new HttpGet(uri);
        try (CloseableHttpResponse response = httpClient.execute(httpGet)) {
            System.out.println("StatusLine：" + response.getStatusLine());
            System.out.println("StatusCode：" + response.getStatusLine().getStatusCode());

            HttpEntity entity = response.getEntity();
            System.out.println("entity：" + EntityUtils.toString(entity, StandardCharsets.UTF_8));
        }

        //链式调用
        String content = Request.Get(uri)
                .execute()
                .returnContent()
                .asString(StandardCharsets.UTF_8);
        System.out.println("Content：" + content);
    }

    /**
     * 带参 get 请求
     * @throws IOException
     */
    @Test
    void doGetWithParameter() throws Exception {
        URI uri = new URIBuilder("http://www.baidu.com/s")
                .addParameter("wd", "java")
                .build();

        //普通写法
        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpGet httpGet = new HttpGet(uri);
        try (CloseableHttpResponse response = httpClient.execute(httpGet)) {
            if (Objects.equals(response.getStatusLine().getStatusCode(), 200)) {
                HttpEntity entity = response.getEntity();
                System.out.println(EntityUtils.toString(entity, StandardCharsets.UTF_8));
            }
        }

        //链式调用
        String content = Request.Get(uri)
                .execute()
                .returnContent()
                .asString(StandardCharsets.UTF_8);
        System.out.println("Content：" + content);
    }
```

### 创建 HttpPost 请求
案例代码如下：
```java
    /**
     * 普通 post 请求
     * @throws IOException
     */
    @Test
    void doPost() throws IOException {
        /*
         * http://api.k780.com/?app=weather.today&weaid=1&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json 访问后的 json 数据格式如下：
         * {
         *   "success" : "1",
         *   "result" : {
         *     "weaid" : "1",
         *     "days" : "2020-11-18",
         *     "week" : "星期三",
         *     "cityno" : "beijing",
         *     "citynm" : "北京",
         *     "cityid" : "101010100",
         *     "temperature" : "10℃/4℃",
         *     "temperature_curr" : "10℃",
         *     "humidity" : "96%",
         *     "aqi" : "92",
         *     "weather" : "中雨转小雨",
         *     "weather_curr" : "雨",
         *     "weather_icon" : "http://api.k780.com/upload/weather/d/7.gif",
         *     "weather_icon1" : "",
         *     "wind" : "北风",
         *     "winp" : "2级",
         *     "temp_high" : "10",
         *     "temp_low" : "4",
         *     "temp_curr" : "10",
         *     "humi_high" : "0",
         *     "humi_low" : "0",
         *     "weatid" : "41",
         *     "weatid1" : "",
         *     "windid" : "8",
         *     "winpid" : "2",
         *     "weather_iconid" : "7"
         *   }
         * }
         */
        String uri = "http://api.k780.com/?app=weather.today&weaid=1&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json";
        ObjectMapper mapper = new ObjectMapper();

        //普通写法
        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(uri);
        try (final CloseableHttpResponse response = httpClient.execute(httpPost)) {
            if (Objects.equals(response.getStatusLine().getStatusCode(), 200)) {
                String responseEntity = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
                JsonNode jsonNode = mapper.readTree(responseEntity);
                System.out.println(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(jsonNode));
            }
        }

        //链式调用
        String context = Request.Post(uri)
                .execute()
                .returnContent()
                .asString(StandardCharsets.UTF_8);
        JsonNode jsonNode = mapper.readTree(context);
        System.out.println(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(jsonNode));
    }

    /**
     * 带参 post 请求
     * @throws IOException
     */
    @Test
    void doPostWithParameter() throws Exception {
        String uri = "http://api.k780.com";
        ObjectMapper mapper = new ObjectMapper();

        //普通写法
        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(uri);
        //伪装浏览器请求
        httpPost.setHeader("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36");

        //设置请求参数
        List<NameValuePair> list = Lists.newArrayList();
        list.add(new BasicNameValuePair("app", "weather.today"));
        list.add(new BasicNameValuePair("weaid", "1"));
        list.add(new BasicNameValuePair("appkey", "10003"));
        list.add(new BasicNameValuePair("sign", "b59bc3ef6191eb9f747dd4e83c99f2a4"));
        list.add(new BasicNameValuePair("format", "json"));
        httpPost.setEntity(new UrlEncodedFormEntity(list));

        try (final CloseableHttpResponse response = httpClient.execute(httpPost)) {
            if (Objects.equals(response.getStatusLine().getStatusCode(), 200)) {
                String responseEntity = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
                JsonNode jsonNode = mapper.readTree(responseEntity);
                System.out.println(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(jsonNode));
            }
        }

        //链式调用
        String context = Request.Post(uri)
                .setHeader("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36")
                .bodyForm(Form.form()
                        .add("app", "weather.today")
                        .add("weaid", "1")
                        .add("appkey", "10003")
                        .add("sign", "b59bc3ef6191eb9f747dd4e83c99f2a4")
                        .add("format", "json")
                        .build())
                .execute()
                .returnContent()
                .asString(StandardCharsets.UTF_8);
        JsonNode jsonNode = mapper.readTree(context);
        System.out.println(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(jsonNode));
    }
```
控制台输出结果：
```
{
  "success" : "1",
  "result" : {
    "weaid" : "1",
    "days" : "2020-11-18",
    "week" : "星期三",
    "cityno" : "beijing",
    "citynm" : "北京",
    "cityid" : "101010100",
    "temperature" : "10℃/4℃",
    "temperature_curr" : "11℃",
    "humidity" : "96%",
    "aqi" : "74",
    "weather" : "中雨转小雨",
    "weather_curr" : "雨",
    "weather_icon" : "http://api.k780.com/upload/weather/d/7.gif",
    "weather_icon1" : "",
    "wind" : "北风",
    "winp" : "2级",
    "temp_high" : "10",
    "temp_low" : "4",
    "temp_curr" : "11",
    "humi_high" : "0",
    "humi_low" : "0",
    "weatid" : "41",
    "weatid1" : "",
    "windid" : "8",
    "winpid" : "2",
    "weather_iconid" : "7"
  }
}
```

参考：https://www.twilio.com/blog/5-ways-to-make-http-requests-in-java

案例源码：https://github.com/V-Vincen/calling-third-party-api
