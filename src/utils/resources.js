import { getAuth } from './googleApiAuth'
import { google } from 'googleapis'
import { DateTime } from 'luxon'

const admin = google.admin('directory_v1')
const calendar = google.calendar('v3')

let cachedResources = null

export async function getResourcesData() {
  if (cachedResources) {
    return cachedResources
  }

  console.log('[Resources] Cache miss, fetching calendars from Google Admin API...')
  const auth = await getAuth()
  const response = await admin.resources.calendars.list({
    auth,
    customer: 'my_customer'
  })

  cachedResources = response.data
  return cachedResources
}

export function clearResourcesCache() {
  console.log('[Resources] Clearing cached resources...')
  cachedResources = null
}

export function formatGoogleDate(dateObj) {
  if (!dateObj) return null
  if (dateObj.date) {
    return DateTime.fromISO(dateObj.date, { zone: 'Asia/Hong_Kong' }).toFormat(
      "yyyy-MM-dd'T'HH:mm:ss"
    )
  }
  if (dateObj.dateTime) {
    return DateTime.fromISO(dateObj.dateTime)
      .setZone('Asia/Hong_Kong')
      .toFormat("yyyy-MM-dd'T'HH:mm:ss")
  }
  return null
}

export async function deleteRemovedEventAndCheckIsRequireJanitor(
  auth,
  calendarId,
  event
) {
  const attendees = event.attendees || []
  const title = event.summary || ''
  const description = event.description || ''
  const location = event.location || ''
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
      console.error(
        `Failed to delete event ${event.id} from calendar ${calendarId}:`,
        err
      )
    }
    return { isRequireJanitor: false, isDeleted: true }
  }

  const isRequireJanitor =
    attendees.some((g) => {
      const guestName = g.displayName || ''
      const email = g.email || ''
      const user = email.split('@')[0].replace('lp', '').toLowerCase()
      const nameToCheck = guestName || user
      return nameToCheck.toLowerCase().includes('janitor')
    }) ||
    !!description
      .replace(/^Created.*?\n/gm, '')
      .replace(/^Last Modified.*?\n/gm, '')
      .replace(title.split(' - ')[1]?.trim() || '', '')

  return { isRequireJanitor, isDeleted: false }
}

export async function getItemThumbnails(auth, attachments) {
  if (!attachments || attachments.length === 0) return []
  const drive = google.drive('v3')
  try {
    const results = await Promise.all(
      attachments.map(async (attachment) => {
        const { fileId } = attachment
        if (!fileId) return attachment
        try {
          const response = await drive.files.get({
            auth,
            fileId,
            fields:
              'thumbnailLink,mimeType,downloadUrl,webContentLink,webViewLink',
            supportsAllDrives: true
          })
          const file = response.data
          if (file) {
            const {
              thumbnailLink,
              mimeType,
              downloadUrl,
              webContentLink,
              webViewLink
            } = file
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
      })
    )
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

export async function fetchEventsByCalendarId({
  auth,
  startDate,
  endDate,
  id
}) {
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

export async function fetchAllEvents({ auth, startDate, endDate, includeDevices = 'false' }) {
  const response = await calendar.calendarList.list({ auth })
  const calendars = response.data.items || []

  const matchedCalendars = calendars.filter((cal) => {
    const summary = cal.summary || ''
    const isMainBuilding = /Main Building/.exec(summary)
    const isDisplayBoard = summary.includes('Display Board')
    const isDevice = summary.includes('Notebook') || summary.includes('iPad') || summary.includes('Computer')

    if (includeDevices === 'true') {
      return isMainBuilding || isDisplayBoard || isDevice
    } else {
      return (isMainBuilding || isDisplayBoard) && !isDevice
    }
  })

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
      const { isRequireJanitor, isDeleted } =
        await deleteRemovedEventAndCheckIsRequireJanitor(
          auth,
          calendarId,
          event
        )
      if (isDeleted) continue

      modifiedEvents.push({
        id: event.id,
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
  const flatEvents = resultsArrays.flat()

  // Deduplicate events by id
  const uniqueEvents = []
  const seenIds = new Set()
  for (const ev of flatEvents) {
    if (ev.id && seenIds.has(ev.id)) continue
    if (ev.id) seenIds.add(ev.id)
    uniqueEvents.push(ev)
  }
  return uniqueEvents
}

export async function fetchJanitorEvents({
  auth,
  startDate,
  endDate,
  settings
}) {
  const calendarId =
    settings.JANITOR_GROUP_CALENDAR_EMAIL ||
    'c_4611d8d7d8c15ce261f053d3b110e411ce8d41d1418c9858cf27cea1b8eea0ec@group.calendar.google.com'
  const timeMin = `${startDate}T00:00:00+08:00`
  const timeMax = `${endDate}T23:59:59+08:00`
  const singleEvents = true

  const [result1, result2, result3] = await Promise.all([
    calendar.events
      .list({
        auth,
        calendarId,
        timeMin,
        timeMax,
        singleEvents
      })
      .catch((err) => {
        console.error(`Error listing events for calendar ${calendarId}:`, err)
        return { data: { items: [] } }
      }),
    calendar.events
      .list({
        auth,
        calendarId: 'janitor@liping.edu.hk',
        timeMin,
        timeMax,
        singleEvents
      })
      .catch((err) => {
        console.error('Error listing events for janitor@liping.edu.hk:', err)
        return { data: { items: [] } }
      }),
    calendar.events
      .list({
        auth,
        calendarId:
          'c_188296g6v8ehahrfln76ougj8m22g@resource.calendar.google.com',
        timeMin,
        timeMax,
        singleEvents
      })
      .catch((err) => {
        console.error('Error listing events for Hall', err)
        return { data: { items: [] } }
      })
  ])

  const combined = [
    ...(result1.data?.items || []),
    ...(result2.data?.items || []),
    ...(result3.data?.items || [])
  ]

  combined.sort((a, b) => {
    const startA = a.start?.dateTime || a.start?.date || ''
    const startB = b.start?.dateTime || b.start?.date || ''
    return startA.localeCompare(startB)
  })

  const finalEvents = await Promise.all(
    combined.map(async (item) => {
      const attachments = await getItemThumbnails(auth, item.attachments)
      return {
        ...item,
        attachments
      }
    })
  )

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
