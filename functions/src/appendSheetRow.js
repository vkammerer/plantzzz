const functions = require('firebase-functions');
const { google } = require('googleapis');
const { getJwt } = require('./common/auth');

const appendSheetRowOperation = (auth, spreadsheetId, range, row, res) => {
  const sheets = google.sheets({version: 'v4'});
  sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId,
    range: range,
    auth,
    valueInputOption: 'RAW',
    resource: {values: [row]}
  }, (err, result) => {
    if (err) res.json({ err });
    else res.json({ result });
  });
}

exports.appendSheetRow = functions.https.onRequest((req, res) => {
  const auth = getJwt();
  const spreadsheetId = '1G6_VC5nKmioaoLDWLaHZX0zJff19wgrRDi-6bctMJ7k';
  const range = 'A1';
  const row = [new Date(), 'A Cloud Function was here'];
  appendSheetRowOperation(auth, spreadsheetId, range, row, res);
});
