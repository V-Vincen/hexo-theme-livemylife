---
title: '[npm] 2 npm common commands'
catalog: true
date: 2020-05-12 00:29:03
subtitle: npm is the package manager for Node.js...
header-img: /img/npm/npm_bg.png
tags:
- npm
categories:
- npm
---

## npm 命令
### `npm init`（初始化） 
`npm init` 引导输出一个 `package.json` 文件。
```npm
➜  jsDeliver git:(master) npm init --help

npm init [--force|-f|--yes|-y|--scope]
npm init <@scope> (same as `npx <@scope>/create`)
npm init [<@scope>/]<name> (same as `npx [<@scope>/]create-<name>`)

aliases: create, innit
```

- 语法介绍：调用脚本输出一个初始化的 `package.json` 文件
- 命令别名：`create`，`innit`
- 参数介绍：
    - `--force`：简写 `-f`，跳过引导交互，快速生成默认的 `package.json` 文件
    - `--yes`：简写 `-y`，同上
    - `--scope`：同 `npm init`，与无参数时相同，交互生成 `package.json` 文件


### `npm install`（模块安装）
先来看下它的语法帮助：
```npm
➜  jsDeliver git:(master) npm install --help

npm install (with no args, in package dir)
npm install [<@scope>/]<pkg>
npm install [<@scope>/]<pkg>@<tag>
npm install [<@scope>/]<pkg>@<version>
npm install [<@scope>/]<pkg>@<version range>
npm install <alias>@npm:<name>
npm install <folder>
npm install <tarball file>
npm install <tarball url>
npm install <git:// url>
npm install <github username>/<github project>

aliases: i, isntall, add
common options: [--save-prod|--save-dev|--save-optional] [--save-exact] [--no-save]
```

- 语法介绍：
    - `npm install (with no args, in package dir)`：直接根据应用中的 `package.json` 或 `package.lock.json` 文件来安装项目或模块需要的依赖
    - `npm install [<@scope>/]<pkg>`：安装已发布到 npm 仓库的包名，默认下载 latest 最新发布版
    - `npm install [<@scope>/]<pkg>@<tag>`：安装通过 tag 标记获取到的版本
    - `npm install [<@scope>/]<pkg>@<version>`：安装指定版本的包
    - `npm install [<@scope>/]<pkg>@<version range>`：安装通过 semver 规范匹配到的版本
    - `npm install <folder>`：安装本地包
    - `npm install <tarball file>`：安装 gzip 压缩文件
    - `npm install <tarball url>`：安装可下载到 gzip 压缩包的链接
    - `npm install <git url>`：安装通过 git 链接获取到的包
- 命令别名：`i`，`add`
- 参数介绍：
    - `无参数`：同 `--save-prod`
    - `--global`：简写 `-g`，安装全局依赖
    - `--save-prod`：同 `-save`，简写 `-S`，将依赖信息加入到 `dependencies`（生产环境的依赖）
    - `--save-dev`：简写 `-D`，将依赖信息加入到 `devDependencies`（开发环境的依赖）
    - `--save-optional`：简写 `-O`，将依赖信息加入到 `optionalDependencies`（可选阶段的依赖）
    - `--save-exact`：简写 `-E`，精确安装依赖的版本，依赖信息将加入到 `dependencies`
    - `--no-save`：只添加依赖，依赖信息不写入 `package.json`


### `npm uninstall`（模块卸载）
先来看下它的语法帮助：
```npm
➜  jsDeliver git:(master) npm uninstall --help
npm uninstall [<@scope>/]<pkg>[@<version>]... [--save-prod|--save-dev|--save-optional] [--no-save]

aliases: un, unlink, remove, rm, r
```
- 语法介绍：卸载指定的依赖
- 命令别名：`un`，`unlink`，`remove`，`rm`，`r`
- 参数介绍：与 `npm install` 类似


### `npm update`（模块更新）
语法帮助：
```npm
➜  jsDeliver git:(master) npm update --help
npm update [-g] [<pkg>...]

aliases: up, upgrade, udpate
```

- 语法介绍：更新指定的依赖
- 命令别名：`up`，`upgrade`


### `npm outdated`（检查模块是否过时）
语法帮助：
```npm
➜  jsDeliver git:(master) npm outdated -h
npm outdated [[<@scope>/]<pkg> ...]
```
- 语法介绍：检查依赖是否已经过时，并列出所有已经过时的包


### `npm ls`（查看安装的模块）
语法帮助：
```npm
➜  jsDeliver git:(master) npm ls -h
npm ls [[<@scope>/]<pkg> ...]

aliases: list, la, ll
```
- 语法介绍：列出安装的所有依赖
- 命令别名：`list`，`la`，`ll`
- 参数介绍：
    - `--global`：简写 `-g`，查看全局安装的依赖
    - `--depth`：直接列出依赖会列出包括其子依赖，输出太厄长了，使用 `--depth=0` 控制，如下所示：
    
        ```npm
        ➜  jsDeliver git:(master) npm ls -g --depth=0
        /usr/local/lib
        ├── bower@1.8.8
        ├── cnpm@6.1.1
        ├── hexo-cli@3.1.0
        ├── npm@6.14.4
        ├── npm-check@5.9.2
        ├── webpack@4.43.0
        └── yarn@1.19.1
        ```

### `npm config`（配置路径管理）
语法帮助：
```npm
➜  jsDeliver git:(master) npm config -h
npm config set <key> <value>
npm config get [<key>]
npm config delete <key>
npm config list [--json]
npm config edit
npm set <key> <value>
npm get [<key>]

alias: c
```
- 语法介绍：所有 `npm` 配置参数可在官网查看（[npm config](https://docs.npmjs.com/misc/config)）
    - `npm config set <key> <value>`：或 `npm set <key> <value>`，设置或修改某项 `npm` 配置。如通过 `npm config set proxy=***` 设置代理来解决公司内网无法安装 `npm` 依赖，通过 `npm config set registry="https://registry.npm.taobao.org"` 切换 `npm` 仓库源为淘宝镜像来解决无法访问 `npm` 源或下载依赖慢的问题
    - `npm config get <key>`：或 `npm get [<key>]`，查看某项 `npm` 配置
    - `npm config delete <key>`：删除某项 `npm` 配置
    - `npm config list [--json]`：查看所有 `npm`配置
    - `npm config edit`：用文本编辑器修改 `npm`配置
- 命令别名：`c`


### `npm cache`（缓存管理）
语法帮助：
```npm
➜  jsDeliver git:(master) npm cache -h
npm cache add <tarball file>
npm cache add <folder>
npm cache add <tarball url>
npm cache add <git url>
npm cache add <name>@<version>
npm cache clean
npm cache verify
```
- 语法介绍：
    - `npm cache add`：给一个指定的依赖包添加缓存（该命令主要是 `npm` 内部使用）
    - `npm cache clean`：清除 `npm` 本地缓存
    - `npm cache verify`：验证缓存数据的有效性和完整性，清理垃圾数据


### `npm version`（查看版本）
```npm
➜  jsDeliver git:(master) npm version
{
  npm: '6.14.4',
  ares: '1.16.0',
  brotli: '1.0.7',
  cldr: '36.1',
  http_parser: '2.9.3',
  icu: '66.1',
  llhttp: '2.0.4',
  modules: '72',
  napi: '5',
  nghttp2: '1.40.0',
  node: '12.16.3',
  openssl: '1.1.1g',
  tz: '2019c',
  unicode: '13.0',
  uv: '1.34.2',
  v8: '7.8.279.23-node.35',
  zlib: '1.2.11'
}
```
命令简写：`npm -v`

### `npm help`
```npm
➜  jsDeliver git:(master) npm help

Usage: npm <command>

where <command> is one of:
    access, adduser, audit, bin, bugs, c, cache, ci, cit,
    clean-install, clean-install-test, completion, config,
    create, ddp, dedupe, deprecate, dist-tag, docs, doctor,
    edit, explore, fund, get, help, help-search, hook, i, init,
    install, install-ci-test, install-test, it, link, list, ln,
    login, logout, ls, org, outdated, owner, pack, ping, prefix,
    profile, prune, publish, rb, rebuild, repo, restart, root,
    run, run-script, s, se, search, set, shrinkwrap, star,
    stars, start, stop, t, team, test, token, tst, un,
    uninstall, unpublish, unstar, up, update, v, version, view,
    whoami

npm <command> -h  quick help on <command>
npm -l            display full usage info
npm help <term>   search for help on <term>
npm help npm      involved overview

Specify configs in the ini-formatted file:
    /Users/vincent/.npmrc
or on the command line via: npm <command> --key value
Config info can be viewed via: npm help config

npm@6.14.4 /usr/local/Cellar/node@12/12.16.3/lib/node_modules/npm
```
- 语法介绍：查看 `npm` 或某条命令的详细介绍，如 `npm help config`，则会在本地生成一个关于 `config` 命令使用的 HTML 文件并在浏览器打开


### `npm root`（查看依赖包安装路径）
查看 `npm` 全局依赖包路径：`npm root -g`


### `npm run`（执行脚本）
`npm run` 命令可以自动新建一个 shell 去执行里面的脚本。常用的脚本命令：
- `npm run start`：简写 `npm start`，启动模块
- `npm run build`：生成环境打包部署
- `npm run test`：简写 `npm test` 或 `npm t`，测试模块
- `npm run stop`：简写 `npm stop`，停止模块
- `npm run restart`：简写 `npm restart`，重启模块


### npm 发布包相关命令
- `npm login`：同 `npm adduser`，登录 `npm` 社区账号，如下所示：
    ```npm
    ➜  jsDeliver git:(master) npm login
    Username: vincent
    Password:
    Email:（this IS public）601521821@qq.com
    Logged in as vincent on https://registry.npm.taobao.org/.
    ```
    
- `npm publish`：发布 `npm` 包
    ```npm
    ➜  jsDeliver git:(master) npm publish -h
    npm publish [<tarball>|<folder>] [--tag <tag>] [--access <public|restricted>] [--dry-run]
    
    Publishes '.' if no argument supplied
    
    Sets tag `latest` if no --tag specified
    ```
    
    
    参考：https://www.jianshu.com/p/a89a3a95046f
