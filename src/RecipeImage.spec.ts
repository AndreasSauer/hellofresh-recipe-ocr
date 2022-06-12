import Jimp from 'jimp';

import { Header, imageBlockConfig, MainImage, RecipeImage, textBlockConfig } from './RecipeImage';

describe("RecipeImage", () => {
  let mockJimpRead: jest.SpyInstance;
  let mockJimpCrop: jest.Mock;
  let mockJimpGetBufferAsync: jest.Mock;

  beforeEach(() => {
    mockJimpGetBufferAsync = jest.fn(() => {
      return Buffer.from("def");
    });
    mockJimpCrop = jest.fn(() => {
      return { getBufferAsync: mockJimpGetBufferAsync };
    });

    mockJimpRead = jest.spyOn(Jimp, "read");
    mockJimpRead.mockImplementation(() => {
      return { crop: mockJimpCrop };
    });
  });

  afterEach(() => {
    mockJimpRead.mockReset();
  });

  describe("recipeImage", () => {
    it("should return buffer", () => {
      const image = new RecipeImage(Buffer.from("abc"));
      expect(image.recipeImage.toString()).toBe("abc");
    });
  });

  describe("getRecipeTextBlock", () => {
    it("should map image", async () => {
      const image = new RecipeImage(Buffer.from("abc"));
      await image.getRecipeTextBlock(1);
      expect(mockJimpRead).toHaveBeenCalledTimes(1);
      const calls = mockJimpRead.mock.calls;
      expect(calls[0][0].toString()).toBe("abc");
    });

    it("should crop image with correkt coordinates", async () => {
      const image = new RecipeImage(Buffer.from("abc"));
      for (let index = 0; index < 6; index++) {
        await image.getRecipeTextBlock(index);
        const calls = mockJimpCrop.mock.calls[index];
        const config = textBlockConfig[String(index)];
        expect(calls[0]).toBe(config.x);
        expect(calls[1]).toBe(config.y);
        expect(calls[2]).toBe(config.w);
        expect(calls[3]).toBe(config.h);
      }
    });

    it("should return buffer", async () => {
      const image = new RecipeImage(Buffer.from("abc"));
      const result = await image.getRecipeTextBlock(1);
      expect(mockJimpGetBufferAsync).toHaveBeenCalledTimes(1);
      const call = mockJimpGetBufferAsync.mock.calls[0];
      expect(call[0]).toBe(Jimp.MIME_JPEG);
      expect(result.toString()).toBe("def");
    });
  });

  describe("getRecipeTextImage", () => {
    it("should map image", async () => {
      const image = new RecipeImage(Buffer.from("abc"));
      await image.getRecipeTextImage(1);
      expect(mockJimpRead).toHaveBeenCalledTimes(1);
      const calls = mockJimpRead.mock.calls;
      expect(calls[0][0].toString()).toBe("abc");
    });

    it("should crop image with correkt coordinates", async () => {
      const image = new RecipeImage(Buffer.from("abc"));
      for (let index = 0; index < 6; index++) {
        await image.getRecipeTextImage(index);
        const calls = mockJimpCrop.mock.calls[index];
        const config = imageBlockConfig[String(index)];
        expect(calls[0]).toBe(config.x);
        expect(calls[1]).toBe(config.y);
        expect(calls[2]).toBe(config.w);
        expect(calls[3]).toBe(config.h);
      }
    });

    it("should return buffer", async () => {
      const image = new RecipeImage(Buffer.from("abc"));
      const result = await image.getRecipeTextImage(1);
      expect(mockJimpGetBufferAsync).toHaveBeenCalledTimes(1);
      const call = mockJimpGetBufferAsync.mock.calls[0];
      expect(call[0]).toBe(Jimp.MIME_JPEG);
      expect(result.toString()).toBe("def");
    });
  });

  describe("getMainImage", () => {
    it("should map image", async () => {
      const image = new RecipeImage(Buffer.from("abc"));
      await image.getMainImage();
      expect(mockJimpRead).toHaveBeenCalledTimes(1);
      const calls = mockJimpRead.mock.calls;
      expect(calls[0][0].toString()).toBe("abc");
    });

    it("should crop image with correkt coordinates", async () => {
      const image = new RecipeImage(Buffer.from("abc"));
      await image.getMainImage();
      const calls = mockJimpCrop.mock.calls[0];
      expect(calls[0]).toBe(MainImage.x);
      expect(calls[1]).toBe(MainImage.y);
      expect(calls[2]).toBe(MainImage.w);
      expect(calls[3]).toBe(MainImage.h);
    });

    it("should return buffer", async () => {
      const image = new RecipeImage(Buffer.from("abc"));
      const result = await image.getMainImage();
      expect(mockJimpGetBufferAsync).toHaveBeenCalledTimes(1);
      const call = mockJimpGetBufferAsync.mock.calls[0];
      expect(call[0]).toBe(Jimp.MIME_JPEG);
      expect(result.toString()).toBe("def");
    });
  });

  describe("getHeader", () => {
    it("should map image", async () => {
      const image = new RecipeImage(Buffer.from("abc"));
      await image.getHeader();
      expect(mockJimpRead).toHaveBeenCalledTimes(1);
      const calls = mockJimpRead.mock.calls;
      expect(calls[0][0].toString()).toBe("abc");
    });

    it("should crop image with correkt coordinates", async () => {
      const image = new RecipeImage(Buffer.from("abc"));
      await image.getHeader();
      const calls = mockJimpCrop.mock.calls[0];
      expect(calls[0]).toBe(Header.x);
      expect(calls[1]).toBe(Header.y);
      expect(calls[2]).toBe(Header.w);
      expect(calls[3]).toBe(Header.h);
    });

    it("should return buffer", async () => {
      const image = new RecipeImage(Buffer.from("abc"));
      const result = await image.getHeader();
      expect(mockJimpGetBufferAsync).toHaveBeenCalledTimes(1);
      const call = mockJimpGetBufferAsync.mock.calls[0];
      expect(call[0]).toBe(Jimp.MIME_JPEG);
      expect(result.toString()).toBe("def");
    });
  });
});
