import { Recipe } from './Recipe';

export class RecipesBuilder {
  public async buildRecipes(receipt: Recipe) {
    await receipt.loadRecipeTextes();
    await receipt.loadRecipeImages();
    await receipt.loadMainImage();
    await receipt.loadHeader();
  }
}
