import { convertRowsToCollection } from '@/lib/helper'
import { getSession } from 'next-auth/react'
import { groupBy } from 'lodash'

import { google } from 'googleapis'
import { getAuth } from '@/utils/googleApiAuth'
const sheets = google.sheets('v4')

export default async function handler(req, res) {
  const spreadsheetId = process.env.TIMETABLE_SSID
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const auth = await getAuth()
    const ranges = [
      '1st_teacher!A1:FS',
      '1st_class!A1:FO',
      '1st_location!A1:DS',
      '2nd_teacher!A1:FS',
      '2nd_class!A1:FO',
      '2nd_location!A1:DS'
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
    res.status(200).json(timetables)
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    res.status(500).json({ error: error.message })
  }
}
