import { getTeachersData } from '@/pages/api/teachers'

export async function getUserInfos() {
  const userInfos = await getTeachersData()
  return userInfos
}
