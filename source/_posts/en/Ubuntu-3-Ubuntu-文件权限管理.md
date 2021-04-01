---
title: '[Ubuntu] 3 Ubuntu 文件权限管理'
catalog: true
date: 2019-07-14 05:09:02
subtitle: Ubuntu 文件权限管理
header-img: /img/linux/ubuntu_bg.jpg
tags:
- Ubuntu
categories:
- Ubuntu
---

## 查看文件和目录的权限
`ls –al`：使用`ls`不带参数只显示文件名称，通过`ls –al` 可以显示文件或者目录的权限信息。

`ls -l 文件名`：显示信息包括--文件类型 (d 目录，- 普通文件，l 链接文件)，文件权限，文件的用户，文件的所属组，文件的大小，文件的创建时间，文件的名称。例：`-rw-r--r-- 1 lusifer lusifer 675 Oct 26 17:20 .profile`

- `-`：普通文件
- `rw-`：说明用户lusifer有读写权限，没有运行权限
- `r--`：表示用户组lusifer只有读权限，没有写和运行的权限
- `r--`：其他用户只有读权限，没有写权限和运行的权限

| -rw-r--r--     | 1      | lusifer      | lusifer    | 675      | Oct 26 17:20       | .profile |
| -------------- | ------ | ------------ | ---------- | -------- | ------------------ | -------- |
| 文档类型及权限 | 连接数 | 文档所属用户 | 文档所属组 | 文档大小 | 文档最后被修改日期 | 文档名称 |

| -        | rw-                    | r--                         | r--                   |
| -------- | ---------------------- | --------------------------- | --------------------- |
| 文档类型 | 文档所有者权限（user） | 文档所属用户组权限（group） | 其他用户权限（other） |

### 文档类型
d 表示目录
l 表示软连接
– 表示文件
c 表示串行端口字符设备文件
b 表示可供存储的块设备文件
余下的字符 3 个字符为一组。r 只读，w 可写，x 可执行，- 表示无此权限

### 连接数
指有多少个文件指向同一个索引节点。

### 文档所属用户和所属组
就是文档属于哪个用户和用户组。文件所属用户和组是可以更改的

### 文档大小
默认是 bytes

## 改操作权限
### chown
是change owner的意思，主要作用就是改变文件或者目录所有者，所有者包含用户和用户组。

`chown [-R] 用户名称 文件或者目录`

`chown [-R] 用户名称 用户组名称 文件或目录`

`-R`：进行递归式的权限更改，将目录下的所有文件、子目录更新为指定用户组权限

### chmod
改变访问权限

`chmod [who] [+ | - | =] [mode] 文件名`

**who**

表示操作对象可以是以下字母的一个或者组合
- u：用户 user
- g：用户组 group
- o：表示其他用户
- a：表示所有用户是系统默认的

**操作符号**
- +：表示添加某个权限
- -：表示取消某个权限
- =：赋予给定的权限，取消文档以前的所有权限

**mode**

表示可执行的权限，可以是 r、w、x

**文件名**

文件名可以使空格分开的文件列表

**示例**
```sh
    lusifer@UbuntuBase:~$ ls -al test.txt 
    -rw-rw-r-- 1 lusifer lusifer 6 Nov  2 21:47 test.txt
    lusifer@UbuntuBase:~$ chmod u=rwx,g+r,o+r test.txt 
    lusifer@UbuntuBase:~$ ls -al test.txt 
    -rwxrw-r-- 1 lusifer lusifer 6 Nov  2 21:47 test.txt
    lusifer@UbuntuBase:~$
```

## <font color=red />数字设定法</font>
### 数字设定法中数字表示的含义：
- 0 表示没有任何权限
- 1 表示有可执行权限 = `x`
- 2 表示有可写权限 = `w`
- 4 表示有可读权限 = `r`

也可以用数字来表示权限如：`chmod 755 file_name`

| r    w    x | r    –    x  | r    \-    x |
| ----------- | ------------ | ------------ |
| 4    2    1 | 4    \-    1 | 4    \-    1 |
| user        | group        | others       |

- 若要 rwx 属性则 4+2+1=7
- 若要 rw- 属性则 4+2=6
- 若要 r-x 属性则 4+1=5

**例：**
```sh
    lusifer@UbuntuBase:~$ chmod 777 test.txt 
    lusifer@UbuntuBase:~$ ls -al test.txt 
    -rwxrwxrwx 1 lusifer lusifer 6 Nov  2 21:47 test.txt
    
    lusifer@UbuntuBase:~$ chmod 770 test.txt 
    lusifer@UbuntuBase:~$ ls -al test.txt 
    -rwxrwx--- 1 lusifer lusifer 6 Nov  2 21:47 test.txt
```