import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Unauthorized from '@/pages/unauthorised'
import { useSettings } from '@/context/settingsContext'

const ProtectedRoute = ({ children }) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { settings, loading: settingsLoading } = useSettings()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/unauthorised')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])

  if (status === 'loading' || settingsLoading) return null

  if (!session) return <Unauthorized />

  const isSystemDown =
    settings?.IS_SYSTEM_DOWN === 'true' ||
    settings?.IS_SYSTEM_DOWN === 'TRUE' ||
    settings?.IS_SYSTEM_DOWN === true

  if (isSystemDown) {
    const superAdmins = (settings?.SUPERADMIN || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
    const userEmail = session?.user?.email || ''
    const username = userEmail.split('@')[0].toLowerCase()

    if (!superAdmins.includes(username)) {
      return (
        <div className='notification is-danger is-light'>
          <h1 className='title is-size-5'>System Maintenance</h1>
          <p>The system is currently down for maintenance. Only authorized personnel can access the content at this time.</p>
        </div>
      )
    }
  }

  return children
}

export default ProtectedRoute
