---
title: '[JDK8] 3 方法引用与构造方法引用'
catalog: true
date: 2019-09-10 17:19:23
subtitle: 方法引用与构造方法引用
header-img: /img/java8/java8_bg.png
tags:
- JDK8
---

## 方法引用
### 什么是方法引用
当要传递给 `Lambda` 体的操作，已经有实现的方法了，可以使用方法引用。

方法引用可以看做是 `Lambda` 表达式深层次的表达。换句话说，方法引用就是 `Lambda` 表达式，也就是函数式接口的一个实例，通过方法的名字来指向一个方法，可以认为是 `Lambda` 表达式的一个语法糖。

**要求：实现接口的抽象方法的参数类列和返回值类型，必须与方法引用的方法的参数列表和返回值类型保持一致。**

格式：使用操作符 `::` 将类（或者对象）与方法名分割开来

如下三种主要使用情况：
- `对象 :: 实例方法名`
- `类 :: 静态方法名`
- `类 :: 实例方法名`

**示例**
```java
public class Person {
    private String name;
    private LocalDate birthday;

    public Person() {
    }

    public Person(String name) {
        this.name = name;
    }

    public Person(String name, LocalDate birthday) {
        this.name = name;
        this.birthday = birthday;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getBirthday() {
        return birthday;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", birthday=" + birthday +
                '}';
    }

    public static int compareByAge(Person a, Person b) {
        return a.birthday.compareTo(b.birthday);
    }
}

```
```java
public class MethodReferences {

    //情况一：对象 :: 实例方法
    //Consumer 中的 void accept(T t) 与 PrintStream 中的 void println(T t)
    @Test
    public void t1() {
        //原来的写法
        Consumer<String> consumer = new Consumer<String>() {
            @Override
            public void accept(String s) {
                System.out.println(s);
            }
        };
        consumer.accept("上海市");

        //lambda 写法
        Consumer<String> consumerL = str -> System.out.println(str);
        consumerL.accept("上海");

        //方法引用
        PrintStream out = System.out;
        Consumer<String> consumerM = out::println;
        consumerM.accept("shanghai");
    }


    //Supplier 中的 T get() 与 Person 中的 String getName()
    @Test
    public void t2() {
        Person person = new Person("小威", LocalDate.of(2016, 9, 1));

        //原来的写法
        Supplier<String> supplier = new Supplier<String>() {
            @Override
            public String get() {
                return person.getName();
            }
        };
        System.out.println(supplier.get());

        //lambda 写法
        Supplier<String> supplierL = () -> person.getName();
        System.out.println(supplierL.get());

        // 方法引用
        Supplier<String> supplierM = person::getName;
        System.out.println(supplierM.get());
    }
//======================================================================================================================


    //情况二：类 :: 静态方法
    //Comparator 中的 int compare(T t1,T t2) 与 Integer 中的 int compare(T t1,T t2)
    @Test
    public void t3() {
        //原来的写法
        Comparator<Integer> comparator = new Comparator<Integer>() {
            @Override
            public int compare(Integer o1, Integer o2) {
                return Integer.compare(o1, o2);
            }
        };
        System.out.println(comparator.compare(520, 1314));

        //lambda 写法
        Comparator<Integer> comparatorL = (o1, o2) -> Integer.compare(o1, o2);
        System.out.println(comparatorL.compare(100, 99));

        // 方法引用
        Comparator<Integer> comparatorM = Integer::compareTo;
        System.out.println(comparatorM.compare(123, 321));
    }

    //Function 中 R apply(T t) 与 Math 中 Long round(Double d)
    @Test
    public void t4() {
        //原来的写法
        Function<Double, Long> function = new Function<Double, Long>() {
            @Override
            public Long apply(Double aDouble) {
                return Math.round(aDouble);
            }
        };
        System.out.println(function.apply(13.7));

        //lambda 写法
        Function<Double, Long> functionL = d -> Math.round(d);
        System.out.println(functionL.apply(13.4));

        // 方法引用
        Function<Double, Long> functionM = Math::round;
        System.out.println(functionM.apply(13.9));
    }
//======================================================================================================================


    //情况三：类 :: 实例方法（有难度）
    //Comparator 中的 int compare(T t1,T t2) 与 String 中的 int t1.compareTo(t2)
    @Test
    public void t5() {
        //原来的写法
        Comparator<String> comparator = new Comparator<String>() {
            @Override
            public int compare(String o1, String o2) {
                return o1.compareTo(o2);
            }
        };
        System.out.println(comparator.compare("abc", "abd"));

        //lambda 写法
        Comparator<String> comparatorL = (o1, o2) -> o1.compareTo(o2);
        System.out.println(comparatorL.compare("abc", "abd"));

        // 方法引用
        Comparator<String> comparatorM = String::compareTo;
        System.out.println(comparatorM.compare("abd", "abc"));
    }

    //BiPredicate 中的 boolean test(T t1,T t2) 与 String 中的 boolean t1.equals(t2)
    @Test
    public void t6() {
        //原来的写法
        BiPredicate<String, String> biPredicate = new BiPredicate<String, String>() {
            @Override
            public boolean test(String s, String s2) {
                return s.equals(s2);
            }
        };
        System.out.println(biPredicate.test("abc", "abd"));

        //lambda 写法
        BiPredicate<String, String> biPredicateL = (s1, s2) -> s1.equals(s2);
        System.out.println(biPredicateL.test("abc", "abd"));

        // 方法引用
        BiPredicate<String, String> biPredicateM = String::equals;
        System.out.println(biPredicateM.test("abc", "abd"));
    }

    //Function 中的 R apply(T t) 与 Person 中的 String getName()
    @Test
    public void t7() {
        Person person = new Person("Vincent", LocalDate.of(1991, 1, 28));

        //原来的写法
        Function<Person, String> function = new Function<Person, String>() {
            @Override
            public String apply(Person person) {
                return person.getName();
            }
        };
        System.out.println(function.apply(person));


        //lambda 写法
        Function<Person, String> functionL = p -> p.getName();
        System.out.println(functionL.apply(person));

        // 方法引用
        Function<Person, String> functionM = Person::getName;
        System.out.println(functionM.apply(person));
    }
}
```

## 构造方法引用
构造方法引用又分构造方法引用和数组构造方法引用。

### 构造方法引用（也可以称作构造器引用）
**组成语法格式：**`Class::new`

构造函数本质上是静态方法，只是方法名字比较特殊，使用的是 **`new` 关键字**。

**要求：和方法引用类似，函数接口的抽象方法的形参列表和构造器的形参列表一致，且抽象方法的返回值类型即为构造器所属的类的类型。**

示例：

`String::new`， 等价于 `lambda` 表达式 `() -> new String() `
```java
public class ConstructorReferences {
    //构造器引用
    //Supplier 中的 T get() 与 Person()
    @Test
    public void t1() {
        //原来的写法
        Supplier<Person> supplier = new Supplier<Person>() {
            @Override
            public Person get() {
                return new Person();
            }
        };
        System.out.println(supplier.get());

        //lambda的写法
        Supplier<Person> supplierL = () -> new Person();
        System.out.println(supplierL.get());

        //构造器引用
        Supplier<Person> supplierM = Person::new;
        System.out.println(supplierM.get());
    }

    //Function 中的 R apply(T t)
    @Test
    public void t2() {
        //原来的写法
        Function<String, Person> function = new Function<String, Person>() {
            @Override
            public Person apply(String s) {
                return new Person(s);
            }
        };
        System.out.println(function.apply("小微"));

        //lambda的写法
        Function<String, Person> functionL = s -> new Person(s);
        System.out.println(functionL.apply("小微"));

        //构造器引用
        Function<String, Person> functionM = Person::new;
        System.out.println(functionM.apply("小微"));
    }

    //BiFunction 中的 apply(T t,U u)
    @Test
    public void t3() {
        //原来的写法
        BiFunction<String, LocalDate, Person> biFunction = new BiFunction<String, LocalDate, Person>() {
            @Override
            public Person apply(String s, LocalDate localDate) {
                return new Person(s, localDate);
            }
        };
        Person person = biFunction.apply("威仔", LocalDate.of(2010, 12, 13));
        System.out.println(person);

        //lambda的写法
        BiFunction<String, LocalDate, Person> biFunctionL = (s, lD) -> new Person(s, lD);
        Person personL = biFunctionL.apply("威仔", LocalDate.of(2010, 12, 13));
        System.out.println(personL);

        //构造器引用
        BiFunction<String, LocalDate, Person> biFunctionM = Person::new;
        Person personM = biFunctionM.apply("威仔", LocalDate.of(2010, 12, 13));
        System.out.println(personM);
    }
}
```

### 数组构造方法引用
**组成语法格式：**`TypeName[]::new`

**要求：可以把数组看做事一个特殊的类，则写法与构造器引用一致。**

示例：

`String[]::new` 是一个含有一个参数的构造器引用，这个参数就是数组的长度。等价于 `lambda` 表达式  `x -> new String[x]`。

```java
public class ConstructorReferences {
    //数组引用
    //Function 中的 R apply(T t)
    @Test
    public void t4() {
        //原来的写法
        Function<Integer, String[]> function = new Function<Integer, String[]>() {
            @Override
            public String[] apply(Integer integer) {
                return new String[integer];
            }
        };
        String[] apply = function.apply(10);
        System.out.println(Arrays.toString(apply));

        //lambda的写法
        Function<Integer, String[]> functionL = length -> new String[length];
        String[] applyL = functionL.apply(10);
        System.out.println(Arrays.toString(applyL));

        //数组引用
        Function<Integer, String[]> functionM = String[]::new;
        String[] applyM = function.apply(10);
        System.out.println(Arrays.toString(applyM));
    }
}
```

案例源码：https://github.com/V-Vincen/jdk_18