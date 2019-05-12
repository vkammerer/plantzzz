const getSubfolders = (folders, folderId) => folders.filter(f => (
  f.parents &&
  f.parents.indexOf(folderId) !== -1
))

const getFoldersFiles = (images, foldersIds) => images.filter(f => (
  f.parents &&
  f.parents.filter(p => foldersIds.indexOf(p) !== -1).length > 0
))

exports.getSubfolders = getSubfolders;
exports.getFoldersFiles = getFoldersFiles;
