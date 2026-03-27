import { useSession } from 'next-auth/react'
import packageInfo from '../../package.json'
import changelog from '@/config/changelog.json'

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
    <>
      <div className='message is-success'>
        <div className='message-body'>
          Welcome Back, {session?.user?.info.initial}. Please select service
          from the menu to start.
        </div>
      </div>
      <div className='message is-info'>
        <div className='message-header'>
          <p>Recent Updates</p>
        </div>
        <div className='message-body'>
          <ul>
            {changelog.map((release, index) => (
              <li key={index} className='mb-2'>
                <b>{release.version}</b>
                <ul style={{ marginLeft: '1.5rem', listStyleType: 'disc' }}>
                  {release.commits.map((commit, cIndex) => (
                    <li key={cIndex}>{commit}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
