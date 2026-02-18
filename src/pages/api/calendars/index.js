import { getSession } from 'next-auth/react'
import { getAuth } from '@/utils/googleApiAuth'
import { DateTime } from 'luxon'

import { google } from 'googleapis'
const calendar = google.calendar('v3')
const JANITOR_GROUP_CALENDAR_EMAIL = process.env.JANITOR_GROUP_CALENDAR_EMAIL
import { SPECIAL_ACKNOWLEDGE_EMAIL_MAPPER } from '@/config/constant'

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
const checkInstances = async ({ calendarId, eventId, auth }) => {
  const instanceResponse = await calendar.events.instances({
    auth,
    eventId,
    calendarId
  })

  if (instanceResponse.status !== 200) {
    throw new Error(instanceResponse.statusText, {
      response: instanceResponse
    })
  }

  const isNeedAction = instanceResponse.data.items.reduce((prev, item) => {
    item.attendees.forEach(({ email, responseStatus }) => {
      if (email == calendarId && responseStatus == 'needsAction') {
        prev = prev || true
      }
    })

    return prev
  }, false)

  if (isNeedAction) return 'needsAction'

  const isDeclined = instanceResponse.data.items.reduce((prev, item) => {
    item.attendees.forEach(({ email, responseStatus }) => {
      if (email == calendarId && responseStatus == 'declined') {
        prev = prev || true
      }
    })

    return prev
  }, false)

  if (isDeclined) return 'declined'
  return 'accepted'
}

export default async function handler(req, res) {
  const { method } = req
  if (method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const body = { ...req.body }

  delete req.body
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const {
    resourceType,
    resourceEmail,
    resourceName,
    picEmail,
    title,
    description,
    startTime,
    endTime,
    requireJanitor,
    rruleType,
    rruleFreq,
    rruleValue
  } = body

  const timeMin = new Date(`${startTime}:00.000+08:00`)
  const timeMax = new Date(`${startTime.slice(0, 10)}T${endTime}:00.000+08:00`)
  const calendarId = resourceEmail

  try {
    const auth = await getAuth()
    const privateAuth = await getAuth(picEmail)

    const freebusyResponse = await calendar.freebusy.query({
      auth,
      requestBody: {
        timeMin,
        timeMax,
        items: [{ id: resourceEmail }],
        calendarExpansionMax: 50
      }
    })

    // check if resource available first
    if (freebusyResponse.data.calendars[resourceEmail].busy.length > 0) {
      return res.status(409).json({ error: 'Resource is not available' })
    }

    // Event title (summary)
    const initial =
      picEmail == session.user.email
        ? session.user.info.initial
        : picEmail.split('@')[0].slice(2).toUpperCase()

    const summary = `${initial}@${resourceName} - ${title}`
    const attendees = [
      { email: resourceEmail, resource: true }
      // { email: picEmail }
    ]

    if (requireJanitor) {
      attendees.push({
        displayName: 'Janitor',
        email: JANITOR_GROUP_CALENDAR_EMAIL
      })
    }

    const specialAcknowledgeEmail =
      SPECIAL_ACKNOWLEDGE_EMAIL_MAPPER[resourceName]

    if (specialAcknowledgeEmail) {
      specialAcknowledgeEmail.split(',').forEach((email) => {
        attendees.push({ email })
      })
    }

    const requestBody = {
      start: {
        dateTime: startTime + ':00',
        timeZone: 'Asia/Hong_Kong'
      },
      end: {
        dateTime: startTime.split('T')[0] + 'T' + endTime + ':00',
        timeZone: 'Asia/Hong_Kong'
      },
      summary,
      description,
      attendees,
      supportsAttachments: true,
      guestsCanModify: true
    }

    if (rruleType) {
      let recurrence
      switch (rruleType) {
        case 'REPEAT_UNTIL':
          recurrence = `RRULE:FREQ=${rruleFreq};UNTIL=${rruleValue.replaceAll(
            '-',
            ''
          )}T080000Z`
          break
        case 'REPEAT_COUNT':
          recurrence = `RRULE:FREQ=${rruleFreq};COUNT=${rruleValue}`
          break
        case 'RDATE':
          const eventStartTimeOnly = startTime
            .split('T')[1]
            .replaceAll(':', '')
            .trim()
          const dates = rruleValue
            .split(/\s|,/)
            .map(
              (date) =>
                `${date.replaceAll('-', '').trim()}T${eventStartTimeOnly}00`
            )
          recurrence = `RDATE;TZID=Asia/Hong_Kong:${dates.join(',')}`
          break
        case 'CUSTOM':
          recurrence = rruleValue
          break
        default:
          recurrence = null
      }

      if (recurrence) {
        requestBody['recurrence'] = [recurrence]
      }
    }

    // insert with privateAuth
    const response = await calendar.events.insert({
      auth: privateAuth,
      requestBody,
      calendarId: 'primary'
    })

    const { id: eventId } = response.data
    let attendeesStatus = await checkInstances({ eventId, calendarId, auth })

    while (attendeesStatus == 'needsAction') {
      await sleep(1500)
      attendeesStatus = await checkInstances({ eventId, calendarId, auth })
    }

    if (attendeesStatus == 'declined') {
      const deleteResponse = await calendar.events.delete({
        auth,
        calendarId,
        eventId
      })

      if (deleteResponse.data) {
        throw new Error(deleteResponse.statusText)
      }

      return res
        .status(409)
        .json({ error: 'Resource is not available in recurrence' })
    }

    if (response.status == 200 && specialAcknowledgeEmail) {
      const gmail = google.gmail('v1')

      const email = [
        `To: ${specialAcknowledgeEmail}`,
        `Subject: New Booking of ${resourceName}: [${summary} ${startTime}]`,
        `Content-Type: text/plain; charset="UTF-8"`,
        '',
        `Title: ${title} 
Location: ${resourceName}
Time: ${startTime} - ${endTime}
Description: ${description}
From: ${initial}`
      ].join('\n')

      const base64EncodedEmail = Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')

      const response = await gmail.users.messages.send({
        auth,
        userId: 'me', // Use 'me' to indicate the authenticated user
        requestBody: {
          raw: base64EncodedEmail
        }
      })
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Error accessing calendars:', error)
    res.status(500).json({ error: error.message })
  }
}
