---
title: '[Mac] Mac ifconfig 的各个端口'
catalog: true
date: 2020-02-28 18:27:16
subtitle: Mac ifconfig 的各个端口
header-img: /img/mac/mac_bg.jpg
tags:
- Mac
categories:
- Mac
---
## Mac ifconfig

```
Mac:➜  ~ ifconfig
```

```
# loopback 本机主机地址
lo0: flags=8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 16384
        options=1203<RXCSUM,TXCSUM,TXSTATUS,SW_TIMESTAMP>
        inet 127.0.0.1 netmask 0xff000000 
        inet6 ::1 prefixlen 128 
        inet6 fe80::1%lo0 prefixlen 64 scopeid 0x1 
        nd6 options=201<PERFORMNUD,DAD>
```

```
# 通用 IP-in-IP隧道(RFC2893) Software Network Interface 软件网络接口
gif0: flags=8010<POINTOPOINT,MULTICAST> mtu 1280
```

```
# 6to4连接(RFC3056) 6to4 tunnel interface 配置隧道
stf0: flags=0<> mtu 1280
```

```
# en: 以太网或802.11接口，通过一个usb转接头连接网线的接口
en5: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
        ether ac:de:48:00:11:22 
        inet6 fe80::aede:48ff:fe00:1122%en5 prefixlen 64 scopeid 0x8 
        nd6 options=201<PERFORMNUD,DAD>
        media: autoselect (100baseTX <full-duplex>)
        status: active
```

```
ap1: flags=8802<BROADCAST,SIMPLEX,MULTICAST> mtu 1500
        ether f2:18:98:36:eb:d2 
        media: autoselect
        status: inactive
```

```
# wifi 接口
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
        ether f0:18:98:36:eb:d2 
        inet6 fe80::c1a:37cc:de31:4b44%en0 prefixlen 64 secured scopeid 0xa 
        inet 192.168.0.120 netmask 0xffffff00 broadcast 192.168.0.255
        nd6 options=201<PERFORMNUD,DAD>
        media: autoselect
        status: active
```

```
# Point-to-Point 协议
p2p0: flags=8843<UP,BROADCAST,RUNNING,SIMPLEX,MULTICAST> mtu 2304
        ether 02:18:98:36:eb:d2 
        media: autoselect
        status: inactive
```

```
# airdrop peer to peer(一种mesh network)，apple airdrop设备特有
awdl0: flags=8943<UP,BROADCAST,RUNNING,PROMISC,SIMPLEX,MULTICAST> mtu 1484
        ether 7a:69:a0:76:94:bf 
        inet6 fe80::7869:a0ff:fe76:94bf%awdl0 prefixlen 64 scopeid 0xc 
        nd6 options=201<PERFORMNUD,DAD>
        media: autoselect
        status: active
```

```
# 电脑右侧的雷电接口
en4: flags=8963<UP,BROADCAST,SMART,RUNNING,PROMISC,SIMPLEX,MULTICAST> mtu 1500
        options=60<TSO4,TSO6>
        ether 86:00:88:61:4d:04 
        media: autoselect <full-duplex>
        status: inactive
```

```
# 电脑左侧的雷电接口
en1: flags=8963<UP,BROADCAST,SMART,RUNNING,PROMISC,SIMPLEX,MULTICAST> mtu 1500
        options=60<TSO4,TSO6>
        ether 86:00:88:61:4d:01 
        media: autoselect <full-duplex>
        status: inactive
```

```
# 电脑左侧的雷电接口
en2: flags=8963<UP,BROADCAST,SMART,RUNNING,PROMISC,SIMPLEX,MULTICAST> mtu 1500
        options=60<TSO4,TSO6>
        ether 86:00:88:61:4d:00 
        media: autoselect <full-duplex>
        status: inactive
```

```
# 蓝牙接口
en3: flags=8963<UP,BROADCAST,SMART,RUNNING,PROMISC,SIMPLEX,MULTICAST> mtu 1500
        options=60<TSO4,TSO6>
        ether 86:00:88:61:4d:05 
        media: autoselect <full-duplex>
        status: inactive
```

```
# 桥接
bridge0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
        options=63<RXCSUM,TXCSUM,TSO4,TSO6>
        ether 86:00:88:61:4d:01 
        Configuration:
                id 0:0:0:0:0:0 priority 0 hellotime 0 fwddelay 0
                maxage 0 holdcnt 0 proto stp maxaddr 100 timeout 1200
                root id 0:0:0:0:0:0 priority 0 ifcost 0 port 0
                ipfilter disabled flags 0x2
        member: en1 flags=3<LEARNING,DISCOVER>
                ifmaxaddr 0 port 14 priority 0 path cost 0
        member: en2 flags=3<LEARNING,DISCOVER>
                ifmaxaddr 0 port 15 priority 0 path cost 0
        member: en3 flags=3<LEARNING,DISCOVER>
                ifmaxaddr 0 port 16 priority 0 path cost 0
        member: en4 flags=3<LEARNING,DISCOVER>
                ifmaxaddr 0 port 13 priority 0 path cost 0
        nd6 options=201<PERFORMNUD,DAD>
        media: <unknown type>
        status: inactive
```

```
utun0: flags=8051<UP,POINTOPOINT,RUNNING,MULTICAST> mtu 2000
        inet6 fe80::ebd0:8b81:eaa3:2d96%utun0 prefixlen 64 scopeid 0x12 
        nd6 options=201<PERFORMNUD,DAD>
```

```
# 一个虚拟的网桥，这个网桥有很若干个端口，一个端口用于连接你的Host，一个端口用于连接你的虚拟机
vmnet1: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
        ether 00:50:56:c0:00:01 
        inet 192.168.230.1 netmask 0xffffff00 broadcast 192.168.230.255
```

```
# 虚拟机 的 NAT 方式
vmnet8: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
        ether 00:50:56:c0:00:08 
        inet 172.16.204.1 netmask 0xffffff00 broadcast 172.16.204.255
```