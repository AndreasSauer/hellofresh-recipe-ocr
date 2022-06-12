import { FileReader } from './FileReader';
import { main } from './import';
import { RecipesBuilder } from './RecipesBuilder';

(async () => {
  console.log("start import receipts");
  await main(new FileReader(), new RecipesBuilder());
  console.log("finish import");
})();
