---
title: '[Calling Third-party API - WebService] 3 SOAP 消息和 WSDL 文件解析'
catalog: true
date: 2020-03-17 02:05:29
subtitle: SOAP 消息和 WSDL 文件解析
header-img: /img/webservice/webservice_bg.jpg
tags:
- Calling Third-party API
- WebService
---

## SOAP 消息的调试抓取
### 使用 Postman 测试 WebService 接口

![3](3.png)

![4](4.png)

**request**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
xmlns:ser="http://service.cxf.wsservice.example.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:sayHello>
         <!--Optional:-->
         <arg0>vincent</arg0>
      </ser:sayHello>
   </soapenv:Body>
</soapenv:Envelope>
```

**response**
```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <ns2:sayHelloResponse xmlns:ns2="http://service.cxf.wsservice.example.com/">
            <return>sayHellovincent</return>
        </ns2:sayHelloResponse>
    </soap:Body>
</soap:Envelope>
```

### SoapUI 工具测试 WebService 接口
SoapUI Pro 是需要付费的，对于日常的测试，开源版的功能已经够用了。这里把两个版本的下载地址都分享一下：
- SoapUI Pro破解版下载地址：https://pan.baidu.com/s/1LyZQYoIxLqbGRAnB8PBJuQ （密码：epyh）

- SoapUI Open Source下载地址：https://www.soapui.org/downloads/soapui.html

开源版进入页面后点击 Download SoapUI Open Source 即可进行下载。

![5](5.png)

操作如图下：

![6](6.jpg)

![7](7.png)


## WSDL 文件解析
### wsdl 报文总体概述

![8](8.png)

```xml
<definitions>
	<types>
	  	定义 web service 使用的数据类型。
	</types>
	
	<message>
		每个消息均由一个或多个部件组成。可以把它当做 java 中一个函数调用的参数。
	</message>

	<portType>
		它类似 Java 中的一个函数库（或一个模块、或一个类）。
	</portType>

	<binding>
		为每个端口定义消息格式和协议细节。
    </binding>
</definitions>
```

### `wsdl:definitions`
```xml
<wsdl:definitions xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"
xmlns:tns="http://service.cxf.wsservice.example.com/"
xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
xmlns:ns1="http://schemas.xmlsoap.org/soap/http"
name="WebServiceIService"
targetNamespace="http://service.cxf.wsservice.example.com/">
</wsdl:definitions>
```

| 标签              | 描述                                                    |
|-----------------|-------------------------------------------------------|
| name            | 我们 java 程序中服务接口的实现类，SEI 定义是：服务接口类 + Service 后缀，Service 自动追加 |
| targetNamespace | 命名空间：   相当于 Java 里面的 package 它刚好是和我们 Java 定义中的包名相反          |
| 其它              | 不变化，不关心                                               |
| xmlns:tns       | 相当于 Java 里面的 import，   包名反转                              |

### `wsdl:types`
我们 java 定义的服务接口中某方法的输入参数和返回值。

![9](9.png)

### `wsdl:message`
通信消息的数据结构的抽象类型化定义。使用 Types 所定义的类型来定义整个消息的数据结构。

![10](10.png)

WebService 中每个方法包含两部分：
- 一个是方法的输入参数；另一个是方法的输出参数。
- 其实质都是基于 SOAP 协议将其封装为消息，所以每一个方法对应有两个消息，一个输入一个输出回应。简单而言，就是方法和 message 的关系是 N:2N 的关系，一对二。
- message 中的具体内容是 part，结合前面可知，message 中的 part 内容请到前面定义过的 types 中去看，它会引用之前的 type 相关内容。

### `wsdl:portType`

![11](11.png)

- portType：接口
- operation：接口中定义的方法


### `wsdl:binding`
特定端口类型的具体协议和数据格式规范的绑定：

![12](12.png)


### `wsdl:service`
负责将网络通信地址赋给一个具体的绑定：

![13](13.png)

参考：https://blog.csdn.net/hgx_suiyuesusu/article/details/88918192