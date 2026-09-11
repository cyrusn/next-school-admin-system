import { getSession } from 'next-auth/react'
import { getResourcesData } from '@/utils/resources'

export default async function handler(req, res) {
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const data = await getResourcesData()
    res.status(200).json(data)
  } catch (error) {
    console.error('Error accessing calendars:', error)
    res.status(500).json({ error: error.message })
  }
}
