---
title: How to apply JsDelivr CDN in Hexo-theme-livemylife Theme
catalog: true
lang: en
date: 2021-04-04 18:24:01
subtitle: A free CDN for Open Source fast, reliable, and automated...
header-img: /img/header_img/lml_bg.jpg
tags:
- Hexo-Theme-LiveMyLife
categories:
- Hexo-Theme-LiveMyLife
---

在早期之前博主，就写过一篇有关 JsDelivr CDN 加速的博文 -- [免费 CDN 提速 Github 静态资源访问](https://v-vincen.github.io/en/Github-%E5%8A%A0%E9%80%9F%E4%BC%98%E5%8C%96/) ，如果还不知道 JsDelivr 是什么的小伙伴，可以先看上面这篇文章。

今天博主想在这里讲一下，在 `hexo-theme-livemylife` 主题中，JsDelivr CDN 应用加速。众所周知，国内访问 Github 的体验一直不是很好，具体原因就不在这里阐述了。而现在时下流行的许多博客框架，再生成博客静态页面后，往往大家都会选择将其部署在 Github 上。原因当然是因为 Github Page 是免费的，如果你的博客是自己部署在服务器其上的，那请土豪你给博主一个打赏吧，玩笑下。

但是我刚才也说了 Github 国内访问速度真心慢。当然你也可以选择别的部署方式，博主在 [Four Ways to Deploy Hexo](https://v-vincen.github.io/en/Four-Ways-to-Deploy-Hexo/) 一文中，有相关的其他方案。在该文中博主也阐述了，最终还是选择 Github Page 部署个人博客的原因。

博主本人在开始写 `hexo-theme-livemylife` 主题的时候，就希望能够给用该主题的小伙伴带来更好的体验。所以对于 Github 国内访问速度慢这一情况，在 `hexo-theme-livemylife` 主题中，博主本人添加了 JsDelivr CDN 的配置。

## JsDelivr CDN Settings
```yml
# CDN Setting
# Docs: https://www.jsdelivr.com/?docs=gh
# If Github Pages deploy，you can ues jsdelivr settings
#
jsdelivr:
  jsdelivr_url: https://cdn.jsdelivr.net/gh/
  github_username: V-Vincen
```
在 `hexo-theme-livemylife` 主题最新的版本中，博主对这一功能做了进一步的升级完善。上一个版本 `hexo-theme-livemylife` 主题只是对博客中的全部图片做了 CDN 加速处理。而最新版本的 `hexo-theme-livemylife` 主题，对博客中的全部静态资源（css、img、js）都做了 CDN 加速处理。

*Preview:*
![cdn](cdn.png)

**注意：** 这个配置仅适用于，你是以 Github Page 方式来部署博客的。其实说的在简单点，`hexo-theme-livemylife` 主题，将博客 Github Page 整个仓库做了 CDN 的加速。如下图这是博主本人自己的博客。

*Preview:*
![githubpage](githubpage.png)

**最后还有一点需要注意：** 如果你在本地调试自己写的博客时，切记先将该配置先注释掉，再 `hexo s`。因为如果你不注释掉的话，`localhost:4000` 启动后的静态资源路径，全部是指向你的 Github 博客仓库的，会导致你无法实时读取到本地静态资源。所以切记先注释掉该配置，再启动，等调试完成后再开启配置，然后生成静态页面，最后推送到远程仓库。

## JsDelivr CDN 缓存刷新
博主在使用 JsDelivr CDN 时，曾遇到了这样一个问题。在一次调整 `hexo-theme-livemylife` 主题 css 样式时，我修改了某个 css 文件，然后提交到了 Github 仓库，当我部署完成了自己的博客后。在游览器中预览自己的博客时，发现刚才修改的样式并没有生效。进过一系类的排查，终于找到了问题所在 **JsDelivr CDN 缓存是有时效性的**。

在网上看到谋篇文章里是这样说的：JsDelivr 提供的全球 CDN 加速，CDN 的分流作用不仅减少了用户的访问延时，也减少的源站的负载。但其缺点也很明显：当网站更新时，如果 CDN 节点上数据没有及时更新，即便用户再浏览器使用 `Ctrl +F5` 的方式使浏览器端的缓存失效，也会因为 CDN 边缘节点没有同步最新数据而导致用户端未能及时更新。

CDN 边缘节点对开发者是透明的，相比于浏览器 `Ctrl+F5` 的强制刷新来使浏览器本地缓存失效，开发者可以通过 CDN 服务商提供的“刷新缓存”接口来达到清理 CDN 边缘节点缓存的目的。这样开发者在更新数据后，可以使用“刷新缓存”功能来强制 CDN 节点上的数据缓存过期，保证客户端在访问时，拉取到最新的数据。

对于 JsDelivr，缓存刷新的方式也很简单，只需将想刷新的链接的开头，如下：
```
https://cdn.jsdelivr.net/...
```
替换成：
```
https://purge.jsdelivr.net/...
```
即可实时刷新。

所以当你更新了自己博客到 Github 仓库后，**记得及时更新 JsDelivr CDN 缓存**。