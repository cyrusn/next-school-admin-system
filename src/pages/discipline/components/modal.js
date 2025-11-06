export default function Modal({
  isModalActive,
  selectedRows,
  confirmDelete,
  setIsModalActive,
  handleCancel,
  helper
}) {
  const { getDisplayName, getFullItemCode } = helper
  return (
    <div className={`modal ${isModalActive && 'is-active'}`}>
      <div className='modal-background'></div>
      <div className='modal-content' style={{ width: '70%' }}>
        <div className='box'>
          <h1 className='title'>Confirm to delete the selected records?</h1>
          <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth'>
            <thead>
              <tr>
                <th>Event Date</th>
                <th>Student</th>
                <th>Item</th>
                <th>Mark</th>
              </tr>
            </thead>
            <tbody>
              {selectedRows.map((row) => {
                const {
                  classcode,
                  classno,
                  name,
                  cname,
                  eventDate,
                  itemCode,
                  mark
                } = row
                return (
                  <tr key={row.regno}>
                    <td>{eventDate}</td>
                    <td>
                      {getDisplayName({ classcode, classno, name, cname })}
                    </td>
                    <td>{getFullItemCode(itemCode)}</td>
                    <td>{mark}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className='buttons has-addons'>
            <button
              className='button is-info'
              onClick={confirmDelete}
              disabled={selectedRows.length == 0}
            >
              Confirm
            </button>
            <button className='button is-warning' onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <button
        className='modal-close is-large'
        aria-label='close'
        onClick={() => {
          setIsModalActive(false)
        }}
      ></button>
    </div>
  )
}
