import { convertRowsToCollection } from '@/lib/helper'
import { getSession } from 'next-auth/react'
import { groupBy } from 'lodash'

import { google } from 'googleapis'
import { getAuth } from '@/utils/googleApiAuth'
import { getSettings } from '@/utils/settings'
const sheets = google.sheets('v4')

let cachedStudentsMap = {}
let lastFetchMap = {}
const CACHE_DURATION = 1000 * 60 * 10 // 10 minutes

export async function getStudentsData(req) {
  const { sid } = req.query
  const cacheKey = sid || 'default'

  const now = Date.now()
  if (cachedStudentsMap[cacheKey] && now - (lastFetchMap[cacheKey] || 0) < CACHE_DURATION) {
    return cachedStudentsMap[cacheKey]
  }

  const settings = await getSettings(req)
  const spreadsheetId = settings.STUDENT_GOOGLE_SHEET_ID
  const auth = await getAuth()
  const ranges = ['students!A1:X', 'groups!A1:G']
  const response = await sheets.spreadsheets.values.batchGet({
    auth,
    spreadsheetId,
    ranges,
    valueRenderOption: 'UNFORMATTED_VALUE',
    dateTimeRenderOption: 'FORMATTED_STRING'
  })

  const valueRanges = response?.data?.valueRanges || {}
  const studentRowValues =
    valueRanges.find(({ range }) => range.includes('students'))?.values || []
  const groupRowValues =
    valueRanges.find(({ range }) => range.includes('groups'))?.values || []

  const students = convertRowsToCollection(studentRowValues)
  const groups = convertRowsToCollection(groupRowValues)
  const groupsbyRegno = groupBy(groups, 'regno')

  const schoolYear = settings.SCHOOL_YEAR ? parseInt(settings.SCHOOL_YEAR, 10) : new Date().getFullYear()
  const thresholdDate = new Date(schoolYear - 1, 8, 1) // September 1st of (schoolYear - 1)

  const studentData = students.map((s, index) => {
    const groups_ = groupsbyRegno[s.regno] || []
    const rowNo = index + 2
    s.range = `students!A${rowNo}:X${rowNo}`
    s.groups = groups_.map(({ groupName }) => groupName)

    // Calculate isNewlyArrived dynamically from firstArrivedDate and thresholdDate
    let isNewlyArrived = false
    if (s.firstArrivedDate) {
      const dateParts = String(s.firstArrivedDate).split('-')
      if (dateParts.length === 3) {
        const yr = parseInt(dateParts[0], 10)
        const mo = parseInt(dateParts[1], 10) - 1
        const dy = parseInt(dateParts[2], 10)
        const arrivedDate = new Date(yr, mo, dy)
        isNewlyArrived = arrivedDate > thresholdDate
      } else {
        const arrivedDate = new Date(s.firstArrivedDate)
        if (!isNaN(arrivedDate.getTime())) {
          isNewlyArrived = arrivedDate > thresholdDate
        }
      }
    }
    if (s.schFromType === '中學' || s.schFromType === '小學') {
      isNewlyArrived = false
    }
    s.isNewlyArrived = isNewlyArrived

    // Calculate isNcs dynamically from homeLanguage. If homeLanguage is not 'CHI', isNcs is true.
    s.isNcs = s.homeLanguage ? String(s.homeLanguage).trim().toUpperCase() !== 'CHI' : false

    // Calculate isSen dynamically from senType. If senType is present and not empty, isSen is true.
    s.isSen = s.senType ? String(s.senType).trim() !== '' : false

    return s
  })

  cachedStudentsMap[cacheKey] = studentData
  lastFetchMap[cacheKey] = now

  return studentData
}

export default async function handler(req, res) {
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const studentData = await getStudentsData(req)
    res.status(200).json(studentData)
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    res.status(500).json({ error: 'Error accessing Google Sheets' })
  }
}
