---
title: '[Utils - JDK] 2 Files '
catalog: true
date: 2020-09-13 20:03:50
subtitle: This class consists exclusively of static methods that operate on files, directories, or other types of files...
header-img: /img/header_img/categories_bg3.jpg
tags:
- Utils
---

## 概述
JDK1.7引入了新的IO操作类。`java.nio` 包下定义了一些操作文件和文件系统的接口和类。`java.nio.file.Files` 类具有对文件、目录和其他类型的文件进行操作的静态实用程序方法。在这篇文章中，我们将学习 `java.nio` 文件 API。`Files` 类在 `java.nio.file` 包下。这篇文章将介绍有关文件操作的 `NIO Files` 类。

## Java NIO Paths
在 `java.nio.file` 包下有一个 `Path` 类，这个类用于来表示文件路径和文件。在 JDK 1.7 中 `Path` 类取代了 `File` 类。`NIO Files` 类中的 API 就通过 `Path` 类来工作。

### 构造 `Path` 的方法（Java 8）

- `get(String first, String... more)`：将路径字符串或联接后形成路径字符串的字符串序列转换为路径。

- `Path	get(URI uri)`：将给定的URI转换为路径对象。

例：
```java
    @Test
    public void path() {
        Path path = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/sample-file.txt");
        System.out.println(path.getFileName());

        Path path2 = Paths.get("/Users", "/vincent", "/IDEA_Project", "/my_project/IO/sample-file.txt");
        System.out.println(path2.getFileName());
    }
```

或者另一种创建路径的方法是通过创建一个 URI。
```java
Path path3 = Paths.get(URI.create("file:///Users/vincent/IDEA_Project/my_project/IO/sample-file.txt"));
System.out.println(path3.getFileName());
```

从 Java 11 开始，`Paths.get()` 不建议使用。取而代之的，推荐用 Path接口中的 `static of()` 方法来创建。它和 `Paths.get()` 方法没有区别。

例：
```java
Path path = Path.of("/Users/vincent/IDEA_Project/my_project/IO/sample-file.txt");
Path path = Path.of("/Users", "/vincent", "/IDEA_Project", "/my_project/IO/sample-file.txt");
Path path = Path.of(URI.create("file:///Users/vincent/IDEA_Project/my_project/IO/sample-file.txt"));
```

### `Path` 部分方法
- `toFile()`：获取文件。
- `getFileName()`：获取文件名。
- `toUri()`：获取 URI（例：file:///Users/vincent/IDEA_Project/my_project/IO/sample-file.txt）。
- `getParent()`：获取父路径。
- `getRoot()`：获取根路径。
- `toString()`：该路径的字符串形式。
- `isAbsolute()`：是否是绝对路径。

例：
```java
    @Test
    public void path(){
        Path path = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/sample-file.txt");

        File file = path.toFile();
        System.out.println(file);

        Path fileName = path.getFileName();
        System.out.println(fileName);

        URI uri = path.toUri();
        System.out.println(uri);

        Path parent = path.getParent();
        System.out.println(parent);

        Path root = path.getRoot();
        System.out.println(root);

        boolean absolute = path.isAbsolute();
        System.out.println(absolute);
    }
```

## Java NIO Files

### 常用方法
- `exists(Path path, LinkOption... options)`：是否存在。 
- `notExists(Path path, LinkOption... options)`：是否不存在。
- `isDirectory(Path path, LinkOption... options)`：是否是目录。
- `isSymbolicLink(Path path)`：是否是象征链接。
- `isWritable(Path path)`：是否可写。
- `isExecutable(Path path)`：是否可执行。
- `isReadable(Path path)`：是否可读。
- `isHidden(Path path)`：是否是隐藏。
- `getPosixFilePermissions(Path path, LinkOption... options)`：获取具体的权限。
- `getOwner(Path path, LinkOption... options)`：
- `getLastModifiedTime(Path path, LinkOption... options)`：获取最后修改时间。
- `size(Path path)`：获取大小。
- `newInputStream(Path path, OpenOption... options)`：返回输入流。
- `newOutputStream(Path path, OpenOption... options)`：返回输出流。

例：
```java
    @Test
    public void files() throws IOException {
        /**
         * exists(Path path, LinkOption... options)：是否存在。
         * notExists(Path path, LinkOption... options)：是否不存在。
         * isDirectory(Path path, LinkOption... options)：是否是目录。
         * isSymbolicLink(Path path)：是否是象征链接。
         * isWritable(Path path)：是否可写。
         * isExecutable(Path path)：是否可执行。
         * isReadable(Path path)：是否可读。
         * isHidden(Path path)：是否是隐藏。
         * getPosixFilePermissions(Path path, LinkOption... options)：获取具体的权限。
         * getOwner(Path path, LinkOption... options)：获取所属者。
         * getLastModifiedTime(Path path, LinkOption... options)：获取最后修改时间。
         * size(Path path)：获取大小。
         */
        Path newFilePath2 = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/new-file2.txt");

        boolean exists = Files.exists(newFilePath2);
        System.out.println("exists：：" + exists);

        boolean notExists = Files.notExists(newFilePath2);
        System.out.println("notExists：" + notExists);

        boolean directory = Files.isDirectory(newFilePath2);
        System.out.println("directory：" + directory);

        boolean symbolicLink = Files.isSymbolicLink(newFilePath2);
        System.out.println("symbolicLink：" + symbolicLink);

        boolean writable = Files.isWritable(newFilePath2);
        System.out.println("writable：" + symbolicLink);

        boolean executable = Files.isExecutable(newFilePath2);
        System.out.println("executable：" + symbolicLink);

        boolean readable = Files.isReadable(newFilePath2);
        System.out.println("readable：" + symbolicLink);

        boolean hidden = Files.isHidden(newFilePath2);
        System.out.println("hidden：" + symbolicLink);

        Set<PosixFilePermission> posixFilePermissions = Files.getPosixFilePermissions(newFilePath2);
        posixFilePermissions.forEach(System.out::println);

        UserPrincipal owner = Files.getOwner(newFilePath2);
        System.out.println("owner：" + owner);

        FileTime lastModifiedTime = Files.getLastModifiedTime(newFilePath2);
        System.out.println("lastModifiedTime：" + lastModifiedTime);

        long size = Files.size(newFilePath2);
        System.out.println("size：" + size);
    }
```

显示结果：
```java
exists：：true
notExists：false
directory：false
symbolicLink：false
writable：false
executable：false
readable：false
hidden：false
OWNER_WRITE
owner：vincent
lastModifiedTime：2020-09-13T16:40:27Z
size：0
```

### `readAttributes`
`readAttributes`：读取文件的全部属性，作为一个批次操作。

```java
readAttributes(Path path, Class<A> type, LinkOption... options)
readAttributes(Path path, String attributes, LinkOption... options)
```

例：
```java
    @Test
    public void readAttributes() throws IOException {
        /**
         * readAttributes：读取文件的全部属性，作为一个批次操作。
         *
         * readAttributes(Path path, Class<A> type, LinkOption... options)
         * readAttributes(Path path, String attributes, LinkOption... options)
         */
        Path pathFile = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/new-file2.txt");
        PosixFileAttributes attrs = Files.readAttributes(pathFile, PosixFileAttributes.class);// 读取文件的权限
        Set<PosixFilePermission> posixPermissions = attrs.permissions();
        posixPermissions.clear();
        System.out.format("%s %s%n", attrs.owner().getName(), PosixFilePermissions.toString(posixPermissions));
        Files.setPosixFilePermissions(pathFile, posixPermissions);
        
        posixPermissions.add(PosixFilePermission.OWNER_READ);
        posixPermissions.add(PosixFilePermission.GROUP_READ);
        posixPermissions.add(PosixFilePermission.OTHERS_READ);
        posixPermissions.add(PosixFilePermission.OWNER_WRITE);
        // 设置文件的权限
        Files.setPosixFilePermissions(pathFile, posixPermissions);
        System.out.format("%s %s%n", attrs.owner().getName(), PosixFilePermissions.toString(attrs.permissions()));
    }
```

### `createFile` 和 `createDirectory`
`createFile`：创建一个新的空的文件，如果存在创建失败（抛 FileAlreadyExistsException）。

`createDirectory`：创建一个新的目录，如果存在创建失败（抛 FileAlreadyExistsException）。

```java
createDirectories(Path dir, FileAttribute<?>... attrs)
createDirectory(Path dir, FileAttribute<?>... attrs)
createFile(Path path, FileAttribute<?>... attrs)
```

例：
```java
    @Test
    public void createFileAndDirectory() throws IOException {
        /**
         * createFile：创建一个新的空的文件，如果存在创建失败（抛 FileAlreadyExistsException）。
         * createDirectory：创建一个新的目录，如果存在创建失败（抛 FileAlreadyExistsException）。
         *
         * createDirectories(Path dir, FileAttribute<?>... attrs)
         * createDirectory(Path dir, FileAttribute<?>... attrs)
         * createFile(Path path, FileAttribute<?>... attrs)
         */
        Path newFilePath = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/new-file.txt");
        Files.createFile(newFilePath);

        //设置了权限，只能写的权限。（--w-------   1 vincent  staff        0 Sep 14 00:40 new-file2.txt）
        Path newFilePath2 = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/new-file2.txt");
        FileAttribute<Set<PosixFilePermission>> fileAttributes = PosixFilePermissions
                .asFileAttribute(Sets.newHashSet(PosixFilePermission.OWNER_WRITE));
        Files.createFile(newFilePath2, fileAttributes);

        //Files.createDirectory()：只是创建目录，如果它的上级目录不存在就会报错。
        Path newDirectoryPath = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/newDir1");
        Files.createDirectory(newDirectoryPath);

        //Files.createDirectories()：会首先创建所有不存在的父目录来创建目录。
        Path newDirectoriesPath = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/newDir2/newDir3");
        Files.createDirectories(newDirectoriesPath);
    }
```

### `createTempFile` 和 `createTempDirectory`
`createTempFile`：生成临时文件，支持前缀和后缀命名。

`createTempDirectory`：生成临时目录，支持前缀命名。
```java
Path directoryPath = Paths.get("/Users/JavaDeveloperCentral/data");
Path tmpDirPath = Files.createTempDirectory(directoryPath, "");
System.out.println(tmpDirPath);
tmpDirPath.toFile().deleteOnExit();

Path filePath1 = Paths.get(tmpDirPath.toString() + "/file1");
filePath1.toFile().deleteOnExit();
Files.write(filePath1, List.of("something"));

Path filePath2 = Paths.get(tmpDirPath.toString() + "/file2");
filePath2.toFile().deleteOnExit();
Files.write(filePath2, List.of("something"));
```

```java
createTempFile(Path dir, String prefix, String suffix, FileAttribute<?>... attrs)
createTempFile(String prefix, String suffix, FileAttribute<?>... attrs)
createTempDirectory(Path dir, String prefix, FileAttribute<?>... attrs)
createTempDirectory(String prefix, FileAttribute<?>... attrs)
```

例：
```java
    @Test
    public void createTempFileAndDirectory() throws IOException {
        /**
         * createTempFile：生成临时文件，支持前缀和后缀命名。
         * createTempDirectory：生成临时目录，支持前缀命名。
         *
         * createTempFile(Path dir, String prefix, String suffix, FileAttribute<?>... attrs)
         * createTempFile(String prefix, String suffix, FileAttribute<?>... attrs)
         * createTempDirectory(Path dir, String prefix, FileAttribute<?>... attrs)
         * createTempDirectory(String prefix, FileAttribute<?>... attrs)
         */
        Path path = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/");
        Path tempFile = Files.createTempFile(path, "prefix", "suffix.txt");
        System.out.println(tempFile);

        //不指定目录，会在系统默认目录下生成。
        Path tempFile2 = Files.createTempFile("prefix", "suffix.txt");
        System.out.println(tempFile2);

        Path tempDirectory = Files.createTempDirectory(path, "prefix");
        System.out.println(tempDirectory);

        Path tempDirectory2 = Files.createTempDirectory("prefix");
        System.out.println(tempDirectory2);
    }
```

### `readAllBytes`、`readAllLines`、`readString`、`lines`、`list`
`readAllBytes`：读取文件，返回字节。

`readAllLines`：读取文件的所以行，返回 `List<String>`。

`readString`：读取文件，返回字符串。（Java 11）
```java
//This method was added in Java 11
String data = Files.readString(filePath);
System.out.println(data);

data = Files.readString(filePath, StandardCharsets.UTF_8);
System.out.println(data);
```

`lines`：从文件中读取所有行作为 Stream 。

`list`：返回一个懒惰的填充 Stream ，其元素是 Stream 中的条目。

```java
readAllBytes(Path path)
readAllLines(Path path)
readAllLines(Path path, Charset cs)
readString(Path path)	
readString(Path path, Charset cs)
lines(Path path)
lines(Path path, Charset cs)
list(Path dir)
```

例：
```java
    @Test
    public void readXxx() throws IOException {
        /**
         * readAllBytes：读取文件，返回字节。
         * readAllLines：读取文件的所以行，返回 List<String>。
         * readString：读取文件，返回字符串。（Java 11）
         * lines：从文件中读取所有行作为 Stream 。
         * list：返回一个懒惰的填充 Stream ，其元素是 Stream 中的条目。
         *
         * readAllBytes(Path path)
         * readAllLines(Path path)
         * readAllLines(Path path, Charset cs)
         * readString(Path path)（Java 11）
         * readString(Path path, Charset cs)（Java 11）
         * lines(Path path)
         * lines(Path path, Charset cs)
         * list(Path dir)
         */
        Path filePath = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/sample-file.txt");
        byte[] bytes = Files.readAllBytes(filePath);
        System.out.println(new String(bytes));
        System.out.println();

        List<String> readAllLines = Files.readAllLines(filePath, StandardCharsets.UTF_8);
        readAllLines.forEach(System.out::println);
        System.out.println();

        try (Stream<String> lines = Files.lines(filePath)) {
            lines.forEach(System.out::println);
        }
        System.out.println();

        Path directoryPath = Paths.get("/Users/vincent/IDEA_Project/my_project/IO");
        try (Stream<Path> list = Files.list(directoryPath)) {
            list.forEach(System.out::println);
        }
    }
```

显示结果：
```
1-Will-90
2-James-87
3-Kyle-67

1-Will-90
2-James-87
3-Kyle-67

1-Will-90
2-James-87
3-Kyle-67

/Users/vincent/IDEA_Project/my_project/IO/copyFile.png
/Users/vincent/IDEA_Project/my_project/IO/new-file2.txt
/Users/vincent/IDEA_Project/my_project/IO/sample-output-file.txt
/Users/vincent/IDEA_Project/my_project/IO/IO.iml
/Users/vincent/IDEA_Project/my_project/IO/reader.txt
/Users/vincent/IDEA_Project/my_project/IO/touch
/Users/vincent/IDEA_Project/my_project/IO/target
/Users/vincent/IDEA_Project/my_project/IO/io.png
/Users/vincent/IDEA_Project/my_project/IO/pom.xml
/Users/vincent/IDEA_Project/my_project/IO/writer.txt
/Users/vincent/IDEA_Project/my_project/IO/readerAndWriter.txt
/Users/vincent/IDEA_Project/my_project/IO/touch.txt
/Users/vincent/IDEA_Project/my_project/IO/new-file.txt
/Users/vincent/IDEA_Project/my_project/IO/outputStreamReader.txt
/Users/vincent/IDEA_Project/my_project/IO/inputStreamReader.txt
/Users/vincent/IDEA_Project/my_project/IO/a.txt
/Users/vincent/IDEA_Project/my_project/IO/.gitignore
/Users/vincent/IDEA_Project/my_project/IO/write.txt
/Users/vincent/IDEA_Project/my_project/IO/sample-file.txt
/Users/vincent/IDEA_Project/my_project/IO/io3.png
/Users/vincent/IDEA_Project/my_project/IO/io2.png
/Users/vincent/IDEA_Project/my_project/IO/inputStream.txt
/Users/vincent/IDEA_Project/my_project/IO/fileutils
/Users/vincent/IDEA_Project/my_project/IO/.git
/Users/vincent/IDEA_Project/my_project/IO/copyFile2.png
/Users/vincent/IDEA_Project/my_project/IO/.idea
/Users/vincent/IDEA_Project/my_project/IO/src
```

### `write`、`writeString`
`write`：将内容写入文件。

`writeString`：将字符写入文件。（Java 11）
```java
//This method was added in Java 11
//File exists - Append to it
Files.writeString(filePath, data, StandardOpenOption.WRITE, StandardOpenOption.APPEND);

//File exists - Truncate existing data
Files.writeString(filePath, data, StandardOpenOption.WRITE, StandardOpenOption.TRUNCATE_EXISTING);

//File does not exist, create a new one and write
Files.writeString(filePath, data, StandardOpenOption.CREATE_NEW);

//Create file if it does not exist and Append to it
Files.writeString(filePath, data, StandardOpenOption.CREATE, StandardOpenOption.APPEND);

//Create file if it does not exist - Truncate existing data
Files.writeString(filePath, data, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
```

```java
write(Path path, byte[] bytes, OpenOption... options)
write(Path path, Iterable<? extends CharSequence> lines, Charset cs, OpenOption... options)
write(Path path, Iterable<? extends CharSequence> lines, OpenOption... options)
writeString(Path path, CharSequence csq, Charset cs, OpenOption... options)	（Java 11）
writeString(Path path, CharSequence csq, OpenOption... options)（Java 11）
```

例：
```java
    @Test
    public void writeXxx() throws IOException {
        /**
         * write：将内容写入文件。
         * writeString：将字符写入文件。（Java 11）
         *
         * write(Path path, byte[] bytes, OpenOption... options)
         * write(Path path, Iterable<? extends CharSequence> lines, Charset cs, OpenOption... options)
         * write(Path path, Iterable<? extends CharSequence> lines, OpenOption... options)
         * writeString(Path path, CharSequence csq, Charset cs, OpenOption... options)	（Java 11）
         * writeString(Path path, CharSequence csq, OpenOption... options)（Java 11）
         */
        Path filePath = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/sample-file.txt");
        Path filePath2 = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/sample-output-file.txt");
        Path write = Files.write(filePath2, Files.readAllBytes(filePath));

        //StandardOpenOption.APPEND：追加在原文件内容后。
        Path write2 = Files.write(filePath2, Lists.newArrayList("a", "b", "c"), StandardCharsets.UTF_8, StandardOpenOption.APPEND);
    }
```

### `copy`
`copy`：复制文件或目录。

```java
copy(InputStream in, Path target, CopyOption... options)	
copy(Path source, OutputStream out)	
copy(Path source, Path target, CopyOption... options)
```

例：
```java
    @Test
    public void copy() throws IOException {
        /**
         * copy：复制文件或目录。
         *
         * copy(InputStream in, Path target, CopyOption... options)	
         * copy(Path source, OutputStream out)	
         * copy(Path source, Path target, CopyOption... options)
         */
        Path sourceFilePath = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/source.txt");
        Path destinationFilePath = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/destination.txt");

        //StandardCopyOption.REPLACE_EXISTING：如果存在，则替换。
        Files.copy(sourceFilePath, destinationFilePath, StandardCopyOption.REPLACE_EXISTING);

//        Files.copy(sourceFilePath, new FileOutputStream(destinationFilePath.toFile()));
        Files.copy(sourceFilePath, Files.newOutputStream(destinationFilePath, StandardOpenOption.WRITE));

//        Files.copy(IOUtils.toInputStream("Vincent is so handsome!!!", StandardCharsets.UTF_8), destinationFilePath, StandardCopyOption.REPLACE_EXISTING);
        Files.copy(Files.newInputStream(sourceFilePath), destinationFilePath, StandardCopyOption.REPLACE_EXISTING);
    }
```

### `move`、`delete`、`deleteIfExists`
`move`：移动或重命名文件到目标文件；移动或重命名目录（注：被移动或重命名的目录必须为空目录）。

`delete`：删除文件。

`deleteIfExists`：如果存在删除文件。

```java
move(Path source, Path target, CopyOption... options)
delete(Path path)
deleteIfExists(Path path)
```

例：
```java
    @Test
    public void moveAndDelete() throws IOException {
        /**
         * move：移动或重命名文件到目标文件；移动或重命名目录（注：被移动或重命名的目录必须为空目录）。
         * delete：删除文件。
         * deleteIfExists：如果存在删除文件。
         *
         * move(Path source, Path target, CopyOption... options)
         * delete(Path path)
         * deleteIfExists(Path path)
         */
        Path sourceFilePath = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/source.txt");
        Path destinationFilePath = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/new_source.txt");
        Files.move(sourceFilePath, destinationFilePath, StandardCopyOption.REPLACE_EXISTING);

        Path path1 = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/newData");
        Path path2 = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/dir1/dir2");
        //Works only if on the same filestore - else use walkFileTree
        Files.move(path1, path2);

        Path filePathToDelete = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/a.txt");
        Files.delete(filePathToDelete);

        //deletes only if it exists
        Files.deleteIfExists(filePathToDelete);
    }
```

### `newDirectoryStream`
`newDirectoryStream`：遍历当前目录（仅当前目录）下的所以条目（但不做递归遍历）。

```java
newDirectoryStream(Path dir)
newDirectoryStream(Path dir, DirectoryStream.Filter<? super Path> filter)
newDirectoryStream(Path dir, String glob)
```

例：
```java
    @Test
    public void newDirectoryStream() throws IOException {
        /**
         * newDirectoryStream：遍历当前目录（仅当前目录）下的所以条目（但不做递归遍历）。
         * 这里有个目录，目录结构如下：
         * |-- data
         *     |-- file1.txt
         *     |-- file2.txt
         *     |-- SomeClass.java
         *     |-- dir1
         *         |-- dir2
         *             |-- file1InDir2.txt
         *     |-- file3.txt
         *
         * 调用 newDirectoryStream(Path dir) 后，输出打印：
         *     file1.txt
         *     file2.txt
         *     SomeClass.java
         *     dir1
         *     file3.txt
         *
         * newDirectoryStream(Path dir)
         * newDirectoryStream(Path dir, DirectoryStream.Filter<? super Path> filter)
         * newDirectoryStream(Path dir, String glob)
         */
        Path directoryPath = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/fileutils");
        try (DirectoryStream<Path> directoryStream = Files.newDirectoryStream(directoryPath)) {
            directoryStream.forEach(System.out::println);
        }
        System.out.println();

        try (DirectoryStream<Path> directoryStream = Files.newDirectoryStream(directoryPath, path -> path.toFile().isFile())) {
            directoryStream.forEach(System.out::println);
        }
        System.out.println();

        try (DirectoryStream<Path> directoryStream = Files.newDirectoryStream(directoryPath, "*.txt")) {
            directoryStream.forEach(System.out::println);
        }
    }
```

显示结果：
```
file1.txt
file2.txt
SomeClass.java
dir1
file3.txt

file1.txt
file2.txt
SomeClass.java
file3.txt

file1.txt
file2.txt
file3.txt
```

### `walk` 和 `walkFileTree`
`walk`：遍历整个文件目录（递归）。

`walkFileTree`：遍历整个文件目录（递归）。

```java
walk(Path start, FileVisitOption... options)
walk(Path start, int maxDepth, FileVisitOption... options)
walkFileTree(Path start, FileVisitor<? super Path> visitor)
walkFileTree(Path start, Set<FileVisitOption> options, int maxDepth, FileVisitor<? super Path> visitor)
```

例：
```java
    @Test
    public void walkAndWalkFileTree() throws IOException {
        /**
         * walk：遍历整个文件目录（递归）。
         * walkFileTree：遍历整个文件目录（递归）。
         *
         * walk(Path start, FileVisitOption... options)
         * walk(Path start, int maxDepth, FileVisitOption... options)
         * walkFileTree(Path start, FileVisitor<? super Path> visitor)
         * walkFileTree(Path start, Set<FileVisitOption> options, int maxDepth, FileVisitor<? super Path> visitor)
         */
        Path directoryPath = Paths.get("/Users/vincent/IDEA_Project/my_project/IO/fileutils");
        try (Stream<Path> walk = Files.walk(directoryPath, 1)) {
            walk.forEach(System.out::println);
        }
        System.out.println();


        /**
         * walkFileTree(Path start, Set<FileVisitOption> options, int maxDepth, FileVisitor<? super Path> visitor)：
         * 参数：
         *      1. java.nio.file.Path start：遍历的起始路径。
         *      2. Set<java.nio.file.FileVisitOption> options：遍历选项。
         *      3. int maxDepth：遍历深度。
         *      4. java.nio.file.FileVisitor<? super Path> visitor：遍历过程中的行为控制器。
         *
         * FileVisitor<Path>：
         *      1. preVisitDirectory：访问一个目录，在进入之前调用。
         *      2. postVisitDirectory：一个目录的所有节点都被访问后调用。遍历时跳过同级目录或有错误发生，Exception 会传递给这个方法。
         *      3. visitFile：文件被访问时被调用。该文件的文件属性被传递给这个方法。
         *      4. visitFileFailed：当文件不能被访问时，此方法被调用。Exception 被传递给这个方法。
         * FileVisitResult：
         *      1. CONTINUE：继续遍历。
         *      2. SKIP_SIBLINGS：继续遍历，但忽略当前节点的所有兄弟节点直接返回上一层继续遍历。
         *      3. SKIP_SUBTREE：继续遍历，但是忽略子目录，但是子文件还是会访问。
         *      4. TERMINATE：终止遍历。
         *
         */
        Files.walkFileTree(directoryPath, new MySimpleFileVisitorImpl());
        System.out.println();

        Files.walkFileTree(directoryPath, Sets.newHashSet(FileVisitOption.FOLLOW_LINKS), 1, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                System.out.println("visitFile " + file);
                return super.visitFile(file, attrs);
            }
        });

    }

    public class MySimpleFileVisitorImpl implements FileVisitor<Path> {
        @Override
        public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
            System.out.println("preVisitDirectory " + dir);
            return FileVisitResult.CONTINUE;
        }

        @Override
        public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
            System.out.println("visitFile " + file);
            return FileVisitResult.CONTINUE;
        }

        @Override
        public FileVisitResult visitFileFailed(Path file, IOException exc) throws IOException {
            System.out.println("visitFileFailed " + file);
            return FileVisitResult.CONTINUE;
        }

        @Override
        public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
            System.out.println("postVisitDirectory " + dir);
            return FileVisitResult.CONTINUE;
        }
    }
```

显示结果：
```
/Users/vincent/IDEA_Project/my_project/IO/fileutils
/Users/vincent/IDEA_Project/my_project/IO/fileutils/abc
/Users/vincent/IDEA_Project/my_project/IO/fileutils/io.png
/Users/vincent/IDEA_Project/my_project/IO/fileutils/a.txt

preVisitDirectory /Users/vincent/IDEA_Project/my_project/IO/fileutils
preVisitDirectory /Users/vincent/IDEA_Project/my_project/IO/fileutils/abc
visitFile /Users/vincent/IDEA_Project/my_project/IO/fileutils/abc/abc.txt
visitFile /Users/vincent/IDEA_Project/my_project/IO/fileutils/abc/a.txt
visitFile /Users/vincent/IDEA_Project/my_project/IO/fileutils/abc/abcd.txt
postVisitDirectory /Users/vincent/IDEA_Project/my_project/IO/fileutils/abc
visitFile /Users/vincent/IDEA_Project/my_project/IO/fileutils/io.png
visitFile /Users/vincent/IDEA_Project/my_project/IO/fileutils/a.txt
postVisitDirectory /Users/vincent/IDEA_Project/my_project/IO/fileutils

visitFile /Users/vincent/IDEA_Project/my_project/IO/fileutils/abc
visitFile /Users/vincent/IDEA_Project/my_project/IO/fileutils/io.png
visitFile /Users/vincent/IDEA_Project/my_project/IO/fileutils/a.txt
```


