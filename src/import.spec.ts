import fs from 'fs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { FileReader } from './FileReader';
import { main } from './import';
import { Recipe } from './Recipe';
import { RecipePDFFile } from './RecipePDF';
import { RecipesBuilder } from './RecipesBuilder';

describe("index", () => {
  let fileReader: FileReader;
  let recipeBuilder: RecipesBuilder;
  let pdfFile: RecipePDFFile;
  let recipe: Recipe;
  let fsMockWriteFile: jest.SpyInstance;

  const files = ["file.pdf"];

  beforeEach(() => {
    fileReader = mock(FileReader);
    recipeBuilder = mock(RecipesBuilder);
    pdfFile = mock(RecipePDFFile);
    recipe = mock(Recipe);
    when(fileReader.getFilesToImport()).thenReturn(files);
    when(fileReader.getPDFFile(anything())).thenReturn(instance(pdfFile));
    when(pdfFile.isImportAble()).thenResolve(true);
    when(pdfFile.generateRecipe(anything())).thenReturn(instance(recipe));
    when(recipe.toJson()).thenReturn({
      name: "",
      headerText: "",
      recipeText: {},
    });

    fsMockWriteFile = jest.spyOn(fs, "writeFileSync");
  });

  afterEach(() => {
    fsMockWriteFile.mockReset();
  });

  it("should load files from filereader", async () => {
    await main(instance(fileReader), instance(recipeBuilder));
    verify(fileReader.getFilesToImport()).once();
  });

  it("should  load file from filesystem", async () => {
    await main(instance(fileReader), instance(recipeBuilder));
    verify(fileReader.getPDFFile(files[0])).once();
  });

  it("should generate pdf file", async () => {
    await main(instance(fileReader), instance(recipeBuilder));
    verify(fileReader.getPDFFile(files[0])).once();
  });

  it("should generate pdf file", async () => {
    await main(instance(fileReader), instance(recipeBuilder));
    verify(fileReader.getPDFFile(files[0])).once();
  });

  it("should generate recipe", async () => {
    await main(instance(fileReader), instance(recipeBuilder));
    verify(pdfFile.generateRecipe(anything())).once();
  });

  it("should build recipe", async () => {
    await main(instance(fileReader), instance(recipeBuilder));
    verify(recipeBuilder.buildRecipes(anything())).once();
  });

  it("should write files to system", async () => {
    await main(instance(fileReader), instance(recipeBuilder));
    verify(recipe.writeToFileSystem()).calledAfter(
      recipeBuilder.buildRecipes(anything())
    );
  });

  it("should write to file system", async () => {
    await main(instance(fileReader), instance(recipeBuilder));
    expect(fsMockWriteFile).toHaveBeenCalledTimes(1);
    const params = fsMockWriteFile.mock.calls[0];
    expect(params[0]).toBe("result/import.json");
    expect(params[1]).toBe('[{"name":"","headerText":"","recipeText":{}}]');
  });

  it("should not import file when it is not importable", async () => {
    when(pdfFile.isImportAble()).thenResolve(false);
    await main(instance(fileReader), instance(recipeBuilder));
    verify(pdfFile.generateRecipe(anything())).never();
    verify(recipeBuilder.buildRecipes(anything())).never();
    verify(recipe.writeToFileSystem()).never();
  });
});
