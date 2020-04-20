// 增加一个.postcssrc.js来指定postcss所使用的插件。就跟.babelrc类似
module.exports = {
  syntax: "postcss-scss",
  plugins: {
    autoprefixer: {},
  },
};
