import { getPdfs } from '@/utils/googleDrive'
import { getSession } from 'next-auth/react'

const { DRIVE_ID, ONE_PAGE_PROFILE_FOLDER_ID } = process.env

export default async function handler(req, res) {
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const { filenames } = req.query

  try {
    const result = await getPdfs(
      DRIVE_ID,
      ONE_PAGE_PROFILE_FOLDER_ID,
      filenames
    )

    res.status(200).json(result?.files || [])
  } catch (error) {
    console.error('Error accessing Google drive:', error)
    res.status(500).json({ error: 'Error accessing Google drive' })
  }
}
