import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const Unauthorized = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Check if the session is loading
    console.log(session, status)
    if (status === 'loading') return

    // If the user is logged in, redirect to the home page
    if (session) {
      router.push('/') // Redirect to home page
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])

  return (
    <div className='notification is-danger is-light'>
      <h1 className='title is-size-5'>Unauthorized Access</h1>
      <p>Please sign in with LPSS account to continue.</p>
    </div>
  )
}

export default Unauthorized
