export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/ipad/result', // Change this to the desired route
      permanent: false // Set to true for a permanent redirect (301)
    }
  }
}

export default function iPad() {
  return null
}
