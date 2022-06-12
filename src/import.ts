import fs from 'fs';

import { FileReader } from './FileReader';
import { ImageReader } from './ImageReader';
import { RecipesBuilder } from './RecipesBuilder';

const imageReader = new ImageReader();

export async function main(
  fileReader: FileReader,
  recipeBuilder: RecipesBuilder
) {
  const files = fileReader.getFilesToImport();
  const jsons = [];

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    try {
      const pdfFile = fileReader.getPDFFile(file);
      if (!(await pdfFile.isImportAble())) {
        continue;
      }
      const recipe = pdfFile.generateRecipe(imageReader);
      await recipeBuilder.buildRecipes(recipe);
      await recipe.writeToFileSystem();
      jsons.push(recipe.toJson());
    } catch (e) {
      console.warn(
        `import of file ${file} failed with error: ${(e as Error).message}`
      );
    }
  }
  fs.writeFileSync("result/import.json", JSON.stringify(jsons));
}
