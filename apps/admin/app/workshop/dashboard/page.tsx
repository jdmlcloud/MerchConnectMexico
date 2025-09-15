"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, LogOut, User, Settings } from 'lucide-react'

export default function WorkshopDashboardPage() {
  const router = useRouter()
  const [organizationId, setOrganizationId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular obtención del ID de la organización
    // En producción esto vendría de la autenticación
    const mockOrgId = 'ORG-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    setOrganizationId(mockOrgId)
    setLoading(false)
  }, [])

  const handleLogout = () => {
    // Simular logout
    router.push('/workshop/login')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{
            color: '#6b7280',
            fontSize: '16px'
          }}>
            Cargando dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc'
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <Building2 style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
          <span style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            marginLeft: '12px'
          }}>
            MerchConnect México
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#6b7280',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        padding: '48px 24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Welcome Section */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px'
            }}>
              <User style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1f2937',
                margin: '0 0 4px 0'
              }}>
                ¡Bienvenido a tu Dashboard!
              </h1>
              <p style={{
                color: '#6b7280',
                fontSize: '16px',
                margin: '0'
              }}>
                Tu taller está configurado y listo para usar
              </p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '2px solid #10b981'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: '#10b981',
              borderRadius: '50%',
              marginRight: '12px'
            }} />
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0'
            }}>
              Estado del Sistema
            </h2>
          </div>
          
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <p style={{
              color: '#166534',
              fontSize: '16px',
              fontWeight: '500',
              margin: '0 0 8px 0'
            }}>
              ✅ Sistema Funcionando Correctamente
            </p>
            <p style={{
              color: '#166534',
              fontSize: '14px',
              margin: '0'
            }}>
              Todos los servicios están operativos y tu cuenta está activa
            </p>
          </div>
        </div>

        {/* Organization ID Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 16px 0'
          }}>
            Información de tu Organización
          </h2>
          
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <Settings style={{ width: '20px', height: '20px', color: '#6b7280', marginRight: '8px' }} />
              <span style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                ID de Organización:
              </span>
            </div>
            <div style={{
              background: '#1f2937',
              color: '#10b981',
              padding: '12px 16px',
              borderRadius: '6px',
              fontFamily: 'Monaco, Menlo, monospace',
              fontSize: '16px',
              fontWeight: '600',
              letterSpacing: '1px'
            }}>
              {organizationId}
            </div>
            <p style={{
              color: '#6b7280',
              fontSize: '14px',
              margin: '12px 0 0 0'
            }}>
              Guarda este ID para futuras referencias y soporte técnico
            </p>
          </div>
        </div>

        {/* Next Steps Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 16px 0'
          }}>
            Próximos Pasos
          </h2>
          
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: '#3b82f6',
                borderRadius: '50%',
                marginRight: '12px'
              }} />
              <span style={{
                color: '#374151',
                fontSize: '16px'
              }}>
                Configura tu perfil y preferencias
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: '#3b82f6',
                borderRadius: '50%',
                marginRight: '12px'
              }} />
              <span style={{
                color: '#374151',
                fontSize: '16px'
              }}>
                Explora las funcionalidades disponibles
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: '#3b82f6',
                borderRadius: '50%',
                marginRight: '12px'
              }} />
              <span style={{
                color: '#374151',
                fontSize: '16px'
              }}>
                Contacta a soporte si necesitas ayuda
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* CSS para la animación de loading */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
