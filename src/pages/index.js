import { useState } from 'react'
import { useSession } from 'next-auth/react'
import packageInfo from '../../package.json'
import changelog from '@/config/changelog.json'

export const metadata = {
  title: {
    template: '%s | LPSS',
    default: 'LPSS SAS', // Fallback title
  },
};


export default function Home() {
  console.log(packageInfo.version)
  const { data: session } = useSession()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const totalPages = Math.ceil(changelog.length / itemsPerPage)
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentChangelog = changelog.slice(startIndex, endIndex)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <>
      <div className='message is-success'>
        <div className='message-body'>
          Welcome Back, {session?.user?.info.initial}. Please select service
          from the menu to start.
        </div>
      </div>
      <div className='message is-info'>
        <div className='message-header'>
          <p>Recent Updates</p>
        </div>
        <div className='message-body'>
          <ul>
            {currentChangelog.map((release, index) => (
              <li key={index} className='mb-2'>
                <b>{release.version}</b>
                <ul style={{ marginLeft: '1.5rem', listStyleType: 'disc' }}>
                  {release.commits.map((commit, cIndex) => (
                    <li key={cIndex}>{commit}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {totalPages > 1 && (
        <nav className="pagination is-centered mt-4" role="navigation" aria-label="pagination">
          <button 
            className="pagination-previous" 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button 
            className="pagination-next" 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
          >
            Next page
          </button>
          <ul className="pagination-list">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button 
                  className={`pagination-link ${currentPage === page ? 'is-current' : ''}`} 
                  aria-label={`Goto page ${page}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  )
}
