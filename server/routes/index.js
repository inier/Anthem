const getImg = require("../module/getImg");
const router = require("koa-router")();
const sizeOf = require("image-size");
const path = require("path");

const numGetImgList = (imgList, newList, userGetNum) => {
  if (newList.length == userGetNum) {
    return newList;
  }

  var num = Math.floor(Math.random() * imgList.length);

  let newImg = imgList[num]
    ? imgList[num]
    : numGetImgList(imgList, newList, userGetNum);
  //获取图片宽高
  let dimensions = sizeOf(path.join(__dirname, "..", "public", newImg));
  newList.push({
    src: `${newImg}?w=${dimensions.width}&h=${dimensions.height}`,
    width: dimensions.width,
    height: dimensions.height,
  });

  return numGetImgList(imgList, newList, userGetNum);
};

router.get("/", async (ctx, next) => {
  //请求数量
  let userGetNum = ctx.query.num;
  //所有图片
  let imgList = await getImg();

  //根据请求数 返回随机图片路径
  let newList = numGetImgList(imgList, [], userGetNum);

  ctx.body = newList;
});

module.exports = router;
