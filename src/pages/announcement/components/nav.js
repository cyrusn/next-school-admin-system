import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'

const Nav = () => {
  const [page, setPage] = useState('form')
  const handlePage = (p) => {
    setPage(p)
  }

  const router = useRouter() // Get the current route
  const segments = router.pathname.split('/')
  const pathname = segments[segments.length - 1]

  return (
    <div className='tabs is-centered'>
      <ul>
        <li className={`${pathname == 'form' && 'is-active'}`}>
          <Link href='/announcement/form' onClick={() => handlePage('form')}>
            Form
          </Link>
        </li>
        <li className={`${pathname == 'record' && 'is-active'}`}>
          <Link
            href='/announcement/record'
            onClick={() => handlePage('record')}
          >
            Record
          </Link>
        </li>
      </ul>
    </div>
  )
}
export default Nav
