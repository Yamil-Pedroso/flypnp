/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react'
import { useProvideAuth } from '../../hooks'

const initialState = {
  user: null,
  getAllUsers: () => {},
  register: () => {},
  login: () => {},
  googleLogin: () => {},
  logout: () => {},
  loading: true,
}

export const UserContext = createContext(initialState) as any

export const UserProvider = ({ children }: any) => {
  const auth = useProvideAuth()

  return <UserContext.Provider value={auth}>{children}</UserContext.Provider>
}
