import React from 'react'
import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css' // Import your global styles
import ProtectedRoute from '@/components/protectedRoute'

import { StudentsContextProvider } from '@/context/studentContext'

import Navbar from '../components/navbar'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <div className='container'>
        <div className='section'>
          <ProtectedRoute>
            <StudentsContextProvider>
              <Component {...pageProps} />
            </StudentsContextProvider>
          </ProtectedRoute>
        </div>
      </div>
    </SessionProvider>
  )
}

export default MyApp
