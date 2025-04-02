import Nav from '@/components/nav'
import { useSession } from 'next-auth/react'
import { ROLE_ENUM } from '@/config/constant'

export default function DisciplineNav() {
  const { data: session, status } = useSession()

  const paths = [
    { href: '/discipline/form', label: 'Form' },
    { href: '/discipline/merit_demerit', label: 'Merit / Demerit' },
    { href: '/discipline/record', label: 'Record' }
  ]
  const ROLE = session?.user.info.role

  if (ROLE_ENUM[ROLE] >= ROLE_ENUM['DC_TEAM']) {
    paths.push(
      { href: '/discipline/summary', label: 'Summary' },
      { href: '/discipline/grade', label: 'Grade' },
      { href: '/discipline/teacher', label: "Teacher's Record" }
    )
  }

  return <Nav paths={paths} />
}
