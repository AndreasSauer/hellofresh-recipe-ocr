import PDFParser from 'pdf2json';
import { fromBuffer } from 'pdf2pic';

import { ImageReader } from './ImageReader';
import { Recipe } from './Recipe';
import { RecipeImage } from './RecipeImage';

const baseOptions = {
  width: 3508,
  height: 2450,
  density: 330,
};

const WANTEDWIDTH = 49.5;
const WANTEDHEIGT = 38.25;

export class RecipePDFFile {
  private pdfJsonParser;

  public get name(): string {
    return this.fileName;
  }

  public get nameShort(): string {
    const parts = this.fileName.split("/");
    return parts[2];
  }

  constructor(private buffer: Buffer, private fileName: string) {}

  public async isImportAble() {
    this.pdfJsonParser = new PDFParser();
    return await new Promise<boolean>((resovle, reject) => {
      this.pdfJsonParser.on("pdfParser_dataError", (errData) =>
        reject(errData)
      );
      this.pdfJsonParser.on("pdfParser_dataReady", (pdfData) => {
        resovle(
          pdfData.Pages[0].Width === WANTEDWIDTH &&
            pdfData.Pages[0].Height === WANTEDHEIGT
        );
      });
      this.pdfJsonParser.parseBuffer(this.buffer);
    });
  }

  async getImage(pageNumber: 1 | 2) {
    const convert = fromBuffer(this.buffer, baseOptions);
    if (convert.bulk) {
      const result = await convert.bulk(pageNumber, true);
      const page = result[0] as any;
      const buffer = Buffer.from(page.base64, "base64");
      return new RecipeImage(buffer);
    }
  }

  public generateRecipe(imageReader: ImageReader) {
    return new Recipe(this, imageReader);
  }
}
