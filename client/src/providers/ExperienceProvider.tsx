import type { ReactNode } from 'react'
import { ExperiencesContext, useExperiencesController } from '../lib/hooks'

const ExperienceProvider = ({ children }: { children: ReactNode }) => {
  const value = useExperiencesController()
  return <ExperiencesContext.Provider value={value}>{children}</ExperiencesContext.Provider>
}

export default ExperienceProvider
