---
title: '[Linux] VMware 虚拟机三种网络模式详解'
catalog: true
date: 2020-10-13 16:11:58
subtitle: VMware Workstation Pro is the industry standard desktop hypervisor for running virtual machines on Linux or Windows PCs...
header-img: /img/linux/vmware_bg.jpg
tags:
- Linux
categories:
- Linux
---

## 概述
由于 Linux 目前很热门，越来越多的人在学习 Linux，但是买一台服务放家里来学习，实在是很浪费。那么如何解决这个问题？虚拟机软件是很好的选择，常用的虚拟机软件有 `VMware Workstations、Virtual Box、Parallels Desktop（for Mac）` 等。在使用虚拟机软件的时候，很多初学者都会遇到很多问题，而 VMware 的网络连接问题是大家遇到最多问题之一。在学习交流群里面，几乎每天都会有同学问到这些问题，写这篇详解也是因为群里童鞋网络出故障，然后在帮他解决的过程中，对自己的理解也做一个总结。接下来，我们就一起来探讨一下关于 VMware Workstations 网络连接的三种模式。


## VMware 三种网络模式
VMware 为我们提供了三种网络工作模式，它们分别是：`Bridged`（桥接模式）、`NAT`（网络地址转换模式）、`Host-Only`（仅主机模式）。

打开 VMware 虚拟机，我们可以在选项栏的“编辑”下的“虚拟网络编辑器”中看到 `VMnet0`（桥接模式）、`VMnet1`（仅主机模式）、`VMnet8`（NAT模式），那么这些都是有什么作用呢？作用如下：

- `VMnet0` 表示的是用于桥接模式下的虚拟交换机；
- `VMnet1` 表示的是用于仅主机模式下的虚拟交换机；
- `VMnet8` 表示的是用于 NAT 模式下的虚拟交换机；

![1](1.png)

同时，在主机上对应的有 VMware Network Adapter VMnet1 和 VMware Network Adapter VMnet8 两块虚拟网卡，它们分别作用于仅主机模式与NAT模式下。在“网络连接”中我们可以看到这两块虚拟网卡，如果将这两块卸载了，可以在 vmware 的“编辑”下的“虚拟网络编辑器”中点击“还原默认设置”，可重新将虚拟网卡还原。

![2](2.png)

小伙伴看到这里，肯定有疑问，为什么在真机上没有 VMware Network Adapter VMnet0 虚拟网卡呢？那么接下来，我们就一起来看一下这是为什么。

## `Bridged`（桥接模式）
什么是桥接模式？桥接模式就是将主机网卡与虚拟机虚拟的网卡利用虚拟网桥进行通信。在桥接的作用下，类似于把物理主机虚拟为一个交换机，所有桥接设置的虚拟机连接到这个交换机的一个接口上，物理主机也同样插在这个交换机当中，所以所有桥接下的网卡与网卡都是交换模式的，相互可以访问而不干扰。在桥接模式下，虚拟机 ip 地址需要与主机在同一个网段，如果需要联网，则网关与 DNS 需要与主机网卡一致。其网络结构如下图所示：

![3](3.png)

### 如何设置桥接模式
接下来，我们就来实际操作，如何设置桥接模式。首先，安装完系统之后，在开启系统之前，点击“编辑虚拟机设置”来设置网卡模式。

![4](4.png)

点击“网络适配器”，选择“桥接模式”，然后“确定”。

![5](5.png)

在进入系统之前，我们先确认一下主机的 ip 地址、网关、DNS 等信息。

![6](6.png)

然后，进入系统编辑网卡配置文件，命令为 `vi /etc/sysconfig/network-scripts/ifcfg-eth0`（Centos7 查看 ip 的命令，如果是 Ubuntu 20.04 则完全不一样）。

![7](7.png)

添加内容如下：

![8](8.png)

编辑完成，保存退出，然后重启虚拟机网卡（`systemctl restart network.service`），使用 ping 命令 ping 外网 ip，测试能否联网。

![9](9.png)

能 ping 通外网 ip，证明桥接模式设置成功。那主机与虚拟机之间的通信是否正常呢？我们就用远程工具来测试一下。

![10](10.png)

主机与虚拟机通信正常。这就是桥接模式的设置步骤，相信大家应该学会了如何去设置桥接模式了。桥接模式配置简单，但如果你的网络环境 ip 资源很缺少或对 ip 管理比较严格的话，那桥接模式就不太适用了。如果真是这种情况的话，我们该如何解决呢？接下来，我们就来认识 VMware 的另一种网络模式：`NAT 模式`。


## `NAT`（地址转换模式）
刚刚我们说到，如果你的网络 ip 资源紧缺，但是你又希望你的虚拟机能够联网，这时候 NAT 模式是最好的选择。NAT 模式借助虚拟 NAT 设备和虚拟 DHCP 服务器，使得虚拟机可以联网。其网络结构如下图所示：

![11](11.png)

在 NAT 模式中，主机网卡直接与虚拟 NAT 设备相连，然后虚拟 NAT 设备与虚拟 DHCP 服务器一起连接在虚拟交换机 VMnet8 上，这样就实现了虚拟机联网。那么我们会觉得很奇怪，为什么需要虚拟网卡 VMware Network Adapter VMnet8 呢？原来我们的 VMware Network Adapter VMnet8 虚拟网卡主要是为了实现主机与虚拟机之间的通信。在之后的设置步骤中，我们可以加以验证。

### 如何设置地址转换模式
首先，设置虚拟机中 NAT 模式的选项，打开 VMware，点击“编辑”下的“虚拟网络编辑器”，设置 NAT 参数及 DHCP 参数。

![12](12.png)

![13](13.png)

![14](14.png)

将虚拟机的网络连接模式修改成 NAT 模式，点击“编辑虚拟机设置”。

![15](15.png)

点击“网络适配器”，选择“NAT 模式”。

![16](16.png)

然后开机启动系统，编辑网卡配置文件，命令为 `vi /etc/sysconfig/network-scripts/ifcfg-eth0`。

![17](17.png)

具体配置如下：

![18](18.png)

编辑完成，保存退出，然后重启虚拟机网卡，动态获取 ip 地址，使用 ping 命令 ping 外网 ip，测试能否联网。

![19](19.png)

之前，我们说过 VMware Network Adapter VMnet8 虚拟网卡的作用，那我们现在就来测试一下。

![20](20.png)

![21](21.png)

如此看来，虚拟机能联通外网，确实不是通过 VMware Network Adapter VMnet8 虚拟网卡，那么为什么要有这块虚拟网卡呢？之前我们就说 VMware Network Adapter VMnet8 的作用是主机与虚拟机之间的通信，接下来，我们就用远程连接工具来测试一下。

![22](22.png)

然后，将 VMware Network Adapter VMnet8 启用之后，发现远程工具可以连接上虚拟机了。那么，这就是 NAT 模式，利用虚拟的 NAT 设备以及虚拟 DHCP 服务器来使虚拟机连接外网，而 VMware Network Adapter VMnet8 虚拟网卡是用来与虚拟机通信的。

## `Host-Only`（仅主机模式）
`Host-Only` 模式其实就是 NAT 模式去除了虚拟 NAT 设备，然后使用 VMware Network Adapter VMnet1 虚拟网卡连接 VMnet1 虚拟交换机来与虚拟机通信的，`Host-Only` 模式将虚拟机与外网隔开，使得虚拟机成为一个独立的系统，只与主机相互通讯。其网络结构如下图所示：

![23](23.png)

### 如何设置仅主机模式
通过上图，我们可以发现，如果要使得虚拟机能联网，我们可以将主机网卡共享给 VMware Network Adapter VMnet1 网卡，从而达到虚拟机联网的目的。接下来，我们就来测试一下。首先设置“虚拟网络编辑器”，可以设置 DHCP 的起始范围。

![24](24.png)

设置虚拟机为仅主机模式。

![25](25.png)

开机启动系统，然后设置网卡文件。

![26](26.png)

保存退出，然后重启网卡，利用远程工具测试能否与主机通信。
![27](27.png)

主机与虚拟机之间可以通信，现在设置虚拟机联通外网。

![28](28.png)

我们可以看到上图有一个提示，强制将VMware Network Adapter VMnet1的ip设置成192.168.137.1，那么接下来，我们就要将虚拟机的DHCP的子网和起始地址进行修改，点击“虚拟网络编辑器”

![29](29.png)

重新配置网卡，将 VMware Network Adapter VMnet1 虚拟网卡作为虚拟机的路由。

![30](30.png)

重启网卡，然后通过 远程工具测试能否联通外网以及与主机通信。

![31](31.png)

测试结果证明可以使得虚拟机连接外网。以上就是关于 VMware 三种网络模式的工作原理及配置详解。

参考：https://www.cnblogs.com/linjiaxin/p/6476480.html









