import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import Navigator from '../components/navigator'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import ThemeSelector from '@/components/themeSelector'
import { useSettings } from '@/context/settingsContext'

const Navbar = () => {
  const { data: session, status } = useSession()
  const [isActive, setIsActive] = useState(false)
  const pathname = usePathname()
  const { settings } = useSettings()

  const SCHOOL_NAME = settings?.SCHOOL_NAME
  const schoolYearRaw = settings?.SCHOOL_YEAR
  let formattedSchoolYear = ''
  if (schoolYearRaw) {
    const startYear = parseInt(schoolYearRaw, 10)
    if (!isNaN(startYear) && String(startYear).length === 4) {
      const endYear = (startYear + 1) % 100
      formattedSchoolYear = `${String(startYear).slice(2)}${String(endYear).padStart(2, '0')}`
    } else {
      formattedSchoolYear = schoolYearRaw
    }
  }

  const handleLogin = () => {
    signIn('google')
  }

  useEffect(() => {
    setIsActive(false)
  }, [pathname])

  const isSystemDown =
    settings?.IS_SYSTEM_DOWN === 'true' ||
    settings?.IS_SYSTEM_DOWN === 'TRUE' ||
    settings?.IS_SYSTEM_DOWN === true

  const superAdmins = (settings?.SUPERADMIN || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
  const userEmail = session?.user?.email || ''
  const username = userEmail.split('@')[0].toLowerCase()
  const isSuperAdmin = superAdmins.includes(username)

  const isNavbarDanger = isSystemDown && isSuperAdmin

  const navbarClass = `navbar has-shadow not-print ${
    isNavbarDanger ? 'is-danger' : 'is-transparent'
  }`

  return (
    <nav className={navbarClass}>
      <div className='navbar-brand'>
        <Link href='/' className={`navbar-item has-text-weight-bold ${isNavbarDanger ? 'has-text-white' : ''}`}>
          <span className='is-hidden-touch icon-text'>
            <span className='icon'>
              <FontAwesomeIcon icon={faHome} />
            </span>

            {SCHOOL_NAME}
            {isSystemDown && (
              <span className={`tag ml-2 ${isNavbarDanger ? 'is-warning' : 'is-danger'}`}>
                Maintenance Mode
              </span>
            )}
          </span>
          <span id='user' className='is-hidden-desktop icon-text'>
            <span className='icon'>
              <FontAwesomeIcon icon={faHome} />
            </span>
            SKHLPSS
            {session && (
              <span className='has-text-weight-light'>
                <small>{session?.user?.info?.initial}</small>
              </span>
            )}
            {isSystemDown && (
              <span className={`tag ml-2 ${isNavbarDanger ? 'is-warning' : 'is-danger'}`}>
                Maint.
              </span>
            )}
          </span>
        </Link>

        <a
          role='button'
          className={`navbar-burger ${isNavbarDanger ? 'has-text-white' : ''}`}
          onClick={() => setIsActive(!isActive)}
        >
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
        </a>
      </div>

      <div className={`navbar-menu ${isActive ? 'is-active' : ''} ${isNavbarDanger ? 'has-background-danger' : ''}`}>
        <div className='navbar-start'>
          <Navigator user={session?.user?.info} />
        </div>

        <div className='navbar-end'>
          <ThemeSelector />
          {session ? (
            <div className='navbar-item'>
              <h2 className={isNavbarDanger ? 'has-text-white' : ''}>
                Welcome back, {session.user?.info?.initial}!
              </h2>
            </div>
          ) : (
            <div className='navbar-item'>
              <a className='button is-success' onClick={handleLogin}>
                Sign in with Google
              </a>
            </div>
          )}
          <div className='navbar-item'>
            <div className='buttons'>
              <a className='button is-danger' onClick={() => signOut()}>
                Sign Out
              </a>
              {formattedSchoolYear && (
                <span>
                  <span className='button is-info'>{formattedSchoolYear}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
