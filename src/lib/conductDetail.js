import {
  DEDUCTION_ITEM_CODES,
  ADDITION_ITEM_CODES,
  MERIT_DEMERIT_CODES,
  CREDIT_ITEM_CODES,
  MISCONDUCT_ITEM_CODES,
  ABSENCE_TYPES,
  LATE_TYPES,
  EARLY_LEAVE_TYPES
} from '@/config/constant'

export const BASE_MARK = 65

export function mergeAccumulateAndCurrentDataToSingleObject(
  accumulateData,
  currentData
) {
  const modifiedCurrentData = currentData.map(convertSingleData)

  return accumulateData.map((accData) => {
    const { id, attributes: accumulatedAttributes } = convertSingleData(accData)
    const result = { id, accumulatedAttributes }
    const { regno } = accumulatedAttributes
    const found = modifiedCurrentData.find((c) => {
      const { attributes } = c
      return attributes.regno == regno
    })

    if (found) {
      result.currentAttributes = found.attributes
    }
    return result
  })
}

export function addConductDetailToSummaryData(data) {
  return data.map(convertSingleData)
}

function convertGrade_(mark, noMisconduct = true) {
  switch (true) {
    case mark >= 91 && noMisconduct:
      return 'A'
    case mark >= 86:
      return 'A-'
    case mark >= 81:
      return 'B+'
    case mark >= 76:
      return 'B'
    case mark >= 71:
      return 'B-'
    case mark >= 66:
      return 'C+'
    case mark >= 61:
      return 'C'
    case mark >= 56:
      return 'C-'
    case mark >= 51:
      return 'D+'
    case mark >= 46:
      return 'D'
    case mark >= 41:
      return 'D-'
    case mark >= 26:
      return 'E'
    default:
      return 'F'
  }
}

function convertSingleData({ id, attributes }) {
  const meritDemerit = MERIT_DEMERIT_CODES.reduce((prev, { code, key }) => {
    prev[key] = parseInt(attributes[code])
    return prev
  }, {})

  const totalMisconduct = MISCONDUCT_ITEM_CODES.reduce((prev, { code }) => {
    return (prev += parseInt(attributes[code]) || 0)
  }, 0)

  const deduction = DEDUCTION_ITEM_CODES.reduce((prev, { code }) => {
    return (prev += parseInt(attributes[code]) || 0)
  }, 0)

  const absence = ABSENCE_TYPES.reduce((prev, { key }) => {
    if (key === 'absentHalfDay') {
      return (prev += parseInt(attributes[key]) || 0)
    } else {
      return (prev += parseInt(attributes[key]) / 2 || 0)
    }
  }, 0)

  const addition = ADDITION_ITEM_CODES.reduce((prev, { code }) => {
    if (code == 380) {
      prev += Math.min(25, parseInt(attributes[code]) || 0) // Academic
      return prev
    }
    prev += Math.min(10, parseInt(attributes[code]) || 0) // Academic
    return prev
  }, 0)

  const late = LATE_TYPES.reduce((prev, { key }) => {
    return (prev += parseInt(attributes[key]) || 0)
  }, 0)

  const mark = BASE_MARK + deduction + addition

  return {
    id,
    attributes: {
      absence,
      late,
      addition,
      deduction,
      mark,
      grade: convertGrade_(mark, totalMisconduct == 0),
      ...attributes,
      ...meritDemerit
    }
  }
}
