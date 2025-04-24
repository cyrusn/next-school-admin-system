export default function ButtonGroup({
  isShow,
  isPic,
  isEditEvent,
  isShowParticipants,
  handleEdit,
  handleParticipants,
  handlePhotos
}) {
  if (!isShow) return null
  return (
    <div className='field is-grouped is-justify-content-right'>
      {isPic ? (
        <>
          <p className='control'>
            <button className='button is-info' onClick={handleEdit}>
              {isEditEvent ? 'Close' : 'Edit'} Event
            </button>
          </p>
          <p className='control'>
            <button className='button is-success' onClick={handleParticipants}>
              {isShowParticipants ? 'Close' : 'Edit'} Participants
            </button>
          </p>
          <p className='control'>
            <button className='button is-warning' onClick={handlePhotos}>
              Add Photos
            </button>
          </p>
        </>
      ) : (
        <p className='control'>
          <button className='button is-success' onClick={handleParticipants}>
            {isShowParticipants ? 'Close' : 'View'} Participants
          </button>
        </p>
      )}
    </div>
  )
}
