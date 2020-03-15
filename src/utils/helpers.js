import { flatten } from "lodash";

export const wait = time => new Promise(resolve => setTimeout(resolve, time));

export const getScoreValue = quiz =>
  flatten(quiz.map(p => p.questions)).reduce((acc, q) => acc + getAnswerValue(q), 0);

export const getPhotoPath = image =>
  `${process.env.PUBLIC_URL}/images/plants/750${image.dir}/${image.fileName}`;

export const preloadPhoto = plant => {
  if (!plant) return;
  const plantImage = new Image();
  plantImage.src = getPhotoPath(plant.image);
};

export const getAnswerValue = ({ userAnswer, correctAnswer, timeToReply }) => {
  if (userAnswer === correctAnswer) {
    return Math.max(Math.floor((10000 - timeToReply) / 200), 10);
  }
  if (userAnswer) return -5;
  return 0;
};
