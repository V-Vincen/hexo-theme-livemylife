---
title: Github 加速优化
catalog: true
date: 2020-07-15 19:41:43
subtitle: What is the DNS and CDN...
header-img: /img/header_img/lml_bg.jpg
tags:
- Hexo
- Hexo-Theme-LiveMyLife
categories:
- Hexo-Theme-LiveMyLife
---

在本章开始前我们先来了解两个名词的概念：
- DNS：域名系统（英语：Domain Name System，缩写：DNS）是互联网的一项服务。它作为将域名和 IP 地址相互映射的一个分布式数据库，能够使人更方便地访问互联网。（出自维基百科）
- CDN：CDN 的全称是 Content Delivery Network，即内容分发网络。CDN 是构建在现有网络基础之上的智能虚拟网络，依靠部署在各地的边缘服务器，通过中心平台的负载均衡、内容分发、调度等功能模块，使用户就近获取所需内容，降低网络拥塞，提高用户访问响应速度和命中率。CDN 的关键技术主要有内容存储和分发技术。（出自百度百科）

## Github 访问提速
由于种种原因，国内访问 Github 的体验一直不是很好。本文通过绕过外部 DNS 解析，添加 Github 的 DNS 记录的方式，在本地直接绑定 host，来改善 Github 的访问速度。该方法也可加速其他因为 CDN 被屏蔽导致访问慢的网站。

### 查询 Github 的 DNS 解析
访问 [IPAddress.com](https://www.ipaddress.com/)，分别查询下面三个域名的 DNS 地址。
- github.com
- assets-cdn.github.com
- github.global.ssl.fastly.net

![1](1.png)

我的查询结果，查询结果可能有差异，以你实际的查询结果为准。
```
140.82.114.3 github.com
185.199.108.153 assets-cdn.github.com
199.232.69.194 github.global.ssl.fastly.net
```

或者打开 [Chinaz.com](http://tool.chinaz.com/dns)，这是一个查询域名映射关系的工具。通过这个工具多查几次上面的域名，选择一个稳定，延迟较低的 ip 。
```
140.82.114.3 github.com
185.199.108.153 assets-cdn.github.com
151.101.109.194 github.global.ssl.fastly.net
```

两种方式都可以，可自行选择。

### 添加到 host 文件
将上述查询出的结果，添加至 host 文件中。

### 添加 DNS 服务器
DNS 服务器添加 `8.8.8.8`（不加也可以）。当我们添加 DNS 服务器时，可能会看到 DNS 配置里已经有了 `114.114.114.114`。有人可能会问这两个 DNS 有什么区别？
- `114.114.114.114`：是国内移动、电信和联通通用的 DNS，手机和电脑端都可以使用，干净无广告，解析成功率相对来说更高，国内用户使用的比较多，而且速度相对快、稳定，是国内用户上网常用的 DNS。
- `8.8.8.8`：是 GOOGLE 公司提供的 DNS，该地址是全球通用的，相对来说，更适合国外以及访问国外网站的用户使用。

### 刷新 DNS
- Windows：`ipconfig /flushdns`
- Mac：`sudo dscacheutil -flushcache`



## 免费 CDN 提速 Github 静态资源访问
[JSDelivr](https://www.jsdelivr.com/?docs=gh) 是一个免费开源的 CDN 解决方案，用于帮助开发者和站长。包含 JavaScript 库、jQuery 插件、CSS 框架、字体等等 Web 上常用的静态资源。我们来到其官网，可以看到它的介绍 Open Source CDN free, fast, and reliable。（免费、快速、可靠，不过据说可能会投毒广告，表示目前还没见过广告）

上篇文章 [Four Ways to Deploy Hexo](https://v_vincen.gitee.io/2020/07/14/Four-Ways-to-Deploy-Hexo/) 中 提到过，用 `Github Pages` 部署 `Hexo`，用户体验一直不是很好。为了提高用户体验，不妨结合 `JSDelivr` 来搭建我的个人博客。下面我就来看看 `JSDeliver + Github` 如何是实现静态资源加速。

### 新建 Github 仓库
新建 Github 仓库。

![2](2.png)

接着在本地电脑克隆上图仓库。
```git
cd your file
git clone https://github.com/V-Vincen/jsDeliver.git
```

### 上传需要的资源
复制需要的静态资源到本地git仓库中，提交到 Github 仓库上。
```
cd 到 git 仓库目录下
git status
git add .
git commit -m 'first commit'
git push
```
**注**：JSDelivr 不支持加载超过 **20M** 的资源，所以一些视频最好压缩到 **20M** 以下。

### 发布仓库
其实不发布也可以，可根据实际情况自行决定。

![3](3.png)

发布版本号为1.0.0（自定义）。

![4](4.png)

### 通过 JSDelivr 引用资源
官网给的使用方法：
```
// load any GitHub release, commit, or branch
// note: we recommend using npm for projects that support it
https://cdn.jsdelivr.net/gh/user/repo@version/file

// load jQuery v3.2.1
https://cdn.jsdelivr.net/gh/jquery/jquery@3.2.1/dist/jquery.min.js

// use a version range instead of a specific version
https://cdn.jsdelivr.net/gh/jquery/jquery@3.2/dist/jquery.min.js
https://cdn.jsdelivr.net/gh/jquery/jquery@3/dist/jquery.min.js

// omit the version completely to get the latest one
// you should NOT use this in production
https://cdn.jsdelivr.net/gh/jquery/jquery/dist/jquery.min.js

// add ".min" to any JS/CSS file to get a minified version
// if one doesn't exist, we'll generate it for you
https://cdn.jsdelivr.net/gh/jquery/jquery@3.2.1/src/core.min.js

// add / at the end to get a directory listing
https://cdn.jsdelivr.net/gh/jquery/jquery/
```

结合我创建的 jsDeliver 项目：
```
https://cdn.jsdelivr.net/gh/V-Vincen/jsDeliver@1.0.0/header_img/newhome_bg.jpg

https://cdn.jsdelivr.net/gh/V-Vincen/jsDeliver/header_img/newhome_bg.jpg
```


## Github 克隆加速
我们经常会碰到需要克隆 Github 上的一些开源资源到本地。但是由于种种原因，`git clone https://github.com/<yourAccount>/<repo>.git` 时，其下载速率犹如龟速。让人恨不得把电脑砸了，博主在这里推荐一款 Chrome 插件。

![5](5.png)

当然访问 Chrome 网上应用店，需要个人自行翻墙。安装完成后再访问 Github 时，会多出几个按钮，如下图。这时候我们只要用 **加速** 按钮内的克隆地址进行克隆。你会发现下载速率就像开了飞机一样快。

![6](6.png)



