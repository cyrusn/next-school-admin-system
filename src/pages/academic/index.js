export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/academic/documents', // Change this to the desired route
      permanent: false // Set to true for a permanent redirect (301)
    }
  }
}

export default function Academic() {
  return null
}
