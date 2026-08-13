import { getSettings } from '@/utils/settings'

export default async function handler(req, res) {
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  )
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')

  if (req.method === 'GET') {
    try {
      const data = await getSettings(req)
      res.status(200).json(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
      res.status(500).json({ error: 'Failed to fetch settings' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
