import { fromBuffer } from 'pdf2pic';
import { createMock } from 'ts-jest-mock';
import { instance, mock } from 'ts-mockito';

import { ImageReader } from './ImageReader';
import { Recipe } from './Recipe';
import { RecipeImage } from './RecipeImage';
import { RecipePDFFile } from './RecipePDF';

jest.mock("pdf2pic");
const fromBufferMockFn = createMock(fromBuffer);

describe("RecipePDF", () => {
  describe("get name", () => {
    it("should return name", () => {
      const pdfFile = new RecipePDFFile(Buffer.from("abc"), "name.pdf");
      expect(pdfFile.name).toBe("name.pdf");
    });
  });

  describe("nameShort", () => {
    it("should return short name", () => {
      const pdfFile = new RecipePDFFile(
        Buffer.from("abc"),
        "./data/folder_name/name.pdf"
      );
      expect(pdfFile.nameShort).toBe("folder_name");
    });
  });

  describe("get image", () => {
    let mockBulkFn: any;

    beforeEach(() => {
      mockBulkFn = jest.fn(() => [{ base64: "dGVzdA==" }]);
      fromBufferMockFn.mockReturnValue({ bulk: mockBulkFn } as any);
    });

    it("should convert from buffer", async () => {
      const pdfFile = new RecipePDFFile(Buffer.from("abc"), "name.pdf");
      await pdfFile.getImage(2);
      expect(fromBufferMockFn).toHaveBeenCalledTimes(1);
      const params = fromBufferMockFn.mock.calls;
      expect(params[0][0].toString()).toBe("abc");
      expect(params[0][1]).toEqual({ width: 3508, height: 2450, density: 330 });
    });

    it("should convert bulk", async () => {
      const pdfFile = new RecipePDFFile(Buffer.from("abc"), "name.pdf");
      await pdfFile.getImage(2);
      expect(mockBulkFn).toHaveBeenCalledTimes(1);
      const params = mockBulkFn.mock.calls;
      expect(params[0][0]).toBe(2);
      expect(params[0][1]).toBe(true);
    });

    it("should return receiptimage", async () => {
      const pdfFile = new RecipePDFFile(Buffer.from("abc"), "name.pdf");
      const result = await pdfFile.getImage(2);
      expect(result).toBeInstanceOf(RecipeImage);
      expect(result.recipeImage.toString("base64")).toBe("dGVzdA==");
    });
  });

  describe("generateRecipe", () => {
    let imageReader: ImageReader;
    beforeEach(() => {
      imageReader = mock(ImageReader);
    });

    it("should return recipe", () => {
      const pdfFile = new RecipePDFFile(Buffer.from("abc"), "name.pdf");
      const result = pdfFile.generateRecipe(instance(imageReader));
      expect(result).toBeInstanceOf(Recipe);
    });
  });
});
