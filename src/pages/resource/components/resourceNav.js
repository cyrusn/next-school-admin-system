import Nav from '@/components/nav'

export default function ResourceNav() {
  const paths = [
    { href: '/resource/form', label: 'Form' },
    { href: '/resource/bookings', label: 'Bookings' },
    {
      href: 'https://drive.google.com/file/d/1xRj2zy2_Ifym4ZQ3smoZZI18AUESFmVh/view',
      label: 'Tutorial',
      isExternalLink: true
    }
  ]

  return <Nav paths={paths} title='Resource Booking' />
}
