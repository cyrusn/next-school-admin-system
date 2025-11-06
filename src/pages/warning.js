const Warning = () => {
  return (
    <div id='modal-warning' className='modal'>
      <div className='modal-background'></div>

      <div className='modal-content'>
        <article className='message is-danger'>
          <div className='message-header'>
            <p className='modal-card-title has-text-light'>警告</p>
            <button className='delete' aria-label='close'></button>
          </div>
          <div className='message-body content'>
            <p>
              資料屬於學生私隱，請保護學生資料。應避免包括但不限於以下情況。
            </p>
            <ul>
              <li>在公用電腦使用此系統</li>
              <li>在學生前使用此系統</li>
              <li>在課室內登入</li>
            </ul>
            <p>
              如必須於課室使用，請務必使用<b>無痕</b>
              模式登入，並謹記使用後登出。
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
export default Warning
