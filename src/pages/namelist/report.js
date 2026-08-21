import { useStudentsContext } from '@/context/studentContext'
import { useState, useRef, useEffect } from 'react'
import Nav from './components/nav'
import MainTable from './components/mainTable'
import ClasslevelTables from './components/classlevelTables.js'
import ElectiveTables from './components/electiveTables'
import Loading from '@/components/loading'

export default function NamelistReport() {
  const { allStudents } = useStudentsContext()

  const report = (allStudents || []).reduce((prev, student) => {
    const { regno, classcode, sex, house, x1, x2, x3, isNcs, isNewlyArrived, isSen, isDropout } = student

    if (isDropout) {
      if (classcode && /^[1-6]/.test(classcode)) {
        prev.dropouts ??= {}
        prev.dropouts[classcode] ??= { total: 0 }
        prev.dropouts[classcode].total += 1
      }
      return prev
    }

    if (!classcode || !/^[1-6]/.test(classcode)) return prev
    const classlevel = `S${classcode[0]}`
    prev.classcodes ??= {}
    prev.classcodes[classcode] ??= {}
    prev.classcodes[classcode].sexes ??= {}
    prev.classcodes[classcode].houses ??= {}
    prev.classcodes[classcode].total ??= 0
    prev.classcodes[classcode].sexes[sex] ??= 0
    prev.classcodes[classcode].houses[house] ??= 0
    prev.classcodes[classcode].ncs ??= 0
    prev.classcodes[classcode].newlyArrived ??= 0
    prev.classcodes[classcode].sen ??= 0
    prev.classcodes[classcode].total += 1
    prev.classcodes[classcode].sexes[sex] += 1
    prev.classcodes[classcode].houses[house] += 1
    if (isNcs) prev.classcodes[classcode].ncs += 1
    if (isNewlyArrived) prev.classcodes[classcode].newlyArrived += 1
    if (isSen) prev.classcodes[classcode].sen += 1

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

    if (['S4', 'S5', 'S6'].includes(classlevel)) {
      prev.electives ??= {}
      prev.electives[classlevel] ??= { x1: {}, x2: {}, x3: {} }
      if (x1) {
        prev.electives[classlevel].x1[x1] = (prev.electives[classlevel].x1[x1] || 0) + 1
      }
      if (x2) {
        prev.electives[classlevel].x2[x2] = (prev.electives[classlevel].x2[x2] || 0) + 1
      }
      if (x3) {
        prev.electives[classlevel].x3[x3] = (prev.electives[classlevel].x3[x3] || 0) + 1
      }
    }

    return prev
  }, {})

  const classlevels = [
    { title: 'S1', vacancy: 102 },
    { title: 'S2', vacancy: 132 },
    { title: 'S3', vacancy: 132 },
    { title: 'S4', vacancy: 132 },
    { title: 'S5', vacancy: 132 },
    { title: 'S6', vacancy: 132 }
  ]

  return (
    <h1>
      <Nav />
      {allStudents?.length ? (
        <div className='has-text-centered'>
          <MainTable report={report} classlevels={classlevels} />
          <ClasslevelTables report={report} classlevels={classlevels} />
          <ElectiveTables report={report} />
        </div>
      ) : (
        <Loading />
      )}
    </h1>
  )
}
