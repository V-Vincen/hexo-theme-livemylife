---
title: Hexo-Theme-LiveMyLife
catalog: true
date: 2020-04-17 02:34:17
subtitle: A succinct hexo theme...
top: 999
header-img: /img/header_img/lml_bg.jpg
tags:
- Hexo
- Hexo-Theme-LiveMyLife
categories:
- Hexo-Theme-LiveMyLife
---


> Ported Theme of [Hux Blog](https://github.com/Huxpro/huxpro.github.io), Thank [Huxpro](https://github.com/Huxpro) for designing such a flawless theme.
>
> This LiveMyLife theme created by [Vincent](https://wvincen.gitee.io/) modified from the original Porter [YenYuHsuan](https://github.com/YenYuHsuan/hexo-theme-beantech) , refer to the Themes of [dusign](https://github.com/dusign/hexo-theme-snail)、[Utone](https://github.com/shixiaohu2206/hexo-theme-huhu), Thanks [dusign](https://github.com/dusign/hexo-theme-snail)、[Utone](https://github.com/shixiaohu2206/hexo-theme-huhu).
>   

## [View Live LiveMyLife Blog →](https://v-vincen.life/)

![LiveMyLife Desktop](livemylife-desktop.png)

## Quick Start

I publish the whole project for your convenience, so you can just follow the instruction down below, then you can easily customiz your own blog!

Let's begin!!!

### Install Node.js and Git
```shell
#For Mac
brew install node
brew install git
```
> Windows: Download & install Node.js. -> [Node.js](https://nodejs.org/zh-cn/download/)
>
> Windows: Download & install Git. -> [Git](https://git-scm.com/download/win)

### Install Hexo
```shell
$ npm install -g hexo-cli
```
> What is [Hexo](https://hexo.io/docs/)?
>
> Hexo is a fast, simple and powerful blog framework. You write posts in Markdown (or other markup languages) and Hexo generates static files with a beautiful theme in seconds.

### Setup your blog
```shell
$ hexo init blog
```
> More Commands -> [Hexo Commands](https://hexo.io/docs/commands)


## Theme Usage
### Init
```shell
cd bolg
rm -rf _config.yml package.json scaffolds source themes yarn.lock #just keep node_modules
git clone https://github.com/V-Vincen/hexo-theme-livemylife.git
mv hexo-theme-livemylife/* ./
npm install
```

### Set Theme
Modify the value of `theme`: in `_config.yml`
```yml
# Extensions
## Themes: https://hexo.io/themes/
## Plugins: https://hexo.io/plugins/
theme: livemylife
```

### Start the Server
```shell
hexo generate # or hexo g
hexo server   # or hexo s
```
Starts a local server. By default, this is at `http://localhost:4000/`.
> More Commands -> [Hexo Commands](https://hexo.io/docs/commands)

## Configuration
Modify `_config.yml` file with your own info, Especially the section:

### Site
Replace the following information with your own.
```yml
# Site
title: Live My Life
subtitle: 淡而无味也是一种味道
author: Mr.Vincent
language: zh-CN
timezone:
```

### Site Settings
Put customized pictures in img directory.
```yml
# Site settings
SEOTitle: JavaDev | 一如Java深似海
email: hexo-theme-livemylife@mail.com
description: "It's an IT blog..."
keyword: "Java,v-vincen,v-vincen,livemylife,IT  blog,Blog"
header-img: img/header_img/newhome_bg.jpg
archives-img: img/header_img/archive_bg2.jpg
```

### Favicon Settings
```yml
favicon: img/avatar/favicon.jpg
```

### Signature Settings
Copy your signature image to `<root>/img/signature` and modify the `_config.yml`.
```yml
signature: true   # show signature
signature-img: img/signature/<your-signature>
```
> How to create signature -> [Free Online Signature](https://fontmeme.com/signature-fonts/)

### Wave Settings
```yml
# WaveOverLay settings
waveoverlay: true
```
Example:

![waveoverlay](waveoverlay.png)

**either or**
```yml
# Wave settings
wave: true    #show wave
```
Example:

![wave](wave.png)


### SNS Settings
If you don’t want to display it, you can delete it directly.
```yml
# SNS settings
RSS: true
github_username: V-Vincen
twitter_username: V_Vincen_
instagram_username: V_Vincen_
# facebook_username:  yourAccount
# linkedin_username:  yourAccount
# zhihu_username: yourAccount
weibo_username: WVincen
```

### Sidebar Settings
Copy your avatar image to `<root>/img/` and modify the `_config.yml`:
```yml
sidebar: true   # whether or not using Sidebar.
sidebar-about-description: "I don't know where I am going ,but I am on my way..."
sidebar-avatar: img/avatar/vincnet.jpg    # use absolute URL, seeing it's used in both `/` and `/about/`
widgets:
- visitor   # busuanzi: https://busuanzi.ibruce.info/
- featured-tags
- short-about
- recent-posts
- friends-blog
- archive
- category

# widget behavior
## Archive
archive_type: 'monthly'
show_count: true

## Featured Tags
featured-tags: true   # whether or not using Feature-Tags
featured-condition-size: 0    # A tag will be featured if the size of it is more than this

## Friends
friends: [
    {
        title: "Teacher Ye",
        href: "http://teacherye.com/"
    },{
        title: "V_Vincen",
        href: "https://v-vincen.life/"
    }
]
```

### Comment Settings
If you want use [Disqus](https://disqus.com/), you must have a circumvention (bypass, bypass) technology. See [Valine](https://valine.js.org/) for detailed configuration method.
```yml
# Disqus settings
# disqus_username: your-disqus-ID

# valine settings
valine:
  enable: true
  API_ID: API_ID
  API_Key: API_Key
  placeholder: Say something ...
  guest_info: nick,mail,link    #评论者相关属性
  avatar: monsterid   #头像设置
  pageSize: 10
  visitor: true   #阅读量统计
  language: zh-cn
```

**either or**

```yml
# Doc:https://deserts.io/diy-a-comment-system/
# Doc:https://deserts.io/valine-admin-document/
valine_deserts:
  API_ID: API_ID
  API_Key: API_Key
  placeholder: Write a Comment
  language: en
```


### Analytics Settings
```yml
# Analytics settings
# Baidu Analytics
ba_track_id: ba_track_id

# Google Analytics
ga_track_id: UA-xxxxxx-xx   # Format: UA-xxxxxx-xx
```

### Sitemap Settings
```yml
#sitemap
sitemap:
  path: sitemap.xml
```

### Go to top icon Setup
My icon is using point, you can change to your own icon at `sourcre/css/images`.

### Post tag
You can decide to show post tags or not.
```yml
home_posts_tag: true
```
Example:

![home_posts_tag-true](home_posts_tag-true.png)


### Markdown render
My markdown render engine plugin is [hexo-renderer-markdown-it](https://github.com/celsomiranda/hexo-renderer-markdown-it).
```yml
# Markdown-it config
## Docs: https://github.com/celsomiranda/hexo-renderer-markdown-it/wiki
markdown:
  render:
    html: true
    xhtmlOut: false
    breaks: true
    linkify: true
    typographer: true
    quotes: '“”‘’'
```

### Anchorjs Settings
And if you want to change the header anchor '❡', you can go to `layout/post.ejs` to change it. How to use anchorjs, see [AnchorJS](https://www.bryanbraun.com/anchorjs/#examples) for detailed examples.
```yml
# Anchorjs Settings
anchorjs: true    # if you want to customize anchor. check out line:186 of `post.ejs`
```

```javascript
async("//cdn.bootcss.com/anchor-js/1.1.1/anchor.min.js",function(){
        anchors.options = {
          visible: 'hover',
          placement: 'left',
          icon: '❡'
          // icon: 'ℬ'
        };
        anchors.add().remove('.intro-header h1').remove('.subheading').remove('.sidebar-container h5');
    })
```

### Article Top
```yml
# article top
top: true
```
Hexo-theme-livemylife has added the article top function, just add `top: number` configuration to your markdown notes, articles are sorted by this number.

Example:

![top](top.png)

### WordCount Settings
A Word Count Plugin for Hexo. See [WordCount](https://github.com/willin/hexo-wordcount) for detailed configuration method.
```yml
# Dependencies: https://github.com/willin/hexo-wordcount
# Docs: https://www.npmjs.com/package/hexo-wordcount
wordcount: true
```

### Top scroll progress
```yml
# top scroll progress
scroll: true
```

### Viewer Config
Viewer is a simple jQuery image viewing plugin. Let us first look at a [demo](https://fengyuanchen.github.io/viewer/). See [Viewer](https://github.com/fengyuanchen/viewer) for detailed configuration. If you want to modify the [options](https://github.com/fengyuanchen/viewerjs#options) of Viewer, you can go to `sourcre/js/viewer/pic-viewer.js` to change it.
```yml
# Viewer config
viewer: true
```

### Theme Color Config
Hexo-Theme-LiveMyLife temporarily supports two themes color.
```yml
themecolor: true
```
Light theme preview：
![light theme](light.png)

Dark theme preview：
![dark theme](dark.png)



### Search Settings
```yml
# Dependencies: https://github.com/SuperKieran/hexo-generator-search-zip
search:
  enable: true
  path: search.json
  zipPath: search.zip
  versionPath: searchVersion.txt
  field: post
  # if auto, trigger search by changing input
  # if manual, trigger search by pressing enter key or search button
  trigger: auto
  # show top n results per article, show all results by setting to -1
  top_n_per_article: 1
```


### Deployment
Replace to your own repo!
```yml
deploy:
  type: git
  repo: https://github.com/<yourAccount>/<repo> # or https://gitee.com/<yourAccount>/<repo>
  branch: <your-branch>
```

## Hexo Basics

Some hexo command:

```bash
hexo new post "<post name>"   # you can change post to another layout if you want
hexo clean && hexo generate   # generate the static file
hexo server   # run hexo in local environment
hexo deploy   # hexo will push the static files automatically into the specific branch(gh-pages) of your repo!
```

## Have fun ^\_^

Please [Star](https://github.com/V-Vincen/hexo-theme-livemylife) this Project if you like it! [Follow](https://github.com/V-Vincen) would also be appreciated! Peace!

