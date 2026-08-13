import { getSheetData } from '../../utils/googleSheet'
import { getSession } from 'next-auth/react'
import { getSettings } from '@/utils/settings'

let cachedTeachersMap = {}
let lastFetchMap = {}
const CACHE_DURATION = 1000 * 60 * 10 // 10 minutes

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) {
    new Error('Unauthorized')
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { sid } = req.query
  const cacheKey = sid || 'default'

  const now = Date.now()
  if (cachedTeachersMap[cacheKey] && now - (lastFetchMap[cacheKey] || 0) < CACHE_DURATION) {
    return res.status(200).json(cachedTeachersMap[cacheKey])
  }

  try {
    const settings = await getSettings(req)
    const spreadsheetId = settings.TEACHER_GOOGLE_SHEET_ID
    const data = await getSheetData(
      spreadsheetId,
      'A1:J',
      (rowNo) => `A${rowNo}:J${rowNo}`
    )

    cachedTeachersMap[cacheKey] = data
    lastFetchMap[cacheKey] = now

    res.status(200).json(data)
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    res.status(500).json({ error: error.message })
  }
}
