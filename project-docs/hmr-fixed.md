# HMR 问题修复

## 1. 问题描述

原 HMR 的更新逻辑是:

1. webpack-dev-middleware 监听文件变化重新编译
2. 将编译后的文件写入到磁盘上(build/client)
3. 通过 webpack-hot-middleware 将更新信息发送到浏览器(express 服务 8099 端口)
4. 由 nodemon 启动一个 koa 服务，监控 build/client 目录下的文件变化, 3001 端口
5. 浏览器根据更新信息去请求新的资源文件(nodemon 启动的 server)

但是，在开发过程中，我们发现，当文件修改后，浏览器经常找不到新的资源文件，导致页面无法正常更新而报错。

## 2. 问题解决

我们怀疑是因为 webpack-dev-middleware 重新编译并写入磁盘的过程与浏览器请求新的资源文件的过程不协调, 导致浏览器请求资源文件时文件尚未准备好, 导致出错。
因此考虑将资源文件的请求路径直接指向 webpack-dev-middleware 内存中的文件, 资源文件不再通过 nodemon 启动的 server(3001 端口)获取, 直接通过 express 服务(8099 端口)获取。

```javascript
// config/webpack.config.js

const baseClientConfig = (env) => {
  const isDevelopment = /^dev/.test(env.mode);
  // 开发环境使用 http://localhost:8099/static/client/ 作为资源路径前缀
  // 生产环境使用 /static/client/ 作为资源路径前缀
  const publicPath = isDevelopment
    ? `http://localhost:${appConstants.hmrPort}${appConstants.publicPath}/client/`
    : join(appConstants.publicPath, "client/");

  return merge(common, {
    output: {
      path: join(appConstants.buildPath, "client"),
      publicPath,
      clean: true,
    },
  });
};

// scripts/dev.js
// 添加 CORS 中间件
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(
  webpackDevMiddleware(clientCompiler, {
    // 直接使用 webpack client config 的 publicPath，保持一致
    publicPath: clientDevConfig.output.publicPath,
    serverSideRender: true,
    writeToDisk: false, // 禁用写入磁盘，使用内存缓存
  })
);
```

```tsx
// app/server/index.tsx
import path, { join } from "node:path";
import appConstants from "../../config/constants";

router.get("(.*)", async (ctx: Koa.Context) => {
  // 给 ChunkExtractor 抽取到的资源添加路径前缀, 指向 8099 端口
  const isDevelopment = process.env.NODE_ENV === "development";
  const extractorPublicPath = isDevelopment
    ? `http://localhost:${appConstants.hmrPort}${appConstants.publicPath}/client/`
    : join(appConstants.publicPath, "client/"); // 生产环境使用相对路径

  const extractor = new ChunkExtractor({
    statsFile,
    entrypoints: ["client"],
    publicPath: extractorPublicPath,
  });
});
```
