import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ROLE_ENUM } from '@/config/constant'

const calenderEventUrl = process.env.NEXT_PUBLIC_CALENDAR_EVENT_SPREADSHEET_URL
const regularActivity = process.env.NEXT_PUBLIC_REGULAR_ACTIVITY_DOCUMENT_URL
const itavBooking = process.env.NEXT_PUBLIC_ITAV_BOOKING
const itavRepair = process.env.NEXT_PUBLIC_ITAV_REPAIR
const gotYourBackUrl = process.env.NEXT_PUBLIC_GOT_YOUR_BACK

const PageLink = ({ href, title }) => {
  return (
    <Link
      href={href}
      className='navbar-item'
      onClick={(e) => {
        e.target.blur()
      }}
    >
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
      <NavbarDropdown title='General' includedPaths={['duty']}>
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
        <PageLink title='Duty List' href='/duty' />
      </NavbarDropdown>

      <NavbarDropdown title='Academic' includedPaths={['academic']}>
        <PageLink title='Documents' href='/academic/documents' />
      </NavbarDropdown>

      <NavbarDropdown
        title='School Admin'
        includedPaths={[
          'namelist',
          'timetable',
          'teachers',
          'announcement',
          'resource',
          'profile',
          'photo',
          'specialTimetable'
        ]}
      >
        <PageLink title='Namelist' href='/namelist' />
        <PageLink title='Timetable' href='/timetable' />
        <PageLink title='Teacher List' href='/teachers' />
        <PageLink title='Announcement' href='/announcement' />
        <PageLink title='Resource Booking' href='/resource' />
        <PageLink title='Student Profile' href='/profile' />
        <PageLink title='Student Photos' href='/photo' />
        <PageLink title='Speical Timetable' href='/specialTimetable' />
      </NavbarDropdown>

      <NavbarDropdown title='ITAV'>
        <Link href={itavBooking} target='_blank' className='navbar-item'>
          ITAV Booking (Green Form)
        </Link>
        <Link href={itavRepair} target='_blank' className='navbar-item'>
          ITAV Repair Service
        </Link>
      </NavbarDropdown>
      <NavbarDropdown
        title='Discipline'
        includedPaths={['discipline', 'attendance', 'ipad']}
      >
        {ROLE_ENUM[user?.role] >= ROLE_ENUM['OFFICE_STAFF'] ? (
          <PageLink title='Attendance' href='/attendance' />
        ) : (
          <PageLink title='Attendance' href='/attendance/record' />
        )}
        <PageLink title='Conduct' href='/discipline' />
        <PageLink title='iPad' href='/ipad' />
      </NavbarDropdown>

      <NavbarDropdown title='Careers' includedPaths={['ole']}>
        <PageLink title='OLE Record' href='/ole' />
        <Link
          href='https://careers.liping.edu.hk/ss'
          target='_blank'
          className='navbar-item'
        >
          Subject Selection System
        </Link>
        <Link href={gotYourBackUrl} target='_blank' className='navbar-item'>
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
        includedPaths={['registration', 'membership', 'postExam', 'eca']}
      >
        <PageLink title='Club registration' href='/eca/registration' />
        <PageLink title='Membership Record' href='/eca/membership' />
        <PageLink title='Post Exam Activity' href='/postExam' />
      </NavbarDropdown>
    </>
  )
}

export default Navigator
