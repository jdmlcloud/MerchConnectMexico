"use client"

import { Users, Building2, DollarSign, TrendingUp, Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Bell, Settings, LogOut, RefreshCw, Wrench, Truck, ArrowRight, Package, FileText, Calculator, BarChart3, Palette, Upload, Code, Headphones, Plug, Shield, Lock, FileSearch, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTheme } from '../../components/theme-provider'
import { useBranding } from '../../hooks/use-branding'

export default function ProviderDashboard() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const [orgId, setOrgId] = useState<string>('provider-001')
  const [orgName, setOrgName] = useState<string>('Mi Proveedor')
  const [plan, setPlan] = useState<string>('premium')
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  
  // Branding hook
  const { brandConfig, loadBrandConfig, applyBrandToElement, generateCSS } = useBranding(orgId)

  // Mock data para el proveedor
  const [providerData, setProviderData] = useState({
    totalQuotes: 18,
    activeOrders: 12,
    monthlyRevenue: 18500,
    completedDeliveries: 89
  })

  const [recentQuotes] = useState([
    { id: 'COT-001', client: 'TechCorp México', amount: 3500, status: 'Enviada', date: '2024-01-15' },
    { id: 'COT-002', client: 'StartupLab', amount: 2200, status: 'Aceptada', date: '2024-01-14' },
    { id: 'COT-003', client: 'InnovateCo', amount: 4800, status: 'Pendiente', date: '2024-01-13' },
    { id: 'COT-004', client: 'Digital Solutions', amount: 1900, status: 'Enviada', date: '2024-01-12' }
  ])

  const [recentActivity] = useState([
    { action: 'Nueva cotización enviada', client: 'TechCorp México', time: 'Hace 2 horas' },
    { action: 'Pedido completado', client: 'StartupLab', time: 'Hace 4 horas' },
    { action: 'Inventario actualizado', client: 'InnovateCo', time: 'Hace 6 horas' },
    { action: 'Entrega programada', client: 'Digital Solutions', time: 'Hace 1 día' }
  ])

  useEffect(() => {
    setMounted(true)
    loadBrandConfig()
  }, [loadBrandConfig])

  const handleSectionClick = async (sectionName: string) => {
    setLoading(true)
    setLoadingMessage(`Cargando ${sectionName}...`)
    
    // Simular carga
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLoading(false)
  }

  const handleRefreshData = () => {
    setLoading(true)
    setLoadingMessage('Actualizando datos...')
    
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }

  if (!mounted) {
    return null
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
      color: theme === 'dark' ? '#f1f5f9' : '#111827',
      padding: '32px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: theme === 'dark' ? 'white' : '#0f172a',
              margin: '0 0 8px 0',
              letterSpacing: '-0.025em'
            }}>
              Dashboard del Proveedor
            </h1>
            <p style={{
              fontSize: '16px',
              color: theme === 'dark' ? '#94a3b8' : '#64748b',
              margin: '0',
              fontWeight: '400'
            }}>
              Gestiona cotizaciones, pedidos y monitorea el rendimiento de tu proveedor
            </p>
          </div>
          <button
            onClick={handleRefreshData}
            style={{
              backgroundColor: 'transparent',
              color: theme === 'dark' ? '#94a3b8' : '#64748b',
              border: theme === 'dark' ? '1px solid #475569' : '1px solid #d1d5db',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f1f5f9'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <RefreshCw style={{ width: '16px', height: '16px' }} />
            Actualizar Datos
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ width: '100%' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div style={{
            backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
            padding: '28px',
            borderRadius: '12px',
            border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
            boxShadow: theme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{
                  fontSize: '14px',
                  color: theme === 'dark' ? '#94a3b8' : '#64748b',
                  margin: '0 0 8px 0',
                  fontWeight: '500'
                }}>
                  Cotizaciones Activas
                </p>
                <p style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  margin: '0',
                  color: theme === 'dark' ? '#f1f5f9' : '#111827'
                }}>
                  {providerData.totalQuotes}
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
            padding: '28px',
            borderRadius: '12px',
            border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
            boxShadow: theme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => handleSectionClick('Pedidos')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = theme === 'dark' 
              ? '0 8px 25px -5px rgba(0, 0, 0, 0.4)' 
              : '0 10px 25px -5px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = theme === 'dark' 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{
                  fontSize: '14px',
                  color: theme === 'dark' ? '#94a3b8' : '#64748b',
                  margin: '0 0 8px 0',
                  fontWeight: '500'
                }}>
                  Pedidos Activos
                </p>
                <p style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  margin: '0',
                  color: theme === 'dark' ? '#f1f5f9' : '#111827'
                }}>
                  {providerData.activeOrders}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                  <span style={{
                    fontSize: '12px',
                    color: theme === 'dark' ? '#10b981' : '#059669',
                    fontWeight: '500'
                  }}>
                    Ver pedidos
                  </span>
                  <ArrowRight style={{ width: '12px', height: '12px', color: theme === 'dark' ? '#10b981' : '#059669' }} />
                </div>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Package style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
            padding: '28px',
            borderRadius: '12px',
            border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
            boxShadow: theme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => handleSectionClick('Entregas')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = theme === 'dark' 
              ? '0 8px 25px -5px rgba(0, 0, 0, 0.4)' 
              : '0 10px 25px -5px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = theme === 'dark' 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{
                  fontSize: '14px',
                  color: theme === 'dark' ? '#94a3b8' : '#64748b',
                  margin: '0 0 8px 0',
                  fontWeight: '500'
                }}>
                  Entregas Completadas
                </p>
                <p style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  margin: '0',
                  color: theme === 'dark' ? '#f1f5f9' : '#111827'
                }}>
                  {providerData.completedDeliveries}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                  <span style={{
                    fontSize: '12px',
                    color: theme === 'dark' ? '#f59e0b' : '#d97706',
                    fontWeight: '500'
                  }}>
                    Ver entregas
                  </span>
                  <ArrowRight style={{ width: '12px', height: '12px', color: theme === 'dark' ? '#f59e0b' : '#d97706' }} />
                </div>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Truck style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
            padding: '28px',
            borderRadius: '12px',
            border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
            boxShadow: theme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{
                  fontSize: '14px',
                  color: theme === 'dark' ? '#94a3b8' : '#64748b',
                  margin: '0 0 8px 0',
                  fontWeight: '500'
                }}>
                  Ingresos Mensuales
                </p>
                <p style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  margin: '0',
                  color: theme === 'dark' ? '#f1f5f9' : '#111827'
                }}>
                  ${providerData.monthlyRevenue.toLocaleString()}
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#8b5cf6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* Quotes Table */}
          <div style={{
            backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
            borderRadius: '12px',
            border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
            boxShadow: theme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
          <div style={{
            padding: '24px',
            borderBottom: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                margin: '0 0 4px 0',
                color: theme === 'dark' ? '#f1f5f9' : '#111827'
              }}>
                Cotizaciones Recientes
              </h2>
              <p style={{
                fontSize: '14px',
                color: theme === 'dark' ? '#94a3b8' : '#64748b',
                margin: '0',
                fontWeight: '400'
              }}>
                Gestiona las cotizaciones de tu proveedor
              </p>
            </div>
            <button 
              onClick={() => handleSectionClick('Nueva Cotización')}
              style={{ 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                border: 'none', 
                padding: '12px 20px', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6'
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Nueva Cotización
            </button>
          </div>
          
          <div style={{ padding: '28px' }}>
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              marginBottom: '24px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{ 
                position: 'relative', 
                flex: '1',
                minWidth: '300px'
              }}>
                <Search style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  color: theme === 'dark' ? '#64748b' : '#9ca3af'
                }} />
                <input
                  type="text"
                  placeholder="Buscar cotizaciones..."
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: theme === 'dark' ? '1px solid #475569' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    color: theme === 'dark' ? '#f1f5f9' : '#111827',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ 
                minWidth: '200px',
                flex: '0 0 auto'
              }}>
                <select style={{
                  width: '100%',
                  padding: '12px',
                  border: theme === 'dark' ? '1px solid #475569' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                  color: theme === 'dark' ? '#f1f5f9' : '#111827',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}>
                  <option value="">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="enviada">Enviada</option>
                  <option value="aceptada">Aceptada</option>
                </select>
              </div>
            </div>

            <div className="hide-scrollbar" style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0' }}>
                    <th style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: theme === 'dark' ? '#94a3b8' : '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Cotización
                    </th>
                    <th style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: theme === 'dark' ? '#94a3b8' : '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Cliente
                    </th>
                    <th style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: theme === 'dark' ? '#94a3b8' : '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Estado
                    </th>
                    <th style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: theme === 'dark' ? '#94a3b8' : '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Monto
                    </th>
                    <th style={{
                      padding: '16px 20px',
                      textAlign: 'right',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: theme === 'dark' ? '#94a3b8' : '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentQuotes.map((quote, index) => (
                    <tr key={quote.id} style={{
                      borderBottom: index < recentQuotes.length - 1 
                        ? (theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0')
                        : 'none'
                    }}>
                      <td style={{ padding: '20px' }}>
                        <div>
                          <p style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            margin: '0 0 4px 0',
                            color: theme === 'dark' ? '#f1f5f9' : '#111827'
                          }}>
                            {quote.id}
                          </p>
                          <p style={{
                            fontSize: '12px',
                            color: theme === 'dark' ? '#94a3b8' : '#64748b',
                            margin: '0'
                          }}>
                            {quote.date}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '20px' }}>
                        <p style={{
                          fontSize: '14px',
                          color: theme === 'dark' ? '#f1f5f9' : '#111827',
                          margin: '0'
                        }}>
                          {quote.client}
                        </p>
                      </td>
                      <td style={{ padding: '20px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: quote.status === 'Aceptada' 
                            ? (theme === 'dark' ? '#065f46' : '#d1fae5')
                            : quote.status === 'Enviada'
                            ? (theme === 'dark' ? '#7c2d12' : '#fed7aa')
                            : (theme === 'dark' ? '#374151' : '#f3f4f6'),
                          color: quote.status === 'Aceptada'
                            ? (theme === 'dark' ? '#6ee7b7' : '#059669')
                            : quote.status === 'Enviada'
                            ? (theme === 'dark' ? '#fed7aa' : '#ea580c')
                            : (theme === 'dark' ? '#9ca3af' : '#6b7280')
                        }}>
                          {quote.status}
                        </span>
                      </td>
                      <td style={{ padding: '20px' }}>
                        <p style={{
                          fontSize: '14px',
                          color: theme === 'dark' ? '#cbd5e1' : '#374151',
                          margin: '0',
                          fontWeight: '600'
                        }}>
                          ${quote.amount.toLocaleString()}
                        </p>
                      </td>
                      <td style={{ padding: '20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button 
                            style={{ 
                              backgroundColor: 'transparent', 
                              border: theme === 'dark' ? '1px solid #475569' : '1px solid #d1d5db', 
                              padding: '8px', 
                              borderRadius: '6px', 
                              cursor: 'pointer',
                              color: theme === 'dark' ? '#94a3b8' : '#64748b',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            title="Ver detalles"
                          >
                            <Eye style={{ width: '14px', height: '14px' }} />
                          </button>
                          <button 
                            style={{ 
                              backgroundColor: 'transparent', 
                              border: theme === 'dark' ? '1px solid #475569' : '1px solid #d1d5db', 
                              padding: '8px', 
                              borderRadius: '6px', 
                              cursor: 'pointer',
                              color: theme === 'dark' ? '#94a3b8' : '#64748b',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            title="Editar"
                          >
                            <Edit style={{ width: '14px', height: '14px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </div>

          {/* Side Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Recent Activity */}
            <div style={{
              backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
              borderRadius: '12px',
              border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
              boxShadow: theme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '24px',
                borderBottom: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
                backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  margin: '0 0 4px 0',
                  color: theme === 'dark' ? '#f1f5f9' : '#111827'
                }}>
                  Actividad Reciente
                </h3>
                <p style={{
                  fontSize: '12px',
                  color: theme === 'dark' ? '#94a3b8' : '#64748b',
                  margin: '0',
                  fontWeight: '400'
                }}>
                  Últimas acciones en tu proveedor
                </p>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {recentActivity.map((activity, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      padding: '16px',
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
                      borderRadius: '8px',
                      border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0'
                    }}>
                      <p style={{
                        fontSize: '14px',
                        color: theme === 'dark' ? '#f1f5f9' : '#111827',
                        margin: '0',
                        fontWeight: '500'
                      }}>
                        {activity.action}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: theme === 'dark' ? '#94a3b8' : '#64748b',
                        margin: '0',
                        fontWeight: '400'
                      }}>
                        {activity.client} • {activity.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
              borderRadius: '12px',
              border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
              boxShadow: theme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '24px',
                borderBottom: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
                backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  margin: '0 0 4px 0',
                  color: theme === 'dark' ? '#f1f5f9' : '#111827'
                }}>
                  Acciones Rápidas
                </h3>
                <p style={{
                  fontSize: '12px',
                  color: theme === 'dark' ? '#94a3b8' : '#64748b',
                  margin: '0',
                  fontWeight: '400'
                }}>
                  Acceso directo a funciones comunes
                </p>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button 
                    onClick={() => handleSectionClick('Nueva Cotización')}
                    style={{ 
                      backgroundColor: '#3b82f6', 
                      color: 'white', 
                      border: 'none', 
                      padding: '14px 20px', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563eb'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#3b82f6'
                    }}
                  >
                    <Plus style={{ width: '16px', height: '16px' }} />
                    Nueva Cotización
                  </button>
                  <button 
                    onClick={() => handleSectionClick('Gestión de Inventario')}
                    style={{ 
                      backgroundColor: '#10b981', 
                      color: 'white', 
                      border: 'none', 
                      padding: '14px 20px', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#10b981'
                    }}
                  >
                    <FileSearch style={{ width: '16px', height: '16px' }} />
                    Gestión de Inventario
                  </button>
                  <button 
                    onClick={() => handleSectionClick('Entregas')}
                    style={{ 
                      backgroundColor: '#f59e0b', 
                      color: 'white', 
                      border: 'none', 
                      padding: '14px 20px', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#d97706'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f59e0b'
                    }}
                  >
                    <Truck style={{ width: '16px', height: '16px' }} />
                    Entregas
                  </button>
                  <button 
                    onClick={() => handleSectionClick('Configuración')}
                    style={{ 
                      backgroundColor: 'transparent', 
                      color: theme === 'dark' ? '#e2e8f0' : '#374151', 
                      border: theme === 'dark' ? '1px solid #475569' : '1px solid #d1d5db', 
                      padding: '14px 20px', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Settings style={{ width: '16px', height: '16px' }} />
                    Configuración
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
            padding: '32px',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: `4px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
              borderTop: `4px solid #f59e0b`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{
              color: theme === 'dark' ? '#f1f5f9' : '#111827',
              fontSize: '16px',
              margin: '0',
              fontWeight: '500'
            }}>
              {loadingMessage}
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}