import { google } from 'googleapis'
import path from 'path'

let cachedClient = null

// Load the service account key from the JSON file
const SERVICE_ACCOUNT_KEY_PATH = path.join(
  process.cwd(),
  process.env.GOOGLE_API_KEY_FILENAME
)

export async function getAuth() {
  if (cachedClient) {
    return cachedClient // Return cached client if it exists
  }
  const client = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  })

  cachedClient = await client.getClient() // Authenticate and cache the client
  return cachedClient
}
