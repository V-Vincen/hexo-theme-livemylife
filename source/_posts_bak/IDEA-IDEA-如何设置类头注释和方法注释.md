---
title: '[IDEA] IDEA 如何设置类头注释和方法注释'
catalog: true
date: 2019-06-13 10:32:36
subtitle: IDEA 设置类头、方法注释
header-img: /img/idea/idea_bg2.png
tags:
- IDEA
categories:
- IDEA
---

## 类头注释：
类注释模板（快捷键--> cmt）：
```java
 /**
 * @ProjectName:    $PROJECT_NAME$
 * @Package:        $PACKAGE_NAME$
 * @ClassName:      $CLASSNAME$
 * @Description:    
 * @Author:         Mr.Vincent
 * @CreateDate:     $DATE$ $TIME$
 * @Version:        1.0.0  
 */
```
打开 file -> setting -> Editor -> Filr and Code Templates -> Includes -> File Header 
![1](1.jpeg)
直接在右边的文件框里编辑你说需要注释的东西，然后应用保存之后,当你创建类的时候就会自动生成注释。

## 方法注释：	
类注释模板（快捷键--> *）：
```
* 
* @Method  $methodName$
* @Description: $description$ 
* @Param: $params$ 
* @return: $returns$ 
* @Author: Mr.Vincent 
* @Date: $date$ 
*/ 
```
打开 file -> setting -> Editor -> LiveTemplates 点击右边上面那个绿色的+号，选择 Template Group 双击，然后弹出一个窗口，随便添加一个名字，我这里添加的是 MyGroup 然后点击 OK 
![2](2.png)
还是在 file -> setting -> Editor -> LiveTemplates 这个路径下点击一下刚刚你添加的那个名字（我这是MyGroup），然后点击右边上面那个绿色的 + 号，选择 LiveTemplate 双击，填写下面的图上的框 
![3](3.png)
![4](4.png)

然后点击
然后选择 Everywhere 
![5](5.jpeg)
最后点击右下角的 Edit variables 按钮，然后弹出一个窗口，如下： 
![6](6.jpeg)
如果想把 @param：每一个参数可以这样 
![7](7.png)
参数值要自己写的：

```
groovyScript("def result=''; def params=\"${_1}\".replaceAll('[\\\\[|\\\\]|\\\\s]', '').split(',').toList(); for(i = 0; i < params.size(); i++) {result+=' * @param ' + params[i] + ((i < params.size() - 1) ? '\\n\\b' : '')}; return result", methodParameters())
```
把这个添加进去，但是还要注意一点： 
![8](8.png)
 下面红色圈中的下拉框选择相对应的参数点击 OK 
再点击 apply ,点击 Ok。 
然后写方法之前点写上 add（刚刚填的）按 tab，注释就出来了。