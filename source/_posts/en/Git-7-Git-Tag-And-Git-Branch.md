---
title: '[Git] 7 Git Tag And Git Branch'
catalog: true
date: 2020-04-28 13:47:06
subtitle: Git Tag And Git Branch
header-img: /img/git/git_bg.png
tags:
- Git
categories:
- Git
---

## `git tag`

### 查看标签
**查看本地所以标签**
```git
git tag
git tag -l
git tag --list
```

**查看远程所有标签**
```git 
git ls-remote --tags
git ls-remote --tag
```

### 给分支打标签
```git
git tag <tagname> //tagname 标签名
//例：git tag v1.1.0
```

**给特定的某个 `commit` 版本打标签，比如现在某次提交的 id 为 `039bf8b`**

```git
git tag v1.0.0 039bf8b

或者可以添加注释

git tag v1.0.0 -m "add tags information" 039bf8b

或者

git tag v1.0.0 039bf8b -m "add tags information"
```

### 删除标签
**删除本地某个标签**
```git
git tag --delete <tagname>      //例 tagname：v1.0.0
git tag -d <tagname>        
git tag --d <tagname>
```

**删除远程某个标签**
```git
git push -d origin <tagname>       //例 tagname：v1.0.0
git push --delete origin <tagname>
git push origin -d <tagname>
git push origin --delete <tagname>
git push origin :<tagname>
```

### 推送本地标签到远程
**一次性全部推送**
```git
git push origin --tags
git push origin --tag
git push --tags
git push --tag
```

**推送某个特定标签到远程**
```git
git push origin <tagname>
```

### 查看某标签的提交信息
```git
git show <tagname>
```

## `git branch`
### 查看分支
**查看全部分支**
```git
git branch -a
```

**查看本地分支**
```git
git branch
```

**查看远程分支**
```git
git branch -r
```

### 新建切换分支
**新建分支**
```git 
git branch <branchname> //branchname 分支名
//例：git branch test
```

**切换分支**
```git
git checkout <branchname>
```

**新建并切换分支**
```git 
git checkout -b <branchname>
```

### 删除分支
**删除本地分支**
```git
git branch (-d | -D) <branchname>
```

**删除远程分支**
```git
git branch -d -r <branchname>   //删除后推送
git push origin :<branchname>
```

或者
```git
git push origin --delete <branchname>
```

### 推送本地分支到远程
**推送本地分支到远程**

一般我们在本地创建完新的分支后，把本地分支推送到远程仓库：
```git
git branch <branchname>
git push origin <branchname>:<branchname>
```
注：`:` 前的 `<branchname>` 为本地创建的新分支，`:` 后的 `<branchname>` 为推送到远程仓库后所对应的分支。

**另一个推送命令**

下面这个命令意思是，推送一个**空分支**到远程分支，这也是**删除远程分支**的简便写法。
```git
git push origin :<branchname>
```

### 重命名分支
```git
git branch (-m | -M) <oldbranch> <newbranch>
```

## git 中一些选项解释
`-d  --delete`：删除

`-D  --delete --force` 的快捷键

`-f  --force`：强制

`-m  --move`：移动或重命名

`-M  --move --force`：的快捷键

`-r  --remote`：远程

`-a  --all`：所有