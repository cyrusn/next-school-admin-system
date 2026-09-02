import NextAuth from 'next-auth'

import GoogleProvider from 'next-auth/providers/google'
import { getUserInfos } from '@/utils/userInfos'

export default async function auth(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const protocol = req.headers['x-forwarded-proto'] || (process.env.NODE_ENV === 'production' ? 'https' : 'http')
  if (host) {
    process.env.NEXTAUTH_URL = `${protocol}://${host}`
  }

  return await NextAuth(req, res, {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const users = await getUserInfos()
        const found = users.find(({ email }) => email == user.email)
        console.log(user, found)

        if (found) return true // Allow sign in
      } catch (error) {
        console.error(error)
        return false
      }

      return false // Deny sign in
    },
    async session({ session }) {
      try {
        const users = await getUserInfos()
        const found = users.find(({ email }) => email == session.user?.email)
        if (found) {
          session.user.info = found
        }
      } catch (error) {
        console.log(error)
      } finally {
        return session
      }
    }
  },
  pages: {
    signIn: '/auth/signin' // Custom sign-in page
  }
})
}