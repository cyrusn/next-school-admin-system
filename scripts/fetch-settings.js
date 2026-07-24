const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const util = require('util');

function loadEnv() {
  const isProd = process.env.NODE_ENV === 'production' || 
                 process.env.npm_lifecycle_event === 'build' || 
                 process.env.npm_lifecycle_event === 'start';

  const envFiles = [
    '.env',
    isProd ? '.env.production' : '.env.development',
    '.env.local',
    isProd ? '.env.production.local' : '.env.development.local',
  ];

  const loadedEnv = {};

  for (const file of envFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const match = trimmed.match(/^([^=]+)=(.*)$/);
            if (match) {
              const key = match[1].trim();
              let value = match[2].trim();
              if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.substring(1, value.length - 1);
              }
              loadedEnv[key] = value;
            }
          }
        }
      } catch (err) {
        console.warn(`Failed to read/parse env file ${file}: ${err.message}`);
      }
    }
  }

  for (const [key, value] of Object.entries(loadedEnv)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

// Load environment variables before doing anything else
loadEnv();

const customFetch = (input, init) => {
  if (init && init.body && !init.duplex) {
    init.duplex = 'half';
  }
  return globalThis.fetch(input, init);
};

async function retry(fn, attempts = 3, delayMs = 1000) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const isLast = i === attempts - 1;
      if (isLast) break;
      const wait = delayMs * Math.pow(2, i);
      console.warn(`Attempt ${i + 1} failed: ${err.message}. Retrying in ${wait}ms...`);
      await new Promise((res) => setTimeout(res, wait));
    }
  }
  throw lastErr;
}

async function fetchSettings() {
  const keyPath = path.join(process.cwd(), '.env.key.json');
  if (!fs.existsSync(keyPath)) {
    console.warn('No .env.key.json found, skipping settings fetch.');
    return;
  }

  const auth = new google.auth.JWT({
    keyFile: keyPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    subject: 'schooladmin@liping.edu.hk',
    transporterOptions: {
      fetchImplementation: customFetch
    }
  });

  // Try to authorize (fetch token) with retries to handle transient network issues
  try {
    await retry(() => util.promisify(auth.authorize.bind(auth))(), 3, 1000);
  } catch (err) {
    console.error('Error authorizing Google JWT:', err);
    // Ensure settings file exists so the app can still start
    const settingsPath = path.join(process.cwd(), 'src', 'config', 'settings.json');
    if (!fs.existsSync(settingsPath)) {
      fs.writeFileSync(settingsPath, JSON.stringify({}, null, 2), 'utf8');
    }
    return;
  }

  const sheets = google.sheets({ version: 'v4', auth });

  // You need the SPREADSHEET_ID here. If it's no longer in .env, we can hardcode it or read it.
  // We can hardcode the ID since it was just migrated to this specific sheet.
  const spreadsheetId = process.env.SETTINGS_GOOGLE_SHEET_ID;

  try {
    console.log('Fetching settings from Google Sheets at startup...');
    const settingData = await retry(() => sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'setting!A:B',
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING'
    }), 3, 1000);

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
    // Log full error object to capture stack + underlying cause (e.g., premature close)
    console.error('Error fetching settings on startup:', error);
    // Do not crash the process if the file already exists, but if it doesn't, create an empty placeholder
    const settingsPath = path.join(process.cwd(), 'src', 'config', 'settings.json');
    if (!fs.existsSync(settingsPath)) {
      fs.writeFileSync(settingsPath, JSON.stringify({}, null, 2), 'utf8');
    }
  }
}

fetchSettings();
