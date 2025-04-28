import NextAuth from 'next-auth'

import GoogleProvider from 'next-auth/providers/google'
import { getUserInfos } from '../../../lib/userInfos'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({ user }) {
      const users = await getUserInfos()
      const found = users.find(({ email }) => email == user.email)

      if (found) return true // Allow sign in

      return false // Deny sign in
    },
    async session({ session, token }) {
      const users = await getUserInfos()
      const found = users.find(({ email }) => email == session.user.email)
      if (found) {
        session.user.info = found
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin' // Custom sign-in page
  }
})
