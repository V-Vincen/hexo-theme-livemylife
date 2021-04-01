---
title: '[Web] 3 Servlet 输出 JSON 数据'
catalog: true
date: 2019-06-26 03:11:12
subtitle: Servlet 输出 JSON 数据
header-img: /img/json/json_bg.png
tags:
- Web
- JSON
---

## 依赖jar包

gson-2.8.5： 对象和 json 字符串之间相互转换。

## 代码实现 -- 普通字符串返回
```java
@WebServlet("/jsonServlet")
public class JsonServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws     ServletException, IOException {
        // 解决json中文乱码
        response.setContentType("text/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        String str ="{\"姓名\":\"HaHa先生\",\"年龄\":\"18岁啦\"}";
        out.println(str);
        out.flush();
        out.close();
    }
}
```

## 代码实现 -- 对象 -- 使用 Gson 对象转字符串
```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    // 解决json中文乱码
    response.setContentType("text/json;charset=UTF-8");
    response.setCharacterEncoding("UTF-8");
    PrintWriter out = response.getWriter();
    List<Client> list = clientService.findList(new Client());
    Gson gson = new Gson();
    String json = gson.toJson(list);
    out.println(json);
    out.flush();
    out.close();
}
```

## 使用 ajax 获取 json 数据
```js
 
<script type="text/javascript">
    $.ajax({
        url:'${ctx}/jsonServlet',
        type:'POST',
        data:{},
        dataType:'json',
        success:function(data){
            var str =JSON.stringify(data);
            alert(str);
        }
    });
```