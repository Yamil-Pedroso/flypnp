import { AuthContext, useAuthController } from '../lib/hooks'

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useAuthController()
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
