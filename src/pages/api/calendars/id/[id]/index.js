import { getSession } from 'next-auth/react'
import { getAuth } from '@/lib/googleApiAuth'
import { DateTime } from 'luxon'

import { google } from 'googleapis'
const calendar = google.calendar('v3')
const admin = google.admin('directory_v1')

const auth = await getAuth()

const getHandler = async (req, res) => {
  // https://developers.google.com/workspace/calendar/api/v3/reference/events/list#examples
  const { timeMax, timeMin, id: calendarId, pageToken } = req.query

  const response = await calendar.events.list({
    calendarId,
    auth,
    pageToken,
    timeMin,
    timeMax
  })

  res.status(200).json(response.data)
}
export default async function handler(req, res) {
  const { id: calendarId } = req.query
  const { method } = req

  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    switch (method) {
      case 'GET':
        await getHandler(req, res)
        break
    }
  } catch (error) {
    console.error('Error accessing calendars:', error)
    res.status(500).json({ error })
  }
}
