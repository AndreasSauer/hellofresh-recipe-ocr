import { instance, mock, verify } from 'ts-mockito';

import { Recipe } from './Recipe';
import { RecipesBuilder } from './RecipesBuilder';

describe("RecipesBuilder", () => {
  const builder = new RecipesBuilder();
  let receipt: Recipe;

  beforeEach(() => {
    receipt = mock(Recipe);
  });

  it("should load recipe textes", async () => {
    await builder.buildRecipes(instance(receipt));
    verify(receipt.loadRecipeTextes()).once();
  });

  it("should load recipe images", async () => {
    await builder.buildRecipes(instance(receipt));
    verify(receipt.loadRecipeImages()).once();
  });

  it("should load main images", async () => {
    await builder.buildRecipes(instance(receipt));
    verify(receipt.loadMainImage()).once();
  });

  it("should load header images", async () => {
    await builder.buildRecipes(instance(receipt));
    verify(receipt.loadHeader()).once();
  });
});
