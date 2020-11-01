> the idea of this project is based on the article https://amcolash.com/2019/12/27/flowkey-sheet-music.html. great thanks to the author.

> this Audiveris in this repository is a custom build, the official one has a bug causing the image not able to convert.

## what is this?
this is a tool to help you convert flowkey image music sheets to digital printable format(mxl,pdf)

## preparation
1. setup node env on your computer
2. install Audiveris from this repo to your computer
3. your need a flowkey account to access your music sheet.

## instruction
1. Open the page of flowkey song that you want to download the sheet from.
2. Open browser console. 
3. Paste the following code in and hit enter to run. then the url will be copied to your clipboard 

```
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
```
4. Change url and filename in generateImage.js
5. Run ```node generateImage.js``` in console. you will get a png under the root folder of this project.
6. Open Audiveris and drag the image in. Convert the image then export as mxl file.
7. use another tool to edit the mxl file to your like and then export them as pdf. (I'm using MuseScore)
