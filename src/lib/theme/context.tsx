import React, { createContext, useContext, useState } from "react"

export interface Theme {
  radius: number
  primaryColor: string
}

const defaultTheme: Theme = {
  radius: 0.5,
  primaryColor: "#2563eb",
}

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Partial<Theme>) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const setTheme = (partial: Partial<Theme>) =>
    setThemeState(prev => ({ ...prev, ...partial }))
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
