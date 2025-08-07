import Nav from '@/components/nav'
import { useSession } from 'next-auth/react'

export default function OleNav() {
  const { data: session, status } = useSession()
  const paths = [
    { href: '/namelist/list', label: 'List' },
    { href: '/namelist/report', label: 'Report' }
  ]

  return <Nav paths={paths} title='Namelist' />
}
