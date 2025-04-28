import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session, status } = useSession()
  return (
    <div className='message is-success'>
      <div className='message-body'>
        Welcome Back, {session?.user?.info.initial}. Please select service from
        the menu to start.
      </div>
    </div>
  )
}
