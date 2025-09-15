"use client"
import { SidebarAdmin } from '../../components/sidebar'
import { useTheme } from '../../components/theme-provider'
import { AdminHeader } from '../../components/admin-header'
import { ProtectedRoute } from '../../components/protected-route'
import { useState, useEffect } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  useEffect(() => {
    // Escuchar cambios en el estado del sidebar desde localStorage
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('admin:sidebar:collapsed')
        setSidebarCollapsed(stored === 'true')
      } catch {
        setSidebarCollapsed(false)
      }
    }
    
    // Verificar estado inicial
    handleStorageChange()
    
    // Escuchar cambios en localStorage
    window.addEventListener('storage', handleStorageChange)
    
    // Polling para detectar cambios locales
    const interval = setInterval(handleStorageChange, 100)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])
  
  return (
    <ProtectedRoute>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
        overflow: 'hidden'
      }}>
        <AdminHeader />
        <div style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden'
        }}>
          <SidebarAdmin />
          <main style={{
            flex: 1,
            marginLeft: sidebarCollapsed ? '80px' : '240px',
            backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
            minHeight: 'calc(100vh - 80px)',
            transition: 'margin-left 0.3s ease-in-out',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            overflow: 'hidden',
            width: `calc(100vw - ${sidebarCollapsed ? '80px' : '240px'})`
          }}>
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}


