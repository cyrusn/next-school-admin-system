import Link from 'next/link'
import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'

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
  const calenderEventUrl =
    'https://docs.google.com/spreadsheets/d/1yxF61VcBGgMb8RlO-_MgsI9GlF2XhcyiaJtL3KVHwkE/edit?gid=0#gid=0'

  const regularActivity =
    'https://docs.google.com/document/d/1tuNpW9XFJZ0oLEiAzBQMdfgOWC1LoXiXeG4TFentkWg/edit?tab=t.0#heading=h.u0k2orlzzmwe'

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
      <p className='menu-label'>Discipline</p>
      <ul className='menu-list'></ul>
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
