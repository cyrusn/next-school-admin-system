import { getSession } from 'next-auth/react'
import { DateTime } from 'luxon'
import param from 'jquery-param'
import { when } from 'jquery'
import { dataTableQueryStrapiConverter } from '@/lib/helper'

const TOKEN = process.env.STRAPI_API_KEY
const Authorization = `Bearer ${TOKEN}`
const BASE_URL = 'https://careers.liping.edu.hk/strapi/api'

const getHandler = async (req, res) => {
  const { database } = req.query
  const { qs, draw } = dataTableQueryStrapiConverter(req.query)
  try {
    const url = `${BASE_URL}/${database}?${qs}`
    const response = await fetch(url, {
      headers: {
        Authorization
      }
    })
    const json = await response.json()

    const { meta, data } = json

    const { pagination } = meta
    const { page, pageCount, pageSize, total } = pagination

    const result = {
      draw,
      recordsTotal: total,
      recordsFiltered: total,
      data: data.map(({ id, attributes }) => ({
        id,
        ...attributes
      }))
    }

    res.status(200).json(result)
  } catch (error) {
    console.error('Error accessing strapi server:', error)
    res.status(500).json({ message: 'Error accessing strapi' })
  }
}

const deleteHandler = async (req, res) => {
  const { database } = req.query
  const query = req.query
  const qs = param(query)

  try {
    const response = await fetch(`${BASE_URL}/${database}?${qs}`, {
      method: 'DELETE',
      headers: {
        Authorization
      }
    })
    const json = await response.json()

    res.status(200).json(json) // send back the response
  } catch (error) {
    console.error('Error accessing strapi server:', error)
    res.status(500).json({ message: error.message }) // handle errors
  }
}

const postHandler = async (req, res) => {
  const { database } = req.query
  const { data } = req.body
  try {
    const response = await fetch(`${BASE_URL}/${database}`, {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: {
        Authorization,
        'Content-Type': 'application/json'
      }
    })
    console.log(response)

    const json = await response.json()
    if (!response.ok) {
      return res.status(500).json({
        error: 'Error accessing strapi server:' + JSON.stringify(json)
      }) // Handle errors
    }

    res.status(200).json(json) // Send back the response
  } catch (error) {
    console.error('Error accessing strapi server:', error)
    res.status(500).json({ error }) // Handle errors
  }
}

const putHandler = async (req, res) => {
  const { database } = req.query
  const { data } = req.body
  try {
    const response = await fetch(`${BASE_URL}/${database}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
      headers: {
        Authorization,
        'Content-Type': 'application/json'
      }
    })
    console.log(response)

    const json = await response.json()
    if (!response.ok) {
      return res.status(500).json({
        error: 'Error accessing strapi server:' + JSON.stringify(json)
      }) // Handle errors
    }

    res.status(200).json(json) // Send back the response
  } catch (error) {
    console.error('Error accessing strapi server:', error)
    res.status(500).json({ error }) // Handle errors
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
    case 'DELETE':
      await deleteHandler(req, res)
      break
    case 'POST':
      req.body = body
      await postHandler(req, res)
      break
    case 'PUT':
      req.body = body
      await putHandler(req, res)
      break
    default:
      await getHandler(req, res)
  }
}
