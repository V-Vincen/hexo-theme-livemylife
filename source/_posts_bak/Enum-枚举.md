---
title: '[Enum] 枚举'
catalog: true
date: 2020-03-09 16:32:57
subtitle: 枚举
header-img: /img/enum/enum_bg.png
tags:
- Enum
---

枚举类型是 Java 5 中新增特性的一部分，它是一种特殊的数据类型，之所以特殊是因为它既是一种类（class）类型却又比类类型多了些特殊的约束，但是这些约束的存在也造就了枚举类型的简洁性、安全性以及便捷性。

## 枚举类
### 定义枚举类
- 枚举类可以实现一个或多个接口，使用 `enum` 定义的枚举类默认继承了 `java.lang.Enum` 类，而不是默认继承 Object 类，因此枚举类不能显示继承其他父类。其中 `java.lang.Enum` 类实现了 `java.lang.Serializable` 和 `java.lang.Comparable` 两个接口。
- 使用 `enum` 定义、非抽象的枚举类默认会使用 `final` 修饰，因此枚举类不能派生子类。
- 枚举类的构造器只能使用 `private` 访问控制符，如果省略了构造器的访问控制符，则默认使用 `private` 修饰；如果强制指定访问控制符，则只能指定`private` 修饰符。
- 枚举类的所有实例必须在枚举类的第一行显式列出，否则这个枚举类永远都不能产生实例。列出这些实例时，系统会自动添加 `public static final` 修饰，无须程序员显式添加。
- 枚举类默认提供了一个 `values()` 方法，该方法可以很方便地遍历所有的枚举值。

如下定义周一到周日的常量：
```java
//Day.class
//枚举类型，使用关键字enum
enum Day {
    MONDAY, TUESDAY, WEDNESDAY,
    THURSDAY, FRIDAY, SATURDAY, SUNDAY
}
```
相当简洁，在定义枚举类型时我们使用的关键字是 `enum`，与 `class` 关键字类似，只不过前者是定义枚举类型，后者是定义类类型。

### 枚举类的实现原理
我们大概了解了枚举类型的定义与简单使用后，现在有必要来了解一下枚举类型的基本实现原理。实际上在使用关键字 `enum` 创建枚举类型并编译后，编译器会为我们生成一个相关的类，这个类继承了 Java API 中的 `java.lang.Enum` 类，也就是说通过关键字 `enum` 创建枚举类型在编译后事实上也是一个类类型而且该类继承自 `java.lang.Enum` 类。

查看反编译 Day.class 文件：
```java
//反编译Day.class
final class Day extends Enum
{
    //编译器为我们添加的静态的values()方法
    public static Day[] values()
    {
        return (Day[])$VALUES.clone();
    }
    //编译器为我们添加的静态的valueOf()方法，注意间接调用了Enum也类的valueOf方法
    public static Day valueOf(String s)
    {
        return (Day)Enum.valueOf(com/zejian/enumdemo/Day, s);
    }
    //私有构造函数
    private Day(String s, int i)
    {
        super(s, i);
    }
     //前面定义的7种枚举实例
    public static final Day MONDAY;
    public static final Day TUESDAY;
    public static final Day WEDNESDAY;
    public static final Day THURSDAY;
    public static final Day FRIDAY;
    public static final Day SATURDAY;
    public static final Day SUNDAY;
    private static final Day $VALUES[];

    static 
    {    
        //实例化枚举实例
        MONDAY = new Day("MONDAY", 0);
        TUESDAY = new Day("TUESDAY", 1);
        WEDNESDAY = new Day("WEDNESDAY", 2);
        THURSDAY = new Day("THURSDAY", 3);
        FRIDAY = new Day("FRIDAY", 4);
        SATURDAY = new Day("SATURDAY", 5);
        SUNDAY = new Day("SUNDAY", 6);
        $VALUES = (new Day[] {
            MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
        });
    }
}
```
- 从反编译的代码可以看出编译器确实帮助我们生成了一个 Day 类（注意该类是 `final` 类型的，将无法被继承）而且该类继承自 `java.lang.Enum` 类，该类是一个抽象类（稍后我们会分析该类中的主要方法）。
- 除此之外，编译器还帮助我们生成了7个 Day 类型的实例对象分别对应枚举中定义的7个日期，这也充分说明了我们前面使用关键字 `enum` 定义的 Day 类型中的每种日期枚举常量也是实实在在的 Day 实例对象，只不过代表的内容不一样而已。注意编译器还为我们生成了两个静态方法，分别是 `values()` 和  `valueOf()`。
- 到此我们也就明白了，使用关键字 `enum` 定义的枚举类型，在编译期后，也将转换成为一个实实在在的类，而在该类中，会存在每个在枚举类型中定义好变量的对应实例对象，**如上述的 MONDAY 枚举类型对应 public static final Day MONDAY;**，同时编译器会为该类创建两个方法，分别是 `values()`和 `valueOf()`。到此相信我们对枚举的实现原理也比较清晰。

### 枚举的常见方法
`Enum` 是所有 Java 语言枚举类型的公共基本类（注意 `Enum`是抽象类），以下是它的常见方法：

| 返回类型                        | 方法名称                                             | 方法说明                             |
|-----------------------------|--------------------------------------------------|----------------------------------|
| int                         | compareTo\(E o\)                                 | 比较此枚举与指定对象的顺序                    |
| boolean                     | equals\(Object other\)                           | 当指定对象等于此枚举常量时，返回 true。           |
| Class<?>                    | getDeclaringClass\(\)                            | 返回与此枚举常量的枚举类型相对应的 Class 对象       |
| String                      | name\(\)                                         | 返回此枚举常量的名称，在其枚举声明中对其进行声明         |
| int                         | ordinal\(\)                                      | 返回枚举常量的序数（它在枚举声明中的位置，其中初始常量序数为零） |
| String                      | toString\(\)                                     | 返回枚举常量的名称，它包含在声明中                |
| static<T extends Enum<T>> T | static valueOf\(Class<T> enumType, String name\) | 返回带指定名称的指定枚举类型的枚举常量。             |


示例：
```java
public class EnumDemo {

    enum Color {RED, GREEN, BLUE;}

    enum Size {BIG, MIDDLE, SMALL;}

    public static void main(String args[]) {
        System.out.println("=========== Print all Color ===========");
        for (Color c : Color.values()) {
            System.out.println(c + " ordinal: " + c.ordinal());
        }
        System.out.println("=========== Print all Size ===========");
        for (Size s : Size.values()) {
            System.out.println(s + " ordinal: " + s.ordinal());
        }

        Color green = Color.GREEN;
        System.out.println("green name(): " + green.name());
        System.out.println("green getDeclaringClass(): " + green.getDeclaringClass());
        System.out.println("green hashCode(): " + green.hashCode());
        System.out.println("green compareTo Color.GREEN: " + green.compareTo(Color.GREEN));
        System.out.println("green equals Color.GREEN: " + green.equals(Color.GREEN));
        System.out.println("green equals Size.MIDDLE: " + green.equals(Size.MIDDLE));
        System.out.println("green equals 1: " + green.equals(1));
        System.out.format("green == Color.BLUE: %b\n", green == Color.BLUE);
    }

}
```
输出：
```
=========== Print all Color ===========
RED ordinal: 0
GREEN ordinal: 1
BLUE ordinal: 2
=========== Print all Size ===========
BIG ordinal: 0
MIDDLE ordinal: 1
SMALL ordinal: 2
green name(): GREEN
green getDeclaringClass(): class EnumDemo$Color
green hashCode(): 1639705018
green compareTo Color.GREEN: 0
green equals Color.GREEN: true
green equals Size.MIDDLE: false
green equals 1: false
green == Color.BLUE: false
```


## 枚举类使用
### 类常量
虽然有了枚举，可能是由于设计者习惯问题，还有很多人用的类常量， 定义了类常量，用一个 `Map<Integer, String>` 来封装常量对应的信息，在 `static` 代码块里，类初始化的时候执行一次 `put`。用的时候 `ResponseCode.RESP_INFO.get("DATABASE_EXCEPTION");` 就能取出响应信息。由于项目是前后端分离，在接口文档里需要写上状态码，还得写上状态码对应的提示信息，而且我们的响应类 `RespInfo` 有 `message` 属性，就是保存常量类里状态码对应的信息的。

示例：
```java
public class ResponseCode {

    /** 系统处理正常 */
    public static final int SUCCESS_HEAD = 0;

    /** 系统处理未知异常 */
    public static final int EXCEPTION_HEAD = 1;

    /** JSON解析错误 */
    public static final int JSON_RESOLVE = 2;

    /** 类型不匹配 */
    public static final int TRANSTYPE_NO = 3;

    /** Head - messageID未赋值 */
    public static final int HEAD_messageID = 4;

    /** Head - timeStamp未赋值 */
    public static final int HEAD_timeStamp = 5;

    /** Head - messengerID未赋值 */
    public static final int HEAD_messengerID = 6;

    /** Head - transactionType 未赋值 */
    public static final int HEAD_transactionType = 7;

    /** digest校验不通过 */
    public static final int HEAD_DIGEST = 8;
    
    /** src校验不通过 */
    public static final int HEAD_SRC_NULL = 10;
    
    /** 协议包含非法字符 */
    public static final int ILLEGAL_MESSAGE = 11;

    /** 数据库异常 */
    public static final int DATABASE_EXCEPTION = 9;
    public static final Map<Integer, String> RESP_INFO = new HashMap<Integer, String>();

    static {
        // Head 相关
        RESP_INFO.put(SUCCESS_HEAD, "系统处理正常");
        RESP_INFO.put(EXCEPTION_HEAD, "系统处理未知异常");
        RESP_INFO.put(JSON_RESOLVE, "JSON解析错误");
        RESP_INFO.put(TRANSTYPE_NO, "类型不匹配");
        RESP_INFO.put(HEAD_messageID, "messageID未赋值");
        RESP_INFO.put(HEAD_timeStamp, "timeStamp未赋值");
        RESP_INFO.put(HEAD_messengerID, "messengerID未赋值");
        RESP_INFO.put(HEAD_transactionType, "transactionType未赋值");
        RESP_INFO.put(HEAD_DIGEST, "digest校验不通过");
        RESP_INFO.put(DATABASE_EXCEPTION, "数据库异常");
        RESP_INFO.put(HEAD_SRC_NULL, "src未赋值");
        RESP_INFO.put(ILLEGAL_MESSAGE, "协议包含非法字符");
        
    }
}
```

### 枚举常量
所有的枚举类都是 `Enum` 类的子类,就像 `Object` 类一样，只是没有写出来，所以可以枚举类可调用 `Enum` 的方法。注意是逗号分隔属性，只有属性后边没有方法的话，最后加不加分号都行。

示例一：
```java
public class StateTypeDemo {
    public static void main(String[] args) {
        for (StateType stateType : StateType.values()) {
            System.out.println(stateType.getCode() + "：" + stateType.getValue());
            System.out.println();
        }
    }

    enum StateType {
        /**
         * 成功返回状态
         */
        OK(200, "OK"),
        /**
         * 请求格式错误
         */
        BAD_REQUEST(400, "bad request"),
        /**
         * 未授权
         */
        UNAUTHORIZED(401, "unauthorized"),
        /**
         * 没有权限
         */
        FORBIDDEN(403, "forbidden"),
        /**
         * 请求的资源不存在
         */
        NOT_FOUND(404, "not found"),
        /**
         * 该http方法不被允许
         */
        NOT_ALLOWED(405, "method not allowed"),
        /**
         * 请求处理发送异常
         */
        PROCESSING_EXCEPTION(406, "Handling Exceptions"),
        /**
         * 请求处理未完成
         */
        PROCESSING_UNFINISHED(407, "To deal with unfinished"),
        /**
         * 登录过期
         */
        BEOVERDUE(408, "Be overdue"),
        /**
         * 用户未登录
         */
        NOT_LOGIN(409, "Not logged in"),
        /**
         * 这个url对应的资源现在不可用
         */
        GONE(410, "gone"),
        /**
         * 请求类型错误
         */
        UNSUPPORTED_MEDIA_TYPE(415, "unsupported media type"),
        /**
         * 校验错误时用
         */
        UNPROCESSABLE_ENTITY(422, "unprocessable entity"),
        /**
         * 请求过多
         */
        TOO_MANY_REQUEST(429, "too many request");

        private int code;
        private String value;

        StateType(int code, String value) {
            this.code = code;
            this.value = value;
        }

        public String value() {
            return this.value;
        }

        public int getCode() {
            return code;
        }

        public String getValue() {
            return value;
        }

        public static Boolean isValidateStateType(String... stateType) {
            for (int i = 0; i < stateType.length; i++) {
                StateType[] value = StateType.values();
                boolean falg = false;
                for (StateType type : value) {
                    if (type.value.equals(stateType[i])) {
                        falg = true;
                    }

                }
                if (!falg) {
                    return falg;
                }
            }
            return true;
        }
    }
}
```

示例二：
```java
public class LevelDemo {
    enum Level {
        /**
         * 第一层
         */
        One(1),
        /**
         * 第二层
         */
        Two(2),
        /**
         * 第三层
         */
        Three(3),
        /**
         * 第四层
         */
        Four(4),
        /**
         * 第五层
         */
        Five(5);

        private int value;

        Level(int value) {
            this.value = value;
        }

        public int value() {
            return this.value;
        }

        public static Boolean isValidateLevel(int level) {
            Level[] value = Level.values();
            boolean falg = false;
            for (Level pl : value) {
                if (pl.value == level) {
                    falg = true;
                }
            }
            return falg;
        }
    }

    /*使用*/
    public static void main(String[] args) {
        System.out.println("楼层：" + Level.Three);
    }
}
```

### `switch` 结合枚举类

关于枚举与 `switch` 是个比较简单的话题，使用 `switch` 进行条件判断时，条件参数一般只能是整型，字符型。而枚举型确实也被 `switch` 所支持，在 java 1.7 后 `switch` 也对字符串进行了支持。

示例：
```java
public class SwitchDemo {
    enum Color {GREEN, RED, BLUE}

    public static void printName(Color color) {
        switch (color) {
            case BLUE: //无需使用Color进行引用
                System.out.println("蓝色");
                break;
            case RED:
                System.out.println("红色");
                break;
            case GREEN:
                System.out.println("绿色");
                break;
        }
    }

    public static void main(String[] args) {
        printName(Color.BLUE);      //蓝色
        printName(Color.RED);       //红色
        printName(Color.GREEN);     //绿色
    }

}
```

### 向枚举中添加新方法
如果打算自定义自己的方法，那么必须在 `enum` 实例序列的最后添加一个分号。而且 Java 要求必须先定义 `enum` 实例。 

示例：
```java
public enum Color {  
    RED("红色", 1), GREEN("绿色", 2), BLANK("白色", 3), YELLO("黄色", 4);  
    // 成员变量  
    private String name;  
    private int index;  
    // 构造方法  
    private Color(String name, int index) {  
        this.name = name;  
        this.index = index;  
    }  
    // 普通方法  
    public static String getName(int index) {  
        for (Color c : Color.values()) {  
            if (c.getIndex() == index) {  
                return c.name;  
            }  
        }  
        return null;  
    }  
    // get set 方法  
    public String getName() {  
        return name;  
    }  
    public void setName(String name) {  
        this.name = name;  
    }  
    public int getIndex() {  
        return index;  
    }  
    public void setIndex(int index) {  
        this.index = index;  
    }  
}
```

### 实现接口
- 所有的枚举都继承自 `java.lang.Enum` 类。由于Java 不支持多继承，所以枚举对象不能再继承其他类。
- 如果由枚举类来实现接口里的方法，则每个枚举值在调用该方法时都有相同的行为方式（因为方法体完全一样）。如果需要每个枚举值在调用该方法时呈现出不同的行为方式，则可以让每个枚举值分别来实现该方法，每个枚举值提供不同的实现方式，从而让不同的枚举值调用该方法时具有不同的行为方式。

示例：
```java
public class ColorDeam {

    public static void main(String[] args) {
        for (Color color : Color.values()) {
            System.out.println(color.getInfo());
            color.print();
        }
        System.out.println();

        System.out.println(Color.RED.getInfo());
        Color.RED.print();
    }

}

interface Behaviour {
    void print();

    String getInfo();
}

enum Color implements Behaviour {
    RED("红色", 1), GREEN("绿色", 2), BLANK("白色", 3), YELLO("黄色", 4);

    // 成员变量
    private String name;
    private int index;

    // 构造方法
    private Color(String name, int index) {
        this.name = name;
        this.index = index;
    }

    //接口方法
    @Override
    public String getInfo() {
        return this.name;
    }

    //接口方法
    @Override
    public void print() {
        System.out.println(this.index + ":" + this.name);
    }
}
```

案例源码：https://github.com/V-Vincen/enum







