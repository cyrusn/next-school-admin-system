import { getSession } from 'next-auth/react'
import { getAuth } from '@/lib/googleApiAuth'
import { DateTime } from 'luxon'

import { google } from 'googleapis'
const calendar = google.calendar('v3')
const admin = google.admin('directory_v1')

export default async function handler(req, res) {
  const { id: calendarId } = req.query

  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const auth = await getAuth()
    const response = await calendar.events.list({
      auth,
      calendarId,
      timeMax: '2025-05-15T00:00:00.000+08:00',
      timeMin: '2025-05-01T00:00:00.000+08:00'
    })

    //const response = await admin.resources.calendars.list({
    //  auth,
    //  customer: 'my_customer'
    //})
    //const response = await calendar.calendarList.list({ auth })

    res.status(200).json(response)
  } catch (error) {
    console.error('Error accessing calendars:', error)
    res.status(500).json({ error: error.message })
  }
}
