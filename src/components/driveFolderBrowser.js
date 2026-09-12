import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFolder,
  faFile,
  faExternalLinkAlt,
  faSpinner,
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileImage,
  faFileVideo,
  faFileAudio,
  faFileArchive,
  faFileAlt,
  faFileCode,
  faArrowUp,
  faList,
  faBorderAll
} from '@fortawesome/free-solid-svg-icons'

const getFileIcon = (ext, mimeType) => {
  const mime = mimeType ? mimeType.toLowerCase() : ''
  const extension = ext ? ext.toLowerCase() : ''

  if (
    mime === 'application/vnd.google-apps.document' ||
    extension === 'gdoc' ||
    extension === 'doc' ||
    extension === 'docx'
  ) {
    return faFileWord
  }
  if (
    mime === 'application/vnd.google-apps.spreadsheet' ||
    extension === 'gsheet' ||
    extension === 'xls' ||
    extension === 'xlsx' ||
    extension === 'csv'
  ) {
    return faFileExcel
  }
  if (
    mime === 'application/vnd.google-apps.presentation' ||
    extension === 'gslides' ||
    extension === 'ppt' ||
    extension === 'pptx'
  ) {
    return faFilePowerpoint
  }
  if (mime === 'application/vnd.google-apps.folder') {
    return faFolder
  }

  switch (extension) {
    case 'pdf':
      return faFilePdf
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'webp':
      return faFileImage
    case 'mp4':
    case 'avi':
    case 'mkv':
    case 'mov':
      return faFileVideo
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac':
      return faFileAudio
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return faFileArchive
    case 'txt':
    case 'md':
      return faFileAlt
    case 'html':
    case 'js':
    case 'css':
    case 'json':
      return faFileCode
    default:
      return faFile
  }
}

const getDisplayName = (name) => {
  if (!name) return ''
  const lastDotIndex = name.lastIndexOf('.')
  if (lastDotIndex === -1) return name
  // Only strip if it looks like a standard extension (e.g., 1-5 chars)
  const ext = name.substring(lastDotIndex + 1)
  if (ext.length > 0 && ext.length <= 5) {
    return name.substring(0, lastDotIndex)
  }
  return name
}

export default function DriveFolderBrowser({ rootFolderId, rootName }) {
  const [breadcrumbs, setBreadcrumbs] = useState([])
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState({})
  const [sortConfig, setSortConfig] = useState('name-asc') // 'name-asc', 'name-desc', 'type-asc', 'type-desc'

  // Initialize breadcrumbs when rootFolderId changes
  useEffect(() => {
    if (rootFolderId) {
      setBreadcrumbs([{ id: rootFolderId, name: rootName || 'Home' }])
    }
  }, [rootFolderId, rootName])

  const currentFolderId =
    breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].id : null

  // Fetch files when currentFolderId changes
  useEffect(() => {
    if (!currentFolderId) return

    async function fetchFiles() {
      setLoading(true)
      setError(null)
      setSelectedIndex(0) // Reset selection on directory change
      try {
        const res = await fetch(`/api/drive/files?folderId=${currentFolderId}`)
        if (!res.ok) {
          throw new Error(`Failed to fetch files (Status: ${res.status})`)
        }
        const data = await res.json()
        setFiles(data)
      } catch (err) {
        console.error('Error loading files:', err)
        setError(err.message || 'An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [currentFolderId])

  // Scroll active item into view
  useEffect(() => {
    const activeEl = document.querySelector('.js-active-drive-item')
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [selectedIndex])

  const handleBreadcrumbClick = useCallback(
    (index) => {
      if (index === breadcrumbs.length - 1) return
      const newBreadcrumbs = breadcrumbs.slice(0, index + 1)
      setBreadcrumbs(newBreadcrumbs)
    },
    [breadcrumbs]
  )

  const handleItemClick = useCallback(
    (file) => {
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        setBreadcrumbs([...breadcrumbs, { id: file.id, name: file.name }])
      } else {
        window.open(file.webViewLink, '_blank', 'noopener,noreferrer')
      }
    },
    [breadcrumbs]
  )

  const handleImageError = useCallback((id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }))
  }, [])

  // Derive client-sorted files (keeping folders at the top)
  const sortedFiles = [...files].sort((a, b) => {
    const isFolderA = a.mimeType === 'application/vnd.google-apps.folder'
    const isFolderB = b.mimeType === 'application/vnd.google-apps.folder'

    // Always keep folders at the top
    if (isFolderA && !isFolderB) return -1
    if (!isFolderA && isFolderB) return 1

    if (sortConfig.startsWith('name')) {
      const compare = a.name.localeCompare(b.name)
      return sortConfig === 'name-asc' ? compare : -compare
    } else if (sortConfig.startsWith('type')) {
      const extA = a.fileExtension || ''
      const extB = b.fileExtension || ''
      const compare = extA.localeCompare(extB) || a.name.localeCompare(b.name)
      return sortConfig === 'type-asc' ? compare : -compare
    }
    return 0
  })

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (loading || sortedFiles.length === 0) return

      // Do not navigate if user is typing in an input
      const activeEl = document.activeElement
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.isContentEditable)
      ) {
        return
      }

      const key = e.key.toLowerCase()
      let newIndex = selectedIndex

      if (viewMode === 'grid') {
        const cols = 6 // 6 items per row on desktop
        if (key === 'arrowright' || key === 'l') {
          newIndex = Math.min(sortedFiles.length - 1, selectedIndex + 1)
          e.preventDefault()
        } else if (key === 'arrowleft' || key === 'h') {
          newIndex = Math.max(0, selectedIndex - 1)
          e.preventDefault()
        } else if (key === 'arrowdown' || key === 'j') {
          newIndex = Math.min(sortedFiles.length - 1, selectedIndex + cols)
          e.preventDefault()
        } else if (key === 'arrowup' || key === 'k') {
          newIndex = Math.max(0, selectedIndex - cols)
          e.preventDefault()
        }
      } else {
        // List mode
        if (key === 'arrowdown' || key === 'j') {
          newIndex = Math.min(sortedFiles.length - 1, selectedIndex + 1)
          e.preventDefault()
        } else if (key === 'arrowup' || key === 'k') {
          newIndex = Math.max(0, selectedIndex - 1)
          e.preventDefault()
        }
      }

      if (key === 'enter') {
        if (selectedIndex >= 0 && selectedIndex < sortedFiles.length) {
          handleItemClick(sortedFiles[selectedIndex])
          e.preventDefault()
        }
      } else if (e.key === 'Backspace') {
        if (breadcrumbs.length > 1) {
          handleBreadcrumbClick(breadcrumbs.length - 2)
          e.preventDefault()
        }
      }

      setSelectedIndex(newIndex)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    selectedIndex,
    sortedFiles,
    viewMode,
    loading,
    breadcrumbs,
    handleBreadcrumbClick,
    handleItemClick
  ])

  if (!rootFolderId) {
    return (
      <div className='notification is-warning'>
        Google Drive Folder ID is not configured.
      </div>
    )
  }

  return (
    <div>
      {/* Upper Folder and Action controls */}
      <div className='is-flex is-justify-content-space-between is-align-items-center mb-4'>
        <div className='buttons mb-0'>
          <button
            className='button is-warning px-2'
            onClick={() => handleBreadcrumbClick(breadcrumbs.length - 2)}
            disabled={breadcrumbs.length <= 1}
            title='Up a layer (Backspace)'
          >
            <span className='icon mx-0'>
              <FontAwesomeIcon icon={faArrowUp} />
            </span>
          </button>
          <a
            className='button is-link'
            href={`https://drive.google.com/drive/folders/${currentFolderId}`}
            target='_blank'
            rel='noreferrer'
          >
            <span className='icon mr-1'>
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </span>
            <span>Open folder in Google Drive</span>
          </a>
        </div>

        {/* Right side controls: Sorting + List / Grid View Toggle */}
        <div className='is-flex is-align-items-center mb-0'>
          {/* Sorting Dropdown */}
          <div className='field has-addons mb-0 mr-3'>
            <div className='control'>
              <span className='button is-static'>Sort:</span>
            </div>
            <div className='control'>
              <div className='select'>
                <select
                  value={sortConfig}
                  onChange={(e) => setSortConfig(e.target.value)}
                >
                  <option value='name-asc'>Name (A-Z)</option>
                  <option value='name-desc'>Name (Z-A)</option>
                  <option value='type-asc'>Type (A-Z)</option>
                  <option value='type-desc'>Type (Z-A)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid/List Buttons */}
          <div className='field has-addons mb-0'>
            <p className='control'>
              <button
                className={`button ${viewMode === 'grid' ? 'is-link' : ''}`}
                onClick={() => setViewMode('grid')}
                title='Grid View'
              >
                <span className='icon'>
                  <FontAwesomeIcon icon={faBorderAll} />
                </span>
              </button>
            </p>
            <p className='control'>
              <button
                className={`button ${viewMode === 'list' ? 'is-link' : ''}`}
                onClick={() => setViewMode('list')}
                title='List View'
              >
                <span className='icon'>
                  <FontAwesomeIcon icon={faList} />
                </span>
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumbs Navigation - placed below open/controls button */}
      {breadcrumbs.length > 0 && (
        <nav className='breadcrumb mb-4' aria-label='breadcrumbs'>
          <ul>
            {breadcrumbs.map((crumb, idx) => {
              const isActive = idx === breadcrumbs.length - 1
              return (
                <li key={crumb.id} className={isActive ? 'is-active' : ''}>
                  <a
                    onClick={(e) => {
                      e.preventDefault()
                      handleBreadcrumbClick(idx)
                    }}
                    style={{ cursor: isActive ? 'default' : 'pointer' }}
                  >
                    {crumb.name}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      )}

      {/* Loading state */}
      {loading && (
        <div className='has-text-centered my-6 py-6'>
          <span className='icon is-large has-text-grey'>
            <FontAwesomeIcon icon={faSpinner} spin size='2x' />
          </span>
          <p className='has-text-grey mt-2'>Loading contents...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className='notification is-danger mt-4'>
          <p>Failed to load files from Google Drive: {error}</p>
        </div>
      )}

      {/* Dynamic Content Views */}
      {!loading && !error && (
        <div>
          {sortedFiles.length === 0 ? (
            <div className='box has-text-centered my-6 py-6'>
              <p className='has-text-grey'>This folder is empty.</p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Google Drive style Grid View (Borderless, 6/row desktop, filename on top, grey selection border) */
            <div className='columns is-multiline is-mobile px-1 py-1'>
              {sortedFiles.map((file, idx) => {
                const isFolder =
                  file.mimeType === 'application/vnd.google-apps.folder'
                const isSelected = selectedIndex === idx
                const icon = isFolder
                  ? faFolder
                  : getFileIcon(file.fileExtension, file.mimeType)
                const showThumbnail =
                  !isFolder && file.thumbnailLink && !imageErrors[file.id]

                return (
                  <div
                    key={file.id}
                    className='column is-2-desktop is-3-tablet is-6-mobile'
                  >
                    <div
                      className={`box is-clickable p-0 m-0 ${
                        isSelected ? 'js-active-drive-item' : ''
                      }`}
                      style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        overflow: 'hidden',
                        border: isSelected ? '2px solid grey' : '2px solid transparent'
                      }}
                      onClick={() => handleItemClick(file)}
                    >
                      {/* Name & Icon on top (Aligned Left, without ext) */}
                      <div className='p-2 is-flex is-align-items-center is-justify-content-start has-text-left'>
                        <span className='icon mx-1'>
                          <FontAwesomeIcon
                            icon={icon}
                            className={
                              isFolder ? 'has-text-warning' : 'has-text-info'
                            }
                          />
                        </span>
                        <span
                          className='is-size-6 has-text-weight-semibold'
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '100%'
                          }}
                          title={file.name}
                        >
                          {getDisplayName(file.name)}
                        </span>
                      </div>

                      {/* Square Responsive Thumbnail Box (Large, nearly fills the box, no background toggle) */}
                      <figure
                        className='image is-square m-2'
                        style={{ position: 'relative' }}
                      >
                        {showThumbnail ? (
                          <Image
                            src={file.thumbnailLink}
                            alt={file.name}
                            fill
                            unoptimized
                            style={{ objectFit: 'cover' }}
                            onError={() => handleImageError(file.id)}
                          />
                        ) : (
                          <div className='is-overlay is-flex is-align-items-center is-justify-content-center'>
                            <span className='icon is-large'>
                              <FontAwesomeIcon
                                icon={icon}
                                className={
                                  isFolder
                                    ? 'has-text-warning'
                                    : 'has-text-info'
                                }
                                size='3x'
                              />
                            </span>
                          </div>
                        )}
                      </figure>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Google Drive style List View (Bulma Panel, No thumbnails, grey border selection) */
            <nav className='panel' style={{ overflow: 'hidden' }}>
              {sortedFiles.map((file, idx) => {
                const isFolder =
                  file.mimeType === 'application/vnd.google-apps.folder'
                const isSelected = selectedIndex === idx
                const icon = isFolder
                  ? faFolder
                  : getFileIcon(file.fileExtension, file.mimeType)

                return (
                  <a
                    key={file.id}
                    className={`panel-block ${
                      isSelected ? 'js-active-drive-item' : ''
                    }`}
                    onClick={() => handleItemClick(file)}
                    style={{
                      cursor: 'pointer',
                      border: isSelected ? '2px solid grey' : '2px solid transparent'
                    }}
                  >
                    <span className='panel-icon mr-2'>
                      <FontAwesomeIcon
                        icon={icon}
                        className={isFolder ? 'has-text-warning' : 'has-text-info'}
                      />
                    </span>
                    <span className='has-text-weight-semibold is-size-6'>
                      {getDisplayName(file.name)}
                    </span>
                  </a>
                )
              })}
            </nav>
          )}
        </div>
      )}
    </div>
  )
}
