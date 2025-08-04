// Add event, Get events
import { getSession } from 'next-auth/react'
import {
  appendRows,
  getSheetData,
  batchUpdateSpreadsheet
} from '@/utils/googleSheet'
const spreadsheetId = process.env.ECA_EVALUATION_SSID

export const putHandler = async (req, res) => {
  try {
    const { rangeObjects } = req.body
    const headerKeys = [
      'timestampid',
      'clubId',
      'category',
      'information',
      'regno',
      'classcodeAndNo',
      'studentName',
      'grade',
      'role',
      'isNominated',
      'pic',
      'associates',
      'admininstrators'
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
    const response = await appendRows(spreadsheetId, 'record!A1:A1', rows)
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
      'record!A:N',
      function (rowNo) {
        return `record!A${rowNo}:N${rowNo}`
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
