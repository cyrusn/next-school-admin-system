import param from 'jquery-param'
import { TIMEZONE } from '@/config/constant'
import { DateTime } from 'luxon'

export function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    value === NaN ||
    (typeof value == 'object' && Object.keys(value).length == 0) ||
    (typeof value == 'string' && value.trim().length == 0)
  )
}

export const convertRangeObjectsToRows = (rangeObjects, headerKeys) => {
  return rangeObjects.map((obj) => {
    obj.timestamp = getTimestamp()

    return {
      range: obj.range,
      values: [
        headerKeys.map((key) => {
          const value = obj[key]
          return Array.isArray(value) ? value.join(',') : value
        })
      ]
    }
  })
}

export const convertRowsToCollection = (rows, rangeFunc) => {
  const headerRow = rows.shift()
  return rows.map((row, index) => {
    const rowNo = index + 2
    let initRowData = {}
    if (rangeFunc) {
      const range = rangeFunc(rowNo)
      initRowData.range = range
    }
    return headerRow.reduce((prev, key, n) => {
      return { ...prev, [key]: row[n] || '' }
    }, initRowData)
  })
}

export const getDisplayName = (student) => {
  if (isEmpty(student)) return ''
  const { classcode, classno, name, cname, ename } = student

  return `${classcode}${String(classno).padStart(2, '0')} ${cname || name || ename}`
}

export const getUserInfo = (email, users) => {
  const found = users.find((u) => u.email == email)
  if (found) {
    return found
  }
  return {}
}

export const dataTableQueryStrapiConverter = (query) => {
  const newQuery = Object.keys(query).reduce((prev, key) => {
    const orderRegex = /order\[(?<order>\d)\]\[column\]/
    const matchOrder = orderRegex.exec(key)

    if (matchOrder?.groups) {
      const { order } = matchOrder.groups
      const column = query[key]
      if (order) {
        const columnName = query[`columns[${column}][data]`]
        const dir = query[`order[${order}][dir]`]
        if (columnName && dir) {
          prev[`sort[${order}]`] = `${columnName}:${dir}`
        }
      }
    }
    const orderOtherRegex = /order\[\d.*\]/
    if (key.match(orderOtherRegex) !== null) {
      return prev
    }

    const columnSearchRegex = /columns\[\d.+\](.*)/
    if (key.match(columnSearchRegex) !== null) {
      return prev
    }

    const globalSearchRegex = /search\[\w.*\]/
    if (key.match(globalSearchRegex) !== null) {
      return prev
    }

    if (key == 'draw') {
      return prev
    }

    if (key == 'start') {
      prev['pagination[start]'] = query['start']
      return prev
    }

    if (key == 'limit' || key == 'length') {
      prev['pagination[limit]'] = query['limit'] || query['length']
      return prev
    }

    prev[key] = query[key]

    return prev
  }, {})

  const qs = decodeURI(param(newQuery))

  return { draw: query.draw || 1, qs }
}

export const getTimestamp = () => {
  return DateTime.now().setZone(TIMEZONE).toFormat("yyyy-MM-dd'T'HH:mm:ss")
}
