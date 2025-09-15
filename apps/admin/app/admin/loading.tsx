'use client'

export default function AdminLoading() {
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
        maxWidth: '400px',
        width: '100%',
        border: '1px solid #334155'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #475569',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
        
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#f1f5f9',
          margin: '0 0 8px 0'
        }}>
          Cargando Dashboard...
        </h2>
        
        <p style={{
          fontSize: '14px',
          color: '#94a3b8',
          margin: '0',
          lineHeight: '1.5'
        }}>
          Preparando el panel de administración
        </p>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
