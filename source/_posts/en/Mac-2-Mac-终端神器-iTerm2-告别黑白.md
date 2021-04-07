---
title: '[Mac] 2 Mac 终端神器 iTerm2 -- 告别黑白'
catalog: true
date: 2020-01-14 11:50:18
subtitle: Mac 终端神器 iTerm2
header-img: /img/mac/mac_bg.jpg
tags:
- Mac
categories:
- Mac
---

## `Zsh` 是什么
- `Zsh` 是一款强大的虚拟终端，既是一个系统的虚拟终端，也可以作为一个脚本语言的交互解析器。
- 打开终端，在终端上输入 `zsh --version` 这个命令来查看我们的电脑上是否安装了 `Zsh`，终端查询版本为： `zsh 5.3 (x86_64-apple-darwin18.0)`
- 查看系统当前 `shell`：

```shell
➜  ~ cat /etc/shells
# List of acceptable shells for chpass(1).
# Ftpd will not allow users to connect who are not using
# one of these shells.

/bin/bash
/bin/csh
/bin/ksh
/bin/sh
/bin/tcsh
/bin/zsh
➜  ~
```

## `iTerm2` 简介
Mac OS 自带的终端，系统默认使用 `dash` 作为终端，用起来虽然有些不太方便，界面也不够友好,`iTerm2` 是一款相对比较好用的终端工具。安装完成后，在 `/bin` 目录下会多出一个 `zsh` 的文件。我们可以使用命令修改默认使用 `zsh`：

```shell
chsh -s /bin/zsh
```

同时 `iTerm2` 还有一些常用操作包括主题选择、声明高亮、自动填充建议、隐藏用户名和主机名、分屏效果等。

先来看效果图：

![1](1.png)

## 下载及安装
`iTerm2` 官网下载地址：https://www.iterm2.com/downloads.html

下载的是压缩文件，解压后直接双击执行程序文件，或者直接将它拖到 Applications 目录下。

也可以直接使用Homebrew进行安装：
```shell
$ brew cask install iterm2
```

### 配置 `iTerm2` 主题
`iTerm2` 最常用的主题是 `Solarized Dark` theme，下载地址：http://ethanschoonover.com/solarized

下载的是压缩文件，解压，然后打开 `iTerm2`，按 `Command + ，键` ，打开 `Preferences` 配置界面，然后 `Profiles -> Colors -> Color Presets`，在下拉列表中选择 `Import` ，选择刚才解压的 `solarized->iterm2-colors-solarized->Solarized Dark.itermcolors` 文件，导入成功后,在 `Color Presets` 下选择 `Solarized Dark` 主题，就可以了。（新版本的 `iTerm2` 默认已经安装好了 `Solarized Dark` 主题）

![2](2.png)

![3](3.png)

## 设置 `iTerm2` 背景图片
打开 `iTerm2`，按 `Command + ，键` ，打开 `Preferences` 配置界面 `Profiles -> Window->Background mage`，选择一张自己喜欢的背景图。

![4](4.png)

##  配置 `Oh My Zsh`
那我们先来了解下 `Oh My Zsh` 是什么：

`Oh My Zsh` 是一款社区驱动的命令行工具，正如它的主页上说的，`Oh My Zsh` 是一种生活方式。它基于 `zsh` 命令行，提供了主题配置，插件机制，已经内置的便捷操作。给我们一种全新的方式使用命令行。它是基于 `zsh` 命令行的一个扩展工具集，提供了丰富的扩展功能。安装 `Oh My Zsh` 前提条件：必须已安装 `zsh`，`zsh` 的功能极其强大，只是配置过于复杂。所以我们通过 `Oh my zsh` 可以很快配置 `zsh`。

官网地址：https://ohmyz.sh/

GitHub 地址：https://github.com/ohmyzsh/ohmyzsh 

### 安装
安装方法有两种，可以使用 `curl` 或 `wget`，看自己环境或喜好：

```shell
# curl 安装方式
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

```shell
# wget 安装方式
sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
```
安装好之后，需要把 `Zsh` 设置为当前用户的默认 `Shell`（这样新建标签的时候才会使用 `Zsh`）：
```shell
$ chsh -s /bin/zsh

```

### 修改主题
`Oh My Zsh` 默认自带了一些默认主题，存放在 `~/.oh-my-zsh/themes` 目录中。我们可以查看这些主题，终端输入：

```shell
cd ~/.oh-my-zsh/themes && ls
```

将主题修改为 `ZSH_THEME="robbyrussell"`。
```
$ vim ~/.zshrc
```
输入 `i` 进入编辑模式,将 `ZSH_THEME=""` 编辑为 `ZSH_THEME="robbyrussell"`，按下 `esc` 键，退出并保存 `:wq`。

![5](5.png)

`Oh My Zsh` 也对主题的进一步扩展,下载地址：https://github.com/ohmyzsh/ohmyzsh/wiki/Themes

### 自动建议填充
这个功能是非常实用的，可以方便我们快速的敲命令。

配置步骤，先克隆 `zsh-autosuggestions` 项目，到指定目录：
```git
$ git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions
```

然后编辑 `vim ~/.zshrc` 文件，找到 `plugins` 配置，增加 `zsh-autosuggestions` 插件。

![6](6.png)


## `iTerm2` 快捷命令

```shell
command + t 新建标签
command + w 关闭标签
command + 数字 command + 左右方向键    切换标签
command + enter 切换全屏
command + f 查找
command + d 水平分屏
command + shift + d 垂直分屏
command + option + 方向键 command + [ 或 command + ]    切换屏幕
command + ; 查看历史命令
command + shift + h 查看剪贴板历史
ctrl + u    清除当前行
ctrl + l    清屏
ctrl + a    到行首
ctrl + e    到行尾
ctrl + f/b  前进后退
ctrl + p    上一条命令
ctrl + r    搜索命令历史
```


















