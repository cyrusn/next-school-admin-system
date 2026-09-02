import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import Navigator from '../components/navigator'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import ThemeSelector from '@/components/themeSelector'
import { useSettings } from '@/context/settingsContext'
import { useStudentsContext } from '@/context/studentContext'

const Navbar = () => {
  const { data: session, status } = useSession()
  const [isActive, setIsActive] = useState(false)
  const pathname = usePathname()
  const { settings } = useSettings()
  const { showDropout, setShowDropout } = useStudentsContext()
  const [isFetching, setIsFetching] = useState(false)

  const handleFetchAll = async () => {
    if (isFetching) return
    setIsFetching(true)
    try {
      const res = await fetch('/api/admin/fetch-all', { method: 'POST' })
      if (res.ok) {
        alert('Settings refetched successfully!')
        window.location.reload()
      } else {
        const err = await res.json()
        alert('Failed to refetch settings: ' + (err.error || 'Unknown error'))
      }
    } catch (e) {
      alert('Error: ' + e.message)
    } finally {
      setIsFetching(false)
    }
  }

  const SCHOOL_NAME = settings?.SCHOOL_NAME
  const schoolYearRaw = settings?.DEFAULT_SCHOOL_YEAR || settings?.SCHOOL_YEAR
  let formattedSchoolYear = ''
  if (schoolYearRaw) {
    const startYear = parseInt(schoolYearRaw)
    if (!isNaN(startYear) && String(startYear).length === 4) {
      const endYear = (startYear + 1) % 100
      formattedSchoolYear = `${String(startYear)}-${String(endYear).padStart(2, '0')}`
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

  const [currentSid, setCurrentSid] = useState('default')

  useEffect(() => {
    const sid = sessionStorage.getItem('sid')
    if (sid) setCurrentSid(sid)
  }, [])

  const cohortOptions = []
  if (isSuperAdmin && settings) {
    Object.keys(settings).forEach((key) => {
      let year = null
      if (key.startsWith('COHORT_SETTINGS_GOOGLE_SHEET_ID_')) {
        year = key.replace('COHORT_SETTINGS_GOOGLE_SHEET_ID_', '')
      } else if (key.startsWith('PREVIOUS_COHORT_SETTINGS_GOOGLE_SHEET_ID_')) {
        year = key.replace('PREVIOUS_COHORT_SETTINGS_GOOGLE_SHEET_ID_', '')
      }
      if (year && !isNaN(parseInt(year))) {
        cohortOptions.push({
          year: parseInt(year),
          sheetId: settings[key],
          label: `${year}-${String((parseInt(year) + 1) % 100).padStart(2, '0')}`
        })
      }
    })
    cohortOptions.sort((a, b) => b.year - a.year)
  }

  const handleCohortChange = (sheetId) => {
    if (sheetId === 'default') {
      sessionStorage.removeItem('sid')
      const urlObj = new URL(window.location.href)
      urlObj.searchParams.delete('sid')
      window.location.href = urlObj.toString()
    } else {
      sessionStorage.setItem('sid', sheetId)
      const urlObj = new URL(window.location.href)
      urlObj.searchParams.set('sid', sheetId)
      window.location.href = urlObj.toString()
    }
  }

  const isNavbarWarning = currentSid !== 'default'
  const activeCohortLabel = cohortOptions.find(opt => opt.sheetId === currentSid)?.label || 'Previous Cohort'

  let topBorderColor = 'none'
  if (isNavbarDanger) {
    topBorderColor = '4px solid var(--bulma-danger, #f14668)'
  }

  let bottomBorderColor = 'none'
  if (showDropout) {
    bottomBorderColor = '4px solid var(--bulma-success, #48c774)'
  } else if (isNavbarWarning) {
    bottomBorderColor = '4px solid var(--bulma-warning, #ffe08a)'
  }

  const navbarClass = 'navbar has-shadow not-print is-transparent'

  return (
    <nav
      className={navbarClass}
      style={{ borderBottom: bottomBorderColor, borderTop: topBorderColor }}
    >
      <div className='navbar-brand'>
        <Link href='/' className='navbar-item has-text-weight-bold'>
          <span className='is-hidden-touch icon-text'>
            <span className='icon'>
              <FontAwesomeIcon icon={faHome} />
            </span>

            {SCHOOL_NAME}
            <span className='tags has-addons ml-2'>
              {isSystemDown && (
                <span className='tag is-danger'>Maintenance Mode</span>
              )}
              {currentSid !== 'default' && (
                <span className='tag is-warning'>{activeCohortLabel}</span>
              )}
              {showDropout && (
                <span className='tag is-success'>Dropouts</span>
              )}
            </span>
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
            <span className='tags has-addons ml-2'>
              {isSystemDown && (
                <span className='tag is-danger'>Maint.</span>
              )}
              {currentSid !== 'default' && (
                <span className='tag is-warning'>Prev.</span>
              )}
              {showDropout && (
                <span className='tag is-success'>Dropouts</span>
              )}
            </span>
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
            <div className='buttons'>
              <a className='button is-danger' onClick={() => signOut()}>
                Sign Out
              </a>
              {isSuperAdmin ? (
                <div className='dropdown is-hoverable is-right'>
                  <div className='dropdown-trigger'>
                    <button
                      className={
                        'button ' +
                        (currentSid !== 'default' ? 'is-warning' : 'is-info')
                      }
                      aria-haspopup='true'
                      aria-controls='dropdown-menu'
                    >
                      <span>
                        {currentSid === 'default'
                          ? formattedSchoolYear
                          : `‼️${formattedSchoolYear}`}
                      </span>
                    </button>
                  </div>
                  <div className='dropdown-menu' id='dropdown-menu' role='menu'>
                    <div className='dropdown-content'>
                      <a
                        className={`dropdown-item ${currentSid === 'default' ? 'is-active' : ''}`}
                        onClick={() => handleCohortChange('default')}
                      >
                        {formattedSchoolYear
                          ? `Current (${formattedSchoolYear})`
                          : 'Current Cohort'}
                      </a>
                      {cohortOptions.length > 0 && (
                        <>
                          {cohortOptions.map((opt) => (
                            <a
                              key={opt.year}
                              className={`dropdown-item ${currentSid === opt.sheetId ? 'is-active' : ''}`}
                              onClick={() => handleCohortChange(opt.sheetId)}
                            >
                              {opt.label}
                            </a>
                          ))}
                        </>
                      )}
                      <hr className='dropdown-divider' />
                      <a
                        className='dropdown-item'
                        onClick={() => setShowDropout(!showDropout)}
                      >
                        <span
                          className={`has-text-weight-bold ${showDropout ? 'has-text-danger' : 'has-text-success'}`}
                        >
                          {showDropout ? 'Hide Dropouts' : 'Show Dropouts'}
                        </span>
                      </a>
                      <hr className='dropdown-divider' />
                      <a
                        className={`dropdown-item ${isFetching ? 'is-loading' : ''}`}
                        onClick={handleFetchAll}
                        style={{ pointerEvents: isFetching ? 'none' : 'auto' }}
                      >
                        <span className='has-text-weight-bold has-text-link'>
                          {isFetching ? 'Fetching...' : 'Fetch All Settings'}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : formattedSchoolYear ? (
                <span>
                  <span className='button is-info'>{formattedSchoolYear}</span>
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
