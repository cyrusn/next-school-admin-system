import { getSession } from 'next-auth/react'
import { DateTime } from 'luxon'
import param from 'jquery-param'
const TOKEN = process.env.STRAPI_API_KEY
const Authorization = `Bearer ${TOKEN}`
const BASE_URL = 'https://careers.liping.edu.hk/strapi/api'

import {
  ROLE_ENUM,
  TODAY,
  ITEM_CODES,
  ATTENDANCE_TYPES,
  SECOND_TERM_START_DATE,
  FIRST_TERM_START_DATE
} from '@/config/constant'
import { dataTableQueryStrapiConverter } from '@/lib/helper'
import {
  mergeAccumulateAndCurrentDataToSingleObject,
  addConductDetailToSummaryData
} from '@/lib/conductDetail'

const getHandler = async (req, res) => {
  const schoolYear = req.query['filters[schoolYear]']
  const term = req.query['filters[term]']
  if (!schoolYear || !term) {
    res.status(400).json({
      error:
        'The filter for schoolYear and Term must be present in the the query'
    })
    return
  }
  const query = Object.assign({}, req.body, req.query)
  const { qs, draw } = dataTableQueryStrapiConverter(query)

  const { qs: accumulateQs, draw: accumulateDraw } =
    dataTableQueryStrapiConverter(
      Object.assign({}, query, {
        [`filters[eventDate][$gte]`]:
          term == 2 ? SECOND_TERM_START_DATE : FIRST_TERM_START_DATE,
        [`filters[eventDate][$lte]`]: TODAY
      })
    )
  try {
    const url = `${BASE_URL}/conducts/summary?${qs}`
    const headers = {
      Authorization
    }
    const response = await fetch(url, { headers })
    const json = await response.json()

    const { data } = json
    //const { pagination } = meta
    //const { page, pageCount, pageSize, total } = pagination

    const accumulateUrl = `${BASE_URL}/conducts/summary?${accumulateQs}`
    const accumulateResponse = await fetch(accumulateUrl, { headers })
    const accumulateJson = await accumulateResponse.json()
    const { meta, data: accumulateData } = accumulateJson

    const modifiedData = addConductDetailToSummaryData(data)
    const modifiedAccumulateData = addConductDetailToSummaryData(accumulateData)
    const mergedResult = mergeAccumulateAndCurrentDataToSingleObject(
      accumulateData,
      data
    )

    const { pagination } = meta
    const { page, pageCount, pageSize, total } = pagination
    const unusedKeys = [
      ...ITEM_CODES.map(({ code }) => code),
      ...ATTENDANCE_TYPES.filter(({ key }) => key != 'earlyLeave').map(
        ({ key }) => key
      )
    ]

    const studentInfoKeys = [
      'regno',
      'id',
      'classcode',
      'classno',
      'name',
      'cname',
      'sex',
      'house',
      'status'
    ]

    const result = {
      draw: accumulateDraw,
      recordsTotal: total,
      recordsFiltered: total,
      data: mergedResult.map(
        ({ id, accumulatedAttributes, currentAttributes }) => {
          const modifiedAccumulatedAttributes = Object.keys(
            accumulatedAttributes
          ).reduce((prev, key) => {
            // accumulate wont show details
            if (unusedKeys.includes(key)) return prev

            if (studentInfoKeys.includes(key)) {
              prev[key] == accumulatedAttributes[key]
              return prev
            }

            prev[`acc${key[0].toUpperCase()}${key.slice(1)}`] =
              accumulatedAttributes[key]
            return prev
          }, {})

          return {
            id,
            schoolYear,
            term,
            ...modifiedAccumulatedAttributes,
            ...currentAttributes
          }
        }
      )
    }

    res.status(200).json(result)
  } catch (error) {
    console.error('Error accessing strapi server:', error)
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

  const ROLE = session?.user.info.role

  if (ROLE_ENUM[ROLE] < ROLE_ENUM['DC_TEAM']) {
    res.status(404).json({ error: 'Forbidden, only DC members can access.' })
  }
  req.body = body
  await getHandler(req, res)
}
