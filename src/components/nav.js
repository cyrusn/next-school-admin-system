import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Nav({ defaultPage, paths, title }) {
  const [page, setPage] = useState('form')
  const handlePage = (p) => {
    setPage(p)
  }

  const router = useRouter() // Get the current route
  const segments = router.pathname.split('/')
  const pathname = segments[segments.length - 1]

  return (
    <div className='level'>
      <div className='level-start'>
        <div className='level-item has-text-centered'>
          <h1 className='title'>{title}</h1>
        </div>
      </div>
      <div className='level-end'>
        <div className='tabs is-toggle is-toggle-rounded'>
          <ul>
            {paths.map(({ href, label, isExternalLink }, key) => {
              if (isExternalLink) {
                return (
                  <li key={key}>
                    {' '}
                    <Link href={href} target='_blank'>
                      {' '}
                      {label}{' '}
                    </Link>{' '}
                  </li>
                )
              }
              const segments = href.split('/')
              const name = segments[segments.length - 1]
              return (
                <li
                  key={key}
                  className={`${pathname == name ? 'is-active' : ''}`}
                >
                  <Link href={href} onClick={() => handlePage(name)}>
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
