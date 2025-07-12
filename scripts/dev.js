const webpack = require("webpack");
const express = require("express");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const [clientDev, serverDev] = require("../config/webpack.dev");
const appConstants = require("../config/constants");

const env = { mode: "dev", goal: "local" };

const clientDevConfig = clientDev(env);
const serverDevConfig = serverDev(env);

const serverCompiler = webpack(serverDevConfig);
const clientCompiler = webpack(clientDevConfig);

serverCompiler.watch(
  {
    ignored: /node_modules/,
  },
  (err) => {
    if (err) throw err;
  }
);

const app = express();

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
app.use(webpackHotMiddleware(clientCompiler));

app.listen(appConstants.hmrPort, () => {});
