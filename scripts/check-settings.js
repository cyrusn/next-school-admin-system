const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

function parseEnv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.trim() && !line.startsWith('#')) {
      const match = line.match(/^([^=]+)=(.+)$/);
      if (match) {
        let key = match[1].trim();
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.substring(1, value.length - 1);
        }
        env[key] = value;
      }
    }
  }
  return env;
}

async function getAuth(env) {
  const keyPath = path.join(process.cwd(), env.GOOGLE_API_KEY_FILENAME);
  const auth = new google.auth.JWT({
    keyFile: keyPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    subject: 'schooladmin@liping.edu.hk'
  });
  return auth;
}

async function checkSettings() {
  const env = parseEnv('.env.development');
  const spreadsheetId = env.SETTINGS_GOOGLE_SHEET_ID;
  
  try {
    const auth = await getAuth(env);
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:B',
    });

    console.log('Values in Google Sheet:');
    console.log(response.data.values);
  } catch (error) {
    console.error('Error reading settings:', error.message);
  }
}

checkSettings();