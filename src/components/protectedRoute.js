import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Unauthorized from '@/pages/unauthorised'

const ProtectedRoute = ({ children }) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/unauthorised')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])

  if (status === 'loading') return null

  if (!session) return <Unauthorized />

  return children
}

export default ProtectedRoute
