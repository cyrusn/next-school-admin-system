function convertRowsToCollection(rows) {
  const headers = rows.shift()
  return rows.map((row) => {
    return row.reduce((prev, cell, n) => {
      return { ...prev, [headers[n]]: cell }
    }, {})
  })
}

function getUserInfo(email, users) {
  const found = users.find((u) => u.email == email)
  if (found) {
    return found
  }
  return {}
}

module.exports = {
  convertRowsToCollection,
  getUserInfo
}
