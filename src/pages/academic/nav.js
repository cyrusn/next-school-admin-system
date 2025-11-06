import Nav from '@/components/nav'

export default function AcademicNav() {
  const paths = [{ href: '/academic/documents', label: 'Documents' }]

  return <Nav paths={paths} title='Academic' />
}
