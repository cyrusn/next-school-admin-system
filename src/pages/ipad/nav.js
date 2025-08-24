import Nav from '@/components/nav'
import { useSession } from 'next-auth/react'

export default function IpadNav() {
  const paths = [
    { href: '/ipad/form', label: 'Form' },
    { href: '/ipad/record', label: 'Record' }
  ]

  return <Nav paths={paths} title='iPad Application Records' />
}
