---
title: '[Reflect] 2 获取运行时类的结构'
catalog: true
date: 2020-04-09 13:52:16
subtitle: 获取运行时类的结构
header-img: /img/reflect/reflect_bg.jpg
tags:
- Reflect
---

## 通过反射获取运行时类的完整结构
**Field、Method、Constructor、Superclass、Interface、Annotation**
- 实现的全部接口
- 所继承的父类
- 全部的构造器
- 全部的方法
- 全部的属性

## 实现的全部接口
**`public Class<?>[] getInterfaces()`**：确定此对象所表示的类或接口实现的接口。

## 所继承的父类
**`public Class<? Super T> getSuperclass()`**：返回表示此 Class 所表示的实体（类、接口、基本类型）的父类的 Class。

## 全部的构造器
**`public Constructor<?>[] getDeclaredConstructors()`**：获取类本身的所有构造方法，包括公有、保护、私有。

**`public Constructor<?>[] getConstructors()`**：获取类本身非私有构造方法。

**`public Constructor<T> getDeclaredConstructor(Class<?>... parameterTypes) throws NoSuchMethodException`**：获取类本身指定的构造方法，parameterTypes 参数类型。

**`public Constructor<T> getConstructor(Class<?>... parameterTypes) throws NoSuchMethodException`**：获取类本身指定的非私有构造方法、parameterTypes 参数类型。

### Constructor 类中：
- **`public int getModifiers()`**：取得修饰符。
- **`public String getName()`**：取得方法名称。
- **`public Class<?>[] getParameterTypes()`**：取得参数的类型。


## 全部的属性
**`public native Field[] getDeclaredFields()`**： 获取类本身的所有字段，包括公有、保护、私有。

**`public Field[] getFields()`**：获取类本身和其所有父类的公有和保护字段。
  
**`public native Field getDeclaredField(String name) throws NoSuchFieldException`**：  获取类本身的指定字段，包括公有、保护、私有，namew 为字段名。

**`public Field getField(String name) throws NoSuchFieldException`**：获取类本身和其所有父类指定的公有和保护字段，name 为字段名。

### Field 方法中：
- **`public int getModifiers()`**：以整数形式返回此 Field 的修饰符。
- **`public Class<?> getType()`**：得到 Field 的属性类型。
- **`public String getName()`**：返回 Field 的名称。

示例：
```
/** 
 * 获取字段的作用域：public、protected、private、abstract、static、final ... 
 */
 Modifier.toString(field.getModifiers());  

/** 
 * 获取字段的类型，配合getSimpleName()使用：int、long、String ... 
 */
field.getType().getSimpleName(); 

/** 
 * 获取字段名称 
 */  
field.getName();  
```

## 全部的方法
**`public Method[] getDeclaredMethods()`**：获取类本身的所有方法，包括公有、保护、私有。 

**`public Method[] getMethods()`**：获取类本身和其所有父类的公有和保护方法。 

**`public Method getDeclaredMethod(String name, Class<?>... parameterTypes) throws NoSuchMethodException`**：获取类本身的指定方法，包括公有、保护、私有，name 为方法名、parameterTypes 为参数类型。
 
**`public Method getMethod(String name, Class<?>... parameterTypes) throws NoSuchMethodException`**：获取类本身和其所有父类指定的公有和保护方法，name 为方法名、parameterTypes 为参数类型。。

### 与 Method 相关的执行方法：

**`public native Object invoke(Object receiver, Object... args) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException`**：执行方法。

**`public native T newInstance(Object... args) throws InstantiationException,IllegalAccessException, IllegalArgumentException, InvocationTargetException`**：执行构造方法。


### Method 类中：
**`public Class<?> getReturnType()`**：取得全部的返回值。
- **`public Class<?>[] getParameterTypes()`**：取得全部的参数。
- **`public int getModifiers()`**：取得修饰符。
- **`public Class<?>[] getExceptionTypes()`**：取得异常信息。

示例：
```
/** 
 * 获取方法的作用域：public、protected、private、abstract、static、final ... 
 */  
Modifier.toString(method.getModifiers());  
/** 
 * 获取方法的返回值类型，配合getSimpleName()使用：int、long、String ... 
 */  
method.getReturnType().getSimpleName();  
/** 
 * 获取方法名称 
 */  
method.getName();  
/** 
 * 获取方法参数 
 */  
Class<?>[] parameterTypes = method.getParameterTypes();  
/** 
 * 获取方法声明所在类 
 */  
method.getDeclaringClass(); 
```

## 补充
### Annotation 相关
**`public <T extends Annotation> T getAnnotation(Class<T> annotationClass)`**：方法将为指定的类型返回此元素的注释。

示例：
```java
/**
 * @author vincent
 */
public class AnnotationDemo {

    @Test
    public void annotationTest() {
        Method[] methods = SampleClass.class.getMethods();

        Annotation annotation = methods[0].getAnnotation(CustomAnnotation.class);
        if (annotation instanceof CustomAnnotation) {
            CustomAnnotation customAnnotation = (CustomAnnotation) annotation;
            System.out.println("name: " + customAnnotation.name());
            System.out.println("value: " + customAnnotation.value());
        }
    }
}

@CustomAnnotation(name = "SampleClass", value = "Sample Class Annotation")
class SampleClass {
    private String sampleField;

    @CustomAnnotation(name = "getSampleMethod", value = "Sample Method Annotation")
    public String getSampleField() {
        return sampleField;
    }

    public void setSampleField(String sampleField) {
        this.sampleField = sampleField;
    }
}

@Retention(RetentionPolicy.RUNTIME)
@interface CustomAnnotation {
    public String name();

    public String value();
}
```

显示结果：
```
name: getSampleMethod
value: Sample Method Annotation
```

**`public Annotation[] getDeclaredAnnotations()`**：返回直接存在于此元素上的所有注释，此方法将忽略继承的注释。

示例：
```java
/**
 * @author vincent 
 */
public class AnnotationDemo2 {
    @Test
    public void annotationTest() throws Exception {
        example();
    }

    // set values for the annotation
    @Demo(str = "Demo Annotation", val = 100)
    // a method to call in the main
    public static void example() throws Exception {
//        AnnotationDemo2 ob = new AnnotationDemo2();
//        Class c = ob.getClass();
        Class<AnnotationDemo2> c = AnnotationDemo2.class;

        // get the method example
        Method m = c.getMethod("example");

        // get the annotations
        Annotation[] annotation = m.getDeclaredAnnotations();

        // print the annotation
        Arrays.stream(annotation).forEach(System.out::println);

    }
}

// declare a new annotation
@Retention(RetentionPolicy.RUNTIME)
@interface Demo {
    String str();

    int val();
}
```

显示结果：
```
@com.example.reflect.Demo(str=Demo Annotation, val=100)
```

**注意**：上面两示例是和自定义注解一起关联使用，也可以和 AOP 一起使用，具体案例可参考[自定义注解](https://v_vincen.gitee.io/2020/03/13/Annotation-%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B3%A8%E8%A7%A3/)。

