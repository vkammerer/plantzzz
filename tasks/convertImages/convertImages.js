import path from "path";
import { homedir } from "os";

import fs from "fs-extra";
import sharp from "sharp";
import { includes } from "lodash";

const googleDriveRelativePath = "Projects/plantzzz/plants";
const inputFolderPath = path.resolve(homedir(), "Google Drive", googleDriveRelativePath);
const outputFolderPath = path.resolve(__dirname, "../../public/images/plants");
const convertedImagesMetaDir = path.resolve(__dirname, "data");
const convertedImagesMetaPath = path.resolve(convertedImagesMetaDir, "convertedImages.json");

const supportedformats = ["jpg", "jpeg", "png", "webp", "gif", "svg", "tiff"];

const isSupportedFile = file => {
  const extension = file.split(".")[1];
  return !!extension && includes(supportedformats, extension.toLowerCase());
};

const getImagesPaths = dir => {
  const files = fs.readdirSync(dir);
  return files.reduce((acc, fileName) => {
    const thisPath = `${dir}/${fileName}`;
    if (fs.lstatSync(`${thisPath}`).isDirectory()) {
      acc.push(...getImagesPaths(`${thisPath}`));
    } else if (isSupportedFile(fileName)) {
      const relativeDir = dir.replace(inputFolderPath, "");
      acc.push({ dir: relativeDir, fileName });
    }
    return acc;
  }, []);
};

(async () => {
  const imagesMeta = getImagesPaths(inputFolderPath);
  await imagesMeta.reduce(async (p, { dir, fileName }) => {
    await p;
    const inputDir = `${inputFolderPath}${dir}`;
    const outputDir = `${outputFolderPath}${dir}`;
    await fs.ensureDir(outputDir);
    return sharp(`${inputDir}/${fileName}`)
      .resize(375)
      .rotate()
      .toFile(`${outputDir}/${fileName}`);
  }, Promise.resolve());
  await fs.ensureDir(convertedImagesMetaDir);
  return fs.writeFile(convertedImagesMetaPath, JSON.stringify(imagesMeta), "utf8");
})();
