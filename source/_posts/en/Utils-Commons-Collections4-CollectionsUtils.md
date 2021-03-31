---
title: '[Utils - Commons Collections4] CollectionsUtils'
catalog: true
date: 2020-09-20 19:47:39
subtitle: Provides utility methods and decorators for Collection instances...
header-img: /img/header_img/categories_bg3.jpg
tags:
- Utils
---

## 概述
`commons-collections4` 是一款处理集合的工具，封装了很多操作集合的方法，可以大大简化我们处理集合的代码。从 `commons-collections4` 的官方使用文档可以看出，它主要分为工具类、集合类、行迭代器、属性类、比较器、队列等。

官网地址：http://commons.apache.org/proper/commons-collections/

下载：http://commons.apache.org/proper/commons-collections/download_collections.cgi

官方测试案例源码：https://github.com/apache/commons-collections/blob/master/src/test/java/org/apache/commons/collections4/CollectionUtilsTest.java

![commons-collections4](commons-collections4.png)

## 常用方法
### `addAll`、`addIgnoreNull`
`addAll`：将所有元素添加到给定的集合中。

`addIgnoreNull`：添加忽略为 null 的元素。

```java
addAll(Collection<C> collection, C... elements)
addAll(Collection<C> collection, Enumeration<? extends C> enumeration)
addAll(Collection<C> collection, Iterable<? extends C> iterable)
addAll(Collection<C> collection, Iterator<? extends C> iterator)
addIgnoreNull(Collection<T> collection, T object)
```

例：
```java
    @Test
    public void addAllAndIgnoreNull() {
        /**
         * addAll：将所有元素添加到给定的集合中。
         * addIgnoreNull：添加忽略为 null 的元素。
         *
         * addAll(Collection<C> collection, C... elements)
         * addAll(Collection<C> collection, Enumeration<? extends C> enumeration)
         * addAll(Collection<C> collection, Iterable<? extends C> iterable)
         * addAll(Collection<C> collection, Iterator<? extends C> iterator)
         * addIgnoreNull(Collection<T> collection, T object)
         */
        List<Integer> list = Lists.newArrayList(1, 2, 3, 4, 5, 6, 7, 8, 9);
        List<Integer> list2 = Lists.newArrayList(11);
        boolean addAll = CollectionUtils.addAll(list, list2);
        System.out.println(addAll);//true
        list.forEach(System.out::println);
        System.out.println();

        boolean addIgnoreNull = CollectionUtils.addIgnoreNull(list, null);
        System.out.println(addIgnoreNull);//false
        list.forEach(System.out::println);
    }
```

### `collate`
`collate`：将两个已排序的集合 a 和 b 合并为一个已排序的列表，以便保留元素的自然顺序（或者以便保留根据 Comparator c 的元素顺序）。

```java
collate(Iterable<? extends O> a, Iterable<? extends O> b)
collate(Iterable<? extends O> a, Iterable<? extends O> b, boolean includeDuplicates)
collate(Iterable<? extends O> a, Iterable<? extends O> b, Comparator<? super O> c)
collate(Iterable<? extends O> a, Iterable<? extends O> b, Comparator<? super O> c, boolean includeDuplicates)
```

例：
```java
    @Test
    public void callate() {
        /**
         * collate：将两个已排序的集合a和b合并为一个已排序的列表，以便保留元素的自然顺序（或者以便保留根据 Comparator c 的元素顺序）。
         *      boolean includeDuplicates：收集后的结果，是否包含重复的元素。
         *
         * collate(Iterable<? extends O> a, Iterable<? extends O> b)
         * collate(Iterable<? extends O> a, Iterable<? extends O> b, boolean includeDuplicates)
         * collate(Iterable<? extends O> a, Iterable<? extends O> b, Comparator<? super O> c)
         * collate(Iterable<? extends O> a, Iterable<? extends O> b, Comparator<? super O> c, boolean includeDuplicates)
         */
        List<Integer> list = Lists.newArrayList(7, 3, 5, 8);
        List<Integer> list2 = Lists.newArrayList(8, 7, 6, 9);
        List<Integer> combinedList = new ArrayList<>();
        combinedList.addAll(list);
        combinedList.addAll(list2);
        Collections.sort(combinedList);
        System.out.println("combinedList：" + combinedList);
        Collections.reverse(combinedList);
        System.out.println("combinedList reverse：" + combinedList);


        List<Integer> collate = CollectionUtils.collate(list, list2, true);
        System.out.println("collate：" + collate);
    }
```

### `containsAll`、`containsAny`
`containsAll(a,b)`：集合 b 中的全部元素是否都包含在集合 a 中。

`containsAny(a,b)`：集合 b 中是否至少有一个元素包含在集合 a 中。

```java
containsAll(Collection<?> coll1, Collection<?> coll2)
containsAny(Collection<?> coll1, Collection<?> coll2)
containsAny(Collection<?> coll1, T... coll2)
```

例：
```java
    @Test
    public void containsAllOrAny() {
        /**
         * containsAll(a,b)：集合 b 中的全部元素是否都包含在集合 a 中。
         * containsAny(a,b)：集合 b 中是否至少有一个元素包含在集合 a 中。
         *
         * containsAll(Collection<?> coll1, Collection<?> coll2)
         * containsAny(Collection<?> coll1, Collection<?> coll2)
         * containsAny(Collection<?> coll1, T... coll2)
         */
        List<Integer> list = Lists.newArrayList(7, 6, 3, 5, 8);
        List<Integer> list2 = Lists.newArrayList(8, 7, 6, 9);
        List<Integer> list3 = Lists.newArrayList(8, 4, 0);
        boolean containsAll = CollectionUtils.containsAll(list, list2);
        System.out.println(containsAll);//false
        System.out.println();

        boolean containsAny = CollectionUtils.containsAny(list, list3);
        System.out.println(containsAny);//true
    }
```

### `intersection`、`disjunction`、`union`、`subtract`
`intersection`：交集。

`union`：并集。

`disjunction`：交集的补集（析取）。

`subtract`：差集。

```java
intersection(Iterable<? extends O> a, Iterable<? extends O> b)
union(Iterable<? extends O> a, Iterable<? extends O> b)
disjunction(Iterable<? extends O> a, Iterable<? extends O> b)
subtract(Iterable<? extends O> a, Iterable<? extends O> b)
subtract(Iterable<? extends O> a, Iterable<? extends O> b, Predicate<O> p)
```

**例一：**
```java
    @Test
    public void disjunction() {
        /**
         * intersection：交集。
         * union：并集。
         * disjunction：交集的补集（析取）。
         * subtract：差集。
         *
         * intersection(Iterable<? extends O> a, Iterable<? extends O> b)
         * union(Iterable<? extends O> a, Iterable<? extends O> b)
         * disjunction(Iterable<? extends O> a, Iterable<? extends O> b)
         * subtract(Iterable<? extends O> a, Iterable<? extends O> b)
         * subtract(Iterable<? extends O> a, Iterable<? extends O> b, Predicate<O> p)
         */
        List<Integer> list = Lists.newArrayList(1, 2, 4, 5, 6);
        List<Integer> list2 = Lists.newArrayList(1, 2, 7);
        Collection<Integer> intersection = CollectionUtils.intersection(list, list2);
        System.out.println("intersection：" + intersection);//[1, 2]

        Collection<Integer> union = CollectionUtils.union(list, list2);
        System.out.println("union：" + union);//[1, 2, 4, 5, 6, 7]

        Collection<Integer> disjunction = CollectionUtils.disjunction(list, list2);
        System.out.println("disjunction：" + disjunction);//[4,5,6,7]

        Collection<Integer> subtract = CollectionUtils.subtract(list, list2);
        System.out.println("subtract：" + subtract);//[4, 5, 6]
        Collection<Integer> subtract2 = CollectionUtils.subtract(list2, list);
        System.out.println("subtract2：" + subtract2);//[7]
    }
```

**例二：**
我们再来看一个例子，`List` 自带方法：
```java
    @Test
    public void t() {
        String[] arrayA = new String[]{"1", "2", "3", "4"};
        String[] arrayB = new String[]{"3", "4", "5", "6"};
        List<String> listA = Arrays.asList(arrayA);
        List<String> listB = Arrays.asList(arrayB);

        //1、交集
        List<String> jiaoList = new ArrayList<>(listA);
        jiaoList.retainAll(listB);
        System.out.println(jiaoList);
        //输出:[3, 4]

        //2、差集
        List<String> chaList = new ArrayList<>(listA);
        chaList.removeAll(listB);
        System.out.println(chaList);
        //输出:[1, 2]

        //3、并集 (先做差集再做添加所有）
        List<String> bingList = new ArrayList<>(listA);
        bingList.removeAll(listB); // bingList为 [1, 2]
        bingList.addAll(listB);  //添加[3,4,5,6]
        System.out.println(bingList);
        //输出:[1, 2, 3, 4, 5, 6]
    }
```

**注意** : 
1. `intersection` 和 `retainAll` 的差别：要注意的是它们的返回类型是不一样的，`intersection` 返回的是一个新的 `List` 集合，而 `retainAll` 返回是 `Bollean` 类型那就说明 `retainAll` 方法是对原有集合进行处理再返回原有集合,会改变原有集合中的内容。

2. 性能方面（个人观点）：
    - 从性能角度来考虑的话，`List` 自带会高点，因为它不用再创建新的集合。
    - 需要注意的是：因为 `retainAll` 因为会改变原有集合，所以该集合需要多次使用就不适合用 `retainAll`。

3. `Arrays.asList` 将数组转集合不能进行 `add` 和 `remove` 操作，原因：
    - 调用 `Arrays.asList()` 生产的 List 的 `add`、`remove` 方法时报异常，这是由 `Arrays.asList()` 返回的是 Arrays 的内部类 `ArrayList`，而不是 `java.util.ArrayList`。
    - Arrays 的内部类 `ArrayList` 和 `java.util.ArrayList` 都是继承 `AbstractList`，`remove`、`add` 等方法 `AbstractList` 中是默认 `throw UnsupportedOperationException` 而且不作任何操作。`java.util.ArrayList` 重写了这些方法而 `Arrays` 的内部类 `ArrayList` 没有重新，所以会抛出异常。

所以正确做法如下：
```java
String[] array = {"1","2","3","4","5"};
List<String> list = Arrays.asList(array);
List arrList = new ArrayList(list);
arrList.add("6");
```

**例三：**
JDK 1.8 lambda 写法：
```java
    @Test
    public void t2() {
        String[] arrayA = new String[]{"1", "2", "3", "4"};
        String[] arrayB = new String[]{"3", "4", "5", "6"};
        List<String> listA = Arrays.asList(arrayA);
        List<String> listB = Arrays.asList(arrayB);

        // 交集
        List<String> intersection = listA.stream().filter(listB::contains).collect(Collectors.toList());
        System.out.println(intersection);
        //输出:[3, 4]

        // 差集 (list1 - list2)
        List<String> reduceList = listA.stream().filter(item -> !listB.contains(item)).collect(Collectors.toList());
        System.out.println(reduceList);
        //输出:[1, 2]

        // 并集 （新建集合:1、是因为不影响原始集合。2、Arrays.asList不能add和remove操作。
        List<String> listAll = listA.parallelStream().collect(Collectors.toList());
        List<String> listAll2 = listB.parallelStream().collect(Collectors.toList());
        listAll.addAll(listAll2);
        System.out.println(listAll);
        //输出:[1, 2, 3, 4, 3, 4, 5, 6]

        // 去重并集
        List<String> list = new ArrayList<>(listA);
        list.addAll(listB);
        List<String> listAllDistinct = list.stream().distinct().collect(Collectors.toList());
        System.out.println(listAllDistinct);
        //输出:[1, 2, 3, 4, 5, 6]
    }
```




### `emptyCollection` 和 `emptyIfNull`
`emptyCollection`：返回具有泛型类型安全性的不可变空集合。

`emptyIfNull`：如果参数为null，则返回一个不变的空集合，否则返回参数本身。

```java
emptyCollection()
emptyIfNull(Collection<T> collection)
```

例：
```java
    @Test
    public void emptyCollectionOrIfNull() {
        /**
         * emptyCollection：返回具有泛型类型安全性的不可变空集合。
         * emptyIfNull：如果参数为null，则返回一个不变的空集合，否则返回参数本身。
         *
         * emptyCollection()
         * emptyIfNull(Collection<T> collection)
         */
        Collection<Object> collection = CollectionUtils.emptyCollection();
        System.out.println(collection);//[]

        Collection<Object> collection2 = CollectionUtils.emptyIfNull(Arrays.asList(new int[]{3, 4}));
        System.out.println(collection2);//[3,4]
        Collection<Object> collection3 = CollectionUtils.emptyIfNull(null);
        System.out.println(collection3);//[]
    }
```

### `isEmpty`、`isNotEmpty`
`isEmpty`：空安全检查指定的集合是否为空。

`isNotEmpty`：空安全检查指定的集合是否不为空。

```
isEmpty(Collection<?> coll)
isNotEmpty(Collection<?> coll)
```

例：
```java
    @Test
    public void emptyOrNot() {
        /**
         * isEmpty：空安全检查指定的集合是否为空。
         * isNotEmpty：空安全检查指定的集合是否不为空。
         *
         * isEmpty(Collection<?> coll)
         * isNotEmpty(Collection<?> coll)
         */
        List<Integer> list = Lists.newArrayList(2, 3, 4);
        boolean empty = CollectionUtils.isEmpty(list);
        System.out.println(empty);//false

        boolean notEmpty = CollectionUtils.isNotEmpty(list);
        System.out.println(notEmpty);//true
    }
```

### `removeAll`
`removeAll`：从一个集合中，移除另一个集合。（同差集）

`retainAll`：从一个集合中保留下，和另一个集合相同的集合。（同交集）

```java
removeAll(Collection<E> collection, Collection<?> remove)
removeAll(Iterable<E> collection, Iterable<? extends E> remove, Equator<? super E> equator)
retainAll(Collection<C> collection, Collection<?> retain)
retainAll(Iterable<E> collection, Iterable<? extends E> retain, Equator<? super E> equator)
```

例：
```java
    @Test
    public void removeAll() {
        /**
         * removeAll：从一个集合中，移除另一个集合。（同差集）
         * retainAll：从一个集合中保留下，和另一个集合相同的集合。（同交集）
         *
         * removeAll(Collection<E> collection, Collection<?> remove)
         * removeAll(Iterable<E> collection, Iterable<? extends E> remove, Equator<? super E> equator)
         * retainAll(Collection<C> collection, Collection<?> retain)
         * retainAll(Iterable<E> collection, Iterable<? extends E> retain, Equator<? super E> equator)
         */
        List<Integer> list = Lists.newArrayList(1, 2, 4, 5, 6);
        List<Integer> list2 = Lists.newArrayList(1, 2, 7);
        Collection<Integer> removeAll = CollectionUtils.removeAll(list, list2);
        System.out.println("removeAll：" + removeAll);//[4, 5, 6]
        Collection<Integer> removeAll2 = CollectionUtils.removeAll(list2, list);
        System.out.println("removeAll2：" + removeAll2);//[7]

        Collection<Integer> retainAll = CollectionUtils.retainAll(list, list2);
        System.out.println("retainAll：" + retainAll);//[1, 2]
    }
```

### `reverseArray`
`reverseArray`：反转给定数组的顺序。

```java
reverseArray(Object[] array)
```

例：
```java
    @Test
    public void reverseArray() {
        /**
         * reverseArray：反转给定数组的顺序。
         *
         * reverseArray(Object[] array)
         */
        List<Integer> list = Lists.newArrayList(1, 2, 4, 5, 6);
        Integer[] integers = list.toArray(new Integer[]{});
        CollectionUtils.reverseArray(integers);
        System.out.println(Arrays.asList(integers));//[6, 5, 4, 2, 1]

        String[] array = new String[]{"1", "2", "3", "4"};
        CollectionUtils.reverseArray(array);
        System.out.println(Arrays.asList(array));//[4, 3, 2, 1]
    }
```