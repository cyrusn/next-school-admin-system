export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/resource/form', // Change this to the desired route
      permanent: false // Set to true for a permanent redirect (301)
    }
  }
}

const resourceForm = () => {
  return null
}

export default resourceForm
