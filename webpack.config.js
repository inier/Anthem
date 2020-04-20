const webpack = require("webpack");
const path = require("path");
const OpenBrowserPlugin = require("open-browser-webpack-plugin");
const NyanProgressPlugin = require("nyan-progress-webpack-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const { host, port, devPort } = require("./serverConf");
const env = process.env.NODE_ENV.trim(); // 当前环境

//启动图片服务器
require("./server/bin/www");

module.exports = {
  // 开发服务器配置
  devServer: {
    host: host, // 主机地址
    port: port, // 端口号
    progress: true, // 进度条
    contentBase: "./app", // 服务默认指向文件夹
    inline: true, // 设置为true，当源文件改变的时候会自动刷新
    historyApiFallback: true, // 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
    hot: true, // 允许热加载
    open: true, // 自动打开浏览器
    overlay: {
      // 全屏覆盖显示错误和警告
      errors: true,
      warnings: true,
    },
    // noInfo: false,
    // quiet: false,    
    watchOptions: {
      ignored: /node_modules/, //忽略不用监听变更的目录
      aggregateTimeout: 500, //防止重复保存频繁重新编译,500毫米内重复保存不打包
      poll: 1000, //每秒询问的文件变更的次数
    },
  },
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  entry: [
    // patch 要放在 vendor 最前面
    "react-hot-loader/patch",
    `webpack-dev-server/client?http://${host}:${port}/`,
    "webpack/hot/only-dev-server",
    path.resolve(__dirname, "app/main.js"),
  ],
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "./bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
        // include: path.join(__dirname, "app"),
        // exclude: /node_modules/,
      },
      {
        test: new RegExp(`^(?!.*\\.module).*\\.scss`),
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
        // include: path.join(__dirname, "app"),
        // exclude: /node_modules/,
      },
      {
        test: new RegExp(`^(.*\\.module).*\\.scss`),
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
        // include: path.join(__dirname, "app"),
        // exclude: /node_modules/,
      },
      {
        test: /\.js[x]?$/,
        include: path.resolve(__dirname, "app"),
        exclude: /node_modules/,
        //cacheDirectory 增加babel编译缓存
        loader: ["babel-loader?cacheDirectory"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".css"],
    alias: {
      // ================================
      // 自定义路径别名
      // ================================
      "@": path.join(__dirname, ""),
    },
  },
  plugins: [
    //作用域提升，webpack3
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
      // ================================
      // 配置开发全局常量
      // ================================
      __DEV__: env === "development",
      __PROD__: env === "production",
    }),
    // 进度条
    new NyanProgressPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new BrowserSyncPlugin(
      {
        host: host,
        port: devPort,
        proxy: `http://${host}:${port}`,
        logConnections: false,
        notify: false,
      },
      {
        reload: false,
      }
    ),
  ],
};
