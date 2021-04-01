---
title: '[Microservices] 5 The difference between http and rpc'
catalog: true
date: 2021-01-08 18:40:47
subtitle: The difference between http and rpc...
header-img: /img/header_img/archive_bg4.jpg
tags:
- Microservices
---

## 区别
### 传输协议
- RPC：可以基于 TCP 协议，也可以基于 HTTP 协议。
- HTTP：基于 HTTP 协议。

### 传输效率
- RPC：使⽤自定义的 TCP 协议，可以让请求报⽂体积更小，或者使⽤ HTTP2 协议，也可以很好的减少报⽂的体积，提⾼传输效率。    
- HTTP：如果是基于 HTTP1.1 的协议，请求中会包含很多⽆用的内容，如果是基于 HTTP2.0，那么简单的封装一下是可以作为⼀个 RPC 来使用的，这种标准的 RPC 框架更多的是服务治理。

### 性能消耗（主要在于序列化和反序列化时的耗时）
- RPC：可以基于 thrift 实现高效的二进制传输。
- HTTP：大部分是通过 json 来实现的，字节⼤小和序列化耗时都比 thrift 要更消耗性能。

### 负载均衡
- RPC：基本都自带了负载均衡策略。
- HTTP：需要配置 Nginx，HAProxy 来实现。

### 服务治理（下游服务新增、重启、下线时，如何不影响上游调用者）
- RPC：能做到⾃动通知，不影响上游。 
- HTTP：需要事先通知，修改 Nginx、HAProxy 配置。

## 总结
RPC 主要用于公司内部的服务调用，性能消耗低，传输效率高，服务治理方便。HTTP 主要用于对外的异构环境，浏览器接口调用，APP 接口调用，第三⽅接口调用等。