import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef } from 'react'
import { ROLE_ENUM } from '@/config/constant'

const calenderEventUrl = process.env.NEXT_PUBLIC_CALENDAR_EVENT_SPREADSHEET_URL
const regularActivity = process.env.NEXT_PUBLIC_REGULAR_ACTIVITY_DOCUMENT_URL

const PageLink = ({ href, title }) => {
  return (
    <Link href={href} className='navbar-item'>
      {title}
    </Link>
  )
}

const NavbarDropdown = ({ includedPaths, title, children }) => {
  const pathname = usePathname()
  const rootPath = pathname.split('/')[1]
  return (
    <div className='navbar-item has-dropdown is-hoverable'>
      <a
        className={`navbar-link is-arrowless ${includedPaths?.includes(rootPath) ? 'has-text-weight-bold has-text-link' : ''}`}
      >
        {title}
      </a>
      <div className='navbar-dropdown is-boxed'>{children}</div>
    </div>
  )
}

const Navigator = ({ user }) => {
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

      <NavbarDropdown
        title='School Admin'
        includedPaths={['announcement', 'resource']}
      >
        <PageLink title='Announcement' href='/announcement' />
        <PageLink title='Resource Booking' href='/resource' />
        <PageLink title='Student Profile' href='/profile' />
        <PageLink title='Student Photos' href='/photo' />
        <PageLink title='CPD Record' href='/cpd' />
      </NavbarDropdown>
      <NavbarDropdown title='ITAV'>
        <Link href='#' target='_blank' className='navbar-item'>
          ITAV Booking (Green Form)
        </Link>
        <Link href='#' target='_blank' className='navbar-item'>
          ITAV Repair Service
        </Link>
      </NavbarDropdown>
      <NavbarDropdown
        title='Discipline'
        includedPaths={['discipline', 'attendance']}
      >
        {ROLE_ENUM[user?.role] >= ROLE_ENUM['OFFICE_STAFF'] ? (
          <PageLink title='Attendance' href='/attendance' />
        ) : (
          <PageLink title='Attendance' href='/attendance/record' />
        )}
        <PageLink title='Conduct' href='/discipline' />
      </NavbarDropdown>

      <NavbarDropdown title='Careers' includedPaths={['ole']}>
        <PageLink title='OLE Record' href='/ole' />
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
      <NavbarDropdown
        title='ECA'
        includedPaths={['registration', 'membership', 'postExam']}
      >
        <PageLink title='Club registration' href='/registration' />
        <PageLink title='Membership Record' href='/membership' />
        <PageLink title='Post Exam Activity' href='/postExam' />
      </NavbarDropdown>
    </>
  )
}

export default Navigator
