import {
  createContext,
  useEffect,
  useState,
  useSession,
  useContext
} from 'react'

export const StudentsContext = createContext()

export const StudentsContextProvider = ({ children }) => {
  const [students, setStudents] = useState(() => {
    // if (typeof window !== 'undefined') {
    //   const storedStudents = localStorage.getItem('students')
    //   return storedStudents ? JSON.parse(storedStudents) : []
    // }
    return []
  })

  useEffect(() => {
    const fetchData = async () => {
      const studentsResponse = await fetch('/api/students')
      const studentsData = await studentsResponse.json()

      localStorage.setItem('students', JSON.stringify(studentsData))

      setStudents(studentsData)
    }
    if (students.length == 0) {
      fetchData()
    }
  }, [students])

  return (
    <StudentsContext.Provider
      value={{
        students
      }}
    >
      {children}
    </StudentsContext.Provider>
  )
}
export const useStudentsContext = () => useContext(StudentsContext)
