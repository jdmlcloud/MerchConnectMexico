'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Admin Error:', error)
  }, [error])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#0f172a',
      color: '#f1f5f9'
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
        border: '1px solid #334155'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <AlertTriangle 
            style={{ 
              width: '48px', 
              height: '48px', 
              color: '#ef4444' 
            }} 
          />
        </div>
        
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#f1f5f9',
          margin: '0 0 12px 0'
        }}>
          Error en el Dashboard
        </h1>
        
        <p style={{
          fontSize: '16px',
          color: '#94a3b8',
          margin: '0 0 24px 0',
          lineHeight: '1.5'
        }}>
          Ha ocurrido un error en el panel de administración. Por favor, intenta nuevamente.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={reset}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6'
            }}
          >
            <RefreshCw style={{ width: '16px', height: '16px' }} />
            Intentar de nuevo
          </button>
          
          <Link
            href="/admin"
            style={{
              backgroundColor: 'transparent',
              color: '#94a3b8',
              border: '1px solid #475569',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#334155'
              e.currentTarget.style.color = '#f1f5f9'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#94a3b8'
            }}
          >
            <Home style={{ width: '16px', height: '16px' }} />
            Ir al Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
