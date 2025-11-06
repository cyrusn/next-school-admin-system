import { useSession } from 'next-auth/react'
import packageInfo from '../../package.json'

export const metadata = {
  title: {
    template: '%s | LPSS',
    default: 'LPSS SAS', // Fallback title
  },
};


export default function Home() {
  console.log(packageInfo.version)
  const { data: session } = useSession()
  return (
    <div className='message is-success'>
      <div className='message-body'>
        Welcome Back, {session?.user?.info.initial}. Please select service from
        the menu to start.
      </div>
    </div>
  )
}
