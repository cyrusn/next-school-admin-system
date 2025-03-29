import Link from 'next/link'
import { useSession } from 'next-auth/react'
import ProtectedRoute from '../components/protectedRoute'

export default function Home() {
  const { data: session, status } = useSession()
  return (
    <ProtectedRoute>
      {session ? (
        <div className='message is-success'>
          <div className='message-body'>
            Welcome Back, {session.user.info?.initial}. Please select service from the
            menu to start.
          </div>
        </div>
      ) : (
        <div>
          <h1>Please login again</h1>
        </div>
      )}
    </ProtectedRoute>
  )
}
