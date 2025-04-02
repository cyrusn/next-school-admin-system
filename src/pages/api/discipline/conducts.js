import { getSession } from 'next-auth/react'
import { DateTime } from 'luxon'
import param from 'jquery-param'
const TOKEN = process.env.STRAPI_API_KEY
const Authorization = `Bearer ${TOKEN}`
const BASE_URL = 'https://careers.liping.edu.hk/strapi/api'

const getHandler = async (req, res) => {
  const query = req.query

  const qs = param(query)

  try {
    const url = `${BASE_URL}/conducts?${qs}`
    const response = await fetch(url, {
      headers: {
        Authorization
      }
    })
    const json = await response.json()

    const { meta, data } = json

    res.status(200).json({
      meta,
      data: data.map(({ id, attributes }) => ({
        id,
        ...attributes
      }))
    })
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
