import { getAuth } from '@/utils/googleApiAuth'
import { fetchEventsByCalendarId } from '@/utils/janitorCalendar'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { id, startDate, endDate } = req.query

  if (!id || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required parameters: id, startDate, and endDate' })
  }

  try {
    const auth = await getAuth()
    const events = await fetchEventsByCalendarId({ auth, startDate, endDate, id })
    res.status(200).json(events)
  } catch (error) {
    console.error(`Error fetching events for calendar ${id}:`, error)
    res.status(500).json({ error: error.message })
  }
}
