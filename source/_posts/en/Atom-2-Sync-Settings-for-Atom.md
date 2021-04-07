---
title: '[Atom] 2 Sync Settings for Atom'
catalog: true
date: 2020-05-14 11:47:06
subtitle: Synchronize settings, keymaps, user styles, init script, snippets and installed packages across Atom instances...
header-img: /img/atom/atom_bg.png
tags:
- Atom
categories:
- Atom
---

在 [[Atom] 1 Atom](https://v-vincen.life/2020/05/13/Atom-1-Atom/) 中，对 Atom 已经有了大致的了解。今天我重点介绍一个插件，我们千辛万苦才配置好的 Atom，哪天电脑出了问题，需要重新安装配置 Atom，相信这个过程你一定不想来第二遍，所以我们的备份插件 `sync-settings` 就闪亮登场了，它的配置不麻烦，但过程比较曲折，所以提出来详细说明。

## `sync-settings`
`sync-settings` 的备份，其实是把 Atom 的配置文件备份在 GitHub上。所以首先需要在 GitHub 上获取两样东西，Access Token 和 Gist Id。

### `generate access token`
看图操作：

![1](1.png)

![2](2.png)

![3](3.png)

![4](4.png)

![5](5.png)

注：切记复制下你生成的 `Access Token`，因为只会显示一次，以后不会再显示了，
那有人可能会问，那要是没记录下来怎么办？没记录下来也没关系，把它删了后再重新生成就行了。

### `create gist`
看图操作：

![6](6.png)

![7](7.png)

![8](8.png)

![9](9.png)

### `sync-settings configuration`
然后将 Access Token 和 Gist Id 填入 `sync-settings` 插件的配置页面。

![10](10.png)

使用快捷键 `Shift + Command + P` 呼出命令栏，输入 `sync backup`，回车。

![11](11.png)

最后会提示以下信息，那么恭喜你将自己的 Atom 所有信息都备份了，下次恢复备份只需要按照上一步输入 `sync restore` 就行了。

![12](12.png)

## 总结
Atom 是一款现代化的文本编辑器，界面设计赏心悦目，让人在使用中神清气爽，优秀的第三方插件使其工作效率可以大大增强；但它的缺点也是非常明显的，性能和流畅度比之于 Vim 或 Sublime 还有待提高。对于 Atom，笔者的使用场景是做一些简单的代码编辑和 markdown 的编写，使用起来非常顺手，所以这里也推荐给各位。