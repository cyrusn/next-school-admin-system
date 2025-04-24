export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/ole/event', // Change this to the desired route
      permanent: false // Set to true for a permanent redirect (301)
    }
  }
}

const OleRecord = () => {
  return null
}

export default OleRecord
