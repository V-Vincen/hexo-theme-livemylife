---
title: '[Utils - Commons Lang3] 2 ArrayUtils'
catalog: true
date: 2020-10-09 16:51:17
subtitle: Operations on arrays, primitive arrays (like int[]) and primitive wrapper arrays (like Integer[])...
header-img: /img/header_img/categories_bg3.jpg
tags:
- Utils
---

## 概述
`org.apache.commons.lang3.ArrayUtils` 中的方法是对数组，原始数组（例如 int []）或者原始包装器数组（例如 Integer []）的操作。此类尝试优雅地处理 null 输入。空数组输入不会引发异常。但是，包含 null 元素的 Object 数组可能会引发异常。

官网地址：http://commons.apache.org/proper/commons-lang/

下载：http://commons.apache.org/proper/commons-lang/download_lang.cgi

## `maven` 依赖
```xml
<!-- https://mvnrepository.com/artifact/org.apache.commons/commons-lang3 -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.11</version>
</dependency>
```

## 数组的常用判断方法
- `isEmpty(final Object[] array)`：判断数组是否为空。
- `isNotEmpty(final float[] array)`：判断数组是否不为空。
- `isSameLength(final char[] array1, final char[] array2)`：判断两个数组的长度是否相同，要同类型。
- `isSameType(final Object array1, final Object array2)`：判断两个数组的类型是否相同。
- `isSorted(final int[] array)`：判断数组是否以自然顺序排序。

例：
```java
String[] arr = {"Hello","Word"};
String[] arr2 = {"34","35","36"};
int[] intarr = {12,13,14};
ArrayUtils.isEmpty(arr);             = false
ArrayUtils.isNotEmpty(arr);          = true
ArrayUtils.isSameLength(arr2,arr);   = false
ArrayUtils.isSameType(intarr,arr);   = false
ArrayUtils.isSorted(intarr);         = true
```

## 数组的基本操作
- `add(final T[] array, final T element)`：该方法向指定的数组中添加一个元素。
- `remove(final T[] array, final int index)`：移除数组红指定索引位置的元素。
- `addAll(final T[] array1, final T... array2)`：合并两个数组。
- `removeAll(final char[] array, final int... indices)`：移除数组红指定的多个索引位置的元素。
- `removeElement(final char[] array, final char element)`：从数组中删除第一次出现的指定元素。
- `removeAllOccurences(final char[] array, final char element)`：从数组中移除指定的元素。
- `removeElements(final char[] array, final char... values)`：从数组中移除指定数量的元素，返回新数组。
- `getLength(final Object array)`：获取数组的长度。
- `contains(final Object[] array, final Object objectToFind)`：判断数组中是否包含某一个元素。
- `indexOf(final Object[] array, final Object objectToFind)`：查找数组中是否存在某元素，返回索引位置。
- `lastIndexOf(final Object[] array, final Object objectToFind)`：从尾部开始查找指定元素。
- `insert(final int index, final T[] array, final T... values)`：向数组指定索引位置添加元素。

例：
```java
ArrayUtils.add(arr, "你好");
ArrayUtils.remove(arr,1);
ArrayUtils.removeAll([2, 6, 3], 0, 2)    = [6]
ArrayUtils.removeAll([2, 6, 3], 0, 1, 2) = []
ArrayUtils.removeElement(['a', 'b', 'a'], 'a') = ['b', 'a']
ArrayUtils.removeAllOccurences(arr,"Hello");
ArrayUtils.removeElements(arr,1,2,3);
ArrayUtils.addAll([], [])         = []
ArrayUtils.addAll([null], [null]) = [null, null]
ArrayUtils.addAll(arr,arr2);
ArrayUtils.getLength(arr);
ArrayUtils.contains(arr,"word");
ArrayUtils.indexOf(arr,"word");
ArrayUtils.lastIndexOf(arr, "word");
ArrayUtils.insert(0, arr, "谢谢你");
```

## 数组的转换操作
- `nullToEmpty(final String[] array)`：将 null 数组转换为对应类型的空数组。
- `toMap(final Object[] array)`：将二维数组转换为 map，一维数组转换抛出异常。
- `reverse(final char[] array)`：反转数组，不返回新数组,可以指定反转的区域。
- `subarray(final char[] array, int startIndexInclusive, int endIndexExclusive)`：数组的截取，包头不包尾。
- `swap(final char[] array, final int offset1, final int offset2)`：交换数组中指定位置的两个元素。
- `toObject(final int[] array)`：将原始数据类型的数组转换为对象类型的数组。
- `toPrimitive(final Integer[] array)`：将对象数据类型的数组转换为原始数据类型的数组
- `toStringArray(final Object[] array)`：将 Object 类型的数组转换为 String 类型的数组。

例：
```java
ArrayUtils.nullToEmpty((String[])null);
String[][] maparr = {{"name","zhangsan"},{"age","23"},{"money","6700"}};
Map<Object, Object> objectObjectMap = ArrayUtils.toMap(maparr);
String[] rearr = {"1", "2", "3", "4"}; 
ArrayUtils.reverse(rearr, 0, 3); = [3, 2, 1, 4]
String[] subarray = ArrayUtils.subarray(rearr, 1, 2);
ArrayUtils.swap([1, 2, 3], 1, 0) = [2, 1, 3]
ArrayUtils.swap([1, 2, 3], 0, 5) = [1, 2, 3]
ArrayUtils.swap([1, 2, 3], -1, 1) = [2, 1, 3]
int[] intarr = {12,11,14};
Integer[] integers = ArrayUtils.toObject(intarr);
int[] ints = ArrayUtils.toPrimitive(integers);
String[] strings = ArrayUtils.toStringArray(integers);
```

## 用法总结
例：
```java
    @Test
    public void t() {
        int[] arr = {1, 2, 3, 4, 5, 6, 7, 8, 9};
        int[] arr2 = {8, 7, 6, 5, 4, 3, 2, 1};
        int[] a = null;

        //isEmpty(final Object[] array)：判断数组是否为空；
        System.out.println("isEmpty -> ：" + ArrayUtils.isEmpty(arr));
        System.out.println("isEmpty -> ：" + ArrayUtils.isEmpty(a));

        //isNotEmpty(final float[] array)：判断数组是否不为空；
        System.out.println("isNotEmpty -> ：" + ArrayUtils.isNotEmpty(a));
        System.out.println("isNotEmpty -> ：" + ArrayUtils.isNotEmpty(arr));

        //isSameLength(final char[] array1, final char[] array2)：判断两个数组的长度是否相同，要同类型；
        System.out.println("isSameLength -> ：" + ArrayUtils.isSameLength(arr, arr2));

        //isSameType(final Object array1, final Object array2)：判断两个数组的类型是否相同；
        System.out.println("isSameType -> ：" + ArrayUtils.isSameType(arr, arr2));

        //isSorted(final int[] array)：判断数组是否以自然顺序排序；
        System.out.println("isSorted -> ：" + ArrayUtils.isSorted(arr));
        System.out.println("isSorted -> ：" + ArrayUtils.isSorted(arr2));
        System.out.println();


        int[] array = {1, 2, 3};
        //add(final T[] array, final T element)：该方法向指定的数组中添加一个元素；
        int[] add = ArrayUtils.add(array, 7);
        System.out.println("add -> ：" + ArrayUtils.toString(add));

        //addAll(final T[] array1, final T... array2)：合并两个数组；
        int[] arrayAll = {4, 5, 6};
        int[] addAll = ArrayUtils.addAll(arrayAll, 7, 8, 9);
        System.out.println("addAll -> ：" + ArrayUtils.toString(addAll));

        int[] array2 = {1, 3, 5, 7, 9, 9, 99};
        //remove(final T[] array, final int index)：移除数组红指定索引位置的元素；
        int[] remove = ArrayUtils.remove(array2, 2);
        System.out.println("remove -> ：" + ArrayUtils.toString(remove));
        //removeAll(final char[] array, final int... indices)：移除数组红指定的多个索引位置的元素；
        int[] removeAll = ArrayUtils.removeAll(array2, 0, 1, 2);
        System.out.println("removeAll -> ：" + ArrayUtils.toString(removeAll));
        //removeElement(final char[] array, final char element)：从数组中删除第一次出现的指定元素；
        int[] removeElement = ArrayUtils.removeElement(array2, 9);
        System.out.println("removeElement -> ：" + ArrayUtils.toString(removeElement));
        //removeAllOccurences(final char[] array, final char element)：从数组中移除指定的元素；
        int[] removeAllOccurences = ArrayUtils.removeAllOccurences(array2, 99);
        System.out.println("removeAllOccurences -> ：" + ArrayUtils.toString(removeAllOccurences));
        //removeElements(final char[] array, final char... values)：从数组中移除指定数量的元素，返回新数组；
        int[] removeElements = ArrayUtils.removeElements(array2, 1, 2, 3);
        System.out.println("removeAllOccurences -> ：" + ArrayUtils.toString(removeElements));

        //getLength(final Object array)：获取数组的长度；
        System.out.println("getLength -> ：" + ArrayUtils.getLength(array2));

        //contains(final Object[] array, final Object objectToFind)：判断数组中是否包含某一个元素；
        System.out.println("contains -> ：" + ArrayUtils.contains(array2, 7));
        System.out.println("contains -> ：" + ArrayUtils.contains(array2, 33));

        //indexOf(final Object[] array, final Object objectToFind)：查找数组中是否存在某元素，返回索引位置；
        System.out.println("indexOf -> ：" + ArrayUtils.indexOf(array2, 9));
        System.out.println("indexOf -> ：" + ArrayUtils.indexOf(array2, 9, 3));

        //lastIndexOf(final Object[] array, final Object objectToFind)：从尾部开始查找指定元素；
        System.out.println("lastIndexOf -> ：" + ArrayUtils.lastIndexOf(array2, 9));
        System.out.println("lastIndexOf -> ：" + ArrayUtils.lastIndexOf(array2, 9, 3));

        //insert(final int index, final T[] array, final T... values)：向数组指定索引位置添加元素；
        int[] insert = ArrayUtils.insert(2, array2, 33);
        System.out.println("insert -> ：" + ArrayUtils.toString(insert));
        System.out.println();

        //nullToEmpty(final String[] array)：将 null 数组转换为对应类型的空数组；
        String[] strArray = null;
        String[] strings = ArrayUtils.nullToEmpty(strArray);
        System.out.println("nullToEmpty -> ：" + ArrayUtils.toString(strings));
        System.out.println();

        //toMap(final Object[] array)：将二维数组转换为 map，一维数组转换抛出异常；
        String[][] map = {{"name", "zhangsan"}, {"age", "23"}, {"money", "6700"}};
        Map<Object, Object> toMap = ArrayUtils.toMap(map);
        toMap.forEach((k, v) -> System.out.println("toMap -> ：key => " + k + "，value => " + v));
        System.out.println();

        //reverse(final char[] array)：反转数组，不返回新数组，可以指定反转的区域；
        ArrayUtils.reverse(array2);
        System.out.println("reverse -> ：" + ArrayUtils.toString(array2));

        //subarray(final char[] array, int startIndexInclusive, int endIndexExclusive)：数组的截取，包头不包尾；
        int[] sub = {7, 5, 3, 9, 8, 4};
        int[] subarray = ArrayUtils.subarray(sub, 2, 4);
        System.out.println("subarray -> ：" + ArrayUtils.toString(subarray));

        //swap(final char[] array, final int offset1, final int offset2)：交换数组中指定位置的两个元素；
        int[] swap = {1, 2, 3};
        ArrayUtils.swap(swap, 1, 0);
        System.out.println("swap -> ：" + ArrayUtils.toString(swap));
        int[] swap2 = {1, 2, 3};
        ArrayUtils.swap(swap2, 0, 5);
        System.out.println("swap2 -> ：" + ArrayUtils.toString(swap));
        int[] swap3 = {1, 2, 3};
        ArrayUtils.swap(swap, -1, 1);
        System.out.println("swap3 -> ：" + ArrayUtils.toString(swap3));

        //toObject(final int[] array)：将原始数据类型的数组转换为对象类型的数组；
        int[] toObject = {12, 11, 14};
        Integer[] integers = ArrayUtils.toObject(toObject);
        System.out.println("toObject -> ：" + ArrayUtils.toString(toObject));

        //toPrimitive(final Integer[] array)：将对象数据类型的数组转换为原始数据类型的数组；
        int[] ints = ArrayUtils.toPrimitive(integers);
        System.out.println("toPrimitive -> ：" + ArrayUtils.toString(ints));

        //toStringArray(final Object[] array)：将 Object 类型的数组转换为 String 类型的数组；
        String[] toStringArray = ArrayUtils.toStringArray(integers);
        System.out.println("toStringArray -> ：" + ArrayUtils.toString(toStringArray));
    }
```

