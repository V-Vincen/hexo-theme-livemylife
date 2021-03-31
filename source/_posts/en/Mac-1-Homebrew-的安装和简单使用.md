---
title: '[Mac] 1 Homebrew 的安装和简单使用'
catalog: true
date: 2020-01-14 11:44:18
subtitle: Homebrew 的安装和简单使用
header-img: /img/mac/mac_bg.jpg
tags:
- Mac
categories:
- Mac
---

## 前言
作为 linux 系统的忠实粉丝，我们都很喜欢 (Debian/Ubuntu) 系列的 `apt` 包管理系统和 (Redhat/Fedora) 系列的 `yum` 包管理系统。 包括 Windows 用户都有多种方便的软件管理工具，如：360软件管理，QQ 软件管理，迅雷软件管理等多种。 Mac OS X系统下面之前有老牌的 Macports，Fink包管理系统，包括 apple 的官方Mac App Store。所以我们也向在苹果下找到一款比较新的，方便的包管理系统，没错，她就是 `Homebrew` 。

什么是 `Homebrew` 呢？

Homebrew is the easiest and most flexible way to install the UNIX tools Apple didn’t include with OS X。官方的解释非常明了，`Homebrew` 是一个包管理器，用于在 Mac 上安装一些 OS X 没有的 UNIX 工具（比如著名的 `wget`）。`Homebrew` 将这些工具统统安装到了 `/usr/local/Cellar` 目录中，并在 `/usr/local/bin` 中创建符号链接。

## 安装
进入官网获取下载命令，官网地址：https://brew.sh/index_zh-cn

![1](1.png)

图中命令即为：
```shell
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

`Homebrew` 安装成功后，会自动创建目录 `/usr/local/Cellar` 来存放 `Homebrew` 安装的程序。 这时你在命令行状态下面就可以使用 `brew` 命令了。

## 设置国内镜像

**替换 `brew.git` 仓库地址**
```shell
# 阿里巴巴的 brew.git 仓库地址:
cd "$(brew --repo)"
git remote set-url origin https://mirrors.aliyun.com/homebrew/brew.git

# 中国科学技术大学的 brew.git 仓库地址
cd "$(brew --repo)"
git remote set-url origin 
```

**替换 `homebrew-core.git` 仓库地址**
```shell
# 替换成阿里巴巴的 homebrew-core.git 仓库地址:
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.aliyun.com/homebrew/homebrew-core.git

# 替换中国科学技术大学的 homebrew-core.git 仓库地址:
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git
```

**替换 `homebrew-cask.git` 仓库地址**
```shell
# 中国科学技术大学的 homebrew-cask 仓库地址：
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-cask"
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-cask.git
```

**替换 `homebrew-bottles` 访问地址**
```shell
# 替换阿里巴巴的 homebrew-bottles 访问 URL:
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.aliyun.com/homebrew/homebrew-bottles' >> ~/.bash_profile

# 替换中国科学技术大学的 homebrew-bottles 访问 URL:
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles' >> ~/.bash_profile

source ~/.bash_profile
```

## 还原官方镜像

**还原为官方提供的 `brew.git` 仓库地址**
```shell
cd "$(brew --repo)"
git remote set-url origin https://github.com/Homebrew/brew.git
```

**还原为官方提供的 `homebrew-core.git` 仓库地址**
```shell
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://github.com/Homebrew/homebrew-core.git
```

**还原为官方提供的 `homebrew-cask.git` 仓库地址**
```shell
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-cask"
git remote set-url origin https://github.com/Homebrew/homebrew-cask.git
```

**还原为官方提供的 `homebrew-bottles` 访问地址**
```shell
vi ~/.bash_profile
```

然后，删除 `HOMEBREW_BOTTLE_DOMAIN` 这一行配置
```
source ~/.bash_profile
```



## 简单使用
- 安装软件：`brew install 软件名`，例：
```
brew install wget
```

- 搜索软件：`brew search 软件名`，例：
```
brew search wget
```

- 卸载软件：`brew uninstall 软件名`，例：
```
brew uninstall wget
```

- 更新所有软件：`brew update`

- 更新具体软件：`brew upgrade 软件名` ，例：
```
brew upgrade git
```

- 显示已安装软件：`brew list`

- 查看软件信息：`brew info／home 软件名` ，例：
```
brew info git ／ brew home git
```
PS：`brew home`：指令是用浏览器打开官方网页查看软件信息

- 查看哪些已安装的程序需要更新： `brew outdated`

- 显示包依赖：`brew deps *`

- 显示帮助：`brew help`


## 卸载
官方脚本

```shell
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"  
```






