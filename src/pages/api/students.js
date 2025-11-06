import { convertRowsToCollection } from '@/lib/helper'
import { getSession } from 'next-auth/react'
import { groupBy } from 'lodash'

import { google } from 'googleapis'
import { getAuth } from '@/utils/googleApiAuth'
const sheets = google.sheets('v4')
const spreadsheetId = process.env.STUDENT_GOOGLE_SHEET_ID

export default async function handler(req, res) {
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const auth = await getAuth()
    const ranges = ['students!A1:T', 'groups!A1:G']
    const response = await sheets.spreadsheets.values.batchGet({
      auth,
      spreadsheetId,
      ranges,
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING'
    })

    const valueRanges = response?.data?.valueRanges || {}
    // res.status(200).json(valueRanges)
    const studentRowValues =
      valueRanges.find(({ range }) => range.includes('students'))?.values || []
    const groupRowValues =
      valueRanges.find(({ range }) => range.includes('groups'))?.values || []

    const students = convertRowsToCollection(studentRowValues)
    const groups = convertRowsToCollection(groupRowValues)
    const groupsbyRegno = groupBy(groups, 'regno')
    const studentData = students.map((s, index) => {
      const groups_ = groupsbyRegno[s.regno] || []
      const rowNo = index + 2
      s.range = `students!A${rowNo}:T${rowNo}`
      s.groups = groups_.map(({ groupName }) => groupName)
      return s
    })

    // const studentData = await getSheetData(
    //   spreadsheetId,
    //   'A1:R',
    //   (rowNo) => `A${rowNo}:R${rowNo}`
    // )

    res.status(200).json(studentData.filter(({ isSkip }) => !isSkip))
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    res.status(500).json({ error: 'Error accessing Google Sheets' })
  }
}
