import { getSheetData } from '@/utils/googleSheet'
import { getSession } from 'next-auth/react'
import { getSettings } from '@/utils/settings'

export default async function handler(req, res) {
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const settings = await getSettings()
    const spreadsheetId = settings.STUDENT_PROFILE_SSID
    const data = await getSheetData(
      spreadsheetId,
      'privileges!A:C',
      (rowNo) => `A${rowNo}:C${rowNo}`
    )
    res.status(200).json(data)
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    res.status(500).json({ error })
  }
}
