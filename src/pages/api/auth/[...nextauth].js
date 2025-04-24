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
      // Check if the user is allowed

      const users = await getUserInfos()
      const found = users.find(({ email }) => email == user.email)

      if (found) {
        user.info = found
        return true // Allow sign in
      }

      return false // Deny sign in
    },
    async jwt({ token, user }) {
      if (user?.info) {
        token.info = user.info // Add user info to the token
      }
      return token // Return the modified token
    },
    async session({ session, token, user }) {
      if (token?.info) {
        session.user.info = token.info
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin' // Custom sign-in page
  }
})
