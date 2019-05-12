import { flamelinkApp } from '../../services/flamelink'
import csv from 'csvtojson';
import path from 'path';

const csvFilePath = path.resolve(__dirname, './data/plants_walk_4.csv');

const createPlant = plant => flamelinkApp.content.add({
  schemaKey: 'plants',
  data: plant
}).then(
  p => console.log(`Plant ${plant.botanicalName} processed`)
);

const createPlants = plants => plants.reduce(
  (p, plant) => p.then(() => createPlant(plant)),
  Promise.resolve()
);

(async () => {
  const plantsData = await csv().fromFile(csvFilePath);
  createPlants(plantsData.slice(0, 2));
})();

