import { google } from 'googleapis'
import path from 'path'

let cachedClient = null

// Load the service account key from the JSON file
const SERVICE_ACCOUNT_KEY_PATH = path.join(
  process.cwd(),
  process.env.GOOGLE_API_KEY_FILENAME
)

export async function getAuth(subject) {
  if (cachedClient && !subject) {
    return cachedClient // Return cached client if it exists
  }
  const client = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY_PATH,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly',
      'https://www.googleapis.com/auth/gmail.send'
    ],
    clientOptions: {
      subject: subject ? subject : 'schooladmin@liping.edu.hk'
    }
  })

  const authedClient = await client.getClient() // Authenticate and cache the client
  if (!subject) {
    cachedClient = authedClient
  }
  return authedClient
}
