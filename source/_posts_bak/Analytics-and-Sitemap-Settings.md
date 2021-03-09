---
title: Analytics and Sitemap Settings
catalog: true
date: 2020-07-21 17:31:49
subtitle: How to use analytics and sitemap...
header-img: /img/header_img/lml_bg.jpg
tags:
- Hexo
- Hexo-Theme-LiveMyLife
categories:
- Hexo-Theme-LiveMyLife
---

## Google Analytics Settings
### 代码（脚本）嵌入网站中
- [登录谷歌分析平台](https://analytics.google.com/)，创建用户。
- 获取代码（脚本）。
    ![1](1.png)

- `hexo-theme-livemylife` 主题 [`head.ejs`](https://github.com/V-Vincen/hexo-theme-livemylife/blob/master/themes/livemylife/layout/_partial/head.ejs) 文件中，已经添加了下面的 js 脚本。
    ```html
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-164526897-1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', 'UA-xxxxxx-xx');
    </script>
    ```

- 直接修改 `hexo-theme-livemylife` 主题 [`_config.yml`](https://github.com/V-Vincen/hexo-theme-livemylife/blob/master/_config.yml) 配置文件 `ga_track_id` 为 **跟踪 ID**。
   
    ![2](2.png)


## Baidu Analytics Settings
- [登录百度统计平台](https://tongji.baidu.com/web/10000186631/welcome/login)，添加 **自有网站**。

    ![3](3.png)


- 获取代码（脚本）。
    
    ![4](4.png)

- `hexo-theme-livemylife` 主题 [`head.ejs`](https://github.com/V-Vincen/hexo-theme-livemylife/blob/master/themes/livemylife/layout/_partial/head.ejs) 文件中，已经添加了下面的 js 脚本。
    ```html
    <script>
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?ba_track_id";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();
    </script>
    ```

- 直接修改 `hexo-theme-livemylife` 主题 [`_config.yml`](https://github.com/V-Vincen/hexo-theme-livemylife/blob/master/_config.yml) 配置文件 `ba_track_id` 为脚本中的 **ba_track_id**。
    ```
    ba_track_id: ba_track_id
    ```
    

## Google Sitemap Settings
### 验证网站所有权
- 先进入 [google 站点平台](https://www.google.com/webmasters/#?modal_active=none)，点击右上角的登录，如果还没有谷歌账号的要先注册一个谷歌账号。然后添加资源，这里选择网址前缀，输入博客首页，例如：https://v-vincen.life/

    ![5](5.png)

- 点击继续，验证网站所有权，使用HTML标记验证。
    
    ![6](6.png)

- 修改 `hexo-theme-livemylife` 主题的 [`head.ejs`](https://github.com/V-Vincen/hexo-theme-livemylife/blob/master/themes/livemylife/layout/_partial/head.ejs) 文件。
    ```html
    <meta name="google-site-verification" content="X7_M3eeaLhvjhG34NuQBgu2gdyRlAtMB4utP5AgEBc" />
    ```

- 把上面红框的内容复制下来，并粘贴到 `head.ejs` 文件中，通过验证。

### 安装 sitemap 插件
- 在 hexo 根目录执行下面两个命令。
    ```
    npm install hexo-generator-sitemap --save
    ```
- 修改 `hexo-theme-livemylife` 主题 [`_config.yml`](https://github.com/V-Vincen/hexo-theme-livemylife/blob/master/_config.yml) 配置文件，`url` 换成自己的博客首页，并且需改 `sitemap` 配置。
    ```yml
    # URL
    ## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
    url: https://v-vincen.life    # Note: don't forget to modify the CNAME file to your url
    root: /
    permalink: :year/:month/:day/:title/
    permalink_defaults:
    ```
    
    ```yml
    ## Sitemap
    sitemap:
        path: sitemap.xml
    ```

- 执行 `hexo g -d` 命令，发现在根目录 `public` 文件夹下新增了 `sitemap.xml` 文件。

    ![7](7.png)

### 提交谷歌站点地图
- 接着进入谷歌站点，提交刚才验证网站的站点地图。
    
    ![8](8.png)

- 等待谷歌收录，最后谷歌搜索 `site:v-vincen.life`，看下网页是否被谷歌收录

    ![9](9.png)


## Baidu Sitemap Settings
### 验证网站所有权
- 先进入 [百度站点平台](https://ziyuan.baidu.com/site/index#/)，「用户中心」-> 「站点管理」-> 「添加网站」，添加需要管理的网站地址。

    ![10](10.png)

- 验证有三种方式：文件、html标签、cname。这里采用的是 html 标签的形式，修改 `hexo-theme-livemylife` 主题的 [`head.ejs`](https://github.com/V-Vincen/hexo-theme-livemylife/blob/master/themes/livemylife/layout/_partial/head.ejs) 文件。
    ```html
    <meta name="baidu-site-verification" content="PpzM9WxOJU" />
    ```

- 添加完相应的标签之后，上传到自己的博客之中，百度站点验证通过。

### 安装 baidu-sitemap 插件
- 在 hexo 根目录执行下面两个命令。
    ```
    npm install hexo-generator-baidu-sitemap --save
    ```
- 修改 `hexo-theme-livemylife` 主题 [`_config.yml`](https://github.com/V-Vincen/hexo-theme-livemylife/blob/master/_config.yml) 配置文件，`url` 换成自己的博客首页，并且需改 `Baidusitemap` 配置。
    ```yml
    # URL
    ## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
    url: https://v-vincen.life    # Note: don't forget to modify the CNAME file to your url
    root: /
    permalink: :year/:month/:day/:title/
    permalink_defaults:
    ```
    
    ```yml
    ## Baidusitemap
    baidusitemap:
        path: baidusitemap.xml
    
    baidu_push: true
    ```

- 执行 `hexo g -d` 命令，发现在根目录 `public` 文件夹下新增了 `baidusitemap.xml` 文件。

### 百度站点收录
- 「资源提交」-> 「普通收录」-> 「资源提交」-> 「sitemap」，填写数据文件地址，点击 「提交」。
    
    ![11](11.png)

- 接下来要做的就是等待了，过上一两天就会在这里看到提取的 url 数量了。

### 自动推送（可添加）
[自动推送](https://ziyuan.baidu.com/college/courseinfo?id=267&page=2#h2_article_title9)：是轻量级链接提交组件，将自动推送的 JS 代码放置在站点每一个页面源代码中，当页面被访问时，页面链接会自动推送给百度，有利于新页面更快被百度发现。

- `hexo-theme-livemylife` 主题 [`head.ejs`](https://github.com/V-Vincen/hexo-theme-livemylife/blob/master/themes/livemylife/layout/_partial/head.ejs) 文件中，已经添加了下面的 js 代码。
    ```html
    <script>
    (function(){
        var bp = document.createElement('script');
        var curProtocol = window.location.protocol.split(':')[0];
        if (curProtocol === 'https'){
       bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
      }
      else{
      bp.src = 'http://push.zhanzhang.baidu.com/push.js';
      }
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(bp, s);
    })();
    </script>
    ```

- 直接修改 `hexo-theme-livemylife` 主题 [`_config.yml`](https://github.com/V-Vincen/hexo-theme-livemylife/blob/master/_config.yml) 配置文件 `Baidusitemap.baidu_push` 为 `true`。
    ```yml
    ## Baidusitemap
    baidusitemap:
        path: baidusitemap.xml
        baidu_push: true
    ```




