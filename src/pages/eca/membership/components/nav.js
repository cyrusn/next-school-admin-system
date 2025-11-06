import Nav from '@/components/nav'

export default function EcaNav() {
  const paths = [
    { href: '/eca/membership/members', label: 'Members' },
    { href: '/eca/membership/record', label: 'Record' }
  ]

  return <Nav paths={paths} title='ECA Membership' />
}
