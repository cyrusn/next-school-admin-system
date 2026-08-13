import { convertRowsToCollection } from '@/lib/helper'
import { getSession } from 'next-auth/react'
import { groupBy } from 'lodash'

import { google } from 'googleapis'
import { getAuth } from '@/utils/googleApiAuth'
import { getSettings } from '@/utils/settings'
const sheets = google.sheets('v4')

let cachedTimetablesMap = {}
let lastFetchMap = {}
const CACHE_DURATION = 1000 * 60 * 10 // 10 minutes

export default async function handler(req, res) {
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { sid } = req.query
  const cacheKey = sid || 'default'

  const now = Date.now()
  if (cachedTimetablesMap[cacheKey] && now - (lastFetchMap[cacheKey] || 0) < CACHE_DURATION) {
    return res.status(200).json(cachedTimetablesMap[cacheKey])
  }

  try {
    const settings = await getSettings(req)
    const spreadsheetId = settings.TIMETABLE_SSID
    const auth = await getAuth()
    const ranges = [
      '1st_teacher!A1:FS',
      '1st_class!A1:FO',
      '1st_location!A1:FG',
      '2nd_teacher!A1:FS',
      '2nd_class!A1:FO',
      '2nd_location!A1:FG'
    ]
    const response = await sheets.spreadsheets.values.batchGet({
      auth,
      spreadsheetId,
      ranges,
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING'
    })

    const valueRanges = response?.data?.valueRanges || {}

    const timetables = ranges.reduce((prev, r) => {
      const key = r.split('!')[0]
      const found = valueRanges.find(({ range }) => range.includes(key))

      const values = found?.values || []

      prev[key] = convertRowsToCollection(values)
      return prev
    }, {})

    cachedTimetablesMap[cacheKey] = timetables
    lastFetchMap[cacheKey] = now

    res.status(200).json(timetables)
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    res.status(500).json({ error: error.message })
  }
}
