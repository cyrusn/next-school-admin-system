import { getSheetData } from '../../utils/googleSheet'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) {
    new Error('Unauthorized')
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const spreadsheetId = process.env.TEACHER_GOOGLE_SHEET_ID
    const data = await getSheetData(
      spreadsheetId,
      'A1:H',
      (rowNo) => `A${rowNo}:H${rowNo}`
    )
    res.status(200).json(data)
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    res.status(500).json({ error: error.message })
  }
}
