"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    // Aplicar tema inmediatamente para prevenir FOUC
    const applyTheme = (newTheme: Theme) => {
      const root = document.documentElement
      root.setAttribute('data-theme', newTheme)
      
      if (newTheme === 'light') {
        root.style.backgroundColor = '#f8fafc'
        root.style.color = '#111827'
        root.style.colorScheme = 'light'
      } else {
        root.style.backgroundColor = '#0f172a'
        root.style.color = '#f1f5f9'
        root.style.colorScheme = 'dark'
      }
    }

    // Obtener tema del localStorage o usar dark por defecto
    try {
      const savedTheme = localStorage.getItem('admin:theme') as Theme
      if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
        setThemeState(savedTheme)
        applyTheme(savedTheme)
      } else {
        applyTheme('dark')
      }
    } catch {
      applyTheme('dark')
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem('admin:theme', newTheme)
    } catch {
      // Ignorar errores de localStorage
    }
    
    // Aplicar tema inmediatamente
    const root = document.documentElement
    root.setAttribute('data-theme', newTheme)
    
    if (newTheme === 'light') {
      root.style.backgroundColor = '#f8fafc'
      root.style.color = '#111827'
      root.style.colorScheme = 'light'
    } else {
      root.style.backgroundColor = '#0f172a'
      root.style.color = '#f1f5f9'
      root.style.colorScheme = 'dark'
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const value = {
    theme,
    setTheme,
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
