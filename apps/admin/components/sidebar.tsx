"use client"

import React, { useState, useEffect } from 'react'
import { useTheme } from './theme-provider'
import { 
  Building2, 
  Users, 
  Wrench, 
  Truck, 
  Settings, 
  Menu, 
  X,
  Home,
  BarChart3,
  Shield
} from 'lucide-react'

export function SidebarAdmin() {
  const { theme } = useTheme()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detectar si es móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Verificar estado del sidebar desde localStorage
    try {
      const stored = localStorage.getItem('admin:sidebar:collapsed')
      setSidebarCollapsed(stored === 'true')
    } catch {
      setSidebarCollapsed(false)
    }

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    try {
      localStorage.setItem('admin:sidebar:collapsed', newState.toString())
    } catch {
      // Ignorar errores de localStorage
    }
  }

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      href: '/admin',
      active: true
    },
    {
      icon: Building2,
      label: 'Organizaciones',
      href: '/admin/organizaciones',
      children: [
        { label: 'Talleres', href: '/admin/organizaciones/workshops' },
        { label: 'Proveedores', href: '/admin/organizaciones/proveedores' }
      ]
    },
    {
      icon: Users,
      label: 'Usuarios',
      href: '/admin/usuarios'
    },
    {
      icon: Wrench,
      label: 'Talleres',
      href: '/admin/talleres'
    },
    {
      icon: Truck,
      label: 'Proveedores',
      href: '/admin/proveedores'
    },
    {
      icon: BarChart3,
      label: 'Reportes',
      href: '/admin/reportes'
    },
    {
      icon: Settings,
      label: 'Configuración',
      href: '/admin/configuracion'
    }
  ]

  const sidebarWidth = sidebarCollapsed ? '80px' : '240px'

  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: sidebarWidth,
          height: '100vh',
          backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
          borderRight: `1px solid ${theme === 'dark' ? '#1e293b' : '#e5e7eb'}`,
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 50,
          transition: 'width 0.3s ease-in-out',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header del sidebar */}
        <div
          style={{
            padding: '16px',
            borderBottom: `1px solid ${theme === 'dark' ? '#1e293b' : '#e5e7eb'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
            minHeight: '64px'
          }}
        >
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Shield size={20} color="white" />
              </div>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: theme === 'dark' ? '#f1f5f9' : '#111827'
                }}
              >
                MerchConnect
              </span>
            </div>
          )}
          
          <button
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              color: theme === 'dark' ? '#94a3b8' : '#6b7280',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f3f4f6'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Menú de navegación */}
        <nav
          style={{
            flex: 1,
            padding: '16px 0',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
          className="hide-scrollbar"
        >
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {menuItems.map((item, index) => (
              <li key={index} style={{ marginBottom: '4px' }}>
                <a
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    color: theme === 'dark' ? '#94a3b8' : '#6b7280',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    backgroundColor: item.active 
                      ? (theme === 'dark' ? '#1e293b' : '#f3f4f6')
                      : 'transparent',
                    borderLeft: item.active 
                      ? `3px solid ${theme === 'dark' ? '#3b82f6' : '#1d4ed8'}`
                      : '3px solid transparent'
                  }}
                  onMouseOver={(e) => {
                    if (!item.active) {
                      e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f3f4f6'
                      e.currentTarget.style.color = theme === 'dark' ? '#f1f5f9' : '#111827'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!item.active) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = theme === 'dark' ? '#94a3b8' : '#6b7280'
                    }
                  }}
                >
                  <item.icon 
                    size={20} 
                    style={{ 
                      marginRight: sidebarCollapsed ? 0 : '12px',
                      minWidth: '20px'
                    }} 
                  />
                  {!sidebarCollapsed && (
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      {item.label}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer del sidebar */}
        <div
          style={{
            padding: '16px',
            borderTop: `1px solid ${theme === 'dark' ? '#1e293b' : '#e5e7eb'}`,
            textAlign: sidebarCollapsed ? 'center' : 'left'
          }}
        >
          {!sidebarCollapsed && (
            <div
              style={{
                fontSize: '12px',
                color: theme === 'dark' ? '#64748b' : '#9ca3af',
                lineHeight: '1.4'
              }}
            >
              <div>MerchConnect México</div>
              <div>v1.0.0</div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
