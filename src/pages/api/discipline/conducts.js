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
    // Don't search in DataTable
    //const columnRegex = /columns\[(?<column>\d)\]\[name\]/
    //const matchSearch = columnRegex.exec(key)
    //
    //if (matchSearch && matchSearch.groups) {
    //  const { column } = matchSearch.groups
    //  console.log(column)
    //  if (column) {
    //    const columnName = query[`columns[${column}][name]`]
    //    const columnData = query[`columns[${column}][data]`]
    //    const columnSearchable = query[`columns[${column}][searchable]`]
    //    const columnOrderable = query[`columns[${column}][orderable]`]
    //    const columnSearchValue = query[`columns[${column}][search][value]`]
    //    const columnSearchRegex = query[`columns[${column}][search][regex]`]
    //
    //  }
    //}

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
export default async function handler(req, res) {
  const { method } = req
  const body = { ...req.body }
  delete req.body
  const session = await getSession({ req, method: 'GET' })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  switch (method) {
    default:
      await getHandler(req, res)
  }
}
