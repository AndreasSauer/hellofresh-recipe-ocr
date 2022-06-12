import tesseract from 'node-tesseract-ocr';

import { ImageReader } from './ImageReader';

describe("ImageReader", () => {
  let mockTesseractTecognize: jest.SpyInstance;
  const reader = new ImageReader();
  beforeEach(() => {
    mockTesseractTecognize = jest.spyOn(tesseract, "recognize");
    mockTesseractTecognize.mockImplementation(() => {
      return "result";
    });
  });

  it("should call recognize of tesseract", async () => {
    await reader.readImage(Buffer.from("abc"));
    expect(mockTesseractTecognize).toHaveBeenCalledTimes(1);
    const params = mockTesseractTecognize.mock.calls[0];
    expect(params[0]).toBeInstanceOf(Buffer);
    expect(params[0].toString()).toBe("abc");
    expect(params[1]).toEqual({
      lang: "deu",
      oem: 1,
      psm: 3,
    });
  });

  it("should return result", async () => {
    const result = await reader.readImage(Buffer.from("abc"));
    expect(result).toBe("result");
  });
});
