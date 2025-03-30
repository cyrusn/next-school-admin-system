import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Nav({ defaultPage, paths }) {
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
        {paths.map(({ href, label, name }, key) => {
          return (
            <li className={`${pathname == name && 'is-active'}`} key={key}>
              <Link href={href} onClick={() => handlePage(name)}>
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
