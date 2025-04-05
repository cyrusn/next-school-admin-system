import param from 'jquery-param'

export const convertRowsToCollection = (rows) => {
  const headers = rows.shift()
  return rows.map((row) => {
    return row.reduce((prev, cell, n) => {
      return { ...prev, [headers[n]]: cell }
    }, {})
  })
}

export const getDisplayName = ({ classcode, classno, ename, cname }) => {
  return `${classcode}${String(classno).padStart(2, '0')} ${cname || name}`
}

export const getUserInfo = (email, users) => {
  const found = users.find((u) => u.email == email)
  if (found) {
    return found
  }
  return {}
}

export const dataTableQueryStrapiConverter = (query) => {
  const newQuery = Object.keys(query).reduce((prev, key, index) => {
    const orderRegex = /order\[(?<order>\d)\]\[column\]/
    const matchOrder = orderRegex.exec(key)

    if (matchOrder?.groups) {
      const { order } = matchOrder.groups
      const column = query[key]
      if (order) {
        const columnName = query[`columns[${column}][data]`]
        const dir = query[`order[${order}][dir]`]
        if (columnName && dir) {
          prev[`${key}[${order}]`] = `${columnName}:${dir}`
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

  const qs = param(newQuery)

  return { draw: query.draw || 1, qs }
}
