import path from "path";

import fs from "fs-extra";
import { groupBy } from "lodash";

const augmentedImagesMetaPath = path.resolve(
  __dirname,
  "../augmentImages/data/augmentedImages.json",
);

const finalDataDir = path.resolve(__dirname, "../../public");
const finalDataPath = path.resolve(finalDataDir, "data.json");

(async () => {
  const augmentedImagesMeta = JSON.parse(fs.readFileSync(augmentedImagesMetaPath, "utf8"));
  const plantsMetaRaw = augmentedImagesMeta.map(f => {
    const name = f.dir.split("/")[1];
    return {
      ...f,
      name,
    };
  });
  const groupedPlantsMeta = groupBy(plantsMetaRaw, "name");
  const groupedPlantsMetaList = Object.keys(groupedPlantsMeta).map(k => {
    const names = k.split(" - ");
    return {
      botanicalName: names[0],
      commonName: names[1],
      images: groupedPlantsMeta[k].map(i => ({
        dir: i.dir,
        fileName: i.fileName,
        extmetadata: i.extmetadata,
      })),
    };
  });
  await fs.ensureDir(finalDataDir);
  return fs.writeFile(finalDataPath, JSON.stringify(groupedPlantsMetaList), "utf8");
})();
