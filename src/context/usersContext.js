import {
  createContext,
  useEffect,
  useState,
  useSession,
  useContext
} from 'react'

export const UsersContext = createContext()

export const UsersContextProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    // if (typeof window !== 'undefined') {
    //   const storedUsers = localStorage.getItem('users')
    //   return storedUsers ? JSON.parse(storedUsers) : []
    // }
    return []
  })

  useEffect(() => {
    const fetchData = async () => {
      const usersResponse = await fetch('/api/teachers')
      const usersData = await usersResponse.json()

      localStorage.setItem('users', JSON.stringify(usersData))

      setUsers(usersData)
    }
    if (users.length == 0) {
      fetchData()
    }
  }, [users])

  return (
    <UsersContext.Provider
      value={{
        users
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

export const useUsersContext = () => useContext(UsersContext)
