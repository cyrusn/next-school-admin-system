import Nav from '@/components/nav'

export default function IpadNav() {
  const paths = [
    { href: '/ipad/form', label: 'Form' },
    { href: '/ipad/record', label: 'Record' }
  ]

  return <Nav paths={paths} title='iPad Application Records' />
}
