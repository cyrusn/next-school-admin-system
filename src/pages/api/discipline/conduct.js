import { getSession } from 'next-auth/react'
import { DateTime } from 'luxon'
import param from 'jquery-param'
import { when } from 'jquery'
const TOKEN = process.env.STRAPI_API_KEY
const Authorization = `Bearer ${TOKEN}`
const BASE_URL = 'https://careers.liping.edu.hk/strapi/api'

const getHandler = async (req, res) => {
  const query = req.query
  const { draw, length, start, order } = query

  const qs = param(query).split('&draw')[0]

  let padding = 0

  let modifiedQuery = qs
  modifiedQuery += `&pagination[start]=${start}`
  modifiedQuery += `&pagination[limit]=${length}`

  const reducedKeys = Object.keys(query).reduce((prev, key, index, keys) => {
    const orderRegex = /order\[(?<order>\d)\]\[column\]/
    const matchOrder = orderRegex.exec(key)

    if (matchOrder && matchOrder.groups) {
      const { order } = matchOrder.groups
      const column = query[key]
      if (order) {
        const columnName = query[`columns[${column}][data]`]
        const dir = query[`order[${order}][dir]`]
        if (columnName && dir) {
          prev.push({
            key: 'sort',
            order,
            name: columnName,
            value: dir
          })
        }
      }
    }

    return prev
  }, [])

  reducedKeys.forEach(({ key, name, value }, index) => {
    modifiedQuery += `&${key}[${index}]=${name}:${value}`
  })
  try {
    const url = `${BASE_URL}/conducts?${modifiedQuery}`
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

const postHandler = async (req, res) => {
  const { data } = req.body
  try {
    const response = await fetch(`${BASE_URL}/conducts`, {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: {
        Authorization,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const json = await response.json()

      res.status(500).json({
        message: 'Error accessing strapi server:' + JSON.stringify(json)
      }) // Handle errors
    }

    const json = await response.json()

    res.status(200).json(json) // Send back the response
  } catch (error) {
    console.error('Error accessing strapi server:', error)
    res.status(500).json({ message: error.message }) // Handle errors
  }
}

export default async function handler(req, res) {
  const { method } = req
  const body = { ...req.body }
  delete req.body
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  switch (method) {
    case 'POST':
      req.body = body
      await postHandler(req, res)
      break
    default:
      await getHandler(req, res)
  }
}
