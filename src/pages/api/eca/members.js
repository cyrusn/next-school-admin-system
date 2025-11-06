// Add event, Get events
import { getSession } from 'next-auth/react'
import {
  appendRows,
  getSheetData,
  batchClearData,
  batchGetSheetDataByColumn,
  batchGetSheetDataByRow,
  batchUpdateSpreadsheet
} from '@/utils/googleSheet'
const spreadsheetId = process.env.ECA_EVALUATION_SSID
import { getTimestamp } from '@/lib/helper'

export const putHandler = async (req, res) => {
  try {
    const { rangeObjects } = req.body
    const headerKeys = [
      'timestamp',
      'id',
      'clubId',
      'category',
      'information',
      'regno',
      'classcodeAndNo',
      'studentName',
      'grade',
      'role',
      'isNominated',
      'pic',
      'associates',
      'admininstrators'
    ]

    const totalUpdatedRows = await batchUpdateSpreadsheet(
      spreadsheetId,
      headerKeys,
      rangeObjects
    )
    res.status(200).json({ totalUpdatedRows })
  } catch (error) {
    console.error('Error accessing Spreadsheet:', error)
    res.status(500).json({ error: error.message })
  }
}
const uid = function (clubId) {
  return (
    Date.now().toString(36) +
    clubId.toString(36) +
    Math.random().toString(36).substring(2)
  )
}

export const postHandler = async (req, res) => {
  try {
    const { club, students } = req.body
    const {
      id,
      category,
      cname: information,
      pic,
      associates,
      admininstrators
    } = club
    const timestamp = getTimestamp()

    const rows = students.map(({ regno, classcode, classno, cname, ename }) => {
      const classcodeAndNo = `${classcode}${String(classno).padStart(2, 0)}`
      const studentName = cname || ename

      return [
        timestamp,
        uid(id),
        id,
        category,
        information,
        regno,
        classcodeAndNo,
        studentName,
        '',
        '',
        '',
        pic,
        associates,
        admininstrators
      ]
    })
    const response = await appendRows(spreadsheetId, 'record!A1:A1', rows)
    res.status(200).json(response)
  } catch (error) {
    console.error('Error accessing Spreadsheet:', error)
    res.status(500).json({ error: error.message })
  }
}

export const getHandler = async (req, res) => {
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { filter } = req.query
    const [type, value] = filter?.split(':')
    const filterRanges = ['record!B:B']
    switch (type) {
      case 'clubId':
        filterRanges.push('record!C:C')
        break
      case 'classcode':
        filterRanges.push('record!G:G')
        break
      case 'regno':
        filterRanges.push('record!F:F')
        break
    }

    const filterData = await batchGetSheetDataByColumn(
      spreadsheetId,
      filterRanges
    )

    const ranges = filterData.reduce((prev, record, index) => {
      const rowNo = index + 2
      console.log(record)
      if (type == 'classcode' && record['classcodeAndNo'].slice(0, 2) == value) {
        prev.push(`record!A${rowNo}:N${rowNo}`)
      }

      if (record[type] == Number(value)) {
        prev.push(`record!A${rowNo}:N${rowNo}`)
      }
      return prev
    }, [])

    const finalRanges = ['record!A1:N1', ...ranges]

    const data = await batchGetSheetDataByRow(spreadsheetId, finalRanges)
    res.status(200).json(data)
  } catch (error) {
    console.error('Error accessing spreadsheet:', error)
    res.status(500).json({ error: error.message })
  }
}

export const deleteHandler = async (req, res) => {
  try {
    const { ranges } = req.body

    const participantsDataResponse = await batchClearData(spreadsheetId, ranges)
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
