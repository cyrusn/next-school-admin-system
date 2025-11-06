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

export async function trashFolder(driveId, folderId) {
  const auth = await getAuth()
  const metaData = {
    trashed: true
  }

  const response = await drive.files.update({
    auth,
    fileId: folderId,
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
  if (!files) return data

  for (const file of files) {
    const { originalFilename, filepath, mimetype } = file // Get the uploaded file info

    const metadata = {
      name: originalFilename,
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

export async function getPdfs(DRIVE_ID, FOLDER_ID, filenames) {
  // console.log(filenames)
  const auth = await getAuth()

  let q = `mimeType contains 'pdf' and '${FOLDER_ID}' in parents`
  console.log(q)
  try {
    const response = await drive.files.list({
      auth,
      corpora: 'drive',
      driveId: DRIVE_ID,
      pageSize: 1000,
      includeItemsFromAllDrives: 'true',
      supportsAllDrives: 'true',
      q,
      fields: 'files(id,name,webContentLink,webViewLink)'
    })
    return response.data
  } catch (e) {
    return e.errors
  }
}
export async function getImageUrls(DRIVE_ID, FOLDER_ID, filenames) {
  // console.log(filenames)
  const auth = await getAuth()
  let q = `mimeType contains 'image/' and '${FOLDER_ID}' in parents`

  if (filenames) {
    q += ` and (${filenames})`
  }
  console.log(q)
  const response = await drive.files.list({
    auth,
    corpora: 'drive',
    driveId: DRIVE_ID,
    pageSize: 1000,
    includeItemsFromAllDrives: 'true',
    supportsAllDrives: 'true',
    q,
    fields: 'files(id,name,thumbnailLink,webContentLink)'
  })

  return response.data
}

export async function getFiles(folderId) {}
