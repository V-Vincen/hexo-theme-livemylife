---
title: '[Calling Third-party API - Java API] 2 Core Java APIs for making Java http requests'
catalog: true
date: 2020-11-07 17:32:49
subtitle: A URLConnection with support for HTTP-specific features. An HttpClient can be used to send requests and retrieve their responses...
header-img: /img/header_img/tag_bg2.jpg
tags:
- Calling Third-party API
---

Since Java 1.1 there has been an HTTP client in the core libraries provided with the JDK. With Java 11 a new client was added. One of these might be a good choice if you are sensitive about adding extra dependencies to your project.

## Java 1.1 HttpURLConnection
First of all, do we capitalize acronyms in class names or not? Make your mind up. Anyway, close your eyes and center yourself in 1997. Titanic was rocking the box office and inspiring a thousand memes, Spice Girls had a best-selling album, but the biggest news of the year was surely [HttpURLConnection](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/net/HttpURLConnection.html) being added to Java 1.1.  Here’s how you would use it to make a GET request to `get` the APOD data:

APOD class:
```java
public class APOD {
    public final String copyright;
    public final String date;
    public final String explanation;
    public final String hdUrl;
    public final String mediaType;
    public final String serviceVersion;
    public final String title;
    public final String url;

    public APOD(@JsonProperty("copyright") String copyright,
                @JsonProperty("date") String date,
                @JsonProperty("explanation") String explanation,
                @JsonProperty("hdurl") String hdUrl,
                @JsonProperty("media_type") String mediaType,
                @JsonProperty("service_version") String serviceVersion,
                @JsonProperty("title") String title,
                @JsonProperty("url") String url) {
        this.copyright = copyright;
        this.date = date;
        this.explanation = explanation;
        this.hdUrl = hdUrl;
        this.mediaType = mediaType;
        this.serviceVersion = serviceVersion;
        this.title = title;
        this.url = url;
    }
}
```

JSON data：
```
{
  "copyright": "Howard Trottier",
  "date": "2020-11-07",
  "explanation": "These are galaxies of the Hercules Cluster, an archipelago of island universes a mere 500 million light-years away. Also known as Abell 2151, this cluster is loaded with gas and dust rich, star-forming spiral galaxies but has relatively few elliptical galaxies, which lack gas and dust and the associated newborn stars. The colors in this deep composite image clearly show the star forming galaxies with a blue tint and galaxies with older stellar populations with a yellowish cast. The sharp picture spans about 1/2 degree across the cluster center, corresponding to over 4 million light-years at the cluster's estimated distance. Diffraction spikes around brighter foreground stars in our own Milky Way galaxy are produced by the imaging telescope's mirror support vanes. In the cosmic vista many galaxies seem to be colliding or merging while others seem distorted - clear evidence that cluster galaxies commonly interact. In fact, the Hercules Cluster itself may be seen as the result of ongoing mergers of smaller galaxy clusters and is thought to be similar to young galaxy clusters in the much more distant, early Universe.",
  "hdurl": "https://apod.nasa.gov/apod/image/2011/Abell2151_Howard_Trottier_2020_FFTelescope1024.jpg",
  "media_type": "image",
  "service_version": "v1",
  "title": "The Hercules Cluster of Galaxies",
  "url": "https://apod.nasa.gov/apod/image/2011/Abell2151_Howard_Trottier_2020_FFTelescope1024.jpg"
}
```

```java
public class JavaHttpURLConnectionDemo {
    public static void main(String[] args) throws IOException {

        // Create a neat value object to hold the URL
        URL url = new URL("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY");

        // Open a connection(?) on the URL(?) and cast the response(??)
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        // Now it's "open", we can set the request method, headers etc.
        connection.setRequestProperty("accept", "application/json");

        // This line makes the request
        InputStream responseStream = connection.getInputStream();

        // Manually converting the response body InputStream to APOD using Jackson
        ObjectMapper mapper = new ObjectMapper();
        APOD apod = mapper.readValue(responseStream, APOD.class);

        // Finally we have the response
        System.out.println(apod.title);
    }
}
```

This seems quite verbose, and I find the order that we have to do things is confusing (why do we set headers after opening the URL?). If you need to make more complex requests with `POST` bodies, or custom timeouts etc then it’s all possible but I never found this API intuitive at all.

When would you use `HTTPUrlConnection`, then? If you are supporting clients who are using older versions of Java, and you can’t add a dependency then this might be for you. I suspect that’s only a small minority of developers, but you might see it in older codebases - for more modern approaches, read on.

## Java 11 HttpClient
More than twenty years after `HttpURLConnection` we had Black Panther in the cinemas and a new HTTP client added to Java 11: [java.net.http.HttpClient](https://docs.oracle.com/en/java/javase/11/docs/api/java.net.http/java/net/http/HttpClient.html). This has a much more logical API and can handle HTTP/2, and Websockets. It also has the option to make requests synchronously or asynchronously by using the `CompletableFuture` API.

99 times out of 100 when I make an HTTP request I want to read the response body into my code. Libraries that make this difficult will not spark joy in me. HttpClient accepts a `BodyHandler` which can convert an HTTP response into a class of your choosing. There are some built-in handlers: `String`, `byte[]` for binary data, `Stream<String>` which splits by lines, and a few others. You can also define your own, which might be helpful as there isn’t a built-in `BodyHandler` for parsing JSON. I’ve written one ([here](https://github.com/mjg123/java-http-clients/blob/master/src/main/java/com/twilio/JsonBodyHandler.java)) based on [Jackson](https://www.twilio.com/blog/java-json-with-jackson) following [an example from Java Docs](https://docs.oracle.com/en/java/javase/13/docs/api/java.net.http/java/net/http/HttpResponse.BodySubscribers.html#mapping(java.net.http.HttpResponse.BodySubscriber,java.util.function.Function)). It returns a `Supplier` for [the APOD class](https://github.com/mjg123/java-http-clients/blob/master/src/main/java/com/twilio/APOD.java), so we call `.get()` when we need the result.

This is a synchronous request:
```java
// create a client
var client = HttpClient.newHttpClient();

// create a request
var request = HttpRequest.newBuilder(
       URI.create("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"))
   .header("accept", "application/json")
   .build();

// use the client to send the request
var response = client.send(request, new JsonBodyHandler<>(APOD.class));

// the response:
System.out.println(response.body().get().title);
```

For an asynchronous request the `client` and `request` are made in the same way, then call `.sendAsync` instead of `.send`:
```java
// use the client to send the request
var responseFuture = client.sendAsync(request, new JsonBodyHandler<>(APOD.class));

// We can do other things here while the request is in-flight

// This blocks until the request is complete
var response = responseFuture.get();

// the response:
System.out.println(response.body().get().title);
```

full code on GitHub：https://github.com/mjg123/java-http-clients

Reference Resources：https://www.twilio.com/blog/5-ways-to-make-http-requests-in-java


## Another Demo

```java
/**
 * @author vincent
 */
public class JavaHttpURLConnectionTest {
    /**
     * 以post或get方式调用对方接口方法，
     *
     * @param pathUrl
     */
    private void doPostOrGet(String pathUrl, String data) throws IOException {
        OutputStreamWriter out;

        URL url = new URL(pathUrl);
        //打开和 url 之间的连接
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        //请求方式
        conn.setRequestMethod("POST");
        //conn.setRequestMethod("GET");

        //设置通用的请求属性
        conn.setRequestProperty("accept", "*/*");
        conn.setRequestProperty("connection", "Keep-Alive");
        conn.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)");
        conn.setRequestProperty("Content-Type", "application/json;charset=utf-8");

        //DoOutput 设置是否向 httpUrlConnection 输出，DoInput 设置是否从 httpUrlConnection 读入，此外发送 post 请求必须设置这两个
        conn.setDoOutput(true);
        conn.setDoInput(true);

        /*
         * 下面的三句代码，就是调用第三方 http 接口
         */
        //获取 URLConnection 对象对应的输出流
        out = new OutputStreamWriter(conn.getOutputStream(), StandardCharsets.UTF_8);
        //发送请求参数即数据
        out.write(data);
        //flush 输出流的缓冲
        out.flush();

        /*
         * 下面的代码相当于，获取调用第三方 http 接口后返回的结果
         */
        //获取 URLConnection 对象对应的输入流
        InputStream is = conn.getInputStream();

        BufferedInputStream buffer = IOUtils.buffer(is);
        System.out.println(IOUtils.toString(buffer, StandardCharsets.UTF_8));
    }

    @Test
    public void t2() throws IOException {
        /*
         *手机信息查询接口：http://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=手机号
         *　　　　　　     http://api.showji.com/Locating/www.showji.com.aspx?m=手机号&output=json&callback=querycallback
         */
        doPostOrGet("https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=13026194071", "");
    }
}
```

Reference Resources：https://www.cnblogs.com/swordfall/p/10757499.html#auto_id_5

Case Source Code：https://github.com/V-Vincen/calling-third-party-api