import { getSheetData } from '../../utils/googleSheet'
import { getSession } from 'next-auth/react'
import { getSettings } from '@/utils/settings'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) {
    new Error('Unauthorized')
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const settings = await getSettings()
    const spreadsheetId = settings.TEACHER_GOOGLE_SHEET_ID
    const data = await getSheetData(
      spreadsheetId,
      'A1:I',
      (rowNo) => `A${rowNo}:I${rowNo}`
    )
    res.status(200).json(data)
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    res.status(500).json({ error: error.message })
  }
}
