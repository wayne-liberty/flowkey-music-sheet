/**
 * get url from browser
let elements = document.getElementsByClassName('split-image');

// Check that there are actually images on the page
if (elements.length === 0) {
  console.error('No images found');
} else {
  // If images were found, extract the base url from the 1st one
  const imageUrl = elements[0].src;
  const imageIdMatch = /\/sheets\/([\w\d]+)\//;
  const baseUrl = 'https://flowkeycdn.com/sheets/';

  // Construct the final url to use
  const matched = imageUrl.match(imageIdMatch)[1];
  const url = `${baseUrl}${matched}/300/`;

  // Log the url to the console
  console.log(url);

  // This last line may fail on some browsers, but you can always manually copy from the log statement above.
  copy(url);
}
*/
const fs = require("fs");
const fetch = require("node-fetch");
const im = require("imagemagick");
const rimraf = require("rimraf");
const path = require("path");
const jimp = require("jimp");
const Jimp = require("jimp");

async function download(url, name) {
  console.log("fetch", url);
  const response = await fetch(url);
  const buffer = await response.buffer();
  if (response.status == "403") return false;
  fs.writeFile(`./buffer/${name}.png`, buffer, (e) => {
    e && console.log(e);
    console.log("finished downloading!", name);
  });
  return true;
}

function sum(arr) {
  return arr.reduce((base, cur) => cur + base, 0);
}

async function main(sheetName, baseURL) {
  // download files
  rimraf.sync("./buffer");
  fs.mkdirSync("./buffer");

  let i = 0;
  while (true) {
    const url = `${baseURL}${i.toString()}.png`;
    const result = await download(url, i);
    if (!result) {
      break;
    }
    ++i;
  }

  // stitching image together
  const files = fs
    .readdirSync("./buffer")
    .sort((a, b) => {
      return Number.parseInt(a) - Number.parseInt(b);
    })
    .map((file) => path.join(__dirname, `./buffer`, file));

  const images = await Promise.all(
    files.map((fileName) => jimp.read(fileName))
  );

  const width = sum(
    images.map((image) => {
      return image.bitmap.width;
    })
  );
  const height = Math.max(...images.map((image) => image.bitmap.height));
  console.log(width, height);
  const mergedImage = new Jimp(width, height + 10, 0xffffffff);
  images.forEach((image, index) => {
    const x = sum(images.slice(0, index).map((image) => image.bitmap.width));
    const y = 0;
    mergedImage.blit(image, x, y + 10);
  });

  mergedImage.writeAsync(`${sheetName}.png`);
}

main("He's a pirate", "https://flowkeycdn.com/sheets/bnAFuX2K5XQHAvWNX/300/");
