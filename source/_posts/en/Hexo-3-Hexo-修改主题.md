---
title: '[Hexo] 3 Hexo 修改主题'
catalog: true
header-img: /img/header_img/hexo_bg.png
date: 2019-06-08 20:11:40
subtitle: 修改 Hexo 主题
tags: 
- Hexo
categories: 
- Hexo
---

参考：[hexo博客(四)：自定义主题并发布](https://lanmiao.oschina.io/2017/02/01/hexo4/)

![图片5](5.png)
这是 hexo 默认的主题，我们需要修改这个主题，那么我们可以去找一些符合我们个人爱好的一些主题[选择一个自己喜欢的 Hexo 主题](https://hexo.io/themes/)
这个网站有很多主题可以供我们去选择，如下图所示。每一个主题都有对应网站可以预览，并且都有 Github 地址，我们可以照着 Github 的 wiki 就可以安装了，过程都比较简单。

![图片6](6.png)

> 我们这次安装主题也是上面这些主题中其中一个，它就是 **LanMiao** (A Pink and simple theme) 。

### 安装 LanMiao 主题
---
##### 下载：[LanMiao 主题](https://github.com/hilanmiao/hexo-theme-lanmiao)

将主题克隆到 themes 目录下，以下截图就是 clone 之后的结果。
```git
$ cd <博客存放的目录>
$ git clone https://github.com/hilanmiao/hexo-theme-lanmiao
```
![图片7](7.png)

##### 使用：LanMiao 主题
打开在 Hexo 文件根目录下的 `_config.yml`，就是整个 hexo 框架的配置文件了。可以在里面修改大部分的配置。详细可参考官方的配置描述。找到 `theme` 把 `landscape`修改为 `hexo-theme-lanmiao`：
```shell
theme: landscape
```

```shell
theme: hexo-theme-lanmiao

# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  repo: <repository url>
  branch: [branch]
```

打开 Github 官网上 [**LanMiao 主题** 的地址](https://github.com/hilanmiao/hexo-theme-lanmiao)，认真阅读 **LanMiao 主题** 开发者的 README.md 文档：

![图片8](8.png)

根据 **README.md** 文档，修改 Hexo 根目录下的 `_config.yml` 配置文件：

![图片9](9.png)

然后在本地测试下：

```shell
$ hexo clean &  hexo g & hexo s 
```

修改成功，推送到 Github 上：

```shell
$ hexo clean &  hexo g & hexo d
```
![图片10](10.png)