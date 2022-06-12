import fs from 'fs';

import { ImageReader } from './ImageReader';
import { RecipeImage } from './RecipeImage';
import { RecipePDFFile } from './RecipePDF';

export class Recipe {
  private recipeTextImages: Buffer[] = [];
  private recipeImages: Buffer[] = [];
  private mainImage: Buffer;
  private header: Buffer;
  private recipeText: { [key: string]: string } = {};
  private headerText: string;

  private page: { [index: string]: RecipeImage } = {};

  constructor(
    private pdfFile: RecipePDFFile,
    private imageReader: ImageReader
  ) {}

  public toJson() {
    return {
      name: this.pdfFile.nameShort,
      headerText: this.headerText,
      recipeText: this.recipeText,
    };
  }

  public async loadRecipeTextes() {
    const secondPage = await this.getPage(2);
    for (let index = 0; index < 6; index++) {
      const step = await secondPage.getRecipeTextBlock(index);
      this.recipeTextImages.push(step);
      const text = await this.imageReader.readImage(step);
      this.recipeText[String(index)] = text;
    }
  }

  public async loadRecipeImages() {
    const secondPage = await this.getPage(2);
    for (let index = 0; index < 6; index++) {
      const step = await secondPage.getRecipeTextImage(index);
      this.recipeImages.push(step);
    }
  }

  public async loadMainImage() {
    const firstPage = await this.getPage(1);
    this.mainImage = await firstPage.getMainImage();
  }

  public async loadHeader() {
    const firstPage = await this.getPage(1);
    this.header = await firstPage.getHeader();
    this.headerText = await this.imageReader.readImage(this.header);
  }

  private async getPage(number: 1 | 2): Promise<RecipeImage> {
    if (this.page[String(number)]) {
      return this.page[String(number)];
    }
    const page = await this.pdfFile.getImage(number);
    this.page[String(number)] = page;
    return page;
  }

  public async writeToFileSystem() {
    const dir = `./result/${this.pdfFile.nameShort}`;
    fs.mkdirSync(dir);
    this.recipeTextImages.forEach((item, index) => {
      fs.writeFileSync(`${dir}/receipt-part-text-${index}.jpg`, item);
    });
    this.recipeImages.forEach((item, index) => {
      fs.writeFileSync(`${dir}/receipt-part-image-${index}.jpg`, item);
    });
    const secondpage = await this.getPage(2);
    fs.writeFileSync(`${dir}/receipt-second-page.jpg`, secondpage.recipeImage);
    const firstpage = await this.getPage(1);
    fs.writeFileSync(`${dir}/receipt-first-page.jpg`, firstpage.recipeImage);
    fs.writeFileSync(`${dir}/main-image.jpg`, this.mainImage);
    fs.writeFileSync(`${dir}/header-text.jpg`, this.header);
  }
}
