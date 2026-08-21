import {
  createContext,
  useEffect,
  useState,
  useContext
} from 'react'

export const StudentsContext = createContext()

export const StudentsContextProvider = ({ children }) => {
  const [showDropout, setShowDropout] = useState(false)
  const [allStudents, setAllStudents] = useState(() => {
    return []
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsResponse = await fetch('/api/students')
        if (studentsResponse.ok) {
          const studentsData = await studentsResponse.json()
          if (Array.isArray(studentsData)) {
            localStorage.setItem('students', JSON.stringify(studentsData))
            setAllStudents(studentsData)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    if (allStudents.length == 0) {
      fetchData()
    }
  }, [allStudents])

  const students = showDropout ? allStudents : allStudents.filter(s => !s.isDropout)

  return (
    <StudentsContext.Provider
      value={{
        students,
        allStudents,
        showDropout,
        setShowDropout
      }}
    >
      {children}
    </StudentsContext.Provider>
  )
}
export const useStudentsContext = () => useContext(StudentsContext)
