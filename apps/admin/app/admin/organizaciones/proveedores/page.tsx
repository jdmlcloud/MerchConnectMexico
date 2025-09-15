"use client"

import React from 'react'
import { useTheme } from '../../../../components/theme-provider'
import { NuevaOrganizacionModal } from '../../../../components/nueva-organizacion-modal'
import { VerOrganizacionModal } from '../../../../components/ver-organizacion-modal'
import { EditarOrganizacionModal } from '../../../../components/editar-organizacion-modal'
import { ConfirmDeleteModal } from '../../../../components/confirm-delete-modal'
import { GestorFuncionalidadesModal } from '../../../../components/gestor-funcionalidades-modal'
import { BrandManagementModal } from '../../../../components/brand-management-modal'
import { useOrganizations } from '../../../../hooks/use-organizations'
import { 
  Truck, 
  CheckCircle, 
  XCircle, 
  List, 
  Settings,
  Palette,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Package,
  DollarSign
} from 'lucide-react'

export default function ProveedoresPage() {
  const [mounted, setMounted] = React.useState(false)
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = React.useState<'active' | 'inactive' | 'all'>('active')
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = React.useState(false)
  const [isBrandModalOpen, setIsBrandModalOpen] = React.useState(false)
  const [selectedProveedor, setSelectedProveedor] = React.useState<any>(null)
  const { getProviders, loading: orgsLoading, error: orgsError, createOrganization, updateOrganization, deleteOrganization } = useOrganizations()
  
  // Obtener proveedores de las organizaciones
  const proveedores = getProviders()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleSaveProveedor = async (newProveedor: any) => {
    try {
      console.log('Guardando nuevo proveedor:', newProveedor)
      
      // Usar la función createOrganization del hook con todos los datos del proveedor
      const result = await createOrganization({
        orgType: 'provider', // Siempre será provider
        orgSlug: newProveedor.name.toLowerCase().replace(/\s+/g, '-'),
        plan: 'free', // Por defecto free, se puede cambiar después
        // Campos adicionales del formulario
        name: newProveedor.name,
        type: newProveedor.type,
        industry: newProveedor.industry,
        location: newProveedor.location,
        address: newProveedor.address,
        contact: newProveedor.contact,
        email: newProveedor.email,
        phone: newProveedor.phone,
        website: newProveedor.website || undefined,
        description: newProveedor.description,
        employees: newProveedor.employees ? parseInt(newProveedor.employees) : 0,
        status: newProveedor.status || 'active'
      })
      
      if (result.success) {
        console.log('Proveedor creado exitosamente:', result.data)
        setIsModalOpen(false) // Cerrar modal después de crear
        // Los datos se actualizarán automáticamente por el hook
      } else {
        console.error('Error al crear proveedor:', result.error)
        alert(`Error al crear el proveedor: ${result.error}`)
      }
    } catch (error) {
      console.error('Error al crear proveedor:', error)
      alert(`Error al crear el proveedor: ${error}`)
    }
  }

  const handleViewProveedor = (proveedor: any) => {
    console.log('Ver proveedor:', proveedor)
    setSelectedProveedor(proveedor)
    setIsViewModalOpen(true)
  }

  const handleEditProveedor = (proveedor: any) => {
    console.log('Editar proveedor:', proveedor)
    setSelectedProveedor(proveedor)
    setIsEditModalOpen(true)
  }

  const handleDeleteProveedor = (proveedor: any) => {
    console.log('Eliminar proveedor:', proveedor)
    setSelectedProveedor(proveedor)
    setIsDeleteModalOpen(true)
  }

  const handleManageFeatures = (proveedor: any) => {
    console.log('Gestionar funcionalidades:', proveedor)
    setSelectedProveedor(proveedor)
    setIsFeaturesModalOpen(true)
  }

  const handleManageBrand = (proveedor: any) => {
    console.log('Gestionar marca:', proveedor)
    setSelectedProveedor(proveedor)
    setIsBrandModalOpen(true)
  }

  const handleSaveEditProveedor = async (updatedProveedor: any) => {
    try {
      console.log('Guardando proveedor editado:', updatedProveedor)
      const orgId = selectedProveedor.pk.split('#')[1]
      
      const result = await updateOrganization(orgId, {
        orgSlug: updatedProveedor.name.toLowerCase().replace(/\s+/g, '-'),
        plan: updatedProveedor.plan === 'Premium' ? 'premium' : updatedProveedor.plan === 'Pro' ? 'pro' : 'free'
      })
      
      if (result.success) {
        console.log('Proveedor actualizado exitosamente:', result.data)
        setIsEditModalOpen(false)
        setSelectedProveedor(null)
      } else {
        console.error('Error al actualizar proveedor:', result.error)
        alert(`Error al actualizar el proveedor: ${result.error}`)
      }
    } catch (error) {
      console.error('Error al actualizar proveedor:', error)
      alert(`Error al actualizar el proveedor: ${error}`)
    }
  }

  const handleConfirmDeleteProveedor = async () => {
    try {
      console.log('Eliminando proveedor:', selectedProveedor)
      const orgId = selectedProveedor.pk.split('#')[1]
      
      const result = await deleteOrganization(orgId)
      
      if (result.success) {
        console.log('Proveedor eliminado exitosamente:', result.data)
        setIsDeleteModalOpen(false)
        setSelectedProveedor(null)
      } else {
        console.error('Error al eliminar proveedor:', result.error)
        alert(`Error al eliminar el proveedor: ${result.error}`)
      }
    } catch (error) {
      console.error('Error al eliminar proveedor:', error)
      alert(`Error al eliminar el proveedor: ${error}`)
    }
  }

  // Filtrar proveedores por estado (usando datos de la API)
  const activeProveedores = proveedores.filter(p => p.status === 'active' || !p.status) // Si no hay status, considerar activo
  const inactiveProveedores = proveedores.filter(p => p.status === 'inactive')
  
  // Filtrar proveedores según la pestaña activa
  const getFilteredProveedores = () => {
    switch (activeTab) {
      case 'active':
        return activeProveedores
      case 'inactive':
        return inactiveProveedores
      case 'all':
        return proveedores
      default:
        return proveedores
    }
  }
  
  const filteredProveedores = getFilteredProveedores()

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: theme === 'dark' ? '#065f46' : '#d1fae5',
          color: theme === 'dark' ? '#6ee7b7' : '#059669'
        }}>
          <CheckCircle style={{ width: '12px', height: '12px', marginRight: '4px' }} />
          Activo
        </span>
      )
    } else {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: theme === 'dark' ? '#7f1d1d' : '#fee2e2',
          color: theme === 'dark' ? '#fca5a5' : '#dc2626'
        }}>
          <XCircle style={{ width: '12px', height: '12px', marginRight: '4px' }} />
          Inactivo
        </span>
      )
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const ProveedorCard = ({ proveedor, showActions = true }: { proveedor: any, showActions?: boolean }) => (
    <div style={{
      padding: '20px',
      borderRadius: '12px',
      border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
      backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
      boxShadow: theme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease-in-out'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: theme === 'dark' ? '#f1f5f9' : '#111827',
            margin: '0 0 8px 0'
          }}>
            {proveedor.orgSlug}
          </h3>
          <p style={{
            fontSize: '14px',
            color: theme === 'dark' ? '#94a3b8' : '#6b7280',
            margin: '0 0 4px 0'
          }}>
            📍 Ubicación por definir • Proveedor
          </p>
          <p style={{
            fontSize: '14px',
            color: theme === 'dark' ? '#94a3b8' : '#6b7280',
            margin: '0'
          }}>
            👤 Contacto por definir
          </p>
        </div>
        {getStatusBadge(proveedor.status || 'active')}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          <span style={{
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            backgroundColor: theme === 'dark' ? '#334155' : '#f3f4f6',
            color: theme === 'dark' ? '#cbd5e1' : '#374151'
          }}>
            Proveedor
          </span>
          <span style={{
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            backgroundColor: theme === 'dark' ? '#334155' : '#f3f4f6',
            color: theme === 'dark' ? '#cbd5e1' : '#374151'
          }}>
            {proveedor.plan === 'premium' ? 'Premium' : 'Básico'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: theme === 'dark' ? '#64748b' : '#9ca3af' }}>
          <span>⭐ 4.5/5</span>
          <span>📦 0 órdenes</span>
          <span>💰 $0</span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: theme === 'dark' ? '1px solid #334155' : '1px solid #e5e7eb'
      }}>
        <div style={{ fontSize: '12px', color: theme === 'dark' ? '#64748b' : '#9ca3af' }}>
          Creado: {new Date(proveedor.createdAt).toLocaleDateString('es-MX')} • ID: {proveedor.pk.split('#')[1]}
        </div>
        {showActions && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: theme === 'dark' ? '#3b82f6' : '#3b82f6',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            }}>
              <Eye style={{ width: '14px', height: '14px', marginRight: '4px' }} />
              Ver
            </button>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: 'transparent',
              color: theme === 'dark' ? '#94a3b8' : '#6b7280',
              border: theme === 'dark' ? '1px solid #475569' : '1px solid #d1d5db',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            }}>
              <Settings style={{ width: '14px', height: '14px', marginRight: '4px' }} />
              Config
            </button>
          </div>
        )}
      </div>
    </div>
  )

  if (orgsLoading) {
    return (
      <div style={{
        padding: '32px',
        backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          color: theme === 'dark' ? '#94a3b8' : '#64748b'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 8px 0',
            color: theme === 'dark' ? '#f1f5f9' : '#111827'
          }}>
            Cargando proveedores...
          </h3>
          <p style={{
            fontSize: '14px',
            margin: '0',
            color: theme === 'dark' ? '#94a3b8' : '#64748b'
          }}>
            Obteniendo datos de la base de datos
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      padding: '32px',
      backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Truck style={{ 
            width: '32px', 
            height: '32px', 
            color: theme === 'dark' ? '#3b82f6' : '#3b82f6',
            marginRight: '12px'
          }} />
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: theme === 'dark' ? '#f1f5f9' : '#111827',
            margin: '0'
          }}>
            Gestión de Proveedores
          </h1>
        </div>
        <p style={{
          fontSize: '16px',
          color: theme === 'dark' ? '#94a3b8' : '#6b7280',
          margin: '0'
        }}>
          Administra proveedores activos, inactivos y configura sus productos
        </p>
      </div>

      {/* Error Message */}
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
            Error al cargar proveedores: {orgsError}
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px', 
        marginBottom: '32px' 
      }}>
        <div style={{
          padding: '24px',
          borderRadius: '12px',
          backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
          border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
          boxShadow: theme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <CheckCircle style={{ 
              width: '24px', 
              height: '24px', 
              color: '#10b981',
              marginRight: '12px'
            }} />
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme === 'dark' ? '#f1f5f9' : '#111827',
              margin: '0'
            }}>
              Proveedores Activos
            </h3>
          </div>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#10b981',
            margin: '0'
          }}>
            {activeProveedores.length}
          </p>
        </div>

        <div style={{
          padding: '24px',
          borderRadius: '12px',
          backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
          border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
          boxShadow: theme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <XCircle style={{ 
              width: '24px', 
              height: '24px', 
              color: '#ef4444',
              marginRight: '12px'
            }} />
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme === 'dark' ? '#f1f5f9' : '#111827',
              margin: '0'
            }}>
              Proveedores Inactivos
            </h3>
          </div>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#ef4444',
            margin: '0'
          }}>
            {inactiveProveedores.length}
          </p>
        </div>

        <div style={{
          padding: '24px',
          borderRadius: '12px',
          backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
          border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
          boxShadow: theme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <Package style={{ 
              width: '24px', 
              height: '24px', 
              color: '#3b82f6',
              marginRight: '12px'
            }} />
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme === 'dark' ? '#f1f5f9' : '#111827',
              margin: '0'
            }}>
              Total de Órdenes
            </h3>
          </div>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#3b82f6',
            margin: '0'
          }}>
            {proveedores.length}
          </p>
        </div>

        <div style={{
          padding: '24px',
          borderRadius: '12px',
          backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
          border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
          boxShadow: theme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <DollarSign style={{ 
              width: '24px', 
              height: '24px', 
              color: '#10b981',
              marginRight: '12px'
            }} />
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme === 'dark' ? '#f1f5f9' : '#111827',
              margin: '0'
            }}>
              Ingresos Totales
            </h3>
          </div>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#10b981',
            margin: '0'
          }}>
            {formatCurrency(proveedores.reduce((sum, p) => sum + p.revenue, 0))}
          </p>
        </div>
      </div>

      {/* Actions Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '20px',
        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
        borderRadius: '12px',
        border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
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
              placeholder="Buscar proveedores..."
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                borderRadius: '8px',
                border: theme === 'dark' ? '1px solid #475569' : '1px solid #d1d5db',
                backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                color: theme === 'dark' ? '#f1f5f9' : '#111827',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: 'transparent',
            color: theme === 'dark' ? '#94a3b8' : '#6b7280',
            border: theme === 'dark' ? '1px solid #475569' : '1px solid #d1d5db',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out'
          }}>
            <Filter style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            Filtros
          </button>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
          Nuevo Proveedor
        </button>
      </div>

      {/* Pestañas de Proveedores */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
          borderRadius: '12px',
          border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
          padding: '4px',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => setActiveTab('active')}
            style={{
              flex: '1',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              backgroundColor: activeTab === 'active' 
                ? (theme === 'dark' ? '#3b82f6' : '#3b82f6')
                : 'transparent',
              color: activeTab === 'active' 
                ? '#ffffff'
                : (theme === 'dark' ? '#94a3b8' : '#6b7280'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle style={{ width: '16px', height: '16px' }} />
            Activos ({activeProveedores.length})
          </button>
          <button
            onClick={() => setActiveTab('inactive')}
            style={{
              flex: '1',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              backgroundColor: activeTab === 'inactive' 
                ? (theme === 'dark' ? '#3b82f6' : '#3b82f6')
                : 'transparent',
              color: activeTab === 'inactive' 
                ? '#ffffff'
                : (theme === 'dark' ? '#94a3b8' : '#6b7280'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <XCircle style={{ width: '16px', height: '16px' }} />
            Inactivos ({inactiveProveedores.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              flex: '1',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              backgroundColor: activeTab === 'all' 
                ? (theme === 'dark' ? '#3b82f6' : '#3b82f6')
                : 'transparent',
              color: activeTab === 'all' 
                ? '#ffffff'
                : (theme === 'dark' ? '#94a3b8' : '#6b7280'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <List style={{ width: '16px', height: '16px' }} />
            Todos ({proveedores.length})
          </button>
        </div>

        {/* Contenido de la pestaña activa */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
          gap: '20px' 
        }}>
          {filteredProveedores.map(proveedor => (
            <ProveedorCard key={proveedor.id} proveedor={proveedor} />
          ))}
        </div>
        
        {filteredProveedores.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: theme === 'dark' ? '#64748b' : '#9ca3af'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
              {activeTab === 'active' ? '✅' : activeTab === 'inactive' ? '❌' : '📋'}
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              color: theme === 'dark' ? '#94a3b8' : '#6b7280'
            }}>
              {activeTab === 'active' 
                ? 'No hay proveedores activos' 
                : activeTab === 'inactive' 
                ? 'No hay proveedores inactivos'
                : 'No hay proveedores registrados'
              }
            </h3>
            <p style={{
              fontSize: '14px',
              margin: '0',
              color: theme === 'dark' ? '#64748b' : '#9ca3af'
            }}>
              {activeTab === 'active' 
                ? 'Los proveedores activos aparecerán aquí cuando estén disponibles'
                : activeTab === 'inactive' 
                ? 'Los proveedores inactivos aparecerán aquí cuando estén disponibles'
                : 'Agrega proveedores para comenzar'
              }
            </p>
          </div>
        )}
      </div>

      {/* Listado Completo */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <List style={{ 
            width: '20px', 
            height: '20px', 
            color: '#3b82f6',
            marginRight: '8px'
          }} />
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: theme === 'dark' ? '#f1f5f9' : '#111827',
            margin: '0'
          }}>
            Listado Completo de Proveedores ({proveedores.length})
          </h2>
        </div>
        <div style={{
          backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
          borderRadius: '12px',
          border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 120px',
            gap: '16px',
            padding: '16px 20px',
            backgroundColor: theme === 'dark' ? '#334155' : '#f8fafc',
            borderBottom: theme === 'dark' ? '1px solid #475569' : '1px solid #e5e7eb'
          }}>
            <div style={{ fontWeight: '600', color: theme === 'dark' ? '#f1f5f9' : '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Proveedor</div>
            <div style={{ fontWeight: '600', color: theme === 'dark' ? '#f1f5f9' : '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ubicación</div>
            <div style={{ fontWeight: '600', color: theme === 'dark' ? '#f1f5f9' : '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contacto</div>
            <div style={{ fontWeight: '600', color: theme === 'dark' ? '#f1f5f9' : '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Productos</div>
            <div style={{ fontWeight: '600', color: theme === 'dark' ? '#f1f5f9' : '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rating</div>
            <div style={{ fontWeight: '600', color: theme === 'dark' ? '#f1f5f9' : '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado</div>
            <div style={{ fontWeight: '600', color: theme === 'dark' ? '#f1f5f9' : '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Acciones</div>
          </div>
          {proveedores.map(proveedor => (
            <div key={proveedor.id} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 120px',
              gap: '16px',
              padding: '16px 20px',
              borderBottom: theme === 'dark' ? '1px solid #334155' : '1px solid #e5e7eb',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: '500', color: theme === 'dark' ? '#f1f5f9' : '#111827', marginBottom: '4px' }}>{proveedor.name}</div>
                <div style={{ fontSize: '12px', color: theme === 'dark' ? '#64748b' : '#9ca3af' }}>{proveedor.category}</div>
              </div>
              <div style={{ color: theme === 'dark' ? '#cbd5e1' : '#374151' }}>{proveedor.location}</div>
              <div>
                <div style={{ color: theme === 'dark' ? '#cbd5e1' : '#374151', marginBottom: '2px' }}>{proveedor.contact}</div>
                <div style={{ fontSize: '12px', color: theme === 'dark' ? '#64748b' : '#9ca3af' }}>{proveedor.email}</div>
              </div>
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {proveedor.products.slice(0, 2).map((product: string, index: number) => (
                    <span key={index} style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6',
                      color: theme === 'dark' ? '#cbd5e1' : '#374151'
                    }}>
                      {product}
                    </span>
                  ))}
                  {proveedor.products.length > 2 && (
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6',
                      color: theme === 'dark' ? '#cbd5e1' : '#374151'
                    }}>
                      +{proveedor.products.length - 2}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ color: theme === 'dark' ? '#cbd5e1' : '#374151' }}>
                ⭐ {proveedor.rating}/5
              </div>
              <div>{getStatusBadge(proveedor.status)}</div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button 
                  onClick={() => handleViewProveedor(proveedor)}
                  style={{
                    padding: '6px',
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    color: theme === 'dark' ? '#94a3b8' : '#6b7280',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f1f5f9'
                    e.currentTarget.style.color = theme === 'dark' ? '#3b82f6' : '#2563eb'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = theme === 'dark' ? '#94a3b8' : '#6b7280'
                  }}
                >
                  <Eye style={{ width: '16px', height: '16px' }} />
                </button>
                <button 
                  onClick={() => handleEditProveedor(proveedor)}
                  style={{
                    padding: '6px',
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    color: theme === 'dark' ? '#94a3b8' : '#6b7280',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f1f5f9'
                    e.currentTarget.style.color = theme === 'dark' ? '#10b981' : '#059669'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = theme === 'dark' ? '#94a3b8' : '#6b7280'
                  }}
                >
                  <Edit style={{ width: '16px', height: '16px' }} />
                </button>
                <button 
                  onClick={() => handleDeleteProveedor(proveedor)}
                  style={{
                    padding: '6px',
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    color: theme === 'dark' ? '#94a3b8' : '#6b7280',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f1f5f9'
                    e.currentTarget.style.color = theme === 'dark' ? '#ef4444' : '#dc2626'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = theme === 'dark' ? '#94a3b8' : '#6b7280'
                  }}
                >
                  <Trash2 style={{ width: '16px', height: '16px' }} />
                </button>
                <button 
                  onClick={() => handleManageFeatures(proveedor)}
                  style={{
                    padding: '6px',
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    color: theme === 'dark' ? '#94a3b8' : '#6b7280',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f1f5f9'
                    e.currentTarget.style.color = theme === 'dark' ? '#8b5cf6' : '#7c3aed'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = theme === 'dark' ? '#94a3b8' : '#6b7280'
                  }}
                >
                  <Settings style={{ width: '16px', height: '16px' }} />
                </button>
                <button 
                  onClick={() => handleManageBrand(proveedor)}
                  style={{
                    padding: '6px',
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    color: theme === 'dark' ? '#94a3b8' : '#6b7280',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f1f5f9'
                    e.currentTarget.style.color = theme === 'dark' ? '#f59e0b' : '#d97706'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = theme === 'dark' ? '#94a3b8' : '#6b7280'
                  }}
                >
                  <Palette style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para Nuevo Proveedor */}
      <NuevaOrganizacionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProveedor}
        modalType="provider"
      />

      {/* Modal para Ver Organización */}
      <VerOrganizacionModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedProveedor(null)
        }}
        organization={selectedProveedor}
      />

      {/* Modal para Editar Organización */}
      <EditarOrganizacionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedProveedor(null)
        }}
        onSave={handleSaveEditProveedor}
        organization={selectedProveedor}
      />

      {/* Modal para Confirmar Eliminación */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedProveedor(null)
        }}
        onConfirm={handleConfirmDeleteProveedor}
        itemName={selectedProveedor?.orgSlug || 'proveedor'}
        itemType="proveedor"
      />

      {/* Modal para Gestionar Funcionalidades */}
      <GestorFuncionalidadesModal
        isOpen={isFeaturesModalOpen}
        onClose={() => {
          setIsFeaturesModalOpen(false)
          setSelectedProveedor(null)
        }}
        organization={selectedProveedor}
      />

      {/* Modal para Gestionar Marca */}
      <BrandManagementModal
        isOpen={isBrandModalOpen}
        onClose={() => {
          setIsBrandModalOpen(false)
          setSelectedProveedor(null)
        }}
        organization={selectedProveedor}
      />
    </div>
  )
}
