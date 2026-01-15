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

  try {
    const auth = await getAuth()
    const today = new Date()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    const calendarId =
      'c_188296g6v8ehahrfln76ougj8m22g@resource.calendar.google.com'
    let timeMax =
      (month < 9 ? year + 2 : year + 1) + '-08-31T00:00:00.000+08:00'

    // Lower bound (exclusive) for an event's end time to filter by.
    let timeMin =
      year + '-' + String(month).padStart(2, 0) + '-01T00:00:00.000+08:00'

    const requestBody = {
      timeMin,
      timeMax
    }
    // const q = ''
    const q = 'lpcyn@liping.edu.hk'
    const response = await calendar.events.list({
      auth,
      calendarId,
      timeMax,
      timeMin,
      q
    })

    res.status(200).json(
      response.data.items.filter(({ attendences }) => {
        return attendences.some(({ email, responseStatus }) => {
          return email == 'lpcyn@liping.edu.hk' && responseStatus == 'declined'
        })
      })
    )
  } catch (error) {
    console.error('Error accessing calendars:', error)
    res.status(500).json({ error: error.message })
  }
}
