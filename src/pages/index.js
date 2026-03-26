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
            <li className='mb-2'>
              <b>v1.9.0</b>
              <ul style={{ marginLeft: '1.5rem', listStyleType: 'disc' }}>
                <li>Enhanced fuzzy search</li>
                <li>Display electives in photo and profile modules</li>
              </ul>
            </li>
            <li className='mb-2'>
              <b>v1.8.9</b>
              <ul style={{ marginLeft: '1.5rem', listStyleType: 'disc' }}>
                <li>Implemented F6 record filtering</li>
                <li>Access restrictions for non-DC_ADMIN users</li>
                <li>Improved UI layout and system outlook</li>
              </ul>
            </li>
            <li className='mb-2'>
              <b>v1.8.5</b>
              <ul style={{ marginLeft: '1.5rem', listStyleType: 'disc' }}>
                <li>Enhanced attendance reporting with Grwth API</li>
                <li>Fixed grading calculation for F6 summary reports</li>
                <li>Removed date restrictions for disciplinary records</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
