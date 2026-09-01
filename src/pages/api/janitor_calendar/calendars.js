import { getAuth } from '@/utils/googleApiAuth'
import { fetchCalendars } from '@/utils/janitorCalendar'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const auth = await getAuth()
    const list = await fetchCalendars({ auth })
    res.status(200).json(list)
  } catch (error) {
    console.error('Error fetching calendar list:', error)
    res.status(500).json({ error: error.message })
  }
}
