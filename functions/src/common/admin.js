const admin = require('firebase-admin');

if (process.env.FIREBASE_CONFIG) {
  admin.initializeApp();
}
else {
  const credentials = require('../../secrets/credentials_admin')
  admin.initializeApp({
    credential: admin.credential.cert(credentials),
    storageBucket: "plantzzz.appspot.com"
  });
}

exports.admin = admin;
