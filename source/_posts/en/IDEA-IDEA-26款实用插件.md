---
title: '[IDEA] IDEA 26款实用插件'
catalog: true
date: 2019-06-13 23:50:16
subtitle: IDEA 实用插件
header-img: /img/idea/idea_bg2.png
tags:
- IDEA
categories:
- IDEA
---

善用 Intellij 插件可大幅提升我们的效率，以下是我用过不错的 Intellij 插件。

## IDE Eval Reset
Gitee Repo：https://gitee.com/pengzhile/ide-eval-resetter

插件文档：https://zhile.io/2020/11/18/jetbrains-eval-reset.html

Reset Your IDE Eval Information.
* Download and install plugin from [Download Link](https://plugins.zhile.io/files/ide-eval-resetter-2.1.9.zip).
* Alternative installation method:
    * Add "Custom Plugin Repository": https://plugins.zhile.io manually (`Settings/Preferences -> Plugins`)
    * Search and install plugin: `IDE Eval Reset`
* Click `Help` or `Get Help` -> `Eval Reset` menu.
* Click `Reset` -> Yes button.
* Restart your IDE.
* Now you have another 30 days eval time :)
* For more information, visit [here](https://zhile.io/2020/11/18/jetbrains-eval-reset.html).


## <font color=red > .ignore</font>
生成各种 ignore 文件，一键创建 git ignore 文件的模板，免得自己去写。下载地址：https://plugins.jetbrains.com/plugin/7495--ignore
![1](1.gif)



## <font color=red > lombok</font>

支持 lombok 的各种注解，从此不用写 getter setter 这些 可以把注解还原为原本的 java 代码 非常方便。下载地址：https://plugins.jetbrains.com/plugin/6317-lombok-plugin
![2](2.gif)



## p3c（阿里巴巴代码规约检测）

2017年10月14日杭州云栖大会，Java代码规约扫描插件全球首发仪式正式启动，规范正式以插件形式公开走向业界，引领 Java 语言的规范之路。Java 代码规约扫描插件以今年年初发布的《阿里巴巴 Java 开发规约》为标准，作为 Eclipse、IDEA 的插件形式存在，检测 Java 代码中存在不规范得位置然后给予提示。规约插件是采用 kotlin 语言开发的，感兴趣的同学可以去开看插件源码。阿里巴巴规约插件包含三个子菜单：编码规约扫描、关闭试试检测功能。
![3](3.jpeg)

并且，该插件支持在编写代码的同时进行提示， 这款插件，真的可以很大程度上提升代码质量，一定要安装。
![4](4.jpeg)

详细的可以看 p3c 插件的安装文档：<https://github.com/alibaba/p3c/tree/master/idea-plugin>



## FindBugs-IDEA

检测代码中可能的 bug 及不规范的位置，检测的模式相比 p3c 更多，写完代码后检测下 避免低级 bug，强烈建议用一下，一不小心就发现很多老代码的 bug。下载地址：https://plugins.jetbrains.com/plugin/3847-findbugs-idea
![5](5.gif)



## GsonFormat 或 GsonFormatPlus

一键根据 json 文本生成 java 类非常方便。下载地址：https://plugins.jetbrains.com/plugin/7654-gsonformat
![6](6.gif)



## <font color=red >Maven Helper</font> 

一键查看 maven 依赖，查看冲突的依赖，一键进行 exclude 依赖，对于大型项目非常方便。下载地址：https://plugins.jetbrains.com/plugin/7179-maven-helper
![7](7.jpeg)



## VisualVM Launcher

运行 java 程序的时候启动 visualvm，方便查看 jvm 的情况比如堆内存大小的分配，某个对象占用了多大的内存，jvm 调优必备工具。下载地址：https://plugins.jetbrains.com/plugin/7115-visualvm-launcher
![8](8.gif)



## <font color=red >GenerateAllSetter </font>
一键调用一个对象的所有 set 方法并且赋予默认值 在对象字段多的时候非常方便。下载地址：https://plugins.jetbrains.com/plugin/9360-generateallsetter
![9](9.gif)



## <font color=red >MyBatisCodeHelperPro</font> 
mybatis 代码自动生成插件，大部分单表操作的代码可自动生成 减少重复劳动大幅提升效率。下载地址：https://plugins.jetbrains.com/plugin/9837-mybatiscodehelperpro
![10](10.jpeg)



## <font color=red >Rainbow Brackets</font>
彩虹颜色的括号看着很舒服敲代码效率变高。下载地址：https://plugins.jetbrains.com/plugin/10080-rainbow-brackets
![11](11.jpeg)



## <font color=red >Translation</font>
最好用的翻译插件，功能很强大，界面很漂亮。下载地址：https://plugins.jetbrains.com/plugin/8579-translation
![12](12.gif)



## activate-power-mode 和 Power mode II
根据 Atom 的插件 activate-power-mode 的效果移植到 IDEA 上；写代码是整个屏幕都在抖动，activate-power-mode 是白的的，Power mode II 色彩更酷炫点。
![13](13.gif)



## Background Image Plus
idea 背景修改插件，让你的 idea 与众不同，可以设置自己喜欢的图片作为 code 背景。安装成功之后重启，菜单栏的 VIew 标签 > 点击 Set Background Image （没安装插件是没有这个标签的），在弹框中路由选择到本地图片，点击 OK 即可。
![14](14.png)



## <font color=red >Grep console</font>
自定义日志颜色，idea 控制台可以彩色显示各种级别的 log，安装完成后，在 console 中右键就能打开。
![15](15.png)

并且可以设置不同的日志级别的显示样式。可以直接根据关键字搜索你想要的，搜索条件是支持正则表达式的。下载地址：https://plugins.jetbrains.com/idea/plugin/7125-grep-console
![16](16.png)



## <font color=red >MyBatis Log Plugin</font>
Mybatis 现在是 java 中操作数据库的首选，在开发的时候，我们都会把 Mybatis 的脚本直接输出在 console 中，但是默认的情况下，输出的脚本不是一个可以直接执行的。
![17](17.png)

如果我们想直接执行，还需要在手动转化一下。MyBatis Log Plugin 这款插件是直接将 Mybatis 执行的 sql 脚本显示出来，无需处理，可以直接复制出来执行的，如图：
![18](18.png)

执行程序后，我们可以很清晰的看到我们执行了哪些sql脚本，而且脚本可以执行拿出来运行。



## String Manipulation
强大的字符串转换工具。使用快捷键，Alt + m 。
![19](19.png)
- 切换样式（camelCase， hyphen-lowercase，HYPHEN-UPPERCASE， snake_case，SCREAMING_SNAKE_CASE,，dot.case，words lowercase，Words Capitalized，PascalCase）
- 转换为 SCREAMING_SNAKE_CASE (或转换为camelCase）
- 转换为 snake_case （或转换为camelCase）
- 转换为 dot.case （或转换为camelCase）
- 转换为 hyphen-case （或转换为camelCase）
- 转换为 hyphen-case （或转换为snake_case）
- 转换为 camelCase （或转换为Words）
- 转换为 camelCase （或转换为lowercase words）
- 转换为 PascalCase （或转换为camelCase）
- 选定文本大写
- 样式反转



## Alibaba Java Coding Guidelines

阿里巴巴代码规范检查插件，当然规范可以参考《阿里巴巴 Java 开发手册》。
![20](20.png)



## <font color=red >Restfultoolkit 或 Restfultool</font>
Spring MVC 网页开发的时候，我们都是通过 requestmapping 的方式来定义页面的 URL 地址的，为了找到这个地址我们一般都是 cmd + shlequestmapping，查找的时候还是有那么一点不方便的，restfultoolkit 就能很方便的帮忙进行查找。例如：我要找到 /user/add 对应的 controller ，那么只要 Ctrl + 斜杠 ,就能直接定位到我们想要的 controller 。
![21](21.png)

这个也是真心方便，当然 restfultoolkit 还为我们提供的其他的功能。根据我们的 controller 帮我们生成默认的测试数据，还能直接调用测试，这个可以是解决了我们每次 postman 调试数据时，自己傻傻的组装数据的的操作，这个更加清晰，比在 console 找数据包要方便多了。
![22](22.png)

## <font color=red >JRebel</font> 
JRebel 是一种热部署生产力工具，修改代码后不用重新启动程序，所有的更改便可以生效。它跳过了 Java 开发中常见的重建、重新启动和重新部署周期。

## <font color=red >Key promoter X</font>
Key promoter 是 IntelliJ IDEA 的快捷键提示插件，会统计你鼠标点击某个功能的次数，提示你应该用什么快捷键，帮助记忆快捷键，等熟悉了之后可以关闭掉这个插件。


## <font color=red >CodeGlance</font>
将类似于 Sublime 中的代码的微型地图嵌入到编辑器窗格中。使用您自定义的颜色突出显示语法，可同时使用浅色和深色主题。

![23](23.gif)


## <font color=red >Statistic</font>
显示项目统计信息。该插件显示按扩展名排序的文件以及大小，行数LOC等。用户可以使用“选择时刷新”按钮选择（项目/模块/包/文件）作用域。（此插件需要Java 1.8）

![24](24.png)

![25](25.png)


## <font color=red >SequenceDiagram</font>
有的时候，我们需要梳理业务逻辑或者阅读源码。从中，我们需要了解整个调用链路，反向生成 UML 的时序图是强需求。其中，SequenceDiagram 插件是一个非常棒的插件。详细使用文档，参考：https://plugins.jetbrains.com/plugin/8286-sequencediagram

![26](26.gif)



## <font color=red >POJO to json</font>
为了测试需要，我们需要将简单 Java 领域对象转成 JSON 字符串方便用 postman 或者 curl 模拟数据。详细使用文档，参考：https://github.com/organics2016/pojo2json

![27](27.gif)


## <font color=red >stackoverflow</font>
Stack Overflow 是一个程序设计领域的问答网站，隶属Stack Exchange Network。用过idea 自带的 Google 搜索的话 ，其实是很好理解的，类似的功能，但是用 StackoverFlow 搜索的话个人觉得比用 google 更精准。不过使用的是谷歌搜索，所以需要科学上网。

![28](28.png)