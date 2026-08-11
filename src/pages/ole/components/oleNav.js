import Nav from '@/components/nav'
import { useSession } from 'next-auth/react'
import { useSettings } from '@/context/settingsContext'

export default function OleNav() {
  const { data: session, status } = useSession()
  const { settings } = useSettings()

  const OLE_SPREADSHEET_URL = settings?.OLE_SPREADSHEET_URL || '#'
  const OLE_PHOTO_URL = settings?.OLE_PHOTO_URL || '#'

  const paths = [
    { href: '/ole/create', label: 'Create' },
    { href: '/ole/event', label: 'Event' },
    {
      href: OLE_SPREADSHEET_URL,
      label: 'Spreadsheet',
      isExternalLink: true
    },
    { href: OLE_PHOTO_URL, label: 'Photos', isExternalLink: true }
  ]

  return <Nav paths={paths} title='OLE Record' />
}
