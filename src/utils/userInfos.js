import { getSheetData } from './googleSheet'

// Create a Context

let userInfos = []
// Create a Provider component
export async function getUserInfos() {
  if (userInfos.length !== 0) return userInfos

  const spreadsheetId = process.env.TEACHER_GOOGLE_SHEET_ID
  userInfos = await getSheetData(spreadsheetId, 'A1:G')
  return userInfos
}
