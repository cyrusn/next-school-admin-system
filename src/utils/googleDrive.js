// https://developers.google.com/workspace/drive/api/guides/mime-types
import { google } from 'googleapis'
import fs from 'fs'
const drive = google.drive('v3')
import { getAuth } from '@/utils/googleApiAuth'

export async function createFolder(driveId, folderId, folderName) {
  const auth = await getAuth()
  const metaData = {
    name: folderName,
    parents: [folderId],
    mimeType: 'application/vnd.google-apps.folder'
  }

  const response = await drive.files.create({
    auth,
    resource: metaData,
    fields: 'id,webViewLink,name',
    supportsAllDrives: true, // Allow operations on shared drives
    driveId, // Specify the shared drive ID
    includeItemsFromAllDrives: true // Include items from shared drives
  })
  return response.data
}

export async function uploadFiles(driveId, folderId, files) {
  const auth = await getAuth()
  const data = []

  for (const file of files) {
    const { originalFilename: filename, filepath, mimetype } = file // Get the uploaded file info

    const metadata = {
      name: filename,
      parents: [folderId] // Replace with your target folder ID
    }

    const media = {
      mimeType: mimetype,
      body: fs.createReadStream(filepath)
    }

    const response = await drive.files.create({
      auth,
      resource: metadata,
      media: media,
      fields: 'id,webViewLink,name',
      driveId,
      supportsAllDrives: true, // Allow operations on shared drives
      includeItemsFromAllDrives: true // Include items from shared drives
    })

    // Remove the temporary file
    fs.unlinkSync(filepath)

    data.push(response.data) // Store the link for each uploaded file
  }
  return data
}

export async function getFiles(folderId) {}
