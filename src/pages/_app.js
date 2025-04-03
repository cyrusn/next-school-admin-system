import React from 'react'
import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css' // Import your global styles
import ProtectedRoute from '@/components/protectedRoute'

import { StudentsContextProvider } from '@/context/studentContext'

import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <div className='container-fluid'>
        <div className='section py-4'>
          <div className='columns'>
            <Sidebar />
            <div className='column'>
              <ProtectedRoute>
                <StudentsContextProvider>
                  <Component {...pageProps} />
                </StudentsContextProvider>
              </ProtectedRoute>
            </div>
          </div>
        </div>
      </div>
    </SessionProvider>
  )
}

export default MyApp
