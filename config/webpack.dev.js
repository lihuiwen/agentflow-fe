const { merge } = require("webpack-merge");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const baseConfig = require("./webpack.config.js");
const appConstants = require("./constants");
const CircularDependencyPlugin = require("circular-dependency-plugin");

const mode = "development";

module.exports = [
  (env) =>
    merge(baseConfig.client(env), {
      entry: {
        client: [
          `webpack-hot-middleware/client?path=http://localhost:${appConstants.hmrPort}/__webpack_hmr`,
        ],
      },
      output: {
        assetModuleFilename: "media/[name].[ext]",
        filename: "js/[name].js",
        chunkFilename: "js/[name].chunk.js",
      },
      devtool: "eval-source-map",
      mode,
      experiments: {},
      watchOptions: {
        ignored: /node_modules\/\.cache/,
      },
      // 这个 devServer 其实没啥用
      devServer: {
        // 将 devMiddleware 的配置直接写在devMiddleware中了，这里不再需要
        devMiddleware: {
          publicPath: appConstants.publicPath,
          serverSideRender: true,
          writeToDisk: true,
        },
        open: false,
        historyApiFallback: {
          disableDotRule: true,
          index: `${appConstants.publicPath}/`,
        },
        hot: true,
        static: {
          directory: "public",
          // publicPath: appConstants.publicPath,
        },
        allowedHosts: "all",
        // port: devServerPort,
        compress: true,
        client: {
          logging: "error",
          progress: true,
          overlay: false,
          webSocketURL: `ws://localhost:${appConstants.hmrPort}/ws`,
        },
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin(),
        new MiniCssExtractPlugin({
          filename: "css/[name].css",
          chunkFilename: "css/[name].chunk.css",
        }),
        new CircularDependencyPlugin({
          exclude: /node_modules/,
          include: /src/,
          failOnError: false,
          allowAsyncCycles: false,
          cwd: process.cwd(),
        }),
      ],
    }),
  (env) =>
    merge(baseConfig.server(env), {
      mode,
      devtool: "eval-source-map",
    }),
];
