import fs from 'fs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { ImageReader } from './ImageReader';
import { Recipe } from './Recipe';
import { RecipeImage } from './RecipeImage';
import { RecipePDFFile } from './RecipePDF';

describe("Recipe", () => {
  let recipe: Recipe;
  let pdfFile: RecipePDFFile;
  let imageReader: ImageReader;
  let recipeImage: RecipeImage;

  beforeEach(() => {
    pdfFile = mock(RecipePDFFile);
    imageReader = mock(ImageReader);
    recipe = new Recipe(instance(pdfFile), instance(imageReader));
    recipeImage = mock(RecipeImage);
    when(pdfFile.getImage(anything())).thenResolve(instance(recipeImage));
    when(pdfFile.nameShort).thenReturn("name.pdf");
    when(recipeImage.recipeImage).thenReturn(Buffer.from("abc"));
    when(recipeImage.getHeader()).thenResolve(Buffer.from("0"));
    when(recipeImage.getMainImage()).thenResolve(Buffer.from("main"));
    when(recipeImage.getRecipeTextBlock(anything()))
      .thenResolve(Buffer.from("1"))
      .thenResolve(Buffer.from("2"))
      .thenResolve(Buffer.from("3"))
      .thenResolve(Buffer.from("4"))
      .thenResolve(Buffer.from("5"))
      .thenResolve(Buffer.from("6"));
    when(recipeImage.getRecipeTextImage(anything()))
      .thenResolve(Buffer.from("1"))
      .thenResolve(Buffer.from("2"))
      .thenResolve(Buffer.from("3"))
      .thenResolve(Buffer.from("4"))
      .thenResolve(Buffer.from("5"))
      .thenResolve(Buffer.from("6"));
    when(imageReader.readImage(anything()))
      .thenResolve("a")
      .thenResolve("b")
      .thenResolve("c")
      .thenResolve("d")
      .thenResolve("e")
      .thenResolve("f")
      .thenResolve("g");
  });

  describe("toJson", () => {
    it("should return emtpy json", () => {
      expect(recipe.toJson()).toEqual({
        headerText: undefined,
        name: "name.pdf",
        recipeText: {},
      });
    });

    it("should add header text when loaded before", async () => {
      await recipe.loadHeader();
      expect(recipe.toJson()).toEqual({
        headerText: "a",
        name: "name.pdf",
        recipeText: {},
      });
    });

    it("should add recipe text when loaded before", async () => {
      await recipe.loadRecipeTextes();
      expect(recipe.toJson()).toEqual({
        headerText: undefined,
        name: "name.pdf",
        recipeText: {
          "0": "a",
          "1": "b",
          "2": "c",
          "3": "d",
          "4": "e",
          "5": "f",
        },
      });
    });

    it("should add header and recipe textes", async () => {
      await recipe.loadRecipeTextes();
      await recipe.loadHeader();
      expect(recipe.toJson()).toEqual({
        headerText: "g",
        name: "name.pdf",
        recipeText: {
          "0": "a",
          "1": "b",
          "2": "c",
          "3": "d",
          "4": "e",
          "5": "f",
        },
      });
    });
  });

  describe("loadRecipeTextes", () => {
    it("should load second page", async () => {
      await recipe.loadRecipeTextes();
      verify(pdfFile.getImage(2)).once();
    });

    it("should load page only once even function is called twice", async () => {
      await recipe.loadRecipeTextes();
      await recipe.loadRecipeTextes();
      verify(pdfFile.getImage(2)).once();
    });

    it("should load receipt text block images from page", async () => {
      await recipe.loadRecipeTextes();
      for (let index = 0; index < 6; index++) {
        verify(recipeImage.getRecipeTextBlock(index)).once();
      }
    });

    it("should load receipt images from page", async () => {
      await recipe.loadRecipeTextes();
      for (let index = 0; index < 6; index++) {
        verify(recipeImage.getRecipeTextBlock(index)).once();
      }
    });

    it("should read images with imageReader", async () => {
      await recipe.loadRecipeTextes();
      verify(imageReader.readImage(anything())).times(6);
      const firstBuffer = capture(imageReader.readImage).first()[0];
      expect(firstBuffer.toString()).toBe("1");
      const lastBuffer = capture(imageReader.readImage).last()[0];
      expect(lastBuffer.toString()).toBe("6");
    });
  });

  describe("loadRecipeImages", () => {
    it("should load second page", async () => {
      await recipe.loadRecipeImages();
      verify(pdfFile.getImage(2)).once();
    });

    it("should load page only once even function is called twice", async () => {
      await recipe.loadRecipeImages();
      await recipe.loadRecipeTextes();
      verify(pdfFile.getImage(2)).once();
    });

    it("should load receipt text images from page", async () => {
      await recipe.loadRecipeImages();
      for (let index = 0; index < 6; index++) {
        verify(recipeImage.getRecipeTextImage(index)).once();
      }
    });
  });

  describe("loadMainImage", () => {
    it("should load second page", async () => {
      await recipe.loadMainImage();
      verify(pdfFile.getImage(1)).once();
    });

    it("should load page only once even function is called twice", async () => {
      await recipe.loadMainImage();
      await recipe.loadMainImage();
      verify(pdfFile.getImage(1)).once();
    });

    it("should load receipt main image from page", async () => {
      await recipe.loadMainImage();
      verify(recipeImage.getMainImage()).once();
    });
  });

  describe("loaderHeader", () => {
    it("should load second page", async () => {
      await recipe.loadHeader();
      verify(pdfFile.getImage(1)).once();
    });

    it("should load page only once even function is called twice", async () => {
      await recipe.loadHeader();
      await recipe.loadMainImage();
      verify(pdfFile.getImage(1)).once();
    });

    it("should load receipt header from page", async () => {
      await recipe.loadHeader();
      verify(recipeImage.getHeader()).once();
    });

    it("should parse header in image reader", async () => {
      await recipe.loadHeader();
      verify(imageReader.readImage(anything())).once();
      const buffer = capture(imageReader.readImage).last()[0];
      expect(buffer.toString()).toBe("0");
    });
  });

  describe("writeToFileSystem", () => {
    let fsMockMkDir: jest.SpyInstance;
    let fsMockWirteFile: jest.SpyInstance;

    beforeEach(() => {
      fsMockMkDir = jest.spyOn(fs, "mkdirSync");
      fsMockMkDir.mockImplementation(() => JSON.stringify({ name: "myname" }));

      fsMockWirteFile = jest.spyOn(fs, "writeFileSync");
      fsMockWirteFile.mockImplementation(() =>
        JSON.stringify({ name: "myname" })
      );
    });

    afterEach(() => {
      fsMockMkDir.mockRestore();
      fsMockWirteFile.mockRestore();
    });

    it("should create result directory", async () => {
      await recipe.writeToFileSystem();
      expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
    });

    it("should load text images", async () => {
      await recipe.loadRecipeTextes();
      await recipe.writeToFileSystem();
      const parts = fsMockWirteFile.mock.calls.filter((item) =>
        String(item[0]).includes("receipt-part-text")
      );
      for (let index = 0; index < parts.length; index++) {
        const element = parts[index];
        expect(element[0]).toBe(
          `./result/name.pdf/receipt-part-text-${index}.jpg`
        );
        expect(element[1].toString()).toBe(String(index + 1));
      }
    });

    it("should load recipe images", async () => {
      await recipe.loadRecipeImages();
      await recipe.writeToFileSystem();
      const parts = fsMockWirteFile.mock.calls.filter((item) =>
        String(item[0]).includes("receipt-part-image")
      );
      for (let index = 0; index < parts.length; index++) {
        const element = parts[index];
        expect(element[0]).toBe(
          `./result/name.pdf/receipt-part-image-${index}.jpg`
        );
        expect(element[1].toString()).toBe(String(index + 1));
      }
    });

    it("should save second page", async () => {
      await recipe.writeToFileSystem();
      const parts = fsMockWirteFile.mock.calls.filter((item) =>
        String(item[0]).includes("receipt-second-page.jpg")
      );
      expect(parts).toHaveLength(1);
      expect(parts[0][0]).toBe("./result/name.pdf/receipt-second-page.jpg");
      expect(parts[0][1].toString()).toBe("abc");
    });

    it("should save first page", async () => {
      await recipe.writeToFileSystem();
      const parts = fsMockWirteFile.mock.calls.filter((item) =>
        String(item[0]).includes("receipt-first-page.jpg")
      );
      expect(parts).toHaveLength(1);
      expect(parts[0][0]).toBe("./result/name.pdf/receipt-first-page.jpg");
      expect(parts[0][1].toString()).toBe("abc");
    });

    it("should save main image", async () => {
      await recipe.loadMainImage();
      await recipe.writeToFileSystem();
      const parts = fsMockWirteFile.mock.calls.filter((item) =>
        String(item[0]).includes("main-image.jpg")
      );
      expect(parts).toHaveLength(1);
      expect(parts[0][0]).toBe("./result/name.pdf/main-image.jpg");
      expect(parts[0][1].toString()).toBe("main");
    });

    it("should save header image", async () => {
      await recipe.loadHeader();
      await recipe.writeToFileSystem();
      const parts = fsMockWirteFile.mock.calls.filter((item) =>
        String(item[0]).includes("header-text.jpg")
      );
      expect(parts).toHaveLength(1);
      expect(parts[0][0]).toBe("./result/name.pdf/header-text.jpg");
      expect(parts[0][1].toString()).toBe("0");
    });
  });
});
