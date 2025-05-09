// https://www.npmjs.com/package/formidable
import { IncomingForm } from 'formidable'

import { uploadFiles } from '@/utils/googleDrive'

// Set up multer for file uploads
const { DRIVE_ID } = process.env

// API route handler
export const config = {
  api: {
    bodyParser: false // Disable Next.js body parsing
  }
}

// Function to parse the form data using formidable
const parseForm = async (req) => {
  const { multiples = true } = req.query
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples, uploadDir: './uploads' })
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err) // Reject the promise if there's an error
      }
      resolve({ fields, files }) // Resolve the promise with fields and files
    })
  })
}

export const postHandler = async (req, res) => {
  try {
    const parsedResult = await parseForm(req) // Use async/await to parse form data
    const { fields, files } = parsedResult
    const data = await uploadFiles(DRIVE_ID, fields.folderId[0], files.files)
    res.status(200).json({ data }) // Return the links
  } catch (error) {
    console.error('Error uploading files:', error)
    res.status(500).json({ error: 'Failed to upload files' })
  }
}

export default async function handler(req, res) {
  {
    const { method } = req
    switch (method) {
      case 'POST':
        await postHandler(req, res)
        break
      default:
        res.status(405).json({ error: 'Invalid Method' })
        break
    }
  }
}
