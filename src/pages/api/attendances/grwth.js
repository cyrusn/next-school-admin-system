import { createHash } from 'crypto'

const API_KEY = process.env.GRWTH_API_KEY

const SCHOOL_CODE = 230871

const BASE_URL = 'https://app.grwth.hk/schoolpf/attendance/getDataByDate'

const TYPE_MAPPERS = {
  ATTEND: 11,
  LATE: 12,
  ABSENT: 13,
  EARLY_LEAVE: 14
}
const FREQ_MAPPERS = {
  AM: '上午',
  PM: '下午'
}

export const md5Hash = (input) => {
  return createHash('md5').update(input, 'utf8').digest('hex')
}

export function GetGrwthHeaders() {
  const timestamp = String(new Date() - 0)
  const input = SCHOOL_CODE + API_KEY + timestamp
  const sign = md5Hash(input)
  return {
    timestamp,
    SCHOOL_CODE,
    sign
  }
}

export async function GetGrwthData({ eventDate, type, frequency }) {
  const allowTypes = ['ATTEND', 'LATE', 'ABSENT', 'EARLY_LEAVE']
  const allowFrequency = ['AM', 'PM']
  if (!allowTypes.includes(type)) return

  const timestamp = String(new Date() - 0)
  const input = SCHOOL_CODE + API_KEY + timestamp
  const sign = md5Hash(input)

  const qs = `?eventDate=${eventDate}&result=${TYPE_MAPPERS[type]}`

  const response = await fetch(`${BASE_URL}${qs}`, {
    method: 'get',
    headers: {
      sign,
      timestamp,
      schoolCode: SCHOOL_CODE
    },
    muteHttpExceptions: true
  })

  const json = await response.json()
  if (!response.ok) {
    throw new Error('Error on fetching from Grwth Database', response.error)
  }

  const { code, data, en_msg } = json

  if (!data) return []

  return data
    .filter((s) => {
      if (!frequency) return true

      if (!allowFrequency.includes(frequency)) return true

      return s.frequency == FREQ_MAPPERS[frequency]
    })
    .sort((a, b) => {
      const sorterA = `${a.className}${String(a.classNo).padStart(2, 0)}`
      const sorterB = `${b.className}${String(b.classNo).padStart(2, 0)}`
      return sorterA.localeCompare(sorterB)
    })
}

export default async function handler(req, res) {
  const { eventDate, type, frequency } = req.query
  const result = await GetGrwthData({ eventDate, type, frequency })
  res.status(200).json(result)
  try {
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error accessing grwth' })
  }
}
