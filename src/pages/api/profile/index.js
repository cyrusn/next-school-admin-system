import {
  getArrayData,
  batchGetSheetDataByRow,
  appendRows,
  batchClearData
} from '@/utils/googleSheet'
import { getSession } from 'next-auth/react'
import { DateTime } from 'luxon'
import { TIMEZONE } from '@/config/constant'

const spreadsheetId = process.env.STUDENT_PROFILE_SSID

const postHandler = async (req, res) => {
  const { row } = req.body // Extract data from the request body
  console.log(row)

  const commentIds = await getArrayData(spreadsheetId, 'comment!A2:A')
  const ids = commentIds.filter((id) => typeof id === 'number')
  const commentId = Math.max(...ids, 0) + 1

  const now = DateTime.now().setZone(TIMEZONE).toFormat("yyyy-MM-dd'T'HH:mm:dd")

  const ranges = [[commentId, ...row, now]]

  try {
    const result = await appendRows(spreadsheetId, 'comment!A2:A', ranges) // Call the appendRow function
    res.status(200).json(result) // Send back the response
  } catch (error) {
    res.status(500).json({ error }) // Handle errors
  }
}

const deleteHandler = async (req, res) => {
  const { id } = req.query

  if (!id) return res.status(404).json({ message: 'Required: invalid id' })

  const commentIds = await getArrayData(spreadsheetId, 'comment!A2:A')
  const index = commentIds.indexOf(parseInt(id))
  const rowNo = index !== -1 ? index + 2 : -1
  if (rowNo === -1) {
    throw new Error(`id: ${id} not found`)
  }

  try {
    const ranges = [`'comment'!${rowNo}:${rowNo}`]
    const result = await batchClearData(spreadsheetId, ranges)
    res.status(200).json(result)
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    res.status(500).json({ error })
  }
}

const getHandler = async (req, res) => {
  try {
    const regnos = req.query.regnos?.split(',')
    if (!regnos.length) {
      throw new Error('invalid regnos')
    }

    const regnosData = await getArrayData(spreadsheetId, 'comment!B2:B')
    const rowNos = []
    regnosData.forEach((regno, n) => {
      const rowNo = n + 2
      if (regnos.includes(String(regno))) {
        rowNos.push(rowNo)
      }
    })
    const ranges = rowNos.map((rowNo) => {
      return `comment!A${rowNo}:G${rowNo}`
    })

    const sheetData = await batchGetSheetDataByRow(spreadsheetId, [
      'comment!A1:G1',
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
