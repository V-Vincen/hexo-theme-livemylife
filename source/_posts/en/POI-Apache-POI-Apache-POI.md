---
title: '[POI - Apache POI] Apache POI'
catalog: true
date: 2020-10-22 14:02:44
subtitle: The Apache POI project is the master project for developing pure Java ports of file formats based on Microsoft's OLE 2 Compound Document Format...
header-img: /img/header_img/categories_bg11.jpg
tags:
- POI
---

## 概述
Apache POI 是基于 Office Open XML标准（OOXML）和 Microsoft 的 OLE 2 复合文档格式（OLE2）处理各种文件格式的开源项目。 简而言之，您可以使用 Java 读写 MS Excel 文件，也可以使用 Java 读写 MS Word 和 MS PowerPoint 文件。

官网：https://poi.apache.org/

在线 Javadoc：https://poi.apache.org/apidocs/4.1/

## 模块
- `HSSF `：提供读写 Microsoft Excel XLS 格式（Microsoft Excel 97（-2003））档案的功能。
- `XSSF `：提供读写 Microsoft Excel OOXML XLSX 格式（Microsoft Excel XML（2007+））档案的功能。
- `SXSSF `：提供低内存占用量读写 Microsoft Excel OOXML XLSX 格式档案的功能。
- `HWPF `：提供读写 Microsoft Word DOC97 格式（Microsoft Word 97 （-2003））档案的功能。
- `XWPF `：提供读写 Microsoft Word DOC2003 格式（WordprocessingML （2007+））档案的功能。
- `HSLF/XSLF `：提供读写 Microsoft PowerPoint 格式档案的功能。
- `HDGF/XDGF `：提供读 Microsoft Visio 格式档案的功能。
- `HPBF `：提供读 Microsoft Publisher 格式档案的功能。
- `HSMF `：提供读 Microsoft Outlook 格式档案的功能。

## Maven 依赖
```xml
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi</artifactId>
    <version>4.1.2</version>
</dependency>
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>4.1.2</version>
</dependency>
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml-schemas</artifactId>
    <version>4.1.2</version>
</dependency>
```

## 读 Excel
### 基础写法
**Excel 数据**

![1](1.png)

```java
/**
 * @author vincent
 */
@Slf4j
public class PoiReadExcelTest {
    private static final String PATH = "/Users/vincent/IDEA_Project/my_project/common/src/test/java/com/vincent/common/exceltest/template/read";

    private Path filePath = Paths.get(PATH);

    @Test
    public void readExcelPoiUtilsTest() throws Exception {
        List<ExcelDto> list = ExcelPoiUtils.readExcel(filePath.resolve("PoiExcelRead_07.xlsx").toFile(), ExcelDto.class);
        list.forEach(System.out::println);
    }
}
```

**显示结果**
```
17:10:25.002 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowFirst：[字符串标题, 日期标题, 数字标题]...... 

17:10:25.004 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 2 - 1 ]......
17:10:25.071 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：字符串0
17:10:25.071 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 2 - 2 ]......
17:10:25.125 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：2020-10-20 18:29:14
17:10:25.126 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 2 - 3 ]......
17:10:25.126 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：56%
17:10:25.126 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 3 - 1 ]......
17:10:25.126 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：字符串1
17:10:25.126 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 3 - 2 ]......
17:10:25.127 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：2020-10-21 18:29:14
17:10:25.127 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 3 - 3 ]......
17:10:25.127 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：56%
17:10:25.127 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 4 - 1 ]......
17:10:25.127 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：字符串2
17:10:25.127 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 4 - 2 ]......
17:10:25.127 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：2020-10-22 18:29:14
17:10:25.127 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 4 - 3 ]......
17:10:25.127 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：56%
17:10:25.127 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 5 - 1 ]......
17:10:25.128 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：字符串3
17:10:25.128 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 5 - 2 ]......
17:10:25.128 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：2020-10-23 18:29:14
17:10:25.128 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 5 - 3 ]......
17:10:25.128 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：56%
17:10:25.128 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 6 - 1 ]......
17:10:25.128 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：字符串4
17:10:25.128 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 6 - 2 ]......
17:10:25.128 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：2020-10-24 18:29:14
17:10:25.128 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 6 - 3 ]......
17:10:25.129 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：56%
17:10:25.129 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 7 - 1 ]......
17:10:25.129 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：字符串5
17:10:25.129 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 7 - 2 ]......
17:10:25.129 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：2020-10-25 18:29:14
17:10:25.129 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 7 - 3 ]......
17:10:25.129 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：56%
17:10:25.129 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 8 - 1 ]......
17:10:25.129 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：字符串6
17:10:25.129 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 8 - 2 ]......
17:10:25.129 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：2020-10-26 18:29:14
17:10:25.129 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 8 - 3 ]......
17:10:25.129 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：56%
17:10:25.129 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 9 - 1 ]......
17:10:25.130 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：字符串7
17:10:25.130 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 9 - 2 ]......
17:10:25.130 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：2020-10-27 18:29:14
17:10:25.130 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 9 - 3 ]......
17:10:25.130 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：56%
17:10:25.130 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 10 - 1 ]......
17:10:25.130 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：字符串8
17:10:25.130 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 10 - 2 ]......
17:10:25.130 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：2020-10-28 18:29:14
17:10:25.130 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 10 - 3 ]......
17:10:25.130 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：56%
17:10:25.130 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 11 - 1 ]......
17:10:25.130 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：字符串9
17:10:25.131 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 11 - 2 ]......
17:10:25.131 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：2020-10-29 18:29:14
17:10:25.131 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - RowNum - CellNum：[ 11 - 3 ]......
17:10:25.131 [main] INFO com.vincent.common.exceltest.poi.PoiReadExcelTest - CellValue Convert To String：56%
```

### 尝试封装通用方法
**Excel 数据**

![2](2.png)

**自定义枚举类**
```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@interface ExcelTransfer {
    String value() default "";

    String paseDate() default YYYY_MM_DD_HH_MM_SS;
}
```

**Excel 通用工具类**
```java
/**
 * @author vincent
 */
@Slf4j
public class ExcelPoiUtils {
    public static final String YYYY_MM_DD_HH_MM_SS = "yyyy-MM-dd HH:mm:ss";

    public static <T> List<T> readExcel(File file, Class<T> clazz) throws Exception {
        List<T> list = Lists.newArrayList();

        // 1. 创建一个工作簿
        Workbook workbook = WorkbookFactory.create(file);

        // 2. 获取表
        Sheet sheet = workbook.getSheetAt(0);

        // 3. 获取表中的内容
        // 获取表抬头
        List<String> rowFirst = Lists.newArrayList();
        Row rowTitle = sheet.getRow(0);
        if (Objects.nonNull(rowTitle)) {
            // 读取列数
            int cellCount = rowTitle.getPhysicalNumberOfCells();
            for (int cellNum = 0; cellNum < cellCount; cellNum++) {
                Cell cell = rowTitle.getCell(cellNum);
                if (Objects.nonNull(cell)) {
                    String cellValue = cell.getStringCellValue();
                    rowFirst.add(cellValue);
                }
            }
        }
        log.info(String.format("RowFirst：%s...... \n", Arrays.toString(rowFirst.toArray())));

        /*
         * Class<T> clazz：需要转换为具体的实体类。
         * 此方法为获取 clazz（实体类）中的全部字段属性，与读取到的 excel 表头字段进行匹配，返回一个 Map<columnIndex,{columnIndex,name,field}>
         * columnIndex：为 clazz（实体类）字段属性在 excel 表头字段中的对应位置。
         * name：为自定义注解 @ExcelTransfer 中的 value 值（如：@ExcelTransfer(value = "字符串标题")）；如果没有设置自定义注解，则为 clazz（实体类）字段属性名。
         * field：为 clazz（实体类）字段属性。
         */
        List<Field> allFieldsList = FieldUtils.getAllFieldsList(clazz);
        Map<Integer, ClazzFields> mapClazzFields = allFieldsList.stream()
                .map(field -> {
                    if (field.isAnnotationPresent(ExcelTransfer.class)) {
                        ExcelTransfer annotation = field.getAnnotation(ExcelTransfer.class);
                        String annotationVal = annotation.value();
                        return new ClazzFields(rowFirst.indexOf(annotationVal), annotationVal, field);
                    }
                    return new ClazzFields(rowFirst.indexOf(field.getName()), field.getName(), field);
                })
                .collect(Collectors.toMap(ClazzFields::getColumnIndex, Function.identity(), (v1, v2) -> v1));

        // 获取除表抬头外的内容
        // 读取行数
        int rowCount = sheet.getPhysicalNumberOfRows();
        for (int rowNum = 1; rowNum < rowCount; rowNum++) {

            T instance = clazz.newInstance();

            Row rowData = sheet.getRow(rowNum);
            // 读取列数
            int cellCount = rowTitle.getPhysicalNumberOfCells();
            for (int cellNum = 0; cellNum < cellCount; cellNum++) {

                ClazzFields clazzFields = mapClazzFields.get(cellNum);

                log.info(String.format("RowNum - CellNum：[ %s - %s ]......", (rowNum + 1), (cellNum + 1)));
                // 读取每一个单元格中的内容
                Cell cell = rowData.getCell(cellNum);
                if (Objects.nonNull(cell)) {
                    /*
                     * 匹配每个单元格数据类型，把读取到的单元格的内容全部转换为 String 类型
                     */
                    String cellValue = cellTypeConvertToString(cell);
                    log.info(String.format("CellValue Convert To String：%s", cellValue));

                    if (Objects.isNull(clazzFields)) {
                        log.warn("The DtoField does not match the excel table field......\n");
                        continue;
                    }

                    Field dtoField = clazzFields.getField();
                    Field field = instance.getClass().getDeclaredField(dtoField.getName());
                    field.setAccessible(true);
                    Object o = fieldTypeConvertTo(dtoField, cellValue);
                    field.set(instance, o);

                    log.info(String.format("DtoFieldType：%s，DtoFieldValue：%s......\n", dtoField.getType(), o));
                }
            }
            list.add(instance);
        }
        return list;
    }
    
    private static Map<Class, BiFunction<String, String, Object>> MAP;

    static {
        MAP = Maps.newHashMap();
        MAP.put(String.class, (s1, s2) -> s1);
        MAP.put(Integer.class, (s1, s2) -> Integer.valueOf(s1));
        MAP.put(Byte.class, (s1, s2) -> Byte.valueOf(s1));
        MAP.put(Short.class, (s1, s2) -> Short.valueOf(s1));
        MAP.put(Long.class, (s1, s2) -> Long.valueOf(s1));
        MAP.put(Float.class, (s1, s2) -> Float.valueOf(s1));
        MAP.put(Double.class, (s1, s2) -> Double.valueOf(s1));
        MAP.put(Boolean.class, (s1, s2) -> Boolean.valueOf(s1));
        MAP.put(BigDecimal.class, (s1, s2) -> new BigDecimal(s1));

        MAP.put(Date.class, CheckedFunction2.<String, String, Object>of(DateUtils::parseDate).unchecked());

        MAP.put(int.class, (s1, s2) -> Integer.valueOf(s1));
        MAP.put(byte.class, (s1, s2) -> Byte.valueOf(s1));
        MAP.put(short.class, (s1, s2) -> Short.valueOf(s1));
        MAP.put(long.class, (s1, s2) -> Long.valueOf(s1));
        MAP.put(float.class, (s1, s2) -> Float.valueOf(s1));
        MAP.put(double.class, (s1, s2) -> Double.valueOf(s1));
        MAP.put(boolean.class, (s1, s2) -> Boolean.valueOf(s1));
    }

    /**
     * 方法一：表驱动
     * 把单元格的值转换成相对于的类型值
     *
     * @param field
     * @param value
     * @return
     */
    private static Object fieldTypeConvertTo(Field field, String value) {
        if (!MAP.containsKey(field.getType())) {
            return null;
        }
        String format = Optional.ofNullable(field.getAnnotation(ExcelTransfer.class))
                .map(ExcelTransfer::paseDate)
                .orElse(YYYY_MM_DD_HH_MM_SS);
        if (field.getType() == Date.class) {
            log.info(String.format("If CellFieldType is date, the pattern of CellField is %s ......", format));
        }
        log.info(String.format("CellFieldType（String） Convert To DtoFieldType（%s）......", field.getType()));
        return MAP.get(field.getType()).apply(value, format);
    }
    
    /**
     * 第二种方法：if else ...
     * 把单元格的值转换成相对于的类型值
     *
     * @param field
     * @param value
     * @return
     */
    private static Object fieldTypeConvertTo2(Field field, String value) {
        if (!MAP.containsKey(field.getType())) {
            return null;
        }
        String format = Optional.ofNullable(field.getAnnotation(ExcelTransfer.class))
                .map(ExcelTransfer::paseDate)
                .orElse(YYYY_MM_DD_HH_MM_SS);

        if (ClassUtils.isPrimitiveOrWrapper(field.getType())) {
            try {
                Method valueOf = field.getType().getDeclaredMethod("valueOf");
                return valueOf.invoke(null, value);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if (field.getType() == Date.class) {
            try {
                return DateUtils.parseDate(value, format);
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }

        if (field.getType() == BigDecimal.class) {
            return new BigDecimal(value);
        }
        return null;
    }

    /**
     * 方法一：switch case ...
     * excel 单元格转换为 String 类型
     *
     * @param cell
     * @return
     */
    public static String cellTypeConvertToString(Cell cell) {
        // 匹配每个单元格数据类型
        String cellValue = "";
        switch (cell.getCellTypeEnum()) {
            // 布尔类型
            case BLANK:
                log.info("CellType：【BLANK】");
                break;
            // 字符串类型
            case STRING:
                log.info("CellType：【STRING】");
                cellValue = cell.getStringCellValue();
                break;
            // 布尔类型
            case BOOLEAN:
                log.info("CellType：【BOOLEAN】");
                cellValue = String.valueOf(cell.getBooleanCellValue());
                break;
            // 数字类型（数字，日期）
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    log.info("CellType：【NUMERIC Convert to DATE】");
//                    DataFormatter dataFormatter = new DataFormatter();
//                    cellValue = dataFormatter.formatCellValue(cell);
                    cellValue = DateFormatUtils.format(cell.getDateCellValue(), YYYY_MM_DD_HH_MM_SS);
                } else {
                    // 不是日期格式，防止数字过长（可能是科学计数法），所以需要转换成字符串输出
                    log.info("CellType：【NUMERIC Convert to STRING】");
                    cell.setCellType(CellType.STRING);
                    cellValue = cell.getStringCellValue();
                }
                break;
            case ERROR:
                log.info("CellType：【ERROR】=> Get the cell error...");
                break;
        }
        return cellValue;
    }

    /**
     * 方法二：模式匹配
     *
     * @param cell
     * @return
     */
    public static String cellTypeConvertToStringPatternMatching(Cell cell) {
        return API.Match(cell.getCellTypeEnum()).of(
                Case($(s -> s == CellType.BLANK), () -> ""),
                Case($(s -> s == CellType.STRING), cell::getStringCellValue),
                Case($(s -> s == CellType.BOOLEAN), () -> String.valueOf(cell.getBooleanCellValue())),
                Case($(s -> s == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)), () -> DateFormatUtils.format(cell.getDateCellValue(), YYYY_MM_DD_HH_MM_SS)),
                Case($(s -> s == CellType.NUMERIC && !DateUtil.isCellDateFormatted(cell)), () -> {
                    cell.setCellType(CellType.STRING);
                    return cell.getStringCellValue();
                }),
                Case($(s -> s == CellType.ERROR), () -> {
                    log.info("【ERROR】：Get the cell error...");
                    return "";
                })
        );
    }
}


@Data
class ClazzFields {
    /**
     * 列的位置
     */
    private Integer columnIndex;

    /**
     * 如果有自定义注解，则为 @ExcelTransfer 中的 value 值（如：@ExcelTransfer(value = "字符串标题")）；
     * 如果没有设置自定义注解，则为 clazz（实体类）字段属性名
     */
    private String name;

    /**
     * clazz 实体类字段属性
     */
    private Field field;

    public ClazzFields() {
    }

    public ClazzFields(Integer columnIndex, String name, Field field) {
        this.columnIndex = columnIndex;
        this.name = name;
        this.field = field;
    }
}
```

**实体类**
```java
@Data
public class ExcelDto {
    @ExcelTransfer(value = "字符串标题")
    private String id;

    @ExcelTransfer(value = "字符串日期标题", paseDate = "yyyy>MM>dd HH:mm:ss")
    private Date date;

    @ExcelTransfer(value = "数字标题")
    private Double price;

    @ExcelTransfer(value = "时间日期标题")
    private String data;
}
```

**测试类**
```java
/**
 * @author vincent
 */
@Slf4j
public class PoiReadExcelTest {
    private static final String PATH = "/Users/vincent/IDEA_Project/my_project/common/src/test/java/com/vincent/common/exceltest/template/read";

    private Path filePath = Paths.get(PATH);

    @Test
    public void readExcelPoiUtilsTest() throws Exception {
        List<ExcelDto> list = ExcelPoiUtils.readExcel(filePath.resolve("PoiExcelRead_07.xlsx").toFile(), ExcelDto.class);
        list.forEach(System.out::println);
    }
}
```

**显示结果**
```
17:26:21.515 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowFirst：[字符串标题, 字符串日期标题, 数字标题, 时间日期标题]...... 

17:26:21.537 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 2 - 1 ]......
17:26:21.538 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.538 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：字符串0
17:26:21.540 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.541 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：字符串0......

17:26:21.541 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 2 - 2 ]......
17:26:21.541 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.542 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020>10>20  18:44:12
17:26:21.542 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - If CellFieldType is date, the pattern of CellField is yyyy>MM>dd HH:mm:ss ......
17:26:21.542 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.util.Date）......
17:26:21.560 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.util.Date，DtoFieldValue：Tue Oct 20 18:44:12 CST 2020......

17:26:21.560 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 2 - 3 ]......
17:26:21.580 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to STRING】
17:26:21.586 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：0.56000000000000005
17:26:21.586 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.Double）......
17:26:21.587 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.Double，DtoFieldValue：0.56......

17:26:21.587 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 2 - 4 ]......
17:26:21.588 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to DATE】
17:26:21.680 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020-10-20 18:22:22
17:26:21.680 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.680 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：2020-10-20 18:22:22......

17:26:21.681 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 3 - 1 ]......
17:26:21.681 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.681 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：字符串1
17:26:21.681 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.681 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：字符串1......

17:26:21.681 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 3 - 2 ]......
17:26:21.682 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.682 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020>10>20  18:44:13
17:26:21.682 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - If CellFieldType is date, the pattern of CellField is yyyy>MM>dd HH:mm:ss ......
17:26:21.682 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.util.Date）......
17:26:21.682 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.util.Date，DtoFieldValue：Tue Oct 20 18:44:13 CST 2020......

17:26:21.682 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 3 - 3 ]......
17:26:21.683 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to STRING】
17:26:21.683 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：0.56000000000000005
17:26:21.684 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.Double）......
17:26:21.684 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.Double，DtoFieldValue：0.56......

17:26:21.685 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 3 - 4 ]......
17:26:21.686 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to DATE】
17:26:21.688 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020-10-21 18:22:22
17:26:21.688 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.688 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：2020-10-21 18:22:22......

17:26:21.688 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 4 - 1 ]......
17:26:21.688 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.688 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：字符串2
17:26:21.688 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.688 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：字符串2......

17:26:21.689 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 4 - 2 ]......
17:26:21.689 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.689 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020>10>20  18:44:14
17:26:21.689 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - If CellFieldType is date, the pattern of CellField is yyyy>MM>dd HH:mm:ss ......
17:26:21.689 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.util.Date）......
17:26:21.689 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.util.Date，DtoFieldValue：Tue Oct 20 18:44:14 CST 2020......

17:26:21.690 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 4 - 3 ]......
17:26:21.690 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to STRING】
17:26:21.690 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：0.56000000000000005
17:26:21.690 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.Double）......
17:26:21.691 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.Double，DtoFieldValue：0.56......

17:26:21.691 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 4 - 4 ]......
17:26:21.691 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to DATE】
17:26:21.692 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020-10-22 18:22:22
17:26:21.693 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.693 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：2020-10-22 18:22:22......

17:26:21.694 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 5 - 1 ]......
17:26:21.694 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.695 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：字符串3
17:26:21.695 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.695 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：字符串3......

17:26:21.695 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 5 - 2 ]......
17:26:21.696 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.696 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020>10>20  18:44:15
17:26:21.696 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - If CellFieldType is date, the pattern of CellField is yyyy>MM>dd HH:mm:ss ......
17:26:21.696 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.util.Date）......
17:26:21.696 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.util.Date，DtoFieldValue：Tue Oct 20 18:44:15 CST 2020......

17:26:21.696 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 5 - 3 ]......
17:26:21.697 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to STRING】
17:26:21.697 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：0.56000000000000005
17:26:21.697 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.Double）......
17:26:21.697 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.Double，DtoFieldValue：0.56......

17:26:21.697 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 5 - 4 ]......
17:26:21.698 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to DATE】
17:26:21.698 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020-10-23 18:22:22
17:26:21.698 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.698 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：2020-10-23 18:22:22......

17:26:21.698 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 6 - 1 ]......
17:26:21.698 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.698 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：字符串4
17:26:21.699 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.699 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：字符串4......

17:26:21.699 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 6 - 2 ]......
17:26:21.699 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.699 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020>10>20  18:44:16
17:26:21.699 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - If CellFieldType is date, the pattern of CellField is yyyy>MM>dd HH:mm:ss ......
17:26:21.699 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.util.Date）......
17:26:21.701 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.util.Date，DtoFieldValue：Tue Oct 20 18:44:16 CST 2020......

17:26:21.702 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 6 - 3 ]......
17:26:21.704 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to STRING】
17:26:21.705 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：0.56000000000000005
17:26:21.705 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.Double）......
17:26:21.705 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.Double，DtoFieldValue：0.56......

17:26:21.705 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 6 - 4 ]......
17:26:21.706 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to DATE】
17:26:21.706 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020-10-24 18:22:22
17:26:21.706 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.706 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：2020-10-24 18:22:22......

17:26:21.706 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 7 - 1 ]......
17:26:21.707 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.707 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：字符串5
17:26:21.707 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.707 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：字符串5......

17:26:21.707 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 7 - 2 ]......
17:26:21.707 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.707 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020>10>20  18:44:17
17:26:21.707 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - If CellFieldType is date, the pattern of CellField is yyyy>MM>dd HH:mm:ss ......
17:26:21.707 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.util.Date）......
17:26:21.708 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.util.Date，DtoFieldValue：Tue Oct 20 18:44:17 CST 2020......

17:26:21.708 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 7 - 3 ]......
17:26:21.708 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to STRING】
17:26:21.709 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：0.56000000000000005
17:26:21.709 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.Double）......
17:26:21.709 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.Double，DtoFieldValue：0.56......

17:26:21.709 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 7 - 4 ]......
17:26:21.709 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to DATE】
17:26:21.709 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020-10-25 18:22:22
17:26:21.709 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.710 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：2020-10-25 18:22:22......

17:26:21.710 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 8 - 1 ]......
17:26:21.710 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.710 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：字符串6
17:26:21.710 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.711 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：字符串6......

17:26:21.711 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 8 - 2 ]......
17:26:21.711 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.711 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020>10>20  18:44:18
17:26:21.711 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - If CellFieldType is date, the pattern of CellField is yyyy>MM>dd HH:mm:ss ......
17:26:21.711 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.util.Date）......
17:26:21.712 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.util.Date，DtoFieldValue：Tue Oct 20 18:44:18 CST 2020......

17:26:21.713 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 8 - 3 ]......
17:26:21.714 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to STRING】
17:26:21.715 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：0.56000000000000005
17:26:21.716 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.Double）......
17:26:21.716 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.Double，DtoFieldValue：0.56......

17:26:21.716 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 8 - 4 ]......
17:26:21.717 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to DATE】
17:26:21.718 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020-10-26 18:22:22
17:26:21.719 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.719 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：2020-10-26 18:22:22......

17:26:21.720 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 9 - 1 ]......
17:26:21.720 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.721 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：字符串7
17:26:21.721 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.721 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：字符串7......

17:26:21.721 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 9 - 2 ]......
17:26:21.721 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.722 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020>10>20  18:44:19
17:26:21.722 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - If CellFieldType is date, the pattern of CellField is yyyy>MM>dd HH:mm:ss ......
17:26:21.722 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.util.Date）......
17:26:21.723 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.util.Date，DtoFieldValue：Tue Oct 20 18:44:19 CST 2020......

17:26:21.723 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 9 - 3 ]......
17:26:21.724 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to STRING】
17:26:21.725 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：0.56000000000000005
17:26:21.725 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.Double）......
17:26:21.725 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.Double，DtoFieldValue：0.56......

17:26:21.725 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 9 - 4 ]......
17:26:21.725 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to DATE】
17:26:21.725 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020-10-27 18:22:22
17:26:21.726 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.726 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：2020-10-27 18:22:22......

17:26:21.726 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 10 - 1 ]......
17:26:21.726 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.726 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：字符串8
17:26:21.726 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.726 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：字符串8......

17:26:21.726 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 10 - 2 ]......
17:26:21.726 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.726 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020>10>20  18:44:20
17:26:21.726 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - If CellFieldType is date, the pattern of CellField is yyyy>MM>dd HH:mm:ss ......
17:26:21.726 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.util.Date）......
17:26:21.727 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.util.Date，DtoFieldValue：Tue Oct 20 18:44:20 CST 2020......

17:26:21.727 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 10 - 3 ]......
17:26:21.727 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to STRING】
17:26:21.727 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：0.56000000000000005
17:26:21.728 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.Double）......
17:26:21.728 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.Double，DtoFieldValue：0.56......

17:26:21.728 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 10 - 4 ]......
17:26:21.728 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to DATE】
17:26:21.729 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020-10-28 18:22:22
17:26:21.730 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.730 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：2020-10-28 18:22:22......

17:26:21.730 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 11 - 1 ]......
17:26:21.730 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.730 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：字符串9
17:26:21.730 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.731 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：字符串9......

17:26:21.731 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 11 - 2 ]......
17:26:21.731 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【STRING】
17:26:21.731 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020>10>20  18:44:21
17:26:21.731 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - If CellFieldType is date, the pattern of CellField is yyyy>MM>dd HH:mm:ss ......
17:26:21.731 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.util.Date）......
17:26:21.731 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.util.Date，DtoFieldValue：Tue Oct 20 18:44:21 CST 2020......

17:26:21.731 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 11 - 3 ]......
17:26:21.732 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to STRING】
17:26:21.732 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：0.56000000000000005
17:26:21.732 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.Double）......
17:26:21.732 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.Double，DtoFieldValue：0.56......

17:26:21.732 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - RowNum - CellNum：[ 11 - 4 ]......
17:26:21.733 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellType：【NUMERIC Convert to DATE】
17:26:21.733 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellValue Convert To String：2020-10-29 18:22:22
17:26:21.733 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - CellFieldType（String） Convert To DtoFieldType（class java.lang.String）......
17:26:21.733 [main] INFO com.vincent.common.exceltest.poi.ExcelPoiUtils - DtoFieldType：class java.lang.String，DtoFieldValue：2020-10-29 18:22:22......

ExcelDto(id=字符串0, date=Tue Oct 20 18:44:12 CST 2020, price=0.56, data=2020-10-20 18:22:22)
ExcelDto(id=字符串1, date=Tue Oct 20 18:44:13 CST 2020, price=0.56, data=2020-10-21 18:22:22)
ExcelDto(id=字符串2, date=Tue Oct 20 18:44:14 CST 2020, price=0.56, data=2020-10-22 18:22:22)
ExcelDto(id=字符串3, date=Tue Oct 20 18:44:15 CST 2020, price=0.56, data=2020-10-23 18:22:22)
ExcelDto(id=字符串4, date=Tue Oct 20 18:44:16 CST 2020, price=0.56, data=2020-10-24 18:22:22)
ExcelDto(id=字符串5, date=Tue Oct 20 18:44:17 CST 2020, price=0.56, data=2020-10-25 18:22:22)
ExcelDto(id=字符串6, date=Tue Oct 20 18:44:18 CST 2020, price=0.56, data=2020-10-26 18:22:22)
ExcelDto(id=字符串7, date=Tue Oct 20 18:44:19 CST 2020, price=0.56, data=2020-10-27 18:22:22)
ExcelDto(id=字符串8, date=Tue Oct 20 18:44:20 CST 2020, price=0.56, data=2020-10-28 18:22:22)
ExcelDto(id=字符串9, date=Tue Oct 20 18:44:21 CST 2020, price=0.56, data=2020-10-29 18:22:22)
```

## 写 Excel
### 基础写法

```java
/**
 * @author vincent
 */
public class PoiWriteExcelTest {
    private static final String PATH = "/Users/vincent/IDEA_Project/my_project/common/src/test/java/com/vincent/common/exceltest/template/write";

    private static final Path FILEPATH = Paths.get(PATH);

    /**
     * 03 版本 Excel 后缀名为 xls，最多只有 A65536 行，
     * 创建 03 版本 Excel 的对象为：HSSFWorkbook，
     * 超出 A65536 行时会报异常。
     *
     * @throws Exception
     */
    @Test
    public void writeExcel03Test() throws Exception {
        long begin = System.currentTimeMillis();

        // 1. 创建一个工作簿
        Workbook workbook = new HSSFWorkbook();

        // 2. 创建一个工作表
        Sheet sheet = workbook.createSheet("Excel_03_xls");

        // 3. 创建第一行
        Row rowFirst = sheet.createRow(0);
        for (int rowFirstCellNum = 0; rowFirstCellNum < 10; rowFirstCellNum++) {
            Cell cell = rowFirst.createCell(rowFirstCellNum);
            cell.setCellValue("表头" + rowFirstCellNum);
        }

        for (int rowNum = 1; rowNum < 65536; rowNum++) {
            Row row = sheet.createRow(rowNum);
            for (int cellNum = 0; cellNum < 10; cellNum++) {
                Cell cell = row.createCell(cellNum);
                if (cellNum == 9) {
                    LocalDateTime now = LocalDateTime.now();
                    String format = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                    cell.setCellValue(format);
                } else {
                    cell.setCellValue(cellNum);
                }
            }
        }
        System.out.println("Generate Excel Over......");

        // 5. 生成一张表（IO 流），03 版本的后缀名 xls
        OutputStream outputStream = Files.newOutputStream(FILEPATH.resolve("Excel_03.xls"));

        // 6. 输出
        workbook.write(outputStream);

        // 7. 关闭流
        outputStream.close();
        System.out.println("Excel_03 Generated Successfully......");

        long end = System.currentTimeMillis();
        System.out.println(String.format("Excel_03 Generated Time：%s ms......", (end - begin)));
    }

    /**
     * 07 版本 Excel 后缀名为 xlsx，行数不限，
     * 创建 07 版本 Excel 的对象为：XSSFWorkbook。
     *
     * @throws Exception
     */
    @Test
    public void writeExcel07Test() throws Exception {
        long begin = System.currentTimeMillis();

        // 1. 创建一个工作簿
        Workbook workbook = new XSSFWorkbook();

        // 2. 创建一个工作表
        Sheet sheet = workbook.createSheet("Excel_07_xlsx");

        // 3. 创建一个行
        Row rowFirst = sheet.createRow(0);
        for (int rowFirstCellNum = 0; rowFirstCellNum < 10; rowFirstCellNum++) {
            Cell cell = rowFirst.createCell(rowFirstCellNum);
            cell.setCellValue("表头" + rowFirstCellNum);
        }

        for (int rowNum = 1; rowNum < 65536; rowNum++) {
            Row row = sheet.createRow(rowNum);
            for (int cellNum = 0; cellNum < 10; cellNum++) {
                Cell cell = row.createCell(cellNum);
                if (cellNum == 9) {
                    LocalDateTime now = LocalDateTime.now();
                    String format = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                    cell.setCellValue(format);
                } else {
                    cell.setCellValue(cellNum);
                }
            }
        }
        System.out.println("Generate Excel Over......");

        // 5. 生成一张表（IO 流），07 版本的后缀名 xlsx
        OutputStream outputStream = Files.newOutputStream(FILEPATH.resolve("Excel_07.xlsx"));

        // 6. 输出
        workbook.write(outputStream);

        // 7. 关闭流
        outputStream.close();
        System.out.println("Excel_07 Generated Successfully......");

        long end = System.currentTimeMillis();
        System.out.println(String.format("Excel_07 Generated Time：%s ms......", (end - begin)));
    }

    /**
     * 07 版本 Excel 后缀名为 xlsx，行数不限，
     * 创建 07 版本 Excel 大数据量时的对象为：SXSSFWorkbook，
     * 在写入数据的过程中会产生临时文件，需要清除临时文件，默认写入临时文件的条数为100条，
     * 如果想要自定义内存中数据的数量，可以使用 new SXSSFWorkbook(数量)。
     *
     * @throws Exception
     */
    @Test
    public void writeBigDataExcel07Test() throws Exception {
        long begin = System.currentTimeMillis();

        // 1. 创建一个工作簿
        SXSSFWorkbook workbook = new SXSSFWorkbook();

        // 2. 创建一个工作表
        Sheet sheet = workbook.createSheet("ExcelBigData_07_xlsx");

        // 3. 创建一个行
        Row rowFirst = sheet.createRow(0);
        for (int rowFirstCellNum = 0; rowFirstCellNum < 10; rowFirstCellNum++) {
            Cell cell = rowFirst.createCell(rowFirstCellNum);
            cell.setCellValue("表头" + rowFirstCellNum);
        }

        for (int rowNum = 1; rowNum < 65536; rowNum++) {
            Row row = sheet.createRow(rowNum);
            for (int cellNum = 0; cellNum < 10; cellNum++) {
                Cell cell = row.createCell(cellNum);
                if (cellNum == 9) {
                    LocalDateTime now = LocalDateTime.now();
                    String format = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                    cell.setCellValue(format);
                } else {
                    cell.setCellValue(cellNum);
                }
            }
        }
        System.out.println("Generate Excel Over......");

        // 5. 生成一张表（IO 流），07 版本的后缀名 xlsx
        OutputStream outputStream = Files.newOutputStream(FILEPATH.resolve("ExcelBigData_07.xlsx"));

        // 6. 输出
        workbook.write(outputStream);

        // 7. 关闭流
        outputStream.close();

        // 8. 清除临时文件
        workbook.dispose();

        System.out.println("ExcelBigData_07 Generated Successfully......");

        long end = System.currentTimeMillis();
        System.out.println(String.format("ExcelBigData_07 Generated Time：%s ms......", (end - begin)));
    }
}
```

**显示结果**
```
Generate Excel Over......
Excel_03 Generated Successfully......
Excel_03 Generated Time：1868 ms......

Generate Excel Over......
Excel_07 Generated Successfully......
Excel_07 Generated Time：7780 ms......

Generate Excel Over......
ExcelBigData_07 Generated Successfully......
ExcelBigData_07 Generated Time：2869 ms......
```

**导出后的 Excel 数据**

数据都是一样的行数太多，只截取了部分：

![3](3.png)


## 总结
在上述 **读 Excel** 时，博主自己尝试做了简单的封装，其中用到了 **表驱动**、**模式匹配** 的编码写法，那 **表驱动** 和 **模式匹配** 又是什么呢？后续会总结相关的博文。本文并没有对 **写 Excel** 进行通用方法的封装，有兴趣的童靴可以尝试自己做简单的封装。当然，操作 Excel 的第三方组件不只有 Apache POI 这一种，其中 `EasyPOI` 用起来可能更方便、简洁，因为 `EasyPOI` 提供了封装好的 **读写 Excel** 的方法。想要尝试自己封装通用 **读写 Excel** 工具类的童靴，可以参考 `EasyPOI` 的写法。博主就不再这里介绍 `EasyPOI` 了。

`EasyPOI` Gitee 地址：https://gitee.com/lemur/easypoi

`EasyPOI` 官方文档：http://doc.wupaas.com/docs/easypoi/easypoi-1c0u6ksp2r091
