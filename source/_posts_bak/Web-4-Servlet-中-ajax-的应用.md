---
title: '[Web] 4 Servlet 中 ajax 的应用'
catalog: true
date: 2019-06-26 03:36:09
subtitle: Servlet 中 ajax 的应用
header-img: /img/json/json_bg.png
tags:
- Web
- JSON
---

## 例子：批量删除
---
### 前台页面用el表达式书写
```html
<table class="table table-hover text-center" id="table_id_example">
    <thead>
        <tr>
            <th><input type="checkbox" class="minimal icheck_master" /></th>
            <th>ID</th>
            <th>Username</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Updated</th>
            <th>Operation</th>
        </tr>
    </thead>
    <tbody>
    <c:forEach items="${tbUsers}" var="tbU">
    <tr role="row" class="odd">
        <td><input type="checkbox" class="minimal" id="${tbU.id}" /></td>
        <td>${tbU.id}</td>
        <td>${tbU.userName}</td>
        <td>${tbU.phone}</td>
        <td>${tbU.email}</td>
        <td><fmt:formatDate value="${tbU.created}" pattern="yyyy-MM-dd HH:mm:ss"></fmt:formatDate></td>
        <td style="width: 30%;">
            <div class="row">
                <div class="col-xs-4">
                    <button type="button" class="btn btn-info btn-sm" onclick="infoById(${tbU.id})"  style="width: 100px;"><i class="fa fa-search"></i>&nbsp;详情</button>
                </div>
                <div class="col-xs-4">
                    <a type="button" href="/editByEmail?email=${tbU.email}" class="btn btn-primary btn-sm" style="width: 100px;"><i class="fa fa-edit"></i>&nbsp; 修改</a>
                </div>
                <div class="col-xs-4">
                    <a type="button" href="/deleteById?id=${tbU.id}" class="btn btn-danger btn-sm" style="width: 100px;"><i class="fa fa-trash-o"></i>&nbsp; 删除</a>
                </div>
            </div>
        </td>
    </tr>
    </c:forEach>
    </tbody>
</table>
```

### 前台jquery的书写
```js
/**
     * @Method:
     * @Description:    复选框用的是iCheck的插件，这是iCheck的初始化
     * @Param:
     * @return:
     * @Author:        Mr.Vincent
     * @Date:          2019/6/1
     */
    $(function () {
        $('input[type="checkbox"].minimal').iCheck({
            checkboxClass: 'icheckbox_minimal-blue',
            radioClass   : 'iradio_minimal-blue'
        });

        //获取主控件checkbox
        var _masterCheckbox = $('input[type="checkbox"].minimal.iCheckMaster');

        //获取全部控件checkbox
        var _checkbox = $('input[type="checkbox"].minimal');

        // Checkbox的全选功能
        _masterCheckbox.on("ifClicked", function (e) {
            // 当前状态已选中，点击后应取消选择
            if (e.target.checked) {
                _checkbox.iCheck("uncheck");
            }
            // 当前状态未选中，点击后应全选
            else {
                _checkbox.iCheck("check");
            }
        });

        /**
         * @Method:        批量删除
         * @Description:
         * @Param:
         * @return:
         * @Author:        Mr.Vincent
         * @Date:          2019/6/1
         */
        $("#batchDelete").click(function () {
            //定义一个数组
            var _idArray = new Array();

            //将选中的元素 id 放入数组中
            _checkbox.each(function () {
                var _id = $(this).attr("id");
                if (_id != null && _id != "undefine" && $(this).is(":checked")) {
                    _idArray.push(_id);
                }
            });

            if (_idArray.length === 0) {
                swal("请先选择复选框！！！")
            } else {
                swal({
                    title: "你确定要删除吗？",
                    text: "一旦删除，将无法恢复！！！",
                    icon: "warning",
                    buttons: ["取消", "确定删除！"],
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {

                            //ajax请求
                            $.post("/batchDelete", {ids: _idArray.toString()}, function (data) {
                                debugger
                                if (data.message != '数据删除失败！！！') {
                                    swal(
                                        "删除成功!!!",
                                        data.message, {
                                            icon: "success",
                                        })
                                } else {
                                    swal(
                                        "删除失败!!",
                                        data.message, {
                                            buttons: false,
                                            timer: 2000,
                                        })
                                }
                            })
                        }
                    })
            }
        })
    })
```

### 后台Controller层
```java
/**
  * @ProjectName:
  * @Package:        com.example.my.shop.mybatis.controller
  * @ClassName:      User_batchDeleteController
  * @Description:    批量删除功能
  * @Author:         Mr.Vincent
  * @CreateDate:     2019/6/1 17:11
  * @Version:        1.0.0
  */
@WebServlet(value = "/batchDelete")
public class User_batchDeleteController extends HttpServlet {
    /**
     * @Method:        service
     * @Description:    根据ids批量删除
     * @Param:         [req, resp]
     * @return:        void
     * @Author:        Mr.Vincent
     * @Date:          2019/6/1
     */
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //解决json中文乱码
        resp.setContentType("text/json,charset=utf-8");

        //获取前台传递过来的数组
        String ids = req.getParameter("ids");

        int i = 0;
        if(StringUtils.isNotBlank(ids)){
            String[] idArray = StringUtils.split(ids,",");
            TbUserService tbUserService = new TbUserServiceImpl();

            //批量删除
            i = tbUserService.batchDelete(idArray);
        }
        Map<String,Object> map = new HashMap();
        if(i>0){
            map.put("message",String.format("成功删除 %s 条数据！！！",i));
        }else {
            map.put("message","数据删除失败！！！");
        }
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonMap = objectMapper.writeValueAsString(map);

        //最后将结果输出给前台
        PrintWriter out = resp.getWriter();
        out.print(jsonMap);
        out.flush();
        out.close();
    }
}
```

### 后台Service层
```java
public interface TbUserService {

    int batchDelete(String[] ids);
    
}

```
### 后台ServiceImpl层
```java
public class TbUserServiceImpl implements TbUserService {

    SqlSession sqlSession = MybatisUtils.getSqlSession();
    TbUserMapper tbUserMapper = sqlSession.getMapper(TbUserMapper.class);

    @Override
    public int batchDelete(String[] ids) {
        int i = tbUserMapper.batchDelete(ids);
        sqlSession.commit();
        return i;
    }
}
```

### 后台mapper借口
```java
public interface TbUserMapper {

    int batchDelete(String[] ids);
    
}
```

### 后台mapper.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.my.shop.mybatis.dao.TbUserMapper">
    <delete id="batchDelete">
        <!-- select * from student where id in (2, 4) -->
        delete FROM tb_user
        WHERE id IN
        <foreach collection="array" open="(" close=")" item="id" separator=",">
            #{id}
        </foreach>
    </delete>
</mapper>
```