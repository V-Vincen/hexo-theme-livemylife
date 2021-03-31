---
title: 反射、自定义注解、Lambda 结合练习
catalog: true
date: 2020-08-21 18:53:12
subtitle: Reflect、Annotation and Lambda
header-img: /img/header_img/lml_bg2.jpg
tags:
- JDK8
- Reflect
- Annotation
---

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

## 自定义对象属性非空验证
### 未引用 `vavr` 依赖的写法
```java
/**
 * @author vincent
 */
@FunctionalInterface
public interface CheckedFunction<T, R> {
    R apply(T t) throws Exception;
}
```

```java
/**
 * @author vincent
 */
public class CheckedWrapFunction {
    static <T, R> Function<T, R> wrap(CheckedFunction<T, R> checkedFunction) {
        return t -> {
            try {
                return checkedFunction.apply(t);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        };
    }
}
```

```java
/**
 * @author vincent
 */
@FunctionalInterface
public interface CheckedPredicate<T> {
    boolean test(T t) throws Exception;
}
```

```java
/**
 * @author vincent
 */
public class CheckedWrapPredicate {
    static <T> Predicate<T> wrap(CheckedPredicate<T> checkedPredicate) {
        return t -> {
            try {
                return checkedPredicate.test(t);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        };
    }
}
```

```java
/**
 * @author vincent
 */
@Retention(RetentionPolicy.RUNTIME)
public @interface NotBlank {
    String message() default "";
    IntegrationResultCode resultCode() default IntegrationResultCode.UNKNOWN;
}
```

```java
/**
 * @author vincent
 */
@Data
public class FieldError {
    private String fieldName;
    private String errorMsg;
    private IntegrationResultCode resultCode;
}
```

```java
/**
 * @author vincent
 */
public enum IntegrationResultCode {

    UNKNOWN("-1", "未知异常"),

    PARAM_NOT_NULL_ERROR("191099", "参数不能为空"),

    PARTNER_CODE_NOT_EMPTY("191097", "企业编码不能为空"),

    ORDERIDS_NOT_EMPTY("191096", "订单号不能为空"),

    INVOICE_TITLE_NOT_EMPTY("191095", "发票抬头不能为空"),

    SOCIAL_CREDIT_CODE_NOT_EMPTY("191094", "社会信用代码不能为空"),

    ORDERS_NOT_EMPTY("191092", "需要开具发票的订单不能为空"),

    USERNAME_NOT_EMPTY("191091", "用户姓名不能为空"),

    DATETIME_NOT_EMPTY("191089", "开票时间不能为空");

    private String code;

    private String msg;

    IntegrationResultCode(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public String getCode() {
        return code;
    }

    public String getMsg() {
        return msg;
    }
}
```

```java
/**
 * @author vincent
 */
@Data
public class InvoiceRequestQueryApiDto implements Serializable {

    private Long partnerId;

    /**
     * 企业编码
     */
    @NotBlank(resultCode = IntegrationResultCode.PARTNER_CODE_NOT_EMPTY)
    private String partnerCode;

    /**
     * 发票抬头
     */
    @NotBlank(resultCode = IntegrationResultCode.INVOICE_TITLE_NOT_EMPTY)
    private String invoiceTitle;

    /**
     * 社会信用代码
     */
    @NotBlank(resultCode = IntegrationResultCode.SOCIAL_CREDIT_CODE_NOT_EMPTY)
    private String socialCreditCode;

    /**
     * 开票类型
     */
    private String type;

    @NotBlank(resultCode = IntegrationResultCode.ORDERS_NOT_EMPTY)
    private List<Orders> orders;

    @Data
    public static class Orders implements Serializable {
        /**
         * 需要开具发票的订单号
         */
        @NotBlank(resultCode = IntegrationResultCode.ORDERIDS_NOT_EMPTY)
        private Long orderId;
        private Travellers travellers;
    }

    @Data
    public static class Travellers implements Serializable {
        private String userName;
        private String email;
    }
}
```

```java
/**
 * @author vincent
 */
public class Validate {
    public static <T> List<FieldError> check(T t) {
        // 获取类中的所以属性
        List<Field> allFields = getAllFields(t.getClass());
        return allFields.stream()
                .filter(field -> field.isAnnotationPresent(NotBlank.class))
                .peek(field -> field.setAccessible(true))
                .filter(CheckedWrapPredicate.wrap(field -> Objects.isNull(field.get(t)) || Objects.equals(field.get(t), "")
                        || (field.get(t) instanceof List) || (field.get(t) instanceof String && StringUtils.isBlank(field.get(t).toString()))))
                .map(CheckedWrapFunction.wrap(field -> {
                    if (field.getType().isAssignableFrom(List.class) && CollectionUtils.isNotEmpty((List) field.get(t))) {
                        List<?> list = (List) field.get(t);
                        List<FieldError> fieldErrors = list.stream()
                                .map(Validate::check)
                                .flatMap(Collection::stream)
                                .collect(Collectors.toList());
                        if (CollectionUtils.isNotEmpty(fieldErrors)) {
                            return fieldErrors.get(0);
                        }
                    } else {
                        FieldError fieldError = new FieldError();
                        fieldError.setFieldName(field.getName());
                        NotBlank annotation = field.getAnnotation(NotBlank.class);
                        String message = StringUtils.isEmpty(annotation.message()) ? annotation.resultCode().getMsg() : annotation.message();
                        IntegrationResultCode resultCode = StringUtils.isEmpty(annotation.message()) ? annotation.resultCode() : null;
                        fieldError.setErrorMsg(message);
                        fieldError.setResultCode(resultCode);
                        return fieldError;
                    }
                    return null;
                }))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private static List<Field> getAllFields(Class<?> clazz) {
        return getAllFields(clazz, Lists.newArrayList());
    }

    private static List<Field> getAllFields(Class<?> clazz, List<Field> fields) {
        List<Field> fieldList = Arrays.stream(clazz.getDeclaredFields()).collect(Collectors.toList());
        fields.addAll(fieldList);
        Class<?> superclass = clazz.getSuperclass();
        if (Objects.isNull(superclass)) {
            return fields;
        } else {
            return getAllFields(superclass, fields);
        }
    }
}
```

### 引用 `vavr` 依赖的写法
```xml
<!-- lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.10</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13</version>
        </dependency>

        <!-- commons-lang3 -->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
            <version>3.9</version>
        </dependency>

        <!-- commons-collections4 -->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-collections4</artifactId>
            <version>4.4</version>
        </dependency>

        <!-- guava -->
        <dependency>
            <groupId>com.google.guava</groupId>
            <artifactId>guava</artifactId>
            <version>29.0-jre</version>
        </dependency>

        <!-- vavr -->
        <dependency>
            <groupId>io.vavr</groupId>
            <artifactId>vavr</artifactId>
            <version>0.10.2</version>
        </dependency>
```

```java
/**
 * @author vincent
 */
@Retention(RetentionPolicy.RUNTIME)
public @interface NotBlank {
    String message() default "";
    IntegrationResultCode resultCode() default IntegrationResultCode.UNKNOWN;
}
```

```java
/**
 * @author vincent
 */
@Data
public class FieldError {
    private String fieldName;
    private String errorMsg;
    private IntegrationResultCode resultCode;
}
```

```java
/**
 * @author vincent
 */
public enum IntegrationResultCode {

    UNKNOWN("-1", "未知异常"),

    PARAM_NOT_NULL_ERROR("191099", "参数不能为空"),

    PARTNER_CODE_NOT_EMPTY("191097", "企业编码不能为空"),

    ORDERIDS_NOT_EMPTY("191096", "订单号不能为空"),

    INVOICE_TITLE_NOT_EMPTY("191095", "发票抬头不能为空"),

    SOCIAL_CREDIT_CODE_NOT_EMPTY("191094", "社会信用代码不能为空"),

    ORDERS_NOT_EMPTY("191092", "需要开具发票的订单不能为空"),

    USERNAME_NOT_EMPTY("191091", "用户姓名不能为空"),

    DATETIME_NOT_EMPTY("191089", "开票时间不能为空");

    private String code;

    private String msg;

    IntegrationResultCode(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public String getCode() {
        return code;
    }

    public String getMsg() {
        return msg;
    }
}
```

```java
/**
 * @author vincent
 */
@Data
public class InvoiceRequestQueryApiDto implements Serializable {

    private Long partnerId;

    /**
     * 企业编码
     */
    @NotBlank(resultCode = IntegrationResultCode.PARTNER_CODE_NOT_EMPTY)
    private String partnerCode;

    /**
     * 发票抬头
     */
    @NotBlank(resultCode = IntegrationResultCode.INVOICE_TITLE_NOT_EMPTY)
    private String invoiceTitle;

    /**
     * 社会信用代码
     */
    @NotBlank(resultCode = IntegrationResultCode.SOCIAL_CREDIT_CODE_NOT_EMPTY)
    private String socialCreditCode;

    /**
     * 开票类型
     */
    private String type;

    @NotBlank(resultCode = IntegrationResultCode.ORDERS_NOT_EMPTY)
    private List<Orders> orders;

    @Data
    public static class Orders implements Serializable {
        /**
         * 需要开具发票的订单号
         */
        @NotBlank(resultCode = IntegrationResultCode.ORDERIDS_NOT_EMPTY)
        private Long orderId;
        private Travellers travellers;
    }

    @Data
    public static class Travellers implements Serializable {
        private String userName;
        private String email;
    }
}
```

```java
/**
 * @author vincent
 */
public class VavrValidate {
    public static <T> List<FieldError> check(T t) {
        Field[] allFields = FieldUtils.getAllFields(t.getClass());
        return Arrays.stream(allFields)
                .filter(field -> field.isAnnotationPresent(NotBlank.class))
                .peek(field -> field.setAccessible(true))
                .filter(CheckedPredicate.<Field>of(
                        field -> Objects.isNull(field.get(t)) || Objects.equals(field.get(t), "") || (field.get(t) instanceof List) ||
                                (field.get(t) instanceof String && StringUtils.isBlank(field.get(t).toString()))
                        ).unchecked()
                )
                .map(CheckedFunction1.<Field, FieldError>of(
                        field -> {
                            if (field.getType().isAssignableFrom(List.class) && CollectionUtils.isNotEmpty((List) field.get(t))) {
                                List<?> list = (List) field.get(t);
                                List<FieldError> fieldErrors = list.stream()
                                        .map(Validate::check)
                                        .flatMap(Collection::stream)
                                        .collect(Collectors.toList());
                                if (CollectionUtils.isNotEmpty(fieldErrors)) {
                                    return fieldErrors.get(0);
                                }
                            } else {
                                FieldError fieldError = new FieldError();
                                fieldError.setFieldName(field.getName());
                                NotBlank annotation = field.getAnnotation(NotBlank.class);
                                String message = StringUtils.isEmpty(annotation.message()) ? annotation.resultCode().getMsg() : annotation.message();
                                IntegrationResultCode resultCode = StringUtils.isEmpty(annotation.message()) ? annotation.resultCode() : null;
                                fieldError.setErrorMsg(message);
                                fieldError.setResultCode(resultCode);
                                return fieldError;
                            }
                            return null;
                        })
                        .unchecked()
                )
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}
```

### 测试
```java
/**
 * @author vincent
 */
public class ValidateTest {

    @Test
    public void t() {
        InvoiceRequestQueryApiDto queryApiDto = new InvoiceRequestQueryApiDto();
        InvoiceRequestQueryApiDto.Orders orders = new InvoiceRequestQueryApiDto.Orders();
        queryApiDto.setOrders(Lists.newArrayList(orders));

        List<FieldError> check = Validate.check(queryApiDto);
        check.forEach(System.out::println);
    }

    @Test
    public void t2(){
        InvoiceRequestQueryApiDto queryApiDto = new InvoiceRequestQueryApiDto();
        InvoiceRequestQueryApiDto.Orders orders = new InvoiceRequestQueryApiDto.Orders();
        queryApiDto.setOrders(Lists.newArrayList(orders));

        List<FieldError> check = VavrValidate.check(queryApiDto);
        check.forEach(System.out::println);
    }
}
```

### 结果显示相同
```
FieldError(fieldName=partnerCode, errorMsg=企业编码不能为空, resultCode=PARTNER_CODE_NOT_EMPTY)
FieldError(fieldName=invoiceTitle, errorMsg=发票抬头不能为空, resultCode=INVOICE_TITLE_NOT_EMPTY)
FieldError(fieldName=socialCreditCode, errorMsg=社会信用代码不能为空, resultCode=SOCIAL_CREDIT_CODE_NOT_EMPTY)
FieldError(fieldName=orderId, errorMsg=订单号不能为空, resultCode=ORDERIDS_NOT_EMPTY)
```

案例源码：https://github.com/V-Vincen/reflect