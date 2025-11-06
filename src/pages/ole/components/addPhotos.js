// components/UploadForm.js
import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { last, throttle } from 'lodash'

const AddPhotos = ({ notifier, selectedEvent }) => {
  const folderId = last(selectedEvent?.imageFolderUrl?.split('/'))
  const [files, setFiles] = useState([])
  const [links, setLinks] = useState([])
  const [isClicked, setIsClicked] = useState(false)
  const inputRef = useRef(null)
  const { setLoadingMessage, setErrorMessage, setSuccessMessage } = notifier

  const handleFileChange = (e) => {
    setFiles(e.target.files) // Store the selected files
  }

  const removeFile = (index) => {
    const dt = new DataTransfer()

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (index !== i) {
        dt.items.add(file) // here you exclude the file. thus removing it.
      }
    }

    setFiles(dt.files)
  }

  const handleSubmit = async () => {
    setLoadingMessage()
    setIsClicked(true)

    if (files.length === 0) {
      setErrorMessage('Please select files to upload')
      return
    }

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.set('folderId', folderId)
      formData.append('files', files[i]) // Append each file to the FormData
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      setIsClicked(false)
      if (!response.ok) {
        throw new Error(result.message)
      }
      setSuccessMessage(
        `Files uploaded successfully: ${result.data.length} images are uploaded`
      )
      setFiles([])
      const allResults = result.data.map(({ webViewLink, id, name }) => ({
        id,
        href: webViewLink,
        filename: name
      }))

      setLinks([...allResults])
    } catch (error) {
      setErrorMessage(`Error: ${error.message}`)
    }
  }

  if (links.length) {
    return (
      <div className='content'>
        <h1 className='title'>Uploaded images</h1>
        <ul>
          {links.map(({ href, filename, id }) => {
            return (
              <li key={id}>
                <a href={href} target='_blank'>
                  {filename}
                </a>
              </li>
            )
          })}
        </ul>
        <button className='button is-info' onClick={() => setLinks([])}>
          Clear
        </button>
      </div>
    )
  }
  if (!folderId) {
    return <div className='is-danger message'>Invalid Folder Id</div>
  }

  return (
    <>
      <h1 className='title'>Upload images</h1>

      <div className='field is-grouped'>
        <div className='control'>
          <div className='file is-primary'>
            <label className='file-label'>
              <input
                className='file-input'
                accept='image/*'
                ref={inputRef}
                type='file'
                multiple
                onChange={handleFileChange}
                required
              />
              <span className='file-cta'>
                <span className='file-icon'>
                  <FontAwesomeIcon icon={faUpload} />
                </span>
                <span className='file-label'>Choose images ...</span>
              </span>
            </label>
          </div>
        </div>

        <div className='control'>
          <button
            className='button is-info'
            type='submit'
            disabled={files.length == 0 || isClicked}
            onClick={throttle(handleSubmit, 1000)}
          >
            Upload
          </button>
        </div>
      </div>

      {files.length ? (
        <div className='tags'>
          {Array.from(files).map((file, index) => {
            return (
              <span className='tag is-warning' key={index}>
                <span>{file.name}</span>
                <button
                  className='delete is-small'
                  onClick={() => removeFile(index)}
                ></button>
              </span>
            )
          })}
        </div>
      ) : null}
    </>
  )
}

export default AddPhotos
