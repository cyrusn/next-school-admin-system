import { getSession } from 'next-auth/react'
import { getFiles } from '@/utils/googleDrive'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { folderId } = req.query

  if (!folderId) {
    return res.status(400).json({ error: 'folderId is required' })
  }

  try {
    const files = await getFiles(folderId)
    res.status(200).json(files)
  } catch (error) {
    console.error('Error in api/drive/files:', error)
    res.status(500).json({ error: 'Failed to fetch Google Drive files' })
  }
}
