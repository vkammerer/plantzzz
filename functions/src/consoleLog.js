const functions = require('firebase-functions');

exports.consoleLog = functions.https.onRequest((req, res) => {
  console.log(`num: ${req.query.num}`);
  res.send('ok');
});
