import path from 'path';

import fs from 'fs-extra';
import sharp from 'sharp';
import { includes } from 'lodash';

const supportedformats = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'gif',
  'svg',
  'tiff'
];

const inputFolderPath = path.resolve(__dirname, './data/input');
const outputFolderPath = path.resolve(__dirname, './data/output/');

const isSupportedFile = file => {
  const extension = file.split('.')[1];
  return !!extension && includes(supportedformats, extension.toLowerCase())
}

const getImagesPaths = dir => {
  const files = fs.readdirSync(dir);
  return files.reduce((acc, file) => {
    const thisPath = `${dir}/${file}`;
    if (fs.statSync(thisPath).isDirectory()) {
      acc.push(...getImagesPaths(`${thisPath}/`));
    }
    else if (isSupportedFile(file)) {
      acc.push({ dir, file });
    }
    return acc;
  }, []);
};

(async () => {
  const images = getImagesPaths(inputFolderPath);
  images.slice(5, 10).reduce(async (p, {dir, file}) => {
    await p;
    const destDir = dir.replace(inputFolderPath, outputFolderPath);
    await fs.ensureDir(destDir);
    const destPath = `${destDir}${file}`;
    return sharp(`${dir}${file}`)
        .resize(375)
        .rotate()
        .toFile(destPath)
  }, Promise.resolve())
})()

