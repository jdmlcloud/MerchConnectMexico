'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error)
  }, [error])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f8fafc',
      color: '#1f2937'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
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
          color: '#111827',
          margin: '0 0 12px 0'
        }}>
          ¡Algo salió mal!
        </h1>
        
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          margin: '0 0 24px 0',
          lineHeight: '1.5'
        }}>
          Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
        </p>
        
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
            margin: '0 auto',
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
      </div>
    </div>
  )
}
