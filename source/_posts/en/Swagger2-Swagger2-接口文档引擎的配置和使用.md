---
title: '[Swagger2] Swagger2 接口文档引擎的配置和使用'
catalog: true
date: 2019-12-14 15:57:11
subtitle: Swagger2 接口文档引擎的配置和使用
header-img: /img/swagger/swagger.jpg
tags:
- Swagger2
---

## 手写文档存在的问题
- 文档需要更新的时候，需要再次发送一份给前端，也就是文档更新交流不及时。
- 接口返回结果不明确
- 不能直接在线测试接口，通常需要使用工具，比如：Postman
- 接口文档太多，不好管理

## 使用 Swagger 解决问题
Swagger 也就是为了解决这个问题，当然也不能说 Swagger 就一定是完美的，当然也有缺点，最明显的就是代码植入性比较强。Swagger 是一个规范和完整的框架，用于生成、描述、调用和可视化 RESTful 风格的 Web 服务。总体目标是使客户端和文件系统作为服务器以同样的速度来更新。文件的方法，参数和模型紧密集成到服务器端的代码，允许API来始终保持同步。

作用：
1. 接口的文档在线自动生成。
2. 功能测试。

**Swagger 是一组开源项目，其中主要要项目如下：**

- `Swagger-tools`:提供各种与Swagger进行集成和交互的工具。例如模式检验、Swagger 1.2文档转换成Swagger 2.0文档等功能。
- `Swagger-core`: 用于Java/Scala的的Swagger实现。与JAX-RS(Jersey、Resteasy、CXF...)、Servlets和Play框架进行集成。
- `Swagger-js`: 用于JavaScript的Swagger实现。
- `Swagger-node-express`: Swagger模块，用于node.js的Express web应用框架。
- Swagger-ui`：一个无依赖的HTML、JS和CSS集合，可以为Swagger兼容API动态生成优雅文档。
- `Swagger-codegen`：一个模板驱动引擎，通过分析用户Swagger资源声明以各种语言生成客户端代码。


### Maven
增加 Swagger2 所需依赖，`pom.xml` 配置如下：
```xml
<!-- Swagger2 Begin -->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.8.0</version>
</dependency>
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.8.0</version>
</dependency>
<!-- Swagger2 End -->
```

### 配置 Swagger2
注意：`RequestHandlerSelectors.basePackage("com.funtl.itoken.service.admin.controller")` 为 Controller 包路径，不然生成的文档扫描不到接口

创建一个名为 `Swagger2Config` 的 Java 配置类，代码如下：
```java
package com.funtl.itoken.service.admin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
//@EnableSwagger2 也可以写在 ServiceAdminApplication 启动类上
public class Swagger2Config {
    @Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.funtl.itoken.service.admin.controller"))
                .paths(PathSelectors.any())
                .build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("iToken API 文档")
                .description("iToken API 网关接口，http://www.funtl.com")
                .termsOfServiceUrl("http://www.funtl.com")
                .version("1.0.0")
                .build();
    }
}
```

### 启用 Swagger2
Application 中加上注解 `@EnableSwagger2` 表示开启 Swagger
```java
package com.funtl.itoken.service.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import springfox.documentation.swagger2.annotations.EnableSwagger2;
import tk.mybatis.spring.annotation.MapperScan;

@SpringBootApplication(scanBasePackages = "com.funtl.itoken")
@EnableEurekaClient
@EnableSwagger2 //也可以直接写在 Swagger2Config 配置类上面
@MapperScan(basePackages = {"com.funtl.itoken.common.mapper", "com.funtl.itoken.service.admin.mapper"})
public class ServiceAdminApplication {
    public static void main(String[] args) {
        SpringApplication.run(ServiceAdminApplication.class, args);
    }
}
```

### 案例：使用 Swagger2
在 Controller 中增加 Swagger2 相关注解，代码如下：
```java
/**
 * 分页查询
 *
 * @param pageNum
 * @param pageSize
 * @param tbSysUserJson
 * @return
 */
@ApiOperation(value = "管理员分页查询")
@ApiImplicitParams({
        @ApiImplicitParam(name = "pageNum", value = "页码", required = true, dataType = "int", paramType = "path"),
        @ApiImplicitParam(name = "pageSize", value = "笔数", required = true, dataType = "int", paramType = "path"),
        @ApiImplicitParam(name = "tbSysUserJson", value = "管理员对象 JSON 字符串", required = false, dataTypeClass = String.class, paramType = "json")
})
@RequestMapping(value = "page/{pageNum}/{pageSize}", method = RequestMethod.GET)
public BaseResult page(
        @PathVariable(required = true) int pageNum,
        @PathVariable(required = true) int pageSize,
        @RequestParam(required = false) String tbSysUserJson
) throws Exception {

    TbSysUser tbSysUser = null;
    if (tbSysUserJson != null) {
        tbSysUser = MapperUtils.json2pojo(tbSysUserJson, TbSysUser.class);
    }
    PageInfo pageInfo = adminService.page(pageNum, pageSize, tbSysUser);

    // 分页后的结果集
    List<TbSysUser> list = pageInfo.getList();

    // 封装 Cursor 对象
    BaseResult.Cursor cursor = new BaseResult.Cursor();
    cursor.setTotal(new Long(pageInfo.getTotal()).intValue());
    cursor.setOffset(pageInfo.getPageNum());
    cursor.setLimit(pageInfo.getPageSize());

    return BaseResult.ok(list, cursor);
}
```

### Swagger 注解说明
Swagger 通过注解表明该接口会生成文档，包括接口名、请求方法、参数、返回信息的等等。

- `@Api`：修饰整个类，描述 Controller 的作用
- `@ApiOperation`：描述一个类的一个方法，或者说一个接口
- `@ApiParam`：单个参数描述
- `@ApiModel`：用对象来接收参数
- `@ApiProperty`：用对象接收参数时，描述对象的一个字段
- `@ApiResponse`：HTTP 响应其中 1 个描述
- `@ApiResponses`：HTTP 响应整体描述
- `@ApiIgnore`：使用该注解忽略这个API
- `@ApiError`：发生错误返回的信息
- `@ApiImplicitParam`：一个请求参数
- `@ApiImplicitParams`：多个请求参数

**注意：@ApiImplicitParam的参数说明如下**

paramType：指定参数放在哪个地方 | header：请求参数放置于 Request Header，使用 @RequestHeader 获取；query：请求参数放置于请求地址，使用 @RequestParam 获取；path（用于restful接口）：请求参数的获取 @PathVariable；body：请求参数的获取 @RequestBody（代码中接收注解）；form：（不常用）；
---|---
name：参数名                    | 
dataType：参数类型              | 
required：参数是否必须传        | true 或者 false
value：说明参数的意思           | 
defaultValue：参数的默认值      | 


### 访问 Swagger2
访问地址：[http://ip:port/swagger-ui.html](https://v_vincen.gitee.io/404.html)
![1](1.png)

### 详细案例
**`POJO` 的写法**
```java
package com.zhongying.api.model.base;
 
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
 
/**
 * 医生对象模型
 */
@Data
@ApiModel(value="医生对象模型")
public class DemoDoctor{
    @ApiModelProperty(value="id" ,required=true)
    private Integer id;
    @ApiModelProperty(value="医生姓名" ,required=true)
    private String name;
}
```

**`Controller` 的写法**
```java
package com.zhongying.api.controller.app;
 
import java.util.ArrayList;
import java.util.List;
 
import javax.servlet.http.HttpServletRequest;
 
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
 
import com.github.pagehelper.PageInfo;
import com.zhongying.api.exception.HttpStatus401Exception;
import com.zhongying.api.model.base.DemoDoctor;
 
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
 
/**
 * 医生类（模拟）
 */
@RequestMapping("/api/v1")
@Controller
@Api(value = "DoctorTestController-医生信息接口模拟")
public class DoctorTestController {
    /**
     * 添加医生
     * 
     * 在使用对象封装参数进行传参时，需要在该对象添加注解，将其注册到 swagger 中
     * @link com.zhongying.api.model.base.DemoDoctor
     * 
     * 注意： 在后台采用对象接收参数时，Swagger自带的工具采用的是JSON传参，
     *     测试时需要在参数上加入@RequestBody,正常运行采用form或URL提交时候请删除。
     *     
     * @param doctor 医生类对象
     * @return
     * @throws Exception
     */
    @ResponseBody
    @RequestMapping(value="/doctor",  method= RequestMethod.POST )
    @ApiOperation(value="添加医生信息", notes="")
    public String addDoctor(@RequestBody DemoDoctor doctor) throws Exception{
        if(null == doctor || doctor.getId() == null){
            throw new HttpStatus401Exception("添加医生失败","DT3388","未知原因","请联系管理员");
        }
        try {
          System.out.println("成功----------->"+doctor.getName());  
        } catch (Exception e) {
            throw new HttpStatus401Exception("添加医生失败","DT3388","未知原因","请联系管理员");
        }
        
        return doctor.getId().toString();
    }
    
    /**
     * 删除医生
     * @param doctorId 医生ID
     * @return
     */
    @ResponseBody
    @RequestMapping(value="/doctor/{doctorId}",  method= RequestMethod.DELETE )
    @ApiOperation(value="删除医生信息", notes="")
    @ApiImplicitParam(paramType="query", name = "doctorId", value = "医生ID", required = true, dataType = "Integer")
    public String deleteDoctor(@RequestParam Integer doctorId){
        if(doctorId > 2){
            return "删除失败";
        }
        return "删除成功";
    }
    
    /**
     * 修改医生信息
     * @param doctorId 医生ID
     * @param doctor 医生信息
     * @return
     * @throws HttpStatus401Exception
     */
    @ResponseBody
    @RequestMapping(value="/doctor/{doctorId}",  method= RequestMethod.POST )
    @ApiOperation(value="修改医生信息", notes="")
    @ApiImplicitParam(paramType="query", name = "doctorId", value = "医生ID", required = true, dataType = "Integer")
    public String updateDoctor(@RequestParam Integer doctorId, @RequestBody DemoDoctor doctor) throws HttpStatus401Exception{
        if(null == doctorId || null == doctor){
            throw new HttpStatus401Exception("修改医生信息失败","DT3391","id不能为空","请修改");
        }
        if(doctorId > 5 ){
            throw new HttpStatus401Exception("医生不存在","DT3392","错误的ID","请更换ID");
        }
        System.out.println(doctorId);
        System.out.println(doctor);
        return "修改成功";
    }
    
    /**
     * 获取医生详细信息
     * @param doctorId 医生ID
     * @return
     * @throws HttpStatus401Exception
     */
    @ResponseBody
    @RequestMapping(value="/doctor/{doctorId}",  method= RequestMethod.GET )
    @ApiOperation(value="获取医生详细信息", notes="仅返回姓名..")
    @ApiImplicitParam(paramType="query", name = "doctorId", value = "医生ID", required = true, dataType = "Integer")
    public DemoDoctor getDoctorDetail(@RequestParam Integer doctorId) throws HttpStatus401Exception{
        System.out.println(doctorId);
        if(null == doctorId){
            throw new HttpStatus401Exception("查看医生信息失败","DT3390","未知原因","请联系管理员");
        }
        if(doctorId > 3){
            throw new HttpStatus401Exception("医生不存在","DT3392","错误的ID","请更换ID");
        }
        DemoDoctor doctor = new DemoDoctor();
        doctor.setId(1);
        doctor.setName("测试员");
        return doctor;
    }
    
    /**
     * 获取医生列表
     * @param pageIndex 当前页数
     * @param pageSize 每页记录数
     * @param request
     * @return
     * @throws HttpStatus401Exception
     */
    @ResponseBody
    @RequestMapping(value="/doctor",  method= RequestMethod.GET )
    @ApiOperation(value="获取医生列表", notes="目前一次全部取，不分页")
    @ApiImplicitParams({
        @ApiImplicitParam(paramType="header", name = "token", value = "token", required = true, dataType = "String"),
        @ApiImplicitParam(paramType="query", name = "pageIndex", value = "当前页数", required = false, dataType = "String"),
        @ApiImplicitParam(paramType="query", name = "pageSize", value = "每页记录数", required = true, dataType = "String"),
    })
    public PageInfo<DemoDoctor> getDoctorList(@RequestParam(value = "pageIndex", required = false, defaultValue = "1") Integer pageIndex,
            @RequestParam(value = "pageSize", required = false) Integer pageSize,
            HttpServletRequest request) throws HttpStatus401Exception{
        
        String token = request.getHeader("token");
        if(null == token){
            throw new HttpStatus401Exception("没有权限","SS8888","没有权限","请查看操作文档");
        }
        if(null == pageSize){
            throw new HttpStatus401Exception("每页记录数不粗安在","DT3399","不存在pageSize","请查看操作文档");
        }
        
        DemoDoctor doctor1 = new DemoDoctor();
        doctor1.setId(1);
        doctor1.setName("测试员1");
        DemoDoctor doctor2 = new DemoDoctor();
        doctor2.setId(2);
        doctor2.setName("测试员2");
        
        List<DemoDoctor> doctorList = new ArrayList<DemoDoctor>();
        doctorList.add(doctor1);
        doctorList.add(doctor2);
        return new PageInfo<DemoDoctor>(doctorList);
    }
}
```

