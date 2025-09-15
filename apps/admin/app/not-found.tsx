'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
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
        <h1 style={{
          fontSize: '72px',
          fontWeight: '700',
          color: '#3b82f6',
          margin: '0 0 16px 0',
          lineHeight: '1'
        }}>
          404
        </h1>
        
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#111827',
          margin: '0 0 12px 0'
        }}>
          Página no encontrada
        </h2>
        
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          margin: '0 0 24px 0',
          lineHeight: '1.5'
        }}>
          La página que buscas no existe o ha sido movida.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link
            href="/admin"
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
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6'
            }}
          >
            <Home style={{ width: '16px', height: '16px' }} />
            Ir al Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            style={{
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
              e.currentTarget.style.color = '#374151'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#6b7280'
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Volver
          </button>
        </div>
      </div>
    </div>
  )
}
