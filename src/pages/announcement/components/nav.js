import Nav from '@/components/nav'

const AnnoucnementNav = () => {
  const paths = [
    { href: '/announcement/form', label: 'Form' },
    { href: '/announcement/record', label: 'Record' }
  ]
  return <Nav paths={paths} title='Announcement'/>
}

export default AnnoucnementNav
