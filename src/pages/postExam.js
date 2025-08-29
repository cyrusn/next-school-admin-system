export default function PostExam() {
  return (
    <div className='container'>
      <h1 className='title is-3'>試後活動</h1>
      <figure className='image is-16by9'>
        <iframe
          className='has-ratio'
          width='640'
          height='360'
          src='https://calendar.google.com/calendar/embed?height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;ctz=Asia%2FHong_Kong&amp;src=bGlwaW5nLmVkdS5oa192aDZzajZwaHY1ZTgxdmVhaWx1YWxqMG9lY0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&amp;src=bGlwaW5nLmVkdS5oa18wamZ1aWUzOTlkMGVsdmFhYzA2azBodXI4b0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&amp;color=%23AB8B00&amp;color=%233366CC&amp;showTz=0&amp;showTitle=0'
          style={{ borderWidth: 0, border: 'none' }}
          allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        ></iframe>
      </figure>

      <div className='has-text-right'>
        <a
          className='text'
          href='https://calendar.google.com/calendar/ical/liping.edu.hk_vh6sj6phv5e81veailualj0oec%40group.calendar.google.com/public/basic.ics'
          target='_blank'
        >
          Calendar address
        </a>
      </div>

      <h1 className='title is-5'>申報試後活動</h1>
      <div className='content'>
        <p>
          同事可到此
          <a href='https://forms.gle/FvMYVyzyLWYNmsmN9' target='_blank'>
            連結
          </a>
          申報試後活動
        </p>
        <h1 className='title is-5'>輸入學生名單</h1>
        <p>
          煩請老師登入 liping.edu.hk 以輸入
          <a
            href='https://docs.google.com/spreadsheets/d/1XYD8IywaQgsuqIGsCWPh96EI-qDyoUFJ9VGetawA5uM/edit?gid=1815670885#gid=1815670885'
            target='_blank'
          >
            學生名單
          </a>{' '}
          (全級性活動除外)。如有學生重疊參與活動，請較後輸入的同工主動與相關同事協商，完成後在Remark一欄中輸入
          <code>compromised</code>。
        </p>
      </div>
    </div>
  )
}
