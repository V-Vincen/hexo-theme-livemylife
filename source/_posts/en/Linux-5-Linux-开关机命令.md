---
title: '[Linux] 5 Linux 开关机命令'
catalog: true
date: 2019-07-14 02:34:01
subtitle: Linux 开关机命令
header-img: /img/linux/linux_bg.jpg
tags:
- Linux
categories:
- Linux
---

## shutdown 命令
- shutdown 命令可以用来进行关机程序，并且在关机以前传送讯息给所有使用者正在执行的程序
- shutdown 也可以用来重开机。

| 命令     | 语法                                            | 参数       | 参数说明                                                     |
| -------- | ----------------------------------------------- | ---------- | ------------------------------------------------------------ |
| shutdown | shutdown [-t seconds] [-rkhncfF] time [message] |            |                                                              |
|          |                                                 | -t seconds | 设定在几秒钟之后进行关机程序                                 |
|          |                                                 | -k         | 并不会真的关机，只是将警告讯息传送给所有只用者               |
|          |                                                 | -r         | 关机后重新开机（重启）                                       |
|          |                                                 | -h         | 关机后停机                                                   |
|          |                                                 | -n         | 不采用正常程序来关机，用强迫的方式杀掉所有执行中的程序后自行关机 |
|          |                                                 | -c         | 取消目前已经进行中的关机动作                                 |
|          |                                                 | -f         | 关机时，不做 fcsk 动作(检查 Linux 档系统)                    |
|          |                                                 | -F         | 关机时，强迫进行 fsck 动作                                   |
|          |                                                 | time       | 设定关机的时间                                               |
|          |                                                 | message    | 传送给所有使用者的警告讯息                                   |

## 重启
- reboot
- shutdown -r now

## 关机
- shutdown -h now