// SearchContext.tsx
import React, { createContext, useState, ReactNode } from 'react'

interface SearchContextType {
  isMainContainerClicked: boolean
  setIsMainContainerClicked: (clicked: boolean) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

interface SearchProviderProps {
  children: ReactNode
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [isMainContainerClicked, setIsMainContainerClicked] = useState<boolean>(
    false,
  )

  return (
    <SearchContext.Provider
      value={{ isMainContainerClicked, setIsMainContainerClicked }}
    >
      {children}
    </SearchContext.Provider>
  )
}
