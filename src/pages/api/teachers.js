import { getSheetData } from '../../utils/googleSheet'
import { getSession } from 'next-auth/react'
import { getSettings } from '@/utils/settings'

let cachedTeachersMap = {}
let lastFetchMap = {}
const CACHE_DURATION = 1000 * 60 * 10 // 10 minutes

export async function getTeachersData(req = null) {
  const { sid } = req?.query || {}
  const cacheKey = sid || 'default'

  const now = Date.now()
  if (cachedTeachersMap[cacheKey] && now - (lastFetchMap[cacheKey] || 0) < CACHE_DURATION) {
    return cachedTeachersMap[cacheKey]
  }

  const settings = await getSettings(req)
  const spreadsheetId = settings.TEACHER_GOOGLE_SHEET_ID
  const data = await getSheetData(
    spreadsheetId,
    'A1:K',
    (rowNo) => `A${rowNo}:K${rowNo}`
  )

  let substitutionData = []
  try {
    substitutionData = await getSheetData(
      spreadsheetId,
      'substitutionRecord!A:F',
      (rowNo) => `substitutionRecord!A${rowNo}:F${rowNo}`
    )
  } catch (err) {
    console.error('Error fetching substitutionRecord sheet:', err)
  }

  const mergedData = data.map((teacher) => {
    const subRecord = substitutionData.find(
      (sub) => sub.teacher === teacher.initial || sub.teacher === teacher.name
    )
    if (subRecord) {
      return {
        ...teacher,
        base: subRecord.base,
        substitutionNumber: subRecord.substitutionNumber,
        pureSubNumber: subRecord.pureSubNumber,
        pureNegative: subRecord.pureNegative
      }
    }
    return teacher
  })

  cachedTeachersMap[cacheKey] = mergedData
  lastFetchMap[cacheKey] = now

  return mergedData
}

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const data = await getTeachersData(req)
    res.status(200).json(data)
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    res.status(500).json({ error: error.message })
  }
}
