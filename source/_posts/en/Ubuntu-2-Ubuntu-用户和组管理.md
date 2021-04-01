---
title: '[Ubuntu] 2 Ubuntu 用户和组管理'
catalog: true
date: 2019-07-14 04:56:51
subtitle: Ubuntu 用户和组管理
header-img: /img/linux/ubuntu_bg.jpg
tags:
- Ubuntu
categories:
- Ubuntu
---

## 概述
Linux 操作系统是一个多用户操作系统，它允许多用户同时登录到系统上并使用资源。系统会根据账户来区分每个用户的文件，进程，任务和工作环境，使得每个用户工作都不受干扰。

## 使用 Root 用户
在实际生产操作中，我们基本上都是使用超级管理员账户操作 Linux 系统，也就是 Root 用户，Linux 系统默认是关闭 Root 账户的，我们需要为 Root 用户设置一个初始密码以方便我们使用。

### 设置 Root 账户密码
```sh
    sudo passwd root
```

### 切换到 Root
```sh
    su
```

### 设置允许远程登录 Root
```sh
    vim /etc/ssh/sshd_config
    
    # Authentication:
    LoginGraceTime 120
    #PermitRootLogin without-password    //注释此行
    PermitRootLogin yes                  //加入此行
    StrictModes yes
```

### 重启服务
```sh
    service ssh restart
```

## 用户账户说明
### 普通用户：
普通用户在系统上的任务是进行普通操作

### 超级管理员：
管理员在系统上的任务是对普通用户和整个系统进行管理。对系统具有绝对的控制权，能够对系统进行一切操作。用 root 表示，root 用户在系统中拥有最高权限，默认下 Ubuntu 用户的 root 用户是不能登录的。

### 安装时创建的系统用户：
此用户创建时被添加到 admin 组中，在 Ubuntu 中，admin 组中的用户默认是可以使用 sudo 命令来执行只有管理员才能执行的命令的。如果不使用 sudo 就是一个普通用户。

## 组账户说明
### 私有组
当创建一个用户时没有指定属于哪个组，Linux 就会建立一个与用户同名的私有组，此私有组只含有该用户。

### 标准组
当创建一个用户时可以选定一个标准组，如果一个用户同时属于多个组时，登录后所属的组为主组，其他的为附加组。

## 账户系统文件说明
### `/etc/passwd`
每一行代表一个账号，众多账号是系统正常运行所必须的，例如 bin，nobody 每行定义一个用户账户，此文件对所有用户可读。每行账户包含如下信息：

`root:x:0:0:root:/root:/bin/bash`

- **用户名**： 就是账号，用来对应 UID，root UID 是 0。
- **口令**： 密码，早期 UNIX 系统密码存在此字段，由于此文件所有用户都可以读取，密码容易泄露，后来这个字段数据就存放到 /etc/shadow 中，这里只能看到 X。
- **用户标示号（UID）**： 系统内唯一，root 用户的 UID 为 0，普通用户从 1000 开始，1-999 是系统的标准账户，500-65536 是可登陆账号。
- **组标示号（GID）**： 与 /etc/group 相关用来规定组名和 GID 相对应。
- **注释**： 注释账号
- **宿主目录（主文件夹）**： 用户登录系统后所进入的目录 root 在 /root/itcast
- **命令解释器（shell）**： 指定该用户使用的 shell ，默认的是 /bin/bash

### `/etc/shadow`
为了增加系统的安全性，用户口令通常用 shadow passwords 保护。只有 root 可读。每行包含如下信息：

`root:$6$Reu571.V$Ci/kd.OTzaSGU.TagZ5KjYx2MLzQv2IkZ24E1.yeTT3Pp4o/yniTjus/rRaJ92Z18MVy6suf1W5uxxurqssel.:17465:0:99999:7:::`

- **账号名称**：需要和 /etc/passwd 一致。
- **密码**：经过加密，虽然加密，但不表示不会被破解，该文件默认权限如下：
    * -rw------- 1 root root 1560 Oct 26 17:20 passwd
    * 只有root能都读写
- **最近修改密码日期**：从1970-1-1起，到用户最后一次更改口令的天数
- **密码最小时间间隔**：从1970-1-1起，到用户可以更改口令的天数
- **密码最大时间间隔**：从1970-1-1起，必须更改的口令天数
- **密码到期警告时间**：在口令过期之前几天通知
- **密码到期后账号宽限时间**
- **密码到期禁用账户时间**：在用户口令过期后到禁用账户的天数
- **保留**

### `/etc/group`
用户组的配置文件

`root:x:0:`

- **用户组名称**
- **用户组密码**：给用户组管理员使用，通常不用
- **GID**： 用户组的ID
- **此用户支持的账号名称**：一个账号可以加入多个用户组，例如想要 itcast 加入 root 这个用户组，将该账号填入该字段即可 root❌0:root, icast 将用户进行分组是 Linux 对用户进行管理及控制访问权限的一种手段。一个中可以有多个用户，一个用户可以同时属于多个组。该文件对所有用户可读。

### `/etc/gshadow`
该文件用户定义用户组口令，组管理员等信息只有root用户可读。

`root:\*::`

- **用户组名**
- **密码列**
- **用户组管理员的账号**
- **用户组所属账号**

## 账户管理常用命令
### 增加用户
```sh
    useradd 用户名
    useradd -u (UID号)
    useradd -p (口令)
    useradd -g (分组)
    useradd -s (SHELL)
    useradd -d (用户目录)
```
如：`useradd lusifer`

增加用户名为 lusifer 的账户

### 修改用户
```sh
    usermod -u (新UID)
    usermod -d (用户目录)
    usermod -g (组名)
    usermod -s (SHELL)
    usermod -p (新口令)
    usermod -l (新登录名)
    usermod -L (锁定用户账号密码)
    usermod -U (解锁用户账号)
```
如：`usermod -u 1024 -g group2 -G root lusifer`

将 lusifer 用户 uid 修改为 1024，默认组改为系统中已经存在的 group2，并且加入到系统管理员组

### 删除用户
```sh
userdel 用户名 (删除用户账号)
userdel -r 删除账号时同时删除目录
```
如：`userdel -r lusifer`

删除用户名为 lusifer 的账户并同时删除 lusifer 的用户目录

### 组账户维护
```sh
    groupadd 组账户名 (创建新组)
    groupadd -g 指定组GID
    groupmod -g 更改组的GID
    groupmod -n 更改组账户名
    groupdel 组账户名 (删除指定组账户)
```

### 口令维护
```sh
    passwd 用户账户名 (设置用户口令)
    passwd -l 用户账户名 (锁定用户账户)
    passwd -u 用户账户名 (解锁用户账户)
    passwd -d 用户账户名 (删除账户口令)
    gpasswd -a 用户账户名 组账户名 (将指定用户添加到指定组)
    gpasswd -d 用户账户名 组账户名 (将用户从指定组中删除)
    gpasswd -A 用户账户名 组账户名 (将用户指定为组的管理员)
```

### 用户和组状态
```sh
    su 用户名(切换用户账户)
    id 用户名(显示用户的UID，GID)
    whoami (显示当前用户名称)
    groups (显示用户所属组)
```