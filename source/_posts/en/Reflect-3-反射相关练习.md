---
title: '[Reflect] 3 反射相关练习'
catalog: true
date: 2020-04-09 13:52:37
subtitle: 反射相关练习
top: 997
header-img: /img/reflect/reflect_bg.jpg
tags:
- Reflect
---

先来写几个基本类：
```java
/**
 * @author vincent
 */
@Data
public class FatherClass {
    public String fatherName;
    public int fatherAge;
}
```

```java
/**
 * @author vincent
 */
@Data
public class SonClass extends FatherClass {
    private String sonName;
    protected Integer sonAge;
    public String sonBirthday;

    public String show(String sonName, Integer sonAge, String sonBirthday) throws Exception {
        return sonName + "的年龄是：" + sonAge + "，生日是：" + sonBirthday;
    }
}
```

```java
/**
 * @author vincent
 */
public class TestClass {
    private String MSG = "Original";

    public String getMSG() {
        return MSG;
    }

    private void privateMethod(String head, int tail) {
        System.out.println(head + tail);
    }
}
```

## `getFields()` 和 `getDeclaredFields()`
```java
    /**
     * 通过反射获取类的所有变量
     */
    @Test
    public void fieldsTest() {
        //1.获取并输出类的名称
        Class sClass = SonClass.class;
        System.out.println("类的名称：" + sClass.getName());
        System.out.println();

        //2.1 获取所有 public 访问权限的变量
        // 包括本类声明的和从父类继承的
        Field[] fields = sClass.getFields();
        Arrays.stream(fields).forEach(System.out::println);
        System.out.println();

        //2.2 获取所有本类声明的变量（不问访问权限）
        Field[] declaredFields = sClass.getDeclaredFields();
        Arrays.stream(declaredFields).forEach(field -> {
            //获取访问权限并输出
            int modifier = field.getModifiers();
            String modifiers = Modifier.toString(modifier);
            System.out.println(modifier + " -> " + modifiers);

            //输出变量的类型
            String typeName = field.getType().getName();
            //输出变量名
            String fieldName = field.getName();
            System.out.println(modifiers + " " + typeName + " " + fieldName);
        });
    }
```

显示结果：
```
类的名称：com.example.reflect.SonClass

public java.lang.String com.example.reflect.SonClass.sonBirthday
public java.lang.String com.example.reflect.FatherClass.fatherName
public int com.example.reflect.FatherClass.fatherAge

2 -> private
private java.lang.String sonName
4 -> protected
protected java.lang.Integer sonAge
1 -> public
public java.lang.String sonBirthday
```


## `getMethods()` 和 `getDeclaredMethods()`
```java
    /**
     * 通过反射获取类的所有方法
     */
    @Test
    public void methodsTest() {
        //1.获取并输出类的名称
        Class sClass = SonClass.class;
        System.out.println("类的名字：" + sClass.getName());
        System.out.println();

        //2.1 获取所有 public 访问权限的方法
        //包括自己声明和从父类继承的
        Method[] methods = sClass.getMethods();
        Arrays.stream(methods).forEach(System.out::println);
        System.out.println();

        //2.2 获取所有本类的的方法（不问访问权限）
        Method[] declaredMethods = sClass.getDeclaredMethods();
        Arrays.stream(declaredMethods).forEach(method -> {
            //获取访问权限并输出
            int modifiers = method.getModifiers();
            String modifier = Modifier.toString(modifiers);
            System.out.print(modifier + " -> " + modifiers + "; ");

            //获取并输出方法的返回值类型
            Class returnType = method.getReturnType();
            //方法返回类型：returnType.getName()，方法名：method.getName()
            System.out.print(modifier + " " + returnType.getName() + " " + method.getName() + "（");

            //获取并输出方法的所有参数
            Parameter[] parameters = method.getParameters();
            Arrays.stream(parameters).forEach(parameter -> {
                //参数类型
                Class parameterType = parameter.getType();
//                System.out.print("parameterType：" + parameterType);
                //参数类型：parameterType.getName()，参数名：parameter.getName()
                System.out.print(parameterType.getName() + " " + parameter.getName() + " , ");
            });

            //获取并输出方法抛出的异常
            Class<?>[] exceptionTypes = method.getExceptionTypes();
            if (exceptionTypes.length == 0) {
                System.out.println(");");
            } else {
                Arrays.stream(exceptionTypes).forEach(exceptionType -> {
                    System.out.println(") throws " + exceptionType.getName() + ";");
                });
            }
        });
    }
```

显示结果：
```
类的名字：com.example.reflect.SonClass

public boolean com.example.reflect.SonClass.equals(java.lang.Object)
public java.lang.String com.example.reflect.SonClass.toString()
public int com.example.reflect.SonClass.hashCode()
public java.lang.String com.example.reflect.SonClass.getSonName()
public java.lang.String com.example.reflect.SonClass.show(java.lang.String,java.lang.Integer,java.lang.String) throws java.lang.Exception
public java.lang.Integer com.example.reflect.SonClass.getSonAge()
public java.lang.String com.example.reflect.SonClass.getSonBirthday()
public void com.example.reflect.SonClass.setSonName(java.lang.String)
public void com.example.reflect.SonClass.setSonAge(java.lang.Integer)
public void com.example.reflect.SonClass.setSonBirthday(java.lang.String)
public java.lang.String com.example.reflect.FatherClass.getFatherName()
public int com.example.reflect.FatherClass.getFatherAge()
public void com.example.reflect.FatherClass.setFatherName(java.lang.String)
public void com.example.reflect.FatherClass.setFatherAge(int)
public final void java.lang.Object.wait(long,int) throws java.lang.InterruptedException
public final native void java.lang.Object.wait(long) throws java.lang.InterruptedException
public final void java.lang.Object.wait() throws java.lang.InterruptedException
public final native java.lang.Class java.lang.Object.getClass()
public final native void java.lang.Object.notify()
public final native void java.lang.Object.notifyAll()

public -> 1; public boolean equals（java.lang.Object arg0 , );
public -> 1; public java.lang.String toString（);
public -> 1; public int hashCode（);
public -> 1; public java.lang.String getSonName（);
protected -> 4; protected boolean canEqual（java.lang.Object arg0 , );
public -> 1; public java.lang.String show（java.lang.String arg0 , java.lang.Integer arg1 , java.lang.String arg2 , ) throws java.lang.Exception;
public -> 1; public java.lang.Integer getSonAge（);
public -> 1; public java.lang.String getSonBirthday（);
public -> 1; public void setSonName（java.lang.String arg0 , );
public -> 1; public void setSonAge（java.lang.Integer arg0 , );
public -> 1; public void setSonBirthday（java.lang.String arg0 , );
```


## `getFieldAccessor(obj).set(obj, value)`
```java
    /**
     * 访问私有变量并修改私有变量的值
     */
    @Test
    public void getAndModifyPrivateFiled() throws Exception {
        //1. 获取 Class 类实例
        TestClass testClass = new TestClass();
        Class<? extends TestClass> tClass = testClass.getClass();

        //2. 获取私有变量
        Field privateField = tClass.getDeclaredField("MSG");
        if (Objects.nonNull(privateField)) {
            //获取私有变量的访问权
            privateField.setAccessible(true);
            System.out.println("Before Modify：MSG = " + testClass.getMSG());

            /**
             * 调用 set(object , value) 修改变量的值，privateField 是获取到的私有变量，testClass 要操作的对象，"Modified" 为要修改成的值
             */
            privateField.set(testClass, "Modified");

            System.out.println("After Modify：MSG = " + testClass.getMSG());
        }
    }
```

显示结果：
```
Before Modify：MSG = Original
After Modify：MSG = Modified
```


## `Object invoke(Object obj, Object... args)`

```java
    /**
     * 访问对象的私有方法并赋值
     */
    @Test
    public void getPrivateMethod() throws Exception {
        //1. 获取 Class 类实例
        TestClass testClass = new TestClass();
        Class<? extends TestClass> tClass = testClass.getClass();

        //2. 获取私有方法
        //第一个参数为要获取的私有方法的名称
        //第二个为要获取方法的参数的类型，参数为 Class...，没有参数就是 null
        //方法参数也可这么写：new Class[]{String.class , int.class}
        Method privateMethod = tClass.getDeclaredMethod("privateMethod", String.class, int.class);
        if (Objects.nonNull(privateMethod)) {
            //获取私有方法的访问权，只是获取访问权，并不是修改实际权限
            privateMethod.setAccessible(true);

            /**
             * 使用 invoke 反射调用私有方法，privateMethod 是获取到的私有方法，testClass 要操作的对象，后面两个参数传实参
             */
            privateMethod.invoke(testClass, "Java Reflect", 666);
        }
    }
```

显示结果：
```
Java Reflect666
```

## 对象中 `String` 类型属性为空的字段赋值为 `null`
```java
public static <T> void stringEmptyToNull(T t) {
    Class<?> clazz = t.getClass();

    Field[] fields = clazz.getDeclaredFields();
    Arrays.stream(fields)
        .filter(f -> f.getType() == String.class)
        .filter(f -> {
            try {
                f.setAccessible(true);
                String value = (String) f.get(t);
                return StringUtils.isEmpty(value);
            } catch (Exception ignore) {
                return false;
            }
        })
        .forEach(field -> {
            try {
                field.setAccessible(true);
                field.set(t, null);
                } catch (Exception ignore) {
            }
        });
}
```

## 比较同一类型，两个对象中不同的属性值
```java
/**
 * @author vincent
 */
@Retention(RetentionPolicy.RUNTIME)
public @interface TransferETC {
    String name();
    boolean required() default true;
}
```

```java
/**
 * @author vincent
 */
public class ReflectExerciseDemo {

    @Data
    public static class PersonalInfoDto {

        @TransferETC(name = "姓名")
        private String name;

        @TransferETC(name = "年纪")
        private Integer age;

        @TransferETC(name = "性别")
        private String gender;

        @TransferETC(name = "住址")
        private String address;

        private String hobby;
    }


    @Data
    private static class Desc {
        private String fieldName;

        private String newOne;

        private String oldOne;
    }

    /**
     * 比较两个对象中不同的属性值
     *
     * @param t1
     * @param t2
     * @param <T>
     * @return
     */
    private <T> List<Desc> compareTo(T t1, T t2) {
        return Arrays.stream(t1.getClass().getDeclaredFields())
                .filter(field -> {
                    try {
                        field.setAccessible(true);
                        return !Objects.equals(field.get(t1), field.get(t2));
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                        throw new RuntimeException(e);
                    }
                })
                .filter(item -> item.isAnnotationPresent(TransferETC.class))
                .map(field -> {
                    try {
                        Desc desc = new Desc();
                        desc.setFieldName(field.getName());
                        desc.setNewOne(field.get(t1).toString());
                        desc.setOldOne(field.get(t2).toString());
                        TransferETC annotation = field.getAnnotation(TransferETC.class);
                        Optional.ofNullable(annotation).map(TransferETC::name).filter(StringUtils::isNotEmpty).ifPresent(desc::setFieldName);
                        return desc;
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                        throw new RuntimeException(e);
                    }
                }).collect(Collectors.toList());
    }


    @Test
    public void t() {
        PersonalInfoDto infoDto = new PersonalInfoDto();
        infoDto.setName("小囧");
        infoDto.setAge(20);
        infoDto.setGender("男");
        infoDto.setAddress("上海");
        infoDto.setHobby("篮球");

        PersonalInfoDto infoDto2 = new PersonalInfoDto();
        infoDto2.setName("小乐");
        infoDto2.setAge(21);
        infoDto2.setGender("男");
        infoDto2.setAddress("北京");
        infoDto2.setHobby("足球");

        List<Desc> descs = compareTo(infoDto, infoDto2);
        System.out.println(JSON.toJSONString(descs, SerializerFeature.PrettyFormat));
    }
}
```

显示结果：
```
[
	{
		"fieldName":"姓名",
		"newOne":"小囧",
		"oldOne":"小乐"
	},
	{
		"fieldName":"年纪",
		"newOne":"20",
		"oldOne":"21"
	},
	{
		"fieldName":"住址",
		"newOne":"上海",
		"oldOne":"北京"
	}
]
```

## 把对象的属性名转化成中文展示
```java
/**
 * @author vincent
 */
public class ReflectExerciseDemo {

    @Data
    public static class PersonalInfoDto {

        @TransferETC(name = "姓名")
        private String name;

        @TransferETC(name = "年纪")
        private Integer age;

        @TransferETC(name = "性别")
        private String gender;

        @TransferETC(name = "住址")
        private String address;

        private String hobby;
    }

    /**
     * 把对象的属性名转化成中文展示
     *
     * @param t
     * @param <T>
     * @return
     */
    private <T> String transferFields(T t) {
        return Arrays.stream(t.getClass().getDeclaredFields())
                .filter(item -> item.isAnnotationPresent(TransferETC.class))
                .map(field -> {
                    try {
                        field.setAccessible(true);
                        return String.format("%s：%s", field.getAnnotation(TransferETC.class).name(), field.get(t));
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                        throw new RuntimeException(e);
                    }
                }).collect(Collectors.joining("；"));
    }

    @Test
    public void t2() {
        PersonalInfoDto infoDto = new PersonalInfoDto();
        infoDto.setName("小草");
        infoDto.setAge(18);
        infoDto.setGender("女");
        infoDto.setAddress("上海");
        infoDto.setHobby("跑步");

        String transferFields = transferFields(infoDto);
        System.out.println(transferFields);
    }
}
```

显示结果：
```
姓名：小草；年纪：18；性别：女；住址：上海
```

案例源码：https://github.com/V-Vincen/reflect