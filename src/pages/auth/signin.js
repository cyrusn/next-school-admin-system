import { signIn } from 'next-auth/react'

export default function SignIn() {
  return {
    redirect: {
      destination: '/', // Change this to the desired route
      permanent: false // Set to true for a permanent redirect (301)
    }
  }
}
