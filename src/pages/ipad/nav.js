import Nav from '@/components/nav'
import { useSession } from 'next-auth/react'

export default function IpadNav() {
  const { data: session, status } = useSession()
  const paths = [
    { href: '/ipad/form', label: 'Form' },
    { href: '/ipad/result', label: 'Result' }
  ]

  return <Nav paths={paths} title='iPad Application Records' />
}
