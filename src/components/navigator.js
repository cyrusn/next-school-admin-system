import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ROLE_ENUM } from '@/config/constant'
import { useSettings } from '@/context/settingsContext'

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
  const rootPath = pathname?.split('/')[1] || ''
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
  const { settings } = useSettings()

  const calenderEventUrl = settings?.CALENDAR_EVENT_SPREADSHEET_URL || '#'
  const regularActivity = settings?.REGULAR_ACTIVITY_DOCUMENT_URL || '#'
  const itavBooking = settings?.ITAV_BOOKING || '#'
  const itavRepair = settings?.ITAV_REPAIR || '#'
  const gotYourBackUrl = settings?.GOT_YOUR_BACK || '#'

  return (
    <>
      <NavbarDropdown title='General' includedPaths={['duty']}>
        <a
          href='https://liping.edu.hk/'
          target='_blank'
          className='navbar-item'
        >
          School Page
        </a>
        <a
          href='https://eclass.liping.edu.hk/'
          target='_blank'
          className='navbar-item'
        >
          eClass
        </a>
        <a
          href='http://clog.liping.edu.hk:3000/'
          target='_blank'
          className='navbar-item'
        >
          School Journal
        </a>
        <a href={calenderEventUrl} target='_blank' className='navbar-item'>
          Calender Event
        </a>
        <a href={regularActivity} target='_blank' className='navbar-item'>
          Regular Activity
        </a>
        <PageLink title='Duty List' href='/duty' />
        <PageLink title='Schedules' href='/schedules' />
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
          'schedules',
          'substitutionRecord'
        ]}
      >
        <PageLink title='Namelist' href='/namelist' />
        <PageLink title='Timetable' href='/timetable' />
        <PageLink title='Teacher List' href='/teachers' />
        <PageLink title='Announcement' href='/announcement' />
        <PageLink title='Resource Booking' href='/resource' />
        <PageLink title='Student Profile' href='/profile' />
        <PageLink title='Student Photos' href='/photo' />
        <PageLink title='Substitution Records' href='/substitution_record' />
      </NavbarDropdown>

      <NavbarDropdown title='ITAV'>
        <a href={itavBooking} target='_blank' className='navbar-item'>
          ITAV Booking (Green Form)
        </a>
        <a href={itavRepair} target='_blank' className='navbar-item'>
          ITAV Repair Service
        </a>
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
        <a
          href={process.env.NEXT_PUBLIC_SUBJECT_SELECTION_URL}
          target='_blank'
          className='navbar-item'
        >
          Subject Selection System
        </a>
        <a href={gotYourBackUrl} target='_blank' className='navbar-item'>
          Got Your Back Record
        </a>
      </NavbarDropdown>
      {
        //<p className='menu-label'>Staff Development</p>
        //<ul className='menu-list'></ul>
        //<p className='menu-label'>ECA</p>
        //<ul className='menu-list'></ul>
      }
      <NavbarDropdown
        title='ECA'
        includedPaths={['registration', 'membership', 'post_exam', 'eca']}
      >
        <PageLink title='Club registration' href='/eca/registration' />
        <PageLink title='Membership Record' href='/eca/membership' />
        <PageLink title='Post Exam Activity' href='/post_exam' />
      </NavbarDropdown>
      <NavbarDropdown title='Tools'>
        <a
          href='https://api.liping.edu.hk/qrcode'
          target='_blank'
          className='navbar-item'
        >
          QR Code Generator
        </a>
      </NavbarDropdown>
    </>
  )
}

export default Navigator
