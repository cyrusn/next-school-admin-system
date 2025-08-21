import { useStudentsContext } from '@/context/studentContext'
import { useState, useRef, useEffect } from 'react'
import Nav from './components/nav'
import MainTable from './components/mainTable'
import ClasslevelTables from './components/classlevelTables.js'
import Loading from '@/components/loading'

export default function NamelistReport() {
  const { students } = useStudentsContext()

  const report = students.reduce((prev, student) => {
    const { regno, classcode, sex, house } = student
    const classlevel = `S${classcode[0]}`
    prev.classcodes ??= {}
    prev.classcodes[classcode] ??= {}
    prev.classcodes[classcode].sexes ??= {}
    prev.classcodes[classcode].houses ??= {}
    prev.classcodes[classcode].total ??= 0
    prev.classcodes[classcode].sexes[sex] ??= 0
    prev.classcodes[classcode].houses[house] ??= 0
    prev.classcodes[classcode].total += 1
    prev.classcodes[classcode].sexes[sex] += 1
    prev.classcodes[classcode].houses[house] += 1

    prev.houses ??= {}
    prev.houses[house] ??= {}

    prev.houses[house].total ??= 0
    prev.houses[house].sexes ??= {}
    prev.houses[house].sexes[sex] ??= 0
    prev.houses[house].total += 1
    prev.houses[house].sexes[sex] += 1

    prev.houses[house][classlevel] ??= {}
    prev.houses[house][classlevel].total ??= 0
    prev.houses[house][classlevel].sexes ??= {}
    prev.houses[house][classlevel].sexes[sex] ??= 0
    prev.houses[house][classlevel].total += 1
    prev.houses[house][classlevel].sexes[sex] += 1

    return prev
  }, {})

  const classlevels = [
    { title: 'S1', vacancy: 132 },
    { title: 'S2', vacancy: 132 },
    { title: 'S3', vacancy: 132 },
    { title: 'S4', vacancy: 132 },
    { title: 'S5', vacancy: 132 },
    { title: 'S6', vacancy: 132 }
  ]

  return (
    <h1>
      <Nav />
      {students.length ? (
        <div className='has-text-centered'>
          <MainTable report={report} classlevels={classlevels} />
          <ClasslevelTables report={report} classlevels={classlevels} />
        </div>
      ) : (
        <Loading />
      )}
    </h1>
  )
}
