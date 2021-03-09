---
title: '[Linux] 7 Linux 编辑器'
catalog: true
date: 2019-07-14 02:44:56
subtitle: Linux 编辑器
header-img: /img/linux/linux_bg.jpg
tags:
- Linux
categories:
- Linux
---

## vim
### 运行模式
- **编辑模式**：等待编辑命令输入
- **插入模式**：编辑模式下，输入 `i` 进入插入模式，插入文本信息
- **命令模式**：在编辑模式下，输入 `:` 进行命令模式

### 命令
- `:q`：直接退出vi
- `:wq`：保存后退出vi ，并可以新建文件
- `:q!`：强制退出
- `:w file`：将当前内容保存成某个文件
- `:set number`：在编辑文件显示行号
- `:set nonumber`：在编辑文件不显示行号

## nano
nano 是一个字符终端的文本编辑器，有点像 DOS 下的 editor 程序。它比 vi/vim 要简单得多，比较适合 Linux 初学者使用。某些 Linux 发行版的默认编辑器就是 nano。

### 命令
- 保存：ctrl + o
- 搜索：ctrl + w
- 上一页：ctrl + y
- 下一页：ctrl + v
- 退出：ctrl + x