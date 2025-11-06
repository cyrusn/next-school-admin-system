import DateInput from '@/components/form/dateInput'
import DateTimeInput from './dateTimeInput'
import { useState } from 'react'
import { isEmpty } from 'lodash'

export default function Availability({
  resourceType,
  resources,
  onSelectResource,
  startTime,
  endTime,
  handleChange
}) {
  const [availability, setAvailability] = useState([])
  const onClickAvailabilty = () => {}

  if (isEmpty(resourceType)) return null

  const CheckAvailability = async () => {
    const timeMin = new Date(`${startTime}:00.000+08:00`)
    const timeMax = new Date(
      `${startTime.slice(0, 10)}T${endTime}:00.000+08:00`
    )
    const items = resources.map(({ resourceEmail }) => ({ id: resourceEmail }))
    const response = await fetch('/api/calendars/freebusy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ timeMin, timeMax, items })
    })

    const data = await response.json()
    const availabileCalendarEmails = Object.keys(data).filter(
      (resourceEmail) => {
        const busy = data[resourceEmail].busy
        return busy.length === 0
      }
    )
    const newAvailability = resources
      .filter(({ resourceEmail }) =>
        availabileCalendarEmails.includes(resourceEmail)
      )
      .sort((a, b) => a.resourceName.localeCompare(b.resourceName))
    setAvailability([...newAvailability])
  }

  return (
    <div className='message is-info'>
      <div className='message-header'>
        <p>
          You may search available resources for the type &quot;
          <span>{resourceType}</span>&quot; and select available resource
          directly from the list below.
        </p>
      </div>
      <div className='message-body'>
        <div className='field is-horizontal'>
          <div className='field-label is-normal'>
            <label className='label'>Date and Time</label>
          </div>
          <div className='field-body'>
            <DateTimeInput
              startTime={startTime}
              endTime={endTime}
              handleChange={handleChange}
            />

            <div className='field'>
              <div className='control'>
                <button className='button' onClick={CheckAvailability}>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {availability.length ? (
          <div className='field is-horizontal'>
            <div className='field-label is-normal'>
              <label className='label'>Available Rooms</label>
            </div>
            <div className='field-body'>
              <div className='buttons'>
                {availability?.map(
                  ({ resourceName, resourceEmail, resourceId }) => {
                    return (
                      <button
                        className='button is-small is-info'
                        key={resourceId}
                        onClick={() => onSelectResource(resourceEmail)}
                      >
                        {resourceName}
                      </button>
                    )
                  }
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
