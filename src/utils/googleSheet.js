import { google } from 'googleapis'
import { convertRowsToCollection } from '@/lib/helper'
import { getAuth } from '@/utils/googleApiAuth'
import _ from 'lodash'
const sheets = google.sheets('v4')

import { convertRangeObjectsToRows } from '@/lib/helper'

export async function batchUpdateSpreadsheet(
  spreadsheetId,
  headerKeys,
  rangeObjects
) {
  try {
    const auth = await getAuth()
    const data = convertRangeObjectsToRows(rangeObjects, headerKeys)
    const response = await sheets.spreadsheets.values.batchUpdate({
      auth,
      spreadsheetId,
      resource: { data, valueInputOption: 'USER_ENTERED' }
    })

    return response.data.totalUpdatedRows
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error)
    throw error // Rethrow the error to handle it in the calling function
  }
}

export async function getArrayData(spreadsheetId, range) {
  try {
    const auth = await getAuth()
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range,
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING'
    })

    const rows = response.data.values
    return rows.map((row) => row[0])
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error)
    throw error // Rethrow the error to handle it in the calling function
  }
}

export async function getSheetKeyValueData(spreadsheetId, range) {
  try {
    const auth = await getAuth()
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range,
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING'
    })

    const rows = response.data.values
    return _.fromPairs(rows)
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error)
    throw error // Rethrow the error to handle it in the calling function
  }
}

export async function getSheetData(spreadsheetId, range, rangeFunc) {
  try {
    const auth = await getAuth()
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range,
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING'
    })

    const rows = response.data.values
    return convertRowsToCollection(rows, rangeFunc)
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error)
    throw error // Rethrow the error to handle it in the calling function
  }
}
export async function batchGetSheetDataByColumn(spreadsheetId, ranges) {
  try {
    const auth = await getAuth()
    const response = await sheets.spreadsheets.values.batchGet({
      auth,
      spreadsheetId,
      ranges,
      majorDimension: 'COLUMNS',
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING'
    })
    const zippedResult = _.zip(
      ...response.data.valueRanges.reduce((prev, { range, values }) => {
        prev.push(...values, [
          ...values[0].map((a, index) => {
            if (index == 0) return 'range'
            const row = index + 1
            return `${range.split('!')[0]}!${row}:${row}`
          })
        ])
        return prev
      }, [])
    )
    return convertRowsToCollection(zippedResult)
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error)
    throw error // Rethrow the error to handle it in the calling function
  }
}

export async function batchGetSheetDataByRow(spreadsheetId, ranges) {
  try {
    const auth = await getAuth()
    const response = await sheets.spreadsheets.values.batchGet({
      auth,
      spreadsheetId,
      ranges,
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING'
    })

    const rows = response.data.valueRanges.reduce((prev, cur, index) => {
      const { values, range } = cur

      if (index == 0) {
        const row = values[0]

        prev.push(['range', ...row])
        return prev
      }

      prev.push([range, ...values[0]])
      return prev
    }, [])

    return convertRowsToCollection(rows)
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error)
    throw error // Rethrow the error to handle it in the calling function
  }
}

export async function batchClearData(spreadsheetId, ranges) {
  try {
    const auth = await getAuth()
    const response = await sheets.spreadsheets.values.batchClear({
      auth,
      spreadsheetId,
      resource: { ranges }
    })
    return response.data
  } catch (error) {
    console.error('Error clearing data from Google Sheets:', error)
    throw error // Rethrow the error to handle it in the calling function
  }
}

export async function appendRows(spreadsheetId, range, values) {
  const resource = {
    values: values.map((row) =>
      row.map((v) => (Array.isArray(v) ? v.join(',') : v))
    )
  }

  const auth = await getAuth()
  const response = await sheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource
  })
  return response.data // Return the response data
}
