import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export interface AlertData {
  id: string
  title?: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number // Auto-dismiss time in milliseconds, 0 for persistent
}

interface AlertContextType {
  alerts: AlertData[]
  addAlert: (alert: Omit<AlertData, 'id'>) => void
  removeAlert: (id: string) => void
  clearAlerts: () => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertData[]>([])

  const addAlert = (alertData: Omit<AlertData, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newAlert: AlertData = {
      ...alertData,
      id,
      duration: alertData.duration ?? 5000 // Default 5 seconds
    }

    setAlerts(prev => [...prev, newAlert])

    // Auto-dismiss if duration is set and > 0
    if (newAlert.duration && newAlert.duration > 0) {
      setTimeout(() => {
        removeAlert(id)
      }, newAlert.duration)
    }
  }

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const clearAlerts = () => {
    setAlerts([])
  }

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert, clearAlerts }}>
      {children}
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}
