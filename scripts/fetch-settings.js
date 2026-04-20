const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

async function fetchSettings() {
  const keyPath = path.join(process.cwd(), '.env.key.json');
  if (!fs.existsSync(keyPath)) {
    console.warn('No .env.key.json found, skipping settings fetch.');
    return;
  }

  const auth = new google.auth.JWT({
    keyFile: keyPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    subject: 'schooladmin@liping.edu.hk'
  });
  
  const sheets = google.sheets({ version: 'v4', auth });
  
  // You need the SPREADSHEET_ID here. If it's no longer in .env, we can hardcode it or read it.
  // We can hardcode the ID since it was just migrated to this specific sheet.
  const spreadsheetId = '198jZ6FZDHILYohToAfYd_dunPck-OS7tbwdzqyVvYuE';

  try {
    console.log('Fetching settings from Google Sheets at startup...');
    const settingData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'setting!A:B',
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING'
    });

    const rows = settingData.data.values || [];
    const settings = {};
    
    rows.forEach(row => {
      if (row[0]) {
        settings[row[0]] = row[1];
      }
    });

    const outputPath = path.join(process.cwd(), 'src', 'config', 'settings.json');
    fs.writeFileSync(outputPath, JSON.stringify(settings, null, 2), 'utf8');
    
    console.log(`Settings successfully saved to ${outputPath}`);
  } catch (error) {
    console.error('Error fetching settings on startup:', error.message);
    // Do not crash the process if the file already exists, but if it doesn't, it might cause issues later.
    if (!fs.existsSync(path.join(process.cwd(), 'src', 'config', 'settings.json'))) {
        fs.writeFileSync(path.join(process.cwd(), 'src', 'config', 'settings.json'), JSON.stringify({}, null, 2), 'utf8');
    }
  }
}

fetchSettings();