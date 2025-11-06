const Calendar = ({ selectedResource, ref }) => {
  const { resourceEmail } = selectedResource
  if (!resourceEmail) return null
  return (
    <section className='mt-6'>
      <iframe
        ref={ref}
        src={`https://calendar.google.com/calendar/embed?src=${resourceEmail}&ctz=Asia%2FHong_Kong`}
        style={{ border: 0, width: '100%' }}
        height='600'
        frameBorder='0'
        scrolling='no'
        allowFullScreen={true}
      ></iframe>
    </section>
  )
}
export default Calendar
