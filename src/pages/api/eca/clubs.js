import { getSheetData } from '@/utils/googleSheet'
import { getSession } from 'next-auth/react'

const spreadsheetId = process.env.CLUB_REGISTRATION_SSID

export default async function handler(req, res) {
  const { initial } = req.query
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const data = await getSheetData(spreadsheetId, 'club!A:H')

    if (!initial) {
      res.status(200).json(data)
      return
    }

    res.status(200).json(
      data.filter(({ pic, associates, admininstrators }) => {
        const allPics = [
          ...pic?.split(',').map((a) => a.trim()),
          ...associates?.split(',').map((a) => a.trim()),
          ...admininstrators?.split(',').map((a) => a.trim())
        ]
        return allPics.includes(initial)
      })
    )
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    res.status(500).json({ error })
  }
}
