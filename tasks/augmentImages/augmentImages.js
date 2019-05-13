import path from "path";

import fs from "fs-extra";
import { endsWith, chunk, flatten } from "lodash";
import fetch from "node-fetch";

const wikimediaApiBaseUrl =
  "https://commons.wikimedia.org/w/api.php?origin=*&format=json&action=query&prop=imageinfo&iiprop=url|dimensions|mime|extmetadata";
const convertedImagesMetaPath = path.resolve(
  __dirname,
  "../convertImages/data/convertedImages.json",
);
const augmentedImagesMetaDir = path.resolve(__dirname, "data");
const augmentedImagesMetaPath = path.resolve(augmentedImagesMetaDir, "augmentedImages.json");

const getAll = fileNames => {
  const chunks = chunk(fileNames, 50);
  return Promise.all(chunks.map(names => getFilesWikiMeta(names))).then(a => flatten(a));
};

export const getFilesWikiMeta = fileNames => {
  const titlesParam = ["", ...fileNames].join("|Image:").substring(1);
  return fetch(encodeURI(`${wikimediaApiBaseUrl}&titles=${titlesParam}`).replace(/VVVV/g, "%26"))
    .then(r => r.json())
    .then(payload => {
      if (!payload.query) return [];
      return Object.values(payload.query.pages).map(p => {
        if (!p.imageinfo) {
          console.log(`No data found for: ${p.title}`, p);

          return {};
        }
        return {
          fileName: p.imageinfo[0].url.split("/").pop(),
          extmetadata: p.imageinfo[0].extmetadata,
        };
      });
    });
};

(async () => {
  const convertedImagesMeta = JSON.parse(fs.readFileSync(convertedImagesMetaPath, "utf8"));
  const wikimediaFiles = convertedImagesMeta
    .filter(f => endsWith(f.dir, "/wikimedia"))
    .map(f => f.fileName.replace("&", "VVVV"));
  const meta = await getAll(wikimediaFiles);
  const augmentedImagesMeta = convertedImagesMeta.map(f => {
    if (!endsWith(f.dir, "/wikimedia")) return f;
    const fileMeta = meta.find(metaF => {
      return metaF.fileName === f.fileName;
    });
    if (!fileMeta) return f;
    return {
      ...f,
      extmetadata: fileMeta.extmetadata,
    };
  });
  await fs.ensureDir(augmentedImagesMetaDir);
  return fs.writeFile(augmentedImagesMetaPath, JSON.stringify(augmentedImagesMeta), "utf8");
})();
