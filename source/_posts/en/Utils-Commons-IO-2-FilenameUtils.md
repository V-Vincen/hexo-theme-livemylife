---
title: '[Utils - Commons IO] 2 FilenameUtils'
catalog: true
date: 2020-09-08 00:55:56
subtitle: This package defines utility classes for working with streams, readers, writers and files...
header-img: /img/header_img/categories_bg3.jpg
tags:
- Utils
---

## 概述
这是一个 Java 操作文件的常用库，是 Apache 对 Java 的 IO 包的封装，这里面有两个非常核心的类 `FileUtils` 和 `FilenameUtils`，其中 `FileUtils` 是文件封装；`FilenameUtils` 是对文件名操作的封装。开发中对文件的操作，几乎都可以在这个框架里面找到，非常的好用。上一章节已经总结过了 `FileUtils`，今天我就来总结下 `FilenameUtils`。

官网地址：http://commons.apache.org/proper/commons-io/

下载：http://commons.apache.org/proper/commons-io/download_io.cgi


## `maven` 依赖
```xml
<!-- https://mvnrepository.com/artifact/commons-io/commons-io -->
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.7</version>
</dependency>
```

## 常用方法
- `normalizeNoEndSeparator(String fileName)`：此方法将路径规范化为标准格式。
- `concat(String basePath, String fullFileNameToAdd)`：合并目录和文件名为文件全路径。
- `getBaseName(String fileName)`：文件路径去除目录和后缀后的文件名。
- `getExtension(String fileName)`：获取文件的后缀。
- `getFullPath(String fileName)`：获取文件的完整目录。
- `getFullPathNoEndSeparator(String fileName)`：获取文件的完整目录不包含结束符。
- `getName(String fileName)`：获取文件完整的名称，包含后缀。
- `getPath(String fileName)`：获取文件的路径，去除前缀的路径。
- `getPathNoEndSeparator(String fileName)`：获取文件的路径，去除前缀和结尾的分隔符。
- `getPrefix(String fileName)`：获取路径前缀。
- `getPrefixLength(String fileName)`：获取前缀长度。
- `indexOfExtension(String fileName)`：获取最后一个 `.` 的位置。
- `indexOfLastSeparator(String fileName)`：获取最后一个 `/` 的位置。
- `normalize(String fileName)`：获取当前系统格式化路径。
- `normalizeNoEndSeparator(String fileName)`：获取当前系统无结尾分隔符的路径。
- `removeExtension(String fileName)`：移除文件的扩展名。 
- `separatorsToSystem(String path)`：转换分隔符为当前系统分隔符。
- `separatorsToUnix(String path)`：转换分隔符为 linux 系统分隔符。
- `separatorsToWindows(String path)`：转换分隔符为 windows 系统分隔符。
- `directoryContains(String canonicalParent, String canonicalChild)`：判断目录下是否包含指定文件或目录。
- `equals(String fileName1, String fileName2)`：判断文件路径是否相同。
- `equals(String fileName1, String fileName2, boolean normalized, IOCase caseSensitivity)`：判断文件路径是否相同，格式化并大小写是否敏感。
- `equalsNormalized(String fileName1, String fileName2)`：判断文件路径是否相同，标准化比较。
- `equalsOnSystem(String fileName1, String fileName2)`：判断文件路径是否相同，不格式化，大小写敏感根据系统规则 windows -> 敏感；linux -> 不敏感。
- `isExtension(String fileName, Collection<String> extensions)`：判断文件扩展名是否包含在指定集合中。
- `isExtension(String fileName, String extension)`：判断文件扩展名是否等于指定扩展名。
- `isExtension(String fileName, String... extensions)`：判断文件扩展名是否包含在指定字符串数组中。
- `wildcardMatch(String fileName, String wildcardMatcher)`：判断文件扩展名是否和指定规则匹配，大小写敏感。 
- `wildcardMatch(String fileName, String wildcardMatcher, IOCase caseSensitivity)`：判断文件扩展名是否和指定规则匹配，大小是否敏感。
- `wildcardMatchOnSystem(String fileName, String wildcardMatcher)`：判断文件扩展名是否和指定规则匹配，根据系统判断敏感型：windows -> 不敏感；linux -> 敏感。

例：
```java
    @Test
    public void t() throws IOException {
        String fileDirectory = "/Users/vincent/IDEA_Project/my_project/IO/filenameutils";
        String fileName = "abc.txt";
        String fileFullName = fileDirectory + "/" + fileName;

        //此方法将路径规范化为标准格式
        String noEndSeparator = FilenameUtils.normalizeNoEndSeparator(fileFullName);
        System.out.println("(1)" + noEndSeparator);

        //合并目录和文件名为文件全路径
        String concat = FilenameUtils.concat(fileDirectory, fileFullName);
        System.out.println("(2)" + concat);

        //文件路径去除目录和后缀后的文件名
        String baseName = FilenameUtils.getBaseName(fileFullName);
        System.out.println("(3)" + baseName);

        //获取文件的后缀
        String extension = FilenameUtils.getExtension(fileFullName);
        System.out.println("(4)" + extension);

        //获取文件的完整目录
        String fullPath = FilenameUtils.getFullPath(fileFullName);
        System.out.println("(5)" + fullPath);

        //获取文件的完整目录不包含结束符
        String fullPathNoEndSeparator = FilenameUtils.getFullPathNoEndSeparator(fileFullName);
        System.out.println("(6)" + fullPathNoEndSeparator);

        //获取文件完整的名称，包含后缀
        String name = FilenameUtils.getName(fileFullName);
        System.out.println("(7)" + name);

        //获取文件的路径，去除前缀的路径
        String path = FilenameUtils.getPath(fileFullName);
        System.out.println("(8)" + path);

        //获取文件的路径，去除前缀和结尾的分隔符
        String pathNoEndSeparator = FilenameUtils.getPathNoEndSeparator(fileFullName);
        System.out.println("(9)" + pathNoEndSeparator);

        //获取路径前缀
        String prefix = FilenameUtils.getPrefix(fileFullName);
        System.out.println("(10)" + prefix);

        //获取前缀长度
        int prefixLength = FilenameUtils.getPrefixLength(fileFullName);
        System.out.println("(11)" + prefixLength);

        //获取最后一个 '.' 的位置
        int indexOfExtension = FilenameUtils.indexOfExtension(fileFullName);
        System.out.println("(12)" + indexOfExtension);

        //获取最后一个 '/' 的位置
        int indexOfLastSeparator = FilenameUtils.indexOfLastSeparator(fileFullName);
        System.out.println("(13)" + indexOfLastSeparator);

        //获取当前系统格式化路径
        String normalize = FilenameUtils.normalize(fileFullName);
        System.out.println("(14)" + normalize);

        //获取当前系统无结尾分隔符的路径
        String normalizeNoEndSeparator = FilenameUtils.normalizeNoEndSeparator(fileDirectory);
        System.out.println("(15)" + normalizeNoEndSeparator);

        //移除文件的扩展名
        String removeExtension = FilenameUtils.removeExtension(fileFullName);
        System.out.println("(16)" + removeExtension);

        //转换分隔符为当前系统分隔符
        String separatorsToSystem = FilenameUtils.separatorsToSystem(fileFullName);
        System.out.println("(17)" + separatorsToSystem);

        //转换分隔符为linux系统分隔符
        String separatorsToUnix = FilenameUtils.separatorsToUnix(fileFullName);
        System.out.println("(18)" + separatorsToUnix);

        //转换分隔符为windows系统分隔符
        String separatorsToWindows = FilenameUtils.separatorsToWindows(fileFullName);
        System.out.println("(19)" + separatorsToWindows);

        //判断目录下是否包含指定文件或目录
        boolean directoryContains = FilenameUtils.directoryContains(fileDirectory, fileFullName);
        System.out.println("(20)" + directoryContains);

        //判断文件路径是否相同
        boolean equals = FilenameUtils.equals(fileFullName, FilenameUtils.separatorsToWindows(fileFullName));
        System.out.println("(21)" + equals);

        //判断文件路径是否相同，格式化并大小写不敏感
        boolean equals1 = FilenameUtils.equals(fileFullName, FilenameUtils.separatorsToWindows(fileFullName), true, IOCase.INSENSITIVE);
        System.out.println("(22)" + equals1);

        //判断文件路径是否相同，格式化并大小写敏感
        boolean equals2 = FilenameUtils.equals(fileFullName, FilenameUtils.separatorsToWindows(fileFullName), true, IOCase.SENSITIVE);
        System.out.println("(23)" + equals2);

        //判断文件路径是否相同，标准化比较
        boolean equalsNormalized = FilenameUtils.equalsNormalized(fileFullName, FilenameUtils.separatorsToUnix(fileFullName));
        System.out.println("(24)" + equalsNormalized);

        //判断文件路径是否相同，不格式化，大小写敏感根据系统规则：windows -> 敏感；linux -> 不敏感
        boolean equalsOnSystem = FilenameUtils.equalsOnSystem(fileFullName, FilenameUtils.normalize(fileFullName));
        System.out.println("(25)" + equalsOnSystem);

        //判断文件扩展名是否包含在指定集合中
        List<String> list = Lists.newArrayList("java", "jpg");
        boolean extension1 = FilenameUtils.isExtension(fileFullName, list);
        System.out.println("(26)" + extension1);

        //判断文件扩展名是否等于指定扩展名
        boolean extension2 = FilenameUtils.isExtension(fileFullName, "txt");
        System.out.println("(27)" + extension2);

        //判断文件扩展名是否包含在指定字符串数组中
        boolean extension3 = FilenameUtils.isExtension(fileFullName, "txt", "java");
        System.out.println("(28)" + extension3);

        //判断文件扩展名是否和指定规则匹配，大小写敏感
        boolean wildcardMatch = FilenameUtils.wildcardMatch(fileName, "*.???");
        System.out.println("(29)" + wildcardMatch);

        //判断文件扩展名是否和指定规则匹配，大小写不敏感
        boolean wildcardMatch1 = FilenameUtils.wildcardMatch(fileName, "*.???", IOCase.INSENSITIVE);
        System.out.println("(30)" + wildcardMatch1);

        //判断文件扩展名是否和指定规则匹配，根据系统判断敏感型：windows -> 不敏感；linux -> 敏感
        boolean wildcardMatchOnSystem = FilenameUtils.wildcardMatchOnSystem(fileName, "*.???");
        System.out.println("(31)" + wildcardMatchOnSystem);
    }
```

显示结果：
```
(1)/Users/vincent/IDEA_Project/my_project/IO/filenameutils/abc.txt
(2)/Users/vincent/IDEA_Project/my_project/IO/filenameutils/abc.txt
(3)abc
(4)txt
(5)/Users/vincent/IDEA_Project/my_project/IO/filenameutils/
(6)/Users/vincent/IDEA_Project/my_project/IO/filenameutils
(7)abc.txt
(8)Users/vincent/IDEA_Project/my_project/IO/filenameutils/
(9)Users/vincent/IDEA_Project/my_project/IO/filenameutils
(10)/
(11)1
(12)59
(13)55
(14)/Users/vincent/IDEA_Project/my_project/IO/filenameutils/abc.txt
(15)/Users/vincent/IDEA_Project/my_project/IO/filenameutils
(16)/Users/vincent/IDEA_Project/my_project/IO/filenameutils/abc
(17)/Users/vincent/IDEA_Project/my_project/IO/filenameutils/abc.txt
(18)/Users/vincent/IDEA_Project/my_project/IO/filenameutils/abc.txt
(19)\Users\vincent\IDEA_Project\my_project\IO\filenameutils\abc.txt
(20)true
(21)false
(22)true
(23)true
(24)true
(25)true
(26)false
(27)true
(28)true
(29)true
(30)true
(31)true
```