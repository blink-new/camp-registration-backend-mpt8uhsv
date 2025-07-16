/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'
import { Registration } from '@/types'

interface RegistrationContextType {
  selectedRegistration: Registration | null
  setSelectedRegistration: (registration: Registration | null) => void
  registrations: Registration[]
  setRegistrations: (registrations: Registration[]) => void
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined)

export const useRegistration = () => {
  const context = useContext(RegistrationContext)
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider')
  }
  return context
}

interface RegistrationProviderProps {
  children: React.ReactNode
}

export function RegistrationProvider({ children }: RegistrationProviderProps) {
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])

  return (
    <RegistrationContext.Provider
      value={{
        selectedRegistration,
        setSelectedRegistration,
        registrations,
        setRegistrations,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  )
}