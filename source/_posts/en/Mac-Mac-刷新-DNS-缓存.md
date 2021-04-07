---
title: '[Mac] Mac 刷新 DNS 缓存'
catalog: true
date: 2020-11-07 13:58:19
subtitle: Reset the DNS cache in OS X...
header-img: /img/mac/mac_bg.jpg
tags:
- Mac
categories:
- Mac
---

根据 Mac OS X 操作系统的版本选择以下命令：

## Mac OS X 12 (Sierra) and later
```
sudo killall -HUP mDNSResponder
sudo killall mDNSResponderHelper
sudo dscacheutil -flushcache
```

## Mac OS X 11 (El Capitan) and OS X 12 (Sierra)
```
sudo killall -HUP mDNSResponder
```

## Mac OS X 10.10 (Yosemite), Versions 10.10.4+
```
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```