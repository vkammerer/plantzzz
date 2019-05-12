import { without, sampleSize, shuffle } from 'lodash';

export const getQuizz = allPlants => {
  const plants = allPlants
    .sort(function(a, b){
      if(a.botanicalName < b.botanicalName) { return -1; }
      if(a.botanicalName > b.botanicalName) { return 1; }
      return 0
    })
    .filter(p => p.images.length > 0)

  const botanicalNames = plants.map(p => p.botanicalName)
  const commonNames = plants.map(p => p.commonName)
  return plants
    .map(p => {
      const plantBotanicalNames = sampleSize(without(botanicalNames, p.botanicalName), 3)
      const plantCommonNames = sampleSize(without(commonNames, p.commonName), 3)
      const image = sampleSize(p.images, 1)[0]
      return ({
        ...p,
        image,
        questions: [
          {
            type: 'botanicalName',
            suggestions: shuffle([...plantBotanicalNames, p.botanicalName]),
          },
          {
            type: 'commonName',
            suggestions: shuffle([...plantCommonNames, p.commonName]),
          }
        ]
      })
    })
}