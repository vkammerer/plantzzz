import { flatten } from "lodash";

export const wait = time => new Promise(resolve => setTimeout(resolve, time));

export const getScore = quizz =>
  flatten(quizz.map(p => p.questions)).reduce((acc, q) => acc + (q.answer ? q.answer.value : 0), 0);
