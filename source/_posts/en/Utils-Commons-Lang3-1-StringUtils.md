---
title: '[Utils - Commons Lang3] 1 StringUtils'
catalog: true
date: 2020-10-08 16:22:50
subtitle: Provides highly reusable static utility methods, chiefly concerned with adding value to the java.lang classes...
header-img: /img/header_img/categories_bg3.jpg
tags:
- Utils
---

## 概述
`org.apache.commons.lang3.StringUtils` 中方法的操作对象是 java.lang.String 类型的对象，是 JDK 提供的 String 类型操作方法的补充，并且是 null 安全的（即如果输入参数 String 为 null 则不会抛出 `NullPointerException`，而是做了相应处理，例如，如果输入为 null 则返回也是 null 等，具体可以查看源代码）。

官网地址：http://commons.apache.org/proper/commons-lang/

下载：http://commons.apache.org/proper/commons-lang/download_lang.cgi

![commons-lang3](stringutils.png)

## `maven` 依赖
```xml
<!-- https://mvnrepository.com/artifact/org.apache.commons/commons-lang3 -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.11</version>
</dependency>
```

## `StringUtils` 常量
```java
public static final String SPACE = " ";
public static final String EMPTY = "";
public static final String LF = "\n";
public static final String CR = "\r";
public static final int INDEX_NOT_FOUND = -1;
```

## `StringUtils` 常用方法
### `abbreviate`
`abbreviate`：使用省略号缩写字符串。

```
abbreviate(String str, int maxWidth)
```

例：
```
 StringUtils.abbreviate(null, *)      = null
 StringUtils.abbreviate("", 4)        = ""
 StringUtils.abbreviate("abcdefg", 6) = "abc..."
 StringUtils.abbreviate("abcdefg", 7) = "abcdefg"
 StringUtils.abbreviate("abcdefg", 8) = "abcdefg"
 StringUtils.abbreviate("abcdefg", 4) = "a..."
 StringUtils.abbreviate("abcdefg", 3) = IllegalArgumentException
```

### `compare` 和 `compareIgnoreCase`
`compare`：字符串的比较，返回：
- int = 0, if str1 is equal to str2 (or both null)
- int \< 0, if str1 is less than str2
- int \> 0, if str1 is greater than str2

`compareIgnoreCase`：字符串的比较，忽略大小写。

```java
compare(String str1, String str2)
compareIgnoreCase(String str1, String str2)
```

例：
```java
 StringUtils.compare(null, null)   = 0
 StringUtils.compare(null , "a")   < 0
 StringUtils.compare("a", null)    > 0
 StringUtils.compare("abc", "abc") = 0
 StringUtils.compare("a", "b")     < 0
 StringUtils.compare("b", "a")     > 0
 StringUtils.compare("a", "B")     > 0
 StringUtils.compare("ab", "abc")  < 0
```

### `contains`、`containsAny`、`containsIgnoreCase`、`containsNone`、`containsOnly`、`containsWhitespace`
`contains`：包含。

`containsAny`：前一个参数，包含后一个参数中的任意一个。

`containsIgnoreCase`：包含，忽略大小写。

`containsNone`：前一个参数，不包含后一个参数中的每一个。

`containsOnly`：前一个参数，仅包含后一个参数。

`containsWhitespace`：是否包含任何空字符串。

```java
contains(CharSequence seq, CharSequence searchSeq)
contains(CharSequence seq, int searchChar)
containsAny(CharSequence cs, char... searchChars)
containsAny(CharSequence cs, CharSequence... searchCharSequences)
containsAny(CharSequence cs, CharSequence searchChars)
containsIgnoreCase(CharSequence str, CharSequence searchStr)
containsNone(CharSequence cs, char... searchChars)
containsNone(CharSequence cs, String invalidChars)
containsOnly(CharSequence cs, char... valid)
containsOnly(CharSequence cs, String validChars)
containsWhitespace(CharSequence seq)
```

例：
```java
 contains(CharSequence seq, CharSequence searchSeq)
 StringUtils.contains(null, *)     = false
 StringUtils.contains(*, null)     = false
 StringUtils.contains("", "")      = true
 StringUtils.contains("abc", "")   = true
 StringUtils.contains("abc", "a")  = true
 StringUtils.contains("abc", "z")  = false
 
 contains(CharSequence seq, int searchChar)
 StringUtils.contains(null, *)    = false
 StringUtils.contains("", *)      = false
 StringUtils.contains("abc", 'a') = true
 StringUtils.contains("abc", 'z') = false
 
 containsAny(CharSequence cs, char... searchChars)
 StringUtils.containsAny(null, *)                  = false
 StringUtils.containsAny("", *)                    = false
 StringUtils.containsAny(*, null)                  = false
 StringUtils.containsAny(*, [])                    = false
 StringUtils.containsAny("zzabyycdxx", ['z', 'a']) = true
 StringUtils.containsAny("zzabyycdxx", ['b', 'y']) = true
 StringUtils.containsAny("zzabyycdxx", ['z', 'y']) = true
 StringUtils.containsAny("aba", ['z'])             = false
 
 containsAny(CharSequence cs, CharSequence... searchCharSequences)
 StringUtils.containsAny(null, *)               = false
 StringUtils.containsAny("", *)                 = false
 StringUtils.containsAny(*, null)               = false
 StringUtils.containsAny(*, "")                 = false
 StringUtils.containsAny("zzabyycdxx", "za")    = true
 StringUtils.containsAny("zzabyycdxx", "by")    = true
 StringUtils.containsAny("zzabyycdxx", "zy")    = true
 StringUtils.containsAny("zzabyycdxx", "\tx")   = true
 StringUtils.containsAny("zzabyycdxx", "$.#yF") = true
 StringUtils.containsAny("aba", "z")            = false
 
 containsAny(CharSequence cs, CharSequence searchChars)
 StringUtils.containsAny(null, *)            = false
 StringUtils.containsAny("", *)              = false
 StringUtils.containsAny(*, null)            = false
 StringUtils.containsAny(*, [])              = false
 StringUtils.containsAny("abcd", "ab", null) = true
 StringUtils.containsAny("abcd", "ab", "cd") = true
 StringUtils.containsAny("abc", "d", "abc")  = true

 containsIgnoreCase(CharSequence str, CharSequence searchStr)
 StringUtils.containsIgnoreCase(null, *) = false
 StringUtils.containsIgnoreCase(*, null) = false
 StringUtils.containsIgnoreCase("", "") = true
 StringUtils.containsIgnoreCase("abc", "") = true
 StringUtils.containsIgnoreCase("abc", "a") = true
 StringUtils.containsIgnoreCase("abc", "z") = false
 StringUtils.containsIgnoreCase("abc", "A") = true
 StringUtils.containsIgnoreCase("abc", "Z") = false

 containsNone(CharSequence cs, char... searchChars)
 StringUtils.containsNone(null, *)       = true
 StringUtils.containsNone(*, null)       = true
 StringUtils.containsNone("", *)         = true
 StringUtils.containsNone("ab", '')      = true
 StringUtils.containsNone("abab", 'xyz') = true
 StringUtils.containsNone("ab1", 'xyz')  = true
 StringUtils.containsNone("abz", 'xyz')  = false
 
 containsNone(CharSequence cs, String invalidChars)
 StringUtils.containsNone(null, *)       = true
 StringUtils.containsNone(*, null)       = true
 StringUtils.containsNone("", *)         = true
 StringUtils.containsNone("ab", "")      = true
 StringUtils.containsNone("abab", "xyz") = true
 StringUtils.containsNone("ab1", "xyz")  = true
 StringUtils.containsNone("abz", "xyz")  = false
 
 containsOnly(CharSequence cs, char... valid)
 StringUtils.containsOnly(null, *)       = false
 StringUtils.containsOnly(*, null)       = false
 StringUtils.containsOnly("", *)         = true
 StringUtils.containsOnly("ab", '')      = false
 StringUtils.containsOnly("abab", 'abc') = true
 StringUtils.containsOnly("ab1", 'abc')  = false
 StringUtils.containsOnly("abz", 'abc')  = false 
 
 containsOnly(CharSequence cs, String validChars)
 StringUtils.containsOnly(null, *)       = false
 StringUtils.containsOnly(*, null)       = false
 StringUtils.containsOnly("", *)         = true
 StringUtils.containsOnly("ab", "")      = false
 StringUtils.containsOnly("abab", "abc") = true
 StringUtils.containsOnly("ab1", "abc")  = false
 StringUtils.containsOnly("abz", "abc")  = false
```

### `deleteWhitespace`、`trim`
`deleteWhitespace`：删除空格。

`trim`：从此字符串的两端删除控制字符（char \<= 32），并通过返回 null 来处理 null。

```java
deleteWhitespace(String str)
trim(String str)
```

例：
```java
 deleteWhitespace(String str)
 StringUtils.deleteWhitespace(null)         = null
 StringUtils.deleteWhitespace("")           = ""
 StringUtils.deleteWhitespace("abc")        = "abc"
 StringUtils.deleteWhitespace("   ab  c  ") = "abc"
 
 trim(String str)
 StringUtils.trim(null)          = null
 StringUtils.trim("")            = ""
 StringUtils.trim("     ")       = ""
 StringUtils.trim("abc")         = "abc"
 StringUtils.trim("    abc    ") = "abc"
```

### `difference`
`difference`：比较两个字符串，并返回它们不同的部分。（更准确地说，从第二个 String 与第一个 String 不同的地方开始，返回其余的 String。这意味着 "abc" 和 "ab" 之间的区别是空字符串而不是 "c"。）

```java
difference(String str1, String str2)
```

例：
```java
 StringUtils.difference(null, null) = null
 StringUtils.difference("", "") = ""
 StringUtils.difference("", "abc") = "abc"
 StringUtils.difference("abc", "") = ""
 StringUtils.difference("abc", "abc") = ""
 StringUtils.difference("abc", "ab") = ""
 StringUtils.difference("ab", "abxyz") = "xyz"
 StringUtils.difference("abcde", "abxyz") = "xyz"
 StringUtils.difference("abcde", "xyz") = "xyz"
```

### `equals`、`equalsIgnoreCase`、`equalsAny`、`equalsAnyIgnoreCase`
`equals`：比较两个字符串，如果它们表示相等的字符序列，则返回 true。

`equalsIgnoreCase`：同上，忽略大小写。

`equalsAny`：将给定的字符串与需要被比较的字符串可变数组比较，如果字符串等于数组中的任何一个字符串，则返回 true。

`equalsAnyIgnoreCase`：同上，忽略大小写。

```java
equals(CharSequence cs1, CharSequence cs2)
equalsAny(CharSequence string, CharSequence... searchStrings)
equalsAnyIgnoreCase(CharSequence string, CharSequence... searchStrings)
equalsIgnoreCase(CharSequence cs1, CharSequence cs2)
```

例：
```java
 equals(CharSequence cs1, CharSequence cs2)
 StringUtils.equals(null, null)   = true
 StringUtils.equals(null, "abc")  = false
 StringUtils.equals("abc", null)  = false
 StringUtils.equals("abc", "abc") = true
 StringUtils.equals("abc", "ABC") = false
 
 equalsAny(CharSequence string, CharSequence... searchStrings)
 StringUtils.equalsAny(null, (CharSequence[]) null) = false
 StringUtils.equalsAny(null, null, null)    = true
 StringUtils.equalsAny(null, "abc", "def")  = false
 StringUtils.equalsAny("abc", null, "def")  = false
 StringUtils.equalsAny("abc", "abc", "def") = true
 StringUtils.equalsAny("abc", "ABC", "DEF") = false
 
 equalsAnyIgnoreCase(CharSequence string, CharSequence... searchStrings)
 StringUtils.equalsAnyIgnoreCase(null, (CharSequence[]) null) = false
 StringUtils.equalsAnyIgnoreCase(null, null, null)    = true
 StringUtils.equalsAnyIgnoreCase(null, "abc", "def")  = false
 StringUtils.equalsAnyIgnoreCase("abc", null, "def")  = false
 StringUtils.equalsAnyIgnoreCase("abc", "abc", "def") = true
 StringUtils.equalsAnyIgnoreCase("abc", "ABC", "DEF") = true
 
 equalsIgnoreCase(CharSequence cs1, CharSequence cs2)
 StringUtils.equalsIgnoreCase(null, null)   = true
 StringUtils.equalsIgnoreCase(null, "abc")  = false
 StringUtils.equalsIgnoreCase("abc", null)  = false
 StringUtils.equalsIgnoreCase("abc", "abc") = true
 StringUtils.equalsIgnoreCase("abc", "ABC") = true
```

### `getBytes`
`getBytes`：以 null 安全的方式调用 String.getBytes（Charset）。

```java
getBytes(String string, Charset charset)
getBytes(String string, String charset)
```

### `getCommonPrefix`
`getCommonPrefix`：比较数组中的所有字符串，并返回所有字符串共有的初始字符序列。

```java
 StringUtils.getCommonPrefix(null) = ""
 StringUtils.getCommonPrefix(new String[] {}) = ""
 StringUtils.getCommonPrefix(new String[] {"abc"}) = "abc"
 StringUtils.getCommonPrefix(new String[] {null, null}) = ""
 StringUtils.getCommonPrefix(new String[] {"", ""}) = ""
 StringUtils.getCommonPrefix(new String[] {"", null}) = ""
 StringUtils.getCommonPrefix(new String[] {"abc", null, null}) = ""
 StringUtils.getCommonPrefix(new String[] {null, null, "abc"}) = ""
 StringUtils.getCommonPrefix(new String[] {"", "abc"}) = ""
 StringUtils.getCommonPrefix(new String[] {"abc", ""}) = ""
 StringUtils.getCommonPrefix(new String[] {"abc", "abc"}) = "abc"
 StringUtils.getCommonPrefix(new String[] {"abc", "a"}) = "a"
 StringUtils.getCommonPrefix(new String[] {"ab", "abxyz"}) = "ab"
 StringUtils.getCommonPrefix(new String[] {"abcde", "abxyz"}) = "ab"
 StringUtils.getCommonPrefix(new String[] {"abcde", "xyz"}) = ""
 StringUtils.getCommonPrefix(new String[] {"xyz", "abcde"}) = ""
 StringUtils.getCommonPrefix(new String[] {"i am a machine", "i am a robot"}) = "i am a "
```

### `indexOf`、`indexOfAny`
`indexOf`：检索字符串中需要被查找的字符串，处理为 null 的情况，返回第一次出现的索引位置，没有匹配到时返回 -1。

`indexOfAny`：检索字符串中需要被查找的字符数组中的任何一个，处理为 null 的情况，返回第一次出现的索引位置，没有匹配到时返回 -1。

```java
indexOf(CharSequence seq, CharSequence searchSeq)
indexOf(CharSequence seq, CharSequence searchSeq, int startPos)
indexOf(CharSequence seq, int searchChar)
indexOf(CharSequence seq, int searchChar, int startPos)
indexOfAny(CharSequence cs, char... searchChars)
indexOfAny(CharSequence str, CharSequence... searchStrs)
indexOfAny(CharSequence cs, String searchChars)
```

例：
```java
 indexOf(CharSequence seq, CharSequence searchSeq)
 StringUtils.indexOf(null, *)          = -1
 StringUtils.indexOf(*, null)          = -1
 StringUtils.indexOf("", "")           = 0
 StringUtils.indexOf("", *)            = -1 (except when * = "")
 StringUtils.indexOf("aabaabaa", "a")  = 0
 StringUtils.indexOf("aabaabaa", "b")  = 2
 StringUtils.indexOf("aabaabaa", "ab") = 1
 StringUtils.indexOf("aabaabaa", "")   = 0

 indexOf(CharSequence seq, CharSequence searchSeq, int startPos)
 StringUtils.indexOf(null, *, *)          = -1
 StringUtils.indexOf(*, null, *)          = -1
 StringUtils.indexOf("", "", 0)           = 0
 StringUtils.indexOf("", *, 0)            = -1 (except when * = "")
 StringUtils.indexOf("aabaabaa", "a", 0)  = 0
 StringUtils.indexOf("aabaabaa", "b", 0)  = 2
 StringUtils.indexOf("aabaabaa", "ab", 0) = 1
 StringUtils.indexOf("aabaabaa", "b", 3)  = 5
 StringUtils.indexOf("aabaabaa", "b", 9)  = -1
 StringUtils.indexOf("aabaabaa", "b", -1) = 2
 StringUtils.indexOf("aabaabaa", "", 2)   = 2
 StringUtils.indexOf("abc", "", 9)        = 3
 
 indexOf(CharSequence seq, int searchChar)
 StringUtils.indexOf(null, *)         = -1
 StringUtils.indexOf("", *)           = -1
 StringUtils.indexOf("aabaabaa", 'a') = 0
 StringUtils.indexOf("aabaabaa", 'b') = 2
 
 indexOf(CharSequence seq, int searchChar, int startPos)
 StringUtils.indexOf(null, *, *)          = -1
 StringUtils.indexOf("", *, *)            = -1
 StringUtils.indexOf("aabaabaa", 'b', 0)  = 2
 StringUtils.indexOf("aabaabaa", 'b', 3)  = 5
 StringUtils.indexOf("aabaabaa", 'b', 9)  = -1
 StringUtils.indexOf("aabaabaa", 'b', -1) = 2
 
 indexOfAny(CharSequence cs, char... searchChars)
 StringUtils.indexOfAny(null, *)                  = -1
 StringUtils.indexOfAny("", *)                    = -1
 StringUtils.indexOfAny(*, null)                  = -1
 StringUtils.indexOfAny(*, [])                    = -1
 StringUtils.indexOfAny("zzabyycdxx", ['z', 'a']) = 0
 StringUtils.indexOfAny("zzabyycdxx", ['b', 'y']) = 3
 StringUtils.indexOfAny("aba", ['z'])             = -1
 
 indexOfAny(CharSequence str, CharSequence... searchStrs)
 StringUtils.indexOfAny(null, *)                      = -1
 StringUtils.indexOfAny(*, null)                      = -1
 StringUtils.indexOfAny(*, [])                        = -1
 StringUtils.indexOfAny("zzabyycdxx", ["ab", "cd"])   = 2
 StringUtils.indexOfAny("zzabyycdxx", ["cd", "ab"])   = 2
 StringUtils.indexOfAny("zzabyycdxx", ["mn", "op"])   = -1
 StringUtils.indexOfAny("zzabyycdxx", ["zab", "aby"]) = 1
 StringUtils.indexOfAny("zzabyycdxx", [""])           = 0
 StringUtils.indexOfAny("", [""])                     = 0
 StringUtils.indexOfAny("", ["a"])                    = -1
 
 indexOfAny(CharSequence cs, String searchChars)
 StringUtils.indexOfAny(null, *)            = -1
 StringUtils.indexOfAny("", *)              = -1
 StringUtils.indexOfAny(*, null)            = -1
 StringUtils.indexOfAny(*, "")              = -1
 StringUtils.indexOfAny("zzabyycdxx", "za") = 0
 StringUtils.indexOfAny("zzabyycdxx", "by") = 3
 StringUtils.indexOfAny("aba", "z")         = -1
```

### `isAllBlank`、`isAllEmpty`、`isAllLowerCase`、`isAllUpperCase`
`isAllBlank`：检查所有字符串是否为空、null 或空白。

`isAllEmpty`：检查所有字符串是否为空或 null。

`isAllLowerCase`：检查字符串是否仅包含小写字符。

`isAllUpperCase`：检查字符串是否仅包含大写字符。

```java
isAllBlank(CharSequence... css)
isAllEmpty(CharSequence... css)
isAllLowerCase(CharSequence cs)
isAllUpperCase(CharSequence cs)
```

例：
```java
 isAllBlank(CharSequence... css)
 StringUtils.isAllBlank(null)             = true
 StringUtils.isAllBlank(null, "foo")      = false
 StringUtils.isAllBlank(null, null)       = true
 StringUtils.isAllBlank("", "bar")        = false
 StringUtils.isAllBlank("bob", "")        = false
 StringUtils.isAllBlank("  bob  ", null)  = false
 StringUtils.isAllBlank(" ", "bar")       = false
 StringUtils.isAllBlank("foo", "bar")     = false
 StringUtils.isAllBlank(new String[] {})  = true
 
 isAllEmpty(CharSequence... css)
 StringUtils.isAllEmpty(null)             = true
 StringUtils.isAllEmpty(null, "")         = true
 StringUtils.isAllEmpty(new String[] {})  = true
 StringUtils.isAllEmpty(null, "foo")      = false
 StringUtils.isAllEmpty("", "bar")        = false
 StringUtils.isAllEmpty("bob", "")        = false
 StringUtils.isAllEmpty("  bob  ", null)  = false
 StringUtils.isAllEmpty(" ", "bar")       = false
 StringUtils.isAllEmpty("foo", "bar")     = false
 
 isAllLowerCase(CharSequence cs)
 StringUtils.isAllLowerCase(null)   = false
 StringUtils.isAllLowerCase("")     = false
 StringUtils.isAllLowerCase("  ")   = false
 StringUtils.isAllLowerCase("abc")  = true
 StringUtils.isAllLowerCase("abC")  = false
 StringUtils.isAllLowerCase("ab c") = false
 StringUtils.isAllLowerCase("ab1c") = false
 StringUtils.isAllLowerCase("ab/c") = false
 
 isAllUpperCase(CharSequence cs)
 StringUtils.isAllUpperCase(null)   = false
 StringUtils.isAllUpperCase("")     = false
 StringUtils.isAllUpperCase("  ")   = false
 StringUtils.isAllUpperCase("ABC")  = true
 StringUtils.isAllUpperCase("aBC")  = false
 StringUtils.isAllUpperCase("A C")  = false
 StringUtils.isAllUpperCase("A1C")  = false
 StringUtils.isAllUpperCase("A/C")  = false
```

### `isBlank`、`isEmpty`、`isNoneBlank`、`isNoneEmpty`、`isNotBlank`、`isNotEmpty`
`isBlank`：检查字符串是否为空、null 或空白。

`isEmpty`：检查字符串是否为空或 null。

`isNoneBlank`：检查所有字符串是否都不为空、null 或空白。

`isNoneEmpty`：检查所有字符串是否为空或 null。

`isNotBlank`：检查字符串是否不为空，不为 null 和空白。

`isNotEmpty`：检查字符串是否不为空并且不为 null。

```java
isBlank(CharSequence cs)
isEmpty(CharSequence cs)
isNoneBlank(CharSequence... css)
isNoneEmpty(CharSequence... css)
isNotBlank(CharSequence cs)
isNotEmpty(CharSequence cs)
```

例：
```java
 isBlank(CharSequence cs)
 StringUtils.isBlank(null)      = true
 StringUtils.isBlank("")        = true
 StringUtils.isBlank(" ")       = true
 StringUtils.isBlank("bob")     = false
 StringUtils.isBlank("  bob  ") = false

 isEmpty(CharSequence cs)
 StringUtils.isEmpty(null)      = true
 StringUtils.isEmpty("")        = true
 StringUtils.isEmpty(" ")       = false
 StringUtils.isEmpty("bob")     = false
 StringUtils.isEmpty("  bob  ") = false

 isNoneBlank(CharSequence... css)
 StringUtils.isNoneBlank((String) null)    = false
 StringUtils.isNoneBlank((String[]) null)  = true
 StringUtils.isNoneBlank(null, "foo")      = false
 StringUtils.isNoneBlank(null, null)       = false
 StringUtils.isNoneBlank("", "bar")        = false
 StringUtils.isNoneBlank("bob", "")        = false
 StringUtils.isNoneBlank("  bob  ", null)  = false
 StringUtils.isNoneBlank(" ", "bar")       = false
 StringUtils.isNoneBlank(new String[] {})  = true
 StringUtils.isNoneBlank(new String[]{""}) = false
 StringUtils.isNoneBlank("foo", "bar")     = true
 
 isNoneEmpty(CharSequence... css)
 StringUtils.isNoneEmpty((String) null)    = false
 StringUtils.isNoneEmpty((String[]) null)  = true
 StringUtils.isNoneEmpty(null, "foo")      = false
 StringUtils.isNoneEmpty("", "bar")        = false
 StringUtils.isNoneEmpty("bob", "")        = false
 StringUtils.isNoneEmpty("  bob  ", null)  = false
 StringUtils.isNoneEmpty(new String[] {})  = true
 StringUtils.isNoneEmpty(new String[]{""}) = false
 StringUtils.isNoneEmpty(" ", "bar")       = true
 StringUtils.isNoneEmpty("foo", "bar")     = true

 isNotBlank(CharSequence cs)
 StringUtils.isNotBlank(null)      = false
 StringUtils.isNotBlank("")        = false
 StringUtils.isNotBlank(" ")       = false
 StringUtils.isNotBlank("bob")     = true
 StringUtils.isNotBlank("  bob  ") = true

 isNotEmpty(CharSequence cs)
 StringUtils.isNotEmpty(null)      = false
 StringUtils.isNotEmpty("")        = false
 StringUtils.isNotEmpty(" ")       = true
 StringUtils.isNotEmpty("bob")     = true
 StringUtils.isNotEmpty("  bob  ") = true
```

### `join`

`join`：将提供的数组的元素连接到包含提供的元素列表的单个 String 中。

```java
join(byte[] array, char separator)
join(byte[] array, char separator, int startIndex, int endIndex)
join(char[] array, char separator)
join(char[] array, char separator, int startIndex, int endIndex)
join(double[] array, char separator)
join(double[] array, char separator, int startIndex, int endIndex)
join(float[] array, char separator)
join(float[] array, char separator, int startIndex, int endIndex)
join(int[] array, char separator)
join(int[] array, char separator, int startIndex, int endIndex)
join(Iterable<?> iterable, char separator)
join(Iterable<?> iterable, String separator)
join(Iterator<?> iterator, char separator)
join(Iterator<?> iterator, String separator)
join(List<?> list, char separator, int startIndex, int endIndex)
join(List<?> list, String separator, int startIndex, int endIndex)
join(long[] array, char separator)
join(long[] array, char separator, int startIndex, int endIndex)
join(Object[] array, char separator)
join(Object[] array, char separator, int startIndex, int endIndex)
join(Object[] array, String separator)
join(Object[] array, String separator, int startIndex, int endIndex)
join(short[] array, char separator)
join(short[] array, char separator, int startIndex, int endIndex)
join(T... elements)
joinWith(String separator, Object... objects)
```

例：
```java
 join(byte[] array, char separator)
 StringUtils.join(null, *)               = null
 StringUtils.join([], *)                 = ""
 StringUtils.join([null], *)             = ""
 StringUtils.join([1, 2, 3], ';')  = "1;2;3"
 StringUtils.join([1, 2, 3], null) = "123"
 
 join(List<?> list, char separator, int startIndex, int endIndex)
 StringUtils.join(null, *)               = null
 StringUtils.join([], *)                 = ""
 StringUtils.join([null], *)             = ""
 StringUtils.join(["a", "b", "c"], ';')  = "a;b;c"
 StringUtils.join(["a", "b", "c"], null) = "abc"
 StringUtils.join([null, "", "a"], ';')  = ";;a"
 
 joinWith(String separator, Object... objects)
 StringUtils.joinWith(",", {"a", "b"})        = "a,b"
 StringUtils.joinWith(",", {"a", "b",""})     = "a,b,"
 StringUtils.joinWith(",", {"a", null, "b"})  = "a,,b"
 StringUtils.joinWith(null, {"a", "b"})       = "ab"
```

### `lastIndexOf`
`lastIndexOf`：查找字符串中的最后一个索引，处理为 null 的情况。如果可能，此方法使用 String.lastIndexOf（String）。

```java
lastIndexOf(CharSequence seq, CharSequence searchSeq)
lastIndexOf(CharSequence seq, CharSequence searchSeq, int startPos)
lastIndexOf(CharSequence seq, int searchChar)
lastIndexOf(CharSequence seq, int searchChar, int startPos)
```

例：
```java
 StringUtils.lastIndexOf(null, *)          = -1
 StringUtils.lastIndexOf(*, null)          = -1
 StringUtils.lastIndexOf("", "")           = 0
 StringUtils.lastIndexOf("aabaabaa", "a")  = 7
 StringUtils.lastIndexOf("aabaabaa", "b")  = 5
 StringUtils.lastIndexOf("aabaabaa", "ab") = 4
 StringUtils.lastIndexOf("aabaabaa", "")   = 8
```

### `lowerCase`、`upperCase`
`lowerCase`：根据 String.toLowerCase（）将 String 转换为小写。

`upperCase`：根据 String.toUpperCase（）将 String 转换为大写。

```java
lowerCase(String str)
lowerCase(String str, Locale locale)
upperCase(String str)
upperCase(String str, Locale locale)
```

例：
```java
 lowerCase(String str)
 StringUtils.lowerCase(null)  = null
 StringUtils.lowerCase("")    = ""
 StringUtils.lowerCase("aBc") = "abc"
 
 lowerCase(String str, Locale locale)
 StringUtils.lowerCase(null, Locale.ENGLISH)  = null
 StringUtils.lowerCase("", Locale.ENGLISH)    = ""
 StringUtils.lowerCase("aBc", Locale.ENGLISH) = "abc"
 
 upperCase(String str)
 StringUtils.upperCase(null)  = null
 StringUtils.upperCase("")    = ""
 StringUtils.upperCase("aBc") = "ABC"
 
 upperCase(String str, Locale locale)
 StringUtils.upperCase(null, Locale.ENGLISH)  = null
 StringUtils.upperCase("", Locale.ENGLISH)    = ""
 StringUtils.upperCase("aBc", Locale.ENGLISH) = "ABC"
```

### `mid`
`mid`：从字符串的中间获取 len 个字符。

```java
mid(String str, int pos, int len)
```

例：
```java
 StringUtils.mid(null, *, *)    = null
 StringUtils.mid(*, *, -ve)     = ""
 StringUtils.mid("", 0, *)      = ""
 StringUtils.mid("abc", 0, 2)   = "ab"
 StringUtils.mid("abc", 0, 4)   = "abc"
 StringUtils.mid("abc", 2, 4)   = "c"
 StringUtils.mid("abc", 4, 2)   = ""
 StringUtils.mid("abc", -2, 2)  = "ab"
```

### `overlay`
`overlay`：用另一个字符串覆盖一个字符串的一部分。

```java
overlay(String str, String overlay, int start, int end)
```

例：
```java
 StringUtils.overlay(null, *, *, *)            = null
 StringUtils.overlay("", "abc", 0, 0)          = "abc"
 StringUtils.overlay("abcdef", null, 2, 4)     = "abef"
 StringUtils.overlay("abcdef", "", 2, 4)       = "abef"
 StringUtils.overlay("abcdef", "", 4, 2)       = "abef"
 StringUtils.overlay("abcdef", "zzzz", 2, 4)   = "abzzzzef"
 StringUtils.overlay("abcdef", "zzzz", 4, 2)   = "abzzzzef"
 StringUtils.overlay("abcdef", "zzzz", -1, 4)  = "zzzzef"
 StringUtils.overlay("abcdef", "zzzz", 2, 8)   = "abzzzz"
 StringUtils.overlay("abcdef", "zzzz", -2, -3) = "zzzzabcdef"
 StringUtils.overlay("abcdef", "zzzz", 8, 10)  = "abcdefzzzz"
```

### `remove`、`removeEnd`、`removeStart`
`remove`：从源字符串中删除所有出现的字符或子字符串。
`removeEnd`：仅当子字符串位于源字符串的末尾时才删除它，否则返回源字符串
`removeStart`：仅当子字符串位于源字符串的开头时才删除它，否则返回源字符串。

```java
remove(String str, char remove)
remove(String str, String remove)
removeIgnoreCase(String str, String remove)
removeEnd(String str, String remove)
removeEndIgnoreCase(String str, String remove)
removeStart(String str, String remove)
removeStartIgnoreCase(String str, String remove)
```

例：
```java
 remove(String str, String remove)
 StringUtils.remove(null, *)        = null
 StringUtils.remove("", *)          = ""
 StringUtils.remove(*, null)        = *
 StringUtils.remove(*, "")          = *
 StringUtils.remove("queued", "ue") = "qd"
 StringUtils.remove("queued", "zz") = "queued"
 
 removeIgnoreCase(String str, String remove)
 StringUtils.removeIgnoreCase(null, *)        = null
 StringUtils.removeIgnoreCase("", *)          = ""
 StringUtils.removeIgnoreCase(*, null)        = *
 StringUtils.removeIgnoreCase(*, "")          = *
 StringUtils.removeIgnoreCase("queued", "ue") = "qd"
 StringUtils.removeIgnoreCase("queued", "zz") = "queued"
 StringUtils.removeIgnoreCase("quEUed", "UE") = "qd"
 StringUtils.removeIgnoreCase("queued", "zZ") = "queued"
 
 removeEnd(String str, String remove)
 StringUtils.removeEnd(null, *)      = null
 StringUtils.removeEnd("", *)        = ""
 StringUtils.removeEnd(*, null)      = *
 StringUtils.removeEnd("www.domain.com", ".com.")  = "www.domain.com"
 StringUtils.removeEnd("www.domain.com", ".com")   = "www.domain"
 StringUtils.removeEnd("www.domain.com", "domain") = "www.domain.com"
 StringUtils.removeEnd("abc", "")    = "abc"
 
 removeIgnoreCase(String str, String remove)
 StringUtils.removeEndIgnoreCase(null, *)      = null
 StringUtils.removeEndIgnoreCase("", *)        = ""
 StringUtils.removeEndIgnoreCase(*, null)      = *
 StringUtils.removeEndIgnoreCase("www.domain.com", ".com.")  = "www.domain.com"
 StringUtils.removeEndIgnoreCase("www.domain.com", ".com")   = "www.domain"
 StringUtils.removeEndIgnoreCase("www.domain.com", "domain") = "www.domain.com"
 StringUtils.removeEndIgnoreCase("abc", "")    = "abc"
 StringUtils.removeEndIgnoreCase("www.domain.com", ".COM") = "www.domain")
 StringUtils.removeEndIgnoreCase("www.domain.COM", ".com") = "www.domain")
 
 removeStart(String str, String remove)
 StringUtils.removeStart(null, *)      = null
 StringUtils.removeStart("", *)        = ""
 StringUtils.removeStart(*, null)      = *
 StringUtils.removeStart("www.domain.com", "www.")   = "domain.com"
 StringUtils.removeStart("domain.com", "www.")       = "domain.com"
 StringUtils.removeStart("www.domain.com", "domain") = "www.domain.com"
 StringUtils.removeStart("abc", "")    = "abc"
 
 removeStartIgnoreCase(String str, String remove)
 StringUtils.removeStartIgnoreCase(null, *)      = null
 StringUtils.removeStartIgnoreCase("", *)        = ""
 StringUtils.removeStartIgnoreCase(*, null)      = *
 StringUtils.removeStartIgnoreCase("www.domain.com", "www.")   = "domain.com"
 StringUtils.removeStartIgnoreCase("www.domain.com", "WWW.")   = "domain.com"
 StringUtils.removeStartIgnoreCase("domain.com", "www.")       = "domain.com"
 StringUtils.removeStartIgnoreCase("www.domain.com", "domain") = "www.domain.com"
 StringUtils.removeStartIgnoreCase("abc", "")    = "abc"
```

### `replace`
`replace`：替换另一个字符串中出现的所有字符串。

`replaceChars`：将一个字符串中所有出现的字符替换为另一个。

`replaceOnce`：用一个字符串替换另一个较大字符串内的部分字符串，只替换一次。

```java
replace(String text, String searchString, String replacement)
replace(String text, String searchString, String replacement, int max)
replaceChars(String str, char searchChar, char replaceChar)
replaceChars(String str, String searchChars, String replaceChars)
replaceIgnoreCase(String text, String searchString, String replacement)
replaceIgnoreCase(String text, String searchString, String replacement, int max)
replaceOnce(String text, String searchString, String replacement)
replaceOnceIgnoreCase(String text, String searchString, String replacement)
```

例：
```java
 replace(String text, String searchString, String replacement)
 StringUtils.replace(null, *, *)        = null
 StringUtils.replace("", *, *)          = ""
 StringUtils.replace("any", null, *)    = "any"
 StringUtils.replace("any", *, null)    = "any"
 StringUtils.replace("any", "", *)      = "any"
 StringUtils.replace("aba", "a", null)  = "aba"
 StringUtils.replace("aba", "a", "")    = "b"
 StringUtils.replace("aba", "a", "z")   = "zbz"
 
 replace(String text, String searchString, String replacement, int max)
 StringUtils.replace(null, *, *, *)         = null
 StringUtils.replace("", *, *, *)           = ""
 StringUtils.replace("any", null, *, *)     = "any"
 StringUtils.replace("any", *, null, *)     = "any"
 StringUtils.replace("any", "", *, *)       = "any"
 StringUtils.replace("any", *, *, 0)        = "any"
 StringUtils.replace("abaa", "a", null, -1) = "abaa"
 StringUtils.replace("abaa", "a", "", -1)   = "b"
 StringUtils.replace("abaa", "a", "z", 0)   = "abaa"
 StringUtils.replace("abaa", "a", "z", 1)   = "zbaa"
 StringUtils.replace("abaa", "a", "z", 2)   = "zbza"
 StringUtils.replace("abaa", "a", "z", -1)  = "zbzz"
 
 replaceChars(String str, char searchChar, char replaceChar)
 StringUtils.replaceChars(null, *, *)        = null
 StringUtils.replaceChars("", *, *)          = ""
 StringUtils.replaceChars("abcba", 'b', 'y') = "aycya"
 StringUtils.replaceChars("abcba", 'z', 'y') = "abcba"
 
 replaceChars(String str, String searchChars, String replaceChars)
 StringUtils.replaceChars(null, *, *)           = null
 StringUtils.replaceChars("", *, *)             = ""
 StringUtils.replaceChars("abc", null, *)       = "abc"
 StringUtils.replaceChars("abc", "", *)         = "abc"
 StringUtils.replaceChars("abc", "b", null)     = "ac"
 StringUtils.replaceChars("abc", "b", "")       = "ac"
 StringUtils.replaceChars("abcba", "bc", "yz")  = "ayzya"
 StringUtils.replaceChars("abcba", "bc", "y")   = "ayya"
 StringUtils.replaceChars("abcba", "bc", "yzx") = "ayzya"
 
 replaceIgnoreCase(String text, String searchString, String replacement)
 StringUtils.replaceIgnoreCase(null, *, *)        = null
 StringUtils.replaceIgnoreCase("", *, *)          = ""
 StringUtils.replaceIgnoreCase("any", null, *)    = "any"
 StringUtils.replaceIgnoreCase("any", *, null)    = "any"
 StringUtils.replaceIgnoreCase("any", "", *)      = "any"
 StringUtils.replaceIgnoreCase("aba", "a", null)  = "aba"
 StringUtils.replaceIgnoreCase("abA", "A", "")    = "b"
 StringUtils.replaceIgnoreCase("aba", "A", "z")   = "zbz"
 
 replaceIgnoreCase(String text, String searchString, String replacement, int max)
 StringUtils.replaceIgnoreCase(null, *, *, *)         = null
 StringUtils.replaceIgnoreCase("", *, *, *)           = ""
 StringUtils.replaceIgnoreCase("any", null, *, *)     = "any"
 StringUtils.replaceIgnoreCase("any", *, null, *)     = "any"
 StringUtils.replaceIgnoreCase("any", "", *, *)       = "any"
 StringUtils.replaceIgnoreCase("any", *, *, 0)        = "any"
 StringUtils.replaceIgnoreCase("abaa", "a", null, -1) = "abaa"
 StringUtils.replaceIgnoreCase("abaa", "a", "", -1)   = "b"
 StringUtils.replaceIgnoreCase("abaa", "a", "z", 0)   = "abaa"
 StringUtils.replaceIgnoreCase("abaa", "A", "z", 1)   = "zbaa"
 StringUtils.replaceIgnoreCase("abAa", "a", "z", 2)   = "zbza"
 StringUtils.replaceIgnoreCase("abAa", "a", "z", -1)  = "zbzz"
 
 replaceOnce(String text, String searchString, String replacement)
 StringUtils.replaceOnce(null, *, *)        = null
 StringUtils.replaceOnce("", *, *)          = ""
 StringUtils.replaceOnce("any", null, *)    = "any"
 StringUtils.replaceOnce("any", *, null)    = "any"
 StringUtils.replaceOnce("any", "", *)      = "any"
 StringUtils.replaceOnce("aba", "a", null)  = "aba"
 StringUtils.replaceOnce("aba", "a", "")    = "ba"
 StringUtils.replaceOnce("aba", "a", "z")   = "zba"
 
 replaceOnceIgnoreCase(String text, String searchString, String replacement)
 StringUtils.replaceOnceIgnoreCase(null, *, *)        = null
 StringUtils.replaceOnceIgnoreCase("", *, *)          = ""
 StringUtils.replaceOnceIgnoreCase("any", null, *)    = "any"
 StringUtils.replaceOnceIgnoreCase("any", *, null)    = "any"
 StringUtils.replaceOnceIgnoreCase("any", "", *)      = "any"
 StringUtils.replaceOnceIgnoreCase("aba", "a", null)  = "aba"
 StringUtils.replaceOnceIgnoreCase("aba", "a", "")    = "ba"
 StringUtils.replaceOnceIgnoreCase("aba", "a", "z")   = "zba"
 StringUtils.replaceOnceIgnoreCase("FoOFoofoo", "foo", "") = "Foofoo"
```

### `reverse`
`reverse`：根据 StringBuilder.reverse（）反转字符串。

```java
reverse(String str)
```

例：
```java
 StringUtils.reverse(null)  = null
 StringUtils.reverse("")    = ""
 StringUtils.reverse("bat") = "tab"
```

### `split`
`split`：将提供的文本拆分为指定分隔符的数组。

```java
split(String str)
split(String str, char separatorChar)
split(String str, String separatorChars)
split(String str, String separatorChars, int max)
```

例：
```java
 split(String str)
 StringUtils.split(null)       = null
 StringUtils.split("")         = []
 StringUtils.split("abc def")  = ["abc", "def"]
 StringUtils.split("abc  def") = ["abc", "def"]
 StringUtils.split(" abc ")    = ["abc"]
 
 split(String str, char separatorChar)
 StringUtils.split(null, *)         = null
 StringUtils.split("", *)           = []
 StringUtils.split("a.b.c", '.')    = ["a", "b", "c"]
 StringUtils.split("a..b.c", '.')   = ["a", "b", "c"]
 StringUtils.split("a:b:c", '.')    = ["a:b:c"]
 StringUtils.split("a b c", ' ')    = ["a", "b", "c"]
 
 split(String str, String separatorChars)
 StringUtils.split(null, *)         = null
 StringUtils.split("", *)           = []
 StringUtils.split("abc def", null) = ["abc", "def"]
 StringUtils.split("abc def", " ")  = ["abc", "def"]
 StringUtils.split("abc  def", " ") = ["abc", "def"]
 StringUtils.split("ab:cd:ef", ":") = ["ab", "cd", "ef"]
 
 split(String str, String separatorChars, int max)
 StringUtils.split(null, *, *)            = null
 StringUtils.split("", *, *)              = []
 StringUtils.split("ab cd ef", null, 0)   = ["ab", "cd", "ef"]
 StringUtils.split("ab   cd ef", null, 0) = ["ab", "cd", "ef"]
 StringUtils.split("ab:cd:ef", ":", 0)    = ["ab", "cd", "ef"]
 StringUtils.split("ab:cd:ef", ":", 2)    = ["ab", "cd:ef"]
```

### `startsWith`、`startsWithAny`、`startsWithIgnoreCase`、`endsWith`、`endsWithAny`、`endsWithIgnoreCase`

`startsWith`：检查字符串是否以指定的前缀开头。

`startsWithAny`：检查字符串是否以提供的任何前缀结尾，区分大小写。

`startsWithIgnoreCase`：检查是否以指定的前缀结尾，不区分大小写。

`endsWith`：检查字符串是否以指定的后缀结尾。

`endsWithAny`：检查字符串是否以提供的任何后缀结尾，区分大小写。

`endsWithIgnoreCase`：检查是否以指定的后缀结尾，不区分大小写。

```java
startsWith(CharSequence str, CharSequence prefix)
startsWithAny(CharSequence sequence, CharSequence... searchStrings)
startsWithIgnoreCase(CharSequence str, CharSequence prefix)
endsWith(CharSequence str, CharSequence suffix)
endsWithAny(CharSequence sequence, CharSequence... searchStrings)
endsWithIgnoreCase(CharSequence str, CharSequence suffix)
```

例：
```java
 startsWith(CharSequence str, CharSequence prefix)
 StringUtils.startsWith(null, null)      = true
 StringUtils.startsWith(null, "abc")     = false
 StringUtils.startsWith("abcdef", null)  = false
 StringUtils.startsWith("abcdef", "abc") = true
 StringUtils.startsWith("ABCDEF", "abc") = false
 
 startsWithAny(CharSequence sequence, CharSequence... searchStrings)
 StringUtils.startsWithAny(null, null)      = false
 StringUtils.startsWithAny(null, new String[] {"abc"})  = false
 StringUtils.startsWithAny("abcxyz", null)     = false
 StringUtils.startsWithAny("abcxyz", new String[] {""}) = true
 StringUtils.startsWithAny("abcxyz", new String[] {"abc"}) = true
 StringUtils.startsWithAny("abcxyz", new String[] {null, "xyz", "abc"}) = true
 StringUtils.startsWithAny("abcxyz", null, "xyz", "ABCX") = false
 StringUtils.startsWithAny("ABCXYZ", null, "xyz", "abc") = false
 
 startsWithIgnoreCase(CharSequence str, CharSequence prefix)
 StringUtils.startsWithIgnoreCase(null, null)      = true
 StringUtils.startsWithIgnoreCase(null, "abc")     = false
 StringUtils.startsWithIgnoreCase("abcdef", null)  = false
 StringUtils.startsWithIgnoreCase("abcdef", "abc") = true
 StringUtils.startsWithIgnoreCase("ABCDEF", "abc") = true

 endsWith(CharSequence str, CharSequence suffix)
 StringUtils.endsWith(null, null)      = true
 StringUtils.endsWith(null, "def")     = false
 StringUtils.endsWith("abcdef", null)  = false
 StringUtils.endsWith("abcdef", "def") = true
 StringUtils.endsWith("ABCDEF", "def") = false
 StringUtils.endsWith("ABCDEF", "cde") = false
 StringUtils.endsWith("ABCDEF", "")    = true
 
 endsWithAny(CharSequence sequence, CharSequence... searchStrings)
 StringUtils.endsWithAny(null, null)      = false
 StringUtils.endsWithAny(null, new String[] {"abc"})  = false
 StringUtils.endsWithAny("abcxyz", null)     = false
 StringUtils.endsWithAny("abcxyz", new String[] {""}) = true
 StringUtils.endsWithAny("abcxyz", new String[] {"xyz"}) = true
 StringUtils.endsWithAny("abcxyz", new String[] {null, "xyz", "abc"}) = true
 StringUtils.endsWithAny("abcXYZ", "def", "XYZ") = true
 StringUtils.endsWithAny("abcXYZ", "def", "xyz") = false
 
 endsWithIgnoreCase(CharSequence str, CharSequence suffix)
 StringUtils.endsWithIgnoreCase(null, null)      = true
 StringUtils.endsWithIgnoreCase(null, "def")     = false
 StringUtils.endsWithIgnoreCase("abcdef", null)  = false
 StringUtils.endsWithIgnoreCase("abcdef", "def") = true
 StringUtils.endsWithIgnoreCase("ABCDEF", "def") = true
 StringUtils.endsWithIgnoreCase("ABCDEF", "cde") = false
```

### `strip`
`strip`：从字符串的开头和结尾去除任何字符集。

```java
strip(String str)
strip(String str, String stripChars)
```

例：
```java
 strip(String str)
 StringUtils.strip(null)     = null
 StringUtils.strip("")       = ""
 StringUtils.strip("   ")    = ""
 StringUtils.strip("abc")    = "abc"
 StringUtils.strip("  abc")  = "abc"
 StringUtils.strip("abc  ")  = "abc"
 StringUtils.strip(" abc ")  = "abc"
 StringUtils.strip(" ab c ") = "ab c"
 
 strip(String str, String stripChars)
 StringUtils.strip(null, *)          = null
 StringUtils.strip("", *)            = ""
 StringUtils.strip("abc", null)      = "abc"
 StringUtils.strip("  abc", null)    = "abc"
 StringUtils.strip("abc  ", null)    = "abc"
 StringUtils.strip(" abc ", null)    = "abc"
 StringUtils.strip("  abcyx", "xyz") = "  abc"
```

### `substring`
`substring`：从指定的字符串获取一个子字符串，避免发生异常。

`substringBefore`：在第一次出现分隔符之前获取子字符串。

`substringAfter`：在第一次出现分隔符之后获取子字符串。

```java
substring(String str, int start)
substring(String str, int start, int end)
substringBefore(String str, String separator)
substringAfter(String str, int separator)
substringAfter(String str, String separator)
```

例：
```java
 substring(String str, int start)
 StringUtils.substring(null, *)   = null
 StringUtils.substring("", *)     = ""
 StringUtils.substring("abc", 0)  = "abc"
 StringUtils.substring("abc", 2)  = "c"
 StringUtils.substring("abc", 4)  = ""
 StringUtils.substring("abc", -2) = "bc"
 StringUtils.substring("abc", -4) = "abc"
 
 substring(String str, int start, int end)
 StringUtils.substring(null, *, *)    = null
 StringUtils.substring("", * ,  *)    = "";
 StringUtils.substring("abc", 0, 2)   = "ab"
 StringUtils.substring("abc", 2, 0)   = ""
 StringUtils.substring("abc", 2, 4)   = "c"
 StringUtils.substring("abc", 4, 6)   = ""
 StringUtils.substring("abc", 2, 2)   = ""
 StringUtils.substring("abc", -2, -1) = "b"
 StringUtils.substring("abc", -4, 2)  = "ab"
 
 substringBefore(String str, String separator)
 StringUtils.substringBefore(null, *)      = null
 StringUtils.substringBefore("", *)        = ""
 StringUtils.substringBefore("abc", "a")   = ""
 StringUtils.substringBefore("abcba", "b") = "a"
 StringUtils.substringBefore("abc", "c")   = "ab"
 StringUtils.substringBefore("abc", "d")   = "abc"
 StringUtils.substringBefore("abc", "")    = ""
 StringUtils.substringBefore("abc", null)  = "abc"
 
 substringAfter(String str, int separator)
 StringUtils.substringAfter(null, *)      = null
 StringUtils.substringAfter("", *)        = ""
 StringUtils.substringAfter("abc", 'a')   = "bc"
 StringUtils.substringAfter("abcba", 'b') = "cba"
 StringUtils.substringAfter("abc", 'c')   = ""
 StringUtils.substringAfter("abc", 'd')   = ""
 StringUtils.substringAfter(" abc", 32)   = "abc"
 
 substringAfter(String str, String separator)
 StringUtils.substringAfter(null, *)      = null
 StringUtils.substringAfter("", *)        = ""
 StringUtils.substringAfter(*, null)      = ""
 StringUtils.substringAfter("abc", "a")   = "bc"
 StringUtils.substringAfter("abcba", "b") = "cba"
 StringUtils.substringAfter("abc", "c")   = ""
 StringUtils.substringAfter("abc", "d")   = ""
 StringUtils.substringAfter("abc", "")    = "abc"
```

### `truncate`
`truncate`：截断字符串。

```java
truncate(String str, int maxWidth)
truncate(String str, int offset, int maxWidth)
```

例：
```java
 truncate(String str, int maxWidth)
 StringUtils.truncate(null, 0)       = null
 StringUtils.truncate(null, 2)       = null
 StringUtils.truncate("", 4)         = ""
 StringUtils.truncate("abcdefg", 4)  = "abcd"
 StringUtils.truncate("abcdefg", 6)  = "abcdef"
 StringUtils.truncate("abcdefg", 7)  = "abcdefg"
 StringUtils.truncate("abcdefg", 8)  = "abcdefg"
 StringUtils.truncate("abcdefg", -1) = throws an IllegalArgumentException

 truncate(String str, int offset, int maxWidth)
  StringUtils.truncate(null, 0, 0) = null
 StringUtils.truncate(null, 2, 4) = null
 StringUtils.truncate("", 0, 10) = ""
 StringUtils.truncate("", 2, 10) = ""
 StringUtils.truncate("abcdefghij", 0, 3) = "abc"
 StringUtils.truncate("abcdefghij", 5, 6) = "fghij"
 StringUtils.truncate("raspberry peach", 10, 15) = "peach"
 StringUtils.truncate("abcdefghijklmno", 0, 10) = "abcdefghij"
 StringUtils.truncate("abcdefghijklmno", -1, 10) = throws an IllegalArgumentException
 StringUtils.truncate("abcdefghijklmno", Integer.MIN_VALUE, 10) = throws an IllegalArgumentException
 StringUtils.truncate("abcdefghijklmno", Integer.MIN_VALUE, Integer.MAX_VALUE) = throws an IllegalArgumentException
 StringUtils.truncate("abcdefghijklmno", 0, Integer.MAX_VALUE) = "abcdefghijklmno"
 StringUtils.truncate("abcdefghijklmno", 1, 10) = "bcdefghijk"
 StringUtils.truncate("abcdefghijklmno", 2, 10) = "cdefghijkl"
 StringUtils.truncate("abcdefghijklmno", 3, 10) = "defghijklm"
 StringUtils.truncate("abcdefghijklmno", 4, 10) = "efghijklmn"
 StringUtils.truncate("abcdefghijklmno", 5, 10) = "fghijklmno"
 StringUtils.truncate("abcdefghijklmno", 5, 5) = "fghij"
 StringUtils.truncate("abcdefghijklmno", 5, 3) = "fgh"
 StringUtils.truncate("abcdefghijklmno", 10, 3) = "klm"
 StringUtils.truncate("abcdefghijklmno", 10, Integer.MAX_VALUE) = "klmno"
 StringUtils.truncate("abcdefghijklmno", 13, 1) = "n"
 StringUtils.truncate("abcdefghijklmno", 13, Integer.MAX_VALUE) = "no"
 StringUtils.truncate("abcdefghijklmno", 14, 1) = "o"
 StringUtils.truncate("abcdefghijklmno", 14, Integer.MAX_VALUE) = "o"
 StringUtils.truncate("abcdefghijklmno", 15, 1) = ""
 StringUtils.truncate("abcdefghijklmno", 15, Integer.MAX_VALUE) = ""
 StringUtils.truncate("abcdefghijklmno", Integer.MAX_VALUE, Integer.MAX_VALUE) = ""
 StringUtils.truncate("abcdefghij", 3, -1) = throws an IllegalArgumentException
 StringUtils.truncate("abcdefghij", -2, 4) = throws an IllegalArgumentException
```

[image-1]:	stringutils.png