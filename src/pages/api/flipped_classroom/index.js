import { getSheetData } from '@/utils/googleSheet'
import { getSession } from 'next-auth/react'

const spreadsheetId = process.env.FLIPPED_CLASSROOM_SSID

const getHandler = async (req, res) => {
  try {
    const { sd } = req.query
    const data = await getSheetData(
      spreadsheetId,
      'A1:J',
      (rowNo) => `A${rowNo}:J${rowNo}`
    )
    data.shift()

    const result = data
      .filter((v) => v.subjectOrDepartment == sd)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))

    res.status(200).json(result)
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    res.status(500).json({ error })
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  await getHandler(req, res)
}
