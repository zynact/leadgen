"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export interface ThemeProviderState {
  theme: string | undefined;
  setTheme: (theme: string) => void;
}

export const ThemeProviderContext = React.createContext<
  ThemeProviderState | undefined
>(undefined)

function ThemeProviderWithContext({ children, ...props }: ThemeProviderProps) {
  const { theme, setTheme } = useNextTheme();
  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeProviderWithContext>
        {children}
      </ThemeProviderWithContext>
    </NextThemesProvider>
  )
}
