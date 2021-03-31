---
title: '[IDEA] IDEA 使用前最好修改的配置'
catalog: true
date: 2019-06-12 09:51:31
subtitle: IDEA 的配置
header-img: /img/idea/idea_bg2.jpg
tags: 
- IDEA
categories:
- IDEA
---

## 修改配置

### 关闭自动更新

没有必要使用最新的 Idea 版本，所以可以关闭自动更新。当有较大版本更新时，才建议升级版本。

![图片1](1.jpeg)



### 修改 maven 的 path 变量为非系统盘下的路径

![图片2](2.jpeg)



### 在新窗口打开项目

Idea 和 Eclipse 的项目组织方式是不一样的，不能按照用 Eclipse 中的使用习惯去使用 Idea 。多项目同时开发时，建议打开此配置。

![图片3](3.jpeg)


### 打开代码自动完成

Idea 默认的代码自动完成是区分大小写的，关闭后，按任意键即可展示代码提示。

![图片4](4.jpeg)


### 多行 tabs 展示打开的文件

此配置建议在使用大屏显示器、台式机时勾选，笔记本、Mac 等可以保持默认配置。

![图片5](5.jpeg)



### 设置编码字符集

将 Idea 的编码方式修改为 UTF-8，类似于在 Eclipse 的 eclipse.ini 中配置 -Dfile.encoding=UTF-8 

![图片6](6.jpeg)



### 鼠标滚轮调整字体大小

建议勾选此配置，特别适合不习惯字体小的小伙伴。功能类似于文本编辑器、浏览器的缩放功能。但 Mac 下使用不理想。

![图片7](7.jpeg)



### 注释悬浮提示

Eclipse 的强大提示功能的翻版，但是 Idea 默认是关闭的，建议打开

![图片8](8.jpeg)


### 自动导包

打开后，粘贴代码时，会自动 import 。如果多个包路径下存在同名的类时，也可用快捷键 Alt+Enter 手动选择导入。

不建议打开此项，如果在其他的小伙伴不打开该项的情况下，会造成修改代码时，自动优化 import 的包的顺序，提交代码时有多余行变动。

![图片9](9.jpeg)


### 集成插件

集成 .ignore 插件、Key Promoter X 插件、阿里 Java 规约插件、lombok、GsonFormat、Maven Helper、VisualVM Launcher、GenerateAllSetter、MyBatisCodeHelperPro、rainbow-brackets

![图片10](10.jpeg)

![图片11](11.jpeg)

![图片12](12.jpeg)


### 修改 maven 仓库路径

可以使用集成的 maven 或者本机安装的 maven，但仓库路径最好修改到非系统盘下的路径，避免重装系统后，重新下载 maven 仓库。

![图片13](13.jpeg)


### 打开自动编译开关

Eclipse 下，项目是自动编译的，使用 Idea 时建议也打开此配置。同时 Idea 是自动保存的，这样可以最快发现代码编码错误，避免代码上传到 Git 服务器后，Jenkins 自动构建失败。

![图片14](14.jpeg)



### 配置浏览器

建议前端调整此配置

![图片15](15.jpeg)


### 检查平台的 Jdk 版本

![图片16](16.jpeg)


### 设置 Project 的 JDK 版本

![图片17](17.jpeg)