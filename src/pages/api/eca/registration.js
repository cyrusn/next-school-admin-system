// Add event, Get events
import { getSession } from 'next-auth/react'
import {
  appendRows,
  getSheetData,
  batchUpdateSpreadsheet
} from '@/utils/googleSheet'
const spreadsheetId = process.env.CLUB_REGISTRATION_SSID

export const putHandler = async (req, res) => {
  try {
    const { rangeObjects } = req.body
    const headerKeys = [
      'clubId',
      'activityType',
      'activityTypeValue',
      'modeType',
      'modeValue',
      'resources',
      'requireRegularAnnoucement',
      'sessionPlan1',
      'sessionPlan2',
      'sessionPlan3',
      'sessionPlan4',
      'sessionPlan5',
      'noOfActivity',
      'fee',
      'isConfirmed',
      'timestamp'
    ]

    const totalUpdatedRows = await batchUpdateSpreadsheet(
      spreadsheetId,
      headerKeys,
      rangeObjects
    )
    res.status(200).json({ totalUpdatedRows })
  } catch (error) {
    console.error('Error accessing Spreadsheet:', error)
    res.status(500).json({ error: error.message })
  }
}

export const postHandler = async (req, res) => {
  try {
    const { rows } = req.body
    const response = await appendRows(spreadsheetId, 'information!A1:A1', rows)
    res.status(200).json({ response })
  } catch (error) {
    console.error('Error accessing Spreadsheet:', error)
    res.status(500).json({ error: error.message })
  }
}

export const getHandler = async (req, res) => {
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const data = await getSheetData(
      spreadsheetId,
      'information!A:P',
      function (rowNo) {
        return `information!A${rowNo}:P${rowNo}`
      }
    )

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
    case 'PUT':
      req.body = body
      await putHandler(req, res)
      break
    case 'DELETE':
      await deleteHandler(req, res)
      break
    default:
      await getHandler(req, res)
  }
}
