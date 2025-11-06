// Add event, Get events
import { getSession } from 'next-auth/react'
import { getTimestamp } from '@/lib/helper'

import {
  appendRows,
  batchGetSheetDataByColumn,
  batchGetSheetDataByRow,
  batchUpdateSpreadsheet,
  batchClearData
} from '@/utils/googleSheet'

import { createFolder, trashFolder } from '@/utils/googleDrive'
import { DateTime } from 'luxon'
import _ from 'lodash'
import { TIMEZONE } from '@/config/constant'

const { DRIVE_ID, OLE_GOOGLE_SHEET_ID, OLE_DATA_FOLDER_ID } = process.env

export const getHandler = async (req, res) => {
  try {
    const { filter } = req.query
    const [type, value] = filter?.split(':')

    const filterRanges = ['events!A:A']
    switch (type) {
      case 'pics':
        filterRanges.push('events!F:F')
        break
      case 'components':
        filterRanges.push('events!I:I')
        break
      case 'committeeAndKla':
        filterRanges.push('events!J:J')
        break
    }

    const filterData = await batchGetSheetDataByColumn(
      OLE_GOOGLE_SHEET_ID,
      filterRanges
    )

    const ranges = filterData.reduce((prev, record, index) => {
      const rowNo = index + 2
      if (record[type] == value || record[type].includes(value)) {
        prev.push(`events!A${rowNo}:O${rowNo}`)
      }
      return prev
    }, [])

    const finalRanges = ['events!A1:O1', ...ranges]

    const data = await batchGetSheetDataByRow(OLE_GOOGLE_SHEET_ID, finalRanges)
    res.status(200).json(data)
  } catch (error) {
    console.error('Error accessing spreadsheet:', error)
    res.status(500).json({ error: error.message })
  }
}

export const postHandler = async (req, res) => {
  const { formData } = req.body // Extract data from the request body
  if (!formData) {
    return res.status(404).json({ error: 'Required: FormData' })
  }
  const oldEventIds = await batchGetSheetDataByColumn(
    OLE_GOOGLE_SHEET_ID,
    'events!A:A'
  )

  const timestamp = getTimestamp()

  const {
    title,
    description,
    objective,
    efficacy,
    pics,
    category,
    organization,
    components,
    committeeAndKla
  } = formData

  const ids = oldEventIds.map(({ eventId }) => eventId)
  const maxId = _.max(ids)
  const eventId = maxId + 1

  const folderName =
    `${eventId}`.padStart(3, '0') + ` [${committeeAndKla}] ${title} @${pics}`

  const { webViewLink: imageFolderUrl } = await createFolder(
    DRIVE_ID,
    OLE_DATA_FOLDER_ID,
    folderName
  )

  const range = 'events!A2:A'
  const row = [
    eventId,
    title,
    description,
    objective,
    efficacy,
    pics,
    category,
    organization,
    components,
    committeeAndKla,
    imageFolderUrl,
    false,
    timestamp,
    '',
    ''
  ]

  const values = [row]
  console.log(values)

  try {
    const result = await appendRows(OLE_GOOGLE_SHEET_ID, range, values) // Call the appendRow function
    res.status(200).json(result) // Send back the response
  } catch (error) {
    console.error(error)
    res.status(500).json({ error }) // Handle errors
  }
}

export const putHandler = async (req, res) => {
  try {
    const { rangeObjects } = req.body
    // console.log(rangeObjects)
    const headerKeys = [
      'eventId',
      'title',
      'description',
      'objective',
      'efficacy',
      'pics',
      'category',
      'organization',
      'components',
      'committeeAndKla',
      'imageFolderUrl',
      'isLocked',
      'timestamp',
      'markedTimestamp',
      'isUpdated'
    ]

    // console.log(JSON.stringify(data, null, '\t'))

    const totalUpdatedRows = await batchUpdateSpreadsheet(
      OLE_GOOGLE_SHEET_ID,
      headerKeys,
      rangeObjects
    )
    res.status(200).json({ totalUpdatedRows })
  } catch (error) {
    console.error('Error accessing Spreadsheet:', error)
    res.status(500).json({ error: error.message })
  }
}

export const deleteHandler = async (req, res) => {
  try {
    const { ranges, eventId, imageFolderUrl } = req.body
    const folderId = imageFolderUrl.split('/').pop()

    const participantsData = await batchGetSheetDataByColumn(
      OLE_GOOGLE_SHEET_ID,
      ['participants!A:B']
    )

    const participantRanges = participantsData
      .filter((r) => r.eventId == eventId)
      .map((r) => {
        const { range } = r
        return range
      })

    const eventData = await batchClearData(OLE_GOOGLE_SHEET_ID, ranges)
    const participantsDataResponse = await batchClearData(
      OLE_GOOGLE_SHEET_ID,
      participantRanges
    )
    const { clearedRanges: clearedEventRanges } = eventData
    const { clearedRanges: clearedParticipantRanges } = participantsDataResponse

    const folderResponse = await trashFolder(OLE_DATA_FOLDER_ID, folderId)

    res
      .status(200)
      .json({ clearedEventRanges, clearedParticipantRanges, folderResponse })
  } catch (error) {
    console.error('Error accessing Spreadsheet:', error)
    res.status(500).json({ error: error.message })
  }
}

export default async function handler(req, res) {
  const { method } = req
  const body = { ...req.body }
  delete req.body
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  req.body = body
  switch (method) {
    case 'GET':
      await getHandler(req, res)
      break
    case 'POST':
      await postHandler(req, res)
      break
    case 'PUT':
      await putHandler(req, res)
      break
    case 'DELETE':
      await deleteHandler(req, res)
  }
}
