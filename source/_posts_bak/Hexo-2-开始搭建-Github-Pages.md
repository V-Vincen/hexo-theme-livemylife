---
title: '[Hexo] 2 开始搭建 Github Pages'
catalog: true
header-img:  /img/header_img/hexo_bg.png
date: 2019-06-08 19:41:37
subtitle: 搭建 Github Pages
tags:
- Hexo
categories:
- Hexo
---

### 什么是 Github Pages
---
[GitHub Pages](https://pages.github.com/) 本用于介绍托管在 GitHub 的项目，不过，由于他的空间免费稳定，用来做搭建一个博客再好不过了。

每个帐号只能有一个仓库来存放个人主页，而且仓库的名字必须是 username/username.github.io，这是特殊的命名约定。你可以通过 http://username.github.io 来访问你的个人主页。

这里特别提醒一下，需要注意的个人主页的网站内容是在 master 分支下的。

### 创建自己的 Github Pages
---
在 Github 首页右上角头像左侧加号点选择 New repository (新存储库)或 [点击这里](https://github.com/new) 进行创建一个仓库。
![图片1](1.png)

开启 Github Pages，进入设置

![图片2](2.png)

找到这一块

![图片3](3.png)

当你的仓库名为：用户名.github.io 之后默认开启 Github Pages。

现在随便选择一个主题,选择上图的 Choose a theme 之后会跳转到下面这个页面（可以不选）
![图片4](4.png)
设置完毕后你就可以通过 username.github.io（username 为你的用户名访问你的博客了）

**在这里我创建了一个 github repo 叫做 [v_vincen.gitee.io](https://v_vincen.gitee.io/) 创建完成之后，需要有一次提交（git commit）操作，然后就可以通过链接 [v_vincen.gitee.io](https://v_vincen.gitee.io/) 访问了。**

### 部署 Hexo 到 Github Pages
---
这一步恐怕是最关键的一步了，让我们把在本地 web 环境下预览到的博客部署到 github 上，然后就可以直接通过 [v_vincen.gitee.io](https://v_vincen.gitee.io/) 访问了。不过很多教程文章对这个步骤语焉不详，这里着重说下。

首先需要明白所谓部署到 github 的原理。

- 之前步骤中在 Github 上创建的那个特别的 repo (v-vincen.gitee.io) 一个最大的特点就是其master 中的 html 静态文件，可以通过链接 [v_vincen.gitee.io](https://v_vincen.gitee.io/) 来直接访问。
- Hexo -g 会生成一个静态网站（第一次会生成一个 public 目录），这个静态文件可以直接访问。
- 需要将 hexo 生成的静态网站，提交 (git commit) 到 github 上。

明白了原理，怎么做自然就清晰了。

### 使用 hexo deploy 部署
---
hexo deploy 可以部署到很多平台，具体可以 [参考这个链接](https://hexo.io/zh-cn/docs/github-pages)。

这一步，我们就可以将 hexo 和 GitHub 关联起来，也就是将 hexo 生成的文章部署到 GitHub 上，打开站点配置文件 `_config.yml`，翻到最后，修改为 YourgithubName 就是你的 GitHub 账户。
```xml
deploy:
  type: git
  repo: https://github.com/YourgithubName/YourgithubName.github.io.git
  branch: master
```

这个时候需要先安装 deploy-git ，也就是部署的命令,这样你才能用命令部署到 GitHub。
```shell
$ npm install hexo-deployer-git --save
```
然后
```shell
hexo clean
hexo generate
hexo deploy
```
其中
- hexo clean 清除了你之前生成的东西，也可以不加。
- hexo generate 顾名思义，生成静态文章，可以用 hexo g 缩写
- hexo deploy 部署文章，可以用 hexo d 缩写

注意 deploy 时可能要你输入 username 和 password。

之后你就可以在 [http://yourname.github.io](https://v_vincen.gitee.io/404/html) 这个网站看到你的博客了！！
![图片5](5.png)


参考：[我是如何利用Github Pages搭建起我的博客，细数一路的坑](https://www.cnblogs.com/jackyroc/p/7681938.html)

参考：[如何搭建一个独立博客——简明Github Pages与Hexo教程](https://www.jianshu.com/p/05289a4bc8b2)

参考：[搭建 Github Pages 个人博客网站](https://blog.csdn.net/KNIGH_YUN/article/details/79774344)

可以选择阅读完以上三篇教程后倒回来看不懂的地方。