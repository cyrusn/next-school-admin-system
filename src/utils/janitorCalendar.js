import { google } from 'googleapis'
import { DateTime } from 'luxon'

const calendar = google.calendar('v3')

export function formatGoogleDate(dateObj) {
  if (!dateObj) return null
  if (dateObj.date) {
    return DateTime.fromISO(dateObj.date, { zone: 'Asia/Hong_Kong' }).toFormat("yyyy-MM-dd'T'HH:mm:ss")
  }
  if (dateObj.dateTime) {
    return DateTime.fromISO(dateObj.dateTime).setZone('Asia/Hong_Kong').toFormat("yyyy-MM-dd'T'HH:mm:ss")
  }
  return null
}

export async function deleteRemovedEventAndCheckIsRequireJanitor(auth, calendarId, event) {
  const attendees = event.attendees || []
  const title = event.summary || ''
  let isDeleted = false

  for (const g of attendees) {
    const email = g.email || ''
    const status = g.responseStatus || ''
    const user = email.split('@')[0].replace('lp', '').toLowerCase()
    if (title.toLowerCase().includes(user) && status === 'declined') {
      isDeleted = true
      break
    }
  }

  if (isDeleted) {
    try {
      await calendar.events.delete({
        auth,
        calendarId,
        eventId: event.id
      })
    } catch (err) {
      console.error(`Failed to delete event ${event.id} from calendar ${calendarId}:`, err)
    }
    return { isRequireJanitor: false, isDeleted: true }
  }

  const isRequireJanitor = attendees.some((g) => {
    const guestName = g.displayName || ''
    const email = g.email || ''
    const user = email.split('@')[0].replace('lp', '').toLowerCase()
    const nameToCheck = guestName || user
    return nameToCheck.toLowerCase().includes('janitor')
  })

  return { isRequireJanitor, isDeleted: false }
}

export async function getItemThumbnails(auth, attachments) {
  if (!attachments || attachments.length === 0) return []
  const drive = google.drive('v3')
  try {
    const results = await Promise.all(attachments.map(async (attachment) => {
      const { fileId } = attachment
      if (!fileId) return attachment
      try {
        const response = await drive.files.get({
          auth,
          fileId,
          fields: 'thumbnailLink,mimeType,downloadUrl,webContentLink,webViewLink',
          supportsAllDrives: true
        })
        const file = response.data
        if (file) {
          const { thumbnailLink, mimeType, downloadUrl, webContentLink, webViewLink } = file
          return {
            ...attachment,
            thumbnailLink: thumbnailLink || '',
            mimeType: mimeType || '',
            downloadUrl: downloadUrl || webContentLink || '',
            webContentLink: webContentLink || '',
            webViewLink: webViewLink || ''
          }
        }
      } catch (err) {
        console.error(`Failed to get file ${fileId} from drive:`, err)
      }
      return attachment
    }))
    return results
  } catch (e) {
    console.error('Error in getItemThumbnails:', e)
    return attachments
  }
}

export async function fetchCalendars({ auth }) {
  const response = await calendar.calendarList.list({ auth })
  const items = response.data.items || []
  return items.map((cal) => ({
    title: cal.summary || '',
    id: cal.id
  }))
}

export async function fetchEventsByCalendarId({ auth, startDate, endDate, id }) {
  const response = await calendar.events.list({
    auth,
    calendarId: id,
    timeMin: `${startDate}T00:00:00+08:00`,
    timeMax: `${endDate}T23:59:59+08:00`,
    singleEvents: true
  })

  const items = response.data.items || []
  return items.map((event) => ({
    title: event.summary || '',
    start: formatGoogleDate(event.start),
    end: formatGoogleDate(event.end),
    description: event.description || '',
    location: event.location || ''
  }))
}

export async function fetchAllEvents({ auth, startDate, endDate }) {
  const response = await calendar.calendarList.list({ auth })
  const calendars = response.data.items || []

  const matchedCalendars = calendars.filter((cal) => /Main Building/.exec(cal.summary || ''))

  const eventsPromises = matchedCalendars.map(async (cal) => {
    const calendarName = cal.summary || ''
    const calendarId = cal.id

    const eventsResponse = await calendar.events.list({
      auth,
      calendarId,
      timeMin: `${startDate}T00:00:00+08:00`,
      timeMax: `${endDate}T23:59:59+08:00`,
      singleEvents: true
    })

    const events = eventsResponse.data.items || []
    const modifiedEvents = []
    for (const event of events) {
      const { isRequireJanitor, isDeleted } = await deleteRemovedEventAndCheckIsRequireJanitor(auth, calendarId, event)
      if (isDeleted) continue

      modifiedEvents.push({
        calendarName,
        title: event.summary || '',
        start: formatGoogleDate(event.start),
        end: formatGoogleDate(event.end),
        description: event.description || '',
        location: event.location || '',
        isRequireJanitor
      })
    }
    return modifiedEvents
  })

  const resultsArrays = await Promise.all(eventsPromises)
  return resultsArrays.flat()
}

export async function fetchJanitorEvents({ auth, startDate, endDate, settings }) {
  const calendarId = settings.JANITOR_GROUP_CALENDAR_EMAIL || 'c_4611d8d7d8c15ce261f053d3b110e411ce8d41d1418c9858cf27cea1b8eea0ec@group.calendar.google.com'
  const timeMin = `${startDate}T00:00:00+08:00`
  const timeMax = `${endDate}T23:59:59+08:00`
  const singleEvents = true

  const [result1, result2] = await Promise.all([
    calendar.events.list({
      auth,
      calendarId,
      timeMin,
      timeMax,
      singleEvents
    }).catch(err => {
      console.error(`Error listing events for calendar ${calendarId}:`, err)
      return { data: { items: [] } }
    }),
    calendar.events.list({
      auth,
      calendarId: 'janitor@liping.edu.hk',
      timeMin,
      timeMax,
      singleEvents
    }).catch(err => {
      console.error('Error listing events for janitor@liping.edu.hk:', err)
      return { data: { items: [] } }
    })
  ])

  const combined = [...(result1.data?.items || []), ...(result2.data?.items || [])]

  combined.sort((a, b) => {
    const startA = a.start?.dateTime || a.start?.date || ''
    const startB = b.start?.dateTime || b.start?.date || ''
    return startA.localeCompare(startB)
  })

  const finalEvents = await Promise.all(combined.map(async (item) => {
    const attachments = await getItemThumbnails(auth, item.attachments)
    return {
      ...item,
      attachments
    }
  }))

  return finalEvents
}

export function parseAttendees(attendees = []) {
  return attendees
    .filter(
      ({ resource, organizer, displayName }) =>
        !(resource || organizer || displayName === 'Janitor')
    )
    .map(({ email = '' }) => email.split('@')[0])
    .join(',')
}

export function parseStartEndDate(start, end) {
  if (!start?.dateTime || !end?.dateTime) return ''
  const startDateData = start.dateTime.slice(0, 16).split('T')
  const endDateData = end.dateTime.slice(0, 16).split('T')

  if (startDateData[0] === endDateData[0]) {
    return `${startDateData[0]} ${startDateData[1]} 至 ${endDateData[1]}`
  }

  return `${startDateData.join(' ')} 至 ${endDateData.join(' ')}`
}
