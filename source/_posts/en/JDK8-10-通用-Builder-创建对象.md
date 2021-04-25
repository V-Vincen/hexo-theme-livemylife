---
title: '[JDK8] 10 通用 Builder 创建对象'
catalog: true
lang: en
date: 2021-04-21 15:28:39
subtitle:  
header-img: /img/header_img/categories_bg7.jpg
tags:
- JDK8
---

程序员经常会遇到灵魂拷问：你有对象吗？没有，但我可以 new 一个！
```java
public class GirlFriend {
    private String name;
    private int age;
    // 省略 getter & setter ...
    public static void main(String[] args) {
        GirlFriend myGirlFriend = new GirlFriend();
        myGirlFriend.setName("小美");
        myGirlFriend.setAge(18);
    }
}
```

没问题，老铁！但如果对象的属性太多，咋办？
```
public class GirlFriend {
    private String name;
    private int age;
    private int bust;
    private int waist;
    private int hips;
    private List<String> hobby;
    private String birthday;
    private String address;
    private String mobile;
    private String email;
    private String hairColor;
    private Map<String, String> gift;
    // 等等等等 ...
    // 省略 getter & setter ...
    public static void main(String[] args) {
        GirlFriend myGirlFriend = new GirlFriend();
        myGirlFriend.setName("小美");
        myGirlFriend.setAge(18);
        myGirlFriend.setBust(33);
        myGirlFriend.setWaist(23);
        myGirlFriend.setHips(33);
        myGirlFriend.setBirthday("2001-10-26");
        myGirlFriend.setAddress("上海浦东");
        myGirlFriend.setMobile("18688888888");
        myGirlFriend.setEmail("pretty-xiaomei@qq.com");
        myGirlFriend.setHairColor("浅棕色带点微卷");
        List<String> hobby = new ArrayList<>();
        hobby.add("逛街");
        hobby.add("购物");
        hobby.add("买东西");
        myGirlFriend.setHobby(hobby);
        Map<String, String> gift = new HashMap<>();
        gift.put("情人节礼物", "LBR 1912女王时代");
        gift.put("生日礼物", "迪奥烈焰蓝金");
        gift.put("纪念日礼物", "阿玛尼红管唇釉");
        myGirlFriend.setGift(gift);
        // 等等等等 ...
    }
}
```

```
GirlFriend{name='小美'
, age=18
, bust=33
, waist=23
, hips=33
, hobby=[逛街, 购物, 买东西]
, birthday='2001-10-26'
, address='上海浦东'
, mobile='18688888888'
, email='pretty-xiaomei@qq.com'
, hairColor='浅棕色带点微卷'
, gift={情人节礼物=LBR 1912女王时代, 生日礼物=迪奥烈焰蓝金, 纪念日礼物=阿玛尼红管唇釉}
}
```

GirlFriend 是很美，但写起来也太麻烦了吧。说说缺点：实例化和设置属性分开，不好维护，变量名重复写。这里不再介绍其他 Builder 实现方式，直接祭出最实用的通用 Builder。适用于所有类，不需要改造原来类，不需要 lombok 插件支持。先看看使用姿势：
```java
public class GirlFriend {
    // 省略属性 ...
    // 省略 getter & setter ...

    // 为了演示方便，加几个聚合方法
    public void addHobby(String hobby) {
        this.hobby = Optional.ofNullable(this.hobby).orElse(new ArrayList<>());
        this.hobby.add(hobby);
    }
    public void addGift(String day, String gift) {
        this.gift = Optional.ofNullable(this.gift).orElse(new HashMap<>());
        this.gift.put(day, gift);
    }
    public void setVitalStatistics(int bust, int waist, int hips) {
        this.bust = bust;
        this.waist = waist;
        this.hips = hips;
    }
    public static void main(String[] args) {
        GirlFriend myGirlFriend = Builder.of(GirlFriend::new)
                .with(GirlFriend::setName, "小美")
                .with(GirlFriend::setAge, 18)
                .with(GirlFriend::setVitalStatistics, 33, 23, 33)
                .with(GirlFriend::setBirthday, "2001-10-26")
                .with(GirlFriend::setAddress, "上海浦东")
                .with(GirlFriend::setMobile, "18688888888")
                .with(GirlFriend::setEmail, "pretty-xiaomei@qq.com")
                .with(GirlFriend::setHairColor, "浅棕色带点微卷")
                .with(GirlFriend::addHobby, "逛街")
                .with(GirlFriend::addHobby, "购物")
                .with(GirlFriend::addHobby, "买东西")
                .with(GirlFriend::addGift, "情人节礼物", "LBR 1912女王时代")
                .with(GirlFriend::addGift, "生日礼物", "迪奥烈焰蓝金")
                .with(GirlFriend::addGift, "纪念日礼物", "阿玛尼红管唇釉")
                // 等等等等 ...
                .build();
    }
}
```
看到了吗！实例化和属性设置在同一条语句执行，链式操作，一路点点点，清爽！

## `Builder<T>`
Talk is cheap, show me the code：
```java
/**
 * 通用的 Builder 模式构建器
 *
 * @author: CipherCui
 * @since 2019/8/29
 */
public class Builder<T> {
    private final Supplier<T> instantiator;
    private List<Consumer<T>> modifiers = new ArrayList<>();
    public Builder(Supplier<T> instantiator) {
        this.instantiator = instantiator;
    }
    public static <T> Builder<T> of(Supplier<T> instantiator) {
        return new Builder<>(instantiator);
    }
    public <P1> Builder<T> with(Consumer1<T, P1> consumer, P1 p1) {
        Consumer<T> c = instance -> consumer.accept(instance, p1);
        modifiers.add(c);
        return this;
    }
    public <P1, P2> Builder<T> with(Consumer2<T, P1, P2> consumer, P1 p1, P2 p2) {
        Consumer<T> c = instance -> consumer.accept(instance, p1, p2);
        modifiers.add(c);
        return this;
    }
    public <P1, P2, P3> Builder<T> with(Consumer3<T, P1, P2, P3> consumer, P1 p1, P2 p2, P3 p3) {
        Consumer<T> c = instance -> consumer.accept(instance, p1, p2, p3);
        modifiers.add(c);
        return this;
    }
    public T build() {
        T value = instantiator.get();
        modifiers.forEach(modifier -> modifier.accept(value));
        modifiers.clear();
        return value;
    }
    /**
     * 1 参数 Consumer
     */
    @FunctionalInterface
    public interface Consumer1<T, P1> {
        void accept(T t, P1 p1);
    }
    /**
     * 2 参数 Consumer
     */
    @FunctionalInterface
    public interface Consumer2<T, P1, P2> {
        void accept(T t, P1 p1, P2 p2);
    }
    /**
     * 3 参数 Consumer
     */
    @FunctionalInterface
    public interface Consumer3<T, P1, P2, P3> {
        void accept(T t, P1 p1, P2 p2, P3 p3);
    }
}
```
这个示例最多支持三个参数的设置属性方法，也完全够用了。如果要扩展也很容易，依葫芦画瓢，添加多个参数的 Consumer。

参考：https://mp.weixin.qq.com/s/OzLqq5M2iC3mO6HZqLsz0A
