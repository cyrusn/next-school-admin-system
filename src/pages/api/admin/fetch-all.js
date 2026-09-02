import { getSession } from 'next-auth/react'
import { getSettings, clearSettingsCache } from '@/utils/settings'
import { execSync } from 'child_process'

export default async function handler(req, res) {
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  )
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const session = await getSession({ req })
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorised: Please sign in' })
    }

    const defaultSettings = await getSettings()
    const username = session.user.email.split('@')[0].toLowerCase()
    const superAdmins = (defaultSettings?.SUPERADMIN || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())

    if (!superAdmins.includes(username)) {
      return res.status(403).json({ error: 'Forbidden: Superadmin access required' })
    }

    console.log(`[Fetch All] Triggered by ${session.user.email}`)
    
    // Execute the fetch-settings script to update settings.json
    execSync('node scripts/fetch-settings.js')

    // Invalidate the local cache
    clearSettingsCache()

    return res.status(200).json({ message: 'Settings successfully refetched' })
  } catch (error) {
    console.error('Error during refetch:', error)
    return res.status(500).json({ error: 'Failed to refetch settings: ' + error.message })
  }
}
