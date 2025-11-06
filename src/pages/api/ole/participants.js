// Add event, Get events
import { getSession } from 'next-auth/react'
import {
  appendRows,
  batchClearData,
  batchGetSheetDataByColumn,
  batchGetSheetDataByRow,
  batchUpdateSpreadsheet
} from '@/utils/googleSheet'

import _ from 'lodash'

const { OLE_GOOGLE_SHEET_ID } = process.env

export const putHandler = async (req, res) => {
  try {
    const { rangeObjects } = req.body
    const headerKeys = [
      'participantId',
      'eventId',
      'regno',
      'classcode',
      'classno',
      'name',
      'startDate',
      'endDate',
      'term',
      'role',
      'achievement',
      'hours',
      'isHighlight',
      'isAward',
      'awardName',
      'awardType',
      'awardStatus',
      'timestamp',
      'markedTimestamp',
      'isUpdated',
      'generatedReport'
    ]

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

export const getHandler = async (req, res) => {
  try {
    const { eventId, draw, start, length } = req.query

    const filterData = await batchGetSheetDataByColumn(OLE_GOOGLE_SHEET_ID, [
      'participants!A:B'
    ])

    const ranges = filterData
      .reduce((prev, record, index) => {
        const rowNo = index + 2
        if (record.eventId == parseInt(eventId)) {
          prev.push(`participants!A${rowNo}:U${rowNo}`)
        }
        return prev
      }, [])
      .reverse()

    const finalRange = [
      'participants!A1:U1',
      ...ranges.slice(parseInt(start), parseInt(start) + parseInt(length))
    ]

    const data = await batchGetSheetDataByRow(OLE_GOOGLE_SHEET_ID, finalRange)
    res.status(200).json({
      draw: draw,
      recordsTotal: ranges.length,
      recordsFiltered: ranges.length,
      data
    })
  } catch (error) {
    console.error('Error accessing Spreadsheet:', error)
    res.status(500).json({ error: error.message })
  }
}
export const postHandler = async (req, res) => {
  try {
    const { rows } = req.body

    const participantsIds = await batchGetSheetDataByColumn(
      OLE_GOOGLE_SHEET_ID,
      'participants!A:A'
    )

    const ids = participantsIds.map(({ participantId }) =>
      parseInt(participantId)
    )

    const maxId = _.max(ids)
    const modifiedRows = rows.map((row, index) => [maxId + index + 1, ...row])

    const response = await appendRows(
      OLE_GOOGLE_SHEET_ID,
      'participants!A1:A1',
      modifiedRows
    )
    res.status(200).json(response)
  } catch (error) {
    console.error('Error accessing Spreadsheet:', error)
    res.status(500).json({ error: error.message })
  }
}

export const deleteHandler = async (req, res) => {
  try {
    const { ranges } = req.body

    const participantsDataResponse = await batchClearData(
      OLE_GOOGLE_SHEET_ID,
      ranges
    )
    const { clearedRanges: clearedParticipantRanges } = participantsDataResponse

    res.status(200).json({ clearedParticipantRanges })
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

  switch (method) {
    case 'GET':
      await getHandler(req, res)
      break
    case 'POST':
      req.body = body
      await postHandler(req, res)
      break
    case 'PUT':
      req.body = body
      await putHandler(req, res)
      break
    case 'DELETE':
      req.body = body
      await deleteHandler(req, res)
      break
    default:
      await getHandler(req, res)
  }
}
