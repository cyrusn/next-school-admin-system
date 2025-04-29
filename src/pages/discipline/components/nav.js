import Nav from '@/components/nav'
import { useSession } from 'next-auth/react'
import { ROLE_ENUM } from '@/config/constant'

export default function DisciplineNav() {
  const { data: session, status } = useSession()

  const paths = [
    { href: '/discipline/mark', label: 'Mark' },
    { href: '/discipline/meritDemerit', label: 'Merit / Demerit' },
    { href: '/discipline/record', label: 'Record' }
  ]
  const ROLE = session?.user.info.role

  if (ROLE_ENUM[ROLE] >= ROLE_ENUM['DC_TEAM']) {
    paths.push({ href: '/discipline/summary', label: 'Summary' })
  }

  return <Nav paths={paths} title='Conduct' />
}
