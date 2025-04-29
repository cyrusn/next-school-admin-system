import Nav from './components/nav'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ROLE_ENUM } from '@/config/constant'

const AttendanceRecord = () => {
  const { data: session } = useSession()
  const router = useRouter()

  if (session.user?.info?.role < ROLE_ENUM['OFFICE_STAFF']) {
    router.push('/') // Redirect to home page
    return
  }

  return (
    <>
      <Nav />
      <h1>Record</h1>
    </>
  )
}
export default AttendanceRecord
