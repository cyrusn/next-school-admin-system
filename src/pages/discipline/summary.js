import DisciplineNav from './components/nav'
import { useContext, useState, useEffect, useRef } from 'react'
import { columnKeys } from './components/summary/columns'
import DataTable from '@/components/dataTable'
import $ from 'jquery'

import {
  TODAY,
  START_TERM_DATE,
  SCHOOL_YEAR,
  TERM,
  ITEM_CODES,
  MERIT_DEMERIT_CODES
} from '@/config/constant'

export default function DisciplineSummary() {
  const columns = columnKeys.map((key) => ({
    name: key,
    title: key,
    data: key
  }))
  const tableRef = useRef()
  const [url, setUrl] = useState('')

  const handleSubmitFilter = async () => {
    let newUrl = ''
    newUrl += `/api/discipline/summary?filters[schoolYear]=${SCHOOL_YEAR}&filters[term]=${TERM}`
    newUrl += `&filters[classcode]=1A`

    setUrl(newUrl)

    if (tableRef.current) {
      tableRef.current.dt().ajax.url(newUrl).load()
    }
  }

  const options = {
    dom: '<"level" <"level-left" l> <"level-right" B> > fr <"table-container" t>ip',
    searching: false,
    processing: true,
    serverSide: true,
    buttons: [
      { extend: 'copy', className: 'is-primary' },
      { extend: 'print', className: 'is-warning' }
    ],
    rowId: 'id',
    order: [
      [4, 'desc'],
      [1, 'asc'],
      [2, 'asc']
    ]
  }

  useEffect(() => {
    // update DataTable on start
    handleSubmitFilter()
  })

  return (
    <>
      <DisciplineNav />
      <div className='table-container'>
        {url ? (
          <DataTable
            ref={tableRef}
            columns={columns}
            url={url}
            options={options}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  )
}
