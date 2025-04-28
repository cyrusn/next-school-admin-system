import { getSession } from 'next-auth/react'
import { getAuth } from '@/utils/googleApiAuth'
import { DateTime } from 'luxon'

import { google } from 'googleapis'
//const admin = google.admin('directory_v1')
const calendar = google.calendar('v3')

export default async function handler(req, res) {
  const body = { ...req.body }

  delete req.body
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { timeMin, timeMax, items } = body

  try {
    const auth = await getAuth()
    const requestBody = {
      timeMin,
      timeMax,
      items,
      calendarExpansionMax: 50
    }
    const response = await calendar.freebusy.query({
      auth,
      requestBody
    })

    res.status(200).json(response.data.calendars)
  } catch (error) {
    console.error('Error accessing calendars:', error)
    res.status(500).json({ error: error.message })
  }
}
