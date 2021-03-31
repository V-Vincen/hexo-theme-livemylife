---
title: '[JDK8] 6 Lambda 表达式练习'
catalog: true
date: 2020-04-07 18:30:29
subtitle: Practice something...
top: 998
header-img: /img/java8/java8_bg.png
tags:
- JDK8
---

先来写个基本类
```java
public class LambdaTest {
    @Data
    class Student {
        private Integer id;
        private String name;
        private Integer age;

        public Student(Integer id, String name, Integer age) {
            this.id = id;
            this.name = name;
            this.age = age;
        }
    }

    public List<Student> getStudents() {
        List<Student> list = new ArrayList<>();
        list.add(new Student(100, "小明", 10));
        list.add(new Student(101, "小红", 11));
        list.add(new Student(102, "小李", 12));
        list.add(new Student(103, "小王", 13));
        list.add(new Student(104, "小张", 14));
        list.add(new Student(105, "小五", 15));
        list.add(new Student(106, "小华", 16));
        return list;
    }
}
```

## `sorted()` 四种排序
```java
    @Test
    public void sortedTest() {
        List<Student> students = this.getStudents();
        //正序：常规写法
        List<Student> collect = students.stream().sorted((a1, a2) -> Integer.compare(a1.getAge(), a2.getAge())).collect(Collectors.toList());
        collect.forEach(System.out::println);
        System.out.println();
        //正序：lambda 简写
        List<Student> collectComparator = students.stream().sorted(Comparator.comparing(Student::getAge)).collect(Collectors.toList());
        collectComparator.forEach(System.out::println);
        System.out.println();

        //倒序：常规写法
        List<Student> collectReversed = students.stream().sorted((a1, a2) -> Integer.compare(a2.getAge(), a1.getAge())).collect(Collectors.toList());
        collectReversed.forEach(System.out::println);
        System.out.println();
        //正序：lambda 简写
        List<Student> collectComparatorReversed = students.stream().sorted(Comparator.comparing(Student::getAge).reversed()).collect(Collectors.toList());
        collectComparatorReversed.forEach(System.out::println);
    }
```

## `List` 转 `Map`
```java
    @Test
    public void listToMapTest() {
        List<Student> students = this.getStudents();
        Map<Integer, Student> collect = students.stream().collect(Collectors.toMap(Student::getId, s -> s, (s1, s2) -> s1));
        collect.keySet().forEach(key -> System.out.println(String.format("key：%s，value：%s", key, collect.get(key))));
    }
```

## `map` 映射
```java
    @Test
    public void mapTest() {
        List<Student> students = this.getStudents();
//        List<Student> students = Lists.newArrayList(new Student(null, "小炎姬", 5));
        Integer id = students.stream().map(Student::getId).max(Integer::compareTo).orElse(0);
        System.out.println(id);
    }
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

## `BiConsumer<T, U>`
```xml
<!-- lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.12</version>
</dependency>
        
<!-- guava -->
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>28.2-jre</version>
</dependency>
```

```java
/**
 * @author vincent
 */
public class LambdaTest {
    @Data
    private static class Student {
        private Integer id;
        private String name;
        private Integer age;
        private Integer interestType;
        private List<Hobby> hobbies;
        private List<Fancy> fancies;
        private Subject subject;

        private Student(Integer id, String name, Integer age, Integer interestType, List<Hobby> hobbies, List<Fancy> fancies, Subject subject) {
            this.id = id;
            this.name = name;
            this.age = age;
            this.interestType = interestType;
            this.hobbies = hobbies;
            this.fancies = fancies;
            this.subject = subject;
        }

    }

    enum InterestType {
        HOBBY(1, "兴趣"),
        FANCY(2, "喜好");
        private Integer code;
        private String message;

        InterestType(Integer code, String message) {
            this.code = code;
            this.message = message;
        }

        public Integer getCode() {
            return code;
        }

        public static InterestType getInterestTypeByCode(int code) {
            return Arrays.stream(InterestType.values()).filter(interestType -> interestType.getCode() == code).findFirst().orElse(null);
        }

    }

    @Data
    private static class Hobby {
        private String basketball;
        private String running;
        private String drinking;

        private Hobby(String basketball, String running, String drinking) {
            this.basketball = basketball;
            this.running = running;
            this.drinking = drinking;
        }
    }

    @Data
    private static class Fancy {
        private String dance;
        private String takePhotos;
        private String meetGirls;

        private Fancy(String dance, String takePhotos, String meetGirls) {
            this.dance = dance;
            this.takePhotos = takePhotos;
            this.meetGirls = meetGirls;
        }
    }

    @Data
    private static class Subject {
        private String english;
        private String chinese;
        private String mathematics;

        private Subject(String english, String chinese, String mathematics) {
            this.english = english;
            this.chinese = chinese;
            this.mathematics = mathematics;
        }
    }

    private List<Student> getStudent() {
        List<Student> list = Lists.newArrayList();
        list.add(new Student(100, "小明", 10, 1,
                Lists.newArrayList(
                        new Hobby("篮球", "跑步", "喝酒"),
                        new Hobby("篮球_1", "跑步_1", "喝酒_1"),
                        new Hobby("篮球_2", "跑步_2", "喝酒_2"),
                        new Hobby("篮球_3", "跑步_3", "喝酒_3")
                ),
                Lists.newArrayList(
                        new Fancy("街舞", "摄影", "泡妞"),
                        new Fancy("街舞_1", "摄影_1", "泡妞_1"),
                        new Fancy("街舞_2", "摄影_2", "泡妞_2"),
                        new Fancy("街舞_3", "摄影_3", "泡妞_3")
                ),
                new Subject("英语", "语文", "数学")
        ));
        list.add(new Student(200, "小红", 10, 2,
                Lists.newArrayList(
                        new Hobby("篮球", "跑步", "喝酒"),
                        new Hobby("篮球_1", "跑步_1", "喝酒_1"),
                        new Hobby("篮球_2", "跑步_2", "喝酒_2"),
                        new Hobby("篮球_3", "跑步_3", "喝酒_3")
                ),
                Lists.newArrayList(
                        new Fancy("街舞", "摄影", "泡妞"),
                        new Fancy("街舞_1", "摄影_1", "泡妞_1"),
                        new Fancy("街舞_2", "摄影_2", "泡妞_2"),
                        new Fancy("街舞_3", "摄影_3", "泡妞_3")
                ),
                new Subject("英语", "语文", "数学")
        ));
        return list;
    }

    @Data
    private static class Person {
        private Integer pid;
        private String pname;
        private Integer page;
        private String interest;
        private String subject;
    }


    private final static BiConsumer<Person, Student> HOBBY = (person, student) -> {
        Optional.ofNullable(student.getHobbies())
                .flatMap(hobbies -> hobbies.stream().findFirst())
                .ifPresent(hobby -> person.setInterest(hobby.getDrinking()));
        Optional.ofNullable(student.subject).ifPresent(subject -> person.setSubject(subject.getEnglish()));
    };

    private final static BiConsumer<Person, Student> FANCY = (person, student) -> {
        Optional.ofNullable(student.getFancies())
                .flatMap(fancies -> fancies.stream().findFirst())
                .ifPresent(fancy -> person.setInterest(fancy.getDance()));
        Optional.ofNullable(student.subject).ifPresent(subject -> person.setSubject(subject.getMathematics()));
    };

    private final static ImmutableMap<InterestType, BiConsumer<Person, Student>> OF = ImmutableMap.of(
            InterestType.HOBBY, HOBBY,
            InterestType.FANCY, FANCY
    );

    /**
     * BiConsumer<T, U> 实例
     */
    @Test
    public void t() {
        List<Student> studentList = getStudent();
        List<Object> collect = studentList.stream().map(student -> {
            Person person = new Person();
            Optional.ofNullable(student).ifPresent(stu -> {
                person.setPid(stu.getId());
                person.setPname(stu.getName());
                person.setPage(stu.getAge());

                Integer interestType = student.getInterestType();
                InterestType interestTypeByCode = InterestType.getInterestTypeByCode(interestType);
                person.setInterest(interestTypeByCode.message);

                OF.get(interestTypeByCode).accept(person, student);
            });
            return person;
        }).collect(Collectors.toList());

        System.out.println(collect);
    }
}
```


## `T reduce(T identity, BinaryOperator<T> accumulator)`
```xml
<!-- commons-lang3 -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.9</version>
</dependency>
```

```java
/**
 * @author vincent
 */
public class LambdaTest {
  @Data
    private static class trip {
        private String departure;
        private String destination;

        private trip(String departure, String destination) {
            this.departure = departure;
            this.destination = destination;
        }
    }

    /**
     * reduce 规则：
     * 例子：1.上海 -> 北京
     *      2.北京 -> 上海
     *      3.天津 -> 西安
     *      4.拉萨 -> 灵芝
     *      5.灵芝 -> 兰州
     *      6.兰州 -> 西宁
     * 展示效果：上海-北京-上海,天津-西安,拉萨-灵芝-兰州-西宁
     */
    private static final BinaryOperator<String> ACCUMULATOR = (v1, v2) -> {
        if (StringUtils.isEmpty(v1)) {
            return v2;
        }
        String[] item = StringUtils.split(v1, ",");
        String[] lastOfItem = StringUtils.split(item[item.length - 1], "-");
        String lastElement = lastOfItem[lastOfItem.length - 1];
        String[] nextItem = StringUtils.split(v2, "-");
        String startElement = nextItem[0];
        if (StringUtils.equals(lastElement, startElement)) {
            return v1 + "-" + nextItem[nextItem.length - 1];
        }
        return v1 + "," + v2;
    };

    @Test
    public void t2() {
        List<trip> list = Lists.newArrayList(
                new trip("上海", "北京"),
                new trip("北京", "上海"),
                new trip("天津", "西安"),
                new trip("拉萨", "灵芝"),
                new trip("灵芝", "兰州"),
                new trip("兰州", "西宁")
        );

        //[上海-北京-上海,天津-西安,拉萨-灵芝-兰州-西宁]
        String reduce = list.stream()
                .map(t -> String.format("%s-%s", t.getDeparture(), t.getDestination()))
                .reduce("", ACCUMULATOR);
        System.out.println(reduce);
    }
}
```

## `allMatch(Predicate p)`
```java
    public static final String YYYYMMDD = "yyyyMMdd";
    public static final String YYYY_MM_DD = "yyyy-MM-dd";
    public static final String YYYY_MM_DD_HH_MM = "yyyy-MM-dd HH:mm";
    public static final String YYYY_MM_DD_HH_MM_SS = "yyyy-MM-dd HH:mm:ss";
    public static final String YYYY__MM__DD = "yyyy/MM/dd";
    public static final String YYYY__MM__DD_HH_MM = "yyyy/MM/dd HH:mm";
    public static final String YYYY__MM__DD_HH_MM_SS = "yyyy/MM/dd HH:mm:ss";

    @Test
    public void t3() {
        @Data
        class DateValidate {
            private String date;
            private String dateFormat;

            public DateValidate(String date, String dateFormat) {
                this.date = date;
                this.dateFormat = dateFormat;
            }
        }
        List<DateValidate> list = Lists.newArrayList(
                new DateValidate("202086", YYYYMMDD),
                new DateValidate("2020086", YYYYMMDD),
                new DateValidate("2020806", YYYYMMDD),
                new DateValidate("20200806", YYYYMMDD),
                new DateValidate("20200806 19", null),
                new DateValidate("20200806 19:00", null),
                new DateValidate("20200806 19:00:00", null),
                new DateValidate("2020-8-06", YYYY_MM_DD),
                new DateValidate("2020-08-6", YYYY_MM_DD),
                new DateValidate("2020-08-06", YYYY_MM_DD),
                new DateValidate("2020-08-06 19", null),
                new DateValidate("2020-08-06 19:00", YYYY_MM_DD_HH_MM),
                new DateValidate("2020-08-06 19:00:00", YYYY_MM_DD_HH_MM_SS),
                new DateValidate("2020/8/06", YYYY__MM__DD),
                new DateValidate("2020/08/6", YYYY__MM__DD),
                new DateValidate("2020/08/06", YYYY__MM__DD),
                new DateValidate("2020/08/06 19", null),
                new DateValidate("2020/08/06 19:00", YYYY__MM__DD_HH_MM),
                new DateValidate("2020/08/06 19:00:00", YYYY__MM__DD_HH_MM_SS)
        );

        list.forEach(item -> {
            boolean matchDateTime = matchDateTime(item.getDate());
            System.out.println(item.getDate() + " (" + item.getDateFormat() + ")：matchDateTime -> " + matchDateTime);
        });
    }

    /**
     * 时间校验
     * @param dateTime
     * @return
     */
    public static boolean matchDateTime(String dateTime) {
        if (StringUtils.isEmpty(dateTime)) {
            return false;
        }
        String[] dt = dateTime.split("\\s+");
        if (dt.length == 1) {
            return dateMatch(dt[0], "/") || dateMatch(dt[0], "-");
        } else {
            String date = dt[0];
            String time = dt[1];
            return (dateMatch(date, "/") || dateMatch(date, "-")) && timeMatch(time, ":");
        }
    }

    private static boolean timeMatch(String s, String split) {
        if (StringUtils.isEmpty(s)) {
            return true;
        }

        s = StringUtils.trim(s);
        String[] time = StringUtils.split(s, split);
        boolean isNumber = Arrays.stream(time).anyMatch(StringUtils::isNumeric);
        if (!isNumber) {
            return false;
        }

        if (time.length != 3) {
            return false;
        }

        if (time[0].length() > 2 || Integer.parseInt(time[0]) > 24) {
            return false;
        }


        if (time[1].length() > 2 || Integer.parseInt(time[1]) > 60) {
            return false;
        }

        if (time[2].length() > 2 || Integer.parseInt(time[2]) > 60) {
            return false;
        }

        return true;
    }

    private static boolean dateMatch(String s, String spl) {
        if (StringUtils.isEmpty(s)) {
            return false;
        }
        s = StringUtils.trim(s);
        String[] date = StringUtils.split(s, spl);
        boolean isNumber = Arrays.stream(date).anyMatch(StringUtils::isNumeric);
        if (!isNumber) {
            return false;
        }

        if (date.length != 3) {
            return false;
        }

        if (date[0].length() != 4) {
            return false;
        }

        if (Integer.parseInt(date[1]) > 12) {
            return false;
        }

        if (Integer.parseInt(date[2]) > 31) {
            return false;
        }

        return true;
    }
```

显示结果
```
202086 (yyyyMMdd)：matchDateTime -> false
2020086 (yyyyMMdd)：matchDateTime -> false
2020806 (yyyyMMdd)：matchDateTime -> false
20200806 (yyyyMMdd)：matchDateTime -> false
20200806 19 (null)：matchDateTime -> false
20200806 19:00 (null)：matchDateTime -> false
20200806 19:00:00 (null)：matchDateTime -> false
2020-8-06 (yyyy-MM-dd)：matchDateTime -> true
2020-08-6 (yyyy-MM-dd)：matchDateTime -> true
2020-08-06 (yyyy-MM-dd)：matchDateTime -> true
2020-08-06 19 (null)：matchDateTime -> false
2020-08-06 19:00 (yyyy-MM-dd HH:mm)：matchDateTime -> false
2020-08-06 19:00:00 (yyyy-MM-dd HH:mm:ss)：matchDateTime -> true
2020/8/06 (yyyy/MM/dd)：matchDateTime -> true
2020/08/6 (yyyy/MM/dd)：matchDateTime -> true
2020/08/06 (yyyy/MM/dd)：matchDateTime -> true
2020/08/06 19 (null)：matchDateTime -> false
2020/08/06 19:00 (yyyy/MM/dd HH:mm)：matchDateTime -> false
2020/08/06 19:00:00 (yyyy/MM/dd HH:mm:ss)：matchDateTime -> true
```

## `groupingBy(Function f)`
```java
    @Test
    public void t5() {
        @Data
        class Stu {
            private Integer id;
            private String name;
            private Long money;

            public Stu(Integer id, String name, Long money) {
                this.id = id;
                this.name = name;
                this.money = money;
            }
        }

        List<Stu> list = Lists.newArrayList(
                new Stu(1, "小明", 100L),
                new Stu(1, "小红", 200L),
                new Stu(2, "小黄", 200L),
                new Stu(2, "小紫", 200L)
        );

        Map<Integer, List<Stu>> collect = list.stream().collect(Collectors.groupingBy(Stu::getId));
        System.out.println(JSON.toJSONString(collect, SerializerFeature.PrettyFormat));
    }
```

显示结果
```
{1:[
		{
			"id":1,
			"money":100,
			"name":"小明"
		},
		{
			"id":1,
			"money":200,
			"name":"小红"
		}
	],2:[
		{
			"id":2,
			"money":200,
			"name":"小黄"
		},
		{
			"id":2,
			"money":200,
			"name":"小紫"
		}
	]
}
```

## `flatMap(Function f)`
```java
    @Data
    private static class TravelInfo {
        private String trip;
        private String hotelName;
        private List<Order> orders;

        public TravelInfo(String trip, String hotelName, List<Order> orders) {
            this.trip = trip;
            this.hotelName = hotelName;
            this.orders = orders;
        }
    }

    @Data
    private static class Order {
        private Long orderId;
        private List<Travellers> travellers;

        public Order(Long orderId, List<Travellers> travellers) {
            this.orderId = orderId;
            this.travellers = travellers;
        }
    }

    @Data
    private static class Travellers {
        private String userName;
        private String email;

        public Travellers() {
        }

        public Travellers(String userName, String email) {
            this.userName = userName;
            this.email = email;
        }
    }

    /**
     * flatMap(Function f)：扁平化
     */
    @Test
    public void t5() {
        TravelInfo travelInfo = new TravelInfo("三人行", "天上人间",
                Lists.newArrayList(
                        new Order(123456789L, Lists.newArrayList(
                                new Travellers("zhangSanFirst", "zhangSanFirst@qq.com"),
                                new Travellers("zhangSanSecond", "zhangSanSecond@qq.com")
                        )),
                        new Order(987654321L, Lists.newArrayList(
                                new Travellers("liSiFirst", "zhangSanFirst@qq.com"),
                                new Travellers("liSiSecond", "zhangSanSecond@qq.com")
                        )),
                        new Order(987654322L, Lists.newArrayList(
                                new Travellers("wangWu", "wangWu@qq.com")
                        )),
                        new Order(987654323L, Lists.newArrayList()),
                        new Order(987654323L, null)
                ));
        System.out.println(JSON.toJSONString(travelInfo, SerializerFeature.PrettyFormat));
        System.out.println();

        List<String> email = travelInfo.getOrders().stream()
                .filter(Objects::nonNull)
                .map(Order::getTravellers)
                .filter(CollectionUtils::isNotEmpty)
                .flatMap(Collection::stream)
                .filter(Objects::nonNull)
                .map(Travellers::getEmail)
                .collect(Collectors.toList());
        System.out.println(email);
    }
```

显示结果
```
{
	"hotelName":"天上人间",
	"orders":[
		{
			"orderId":123456789,
			"travellers":[
				{
					"email":"zhangSanFirst@qq.com",
					"userName":"zhangSanFirst"
				},
				{
					"email":"zhangSanSecond@qq.com",
					"userName":"zhangSanSecond"
				}
			]
		},
		{
			"orderId":987654321,
			"travellers":[
				{
					"email":"zhangSanFirst@qq.com",
					"userName":"liSiFirst"
				},
				{
					"email":"zhangSanSecond@qq.com",
					"userName":"liSiSecond"
				}
			]
		},
		{
			"orderId":987654322,
			"travellers":[
				{
					"email":"wangWu@qq.com",
					"userName":"wangWu"
				}
			]
		},
		{
			"orderId":987654323,
			"travellers":[]
		},
		{
			"orderId":987654323
		}
	],
	"trip":"三人行"
}

[zhangSanFirst@qq.com, zhangSanSecond@qq.com, zhangSanFirst@qq.com, zhangSanSecond@qq.com, wangWu@qq.com]
```

## `Optional.ofNullable(T t)` 和 `T orElse(T other)`
```java
    @Data
    private class PaymentDto {
        private Long id;
        private String liqAccountName;
        /**
         * 来款业务：COMPANY-企业来款；OFFLINE-订单线下收款
         */
        private String paymentMode;
        private List<ClaimDto> claimDto;
        private List<OrderClaimDto> orderClaimDto;

        public PaymentDto(Long id, String liqAccountName, String paymentMode, List<ClaimDto> claimDto, List<OrderClaimDto> orderClaimDto) {
            this.id = id;
            this.liqAccountName = liqAccountName;
            this.paymentMode = paymentMode;
            this.claimDto = claimDto;
            this.orderClaimDto = orderClaimDto;
        }
    }

    @Data
    private static class ClaimDto {
        private Long paymentId;
        private String partnerName;
        private Integer amount;

        public ClaimDto(Long paymentId, String partnerName, Integer amount) {
            this.paymentId = paymentId;
            this.partnerName = partnerName;
            this.amount = amount;
        }
    }

    @Data
    private static class OrderClaimDto {
        private Long paymentId;
        private Integer amount;

        public OrderClaimDto(Long paymentId, Integer amount) {
            this.paymentId = paymentId;
            this.amount = amount;
        }
    }

    @Data
    private static class PaymentApiDto {
        private Long id;
        private String liqAccountName;
        private String paymentMode;
        private Long paymentId;
        private String partnerName;
        private Integer amount;
    }

    private List<PaymentDto> getPaymentDto() {
        List<PaymentDto> list = Lists.newArrayList();
        list.add(new PaymentDto(123456789L, "收款账户_COMPANY", "COMPANY",
                Lists.newArrayList(
                        new ClaimDto(123456789L, "企业名称1", 999),
                        new ClaimDto(123456789L, "企业名称2", 888),
                        new ClaimDto(123456789L, "企业名称3", 777)
                ),
                Lists.newArrayList(
                        new OrderClaimDto(123456789L, 666),
                        new OrderClaimDto(123456789L, 555)
                )));
        list.add(new PaymentDto(987654321L, "收款账户_OFFLINE", "OFFLINE",
                Lists.newArrayList(
                        new ClaimDto(987654321L, "企业名称1", 999),
                        new ClaimDto(987654321L, "企业名称2", 888)
                ),
                Lists.newArrayList(
                        new OrderClaimDto(987654321L, 666),
                        new OrderClaimDto(987654321L, 555)
                )));
        list.add(new PaymentDto(888888888L, "收款账户", null, null, null));
        return list;
    }


    /**
     * Optional.ofNullable(T t) 和 T orElse(T other)
     */
    @Test
    public void t6() {
        List<PaymentDto> paymentDtos = getPaymentDto();
        paymentDtos.forEach(System.out::println);
        System.out.println();

        /**
         * 根据 paymentMode 把 claimDto、orderClaimDto 集合数据查分为单条数据
         */
        List<PaymentApiDto> collect = paymentDtos
                .stream()
                .map(paymentDto -> {
                    PaymentApiDto apiDto = new PaymentApiDto();
                    apiDto.setId(paymentDto.getId());
                    apiDto.setLiqAccountName(paymentDto.getLiqAccountName());
                    apiDto.setPaymentMode(paymentDto.getPaymentMode());
                    ImmutableList<PaymentApiDto> defaultList = ImmutableList.of(apiDto);

                    if (StringUtils.equals(paymentDto.getPaymentMode(), "COMPANY")) {
                        return Optional.ofNullable(paymentDto.getClaimDto())
                                .map(claimDtos -> claimDtos.stream()
                                        .map(claimDto -> {
                                            PaymentApiDto paymentApiDto = new PaymentApiDto();
                                            paymentApiDto.setId(paymentDto.getId());
                                            paymentApiDto.setLiqAccountName(paymentDto.getLiqAccountName());
                                            paymentApiDto.setPaymentMode(paymentDto.getPaymentMode());
                                            paymentApiDto.setPaymentId(claimDto.getPaymentId());
                                            paymentApiDto.setPartnerName(claimDto.getPartnerName());
                                            paymentApiDto.setAmount(claimDto.getAmount());
                                            return paymentApiDto;
                                        })
                                        .collect(Collectors.toList())
                                )
                                .orElse(defaultList);
                    }
                    if (StringUtils.equals(paymentDto.getPaymentMode(), "OFFLINE")) {
                        return Optional.ofNullable(paymentDto.getOrderClaimDto())
                                .map(orderClaimDtos -> orderClaimDtos.stream()
                                        .map(orderClaimDto -> {
                                            PaymentApiDto paymentApiDto = new PaymentApiDto();
                                            paymentApiDto.setId(paymentDto.getId());
                                            paymentApiDto.setLiqAccountName(paymentDto.getLiqAccountName());
                                            paymentApiDto.setPaymentMode(paymentDto.getPaymentMode());
                                            paymentApiDto.setAmount(orderClaimDto.getAmount());
                                            return paymentApiDto;
                                        })
                                        .collect(Collectors.toList())
                                )
                                .orElse(defaultList);
                    }
                    return defaultList;
                })
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
        collect.forEach(System.out::println);
    }
```

显示结果
```
LambdaTest.PaymentDto(id=123456789, liqAccountName=收款账户_COMPANY, paymentMode=COMPANY, claimDto=[LambdaTest.ClaimDto(paymentId=123456789, partnerName=企业名称1, amount=999), LambdaTest.ClaimDto(paymentId=123456789, partnerName=企业名称2, amount=888), LambdaTest.ClaimDto(paymentId=123456789, partnerName=企业名称3, amount=777)], orderClaimDto=[LambdaTest.OrderClaimDto(paymentId=123456789, amount=666), LambdaTest.OrderClaimDto(paymentId=123456789, amount=555)])
LambdaTest.PaymentDto(id=987654321, liqAccountName=收款账户_OFFLINE, paymentMode=OFFLINE, claimDto=[LambdaTest.ClaimDto(paymentId=987654321, partnerName=企业名称1, amount=999), LambdaTest.ClaimDto(paymentId=987654321, partnerName=企业名称2, amount=888)], orderClaimDto=[LambdaTest.OrderClaimDto(paymentId=987654321, amount=666), LambdaTest.OrderClaimDto(paymentId=987654321, amount=555)])
LambdaTest.PaymentDto(id=888888888, liqAccountName=收款账户, paymentMode=null, claimDto=null, orderClaimDto=null)

LambdaTest.PaymentApiDto(id=123456789, liqAccountName=收款账户_COMPANY, paymentMode=COMPANY, paymentId=123456789, partnerName=企业名称1, amount=999)
LambdaTest.PaymentApiDto(id=123456789, liqAccountName=收款账户_COMPANY, paymentMode=COMPANY, paymentId=123456789, partnerName=企业名称2, amount=888)
LambdaTest.PaymentApiDto(id=123456789, liqAccountName=收款账户_COMPANY, paymentMode=COMPANY, paymentId=123456789, partnerName=企业名称3, amount=777)
LambdaTest.PaymentApiDto(id=987654321, liqAccountName=收款账户_OFFLINE, paymentMode=OFFLINE, paymentId=null, partnerName=null, amount=666)
LambdaTest.PaymentApiDto(id=987654321, liqAccountName=收款账户_OFFLINE, paymentMode=OFFLINE, paymentId=null, partnerName=null, amount=555)
LambdaTest.PaymentApiDto(id=888888888, liqAccountName=收款账户, paymentMode=null, paymentId=null, partnerName=null, amount=null)
```

案例源码：https://github.com/V-Vincen/jdk_18