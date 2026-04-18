import { getSheetData } from './googleSheet'
import { getSettings } from '@/utils/settings'

export async function getUserInfos() {
  const settings = await getSettings()
  const spreadsheetId = settings.TEACHER_GOOGLE_SHEET_ID
  const userInfos = await getSheetData(spreadsheetId, 'A1:H')
  return userInfos
}
