import Nav from '@/components/nav'
import { ROLE_ENUM } from '@/config/constant'

export default function AttendanceNav() {
  const paths = [
    { href: '/attendance/', label: 'Attendance' },
    { href: '/attendance/record', label: 'Record' }
  ]

  return <Nav paths={paths} title='Attendance' />
}
