import { getSettings } from '@/utils/settings'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await getSettings()
      res.status(200).json(data)
    } catch (error) {
      console.error('Error fetching settings from Google Sheets:', error)
      res.status(500).json({ error: 'Failed to fetch settings' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
