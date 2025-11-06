import {
  getSheetData,
  batchGetSheetDataByRow,
  appendRows,
  batchClearData
} from '@/utils/googleSheet'
import { getSession } from 'next-auth/react'
import { DateTime } from 'luxon'

const spreadsheetId = process.env.ANNOUNCEMENT_GOOGLE_SHEET_ID

const postHandler = async (req, res) => {
  const { range, values } = req.body // Extract data from the request body
  if (!range) {
    return res.status(404).json({ error: 'Required: range value' })
  }

  try {
    const result = await appendRows(spreadsheetId, range, values) // Call the appendRow function
    res.status(200).json(result) // Send back the response
  } catch (error) {
    res.status(500).json({ error }) // Handle errors
  }
}

const deleteHandler = async (req, res) => {
  const range = req.query.range
  if (!range) return res.status(404).json({ message: 'Required: range value' })

  try {
    const result = await batchClearData(spreadsheetId, range)
    res.status(200).json(result)
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    res.status(500).json({ error })
  }
}

const getHandler = async (req, res) => {
  try {
    const announceDates = await getSheetData(spreadsheetId, 'B1:B')
    const { start_date } = req.query // in yyyy-MM-dd format

    const zone = 'Asia/Hong_Kong'
    const dateFormat = 'yyyy-MM-dd'

    // filter the events after today
    const now = DateTime.now().setZone(zone)

    const startDate = start_date
      ? DateTime.fromISO(start_date).setZone(zone)
      : now

    const weekday = now.weekday
    const days = 6 - weekday
    const beforeNextFriday = startDate.plus({ weeks: 1, days })

    const ranges = announceDates
      .reduce((prev, { date }, index) => {
        const rowNo = index + 2

        const eventDate = DateTime.fromISO(date).setZone(zone)

        if (eventDate <= beforeNextFriday && eventDate >= startDate) {
          prev.push(rowNo)
        }
        return prev
      }, [])
      .map((rowNo) => {
        return `A${rowNo}:I${rowNo}`
      })
    const sheetData = await batchGetSheetDataByRow(spreadsheetId, [
      'A1:I1',
      ...ranges
    ])

    const data = sheetData.filter(({ skip }) => !skip)

    res.status(200).json(data)
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    res.status(500).json({ error })
  }
}

export default async function handler(req, res) {
  const { method } = req
  const body = { ...req.body }
  delete req.body
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  switch (method) {
    case 'GET':
      await getHandler(req, res)
      break
    case 'POST':
      req.body = body
      await postHandler(req, res)
      break
    case 'DELETE':
      await deleteHandler(req, res)
      break
    default:
      await getHandler(req, res)
  }
}
