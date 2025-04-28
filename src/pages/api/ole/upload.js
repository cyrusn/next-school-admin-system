// https://www.npmjs.com/package/formidable
import { google } from 'googleapis'
import { IncomingForm } from 'formidable'

import { createRouter, expressWrapper } from 'next-connect'
import { getAuth } from '@/lib/googleApiAuth'
import { getSession } from 'next-auth/react'
import { uploadFiles } from '@/lib/googleDrive'
import path from 'path'
import { warn } from 'console'

// Set up multer for file uploads
const { DRIVE_ID, OLE_DATA_FOLDER_ID } = process.env

// API route handler
export const config = {
  api: {
    bodyParser: false // Disable Next.js body parsing
  }
}

// Function to parse the form data using formidable
const parseForm = async (req) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: true, uploadDir: './uploads' })
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
    //const body = { ...req.body }
    //delete req.body
    //const session = await getSession({ req, method: 'GET' })
    //if (!session) {
    //  return res.status(401).json({ error: 'Unauthorized' })
    //}
    //
    //req.body = body
    switch (method) {
      case 'GET':
        //await getHandler(req, res)
        break
      case 'POST':
        await postHandler(req, res)
        break
      case 'PUT':
        //await putHandler(req, res)
        break
      case 'DELETE':
      //await deleteHandler(req, res)
      default:
      //await getHandler(req, res)
    }
  }
}
