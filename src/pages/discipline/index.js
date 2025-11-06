export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/discipline/mark', // Change this to the desired route
      permanent: false // Set to true for a permanent redirect (301)
    }
  }
}

const Discipline = () => {
  return null
}

export const metadata = {
  title: 'Discipline',
}

export default Discipline
