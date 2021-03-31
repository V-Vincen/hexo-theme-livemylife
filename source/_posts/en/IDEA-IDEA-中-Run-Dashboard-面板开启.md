---
title: '[IDEA] IDEA 中 Run Dashboard 面板开启'
catalog: true
date: 2019-6-14 01:59:19
subtitle: Run Dashboard 面板开启
header-img: /img/idea/idea_bg2.png
tags:
- IDEA
categories:
- IDEA
---

## 配置文件
首先找到你项目下的 `.idea` 包，然后找的 `.idea` 下的 `workspace.xml` 文件

![1](1.png)

通过搜索 `RunDashboard` 快速定位到配置文件的具体位置
![2](2.png)

 将 `<component name="RunDashboard">` 中的代码替换为以下代码
```xml
<component name="RunDashboard">
    <option name="configurationTypes">
      <set>
        <option value="SpringBootApplicationConfigurationType" />
      </set>
    </option>
    <option name="ruleStates">
      <list>
        <RuleState>
          <option name="name" value="ConfigurationTypeDashboardGroupingRule" />
        </RuleState>
        <RuleState>
          <option name="name" value="StatusDashboardGroupingRule" />
        </RuleState>
      </list>
    </option>
    <option name="contentProportion" value="0.20765027" />
</component>
```
最后需要重启 IDEA