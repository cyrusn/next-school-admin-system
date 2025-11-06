import Nav from '@/components/nav'
import { ROLE_ENUM } from '@/config/constant'

export default function AttendanceNav({ role }) {
  const paths = []
  if (ROLE_ENUM[role] < ROLE_ENUM['OFFICE_STAFF']) {
    paths.push({ href: '/attendance/record', label: 'Record' })
  } else {
    paths.push(
      { href: '/attendance', label: 'Attendance' },
      { href: '/attendance/record', label: 'Record' }
    )
  }

  return <Nav paths={paths} title='Attendance' />
}
