import Nav from '@/components/nav'
import { useSession } from 'next-auth/react'

const NEXT_PUBLIC_OLE_SPREADSHEET_URL =
  process.env.NEXT_PUBLIC_OLE_SPREADSHEET_URL

export default function OleNav() {
  const { data: session, status } = useSession()
  const paths = [
    { href: '/ole/create', label: 'Create' },
    { href: '/ole/event', label: 'Event' },
    {
      href: NEXT_PUBLIC_OLE_SPREADSHEET_URL,
      label: 'Spreadsheet',
      isExternalLink: true
    },
    { href: '#', label: 'Photos', isExternalLink: true }
  ]

  return <Nav paths={paths} title='OLE Record' />
}
