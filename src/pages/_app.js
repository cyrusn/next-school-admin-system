import React from 'react'
import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css' // Import your global styles

import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <div className='container'>
        <div className='section py-4'>
          <div className='columns'>
            <Sidebar />
            <div className='column'>
              <Component {...pageProps} />
            </div>
          </div>
        </div>
      </div>
    </SessionProvider>
  )
}

export default MyApp
