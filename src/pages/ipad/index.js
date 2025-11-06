export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/ipad/record', // Change this to the desired route
      permanen: false // Set to true for a permanent redirect (301)
    }
  }
}

export default function Ipad() {
  return null
}
