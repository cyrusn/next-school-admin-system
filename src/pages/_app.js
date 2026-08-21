import React, { useEffect } from 'react'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import '@/styles/globals.css' // Import your global styles
import '@/styles/print.css' // Import your global styles
import ProtectedRoute from '@/components/protectedRoute'

import { SettingsContextProvider } from '@/context/settingsContext'
import { StudentsContextProvider } from '@/context/studentContext'
import { UsersContextProvider } from '@/context/usersContext'

import Navbar from '../components/navbar'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Capture sid from URL on load and save to sessionStorage
    const urlParams = new URLSearchParams(window.location.search)
    const initialSid = urlParams.get('sid')
    if (initialSid) {
      sessionStorage.setItem('sid', initialSid)
    }

    // 2. Intercept native history API to inject sid safely on every manual component update
    const originalReplaceState = window.history.replaceState
    window.history.replaceState = function (state, unused, url) {
      if (url) {
        const storedSid = sessionStorage.getItem('sid')
        if (storedSid) {
          try {
            const urlObj = new URL(url, window.location.origin)
            if (!urlObj.searchParams.has('sid')) {
              urlObj.searchParams.set('sid', storedSid)
              url = urlObj.pathname + urlObj.search + urlObj.hash
            }
          } catch (e) {}
        }
      }
      return originalReplaceState.call(this, state, unused, url)
    }

    const originalPushState = window.history.pushState
    window.history.pushState = function (state, unused, url) {
      if (url) {
        const storedSid = sessionStorage.getItem('sid')
        if (storedSid) {
          try {
            const urlObj = new URL(url, window.location.origin)
            if (!urlObj.searchParams.has('sid')) {
              urlObj.searchParams.set('sid', storedSid)
              url = urlObj.pathname + urlObj.search + urlObj.hash
            }
          } catch (e) {}
        }
      }
      return originalPushState.call(this, state, unused, url)
    }

    // Also run an initial check in case Next.js stripped the sid on load
    const storedSid = sessionStorage.getItem('sid')
    if (storedSid) {
      const currentParams = new URLSearchParams(window.location.search)
      if (!currentParams.has('sid')) {
        currentParams.set('sid', storedSid)
        const newUrl =
          window.location.pathname +
          '?' +
          currentParams.toString() +
          (window.location.hash || '')
        originalReplaceState.call(window.history, null, '', newUrl)
      }
    }

    return () => {
      window.history.replaceState = originalReplaceState
      window.history.pushState = originalPushState
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Intercept global fetch to automatically append the 'sid' query parameter to relative API calls
    const originalFetch = window.fetch
    window.fetch = function (input, init) {
      if (typeof input === 'string' && input.startsWith('/api/')) {
        const storedSid = sessionStorage.getItem('sid')
        if (storedSid) {
          try {
            const urlObj = new URL(input, window.location.origin)
            if (!urlObj.searchParams.has('sid')) {
              urlObj.searchParams.set('sid', storedSid)
              input = urlObj.pathname + urlObj.search + urlObj.hash
            }
          } catch (err) {
            console.error('Error appending sid to fetch URL:', err)
          }
        }
      }
      return originalFetch(input, init)
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [])

  return (
    <>
      <Head>
        <title>LPSS SAS</title>
      </Head>
      <SessionProvider session={session}>
        <SettingsContextProvider>
          <StudentsContextProvider>
            <Navbar />
            <div className='container'>
              <div className='section'>
                <ProtectedRoute>
                  <UsersContextProvider>
                    <Component {...pageProps} />
                  </UsersContextProvider>
                </ProtectedRoute>
              </div>
            </div>
          </StudentsContextProvider>
        </SettingsContextProvider>
      </SessionProvider>
    </>
  )
}

export default MyApp
