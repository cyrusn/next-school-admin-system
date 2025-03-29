import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const ProtectedRoute = ({ children }) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Do nothing while loading
    if (!session) {
      // Redirect to login page if not authenticated
      router.push('/unauthorised')
    }
  }, [session, status, router])

  // If the session is loading or the user is not authenticated, return null (or a loading spinner)
  if (status === 'loading' || !session) {
    return null // You can also return a loading spinner here
  }

  return children // Render the protected content
}

export default ProtectedRoute
