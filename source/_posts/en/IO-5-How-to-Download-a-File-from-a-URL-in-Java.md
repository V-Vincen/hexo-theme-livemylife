---
title: '[IO] 5 How to Download a File from a URL in Java'
catalog: true
date: 2021-01-31 17:52:55
subtitle: There are multiple ways to download a file using Java code...
header-img: /img/io/io_bg.png
tags:
- IO
---

Are you looking to create your very own dataset for a new and innovative application? Or maybe you're trying to collect data for analysis for a college project and have become weary of manually downloading each image or CSV. Worry not, in this article I'll explain the building blocks needed in order to automate downloading files for these kinds of tasks.

Before you can create an application to download and create datasets for you, you'll need to know the basics required for automating file downloads via Java code. Getting the basics right will help you use them to your own specific set of needs, whether it's for a backend server application or Android app.

There are multiple ways to download a file using Java code. Here are just a few ways of how you can accomplish the task:


## Java IO
The most easily available and a basic package available for downloading a file from internet using Java code is the [Java IO](https://docs.oracle.com/javase/tutorial/essential/io/) package. Here we will be using the `BufferedInputStream` and the `URL` classes to open and read a file on a given address to a file on our local system. The reason we use the `BufferedInputStream` class instead of the `InputStream` is its buffering ability that gives our code a performance boost.

Before we dive deeper into the coding aspect let's take an overview of the classes and the individual functions we will be using in the process.

The `java.net.URL` class in Java is a built-in library that offers multiple methods to access and manipulate data on the internet. In this case, we will be using the `openStream()` function of the `URL` class. The method signature for the `openStream()` function is:

```java
public final InputStream openStream() throws IOException
```

The `openStream()` function works on an object of the `URL` class. The `URL` class opens up a connection to the given URL and the `openStream()` method returns an input stream which is used to read data from the connection.

The second class we will be using is the `BufferedInputStreamReader` and the `FileOutputStream`. These classes are used for reading from a file and writing to it, respectively.

Here is the complete code:

```java
try (BufferedInputStream inputStream = new BufferedInputStream(new URL("http://example.com/my-file-path.txt").openStream());
  FileOutputStream fileOS = new FileOutputStream("/Users/username/Documents/file_name.txt")) {
    byte data[] = new byte[1024];
    int byteContent;
    while ((byteContent = inputStream.read(data, 0, 1024)) != -1) {
        fileOS.write(data, 0, byteContent);
    }
} catch (IOException e) {
    // handles IO exceptions
}
```
**Note**: You may need to add the 'User-Agent' header to the HTTP request since some servers don't allow downloads from unknown clients.

As you can see we open up a connection using the `URL` object and then read it via the `BufferedInputStreamReader` object. The contents are read as bytes and copied to a file in the local directory using the `FileOutputStream`.

To lower the number of lines of code we can use the `Files` class available from Java 7. The `Files` class contains methods that read all the bytes at once and then copies it into another file. Here is how you can use it:

```java
InputStream inputStream = new URL("http://example.com/my-file-path.txt").openStream();
Files.copy(inputStream, Paths.get("/Users/username/Documents/file_name.txt"), StandardCopyOption.REPLACE_EXISTING);
```


## Java NIO
Java NIO is an alternative package to handle networking and input-output operations in Java. The main advantage that the [Java NIO](https://en.wikipedia.org/wiki/Non-blocking_I/O_(Java)) package offers is that it's non-blocking, and has channeling and buffering capabilities. When we use the Java IO library we work with streams that read data byte by byte. However, the Java NIO package uses channels and buffers. The buffering and channeling capabilities allow the system to copy contents from a URL directly into the intended file without needing to save the bytes in application memory, which would be an intermediary step. The ability to work with channels boosts performance.

In order to download the contents of a URL, we will use the `ReadableByteChannel` and the `FileChannel` classes.

```
ReadableByteChannel readChannel = Channels.newChannel(new URL("http://example.com/my-file-path.txt").openStream());
```

The `ReadableByteChannel` class creates a stream to read content from the URL. The downloaded contents will be transferred to a file on the local system via the corresponding file channel.

```java
FileOutputStream fileOS = new FileOutputStream("/Users/username/Documents/file_name.txt");
FileChannel writeChannel = fileOS.getChannel();
```

After defining the file channel we will use the `transferFrom()` method to copy the contents read from the `readChannel` object to the file destination using the `writeChannel` object.

```java
writeChannel
  .transferFrom(readChannel, 0, Long.MAX_VALUE);
```
  
The `transferFrom()` and `transferTo()` methods are much more efficient than working with streams using a buffer. The transfer methods enable us to directly copy the contents of the file system cache to the file on the system. Thus direct channeling restricts the number of context switches required and enhances the overall code performance.

Now, in the following sections, we will be looking at ways to download files from a URL using third-party libraries instead of core Java functionality components.


## Apache Commons IO
The [Apache Commons IO](https://commons.apache.org/proper/commons-io/) library offers a list of utility classes to manage IO operations. Now you may be thinking why would we use this when Java has its own set of libraries to handle IO operations. However, Apache Commons IO overcomes the problem of code rewriting and helps avoid writing boilerplate code.

In order to start using the Apache Commons IO library, you will need to download the jar files from the [official website](https://commons.apache.org/proper/commons-io/download_io.cgi). When you are done downloading the jar files, you need to add them to use them. If you are using an Integrated Development Environment (IDE) such as [Eclipse](https://www.eclipse.org/downloads/packages/release/oxygen/3a/eclipse-ide-java-developers), you will need to add the files to the build path of your project. To add files to your project you would need to right click on it, select build path option by navigating through "configure build path-> build path", and then choose the add external archives option.

To download a file from a given URL using the Apache Commons IO we will require the `FileUtils` class of the package. There is only a single line of code required to download a file, which looks like:

```java
FileUtils.copyURLToFile(
  new URL("http://example.com/my-file-path.txt"), 
  new File("/Users/username/Documents/file_name.txt"), 
  CONNECTION_TIMEOUT, 
  READ_TIMEOUT);
```

The connection and read timeouts convey the permissible time for which either the connection may stay idle or reading from the URL may stop.

Another class of the Apache Commons IO package that can be used to download a file over the internet is the [IOUtils](https://commons.apache.org/proper/commons-io/javadocs/api-2.5/org/apache/commons/io/IOUtils.html#copy(java.io.InputStream,%20java.io.OutputStream)) class. We will use the `copy(inputStream, fileOS)` method to download a file into the local system.

```java
InputStream inputStream = new URL("http://example.com/my-file-path.txt").openStream();
FileOutputStream fileOS = new FileOutputStream("/Users/username/Documents/file_name.txt");
int i = IOUtils.copy(inpuStream, fileOS);
```

The function returns the number of bytes copied. If the value of the variable i is -1, then it indicates that the contents of the file are over 2GB. When the returned value is -1, you can use the function `copyLarge(inputStream, fileOS)` in place of the `copy(inputstream, fileOS)` function to handle this load. Both of these functions buffer the `inputstream` internally. The internal buffer means we do not have to use the `BufferedInputStream` class to enhance our code performance and helps us avoid writing boilerplate code.


## Using Apache HTTP Components
Another library managed by the Apache organization is the [HttpComponents](https://hc.apache.org/) package. This library uses the request-response mechanism to download the file from a given URL.

The first step to downloading a file is to create an HTTP client object that would issue the request to the server. For this, we will be using the `CloseableHttpClient` class. The `CloseableHttpClient` class is an abstract class that requires `HttpClientBuilder` class to create instances. The code snippet that creates a new HTTP client is as follows:

```java
CloseableHttpClient client = HttpClientBuilder.create().build();
```

We then need to create an `HttpGet` or `HttpPost` object to send the request to the server. The request is created by the following line of code:

```java
HttpGet request = new HttpGet("url from where the file is intended to be downloaded");
```

The `execute(request)` function is applied to the client object and returns with a response from the server. Once the request is sent to the server we need a response object to receive the data sent from the server. To catch the response from the server we use the `HttpResponse` class object.

```java
HttpResponse response = client.execute(request);
```

The data sent by the server in the form of a message is obtained through the `getEntity()` function.

```java
HttpEntity entity = response.getEntity();
```

You can also obtain the response code sent by the server through the `response` object and use it to your specific need.

```java
int responseCode = response.getStatusLine().getStatusCode();
```

The data to be downloaded is encapsulated within the `entity` object and can be extracted using the `getContent()` function. The `getContent()` function returns an `InputStream` object that can be further used with a `BufferedInputStreamReader` to enhance performance.

```java
InputStream inputStream = entity.getContent();
```

Now all you need to do is read from the stream byte by byte and write the contents into a file using the `FileOutputStream` class.

```java
String fileName = "D:\\Demo\file.txt";
FileOutputStream fos = new FileOutputStream(filename);
Int byte;
while((byte = inputStream.read()) != -1) {
    fos.write(byte);
}
```

The last thing required to be done is closing all the open resources in order to ensure that the system resources are not overutilized and that there are no memory leaks.

## Conclusion
So there you have it - these are the simplest ways to download a file using the basic Java code and other third party libraries. Now that we are done with the basics, you can be as creative as you want and utilize the knowledge to suit your needs. So see you next time with a new set of concepts to help you become a better coder. We wish you happy coding till then.

Reference：https://stackabuse.com/how-to-download-a-file-from-a-url-in-java
Reference：https://www.journaldev.com/924/java-download-file-url