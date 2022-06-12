import fs from 'fs';

import { FileReader } from './FileReader';
import { RecipePDFFile } from './RecipePDF';

describe("FileReader", () => {
  describe("getFilesToImport", () => {
    let fsMockReadDir: jest.SpyInstance;
    let fsMocklstatSync: jest.SpyInstance;
    const fileReader = new FileReader();

    beforeEach(() => {
      fsMockReadDir = jest.spyOn(fs, "readdirSync");
      fsMockReadDir.mockImplementation((dir) => {
        if (dir === "./data/") {
          return ["folder_name", "other_file_name"];
        } else {
          return ["recipe.pdf"];
        }
      });

      fsMocklstatSync = jest.spyOn(fs, "lstatSync");
      fsMocklstatSync.mockImplementation((dir: string) => {
        return {
          isDirectory: () => {
            return dir === "./data/folder_name";
          },
        };
      });
    });

    it("it load only file in folder", () => {
      const result = fileReader.getFilesToImport();
      expect(result).toHaveLength(1);
      expect(result[0]).toBe("./data/folder_name/recipe.pdf");
    });
  });

  describe("getPDFFile", () => {
    let fsMockReadFile: jest.SpyInstance;
    const fileReader = new FileReader();

    beforeEach(() => {
      fsMockReadFile = jest.spyOn(fs, "readFileSync");
      fsMockReadFile.mockImplementation(() => {
        return Buffer.from("abc");
      });
    });

    it("should load file from fs", async () => {
      await fileReader.getPDFFile("file.pdf");
      expect(fsMockReadFile).toHaveBeenCalledTimes(1);
      const params = fsMockReadFile.mock.calls[0];
      expect(params[0]).toBe("file.pdf");
    });

    it("should load file from fs", async () => {
      const result = await fileReader.getPDFFile("file.pdf");
      expect(result).toBeInstanceOf(RecipePDFFile);
      expect(result.name).toBe("file.pdf");
    });
  });
});
