const path = require("path");
const hfs = require("./hfs");

module.exports = (tPath = "../public/images") => {
  return new Promise((resolve, reject) => {
    hfs.walk(
      path.join(__dirname, tPath),
      (files, dirs) => {
        const tFiles = files.filter((item)=>{return item.indexOf("download") === -1;});
        console.log(files, tFiles);
        resolve(
          tFiles.map((element) => {
            let i = element.indexOf("images");
            return element.substring(i);
          })
        );
      },
      {
        sync: false,
      }
    );
  });
};
