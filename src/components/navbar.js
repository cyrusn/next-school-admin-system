import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  const { data: session, status } = useSession()
  const handleLogin = () => {
    signIn('google')
  }
  return (
    <nav className='navbar is-light'>
      <div className='navbar-brand'>
        <Link href='/' className='navbar-item has-text-weight-bold'>
          <span className='is-hidden-touch icon-text'>
            <span className='icon'>
              <FontAwesomeIcon icon={faHome} />
            </span>
            S.K.H. Li Ping Secondary School
          </span>
          <span id='user' className='is-hidden-desktop icon-text'>
            <span className='icon'>
              <FontAwesomeIcon icon={faHome} />
            </span>
            SKHLPSS{' '}
            {session ? (
              <span className='has-text-weight-light'>{session.user.name}</span>
            ) : (
              ''
            )}
          </span>
        </Link>

        <button
          className='navbar-burger burger'
          aria-label='menu'
          aria-expanded='false'
        >
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
        </button>
      </div>

      <div className='navbar-menu'>
        <div className='navbar-start'></div>

        <div className='navbar-end'>
          {session ? (
            <div className='navbar-item'>
              <h2>Welcome, {session.user.name}!</h2>
              <a className='button is-danger' onClick={() => signOut()}>
                Sign Out
              </a>
            </div>
          ) : (
            <div className='navbar-item'>
              <a className='button is-success' onClick={handleLogin}>
                Sign in with Google
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
