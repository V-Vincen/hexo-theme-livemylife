---
title: '[POI - Alibaba EasyExcel] Alibaba EasyExcel'
catalog: true
date: 2020-10-22 14:12:21
subtitle: EasyExcel is a simple, memory-saving open source project for reading and writing Excel based on Java...
header-img: /img/header_img/categories_bg11.jpg
tags:
- POI
---

## 简介
Java 领域解析、生成 Excel 比较有名的框架有 Apache poi、jxl 等。但他们都存在一个严重的问题就是非常的耗内存。如果你的系统并发量不大的话可能还行，但是一旦并发上来后一定会 OOM 或者 JVM 频繁的 full gc。EasyExcel 是阿里巴巴开源的一个 excel 处理框架，以使用简单、节省内存著称。EasyExcel 是一个基于 Java 的简单、省内存的读写 Excel 的开源项目。在尽可能节约内存的情况下支持读写百 M 的 Excel。

**64M 内存1分钟内读取 75M（46W行25列）的 Excel**（当然还有急速模式能更快，但是内存占用会在 100M 多一点）

![1](1.png)

EasyExcel 能大大减少占用内存的主要原因是在解析 Excel 时没有将文件数据一次性全部加载到内存中，而是从磁盘上一行行读取数据，逐个解析。

下图是 EasyExcel 和 POI 在解析 Excel 时的对比图。

![2](2.jpg)

EasyExcel 采用一行一行的解析模式，并将一行的解析结果以观察者的模式通知处理（AnalysisEventListener）。

![3](3.jpg)

上面简要介绍了 EasyExcel 的特点和原理，关于 EasyExcel 的其他问题可以先参考：

Github 地址：https://github.com/alibaba/easyexcel

官方文档：https://www.yuque.com/easyexcel/doc/easyexcel

下面就通过代码来介绍下怎么使用 EasyExcel。

## Maven 依赖
```xml
<!-- https://mvnrepository.com/artifact/com.alibaba/easyexcel -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>easyexcel</artifactId>
    <version>2.2.6</version>
</dependency>
```

## 读 Excel
### 数据量小的情况
**Excel 数据**

EasyExcelRead_03.xls 中 **日期标题** 为自定义日期格式。

![4](4.png)

EasyExcelRead_03.xls 中 **日期标题** 为文本格式。

![5](5.png)

**实体类**
```java
@Data
public class ConverterDto {
    /**
     * 我自定义 转换器，不管数据库传过来什么 。我给他加上“自定义：”
     */
    @ExcelProperty(converter = CustomStringStringConverter.class)
    private String string;

    /**
     * 这里需要注意：
     * 1. Excel 中的对应日期字段，必须为日期格式时（如果 Excel 中的对应日期字段为文本格式时，并不会转换为 "yyyy年MM月dd日HH时mm分ss秒" 格式）
     * 2. 同时实体类中 date 为 String 类型时
     * 才会转换为 DateTimeFormat 中的 "yyyy年MM月dd日HH时mm分ss秒" 格式
     */
    @DateTimeFormat("yyyy年MM月dd日HH时mm分ss秒")
    private String date;

    /**
     * 我想接收百分比的数字
     * 需要注意：
     * 如果要转换格式为 NumberFormat 中的 "#.##%"，实体类中 doubleData 字段必须为 String 类型时，才会转换。
     * 如果用 Double 接收，是不会转换格式的。
     */
    @NumberFormat("#.##%")
    private Double doubleData;
}
```

**自定义转换器**
```java
/**
 * @author vincent 
 */
public class CustomStringStringConverter implements Converter<String> {
    @Override
    public Class supportJavaTypeKey() {
        return String.class;
    }

    @Override
    public CellDataTypeEnum supportExcelTypeKey() {
        return CellDataTypeEnum.STRING;
    }

    /**
     * 这里读的时候会调用
     *
     * @param cellData            NotNull
     * @param contentProperty     Nullable
     * @param globalConfiguration NotNull
     * @return
     */
    @Override
    public String convertToJavaData(CellData cellData, ExcelContentProperty contentProperty, GlobalConfiguration globalConfiguration) {
        return "自定义：" + cellData.getStringValue();
    }

    /**
     * 这里是写的时候会调用，不用管
     *
     * @param value               NotNull
     * @param contentProperty     Nullable
     * @param globalConfiguration NotNull
     * @return
     */
    @Override
    public CellData convertToExcelData(String value, ExcelContentProperty contentProperty, GlobalConfiguration globalConfiguration) {
        return new CellData(value);
    }
}
```

**测试类**
```java
/**
 * @author vincent
 */
public class EasyExcelTest {
    private static final String READPATH = "/Users/vincent/IDEA_Project/my_project/common/src/test/java/com/vincent/common/exceltest/template/read";

    /**
     * 数据量小的情况下，最简单的读
     */
    @Test
    public void simpleDoReadSync() throws IOException {
        // 数据量不是很大的话，直接用下面的方法即可
        File xlsFile = Paths.get(READPATH).resolve("EasyExcelRead_03.xls").toFile();
        List<ConverterDto> list_03 = EasyExcel.read(xlsFile).head(ConverterDto.class).sheet().doReadSync();
        list_03.forEach(System.out::println);
        System.out.println();

        File xlsxFile = Paths.get(READPATH).resolve("EasyExcelRead_07.xlsx").toFile();
        List<ConverterDto> list_07 = EasyExcel.read(xlsxFile).head(ConverterDto.class).sheet().doReadSync();
        list_07.forEach(System.out::println);
    }
}
```

**显示结果**
```java
ConverterDto(string=自定义：字符串0, date=2020年10月20日18时29分14秒, doubleData=0.56)
ConverterDto(string=自定义：字符串1, date=2020年10月21日18时29分14秒, doubleData=0.56)
ConverterDto(string=自定义：字符串2, date=2020年10月22日18时29分14秒, doubleData=0.56)
ConverterDto(string=自定义：字符串3, date=2020年10月23日18时29分14秒, doubleData=0.56)
ConverterDto(string=自定义：字符串4, date=2020年10月24日18时29分14秒, doubleData=0.56)
ConverterDto(string=自定义：字符串5, date=2020年10月25日18时29分14秒, doubleData=0.56)
ConverterDto(string=自定义：字符串6, date=2020年10月26日18时29分14秒, doubleData=0.56)
ConverterDto(string=自定义：字符串7, date=2020年10月27日18时29分14秒, doubleData=0.56)
ConverterDto(string=自定义：字符串8, date=2020年10月28日18时29分14秒, doubleData=0.56)
ConverterDto(string=自定义：字符串9, date=2020年10月29日18时29分14秒, doubleData=0.56)

ConverterDto(string=自定义：字符串0, date=2020>10>20  18:44:12, doubleData=0.56)
ConverterDto(string=自定义：字符串1, date=2020>10>20  18:44:13, doubleData=0.56)
ConverterDto(string=自定义：字符串2, date=2020>10>20  18:44:14, doubleData=0.56)
ConverterDto(string=自定义：字符串3, date=2020>10>20  18:44:15, doubleData=0.56)
ConverterDto(string=自定义：字符串4, date=2020>10>20  18:44:16, doubleData=0.56)
ConverterDto(string=自定义：字符串5, date=2020>10>20  18:44:17, doubleData=0.56)
ConverterDto(string=自定义：字符串6, date=2020>10>20  18:44:18, doubleData=0.56)
ConverterDto(string=自定义：字符串7, date=2020>10>20  18:44:19, doubleData=0.56)
ConverterDto(string=自定义：字符串8, date=2020>10>20  18:44:20, doubleData=0.56)
ConverterDto(string=自定义：字符串9, date=2020>10>20  18:44:21, doubleData=0.56)
```


### 数据量大的情况
**Excel 数据**

EasyExcelRead_03.xls 中 **日期标题** 为自定义日期格式。

![4.1](4.png)


**实体类**
```java
@Data
public class DemoReadDto {
    private String string;

    /*
     * 这里的时间转换，当为读取 excel 时，时间类为 String 时才会生效，其他类型时 @DateTimeFormat 不会转换。
     *              当为写入 excel 时，@DateTimeFormat 时间转换会生效。
     */
    @DateTimeFormat("yyyy年MM月dd日HH时mm分ss秒")
    private Date date;

    /*
     * 我想接收百分比的数字
     */
    @NumberFormat("#.##%")
    private String doubleData;

    /**
     * 忽略这个字段
     */
    @ExcelIgnore
    private String ignore;
}
```

**监听类**
```java
/**
 * @author vincent
 * 有个很重要的点 DemoDataListener 不能被 spring 管理，要每次读取 excel 都要 new，然后里面用到 spring 可以构造方法传进去。
 */
public class DemoDataListener extends AnalysisEventListener<DemoReadDto> {
    private static final Logger LOGGER = LoggerFactory.getLogger(DemoDataListener.class);
    /**
     * 每隔5条存储数据库，实际使用中可以3000条，然后清理 list ，方便内存回收。
     */
    private static final int BATCH_COUNT = 5;
    private List<DemoReadDto> list = new ArrayList<DemoReadDto>();
    /**
     * 假设这个是一个 DAO，当然有业务逻辑这个也可以是一个 service。当然如果不用存储这个对象没用。
     */
    private DemoDAO demoDAO;

    public DemoDataListener() {
        // 这里是 demo，所以随便 new 一个。实际使用如果到了 spring，请使用下面的有参构造函数。
        demoDAO = new DemoDAO();
    }

    /**
     * 如果使用了 spring，请使用这个构造方法。每次创建 Listener 的时候需要把 spring 管理的类传进来
     *
     * @param demoDAO
     */
    public DemoDataListener(DemoDAO demoDAO) {
        this.demoDAO = demoDAO;
    }

    /**
     * 这个每一条数据解析都会来调用
     *
     * @param data    one row value. Is is same as {@link AnalysisContext#readRowHolder()}
     * @param context
     */
    @Override
    public void invoke(DemoReadDto data, AnalysisContext context) {
        LOGGER.info("解析到一条数据:{}", JSON.toJSONString(data));
        list.add(data);
        // 达到 BATCH_COUNT 了，需要去存储一次数据库，防止数据几万条数据在内存，容易 OOM。
        if (list.size() >= BATCH_COUNT) {
            saveData();
            // 存储完成清理 list
            list.clear();
        }
    }

    /**
     * 所有数据解析完成了 都会来调用
     *
     * @param context
     */
    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        // 这里也要保存数据，确保最后遗留的数据也存储到数据库。
        saveData();
        LOGGER.info("所有数据解析完成！");
    }

    /**
     * 加上存储数据库
     */
    private void saveData() {
        LOGGER.info("{}条数据，开始存储数据库！", list.size());
        demoDAO.save(list);
        LOGGER.info("存储数据库成功！");
    }
}
```

**持久层**
```java
/**
 * @author vincent
 * 假设这个是你的 DAO 存储。当然还要这个类让 spring 管理，当然你不用需要存储，也不需要这个类。
 **/
public class DemoDAO {
    public void save(List<DemoReadDto> list) {
        // 如果是 mybatis，尽量别直接调用多次 insert，自己写一个mapper里面新增一个方法 batchInsert，所有数据一次性插入
    }
}
```

**测试类**
```java
/**
 * @author vincent
 */
public class EasyExcelTest {
    private static final String READPATH = "/Users/vincent/IDEA_Project/my_project/common/src/test/java/com/vincent/common/exceltest/template/read";

    /**
     * 数据量大的情况下，最简单的读
     * 1. 创建 excel 对应的实体对象 参照{@link DemoDto}
     * 2. 由于默认一行行的读取 excel，所以需要创建 excel 一行一行的回调监听器，参照{@link DemoDataListener}
     * 3. 直接读即可
     */
    @Test
    public void simpleRead() {
        // 有个很重要的点 DemoDataListener 不能被 spring 管理，要每次读取 excel 都要 new，然后里面用到 spring 可以构造方法传进去
        // 写法1：
        String fileName = Paths.get(READPATH).resolve("EasyExcelRead_03.xls").toString();
        // 这里 需要指定读用哪个 class 去读，然后读取第一个 sheet 文件流会自动关闭
        EasyExcel.read(fileName, DemoDto.class, new DemoDataListener()).sheet().doRead();

//        // 写法2：
//        fileName = READPATH + "EasyExcel.xlsx";
//        ExcelReader excelReader = null;
//        try {
//            excelReader = EasyExcel.read(fileName, DemoData.class, new DemoDataListener()).build();
//            ReadSheet readSheet = EasyExcel.readSheet(0).build();
//            excelReader.read(readSheet);
//        } finally {
//            if (excelReader != null) {
//                // 这里千万别忘记关闭，读的时候会创建临时文件，到时磁盘会崩的
//                excelReader.finish();
//            }
//        }
    }
}
```

**显示结果**
```java
13:38:43.040 [main] INFO com.vincent.common.exceltest.easyexcel.DemoDataListener - 解析到一条数据:{"date":1603189754000,"doubleData":"56%","string":"字符串0"}
13:38:43.040 [main] INFO com.vincent.common.exceltest.easyexcel.DemoDataListener - 解析到一条数据:{"date":1603276154000,"doubleData":"56%","string":"字符串1"}
13:38:43.040 [main] INFO com.vincent.common.exceltest.easyexcel.DemoDataListener - 解析到一条数据:{"date":1603362554000,"doubleData":"56%","string":"字符串2"}
13:38:43.041 [main] INFO com.vincent.common.exceltest.easyexcel.DemoDataListener - 解析到一条数据:{"date":1603448954000,"doubleData":"56%","string":"字符串3"}
13:38:43.041 [main] INFO com.vincent.common.exceltest.easyexcel.DemoDataListener - 解析到一条数据:{"date":1603535354000,"doubleData":"56%","string":"字符串4"}
13:38:43.041 [main] INFO com.vincent.common.exceltest.easyexcel.DemoDataListener - 5条数据，开始存储数据库！
13:38:43.041 [main] INFO com.vincent.common.exceltest.easyexcel.DemoDataListener - 存储数据库成功！
13:38:43.041 [main] INFO com.vincent.common.exceltest.easyexcel.DemoDataListener - 解析到一条数据:{"date":1603621754000,"doubleData":"56%","string":"字符串5"}
13:38:43.041 [main] INFO com.vincent.common.exceltest.easyexcel.DemoDataListener - 解析到一条数据:{"date":1603708154000,"doubleData":"56%","string":"字符串6"}
13:38:43.042 [main] INFO com.vincent.common.exceltest.easyexcel.DemoDataListener - 解析到一条数据:{"date":1603794554000,"doubleData":"56%","string":"字符串7"}
13:38:43.042 [main] INFO com.vincent.common.exceltest.easyexcel.DemoDataListener - 解析到一条数据:{"date":1603880954000,"doubleData":"56%","string":"字符串8"}
13:38:43.042 [main] INFO com.vincent.common.exceltest.easyexcel.DemoDataListener - 解析到一条数据:{"date":1603967354000,"doubleData":"56%","string":"字符串9"}
13:38:43.042 [main] INFO com.vincent.common.exceltest.easyexcel.DemoDataListener - 5条数据，开始存储数据库！
13:38:43.042 [main] INFO com.vincent.common.exceltest.easyexcel.DemoDataListener - 存储数据库成功！
13:38:43.043 [main] INFO com.vincent.common.exceltest.easyexcel.DemoDataListener - 0条数据，开始存储数据库！
13:38:43.043 [main] INFO com.vincent.common.exceltest.easyexcel.DemoDataListener - 存储数据库成功！
13:38:43.043 [main] INFO com.vincent.common.exceltest.easyexcel.DemoDataListener - 所有数据解析完成！
```

## 写 Excel

**实体类**
```java
@Data
public class DemoWriteDto {
    @ExcelProperty("字符串标题")
    private String string;

    @ExcelProperty("日期标题")
    /*
     * 这里的时间转换，当为读取 excel 时，时间类为 String 时才会生效，其他类型时 @DateTimeFormat 不会转换。
     *              当为写入 excel 时，@DateTimeFormat 时间转换会生效。
     */
    @DateTimeFormat("yyyy年MM月dd日HH时mm分ss秒")
    private Date date;

    @ExcelProperty("数字标题")
    /*
     * 百分比的数字
     * 当为写入 excel 时，@NumberFormat 数字转换生效。
     */
    @NumberFormat("#.##%")
    private Double doubleData;

    /**
     * 忽略这个字段
     */
    @ExcelIgnore
    private String ignore;
}
```

**测试类**
```java
/**
 * @author vincent
 */
public class EasyExcelTest {
    private static final String WRITEPATH = "/Users/vincent/IDEA_Project/my_project/common/src/test/java/com/vincent/common/exceltest/template/write";

    private List<DemoWriteDto> data() {
        List<DemoWriteDto> list = Lists.newArrayList();
        for (int i = 0; i < 10; i++) {
            DemoWriteDto data = new DemoWriteDto();
            data.setString("字符串" + i);
            data.setDate(new Date());
            data.setDoubleData(0.56);
            list.add(data);
        }
        return list;
    }

    /**
     * 最简单的写
     * 1. 创建 excel 对应的实体对象 参照{@link DemoWriteDto}
     * 2. 直接写即可
     */
    @Test
    public void simpleWrite() {
        // 写法1
        // 这里 需要指定写用哪个 class 去写，然后写到第一个 sheet，名字为模板，然后文件流会自动关闭
        // 官方文档中说 03.xls 版本的 excel 需要设置 excelType()，但是自测下来并不需要。
        String fileName_03 = Paths.get(WRITEPATH).resolve("EasyExcelWrite_03.xls").toString();
        EasyExcel.write(fileName_03, DemoWriteDto.class).sheet("模板").doWrite(data());
        System.out.println();

        String fileName_07 = Paths.get(WRITEPATH).resolve("EasyExcelWrite_07.xlsx").toString();
        EasyExcel.write(fileName_07, DemoWriteDto.class).sheet("模板").doWrite(data());

//        // 写法2
//        fileName = PATH + "simpleWrite" + System.currentTimeMillis() + ".xlsx";
//        // 这里需要指定写用哪个 class 去写
//        ExcelWriter excelWriter = null;
//        try {
//            excelWriter = EasyExcel.write(fileName, DemoWriteDto.class).build();
//            WriteSheet writeSheet = EasyExcel.writerSheet("模板").build();
//            excelWriter.write(data(), writeSheet);
//        } finally {
//            // 千万别忘记 finish 会帮忙关闭流
//            if (excelWriter != null) {
//                excelWriter.finish();
//            }
//        }
    }
}
```

**导出后的 Excel 数据**

导出的数据都是一样，区别在于一个03版的 Excel、一个07版的 Excel。
![6](6.png)


## web 上传、下载

**测试类**
```java
    /**
     * 文件下载（失败了会返回一个有部分数据的 Excel）
     * 1. 创建 excel 对应的实体对象 参照{@link DownloadData}
     * 2. 设置返回的 参数
     * 3. 直接写，这里注意，finish 的时候会自动关闭 OutputStream,当然你外面再关闭流问题不大
     */
    @GetMapping("download")
    public void download(HttpServletResponse response) throws IOException {
        // 这里注意 有同学反应使用swagger 会导致各种问题，请直接用浏览器或者用postman
        response.setContentType("application/vnd.ms-excel");
        response.setCharacterEncoding("utf-8");
        // 这里URLEncoder.encode可以防止中文乱码 当然和easyexcel没有关系
        String fileName = URLEncoder.encode("测试", "UTF-8");
        response.setHeader("Content-disposition", "attachment;filename=" + fileName + ".xlsx");
        EasyExcel.write(response.getOutputStream(), DownloadData.class).sheet("模板").doWrite(data());
    }

    /**
     * 文件上传
     * 1. 创建 excel 对应的实体对象 参照{@link UploadData}
     * 2. 由于默认一行行的读取 excel，所以需要创建excel一行一行的回调监听器，参照{@link UploadDataListener}
     * 3. 直接读即可
     */
    @PostMapping("upload")
    @ResponseBody
    public String upload(MultipartFile file) throws IOException {
        EasyExcel.read(file.getInputStream(), UploadData.class, new UploadDataListener(uploadDAO)).sheet().doRead();
        return "success";
    }
```