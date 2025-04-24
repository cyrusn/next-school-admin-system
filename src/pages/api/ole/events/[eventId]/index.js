// Add event, Get events
import { getSession } from 'next-auth/react'
import { getAuth } from '@/lib/googleApiAuth'
import {
  getSheetData,
  batchGetSheetDataByColumn,
  batchGetSheetDataByRow,
  batchUpdateSpreadsheet
} from '@/lib/googleSheet'
const { OLE_GOOGLE_SHEET_ID } = process.env

export const putHandler = async (req, res) => {
  try {
    const { rowObjects } = req.body
    const totalUpdatedRows = await batchUpdateSpreadsheet(
      OLE_GOOGLE_SHEET_ID,
      'events!A1:O1',
      rowObjects
    )
    res.status(200).json({ totalUpdatedRows })
  } catch (error) {
    console.error('Error accessing Spreadsheet:', error)
    res.status(500).json({ error: error.message })
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
      //await getHandler(req, res)
      break
    case 'POST':
      //req.body = body
      //await postHandler(req, res)
      break
    case 'PUT':
      req.body = body
      await putHandler(req, res)
      break
    case 'DELETE':
      //await deleteHandler(req, res)
      break
    default:
    //await getHandler(req, res)
  }
}
