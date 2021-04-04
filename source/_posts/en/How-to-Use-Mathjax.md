---
title: How to Use Mathjax
catalog: true
lang: en
date: 2021-04-03 17:34:41
subtitle: Beautiful and accessible math in all browsers...
header-img: /img/header_img/lml_bg.jpg
tags:
- Hexo-Theme-LiveMyLife
categories:
- Hexo-Theme-LiveMyLife
---

博主本人自己改编的 `hexo-theme-livemylife` 主题，有小伙伴在用时，问我是否支持 Mathjax 数学公式，由于工作原因未能增加此功能，在此次的 `hexo-theme-livemylife` 主题升级中，博主对之前小伙伴们提出的问题做了一个统一的修复和升级。那么让我们来看看 Mathjax 在 `hexo-theme-livemylife` 主题中是如何应用的。

> Mathjax: Beautiful and accessible math in all browsers. 
> A JavaScript display engine for mathematics that works in all browsers.
No more setup for readers. It just works.

上述是 Mathjax 官网原文解释。官网地址：https://www.mathjax.org/

## 安装渲染器
hexo 默认的渲染器是 marked，并不支持 mathjax。kramed 是在 marked 基础上修改的，支持了mathjax。在 hexo 工程目录下的 node_modules 中可以找到对应的渲染器文件夹。同时在你的工程目录下用以下命令安装 kramed。
```npm
npm uninstall hexo-renderer-marked --save
npm install hexo-renderer-kramed --save
``` 

如果你安装了 hexo-math 包，卸载再安装 hexo-renderer-mathjax 包。
```npm
npm uninstall hexo-math --save
npm install hexo-renderer-mathjax --save
```

更新 mathjax 的 CDN，打开 `node_modules/hexo-renderer-mathjax/mathjax.html`（可做可不做）。但是，我把 http 改成 https 了：
```js
<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
```

改成：
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.6/MathJax.js?config=TeX-MML-AM_CHTML"></script>
```

如果小伙伴你用的是博主本人写的 `hexo-theme-livemylife` 主题的话，那么上述步骤，博主本人已经帮你完成了。那接下来让我们一起看几个渲染后的 mathjax 案例：

*Example1: *
```
When $a \ne 0$, there are two solutions to \(ax^2 + bx + c = 0\) and they are
$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$
```
*Preview: *
When $a \ne 0$, there are two solutions to \(ax^2 + bx + c = 0\) and they are
$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$

*Example2: *
```
$$f(x_1,x_2,\underbrace{\ldots}_{\rm ldots} ,x_n) = x_1^2 + x_2^2 + \underbrace{\cdots}_{\rm cdots} + x_n^2$$
```
*Preview: *
$$f(x_1,x_2,\underbrace{\ldots}_{\rm ldots} ,x_n) = x_1^2 + x_2^2 + \underbrace{\cdots}_{\rm cdots} + x_n^2$$

*Example4: *
```
$$
\begin{bmatrix} 1&x&x^2\\ 1&y&y^2\\ 1&z&z^2 \end{bmatrix}
\\
\begin{bmatrix} 1&x&x^2\\\\ 1&y&y^2\\\\ 1&z&z^2 \end{bmatrix}
\\
vmatrix ||、Bmatrix{}、pmatrix()
$$
```
*Preview: *
$$
\begin{bmatrix} 1&x&x^2\\ 1&y&y^2\\ 1&z&z^2 \end{bmatrix}
\\
\begin{bmatrix} 1&x&x^2\\\\ 1&y&y^2\\\\ 1&z&z^2 \end{bmatrix}
\\
vmatrix ||、Bmatrix{}、pmatrix()
$$

*Example5: *
```
$$
f(x)=
\begin{cases}
0& \text{x=0}\\\\
1& \text{x!=0}
\end{cases}
$$
```
*Preview: *
$$
f(x)=
\begin{cases}
0& \text{x=0}\\\\
1& \text{x!=0}
\end{cases}
$$

*Example6: *
```
$$\lim_{n \rightarrow +\infty} \frac{1}{n(n+1)}$$
```
*Preview: *
$$\lim_{n \rightarrow +\infty} \frac{1}{n(n+1)}$$

更多用法可参考 mathjax 官网：https://www.mathjax.org/
或者参考：https://rmshadows.gitee.io/2020/Markdown/#%E6%9D%A5%E6%BA%90-2