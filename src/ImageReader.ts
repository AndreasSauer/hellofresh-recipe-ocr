import tesseract from 'node-tesseract-ocr';

export class ImageReader {
  public async readImage(buffer: Buffer): Promise<string> {
    const config = {
      lang: "deu",
      oem: 1,
      psm: 3,
    };
    return await tesseract.recognize(buffer, config);
  }
}
