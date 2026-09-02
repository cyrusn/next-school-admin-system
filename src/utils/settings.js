import fs from 'fs'
import path from 'path'
import { getSession } from 'next-auth/react'
import { google } from 'googleapis'
import { getAuth } from '@/utils/googleApiAuth'

let cachedSettings = null;

export function clearSettingsCache() {
  cachedSettings = null;
}

// Function to fetch settings from the local JSON file.
// This file is generated at startup by scripts/fetch-settings.js
export async function getSettings(req) {
  let defaultSettings = cachedSettings;
  if (!defaultSettings) {
    try {
      const settingsPath = path.join(process.cwd(), 'src', 'config', 'settings.json')
      const fileContents = fs.readFileSync(settingsPath, 'utf8')
      defaultSettings = JSON.parse(fileContents)
      cachedSettings = defaultSettings
    } catch (error) {
      console.error('Error reading settings.json:', error)
      defaultSettings = {}
    }
  }

  if (req) {
    const { sid } = req.query
    if (sid) {
      const session = await getSession({ req })
      if (session?.user?.email) {
        const username = session.user.email.split('@')[0].toLowerCase()
        const superAdmins = (defaultSettings?.SUPERADMIN || '')
          .split(',')
          .map((s) => s.trim().toLowerCase())

        if (superAdmins.includes(username)) {
          try {
            const auth = await getAuth()
            const sheets = google.sheets({ version: 'v4', auth })
            const response = await sheets.spreadsheets.values.batchGet({
              spreadsheetId: sid,
              ranges: ['settings!A:B', 'homebase!A:C'],
              valueRenderOption: 'UNFORMATTED_VALUE',
              dateTimeRenderOption: 'FORMATTED_STRING'
            })

            const valueRanges = response.data.valueRanges || []
            const settingsData = valueRanges[0]?.values || []
            const dynamicSettings = {}
            settingsData.forEach(row => {
              if (row[0]) {
                dynamicSettings[row[0]] = row[1]
              }
            })

            if (dynamicSettings && Object.keys(dynamicSettings).length > 0) {
              // Inject SUPERADMIN and cohort keys from defaultSettings so frontend logic persists
              dynamicSettings.SUPERADMIN = defaultSettings.SUPERADMIN || ''
              dynamicSettings.DEFAULT_SCHOOL_YEAR = defaultSettings.SCHOOL_YEAR || ''
              Object.keys(defaultSettings).forEach((key) => {
                if (
                  key.startsWith('COHORT_SETTINGS_GOOGLE_SHEET_ID_') ||
                  key.startsWith('PREVIOUS_COHORT_SETTINGS_GOOGLE_SHEET_ID_')
                ) {
                  dynamicSettings[key] = defaultSettings[key]
                }
              })

              const homebaseData = valueRanges[1]?.values || []
              const homebases = { 1: {}, 2: {} }
              homebaseData.forEach((row, index) => {
                if (index === 0) return // skip header row
                const [classcode, term1, term2] = row
                if (classcode) {
                  homebases[1][classcode] = String(term1 || '')
                  homebases[2][classcode] = String(term2 || '')
                }
              })
              dynamicSettings.HOMEBASES = homebases
              return dynamicSettings
            }
          } catch (err) {
            console.error('Error fetching dynamic settings from sid:', sid, err)
          }
        }
      }
    }
  }

  return defaultSettings
}
