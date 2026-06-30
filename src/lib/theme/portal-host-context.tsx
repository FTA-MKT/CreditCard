import * as React from "react"

export const PortalHostContext = React.createContext<Element | null>(null)

export function usePortalHost() {
  return React.useContext(PortalHostContext)
}

export function PortalHostProvider({ children }: { children: React.ReactNode }) {
  return (
    <PortalHostContext.Provider value={null}>
      {children}
    </PortalHostContext.Provider>
  )
}
