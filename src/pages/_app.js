import React from 'react'
import { SessionProvider } from 'next-auth/react'
import '@/styles/globals.css' // Import your global styles
import '@/styles/print.css' // Import your global styles
import ProtectedRoute from '@/components/protectedRoute'

import { StudentsContextProvider } from '@/context/studentContext'
import { UsersContextProvider } from '@/context/usersContext'

import Navbar from '../components/navbar'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <div className='container'>
        <div className='section'>
          <ProtectedRoute>
            <UsersContextProvider>
              <StudentsContextProvider>
                <Component {...pageProps} />
              </StudentsContextProvider>
            </UsersContextProvider>
          </ProtectedRoute>
        </div>
      </div>
    </SessionProvider>
  )
}

export default MyApp
