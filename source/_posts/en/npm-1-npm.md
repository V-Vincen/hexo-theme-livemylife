---
title: '[npm] 1 npm'
catalog: true
date: 2020-05-11 11:01:27
subtitle: npm is the package manager for Node.js...
header-img: /img/npm/npm_bg.png
tags:
- npm
categories:
- npm
---

## 前言
随着前端工程的发展，`npm` 已然成为每个前端开发者的必备技能，然而大多数人对它的使用也只是停留在使用 `npm` 安装一些依赖包而已。作为全世界最大规模的包管理器，每周大约有30亿次的下载量，`npm` 的功能远不止安装依赖这么简单，本文的目的就是介绍 `npm` 更多的功能。

## `npm` 安装和管理
`npm` 是 `Node.js` 自带的一个包管理工具，在 [`Node.js` 官网](https://nodejs.org/en/) 安装 `Node.js` 后即可使用 `npm`。或者用 `brew install node` 来安装 `node`。在这里说下，本人用 `brew install node` 安装 `node` 时遇到的一个坑。如下图：

![1](1.png)

装完后，查看 `node` 版本 `node -v` 没有问题。但是查看 `npm` 版本 `npm -v`，一直显示 `zsh: command not found: npm`。网上找了很多解决方案都说是环境变量没有配置，后来配置了环境变量，但依旧没有 `npm` 可用。其实不是环境变量没有配置的原因，而是如上图系统提示 `Warning: The post-install step did not complete successfully`，多方查询后，有人提到可能是 `brew` 安装目录的权限问题，解决办法是：

```shell
sudo chown -R $(whoami) $(brew --prefix)/*
```

运行上面的命令后，再次重新安装 `node`，问题解决了。


**查看 `npm` 版本**
```npm
npm -v
```

**更新 `npm` 版本**
```npm
npm install npm@latest -g
```

## `npm init`
该命令的原理是调用脚本（[`init-package-json`](https://github.com/npm/init-package-json/blob/latest/default-input.js)），输出一个初始化的 `package.json` 文件，`package.json` 中记录了项目中的依赖包的信息（如名称、版本等）。

![2](2.png)

![3](3.png)

执行 `npm init` 每次都会输入如上信息，可以使用 `npm init --yes` 快速创建一个带有默认信息的 `package.json` 的文件。

## 安装依赖包
安装依赖包是 `npm` 的核心功能，输入`npm install`，`npm` 会自动从 `package.json` 文件中寻找 `dependencies`，`devDependencies`  下的依赖包，并安装到项目的 `node-modules` 文件夹下。

### 关于 `package`
当手动安装一个依赖包时，使用 `npm install <package>` 命令即可安装，参数 `package` 即是要安装的依赖包名，一般 `npm` 会在默认源仓库中去查找对应的包名。然而 `package` 不光是一个包名，还有更多的含义，参见：[Understanding Packages and Modules](https://docs.npmjs.com/about-packages-and-modules#about-package-formats)，以下是 `package` 定义的规则：

1. 包含 `package.json` 文件描述该程序的文件夹。
    
    ![4](4.png)
    
    ![5](5.png)

2. 足规则（1）的 gzip 压缩文件。
    
    ![6](6.png)

3. 可以是规则（2）资源的 `url` 链接。
        
    ![7](7.png)

4. 格式为 `<name>@<version>`，`<name>@<version>` 是规则（3）已经发布到 `npm 源仓库`。
    
    ![8](8.png)

5. 格式为 `<name>@<tag>`，通过 `tag` 标记获取到 `version`，指向规则（4）。
    
    ![9](9.png)

6. 格式为 `<name>`，默认是 `latest tag`（版本），且满足规则（5）。
    
    ![10](10.png)

7. 支持 `git url`，结果满足规则（1）。
    
    ![11](11.png)

**注意：** 无论以何种方式安装依赖包，`npm install` 时都会去根据 `package.json` 文件中的 `dependencies` 字段下载它所依赖的相关包。


## 依赖包版本管理

- 使用 `npm5.2` 以上的版本，保留 `package-lock.json` 文件
- 不要手动修改 `package-lock.json`
- 升级小版本依赖包：`npm update <package>`
- 升级大版本依赖包：`npm install <package>@<version>`
- 降级依赖包：`npm install <package>@<version>`
- 删除依赖包：`npm uninstall <package>`
- 当提交了 `package.json`，`package-lock.json` 的更新后，应及时拉取更新，并重新 `npm install` 重新安装更新后的依赖


## `npm scripts`

`npm scripts` 可以在 `package.json` 文件中自定义脚本。
```shell
{
  "script": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```
以上代码片段是 `create-react-app` 脚手架生成的 `React` 项目中的 `scripts`，可以使用 `npm run` 命令来执行上面的 `scripts`，执行 `npm run build` 就等同于执行对应的npm脚本：`react-scripts build`。

### `npm` 脚本原理
当执行 `npm run` 命令时，会自动新建一个 shell 去执行里面的脚本，shell 会将 `./node_modules./bin` 目录添加到 `PATH` 变量中。也就是说，如果 `./node_modules./.bin` 目录中的脚本，可以直接调用脚本名，不用去写完整的脚本路径或是全局安装脚本了。

### 简写
- `npm start`：是 `npm run start` 的简写
- `npm stop`：是 `npm run stop`的简写
- `npm test`：是 `npm run test`的简写
- `npm restart`：是 `npm run stop && npm run restart && npm run start` 的简写


参考：https://www.jianshu.com/p/921e0b89909b




