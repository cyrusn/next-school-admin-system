// Add event, Get events
import { getSession } from 'next-auth/react'
import { IncomingForm } from 'formidable'
import { uploadFiles } from '@/utils/googleDrive'
import { DateTime } from 'luxon'
const TOKEN = process.env.STRAPI_API_KEY
const Authorization = `Bearer ${TOKEN}`
const BASE_URL = 'https://careers.liping.edu.hk/strapi/api'

import { TIMEZONE } from '@/config/constant'

import { appendRows } from '@/utils/googleSheet'

const parseForm = async (req) => {
  const { multiples = true } = req.query
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      multiples,
      uploadDir: './uploads'
    })
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err) // Reject the promise if there's an error
      }
      resolve({ fields, files }) // Resolve the promise with fields and files
    })
  })
}

export const config = {
  api: {
    bodyParser: false // Disable Next.js body parsing
  }
}

const { REASON_OF_LEAVE_SSID, REASON_OF_LEAVE_FOLDER_ID, DRIVE_ID } =
  process.env

export const postHandler = async (req, res) => {
  try {
    const parsedResult = await parseForm(req) // Use async/await to parse form data

    const { fields, files } = parsedResult

    const fileResponse = await uploadFiles(
      DRIVE_ID,
      REASON_OF_LEAVE_FOLDER_ID,
      files.files
    )

    const fileData = fields.fileData?.map((data) => JSON.parse(data))

    const rowData = fields.rows.map((row) => JSON.parse(row))
    const combinedRows = []

    fileResponse.forEach(({ name, webViewLink }) => {
      const modifiedRows = rowData
        .filter((row) => {
          const found = fileData.find(({ filename }) => {
            return filename == name
          })

          if (found) {
            return found.checkedIds.includes(row.id)
          }
          return false
        })
        .map((row) => {
          const {
            id,
            eventDate,
            regno,
            classcode,
            classno,
            name: ename,
            cname,
            type,
            initial
          } = row

          const now = DateTime.now()
            .setZone(TIMEZONE)
            .toFormat("yyyy-MM-dd'T'HH:mm:ss")

          return [
            now,
            id,
            eventDate,
            regno,
            classcode,
            classno,
            ename,
            cname,
            type,
            initial,
            name,
            webViewLink
          ]
        })

      combinedRows.push(...modifiedRows)
    })

    const result = await appendRows(REASON_OF_LEAVE_SSID, 'A:L', combinedRows) // Call the appendRow function

    const payloads = []
    // console.log(rows)
    rowData.forEach(({ id, reasonForAbsence, isLeaveOfAbsence }) => {
      const found = payloads.find(({ data }) => {
        return data.reasonForAbsence === reasonForAbsence
      })

      if (found) {
        found.where.id.$in.push(id)
        return
      }

      payloads.push({
        where: { id: { $in: [id] } },
        data: {
          reasonForAbsence,
          isLeaveOfAbsence
        }
      })
    })

    const responses = []
    payloads.forEach(async (payload) => {
      const response = await fetch(`${BASE_URL}/attendances`, {
        method: 'PUT',
        headers: {
          Authorization,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...payload })
      })
      const json = await response.json()

      if (!response.ok) {
        return res.status(500).json({
          error: 'Error accessing strapi server:' + JSON.stringify(json)
        }) // Handle errors
      }
      responses.push(response)
    })

    res.status(200).json({ result, responses }) // Return the links
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: error.message })
  }
}

export const getHandler = async () => {}

export default async function handler(req, res) {
  const { method } = req
  const body = { ...req.body }
  delete req.body
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  switch (method) {
    case 'POST':
      req.body = body
      await postHandler(req, res)
      break
    default:
      await getHandler(req, res)
  }
}
