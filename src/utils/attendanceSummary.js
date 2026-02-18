import { SCHOOL_YEAR, TERM } from '@/config/constant'
import _ from 'lodash'

const TOKEN = process.env.STRAPI_API_KEY
const Authorization = `Bearer ${TOKEN}`
const BASE_URL = 'https://careers.liping.edu.hk/strapi/api'

export async function getAttendanceSummary() {
  const qs = `filters[schoolYear]=${SCHOOL_YEAR}&filters[term]=${TERM}&pagination[pageSize]=800`
  const url =
    'https://careers.liping.edu.hk/strapi/api/attendances/summary?' + qs

  const response = await fetch(url, {
    Authorization
  })

  if (!response.ok) {
    console.error(response)
    throw new Error('Fail to fetch attendances summary')
  }

  const json = await response.json()
  const { meta, data } = json

  return data.map(
    ({
      lateNormalAm,
      lateNormalPm,
      lateHalfDay,
      absentNormalAm,
      absentHalfDay,
      absentNormalPm,
      absentOnlineLesson,
      earlyLeave,
      regno
    }) => {
      const absentTypes = [absentNormalAm, absentHalfDay, absentNormalPm]
      const lateTypes = [lateNormalAm, lateNormalPm, lateHalfDay]
      return {
        absentOnlineLesson,
        earlyLeave,
        regno,
        absent: absentTypes.reduce((prev, cur) => {
          prev += _.parseInt(cur)
          return prev
        }, 0),
        late: lateTypes.reduce((prev, cur) => {
          prev += _.parseInt(cur)
          return prev
        }, 0)
      }
    }
  )
}
