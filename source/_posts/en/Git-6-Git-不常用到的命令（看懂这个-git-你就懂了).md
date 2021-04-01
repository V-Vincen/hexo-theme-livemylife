---
title: '[Git] 6 Git 不常用到的命令（看懂这个 git 你就懂了)'
catalog: true
date: 2020-02-27 10:33:36
subtitle: 看懂这个 git 你就懂了
header-img: /img/git/git_bg.png
tags:
- Git
categories:
- Git
---

先来上张 git 命令总结图（记住它 git 命令不是事）：

![1.jpg](1.jpg)

## 回顾 git 分区和工作流
Git 的区域分为 **工作区、暂存区、本地仓库区**。

**`工作区（work Tree）`**：当前的工作区域。

**`暂存区（Stage or Index）`**：暂存区域，和 `git stash` 命令暂存的地方不一样。使用 `git add xx`，就可以将 xx 添加近 Stage 里面。

**`本地仓库（Repository）`**：我们在为项目添加本地库之后，会在工作区生成一个隐藏目录 `.git`，此目录即为当前工作区的本地版本库。同时提交的历史，使用 `git commit` 提交后的结果也在这里。

![2.png](2.png)

**以下简单敘述一下把文件存入 `Repository` 流程：**

刚开始 `working tree 、 index 与 repository（HEAD）`里面的內容都是一致的；

![3.png](3.png)


当 git 管理的文件夹里面的内容出现改变后，此時 `working tree` 的內容就会跟 `index` 及 `repository（HEAD）` 的不一致，而 git 知道是哪些文件 `（Tracked File）`被改动过，直接将文件状态设置为 `modified （Unstaged files）`。

![4.png](4.png)

当我们执行 `git add` 后，会将这些改变的文件內容加入 `index` 中 `（Staged files）`，所以此时 `working tree` 跟 `index` 的內容是一致的，但他们与 `repository（HEAD）` 內容不一致。

![5.png](5.png)

接着执行 `git commit` 後，將 git 索引中所有改变的文件內容提交至 `repository` 中，建立出新的 `commit` 节点 `HEAD` 后， `working tree`、`index` 与 `repository（HEAD）` 区域的内容 又会保持一致。

![6.png](6.png)

## `git reset` 三种模式

### `git reset --hard HEAD^`
**`reset --hard`**：**会在重置 HEAD 和 branch1 的同时，重置 stage 区 和工作目录里的内容。** 当你在 `reset` 后面加了 `--hard` 参数时，你的 stage 区和工作目录里的内容会被完全重置为和 `HEAD` 的新位置相同的内容。换句话说，就是你的没有 `commit` 的修改会被全部擦掉。

例：在上次 `commit` 之后又对文件做了一些改动：修改后的 ganmes.txt 文件 `add` 到 stage 区，修改后的 shopping list.txt 保留在工作目录，执行 `git reset --hard HEAD` 后，`HEAD` 和当前 branch 切到最近的一次（当前） `commit` 的同时，你工作目录里的新改动和已经 `add` 到 stage 区的新改动也一起全都消失了。

![7.png](7.png)

![8.png](8.png)

**注**：执行 `git reset --hard HEAD^`，回退到上一次的  `commit`。（可输入 `git log` 或者 `git log --oneline` 进行版本查询）


### `git reset --soft HEAD^`
**`reset --soft`**：**会在重置 HEAD 和 branch 时，保留工作目录和暂存区中的内容，并把重置 HEAD 所带来的新的差异放进暂存区。**

例：修改后的 ganmes.txt 文件 `add` 到 stage 区，修改后的 shopping list.txt 保留在工作目录；

![7.1.png](7.png)

假设此时当前 `commit` 的改动内容是新增了 laughters.txt 文件；

![9.png](9.png)

执行 `git reset --soft HEAD^`，HEAD 和它所指向的 branch 被移动到 HEAD^ 的同时，原先 HEAD 处 `commit` 的改动（也就是那个 laughters.txt 文件）也会被放进暂存区。

![10.png](10.png)

**注**：**`--soft` 和 `--hard` 的区别**：`--hard` 会**清空**工作目录和暂存区的改动,而 `--soft` 则会**保留**工作目录的内容，并把因为保留工作目录内容所带来的新的文件**差异放进暂存区**。


### `git reset --mixed HEAD^`
`reset --mixed（可不加，--mixed 为默认参数）`：它的行为是：**保留工作目录，并且清空暂存区。** 也就是说，工作目录的修改、暂存区的内容以及由 reset 所导致的新的文件差异，都会被放进工作目录。简而言之，就是**把所有差异都混合（mixed）放在工作目录中**。

例：情况同上，修改了 games.txt 和 shopping list.txt，并把 games.txt 放进了暂存区；

![7.2.png](7.png)

当前 `commit` 的改动内容是新增了 laughters.txt 文件；

![9.png](9.png)

执行 `git reset HEAD^ 或者 git reset --mixed HEAD^`，工作目录的内容和 `--soft` 一样会被保留。区别在于，它会把暂存区清空，并把原节点和 reset 节点的差异的文件放在工作目录。总而言之就是，**工作目录、暂存区、reset 的差异文件，都会被放进工作目录，同时当前 `commit`（最近的一次 `commit`）的内容被标记为 `Untracked files`。**

![11.png](11.png)


### `reset` 三种模式区别和使用场景：
#### 区别
`--hard`：重置位置的同时，将 working tree 工作区、 index 暂存区及 repository 都重置成目标 reset 节点的內容，所以效果看起来等同于**清空暂存区和工作区**。

`--soft`：重置位置的同时，保留 working tree 工作区和 index 暂存区的内容，只让 repository 中的内容和 reset 目标节点保持一致。因此原节点和 reset 节点之间的**差异变更集**会放入 index 暂存区中（Staged files）。所以效果看起来就是**工作区、暂存区内容不变，原节点和 reset 节点之间的差异放到暂存区中**。

`--mixed（默认）`：重置位置的同时，只保留 working tree 工作区的內容，但会将 index 暂存区 和 repository 中的內容更改和 reset 目标节点一致，因此原节点和 reset 节点之间的**差异变更集**会放入 working tree 工作区中。所以效果看起来就是**index 暂存区清空，原节点和 reset 节点之间的所有差异都会放到工作目录中**。

#### 使用场景
`--hard`：
- 放弃目前本地的所有更改，去掉所有暂存区和工作区的文件，执行 `git reset --hard HEAD` 。
- 抛弃目标节点后的所有 `commit`（觉得 `commit` 有问题）。

`--soft`：
- 合并多个 `commit` 节点，让 `commit` 演进线图清晰。
    
`--mixed（默认）`：
- 同样可以合并多个 `commit` 节点，让 `commit` 演进线图清晰。
- 移除所有 index 暂存区中的文件，执行 `git reset HEAD`，将这些文件变更为 `Untracked files`。（还原 `add` 错的文件）
- 回撤错误的 `commit` 文件。


## git 其他命令
![12.png](12.png)

### `git commit -a`
等同于连续执行 `git add` 与 `git commit`，即先把文件从工作目录复制到暂存区，然后再从暂存区复制到仓库中。


### `git checkout -- <file>`
修改了工作区，没 `add` 到暂存区，执行 `git checkout -- <file>` 命令来撤销。简单的说就是暂存区覆盖工作区（**把修改的内容还原，未暂存区回退到文件初始状态**）。

例：现在 readme.txt 里面内容是 first day.，已经 `add` 到暂存区了，修改 readme.txt，内容改成 second day.，然后执行 `git checkout -- readme.txt` 命令,你会发现 readme.txt 的内容又变成 first day.。

![13.png](13.png)


### `git checkout HEAD <file>`
`git checkout HEAD <file>` 命令是 `git checkout -- <file>` 和 `git reset HEAD` 的合成体，直接用 HEAD 覆盖工作区，暂存区。（**暂存区回退到文件初始状态**）

例：工作区、暂存区以及 HEAD 中文件内容都是 first day.，修改 readme.txt 内容为 second day.，`add .` 到暂存区，执行 `git checkout HEAD readme.txt` 命令，再查看 readme.txt 内容的时候你会发现变成了 first day.。
    
![14.png](14.png)

### `git reset --hard commit_id`
执行完 `git reset --hard HEAD^` 后悔了，想恢复回去，可执行 `git reset --hard commit_id`。（这里的 `commit_id` 是版本号，忘记了刚才最后一个的版本号，可以通过 `git reflog` 来查看）


### `git diff`
![15.png](15.png)

- `git diff`：查看尚未暂存的文件更新了哪些部分，即当前状态下工作区和暂存区之间的差异。

- `git diff –cached`：查看已暂存文件和上次提交时的快照之间的差异，即当前状态下暂存区和分支内的差异。

- `git diff HEAD`：查看未暂存文件与最新提交文件快照的区别，即当前状态下工作区和分支内的差异。


### `git stash`
- `git stash save "save message"`: 执行存储时，添加备注方便查找，只用 `git stash` 也要可以的，但查找时不方便识别。

- `git stash list`：查看 `stash` 了哪些存储。

- `git stash pop`：恢复之前缓存的 `stash` 到工作区并删除。

- `git stash clear`：删除所有缓存的 `stash`。

例：当你的开发进行到一半，代码还不想进行提交，然后需要拉去远程代码，直接 `git pull` 会拒绝覆盖当前的修改，产生冲突。这个时候我们可以这样解决：
```
git stash       //先保存修改的代码（注：只有被 add 的才能被保存）
git pull        //再拉取
git stash pop   //恢复保存的代码
```

例：工作流被打断，需要先做紧急需求（emergency fix）。这时候：
```
git stash        //保存开发到一半的代码
edit emergency fix
git commit -a -m "Fix in a hurry"
git stash pop   //将代码追加到最新的提交之后
```

例：提交特定文件，如果对多个文件做了修改，但只想提交几个文件（或者想先暂时保存几个修改），测试其他文件的执行结果。可以通过 `git stash save --keep-index` 来进行：
```
git add --first part            //只将第一部分加入管理 the index
git stash save --keep-index     //将其余部分保存起来
edit/build/test first part
git commit -m 'First part'      //提交全部的 git 管理中的代码
git stash pop                   //继续进行存储代码的工作
```

### `git rm -r --cached .` 
在使用 git 的时候我们有时候需要忽略一些文件或者文件夹。我们一般在仓库的根目录创建 `.gitignore` 文件；在提交之前，修改 `.gitignore` 文件，添加需要忽略的文件。然后再做 `add  commit push` 等。但是有时在使用过称中，需要对 `.gitignore` 文件进行再次的修改。这时我们需要清除一下缓存 `cache`，才能是 `.gitignore` 生效。
操作如下：
```git 
git rm -r --cached .                #清除缓存
git add .                           #重新 trace file
git commit -m "update .gitignore"   #提交和注释
git push origin master              #可选，如果需要同步到 remote 上的话
```

### `git log -- <file>`
`git log` 可以让我们查看提交 `commit history`，默认会输出 `commit hash`，`author`，`date`，`commit message`。
```git
$ git log
commit 0005d1e3f54b79fe4707fbccc44b89e0fb4ce565 (HEAD -> master, origin/master, origin/HEAD)
Author: Carl Mungazi <c_mungazi@hotmail.co.uk>
Date:   Sat Jan 12 05:46:05 2019 +0000

    Fix typo (#14576)

commit f290138d329aa7aa635d88868705b23372e9f004
Author: Brian Vaughn <brian.david.vaughn@gmail.com>
Date:   Thu Jan 10 12:56:52 2019 -0800

    react-debug-tools accepts currentDispatcher ref as param (#14556)

    * react-debug-tools accepts currentDispatcher ref as param

    * ReactDebugHooks injected dispatcher ref is optional
```
简单总结 `git log` 的几个参数。

#### `--oneline`
这个命令简化 `git log` 的默认的输出，仅仅输出 `commit hash` 前7个字符串和 `commit message`。
```git 
$ git log --oneline
0005d1e3f (HEAD -> master, origin/master, origin/HEAD) Fix typo (#14576)
f290138d3 react-debug-tools accepts currentDispatcher ref as param (#14556)
b4ad8e947 rename useImperativeMethods -> useImperativeHandle (#14565)
ab03e3d65 Inject ReactCurrentDispatcher ref to DevTools (#14550)
19ef0ec11 Separate current owner and dispatcher (#14548)
```

#### `-p <file>`
`-p` 控制输出每个 `commit` 具体修改的内容，输出的形式以 `diff` 的形式给出。
```git
$ git log -p
commit 0005d1e3f54b79fe4707fbccc44b89e0fb4ce565 (HEAD -> master, origin/master, origin/HEAD)
Author: Carl Mungazi <c_mungazi@hotmail.co.uk>
Date:   Sat Jan 12 05:46:05 2019 +0000

    Fix typo (#14576)

diff --git a/packages/scheduler/src/Scheduler.js b/packages/scheduler/src/Scheduler.js
index 480ec81c4..a6e27850d 100644
--- a/packages/scheduler/src/Scheduler.js
+++ b/packages/scheduler/src/Scheduler.js
@@ -194,7 +194,7 @@ function flushWork(didTimeout) {
         firstCallbackNode !== null &&
         !(enableSchedulerDebugging && isSchedulerPaused)
       ) {
-        // TODO Wrap i nfeature flag
+        // TODO Wrap in feature flag
         // Read the current time. Flush all the callbacks that expire at or
         // earlier than that time. Then read the current time again and repeat.
         // This optimizes for as few performance.now calls as possible.

commit f290138d329aa7aa635d88868705b23372e9f004
Author: Brian Vaughn <brian.david.vaughn@gmail.com>
Date:   Thu Jan 10 12:56:52 2019 -0800

    react-debug-tools accepts currentDispatcher ref as param (#14556)

    * react-debug-tools accepts currentDispatcher ref as param

    * ReactDebugHooks injected dispatcher ref is optional

diff --git a/packages/react-debug-tools/src/ReactDebugHooks.js b/packages/react-debug-tools/src/ReactDebugHooks.js
index 9b5a3b499..b00df7e46 100644
--- a/packages/react-debug-tools/src/ReactDebugHooks.js
+++ b/packages/react-debug-tools/src/ReactDebugHooks.js
@@ -20,7 +20,7 @@ import {
   ForwardRef,
 } from 'shared/ReactWorkTags';

-const ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
+type CurrentDispatcherRef = typeof ReactSharedInternals.ReactCurrentDispatcher;
```

#### `git show`
`git show` 命令同 `git log -p` 输出类似，只不过它只显示一个 `commit` 的内容，如果不指定 `commit hash`，它默认输出 `HEAD` 指向 `commit` 的内容。
```git
$ git show
commit 0005d1e3f54b79fe4707fbccc44b89e0fb4ce565 (HEAD -> master, origin/master, origin/HEAD)
Author: Carl Mungazi <c_mungazi@hotmail.co.uk>
Date:   Sat Jan 12 05:46:05 2019 +0000

    Fix typo (#14576)

diff --git a/packages/scheduler/src/Scheduler.js b/packages/scheduler/src/Scheduler.js
index 480ec81c4..a6e27850d 100644
--- a/packages/scheduler/src/Scheduler.js
+++ b/packages/scheduler/src/Scheduler.js
@@ -194,7 +194,7 @@ function flushWork(didTimeout) {
         firstCallbackNode !== null &&
         !(enableSchedulerDebugging && isSchedulerPaused)
       ) {
-        // TODO Wrap i nfeature flag
+        // TODO Wrap in feature flag
         // Read the current time. Flush all the callbacks that expire at or
         // earlier than that time. Then read the current time again and repeat.
         // This optimizes for as few performance.now calls as possible.
```

#### `git shortlog`
```git
12645@DESKTOP-DBGLR67 MINGW64 /h/tmp/git/react (master)
$ git shortlog
243083df (1):
      Remove unnecessary comparison; (#11215)

839 (1):
      Update Japanese translation to 75fafe1

AGCB (1):
      fix spelling error: differen -> different (#14378)
```
- `git shortlog -s`：可以用来统计每个作者的 `commit` 数量
- `git shortlog -n`：可以用来对统计的量进行倒序排列


## `gitk`
`gitk` 是 `git` 提供的一个 gui 工具，可以很清晰地查看搜索提交历史及 git 相关操作。在终端 git 仓库目录下输入 `gitk` 命令即可使用。
 
 ![16](16.png)
 
 通过右键我们可以执行一些简单的操作，包括基于当前提交创建 `tag`，创建分支，`reset` 到当前提交、`revert` 当前提交等。
 
 ![17](17.gif)
 
 ![18](18.gif)
 
 如果你安装了 `git` 工具，但无法使用 `gitk` 命令，更新 `git` 版本即可。
```git
brew update
brew install git
```

### `gitk --follow <filename>`
当然我一般的用法是，当合并代码时，某些文件发生了冲突，查询该文件的提交信息：
```git 
gitk --follow [filename]
```
可以清楚的显示其相关所有信息。


## `git error Or fatal`
### `git branch --set-upstream-to=origin/remote_branch  your_branch`
新建本地者分支后，拉取远程仓库，使用 `git pull` 的时候会报这样的错：
```
There is no tracking information for the current branch.
Please specify which branch you want to merge with.
See git-pull(1) for details.

    git pull <remote> <branch>

If you wish to set tracking information for this branch you can do so with:

    git branch --set-upstream-to=<remote>/<branch> master
```

这是因为，我们新建的本地分支，并没有相关的跟踪信息，解决方法根据报错信息给的提示：
```git
git branch --set-upstream-to=origin/remote_branch  your_branch
```
其中，`origin/remote_branch` 是你本地分支对应的远程分支；`your_branch` 是你当前的本地分支。

### `git remote add origin <url>`
新建本地仓库后，推送本地仓库到远程仓库，使用 `git push` 的时候会报这样的错：
```
fatal: No configured push destination.
Either specify the URL from the command-line or configure a remote repository using

    git remote add <name> <url>

and then push using the remote name

    git push <name>
```

同样的本地仓库并没有关联到远程仓库，解决方法根据报错信息给的提示：
```git
git remote add origin <url>
```
其中 `url` 就是你远程仓库的地址，可以是 https：`git remote add origin https://github.com/V-Vincen/jsDeliver.git`，
也可以是 ssh：`git@github.com:V-Vincen/jsDeliver.git`。


### `allow-unrelated-histories`、`rebase origin master`
创建本地仓库，拉取远程仓库或推送本地仓库到远程仓库，`git pull` 或者 `git push` 的时候回报这样的错：
```
error: src refspec master does not match any
error: failed to push some refs to 'https://github.com/V-Vincen/jsDeliver.git'
```

这时候的本地仓库和远程仓库已经有关联的，但是本地仓库和远程仓库的代码不一致或者说两库之间的映射不匹配，解决方法有两种：
```git
git pull origin master --allow-unrelated-histories
```
`allow-unrelated-histories`：可以理解为，允许本地和远程之间没有相关联的历史记录。

或者
```git 
git pull --rebase origin master
```
`rebase origin master`：重新设定远程 master。


### `git merge master --allow-unrelated-histories`
两个分支合并的时候，出现了下面的这个错误：
```
fatal: refusing to merge unrelated histories
```

同上类似，因为两个分支没有取得关系，解决方法：
```git
git merge master --allow-unrelated-histories
```


参考：https://www.jianshu.com/p/c2ec5f06cf1a

参考：http://www.360doc.com/content/17/0215/15/17572791_629200351.shtml

参考：https://www.jianshu.com/p/14afc9916dcb