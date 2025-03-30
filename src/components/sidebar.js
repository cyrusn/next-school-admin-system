import Link from 'next/link'
import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'

const calenderEventUrl = process.env.NEXT_PUBLIC_CALENDAR_EVENT_SPREADSHEET_URL
const regularActivity = process.env.NEXT_PUBLIC_REGULAR_ACTIVITY_DOCUMENT_URL

const MenuTitle = ({ keyName, title, children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <p
        onClick={toggle}
        className={`menu-label ${isOpen && 'has-text-link has-text-weight-bold is-italic is-size-6 menu-label'}`}
      >
        <span className='icon-text'>
          {title}
          <span className='icon'>
            {isOpen ? (
              <FontAwesomeIcon icon={faChevronDown} />
            ) : (
              <FontAwesomeIcon icon={faChevronRight} />
            )}
          </span>
        </span>
      </p>

      {isOpen && <ul className='menu-list'>{children}</ul>}
    </>
  )
}

const Sidebar = () => {
  return (
    <aside className='menu is-normal column is-one-fifth is-fullheight'>
      <MenuTitle keyName='general' title='General'>
        <Link href='https://liping.edu.hk/' target='_blank'>
          School Page
        </Link>
        <Link href='https://eclass.liping.edu.hk/' target='_blank'>
          eClass
        </Link>
        <Link href='http://clog.liping.edu.hk:3000/' target='_blank'>
          School Journal
        </Link>
        <Link href={calenderEventUrl} target='_blank'>
          Calender Event
        </Link>
        <Link href={regularActivity} target='_blank'>
          Regular Activity
        </Link>
      </MenuTitle>

      <MenuTitle keyName='school_admin' title='School Admin'>
        <Link href='/announcement'>Announcement</Link>
      </MenuTitle>
      <p className='menu-label'>ITAV</p>
      <ul className='menu-list'></ul>
      <p className='menu-label'>Acadmemic</p>
      <ul className='menu-list'></ul>
      <MenuTitle keyName='discipline' title='Discipline'>
        <Link href='/discipline'>Discipline</Link>
      </MenuTitle>
      <p className='menu-label'>Careers</p>
      <ul className='menu-list'></ul>
      <p className='menu-label'>Staff Development</p>
      <ul className='menu-list'></ul>
      <p className='menu-label'>ECA</p>
      <ul className='menu-list'></ul>
    </aside>
  )
}

export default Sidebar
