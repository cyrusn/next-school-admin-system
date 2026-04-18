import { getSheetKeyValueData } from '@/utils/googleSheet'

let cachedSettings = null
let lastFetched = 0
const CACHE_DURATION = 1000 * 60 * 5 // 5 minutes

export async function getSettings() {
  const now = Date.now()
  if (cachedSettings && now - lastFetched < CACHE_DURATION) {
    return cachedSettings
  }

  try {
    const spreadsheetId = process.env.SETTINGS_GOOGLE_SHEET_ID
    const data = await getSheetKeyValueData(spreadsheetId, 'setting!A:B')
    cachedSettings = data
    lastFetched = now
    return data
  } catch (error) {
    console.error('Error fetching settings:', error)
    // Return cached settings even if expired if fetch fails, or empty object
    return cachedSettings || {}
  }
}
