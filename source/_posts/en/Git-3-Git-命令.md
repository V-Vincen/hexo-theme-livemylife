---
title: '[Git] 3 Git 命令'
catalog: true
date: 2019-08-23 00:57:28
subtitle: Git 命令
header-img: /img/git/git_bg.png
tags:
- Git
categories:
- Git
---

## 基本命令
![1](1.png)
先来看张流程图，具体命令如下：

**配置用户信息**
```git
git config --global user.name "用户名"
git config --global user.email "邮箱地址"
```

**查看配置**
```git
git config --list
```

**初始化**

```sh
git init
```

**新增提交** 
```git
git add
git commit -m 'message'
```

**回滚**

情况一：`add` 到暂存区，没有 `commit` 提交，需要移除这次提交：
```git
git reset HEAD <file>
```

情况二：需要回滚这次修改，直接把文件修改的内容删除了（相当于没有更改）
```git
git checkout -- <file>
```

**回滚版本**

文件经过多次 `commit` 提交后，需要回滚到，某一次之前的提交版本：
```git
git log (查询旧的版本号)
git reset --hard 9db8ff85870ec384cbfba3d0869990d902f5e378（版本号）
```

**直接回滚整个仓库**

直接删除不需要的文件，然后提交：
```git
git rm test.txt  
git commit -m '删除这个版本'
```

## 远程仓库
### 先配置秘钥
**创建 `ssh key`**
```git
ssh-keygen -t rsa -C "邮箱地址"
```

**打开文件复制公钥**
```git
cat ~/.ssh/id_rsa.pub
```

**连接 `github`，ssh测试**

```git
ssh -T git@github.com
```
![2](2.png)


### 链接远程仓库
**链接远程仓库**
```git
git remote add origin "github项目地址"
```

**拉取远程仓库文件**
```git
git pull origin master
```

**推送本地文件到远程仓库，并且设定为默认**
```git
git push -u origin master
```
此后推送可用直接操作
```git
git push 
```
![3](3.png)


## 标签管理
**查看所有标签**
```git
git tag
```

**创建标签**
```git
git tag 标签名
```

**指定提交标签**
```git
git tag -a 标签名 -m "备注"
```

**删除标签**
```git
git tag -d 标签名
```

**推送标签**
```git
git push origin 标签名
```

## 分支管理
**创建分支**
```git
git branch 分支名
```

**查看所有分支**
```git
git branch
```
（查询出的结果：`*` 号代表当前所在分支）

**切换分支**
```git
git checkout 分支名
```

**合并到 `master` 分支**
合并前首先切换到 `master` 分支，然后 `merge` 合并
```git
git merge 分支名
```

**删除分支**
```git
git branch -d 分支名
```
![4](4.png)

![5](5.png)

![6](6.png)

## 补充
### `git fetch` 与 `git pull` 的区别

`git pull`：拉取代码，并合并

`git fetch`：拉取代码，如果需要合并，还需要执行 `git merge`，具体过程如下：

```java
git fetch origin develop:tmp  // 拉取远程develop分支，并放到本地tmp分支上
git diff tmp  //查看当前分支和tmp分支的区别
git merge tmp   // 把tmp分支合并到当前分支
git branch -d tmp   // 删除tmp分支
```

**`git featch` 示例：**
```git
D:\jd-pro\waf_pro\csa-log-flume>git fetch origin develop:tmp
remote: Counting objects: 21, done.
Unpacking objects: 100% (21/21), done.9)
remote: Compressing objects: 100% (19/19), done.
remote: Total 21 (delta 0), reused 2 (delta 0)
From git.jd.com:jcloud-sec/csa-log-flume
 * [new branch]      develop    -> tmp
 * [new tag]         v4.0       -> v4.0
   bc1a821..319396e  develop    -> origin/develop

D:\jd-pro\waf_pro\csa-log-flume>
D:\jd-pro\waf_pro\csa-log-flume>git branch
  develog-5.2
* develop
  develop-5.2
  master
  tmp

D:\jd-pro\waf_pro\csa-log-flume>git diff tmp
diff --git a/.gitattributes b/.gitattributes
deleted file mode 100644
index aa073c8..0000000
--- a/.gitattributes
+++ /dev/null

D:\jd-pro\waf_pro\csa-log-flume>git merge tmp
Updating bc1a821..319396e
Checking out files: 100% (321/321), done.

D:\jd-pro\waf_pro\csa-log-flume\src\main\java\com\jd\sa>git branch
  develog-5.2
* develop
  develop-5.2
  master
  tmp

D:\jd-pro\waf_pro\csa-log-flume\src\main\java\com\jd\sa>git branch -d tmp
Deleted branch tmp (was 319396e).

D:\jd-pro\waf_pro\csa-log-flume\src\main\java\com\jd\sa>git branch
  develog-5.2
* develop
  develop-5.2
  master
```

## 总结
![7](7.png)