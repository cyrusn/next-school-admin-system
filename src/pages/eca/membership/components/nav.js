import Nav from '@/components/nav'

export default function OleNav() {
  const paths = [
    { href: '/eca/membership/evaluation', label: 'Evaluation' },
    { href: '/eca/membership/record', label: 'Record' }
  ]

  return <Nav paths={paths} title='ECA Membership' />
}
