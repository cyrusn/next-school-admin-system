// Add event, Get events
import { getSession } from 'next-auth/react'
import { getAuth } from '@/lib/googleApiAuth'
import {
  getSheetData,
  batchGetSheetDataByColumn,
  batchGetSheetDataByRow
} from '@/lib/googleSheet'
const { OLE_GOOGLE_SHEET_ID } = process.env

export default async function handler(req, res) {
  try {
    const session = await getSession({ req, method: 'GET' })
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const { filter } = req.query
    const [type, value] = filter.split(':')

    const filterRanges = ['events!A:A']
    switch (type) {
      case 'pics':
        filterRanges.push('events!F:F')
        break
      case 'components':
        filterRanges.push('events!I:I')
        break
      case 'committeeAndKla':
        filterRanges.push('events!J:J')
        break
    }

    const filterData = await batchGetSheetDataByColumn(
      OLE_GOOGLE_SHEET_ID,
      filterRanges
    )

    const ranges = filterData.reduce((prev, record, index) => {
      const rowNo = index + 2
      if (record[type] == value || record[type].includes(value)) {
        prev.push(`events!A${rowNo}:O${rowNo}`)
      }
      return prev
    }, [])

    const finalRanges = ['events!A1:O1', ...ranges]

    const data = await batchGetSheetDataByRow(OLE_GOOGLE_SHEET_ID, finalRanges)
    res.status(200).json(data)
  } catch (error) {
    console.error('Error accessing calendars:', error)
    res.status(500).json({ error: error.message })
  }
}
