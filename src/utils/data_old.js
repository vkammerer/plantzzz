import { flamelinkApp, firebaseApp, storageBaseUri } from '../Store'

const wikimediaApiBaseUrl = 'https://commons.wikimedia.org/w/api.php?origin=*&format=json&action=query&prop=imageinfo&iiprop=url|dimensions|mime|extmetadata';

const getFilesWikiMeta = fileNames => {
  const titlesParam = ['', ...fileNames]
    .map(f => f.split('_').slice(1).join('_'))
    .join('|Image:')
    .substring(1);
  return fetch(`${wikimediaApiBaseUrl}&titles=${titlesParam}`)
    .then(r => r.json())
    .then(payload => {
      if (!payload.query) return [];
      return Object.values(payload.query.pages).map(p => {
        if (!p.imageinfo) return {}
        return {
          name: p.imageinfo[0].url.split('/').pop(),
          extmetadata: p.imageinfo[0].extmetadata
        }
      })
  })
}

const getStorageUrl = fileName => `${storageBaseUri}${fileName}?alt=media`

const getFiles = async () => {
  const firebaseFiles = await firebaseApp.firestore().collection('fl_files')
    .get()
    .then(d => d.docs.map(d => d.data()));
  const fileNames = firebaseFiles.map(f => encodeURI(f.file));
  const filesWikiMeta = await getFilesWikiMeta(fileNames);
  const augmentedFiles = firebaseFiles.map(f => {
    const wikiData = filesWikiMeta.find(fM => encodeURI(f.file).indexOf(fM.name) !== -1);
    return {
      ...f,
      file: getStorageUrl(f.file),
      id: f.id,
      folderId: f.folderId,
      wikiMeta: !!wikiData ? wikiData.extmetadata : null
    }
  });
  return augmentedFiles;
}

const getFolders = async () => {
  const flamelinkFolders = await flamelinkApp.storage.getFolders({fields: ['name', 'id']});
  return Object.values(flamelinkFolders);
}

const getPlants = async () => {
  const flamelinkPlants = await flamelinkApp.content.get({ schemaKey: 'plants', fields: ['botanicalName', 'commonName', 'id'] })
  return !!flamelinkPlants ? Object.values(flamelinkPlants) : [];
}

export const getData = async () => {
  const [files, folders, plantsList] = await Promise.all([
    getFiles(),
    getFolders(),
    getPlants(),
  ]);
  const plants = plantsList.map(p => {
    const plantFolder = folders.find(f => f.name === p.botanicalName);
    const images = files
      .filter(f => f.folderId.id === plantFolder.id)
      .map(f => ({
        ...f,
        file: f.file,
        id: f.id,
        wikiMeta: f.wikiMeta
      }))
    return {
      ...p,
      images
    }
  });
  return plants;
}