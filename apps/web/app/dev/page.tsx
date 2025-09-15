"use client"

import React, { useEffect, useState } from 'react'
import { getEnvironmentInfo } from '../../lib/config'

export default function DevelopmentPage() {
  const [envInfo, setEnvInfo] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const info = getEnvironmentInfo()
    setEnvInfo(info)
  }, [])

  if (!isClient) {
    return <div>Cargando...</div>
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f0f2f5',
      flexDirection: 'column'
    }}>
      <div style={{ 
        padding: '40px', 
        backgroundColor: '#fff', 
        borderRadius: '8px', 
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)', 
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          marginBottom: '20px', 
          color: '#333',
          background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          MerchConnect México
        </h1>
        
        <div style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '30px',
          display: 'inline-block'
        }}>
          ENTORNO DE DESARROLLO
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#374151' }}>
            Bienvenido al Entorno de Desarrollo
          </h2>
          <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6' }}>
            Este es el entorno de desarrollo de MerchConnect México. 
            Aquí puedes desarrollar nuevas funcionalidades y realizar 
            pruebas en un ambiente controlado.
          </p>
        </div>

        {envInfo && (
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#374151' }}>
              Configuración del Entorno:
            </h3>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              <div><strong>Entorno:</strong> {envInfo.environment.toUpperCase()}</div>
              <div><strong>API Gateway:</strong> {envInfo.config.apiGatewayId}</div>
              <div><strong>Base de Datos:</strong> {envInfo.config.tableName}</div>
              <div><strong>URL API:</strong> {envInfo.config.baseUrl}</div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="/admin" 
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            Panel de Administración
          </a>
          
          <a 
            href="/workshop" 
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            Dashboard de Talleres
          </a>
        </div>

        <div style={{ 
          marginTop: '30px', 
          padding: '15px', 
          backgroundColor: '#dbeafe', 
          borderRadius: '6px',
          border: '1px solid #3b82f6'
        }}>
          <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
            💻 <strong>Entorno de Desarrollo:</strong> Ideal para desarrollo y pruebas locales.
          </p>
        </div>
      </div>
    </div>
  )
}
