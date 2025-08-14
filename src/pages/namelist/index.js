export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/namelist/basic', // Change this to the desired route
      permanent: false // Set to true for a permanent redirect (301)
    }
  }
}

const Namelist = () => {
  return null
}

export default Namelist
