import Nav from '@/components/nav'

export default function NamelistNav() {
  const paths = [
    { href: '/namelist/basic', label: 'Basic' },
    { href: '/namelist/advance', label: 'Advance' },
    { href: '/namelist/report', label: 'Report' }
  ]

  return <Nav paths={paths} title='Namelist' />
}
