import { isEmpty } from 'lodash'

const ResourceInfo = ({ resource }) => {
  if (isEmpty(resource)) return null

  const {
    resourceName,
    resourceEmail,
    resourceId,
    floorName,
    floorSection,
    capacity
  } = resource

  return (
    <div className='mb-6'>
      <h1 className='title'>
        <span>{resourceName}</span>
        {floorSection ? (
          <span>
            (<span>{floorSection}</span>)
          </span>
        ) : null}
        <div className='help is-danger has-text-weight-normal'>
          Please check if the classroom is not used for normal lesson before
          booking it.
        </div>
      </h1>
      <div className='field is-grouped is-grouped-multiline'>
        <div className='control'>
          <div className='tags has-addons'>
            <span className='tag is-dark'>capacity</span>
            <span className='tag is-info'>{capacity}</span>
          </div>
        </div>

        {floorName ? (
          <div className='control'>
            <div className='tags has-addons'>
              <span className='tag is-dark'>floor</span>
              <span className='tag is-success'>{floorName}</span>
            </div>
          </div>
        ) : null}

        {floorSection ? (
          <div className='control'>
            <div className='tags has-addons'>
              <span className='tag is-dark'>section</span>
              <span className='tag is-warning'>{floorSection}</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
export default ResourceInfo
