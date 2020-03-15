import { without, sampleSize, shuffle, head, sortBy } from "lodash";

export const getQuizPlants = ({ plants, count }) => {
  const imagedPlants = sortBy(plants, "botanicalName").filter(p => p.images.length > 0);

  const botanicalNames = imagedPlants.map(p => p.botanicalName);
  const commonNames = imagedPlants.map(p => p.commonName);
  return sampleSize(
    imagedPlants.map(p => {
      const plantBotanicalNames = sampleSize(without(botanicalNames, p.botanicalName), 3);
      const plantCommonNames = sampleSize(without(commonNames, p.commonName), 3);
      const image = head(sampleSize(p.images, 1));
      return {
        image,
        questions: [
          {
            type: "botanicalName",
            correctAnswer: p.botanicalName,
            suggestions: shuffle([...plantBotanicalNames, p.botanicalName]),
          },
          {
            type: "commonName",
            correctAnswer: p.commonName,
            suggestions: shuffle([...plantCommonNames, p.commonName]),
          },
        ],
      };
    }),
    count,
  );
};
