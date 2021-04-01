---
title: '[IDEA] IDEA 实现 Java 远程调试'
catalog: true
date: 2020-12-30 17:31:54
subtitle: Remote JVM Debug...
header-img: /img/idea/idea_bg2.png
tags: 
- IDEA
categories:
- IDEA
---

## IDEA 配置
- 添加一个运行配置（Remote JVM Debug 项）
- 打开 Remote 项配置对话框
- 远程 JVM 参数配置提示
- 远程调试的 IP 地址和端口号，IP 就是 Java 项目所在服务器 IP，端口只要不被占用就可以（注意防火墙不阻止该端口的访问）

![1](1.png)

![2](2.png)

## 远程 Java 程序配置
### Springboot 项目配置
启动命令：
```
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 -jar ******.jar
```

### Tomcat 配置
- **Linux 系统**
    在 tomcat 的 bin 目录中，在 `catalina.sh` 文件，输入： 
    
    ```
    CATALINA_OPTS="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"
    ```

- **Windows 系统**
    在 tomcat 的 bin 目录中，在 `catalina.bat` 文件，输入： 
    
    ```
    SET CATALINA_OPTS=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005
    ```
    
    tomcat 启动后会自动调用 `catalina.sh 或者 catalina.bat` 文件，进行 JVM 参数设置。

## 启动调试
点击调试按钮，控制台输出如下提示就成功了。

```
Connected to the target VM, address: 'ip:5005', transport: 'socket'
```

然后先在代码处打上断点，然后操作 Java 程序即可进入断点。
