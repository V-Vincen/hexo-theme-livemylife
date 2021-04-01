---
title: '[Java 杂记] 六大设计原则'
catalog: true
date: 2019-07-21 17:28:27
subtitle: 六大设计原则
header-img: /img/java杂记/principles_bg.png
tags:
- Java 杂记
---

设计模式的6大原则，**单一职责原则**，**开放封闭原则**，**里式替换原则**，**依赖导致原则**，**迪米特原则** 和 **接口隔离原则**。


## 单一职责原则（Single Responsibility Principle，SRP）
**就一个类而言，应该仅有一个引起它变化的原因**

> 通俗的讲就是我们不要让一个承担过多的职责，如果一个类承担的职责过多，就等于把这些职责耦合在一起，一个职责的变化可能会削弱或者抑制这个类完成其他职责的能力。
>
> 这种耦合会导致脆弱的设计，当变化发生时，设计会遭受到破坏。
>
> 比如我们会看到一些 Android 开发者在写 Activity 中 写 Bean 文件，网络数据处理，如果有列表的话，Adapter 也写在 Activity 中。至于这么做的原因，除了简单粗暴，好找也没什么理由了，那么把其拆分到其他类岂不是更好找？如果 Activity 过于臃肿，行数过多，显然不是什么好事。
>
> 如果我们要修改 Bean 文件，网络处理和 Adapter 都需要上这个 Activity 来修改，就会导致引起该 Activity 变化的原因太多，我们在版本维护时也比较头痛。这也就严重违背了定义： 就一个类而言，应该仅有一个引起它变化的原因。
>
> 单一职责的划分界限不是很清晰，很多时候就要靠个人经验来界定，因此它是一个饱受争议却又极其重要的原则。


## 开放封闭原则（Open Closed Principle，OCP）
**类，模块，函数等应该是可以扩展的，但是不可以修改**

> 开放封闭有两个含义：一个是对于扩展是开放，另一个是对于修改是封闭的。
>
> 对于开发者莱索，需求肯定是变化的，但是有新需求，我们就要把类重新改一遍，这显然是令人头痛的，所以我们设计程序时，面对需求的改变要尽可能得保证相对稳定，尽量通过扩展的方式来实现变化，而不是通过修改原有的代码来实现。
>
> 假设我们要实现一个列表，一开始只有查询的功能，后来产品又要新增 添加 功能，过几天又要增加删除功能。大多数人的做法是写一个方法，然后通过传入不同的值控制方法实现不同的功能。但是如果又要新增功能，我们还得修改方法。用开发封闭原则解决就是增加一个抽象的功能类，让添加，删除和查询作为这个抽象功能类的子类。这样如果我们再新增功能，你就会发现自己无须修改原有的类，只需要添加一个功能类的子类实现功能类的方法就可以了。

**示例 Demo：**
```java
//定义了一个抽象动物类，有一个方法
public abstract class AniMal {
    abstract void ObjectX();
}
 
 
//子类猫实现抽象方法
class Cat extends AniMal {
 
    @Override
    void ObjectX() {
        System.out.println();
    }
}
 
//子类狗实现抽象方法
class Dog extends AniMal {
 
    @Override
    void ObjectX() {
        System.out.println();
    }
}
```


## 里式替换原则（Liskov Substitution Principle，LSP）
**所有引用基类（父类）的地方必须能透明的使用其子类的对象**

> 在软件中将一个基类对象替换成其子类对象，程序将不会产生任何错误和异常，反过来则不成立，如果一个软件实体使用的是一个子类对象的话，那么它不一定能够使用子类对象。里式替换原则是实现开放封闭原则的重要方式之一。由于使用基类对象的地方都可以使用子类对象，因此在程序中尽量使用基类类型来对对象进行定义，而在运行时在确定其子类类型，用子类对象来替换父类对象。在使用里式替换原则是需要注意以下几个问题：
>
> 子类的所有方法必须在父类中声明，或子类必须实现父类中声明的所有方法。根据里式替换原则，为了保证系统的扩展性，在程序中通常使用父类来定义。如果一个方法只存于子类中，在父类中不提供相应的声明，则无法在以父类定义的对象中使用该方法。
>
> 我们运用里式替换原则时，尽量把父类设计为抽象类或接口，让子类继承父类或实现父接口，并实现在父类中声明的方法、运行时，子类实例替换父类实例，我们可以很方便的扩展系统功能，同时无序修改原有子类的代码；增加新的功能可以通过增加一个新的子类来实现。里式替换原则是开放封闭原则的具体实现手段之一。
>
> 在java语言中，在编译阶段，java编译器会检查一个程序是否符合里式替换原则。这是一个与实现无关，纯语法意义上的检查，但Java编译器的检查是有局限性的。

**示例 Demo：**
```java
// color 颜色
// flavour 气味
// 苹果类
class Apple{
    void Color(){
        System.out.println("红色");
    }
    void Flavour(){
        System.out.println("香");
    }
}
 
//Pack -水果包装类
//describe -水果描述
//getMessage -返回具体信息
class Pack{
    private Apple apple;
 
     void setApple(Apple apple) {
        this.apple = apple;
    }
 
     void getMessage(){
        apple.Color();
        apple.Flavour();
    }
}
 
//buyer 买家-/具体场景
 class Buyer{
    public static void main(String[] args) {
        Pack pack=new Pack();
        pack.setApple(new Apple());
        pack.getMessage();
    }
}
```
如果我们此时要再加入一个水果类，那么是不是要更改 Pack 包装类，再添加一个类对象，然后调用的时候将其传入进来。

如果我有5 6个类呢，那我这个包装类岂不是要很麻烦？

**现在我们对这个 Demo 进行修改：**
```java
abstract class Frits {
    abstract void Color();
    abstract void Flavour();
}
 
// color 颜色
// flavour 气味
// 苹果类
class Apple extends Frits {
    public void Color() {
        System.out.println("红色");
    }
 
    public void Flavour() {
        System.out.println("甜");
    }
}
 
//Banana 香蕉类
//Stroe 特有储藏方法
class Banana extends Frits {
    //特有的方法
    public void Store(){
        System.out.println("储藏须知");
    }
 
    @Override
    public void Color() {
        System.out.println("黄色");
    }
 
    @Override
    public void Flavour() {
        System.out.println("香甜");
        Store();
    }
}
 
//Pack -水果包装类
//describe -水果描述
//getMessage -返回具体信息
class Pack {
    private Frits frits;
 
    public void setFrits(Frits frits) {
        this.frits = frits;
    }
 
    void getMessage() {
        frits.Color();
        frits.Flavour();
    }
}
 
 
//buyer 买家-/具体场景
class Buyer {
    public static void main(String[] args) {
        Pack pack = new Pack();
 
        pack.setFrits(new Apple());
        pack.getMessage();
        pack.setFrits(new Banana());
        pack.getMessage();
    }
}
```
里式替换原则通俗来说，子类可以扩展父类的功能，但不能改变父类原有的功能：
- 子类可以实现父类的抽象，但是不能覆盖父类的非抽象方法。
- 子类中可以增加自己特有的方法。
- 当子类的方法重载父类的方法时，方法的前置条件要比父类方法的输入更宽松。
- 当子类的方法实现父类的抽象方法时，方法的后置条件要比父类更严格。


## 依赖倒置原则（Dependence Inversion Principle, DIP）
**高层模块（调用端）不应该依赖底层模块，两者都应该依赖于抽象。抽象不应该依赖于细节（实现类）,细节应该依赖于抽象**

> 在Java中，抽象指接口或者抽象类，两者都是不能直接被实例化；细节就是实现类，实现接口或者继承抽象类而产生的就是细节，也就是可以加上一个关键字 new 产生的对象。高层模块就是调用端，低层模块就是具体实现类。依赖倒置原则在 java 中的表现就是，模块间的依赖通过抽象发生，实现类之间不发生直接依赖关系，其依赖关系就是通过接口或者抽象类产生的。如果类与类直接依赖细节，那么就会直接耦合。如此一来，就会同时修改依赖者代码，这样限制了可扩展性。

**示例 Demo：**
```java
class Cat {
    void Cry() {
        System.out.println("喵喵");
    }
}
 
class Dog {
    void Cry() {
        System.out.println("旺旺");
    }
}
 
 
class Animal {
    void Cry(Cat cat, Dog dog) {
        cat.Cry();
        dog.Cry();
    }
}
 
class Test{
    public static void main(String[] args) {
        new Animal().Cry(new Cat(),new Dog());
    }
}
```
上面这个代码看起来没什么问题，可是如果我们还有别的动物子类时，就又要去更改 Animal 类，将其对象作为参数传入 Cry 方法。而依赖倒置原则模块间的依赖通过抽象发生，实现类之间不发生直接的依赖关系。而我们上面这个 Demo 已经违背了这个原则，下面我们对它进行修改。

```java
interface Dongwu{
    void Cry();
}
 
class Cat implements Dongwu{
    public void Cry() {
        System.out.println("喵喵");
    }
}
 
class Dog implements Dongwu{
    public void Cry() {
        System.out.println("旺旺");
    }
}
 
 
class Animal {
    Dongwu dongwu;
 
    public void setDongwu(Dongwu dongwu) {
        this.dongwu = dongwu;
    }
 
    void Cry() {
       dongwu.Cry();
    }
}
 
class Test{
    public static void main(String[] args) {
        Animal animal=new Animal();
        
        animal.setDongwu(new Dog());
        animal.Cry();
        animal.setDongwu(new Cat());
        animal.Cry();
    }
}
```
我们增加了一个接口，里面有一个动物的叫声方法，然后让动物类们实现这个接口，然后通过 set 方法传递依赖对象，这样，如果我们再新增别的动物类，只需要实现相应的接口，而无需再更改我们的管理类 Animal 。


## 迪米特原则（Law of Demeter, LoD）
**一个软件实体应当少的与其他实体发生相互作用**

> 这也被称最好知识原则。如果一个系统符合迪米特原则，那么当其中某一个模块发生修改时，就会尽量少的影响其他模块。迪米特原则要求我们在设计系统是，应该尽量减少对象之间的交互。如果两个对象之间不必彼此直接通向，那么这两个对象就不应当发生任何直接的相互作用。如果其中的一个对象需要调用另一个对象的某一个方法，则可以通过第三者转发这个调用。简言之，就是通过引入一个合理的第三者来降低现有对象之间的耦合度。在将迪米特原则运用到系统设计中时，要注意以下几点：
> - 在类的划分上，应当尽量创建松耦合的类。类之间的耦合越低，就越有利于复用。一个处在松耦合中的类一旦被修改，则不会对关联的类造成太大波及。
> - 在类的结构上，每一个类都应当尽量降低其成员变量和成员函数的访问权限。
> - 在对其他类的引用上，一个对象对其他对象的引用应当降到最低。

举个例子：
就像租房子一样，我叫老王，准备租房子，然后找中介，中介和房东谈价格，我们和中介谈价格，如果我们想自己和房东联系，这种事情肯定是要通过中介介绍了，或者别的途径。

**示例 Demo：**
```java
//租房者：老王类
//inform 通知方法
class LaoWang {
    private Zhongjie zhongjie;

    public Zhongjie getZhongjie(){
        return zhongjie;
    }

    public void setZhongjie(Zhongjie zhongjie) {
        this.zhongjie = zhongjie;
    }
    public void inform(){
        zhongjie.inform();
    }
}

//中介类
//inform 通知方法
//setLandlord 接收房东消息
class Zhongjie{
    public void inform(){
        System.out.println("通知房东");
    }
    public   void getLanged(){
        new Landlord().inform();
    }
}

//房东类
//inform 通知方法
class Landlord{
    public void inform(){
        System.out.println("收到，可以租");
    }
}

class Renting{
    public static void main(String[] args) {
        LaoWang laoWang=new LaoWang();
        //老王通知中介
        laoWang.inform();
        //传入房东对象
        laoWang.setZhongjie(new Zhongjie());
        //由中介去通知房东
        laoWang.getZhongjie().inform();
        //接收房东消息
        laoWang.getZhongjie().getLanged();
    }
}
```
这样，老王和房东之间就没有任何联系，避免了耦合度过高。

我们还可以将上面的 Demo 再次更改，相当和依赖倒转原则结合。因为一般租房会看好多房子，所以房东也各不相同，这时候就可以将房东抽成一个抽象类，具体的房东实现房东抽象方法即可，这样的方式，和老王通信的就是房东的抽象父类，和具体房东没有关系。

```java
public abstract class Lease {
    abstract void inform();
}
 
//租房者：老王类
//inform 通知方法
class LaoWang {
    private Zhongjie zhongjie;
    private Lease lease;
    
    public void setLease(Lease lease) {
        this.lease = lease;
    }
 
    public void setZhongjie(Zhongjie zhongjie) {
        this.zhongjie = zhongjie;
    }
 
    public void inform() {
        zhongjie.inform();
        lease.inform();
    }
}
 
//中介类
//inform 通知方法
class Zhongjie {
    public void inform() {
        System.out.println("通知房东");
    }
}
 
//Landlord_X 房东X
//inform 通知方法
class Landlord_X extends Lease {
    public void inform() {
        System.out.println("收到，可以租");
    }
}
 
class Renting{
    public static void main(String[] args) {
        LaoWang laoWang=new LaoWang();
        laoWang.setLease(new Landlord_X());
        laoWang.setZhongjie(new Zhongjie());
        laoWang.inform();
    }
}
```


## 接口隔离原则（Interface Segregations Principle, ISP）
**一个类对另一个类的依赖应该建立在最小的接口上**

> 建立单一接口，不要建立庞大臃肿的接口：尽量细化接口，接口中的方法尽量少。也就是说，我们要为各个类建立专用的接口，而不要试图建立一个一个很庞大的接口供所有依赖他的类调用。采取接口隔离原则对接口进行约束时，要注意以下几点：
> - 接口尽量小，但是要有限度。对接口进行细化可以提高程序设计的灵活性；但是如果过小，则会造成接口数量过多，使设计复杂化。所以，一定要适度。
> - 为依赖接口的类定制服务，只暴露给调用的类他需要的方法，他不需要的方法则隐藏起来，只有专注的为一个模块提供定制服务，才能建立最小的依赖关系。
> - 为提高内聚，减少对外交互。接口方法尽量少用 public 修饰。接口是对外的承诺，承诺越少对系统的开发越有利，变更的风险也越少。

**示例 Demo：**
```java
//color 颜色
//taste 口感
//hardness 硬度
// small气味
interface Frits {
    void color();
    void taste();
    void hardness();
    void small();
}
 class apple implements Frits{
 
     @Override
     public void color() {
 
     }
 
     @Override
     public void taste() {
 
     }
 
     @Override
     public void hardness() {
 
     }
 
     @Override
     public void small() {
 
     }
 }
```
定义了一个水果接口，里面有水果的各项方法，如果我们还有别的方法，那么这个接口必然会受到多次修改。所以我们可以对其进行分隔，比如外观为一类，内在为一类，结果如下：

```java
//Facade 外观
interface Facade {
     void color();
     void hardness();
}
//Inherent 内在
interface Inherent {
    void taste();
    void small();
}
class banana implements Facade,Inherent{
    @Override
    public void taste() {
 
    }
 
    @Override
    public void small() {
 
    }
 
    @Override
    public void color() {
 
    }
 
    @Override
    public void hardness() {
 
    }
}
```
接口是我们设计时对外提供的契约，通过分散定义多个接口，可以预防未来变更的扩散，提高系统的灵活性和可维护性。