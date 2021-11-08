/**
 * 脚本位于tools目录，即 ./tools/webp.js
 * 项目的源码均位于src目录，即 ./src/
 * 可以自行调整代码中的部分目录配置
 * Imagemin，版本选择6.1.0，因为7.0.0之后的版本在windows上有兼容性问题，目前还未修复。
 */
const imageMin = require('imagemin');
const imageMinWebp = require('imagemin-webp');
const path = require('path');
const fs = require('fs');

let quality = 75;
let rootDir = path.join(__dirname, '../src/img');

async function init(dir) {
  console.log('start!');
  await loop(dir);
  console.log('completed!');
}

async function loop(dir) {
  let res = fs.readdirSync(dir, {
    withFileTypes: true,
  });
  await imageMin([path.join(dir, '*.{jpg,png}')], dir, {
    plugins: [
      imageMinWebp({
        quality: quality,
      }),
    ],
  });
  console.log(dir);
  for (let i = 0, length = res.length; i < length; i++) {
    if (res[i].isDirectory()) {
      await loop(path.join(dir, res[i].name));
    }
  }
}

if (process.argv.length >= 3) {
  if (process.argv[3]) {
    quality = process.argv[3];
  }
  let dir = path.join(__dirname, '../', process.argv[2]);
  const stats = fs.statSync(dir);
  if (stats.isDirectory()) {
    rootDir = dir;
    init(rootDir);
  } else if (stats.isFile()) {
    console.log('start!');
    imageMin([dir], path.dirname(dir), {
      plugins: [
        imageMinWebp({
          quality: quality,
        }),
      ],
    });
    console.log(dir);
    console.log('completed!');
  }
} else {
  init(rootDir);
}
