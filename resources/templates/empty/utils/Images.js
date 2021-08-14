import JIMP from "jimp";

export default class Images {
  getImage(url) {
    if (!url.startsWith("http")) url = this.Actions.getLocalFile(url);
    return JIMP.read(url);
  }

  getFont(url) {
    return JIMP.loadFont(this.Actions.getLocalFile(url));
  }

  createBuffer(image) {
    return new Promise(function (resolve, reject) {
      image.getBuffer(JIMP.MIME_PNG, function (err, buffer) {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });
  }

  drawImageOnImage(img1, img2, x, y) {
    for (let i = 0; i < img2.bitmap.width; i++) {
      for (let j = 0; j < img2.bitmap.height; j++) {
        const pos = i * (img2.bitmap.width * 4) + j * 4;
        const pos2 = (i + y) * (img1.bitmap.width * 4) + (j + x) * 4;
        const target = img1.bitmap.data;
        const source = img2.bitmap.data;
        for (let k = 0; k < 4; k++) {
          target[pos2 + k] = source[pos + k];
        }
      }
    }
  }
}
