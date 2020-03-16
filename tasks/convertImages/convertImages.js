import path from "path";
import { homedir } from "os";

import fs from "fs-extra";
import sharp from "sharp";
import { includes } from "lodash";

const googleDriveRelativePath = "projects/plantzzz/plants/plants_lasc211_sem1_part1";
const inputFolderPath = path.resolve(
  homedir(),
  "Google Drive (scholarshacks@gmail.com)",
  googleDriveRelativePath
);
const outputFolderPath = path.resolve(__dirname, "../../public/images/plants");
const convertedImagesMetaDir = path.resolve(__dirname, "data");
const convertedImagesMetaPath = path.resolve(convertedImagesMetaDir, "convertedImages.json");

const supportedformats = ["jpg", "jpeg", "png", "webp", "gif", "svg", "tiff"];

const isSupportedFile = file => {
  const splitFile = file.split(".");
  const extension = splitFile[splitFile.length - 1];
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
    const supportedWidths = [750];
    await supportedWidths.reduce(async (p, w) => {
      const outputDir = `${outputFolderPath}/${w.toString()}${dir}`;
      await p;
      await fs.ensureDir(outputDir);
      return sharp(`${inputDir}/${fileName}`)
        .resize(w)
        .rotate()
        .toFile(`${outputDir}/${fileName}`)
        .catch(err => console.error(err, `${inputDir}/${fileName}`));
    }, Promise.resolve());
  }, Promise.resolve());
  await fs.ensureDir(convertedImagesMetaDir);
  return fs.writeFile(convertedImagesMetaPath, JSON.stringify(imagesMeta), "utf8");
})();
