import { getImageUrls } from '@/utils/googleDrive'
import { getSession } from 'next-auth/react'
import { getSettings } from '@/utils/settings'

const photoCache = {}
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour for photos

export default async function handler(req, res) {
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const { filenames } = req.query

  const now = Date.now()
  if (filenames && photoCache[filenames] && now - photoCache[filenames].lastFetch < CACHE_DURATION) {
    return res.status(200).json(photoCache[filenames].data)
  }

  try {
    const settings = await getSettings()
    const { DRIVE_ID, STUDENT_PHOTOS_FOLDER_ID } = settings
    const result = await getImageUrls(
      DRIVE_ID,
      STUDENT_PHOTOS_FOLDER_ID,
      filenames
    )

    if (filenames) {
      photoCache[filenames] = {
        data: result,
        lastFetch: now
      }
    }

    res.status(200).json(result)
  } catch (error) {
    console.error('Error accessing Google drive:', error)
    res.status(500).json({ error: 'Error accessing Google drive' })
  }
}
