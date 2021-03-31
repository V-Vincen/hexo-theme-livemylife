---
title: '[Hexo] 4 Hexo 图片插入'
catalog: true
header-img: /img/header_img/hexo_bg4.png
date: 2019-06-08 20:30:18
subtitle: Hexo 图片插入
tags: 
- Hexo
categories: 
- Hexo
---

在网上查了一下有以下几种方式往hexo文章中插入图片

### 本地引用
---
**绝对路径**
当Hexo项目中只用到少量图片时，可以将图片统一放在`source/images`文件夹中，通过markdown语法访问它们。对于`source/images/image.jpg`这张图片可以用以下语法访问到

```
![](/images/image.jpg)
```
图片既可以在首页内容中访问到，也可以在文章正文中访问到。

**相对路径**
图片除了可以放在统一的images文件夹中，还可以放在文章自己的目录中。文章的目录可以通过配置博客根目录下的`_config.yml`来生成。

```
post_asset_folder: true
relative_link: true
```
将`_config.yml`文件中的配置项`post_asset_folder`设为`true`后，执行命`令$ hexo new post_name`，在`source/_posts`中会生成文章`post_name.md`和同名文件夹`post_name`。

将`_config.yml`文件中的配置项`relative_link`设为`true`后，将图片资源放在`post_name`中，文章就可以使用相对路径引用图片资源了。`_posts/post_name/image.jpg`这张照片可以用以下方式访问：

```
![](image.jpg)
```
上述markdown的引用方式，图片只能在文章中显示，但无法在首页中正常显示。
如果希望图片在文章和首页中同时显示，可以使用标签插件语法。`_posts/post_name/image.jpg`这张照片可以用以下方式访问：

```
{% asset_img image.jpg This is an image %}
```



### CDN引用

---
除了在本地存储图片，还可以将图片上传到一些免费的CDN服务中。因国内访问github速度较慢，所以将突破放到国内图床上，然后引用外链是常用的方法。
常用图床总结：[https://sspai.com/post/40499](https://sspai.com/post/40499)

> 图床，也就是专门提供存储图片的地方，我们只要通过图床提供的 API 接口，把图片上传上去，就可以通过外链访问了，根本不用操心图片是怎么存的，硬盘空间不够了，硬盘坏了，访问速度比较慢等等问题，这些图床都会帮我们搞定，他们会用各种技术帮我们做图片相 > 关的优化和服务，比如多机互备、CDN 加速、图片处理、图片鉴黄、文本识别等等。

> 当然，图床也是有缺点的，当所有人都把图片存在同一个图床上，万一有一天图床真挂了，那所有图片就都无法访问了，虽然这种情况的概率很低，但并不等于不会发生。

> 目前图床可以分为两种，一种是公共图床，一种是自建图床。公共图床也就是利用公共服务的图片上传接口，来提供图片外链的服务，比如新浪微博。自建图床，也就是利用各大云服务商提供的存储空 > 间或者自己在 VPS 上使用开源软件来搭建图床，存储图片，生成外链提供访问，比如七牛、Lychee 开源自建图床方案。

- 微博图床（Chrome浏览器有个“新浪微博图床”插件，可以自动生成markdown链接）简单方便
- 七牛：需要注册且实名认证等太麻烦，放弃
- 腾讯云等云存储服务，需要先将照片放到云盘，然后找到超链接，然后粘贴到文章。太麻烦，放弃。
- 【强烈推荐！！！】ipic 工具，具体用法请谷歌，支持监控剪贴板，一键上传到微博图床，免费版默认是微博图床，支持七牛云等，下载地址: [https://itunes.apple.com/cn/app/id1101244278?mt=12](https://itunes.apple.com/cn/app/id1101244278?mt=12)



### 使用GitHub（亲测可用）

---
使用github存储博客图片

- 创建一个空的repo
- 然后将图片push到repo中
- 点击图片进去，有个download，右键复制链接
- 将链接插入文章
```
![logo](https://github.com/xxxx/xx.jpg)
```