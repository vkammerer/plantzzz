const fs = require('fs-extra');
const path = require('path');

const functions = require('firebase-functions');
const { google } = require('googleapis');
const { tmpdir } = require('os');
const { join, dirname } = require('path');

const { admin } = require('./common/admin');
const { getJwt } = require('./common/auth');
const { getSubfolders, getFoldersFiles } = require('./common/utils');

const auth = getJwt();
const drive = google.drive({version: 'v3', auth});
const bucket = admin.storage().bucket();

const getDriveFilesMeta = ()  => new Promise((resolve, reject) => {
  drive.files.list({
    pageSize: 1000,
    fields: 'files(id, mimeType, parents, name, webContentLink)',
  }, (err, result) => {
    if (err) return reject(err);
    return resolve(result.data.files);
  });
})

const getItemsFromDriveMeta = files => {
  const images = files.filter(f => f.mimeType.indexOf('image/') === 0);
  const folders = files.filter(f => f.mimeType === 'application/vnd.google-apps.folder');
  const spreadsheets = files.filter(f => f.mimeType === 'application/vnd.google-apps.spreadsheet');
  const rootFolder = folders.find(f => typeof f.parents === 'undefined');
  if (!rootFolder) return { error: 'No root folder found'};
  const rootFolders = getSubfolders(folders, rootFolder.id);
  const plantsFolder = rootFolders.find(f => f.name === 'plants');
  if (!plantsFolder) return { error: 'No plants folder found'};
  const plantsFolders = getSubfolders(folders, plantsFolder.id);
  const plantsFoldersAugmented = plantsFolders.map(f => {
    const subfoldersIds = getSubfolders(folders, f.id).map(f => f.id);
    const allFoldersIds = [f.id, ...subfoldersIds];
    return {
      botanicalName: f.name,
      images: getFoldersFiles(images, allFoldersIds).map(i => ({
        id: i.id,
        path: i.parents.indexOf(f.id) === -1 ? `${f.name}/wikimedia` : f.name,
        name: i.name,
        webContentLink: i.webContentLink.replace('export=download', 'export=view'),
      }))
    };
  })
  return plantsFoldersAugmented;
}

const downloadFromDrive = image => new Promise(async (resolve, reject) => {
  const workingDir = join(tmpdir(), 'thumbs');
  const localPath = join(workingDir, image.name);

  await fs.ensureDir(workingDir);
  const dest = fs.createWriteStream(localPath);

  drive.files.get(
    { fileId: image.id, alt: 'media' },
    {responseType: 'stream'},
    (err, res) => {
      if (err) reject(err);
      res.data
        .on('end', () => resolve({ localPath, image }))
        .on('error', err => reject(err))
        .pipe(dest);
    }
  );
});

const uploadToStorage = ({ localPath, image }) => bucket.upload(localPath, {
  destination: `/drive/375/${image.path}/${image.name}`
});

const treatFiles = (startIndex, endIndex) => new Promise(async (resolve, reject) => {
  try {
    const driveFilesMeta = await getDriveFilesMeta();
    const driveItems = getItemsFromDriveMeta(driveFilesMeta);
    const allImages = driveItems.reduce((acc, i) => {
      acc.push(...i.images);
      return acc;
    }, []);
    await allImages.slice(startIndex, endIndex).reduce(async (p, img) => {
      await p;
      const testLocalFile = await downloadFromDrive(img);
      return await uploadToStorage(testLocalFile);
    }, Promise.resolve());
    return resolve({ allGood: true });
  }
  catch (err) {
    return reject(err);
  }
});

exports.syncFiles = functions.https.onRequest(async (req, res) => {
  const startIndex = parseInt(req.query.start);
  const endIndex = parseInt(req.query.end);
  if (isNaN(startIndex) || isNaN(endIndex)) {
    return res.json({ err: 'Invalid arguments' })
  }
  return treatFiles(startIndex, endIndex)
    .then(result => res.json(result))
    .catch(err => res.send({ err }))
});

treatFiles(0, 2);
