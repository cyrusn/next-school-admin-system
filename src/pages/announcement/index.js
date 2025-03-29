export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/announcement/form', // Change this to the desired route
      permanent: false // Set to true for a permanent redirect (301)
    }
  }
}

const Announcement = () => {
  return null
}

export default Announcement
