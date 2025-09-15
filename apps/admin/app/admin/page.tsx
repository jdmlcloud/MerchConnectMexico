"use client"

import { Building2, TrendingUp, Plus, Search, Eye, Edit, Trash2, RefreshCw, Wrench, Truck, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTheme } from '../../components/theme-provider'
import { NuevaOrganizacionModal } from '../../components/nueva-organizacion-modal'
import { VerOrganizacionModal } from '../../components/ver-organizacion-modal'
import { EditarOrganizacionModal } from '../../components/editar-organizacion-modal'
import { ConfirmDeleteModal } from '../../components/confirm-delete-modal'
import { FullscreenLoader } from '../../components/fullscreen-loader'
import { useLoader } from '../../hooks/use-loader'
import { useOrganizations } from '../../hooks/use-organizations'

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null)
  const [modalType, setModalType] = useState<'organization' | 'workshop' | 'provider'>('organization')
  const { isLoading, loadingMessage, startLoading, stopLoading } = useLoader()
  const { organizations, loading: orgsLoading, error: orgsError, createOrganization, updateOrganization, deleteOrganization } = useOrganizations()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleOpenModal = (type: 'organization' | 'workshop' | 'provider') => {
    setModalType(type)
    setIsModalOpen(true)
  }

  const handleSaveOrganizacion = async (nuevaOrg: any) => {
    const loadingMessage = modalType === 'workshop' ? 'Creando taller...' : 
                          modalType === 'provider' ? 'Creando proveedor...' : 
                          'Creando organización...'
    startLoading(loadingMessage)
    
    try {
      const orgData = {
        orgType: modalType === 'organization' ? nuevaOrg.sectionType : modalType,
        orgSlug: nuevaOrg.name.toLowerCase().replace(/\s+/g, '-'),
        plan: nuevaOrg.plan === 'Premium' ? 'premium' : nuevaOrg.plan === 'Enterprise' ? 'premium' : 'free',
        // Incluir todos los campos adicionales
        name: nuevaOrg.name,
        type: nuevaOrg.type,
        industry: nuevaOrg.industry,
        location: nuevaOrg.location,
        address: nuevaOrg.address,
        contact: nuevaOrg.contact,
        email: nuevaOrg.email,
        phone: nuevaOrg.phone,
        website: nuevaOrg.website || undefined,
        description: nuevaOrg.description,
        employees: nuevaOrg.employees ? parseInt(nuevaOrg.employees) : 0,
        status: nuevaOrg.status
      }
      
      console.log('🔍 Datos que se van a enviar:', orgData)
      console.log('🔍 Modal type:', modalType)
      console.log('🔍 Nueva org data:', nuevaOrg)
      
      const result = await createOrganization(orgData)
      
      if (result.success) {
        console.log(`${modalType} creado:`, result.data)
        setIsModalOpen(false) // Cerrar modal después de crear
      } else {
        console.error(`Error al crear ${modalType}:`, result.error)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      stopLoading()
    }
  }


  const handleSectionClick = async (sectionName: string) => {
    startLoading(`Cargando ${sectionName}...`)
    
    // Simular carga
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    stopLoading()
  }

  const handleViewOrganization = (org: any) => {
    console.log('Datos de organización para ver:', org)
    // Expandir datos con información adicional para visualización
    const expandedOrg = {
      ...org,
      industry: org.industry || 'Tecnología',
      location: org.location || 'Ciudad de México',
      address: org.address || 'Dirección de ejemplo',
      contact: org.contact || 'Contacto de ejemplo',
      email: org.email || 'email@ejemplo.com',
      phone: org.phone || '+52 55 1234-5678',
      website: org.website || 'https://ejemplo.com',
      description: org.description || 'Descripción de ejemplo',
      employees: org.employees || 10,
      status: org.status || 'active'
    }
    setSelectedOrganization(expandedOrg)
    setIsViewModalOpen(true)
  }

  const handleEditOrganization = (org: any) => {
    console.log('Datos de organización para editar:', org)
    // Expandir datos con información adicional para edición
    const expandedOrg = {
      ...org,
      industry: org.industry || 'Tecnología',
      location: org.location || 'Ciudad de México',
      address: org.address || 'Dirección de ejemplo',
      contact: org.contact || 'Contacto de ejemplo',
      email: org.email || 'email@ejemplo.com',
      phone: org.phone || '+52 55 1234-5678',
      website: org.website || 'https://ejemplo.com',
      description: org.description || 'Descripción de ejemplo',
      employees: org.employees || 10,
      status: org.status || 'active'
    }
    setSelectedOrganization(expandedOrg)
    setIsEditModalOpen(true)
  }

  const handleDeleteOrganization = (org: any) => {
    setSelectedOrganization(org)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedOrganization) return
    
    startLoading('Eliminando organización...')
    
    try {
      // Extraer el ID real del pk (formato: ORG#ID)
      const orgId = selectedOrganization.pk.replace('ORG#', '')
      const result = await deleteOrganization(orgId)
      
      if (result.success) {
        console.log('Organización eliminada:', selectedOrganization.orgSlug)
      } else {
        console.error('Error al eliminar organización:', result.error)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      stopLoading()
    }
  }

  const handleSaveEditOrganization = async (organizacionEditada: any) => {
    startLoading('Guardando cambios...')
    
    try {
      // Por ahora solo actualizamos localmente
      // En el futuro esto debería llamar a una API de actualización
      console.log('Organización editada:', organizacionEditada)
      setIsEditModalOpen(false)
      setSelectedOrganization(null)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      stopLoading()
    }
  }

  const handleNavigateToWorkshops = () => {
    startLoading('Navegando a talleres...')
    setTimeout(() => {
      window.location.href = '/admin/organizaciones/workshops'
    }, 1000)
  }

  const handleNavigateToProviders = () => {
    startLoading('Navegando a proveedores...')
    setTimeout(() => {
      window.location.href = '/admin/organizaciones/proveedores'
    }, 1000)
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
              Dashboard Administrativo
            </h1>
            <p style={{
              fontSize: '16px',
              color: theme === 'dark' ? '#94a3b8' : '#64748b',
              margin: '0',
              fontWeight: '400'
            }}>
              Gestiona organizaciones, usuarios y monitorea el rendimiento de la plataforma
            </p>
          </div>
          <button
            onClick={() => {
              console.log('🔄 Refreshing organizations...')
              fetchOrganizations()
            }}
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
                  Total Organizaciones
                </p>
                <p style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  margin: '0',
                  color: theme === 'dark' ? '#f1f5f9' : '#111827'
                }}>
                  {orgsLoading ? '...' : organizations.length}
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
                <Building2 style={{ width: '24px', height: '24px', color: 'white' }} />
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
          onClick={handleNavigateToWorkshops}
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
                  Talleres Activos
                </p>
                <p style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  margin: '0',
                  color: theme === 'dark' ? '#f1f5f9' : '#111827'
                }}>
                  {organizations.filter(org => org.gsi1pk?.includes('workshop')).length}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                  <span style={{
                    fontSize: '12px',
                    color: theme === 'dark' ? '#10b981' : '#059669',
                    fontWeight: '500'
                  }}>
                    Ver talleres
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
                <Wrench style={{ width: '24px', height: '24px', color: 'white' }} />
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
          onClick={handleNavigateToProviders}
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
                  Proveedores
                </p>
                <p style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  margin: '0',
                  color: theme === 'dark' ? '#f1f5f9' : '#111827'
                }}>
                  {organizations.filter(org => org.gsi1pk?.includes('provider')).length}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                  <span style={{
                    fontSize: '12px',
                    color: theme === 'dark' ? '#f59e0b' : '#d97706',
                    fontWeight: '500'
                  }}>
                    Ver proveedores
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
                  $0
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
          {/* Organizations Table */}
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
                Organizaciones
              </h2>
              <p style={{
                fontSize: '14px',
                color: theme === 'dark' ? '#94a3b8' : '#64748b',
                margin: '0',
                fontWeight: '400'
              }}>
                Gestiona todas las organizaciones registradas
              </p>
            </div>
            <button 
              onClick={() => {
                console.log('Abriendo modal...')
                setIsModalOpen(true)
              }}
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
              Nueva Organización
            </button>
          </div>
          
          <div style={{ padding: '28px' }}>
            {orgsError && (
              <div style={{
                backgroundColor: theme === 'dark' ? '#7f1d1d' : '#fef2f2',
                border: theme === 'dark' ? '1px solid #dc2626' : '1px solid #fecaca',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <p style={{
                  color: theme === 'dark' ? '#fca5a5' : '#dc2626',
                  margin: '0',
                  fontSize: '14px'
                }}>
                  Error al cargar organizaciones: {orgsError}
                </p>
              </div>
            )}
            
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
                  placeholder="Buscar organizaciones..."
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
                  <option value="">Todos los tipos</option>
                  <option value="workshop">Talleres</option>
                  <option value="provider">Proveedores</option>
                </select>
              </div>
            </div>

            {orgsLoading ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '48px',
                color: theme === 'dark' ? '#94a3b8' : '#64748b'
              }}>
                Cargando organizaciones...
              </div>
            ) : (
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
                        Organización
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
                        Tipo
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
                        Plan
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
                        Fecha de Creación
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
                    {organizations.map((org, index) => (
                      <tr key={org.pk} style={{
                        borderBottom: index < organizations.length - 1 
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
                              {org.orgSlug}
                            </p>
                            <p style={{
                              fontSize: '12px',
                              color: theme === 'dark' ? '#94a3b8' : '#64748b',
                              margin: '0'
                            }}>
                              ID: {org.pk.split('#')[1]}
                            </p>
                          </div>
                        </td>
                        <td style={{ padding: '20px' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: org.gsi1pk?.includes('workshop') 
                              ? (theme === 'dark' ? '#065f46' : '#d1fae5')
                              : (theme === 'dark' ? '#7c2d12' : '#fed7aa'),
                            color: org.gsi1pk?.includes('workshop')
                              ? (theme === 'dark' ? '#6ee7b7' : '#059669')
                              : (theme === 'dark' ? '#fed7aa' : '#ea580c')
                          }}>
                            {org.gsi1pk?.includes('workshop') ? 'Taller' : 'Proveedor'}
                          </span>
                        </td>
                        <td style={{ padding: '20px' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: org.plan === 'premium' 
                              ? (theme === 'dark' ? '#7c2d12' : '#fed7aa')
                              : org.plan === 'pro'
                              ? (theme === 'dark' ? '#1e3a8a' : '#dbeafe')
                              : (theme === 'dark' ? '#374151' : '#f3f4f6'),
                            color: org.plan === 'premium'
                              ? (theme === 'dark' ? '#fed7aa' : '#ea580c')
                              : org.plan === 'pro'
                              ? (theme === 'dark' ? '#93c5fd' : '#2563eb')
                              : (theme === 'dark' ? '#9ca3af' : '#6b7280')
                          }}>
                            {org.plan === 'premium' ? 'Premium' : org.plan === 'pro' ? 'Pro' : 'Free'}
                          </span>
                        </td>
                        <td style={{ padding: '20px' }}>
                          <p style={{
                            fontSize: '14px',
                            color: theme === 'dark' ? '#cbd5e1' : '#374151',
                            margin: '0'
                          }}>
                            {new Date(org.createdAt).toLocaleDateString('es-MX')}
                          </p>
                        </td>
                        <td style={{ padding: '20px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => handleViewOrganization(org)}
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
                              onClick={() => handleEditOrganization(org)}
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
                            <button 
                              onClick={() => handleDeleteOrganization(org)}
                              style={{ 
                                backgroundColor: 'transparent', 
                                border: theme === 'dark' ? '1px solid #475569' : '1px solid #d1d5db', 
                                padding: '8px', 
                                borderRadius: '6px', 
                                cursor: 'pointer',
                                color: theme === 'dark' ? '#ef4444' : '#dc2626',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                              }}
                              title="Eliminar"
                            >
                              <Trash2 style={{ width: '14px', height: '14px' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
                  Últimas acciones en la plataforma
                </p>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { action: 'Nueva organización creada', org: 'TechCorp México', time: 'Hace 2 horas' },
                    { action: 'Plan actualizado', org: 'StartupLab', time: 'Hace 4 horas' },
                    { action: 'Usuario agregado', org: 'InnovateCo', time: 'Hace 6 horas' },
                    { action: 'Pago procesado', org: 'Digital Solutions', time: 'Hace 1 día' }
                  ].map((activity, index) => (
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
                        {activity.org} • {activity.time}
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
                    onClick={() => handleOpenModal('organization')}
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
                    Crear Organización
                  </button>
                  <button 
                    onClick={() => handleOpenModal('workshop')}
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
                    <Wrench style={{ width: '16px', height: '16px' }} />
                    Crear Taller
                  </button>
                  <button 
                    onClick={() => handleOpenModal('provider')}
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
                    Crear Proveedor
                  </button>
                  <button 
                    onClick={handleNavigateToWorkshops}
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
                    <Wrench style={{ width: '16px', height: '16px' }} />
                    Ver Talleres
                  </button>
                  <button 
                    onClick={handleNavigateToProviders}
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
                    <Truck style={{ width: '16px', height: '16px' }} />
                    Ver Proveedores
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <NuevaOrganizacionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveOrganizacion}
        modalType={modalType}
      />

      <VerOrganizacionModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedOrganization(null)
        }}
        organizacion={selectedOrganization}
      />

      <EditarOrganizacionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedOrganization(null)
        }}
        onSave={handleSaveEditOrganization}
        onUpdate={updateOrganization}
        organizacion={selectedOrganization}
      />

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && selectedOrganization && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setSelectedOrganization(null)
          }}
          onConfirm={handleConfirmDelete}
          title="Eliminar Organización"
          message="¿Estás seguro de que quieres eliminar esta organización? Esta acción no se puede deshacer."
          itemName={selectedOrganization.orgSlug || selectedOrganization.name || 'Organización'}
          theme={theme}
        />
      )}

      {/* Loader de pantalla completa */}
      <FullscreenLoader
        isVisible={isLoading}
        message={loadingMessage}
      />
    </div>
  )
}
