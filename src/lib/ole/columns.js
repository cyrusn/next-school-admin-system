import { DateTime } from 'luxon'
import { TIMEZONE } from '@/config/constant'
export const columns = [
  {
    title: 'Title',
    orderable: false,
    data(data, type) {
      const { title, organization, imageFolderUrl, timestamp } = data
      if (type === 'set') {
        return
      }

      if (type === 'display' || type === 'filter') {
        return `
<div class='content'>
  <dt class='has-text-weight-bold'>Title</dt>
  <dd><span>${title}</span></dd>
  <dt class='has-text-weight-bold'>Organization</dt>
  <dd>${organization}</dd>
  <dt class='has-text-weight-bold'>Images</dt>
  <dd><a href='${imageFolderUrl}' target='_blank'>Link to images</a></dd>
  <dt class='has-text-weight-bold'>Timestamp</dt>
  <dd>${DateTime.fromJSDate(new Date(timestamp)).setZone(TIMEZONE).toFormat('yyyy-MM-dd HH:mm')}
  </dd>
</div>
`
      }

      return 'title'
    },
    width: '30%',
  },
  {
    title: 'Content',
    orderable: false,
    width: '70%',
    data(data, type) {
      const { description, objective, efficacy, pics } = data
      if (type === 'set') {
        return
      }

      if (type === 'display' || type === 'filter') {
        const picTags = pics
          .split(',')
          .map((pic) => `<span class="tag is-warning" >${pic}</span>`)
          .join('')
        return `
<div class='content'>
  <dl>
    <dt class='has-text-weight-bold'>Description</dt>
    <dd><p>${description}<p></dd>
    <dt class='has-text-weight-bold'>Objective</dt>
    <dd><p style='overflow-wrap: break-all; inline-size: 400px;'>${objective}</p></dd>
    <dt class='has-text-weight-bold'>Efficacy</dt>
    <dd><p style='overflow-wrap: break-all; inline-size: 400px;'>${efficacy}</p></dd>
    <dt class='has-text-weight-bold'>PIC</dt>
    <dd>
      <div class="tags">
      ${picTags}
      </div>
    </dd>
  </dl>
</div>
`
      }

      return ['description', 'objective', 'efficacy']
    }
  },
  {
    title: 'Timestamp',
    visible: false,
    data(data) {
      const { timestamp } = data
      return new Date(timestamp)
    }
  },
  {
    data: 'eventId',
    visible: false
  }
]
