import { getSession } from 'next-auth/react'
import { DateTime } from 'luxon'
import param from 'jquery-param'
import { when } from 'jquery'
const TOKEN = process.env.STRAPI_API_KEY
const Authorization = `Bearer ${TOKEN}`
const BASE_URL = 'https://careers.liping.edu.hk/strapi/api'
import { ROLE_ENUM } from '@/config/constant'
import { dataTableQueryStrapiConverter } from '@/lib/helper'
import { addConductDetailToSummaryData } from '@/lib/conductDetail'

const getHandler = async (req, res) => {
  const schoolYear = req.query['filters[schoolYear]']
  const term = req.query['filters[term]']
  if (!schoolYear || !term) {
    res.status(400).json({
      message:
        'The filter for schoolYear and Term must be present in the the query'
    })
    return
  }
  const { qs, draw } = dataTableQueryStrapiConverter(req.query)
  try {
    const url = `${BASE_URL}/conducts/summary?${qs}`
    const response = await fetch(url, {
      headers: {
        Authorization
      }
    })
    const json = await response.json()

    const { meta, data } = json
    const modifiedData = addConductDetailToSummaryData(data)

    const { pagination } = meta
    const { page, pageCount, pageSize, total } = pagination

    const result = {
      draw,
      recordsTotal: total,
      recordsFiltered: total,
      data: modifiedData.map(({ id, attributes }) => ({
        id,
        schoolYear,
        term,
        ...attributes
      }))
    }

    res.status(200).json(result)
  } catch (error) {
    console.error('Error accessing strapi server:', error)
    res.status(500).json({ message: 'Error accessing strapi' })
  }
}

export default async function handler(req, res) {
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const ROLE = session?.user.info.role

  if (ROLE_ENUM[ROLE] < ROLE_ENUM['DC_TEAM']) {
    res.status(404).json({ message: 'Forbidden, only DC members can access.' })
  }
  await getHandler(req, res)
}
