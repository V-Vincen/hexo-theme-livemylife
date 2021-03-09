---
title: '[GitLab] 2 GitLab 初始化设置和项目创建'
catalog: true
date: 2019-08-25 21:22:12
subtitle: GitLab 初始化设置和项目创建
header-img: /img/gitlab/gitlab_bg.png
tags:
- GitLab
categories:
- GitLab
---

## GitLab 的基本设置
第一次使用时需要做一些初始化设置，点击 `管理区域` --> `设置`

### 帐户和限制
关闭头像功能，由于 Gravatar 头像为网络头像，在网络情况不理想时可能导致访问时卡顿

![3](3.png)

### 注册限制
由于是内部代码托管服务器，可以直接关闭注册功能，由管理员统一创建用户即可

![4](4.png)

## GitLab 的账户管理
使用时请不要直接通过 root 用户操作，需要先创建用户，然后通过创建的用户操作，如果你是管理员还需要为其他开发人员分配账户

### 新建用户
点击 `管理区域`  --> `新建用户`

![5](5.png)

### 设置用户信息
设置初始化密码，当新建用户第一次登陆时，需要该用户重新设置新的密码，同时你可以将该用户设置为管理员

![6](6.png)


## GitLab 创建第一个项目
- 点击 `+` 号  --> `新建项目`
- 或 `创建一个项目`

![7](7.png)

输入项目名称及描述信息，设置可见等级为私有，这样别人就看不见你的项目（可初始化 `README.md` ）

![8](8.png)
![9](9.png)

### 使用 SSH 的方式拉取和推送项目
**生成 SSH KEY**
- 使用 `ssh-keygen` 工具生成，位置在 Git 安装目录下，我的是 `E:\Git\usr\bin`

![10](10.png)

- 或使用命令行生成
```git
ssh-keygen -t rsa -C "your_email@example.com"
```
执行成功后的效果：

![11](11.png)

**复制 SSH-KEY 信息到 GitLab**

秘钥位置在：`C:\Users\你的用户名\.ssh` 目录下，找到 `id_rsa.pub` 并使用编辑器打开，如：

![12](12.png)

登录 GitLab，点击 `用户头像` --> `设置` --> `SSH 密钥`

![13](13.png)

成功增加密钥后的效果

![14](14.png)

### 使用 `TortoiseGit` 克隆项目
- 新建一个存放代码仓库的本地文件夹
- 在文件夹空白处按右键
- 选择 `Git Clone...`

![15](15.png)

- 服务项目地址到 URL

![16](16.png)

- 如果弹出连接信息请选择是 

![17](17.png)

- 成功克隆项目到本地

![18](18.png)

### 使用 `TortoiseGit` 推送项目（提交代码）
- 创建或修改文件（这里的文件为所有文件，包括：代码、图片等）
- 我们以创建 `.gitignore` 过滤配置文件为例，该文件的主要作用为过滤不需要上传的文件，比如：IDE 生成的工程文件、编译后的 class 文件等
- 在工程目录下，新建 `.gitignore` 文件，并填入如下配置：
```gitignore
.gradle
*.sw?
.#*
*#
*~
/build
/code
.classpath
.project
.settings
.metadata
.factorypath
.recommenders
bin
build
target
.factorypath
.springBeans
interpolated*.xml
dependency-reduced-pom.xml
build.log
_site/
.*.md.html
manifest.yml
MANIFEST.MF
settings.xml
activemq-data
overridedb.*
*.iml
*.ipr
*.iws
.idea
.DS_Store
.factorypath
dump.rdb
transaction-logs
**/overlays/
**/logs/
**/temp/
**/classes/
```

- 右键呼出菜单，选择 `Git Commit -> "master"...`

![19](19.png)

- 填入 `Massage` 并点击 `All`，然后点击 `Commit & Push`

![20](20.png)

- 成功后的效果图

![21](21.png)

### 查看 GitLab 确认提交成功
![22](22.png)