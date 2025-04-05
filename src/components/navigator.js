import Link from 'next/link'

const calenderEventUrl = process.env.NEXT_PUBLIC_CALENDAR_EVENT_SPREADSHEET_URL
const regularActivity = process.env.NEXT_PUBLIC_REGULAR_ACTIVITY_DOCUMENT_URL

const PageLink = ({ link, title }) => {
  return (
    <Link href={`/${link}`} className='navbar-item'>
      {title}
    </Link>
  )
}

const NavbarDropdown = ({ includedPaths, title, children }) => {
  return (
    <div className='navbar-item has-dropdown is-hoverable'>
      <a className='navbar-link is-arrowless'>{title}</a>
      <div className='navbar-dropdown'>{children}</div>
    </div>
  )
}

const Navigator = () => {
  return (
    <>
      <NavbarDropdown title='General'>
        <Link
          href='https://liping.edu.hk/'
          target='_blank'
          className='navbar-item'
        >
          School Page
        </Link>
        <Link
          href='https://eclass.liping.edu.hk/'
          target='_blank'
          className='navbar-item'
        >
          eClass
        </Link>
        <Link
          href='http://clog.liping.edu.hk:3000/'
          target='_blank'
          className='navbar-item'
        >
          School Journal
        </Link>
        <Link href={calenderEventUrl} target='_blank' className='navbar-item'>
          Calender Event
        </Link>
        <Link href={regularActivity} target='_blank' className='navbar-item'>
          Regular Activity
        </Link>
      </NavbarDropdown>

      <NavbarDropdown title='School Admin' includedPaths={['announcement']}>
        <PageLink title='Announcement' link='announcement' />
      </NavbarDropdown>
      {
        //<p className='menu-label'>ITAV</p>
        //<ul className='menu-list'></ul>
        //<p className='menu-label'>Acadmemic</p>
        //<ul className='menu-list'></ul>
      }
      <NavbarDropdown title='Discipline' includedPaths={['discipline']}>
        <PageLink title='Conduct' link='discipline' />
      </NavbarDropdown>

      <NavbarDropdown title='Careers' includedPaths={['ole']}>
        <PageLink title='OLE Record' link='ole' />
        <Link
          href='https://careers.liping.edu.hk'
          target='_blank'
          className='navbar-item'
        >
          Subject Selection System
        </Link>
        <Link href='#' target='_blank' className='navbar-item'>
          Got Your Back Record
        </Link>
      </NavbarDropdown>
      {
        //<p className='menu-label'>Staff Development</p>
        //<ul className='menu-list'></ul>
        //<p className='menu-label'>ECA</p>
        //<ul className='menu-list'></ul>
      }
    </>
  )
}

export default Navigator
