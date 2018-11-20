# node-generator-erest

Yoman generator for [erest](https://github.com/yourtion/node-erest). Easy build rest api

## Intsall

```bash
$ npm install -g yo
$ npm install generator-erest -g
```

## With Express

```bash
$ yo erest:express
```

## With @leizm/web

```bash
$ yo erest:lei-web
```

## 目录结构

项目生成目录结构说明，🔒 表示一般情况下不需要修改的文件

```
├── app.json        ➡️ PM2 启动文件
├── tsconfig.json   ➡️ TypeScript 配置 🔒
├── bin             ➡️ 开发脚本文件
├── docs            ➡️ 生成文档默认文件夹
├── logs            ➡️ 日志输出默认文件夹
├── config          ➡️ 配置文件夹
│   ├── base.yaml   ➡️ 默认配置模版，其他环境配置会以这个文件为基础合并
│   ├── dev.yaml    ➡️ 开发环境配置
│   └── test.yaml   ➡️ 测试环境配置
├── src             ➡️ 源码目录
│   ├── api.ts          ➡️ API 定义文件，导出 apiService （ ERest 实例 ）
│   ├── app.ts          ➡️ APP 定义文件，不包括服务与端口监听，导出全局 app
│   ├── core.ts         ➡️ 核心服务的一些基类 🔒
│   ├── index.ts        ➡️ 服务启动入口文件 🔒
│   ├── web.ts          ➡️ Web 框架基类，导出 Context 等
│   ├── libs            ➡️ 类库文件夹，主要存放中间件、基础类库等内容
│   ├── controllers     ➡️ 控制器文件夹
│   ├── models          ➡️ 数据库模型文件夹
│   │   ├── base.ts     ➡️ 数据模型基类 🔒
│   │   └── index.ts    ➡️ models 导出文件夹 🔒
│   ├── routers         ➡️ 路由配置文件夹
│   │   └── index.ts    ➡️ 路由加载文件 🔒
│   ├── services        ➡️ 服务文件夹
│   │   └── index.ts    ➡️ services 导出文件 🔒
│   └── global                  ➡️ 全局文件配置
│       ├── base                ➡️ 全局基础框架 🔒
│       │   ├── config.ts       ➡️ 配置读取与导出 🔒
│       │   ├── index.ts        ➡️ global.base 导出 🔒
│       │   └── utils.ts        ➡️ 全局工具类 🔒
│       ├── gen                 ➡️ 生成文件（通过 npm run code 生成）🔒
│       │   ├── config.gen.ts   ➡️ 配置 interface 生成 🔒
│       │   ├── core.gen.ts     ➡️ 核心类生成 🔒
│       │   ├── errors.gen.ts   ➡️ 错误信息 🔒
│       │   ├── models.gen.ts   ➡️ 模型 interface 🔒
│       │   ├── params.gen.ts   ➡️ 参数 interface 🔒
│       │   └── types.gen.ts    ➡️ 类型与 Schema 🔒
│       ├── helper.ts           ➡️ 数据类型方法（简化调用）🔒
│       ├── index.ts            ➡️ global 文件夹导出 🔒
│       ├── logger.ts           ➡️ 日志初始化类，导出日志方法 🔒
│       ├── mysql.ts            ➡️ MySQL 导出 mysql 实例 🔒
│       └── redis.ts            ➡️ Redis 导出 redis 与 newRedis 方法 🔒
└── test                ➡️ 测试文件夹
    ├── agent.ts        ➡️ 请求 superAgent 封装 🔒
    ├── api                 ➡️ API 测试文件夹
    │   ├── api.gen.ts      ➡️ API 测试生成帮助类 🔒
    │   ├── data.yaml       ➡️ 测试数据配置 testAgent.shareTestData.data 🔒
    │   ├── init.ts         ➡️ API 测试初始化 🔒
    │   ├── test-base.ts    ➡️ 实际测试脚本（以 test-*.ts m命名）
    └── tsconfig.json       ➡️ 测试文件夹 TypeScript 配置
```
