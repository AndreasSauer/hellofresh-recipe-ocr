import fs from 'fs';

import { RecipePDFFile } from './RecipePDF';

export class FileReader {
  public getFilesToImport(): string[] {
    const files = fs.readdirSync("./data/");
    const filesToImport = [];
    files.forEach((item) => {
      const dir = `./data/${item}`;
      if (fs.lstatSync(dir).isDirectory()) {
        const subfiles = fs.readdirSync(dir);
        subfiles.forEach((subfile) => {
          filesToImport.push(`${dir}/${subfile}`);
        });
      }
    });
    return filesToImport;
  }

  public getPDFFile(fileName: string) {
    return new RecipePDFFile(fs.readFileSync(fileName), fileName);
  }
}
