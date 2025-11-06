import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import Navigator from '../components/navigator'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import ThemeSelector from '@/components/themeSelector'
const NEXT_PUBLIC_SCHOOL_NAME = process.env.NEXT_PUBLIC_SCHOOL_NAME

const Navbar = () => {
  const { data: session, status } = useSession()
  const [isActive, setIsActive] = useState(false)
  const pathname = usePathname()
  const handleLogin = () => {
    signIn('google')
  }

  useEffect(() => {
    setIsActive(false)
  }, [pathname])

  return (
    <nav className='navbar is-transparent has-shadow not-print'>
      <div className='navbar-brand'>
        <Link href='/' className='navbar-item has-text-weight-bold'>
          <span className='is-hidden-touch icon-text'>
            <span className='icon'>
              <FontAwesomeIcon icon={faHome} />
            </span>
            {NEXT_PUBLIC_SCHOOL_NAME}
          </span>
          <span id='user' className='is-hidden-desktop icon-text'>
            <span className='icon'>
              <FontAwesomeIcon icon={faHome} />
            </span>
            SKHLPSS{' '}
            {session && (
              <span className='has-text-weight-light'>
                <small>{session?.user?.info?.initial}</small>
              </span>
            )}
          </span>
        </Link>

        <a
          role='button'
          className='navbar-burger'
          onClick={() => setIsActive(!isActive)}
        >
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
        </a>
      </div>

      <div className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
        <div className='navbar-start'>
          <Navigator user={session?.user?.info} />
        </div>

        <div className='navbar-end'>
          <ThemeSelector />

          {session ? (
            <div className='navbar-item'>
              <h2>Welcome back, {session.user?.info?.initial}!</h2>
            </div>
          ) : (
            <div className='navbar-item'>
              <a className='button is-success' onClick={handleLogin}>
                Sign in with Google
              </a>
            </div>
          )}
          <div className='navbar-item'>
            <a className='button is-danger' onClick={() => signOut()}>
              Sign Out
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
