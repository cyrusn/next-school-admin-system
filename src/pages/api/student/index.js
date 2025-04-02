import { getSheetData } from '@/lib/googleSheet'
import { convertRowsToCollection } from '@/lib/helper'
import { getSession } from 'next-auth/react'
import { DateTime } from 'luxon'

const spreadsheetId = process.env.STUDENT_GOOGLE_SHEET_ID

export default async function handler(req, res) {
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    const studentData = await getSheetData(spreadsheetId, 'A1:I')

    res.status(200).json(studentData.filter(({ isSkip }) => !isSkip))
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    res.status(500).json({ message: 'Error accessing Google Sheets' })
  }
}
