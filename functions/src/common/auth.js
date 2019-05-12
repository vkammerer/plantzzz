const { google } = require('googleapis');

const credentials = require('../../secrets/credentials_god');

exports.getJwt = () => {
  return new google.auth.JWT(
    credentials.client_email, null, credentials.private_key,
    [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive'
    ]
  );
}
