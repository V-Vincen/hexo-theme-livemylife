---
title: '[Zip4j] Zip4j - A Java library for zip files'
catalog: true
date: 2020-12-27 16:54:12
subtitle: Zip4j is the most comprehensive Java library for zip files or streams...
header-img: /img/zip4j/zip4j.png
tags:
- Zip4j
---

之前开发过程中遇到一个需求：需要解密解压处理客户上传的 .zip 文件。先度娘了一波，但是发现都不太符合自己的要求，然后又谷歌了一波。发现也没有找到，最后在 `stackoverflow` 上看到了 [Password protected zip file in java](https://stackoverflow.com/questions/10587561/password-protected-zip-file-in-java) 这样一篇解答。因为在搜索解决方案的时候，看到 Jdk 有自带的 `java.util.zip` 类，所以刚开始想的是直接用 Jdk 原生提供的 API 来进行 zip 的解密解压处理。但是搜索下来并没有找到相关的解决方案，都是需要引用第三方类库。不应该呀，本着追根溯源的精神，继续谷歌。最后发现原来 Jdk 并没有提供 .zip 文件解密处理的 API。好吧，从始至终是我想多了，但是 Jdk 对 .zip 文件的压缩和解压缩是提供了相关的 API 的，只是没有加解密而已。那今天就来简单总结下 .zip 文件加密、解密、压缩和解压缩的处理方式。

## `java.util.zip`
### 基础案例
首先来看下 Jdk 提供的压缩和解压缩的处理方法。
```java
/**
 * @author vincent
 */
public class ZipTest {
    @Test
    public void zipFile() throws Exception {
        //压缩文件
        String path = "dirtest/jdkziptest";
        Path dirPath = Paths.get(path);
        if (Files.notExists(dirPath)) {
            Files.createDirectories(dirPath);
        }

        String zipFileName = "test.zip";
        Path absoluteZipPath = dirPath.resolve(zipFileName);
        //最终输出的文件路径：/Users/vincent/IDEA_Project/my_project/zip/dirtest/jdkziptest/test.zip
        ZipOutputStream out = new ZipOutputStream(new FileOutputStream(absoluteZipPath.toFile()));
        ZipEntry e = new ZipEntry("mytext.txt");
        out.putNextEntry(e);

        StringBuilder sb = new StringBuilder();
        sb.append("Test String");
        byte[] data = sb.toString().getBytes();
        out.write(data, 0, data.length);
        out.closeEntry();

        out.close();
    }

    @Test
    public void zipDir() throws IOException {
        //压缩目录：/Users/vincent/IDEA_Project/my_project/zip/dirtest/jdkziptest/src（中有两个文件：abc.txt、abcd.txt）
        String dirPath = "dirtest/jdkziptest/src";
        Path sourceDir = Paths.get(dirPath);

        //创建目标目录：/Users/vincent/IDEA_Project/my_project/zip/dirtest/jdkziptest/out
        String targetPath = "dirtest/jdkziptest/out";
        Path targetDir = Paths.get(targetPath);
        if (Files.notExists(targetDir)) {
            Files.createDirectories(targetDir);
        }

        //压缩后的文件路径（也是最终压缩后输出的文件路径）：/Users/vincent/IDEA_Project/my_project/zip/dirtest/jdkziptest/out/dirzip.zip
        Path targetZipPath = targetDir.resolve(sourceDir.getFileName().toString().concat(".zip"));
        ZipOutputStream outputStream = new ZipOutputStream(new FileOutputStream(targetZipPath.toFile()));

        //递归压缩 dirzip 目录下的全部文件，压缩后的文件名为 dirzip.zip，输出到 dirzipout 目录下（中有一个文件：dirzip.zip）。
        Files.walkFileTree(sourceDir, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attributes) {
                try {
                    Path targetFile = sourceDir.relativize(file);
                    outputStream.putNextEntry(new ZipEntry(targetFile.toString()));
                    byte[] bytes = Files.readAllBytes(file);
                    outputStream.write(bytes, 0, bytes.length);
                    outputStream.closeEntry();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                return FileVisitResult.CONTINUE;
            }
        });
        outputStream.close();
    }

    @Test
    public void unzip() throws IOException {
        String dirPath = "dirtest/jdkziptest/out";
        Path filePath = Paths.get(dirPath);

        List<Path> zipPaths = Files.walk(filePath)
                .filter(p -> FilenameUtils.isExtension(p.toFile().getName(), "zip"))
                .collect(Collectors.toList());

        //解压缩 dirzipout 目录下（中有一个压缩文件：dirzip.zip）的全部 .zip 文件，到当前目录（dirzipout）下。最后解压缩出的结果为两个文件：abc.tet、test.zip
        zipPaths.forEach(CheckedConsumer.<Path>of(
                zipPath -> {
                    File file = zipPath.toFile();
                    ZipFile zipFile = new ZipFile(file);
                    Enumeration<? extends ZipEntry> entries = zipFile.entries();
                    while (entries.hasMoreElements()) {
                        ZipEntry entry = entries.nextElement();
                        InputStream inputStream = zipFile.getInputStream(entry);
                        IOUtils.copy(inputStream, new FileOutputStream(filePath.resolve(entry.getName()).toFile()));
                    }
                }).unchecked()
        );
    }
}
```

### `ZipUtils` 工具类
这个工具类，是根据 Jdk 提供的 API 自己做的简单封装。
```java
/**
 * @author vincent
 */
public class ZipUtils {
    private static final String EXTENSION = ".zip";

    /**
     * 压缩文件
     *
     * @param filePath 需要压缩的文件路径
     * @throws IOException IO异常
     */
    public static void packFile(String filePath) throws IOException {
        Objects.requireNonNull(filePath, "filePath");
        if (Files.notExists(Paths.get(filePath))) {
            throw new NoSuchFileException(filePath);
        }
        if (!Paths.get(filePath).toFile().isFile()) {
            throw new NoSuchFileException(filePath + " is not a file...");
        }
        packFile(filePath, Paths.get(filePath).getParent().toString());
    }

    /**
     * 压缩文件到指定目录
     *
     * @param filePath 需要压缩的文件路径
     * @param desDirPath  压缩到指定文件目录（该目录必须存在，否则抛出异常）
     * @throws IOException IO异常
     */
    public static void packFile(String filePath, String desDirPath) throws IOException {
        /*
         *  假设：filePath -> /Users/vincent/IDEA_Project/my_project/zip/dirtest/jdkziptest/srcfile.txt
         *       desDirPath -> /Users/vincent/IDEA_Project/my_project/zip/dirtest/jdkziptest/out
         */
        Objects.requireNonNull(filePath, "filePath");
        Objects.requireNonNull(desDirPath, "dirPath");

        //获取文件路径：sourceFilePath -> /Users/vincent/IDEA_Project/my_project/zip/dirtest/jdkziptest/srcfile.txt
        Path sourceFilePath = Paths.get(filePath);
        if (Files.notExists(sourceFilePath)) {
            throw new NoSuchFileException(filePath);
        }
        if (!sourceFilePath.toFile().isFile()) {
            throw new NoSuchFileException(filePath + " is not a file...");
        }

        //获取文件目录路径：dirPath -> /Users/vincent/IDEA_Project/my_project/zip/dirtest/jdkziptest/out
        Path sourceDirPath = Paths.get(desDirPath);
        if (Files.notExists(sourceDirPath)) {
            throw new NotDirectoryException(desDirPath);
        }
        if (!Files.isDirectory(sourceDirPath)) {
            throw new NotDirectoryException(desDirPath + " is not a directory...");
        }

        //拼接文件被压缩后的压缩文件名：zipFileName -> "abc" + ".zip" = "abc.zip"
        String zipFileName = FilenameUtils.getBaseName(sourceFilePath.getFileName().toString()).concat(EXTENSION);
        //创建压缩输出流（就是创建最终输出的压缩文件容器），文件被压缩后的压缩文件的全路径（/Users/vincent/IDEA_Project/my_project/zip/dirtest/jdkziptest/out/abc.zip）
        ZipOutputStream outputStream = new ZipOutputStream(new FileOutputStream(sourceDirPath.resolve(zipFileName).toFile()));
        //创建压缩文件 zip 实例
        ZipEntry zipEntry = new ZipEntry(sourceFilePath.getFileName().toString());
        //开始写入新的 zip 文件条目，并将流定位到条目数据的开头
        outputStream.putNextEntry(zipEntry);
        //读取原文件 filePath
        byte[] bytes = Files.readAllBytes(sourceFilePath);
        //把原文件 filePath 写入到压缩文件中
        outputStream.write(bytes, 0, bytes.length);
        outputStream.closeEntry();
        outputStream.close();
    }

    /**
     * 压缩整个文件目录
     *
     * @param dirPath 需要压缩的文件目录路径
     * @throws IOException IO异常
     */
    public static void packDir(String dirPath) throws IOException {
        Path sourceDir = Paths.get(dirPath);
        if (Files.notExists(sourceDir)) {
            throw new NotDirectoryException(dirPath);
        }
        if (!Files.isDirectory(sourceDir)) {
            throw new NotDirectoryException(dirPath + " is not a directory...");
        }

        ZipOutputStream outputStream = new ZipOutputStream(new FileOutputStream(sourceDir.toString().concat(EXTENSION)));
        Files.walkFileTree(sourceDir, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult visitFile(Path filePath, BasicFileAttributes attrs) throws IOException {
                Path targetFilePath = sourceDir.relativize(filePath);
                outputStream.putNextEntry(new ZipEntry(targetFilePath.toString()));
                byte[] bytes = Files.readAllBytes(filePath);
                outputStream.write(bytes, 0, bytes.length);
                outputStream.closeEntry();
                return super.visitFile(filePath, attrs);
            }
        });
        outputStream.close();
    }


    /**
     * 解压缩目录中的 zip 文件
     *
     * @param dirPath 解压缩该目录下的所以 zip 文件
     * @throws IOException IO异常
     */
    public static void unpackDir(String dirPath) throws IOException {
        Path sourceDirPath = Paths.get(dirPath);
        if (Files.notExists(sourceDirPath)) {
            throw new NotDirectoryException(dirPath);
        }
        if (!Files.isDirectory(sourceDirPath)) {
            throw new NotDirectoryException(dirPath + " is not a directory...");
        }

        List<Path> sourceZipPaths = Files.walk(sourceDirPath)
                .filter(p -> FilenameUtils.isExtension(p.toFile().getName(), "zip"))
                .collect(Collectors.toList());
        sourceZipPaths.forEach(CheckedConsumer.<Path>of(
                sourceZipPath -> unpack(sourceZipPath, sourceDirPath)).unchecked()
        );
    }

    /**
     * 解压缩 zip 文件
     *
     * @param filePath 需要解压缩的文件路径
     * @throws IOException IO异常
     */
    public static void unpackFile(String filePath) throws IOException {
        Path sourceFilePath = Paths.get(filePath);
        if (Files.notExists(sourceFilePath)) {
            throw new NoSuchFileException(filePath);
        }
        if (!sourceFilePath.toFile().isFile()) {
            throw new NoSuchFileException(filePath + " is not a file...");
        }
        unpack(sourceFilePath, sourceFilePath.getParent());
    }

    private static void unpack(Path path, Path parentPath) throws IOException {
        Objects.requireNonNull(path);
        ZipFile zipFile = new ZipFile(path.toFile());
        Enumeration<? extends ZipEntry> entries = zipFile.entries();
        while (entries.hasMoreElements()) {
            ZipEntry zipEntry = entries.nextElement();
            InputStream inputStream = zipFile.getInputStream(zipEntry);
            IOUtils.copy(inputStream, new FileOutputStream(parentPath.resolve(zipEntry.getName()).toFile()));
        }
    }
}
```

## Zip4j

### 简介
Zip4j 官网：http://www.lingala.net/

Github Repo：https://github.com/srikanth-lingala/zip4j

特征：
- 从 Zip 文件创建，添加，提取，更新，删除文件
- 读/写密码保护的 Zip 文件
- 支持 AES 128/256 加密
- 支持标准邮编加密
- 支持 Zip64 格式
- 支持存储（无压缩）和 Deflate 压缩方法
- 从 Split Zip 文件创建或提取文件（例如：z01，z02，... zip）
- 支持 Unicode 文件名
- 进度监视器

### `pom.xml`
```xml
<dependency>
    <groupId>net.lingala.zip4j</groupId>
    <artifactId>zip4j</artifactId>
    <version>2.6.4</version>
</dependency>
```

### 官网案例
```java
/**
 * @author vincent
 */
public class Zip4jTest {
    @Test
    public void packAddFile() throws ZipException {
        /*
         * 添加具体文件（该文件必须存在，否则会抛异常）到压缩文件中
         */
        //官网案例：Creating a zip file with single file in it / Adding single file to an existing zip
        new ZipFile("dirtest/zip4jtest/filename.zip").addFile("dirtest/zip4jtest/src/a.txt");
        new ZipFile("dirtest/zip4jtest/filename.zip").addFile(new File("dirtest/zip4jtest/src/b.txt"));

        //官网案例：Creating a zip file with multiple files / Adding multiple files to an existing zip
        new ZipFile("dirtest/zip4jtest/filename.zip").addFiles(Arrays.asList(new File("dirtest/zip4jtest/src/first_file"), new File("dirtest/zip4jtest/src/second_file")));
    }

    @Test
    public void packAddFolder() throws ZipException {
        /*
         * 添加具体文件夹（该文件夹必须存在，否则会抛异常）到压缩文件中（被添加的文件夹，可以设置过滤条件）
         */
        //官网案例：Creating a zip file by adding a folder to it / Adding a folder to an existing zip
        new ZipFile("dirtest/zip4jtest/filenamefolder.zip").addFolder(new File("dirtest/zip4jtest/srcdir2"));

        //官网案例：Since v2.6, it is possible to exclude certain files when adding a folder to zip by using an ExcludeFileFilter
        //ExcludeFileFilter：过滤掉文件夹内不需要的文件（该案例是过滤文件名结尾是 ext 格式的文件）
        ExcludeFileFilter excludeFileFilter = file -> FilenameUtils.isExtension(file.getName(), "ext");
        ZipParameters zipParameters = new ZipParameters();
        zipParameters.setExcludeFileFilter(excludeFileFilter);

        //CompressionMethod：压缩方式
//        zipParameters.setCompressionMethod(CompressionMethod.STORE);
        new ZipFile("dirtest/zip4jtest/excludefilefilter.zip").addFolder(new File("dirtest/zip4jtest/srcdir3"), zipParameters);
    }

    @Test
    public void packWithPwd() throws ZipException {
        /*
         * 压缩文件并设置保护密码，或者添加文件到要以存在的压缩文件中
         */
        //官网案例：Creating a password protected zip file / Adding files to an existing zip with password protection
        ZipParameters zipParameters = new ZipParameters();
        zipParameters.setEncryptFiles(true);
        zipParameters.setEncryptionMethod(EncryptionMethod.AES);
        // Below line is optional. AES 256 is used by default. You can override it to use AES 128. AES 192 is supported only for extracting.
        zipParameters.setAesKeyStrength(AesKeyStrength.KEY_STRENGTH_256);

        List<File> filesToAdd = Arrays.asList(
                new File("dirtest/zip4jtest/src/somefile.txt"),
                new File("dirtest/zip4jtest/src/someotherfile.txt")
        );

        ZipFile zipFile = new ZipFile("dirtest/zip4jtest/filenamepwd.zip", "password".toCharArray());
        zipFile.addFiles(filesToAdd, zipParameters);
    }

    @Test
    public void unpackAllFile() throws ZipException {
        /*
         * 从 zip 提取所有文件
         */
        //官网案例：Extracting all files from a zip
        new ZipFile("dirtest/zip4jtest/filename.zip").extractAll("dirtest/zip4jtest/out");
    }

    @Test
    public void unpackAllFileWithPwd() throws ZipException {
        /*
         * 从受密码保护的 zip 提取所有文件
         */
        //官网案例：Extracting all files from a password protected zip
        new ZipFile("dirtest/zip4jtest/filenamepwd.zip", "password".toCharArray()).extractAll("dirtest/zip4jtest/out");
    }

    @Test
    public void unpackSingleFile() throws ZipException {
        /*
         * 从 zip 提取单个文件
         */
        //官网案例：Extracting a single file from zip
        new ZipFile("dirtest/zip4jtest/filename.zip").extractFile("a.txt", "dirtest/zip4jtest/out");
    }

    @Test
    public void unpackSingleFileWithPwd() throws ZipException {
        /*
         * 从受密码保护的 zip 提取单个文件
         */
        //官网案例：Extracting a single file from zip which is password protected
        new ZipFile("dirtest/zip4jtest/filenamepwd.zip", "password".toCharArray()).extractFile("somefile.txt", "dirtest/zip4jtest/out");
    }

    @Test
    public void zipInputStreamExample() throws Exception {
        /*
         * 使用 ZipInputStream 提取文件（以流的形式解压文件）
         */
        //官网案例：Extract files with ZipInputStream
        String filePath = "dirtest/zip4jtest/zipinputstreamexample.zip";
        String password = "password";
        LocalFileHeader localFileHeader;

        int readLen;
        byte[] readBuffer = new byte[4096];
        InputStream inputStream = new FileInputStream(new File(filePath));
        try (ZipInputStream zipInputStream = new ZipInputStream(inputStream, password.toCharArray())) {
            while ((localFileHeader = zipInputStream.getNextEntry()) != null) {
                File extractedFile = new File(localFileHeader.getFileName());
                try (OutputStream outputStream = new FileOutputStream(extractedFile)) {
                    while ((readLen = zipInputStream.read(readBuffer)) != -1) {
                        outputStream.write(readBuffer, 0, readLen);
                    }
                }
            }
        }

        //改动：以流的形式输出
        List<InputStream> list = Lists.newArrayList();
        InputStream newInputStream = Files.newInputStream(Paths.get(filePath));
        try (ZipInputStream zipInputStream = new ZipInputStream(newInputStream, password.toCharArray())) {
            while ((localFileHeader = zipInputStream.getNextEntry()) != null) {
                System.out.println("解压后的文件名：" + localFileHeader.getFileName());
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                IOUtils.copy(zipInputStream, byteArrayOutputStream);
                ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(byteArrayOutputStream.toByteArray());
                list.add(byteArrayInputStream);
            }
        }
        list.forEach(CheckedConsumer.<InputStream>of(
                byteArrayInputStream -> {
                    String str = IOUtils.toString(byteArrayInputStream, StandardCharsets.UTF_8);
                    System.out.println("解压后的文件内容：" + str);
                }).unchecked()
        );
    }
}
```

### `ZipClient` 工具类
自己根据官方文档做的简单封装。
```java
/**
 * @author vincent
 */
public class ZipClient {
    private String password;
    private static final String EXTENSION = "zip";

    public ZipClient() {
    }

    public ZipClient(String password) {
        this.password = password;
    }

    public void pack(List<String> filePaths, String desZipFileName) throws ZipException {
        Objects.requireNonNull(filePaths);
        Objects.requireNonNull(desZipFileName);

        List<File> files = filePaths.stream().map(File::new).collect(Collectors.toList());
        ZipFile zipFile = new ZipFile(desZipFileName + "." + EXTENSION, Optional.ofNullable(password).map(String::toCharArray).orElse(null));
        zipFile.addFiles(files, Optional.ofNullable(password)
                .map(p -> {
                    ZipParameters zipParameters = new ZipParameters();
                    zipParameters.setCompressionMethod(CompressionMethod.DEFLATE);
                    zipParameters.setCompressionLevel(CompressionLevel.ULTRA);
                    zipParameters.setEncryptFiles(true);
                    zipParameters.setEncryptionMethod(EncryptionMethod.AES);
                    zipParameters.setAesKeyStrength(AesKeyStrength.KEY_STRENGTH_256);
                    return zipParameters;
                })
                .orElse(new ZipParameters())
        );
    }

    public void pack(String filePath) throws ZipException, NoSuchFileException {
        Objects.requireNonNull(filePath);
        Path path = Paths.get(filePath);
        if (Files.notExists(path)) {
            throw new NoSuchFileException(filePath);
        }
        if (!path.toFile().isFile()) {
            throw new NoSuchFileException(filePath + " is not a file...");
        }

        this.pack(Lists.newArrayList(filePath), path.getParent().resolve(FilenameUtils.getBaseName(filePath)).toString());
    }

    public void unpack(String sourceZipFilePath, String extractedZipDirPath) throws ZipException, NoSuchFileException, NotDirectoryException {
        Objects.requireNonNull(sourceZipFilePath);
        Objects.requireNonNull(extractedZipDirPath);

        if (Files.notExists(Paths.get(sourceZipFilePath))) {
            throw new NoSuchFileException(sourceZipFilePath);
        }
        if (!Paths.get(sourceZipFilePath).toFile().isFile()) {
            throw new NoSuchFileException(sourceZipFilePath + " is not a file...");
        }

        if (Files.notExists(Paths.get(extractedZipDirPath))) {
            throw new NotDirectoryException(extractedZipDirPath);
        }
        if (!Files.isDirectory(Paths.get(extractedZipDirPath))) {
            throw new NotDirectoryException(extractedZipDirPath + " is not a directory...");
        }

        ZipFile zipFile = new ZipFile(sourceZipFilePath);
        if (zipFile.isEncrypted()) {
            zipFile.setPassword(password.toCharArray());
        }
        zipFile.extractAll(extractedZipDirPath);
    }
}
```

案例源码：https://github.com/V-Vincen/zip
