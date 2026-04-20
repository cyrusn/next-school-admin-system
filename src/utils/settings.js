import fs from 'fs'
import path from 'path'

let cachedSettings = null;

// Function to fetch settings from the local JSON file.
// This file is generated at startup by scripts/fetch-settings.js
export async function getSettings() {
  if (cachedSettings) {
    return cachedSettings;
  }

  try {
    const settingsPath = path.join(process.cwd(), 'src', 'config', 'settings.json')
    const fileContents = fs.readFileSync(settingsPath, 'utf8')
    cachedSettings = JSON.parse(fileContents)
    return cachedSettings
  } catch (error) {
    console.error('Error reading settings.json:', error)
    return {}
  }
}
