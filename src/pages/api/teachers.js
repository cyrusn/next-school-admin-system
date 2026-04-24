import { getSheetData } from '../../utils/googleSheet'
import { getSession } from 'next-auth/react'
import { getSettings } from '@/utils/settings'

let cachedTeachers = null
let lastFetch = 0
const CACHE_DURATION = 1000 * 60 * 10 // 10 minutes

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) {
    new Error('Unauthorized')
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const now = Date.now()
  if (cachedTeachers && now - lastFetch < CACHE_DURATION) {
    return res.status(200).json(cachedTeachers)
  }

  try {
    const settings = await getSettings()
    const spreadsheetId = settings.TEACHER_GOOGLE_SHEET_ID
    const data = await getSheetData(
      spreadsheetId,
      'A1:I',
      (rowNo) => `A${rowNo}:I${rowNo}`
    )

    cachedTeachers = data
    lastFetch = now

    res.status(200).json(data)
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    res.status(500).json({ error: error.message })
  }
}
