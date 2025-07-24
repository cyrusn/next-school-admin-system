import { getImageUrls } from '@/utils/googleDrive'
import { getSession } from 'next-auth/react'

const { DRIVE_ID, STUDENT_PHOTOS_FOLDER_ID } = process.env

export default async function handler(req, res) {
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const { filenames } = req.query

  try {
    const result = await getImageUrls(
      DRIVE_ID,
      STUDENT_PHOTOS_FOLDER_ID,
      filenames
    )

    res.status(200).json(result)
  } catch (error) {
    console.error('Error accessing Google drive:', error)
    res.status(500).json({ error: 'Error accessing Google drive' })
  }
}
