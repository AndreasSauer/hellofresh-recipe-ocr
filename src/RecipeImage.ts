import Jimp from 'jimp';

export const textBlockConfig: {
  [key: string]: { x: number; y: number; w: number; h: number };
} = {
  "0": {
    x: 20,
    y: 680,
    w: 840,
    h: 650,
  },
  "1": {
    x: 880,
    y: 680,
    w: 840,
    h: 650,
  },
  "2": {
    x: 1740,
    y: 680,
    w: 840,
    h: 650,
  },
  "3": {
    x: 20,
    y: 1760,
    w: 840,
    h: 650,
  },
  "4": {
    x: 880,
    y: 1760,
    w: 840,
    h: 650,
  },
  "5": {
    x: 1760,
    y: 1760,
    w: 840,
    h: 650,
  },
};

export const imageBlockConfig: {
  [key: string]: { x: number; y: number; w: number; h: number };
} = {
  "0": {
    x: 60,
    y: 250,
    w: 800,
    h: 430,
  },
  "1": {
    x: 920,
    y: 250,
    w: 800,
    h: 430,
  },
  "2": {
    x: 1780,
    y: 250,
    w: 800,
    h: 430,
  },
  "3": {
    x: 60,
    y: 1330,
    w: 800,
    h: 430,
  },
  "4": {
    x: 920,
    y: 1330,
    w: 800,
    h: 430,
  },
  "5": {
    x: 1780,
    y: 1330,
    w: 800,
    h: 430,
  },
};

export const MainImage = {
  x: 0,
  y: 380,
  w: 2730,
  h: 1660,
};

export const Header = {
  x: 570,
  y: 90,
  w: 2160,
  h: 130,
};

export class RecipeImage {
  public get recipeImage() {
    return this.image;
  }

  constructor(private image: Buffer) {}

  public async getRecipeTextBlock(number: number): Promise<Buffer> {
    const image = await Jimp.read(this.image);
    const config = textBlockConfig[String(number)];
    return await image
      .crop(config.x, config.y, config.w, config.h)
      .getBufferAsync(Jimp.MIME_JPEG);
  }

  public async getRecipeTextImage(number: number): Promise<Buffer> {
    const image = await Jimp.read(this.image);
    const config = imageBlockConfig[String(number)];
    return await image
      .crop(config.x, config.y, config.w, config.h)
      .getBufferAsync(Jimp.MIME_JPEG);
  }

  public async getMainImage(): Promise<Buffer> {
    const image = await Jimp.read(this.image);
    return await image
      .crop(MainImage.x, MainImage.y, MainImage.w, MainImage.h)
      .getBufferAsync(Jimp.MIME_JPEG);
  }

  public async getHeader(): Promise<Buffer> {
    const image = await Jimp.read(this.image);
    return await image
      .crop(Header.x, Header.y, Header.w, Header.h)
      .getBufferAsync(Jimp.MIME_JPEG);
  }
}
