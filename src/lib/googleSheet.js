import { google } from 'googleapis'
import { convertRowsToCollection } from './helper'
import { getAuth } from '../lib/googleApiAuth'
const sheets = google.sheets('v4')

export async function getSheetData(spreadsheetId, range) {
  try {
    const auth = await getAuth()
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range
    })

    const rows = response.data.values
    return convertRowsToCollection(rows)
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error)
    throw error // Rethrow the error to handle it in the calling function
  }
}

export async function batchGetSheetData(spreadsheetId, ranges) {
  try {
    const auth = await getAuth()
    const response = await sheets.spreadsheets.values.batchGet({
      auth,
      spreadsheetId,
      ranges
    })

    return response.data
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error)
    throw error // Rethrow the error to handle it in the calling function
  }
}

export async function clearSheetData(spreadsheetId, range) {
  try {
    const auth = await getAuth()
    const response = await sheets.spreadsheets.values.clear({
      auth,
      spreadsheetId,
      range
    })
    return response.data
  } catch (error) {
    console.error('Error clearing data from Google Sheets:', error)
    throw error // Rethrow the error to handle it in the calling function
  }
}

export async function appendRows(spreadsheetId, range, values) {
  const resource = {
    values
  }

  try {
    const auth = await getAuth()
    const response = await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource
    })
    return response.data // Return the response data
  } catch (error) {
    console.error('Error appending row:', error)
    throw new Error('Failed to append row')
  }
}
