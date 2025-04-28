import { getSession } from 'next-auth/react'
import { getAuth } from '@/utils/googleApiAuth'
import { DateTime } from 'luxon'

import { google } from 'googleapis'
const admin = google.admin('directory_v1')

export default async function handler(req, res) {
  const { calendarId } = req.query

  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const auth = await getAuth()

    const response = await admin.resources.calendars.list({
      auth,
      customer: 'my_customer'
    })

    res.status(200).json(response.data)
  } catch (error) {
    console.error('Error accessing calendars:', error)
    res.status(500).json({ error: error.message })
  }
}
