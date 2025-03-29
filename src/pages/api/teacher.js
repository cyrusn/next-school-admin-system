import { getSheetData } from '../../lib/googleSheet'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const spreadsheetId = process.env.TEACHER_GOOGLE_SHEET_ID
    const data = await getSheetData(spreadsheetId, 'A1:G')
    res.status(200).json(data)
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    res.status(500).json({ message: 'Error accessing Google Sheets' })
  }
}
