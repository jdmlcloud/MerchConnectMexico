"use client"

import React from 'react'
import { useTheme } from '../../../../components/theme-provider'
import { WorkshopDetailModal } from '../../../../components/workshop-detail-modal'
import { NuevaOrganizacionModal } from '../../../../components/nueva-organizacion-modal'
import { VerOrganizacionModal } from '../../../../components/ver-organizacion-modal'
import { EditarOrganizacionModal } from '../../../../components/editar-organizacion-modal'
import { ConfirmDeleteModal } from '../../../../components/confirm-delete-modal'
import { GestorFuncionalidadesModal } from '../../../../components/gestor-funcionalidades-modal'
import { BrandManagementModal } from '../../../../components/brand-management-modal'
import { useOrganizations } from '../../../../hooks/use-organizations'
import { 
  Wrench, 
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
  MoreVertical
} from 'lucide-react'

export default function WorkshopsPage() {
  const [mounted, setMounted] = React.useState(false)
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = React.useState<'active' | 'inactive' | 'all'>('active')
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = React.useState(false)
  const [isBrandModalOpen, setIsBrandModalOpen] = React.useState(false)
  const [selectedWorkshop, setSelectedWorkshop] = React.useState<any>(null)
  const { getWorkshops, loading: orgsLoading, error: orgsError, createOrganization, updateOrganization, deleteOrganization } = useOrganizations()
  
  // Obtener talleres de las organizaciones
  const workshops = getWorkshops()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleSaveWorkshop = async (newWorkshop: any) => {
    try {
      console.log('🔍 Guardando nuevo taller:', newWorkshop)
      
      const orgData = {
        orgType: 'workshop', // Siempre será workshop
        orgSlug: newWorkshop.name.toLowerCase().replace(/\s+/g, '-'),
        plan: 'free', // Por defecto free, se puede cambiar después
        // Campos adicionales del formulario
        name: newWorkshop.name,
        type: newWorkshop.type,
        industry: newWorkshop.industry,
        location: newWorkshop.location,
        address: newWorkshop.address,
        contact: newWorkshop.contact,
        email: newWorkshop.email,
        phone: newWorkshop.phone,
        website: newWorkshop.website || undefined,
        description: newWorkshop.description,
        employees: newWorkshop.employees ? parseInt(newWorkshop.employees) : 0,
        status: newWorkshop.status || 'active'
      }
      
      console.log('📤 Datos que se van a enviar:', orgData)
      
      // Usar la función createOrganization del hook con todos los datos del taller
      const result = await createOrganization(orgData)
      
      console.log('📥 Resultado de la creación:', result)
      
      if (result.success) {
        console.log('✅ Taller creado exitosamente:', result.data)
        setIsModalOpen(false) // Cerrar modal después de crear
        // Los datos se actualizarán automáticamente por el hook
      } else {
        console.error('❌ Error al crear taller:', result.error)
        alert(`Error al crear el taller: ${result.error}`)
      }
    } catch (error) {
      console.error('💥 Error al crear taller:', error)
      alert(`Error al crear el taller: ${error}`)
    }
  }


  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedWorkshop(null)
  }

  const handleViewWorkshop = (workshop: any) => {
    console.log('Ver taller:', workshop)
    setSelectedWorkshop(workshop)
    setIsDetailModalOpen(true)
  }

  const handleEditWorkshop = (workshop: any) => {
    console.log('Editar taller:', workshop)
    setSelectedWorkshop(workshop)
    setIsEditModalOpen(true)
  }

  const handleDeleteWorkshop = (workshop: any) => {
    console.log('Eliminar taller:', workshop)
    setSelectedWorkshop(workshop)
    setIsDeleteModalOpen(true)
  }

  const handleManageFeatures = (workshop: any) => {
    console.log('Gestionar funcionalidades:', workshop)
    setSelectedWorkshop(workshop)
    setIsFeaturesModalOpen(true)
  }

  const handleManageBrand = (workshop: any) => {
    console.log('Gestionar marca:', workshop)
    setSelectedWorkshop(workshop)
    setIsBrandModalOpen(true)
  }

  const handleSaveEditWorkshop = async (updatedWorkshop: any) => {
    try {
      console.log('Guardando taller editado:', updatedWorkshop)
      const orgId = selectedWorkshop.pk.split('#')[1]
      
      const result = await updateOrganization(orgId, {
        orgSlug: updatedWorkshop.name.toLowerCase().replace(/\s+/g, '-'),
        plan: updatedWorkshop.plan === 'Premium' ? 'premium' : updatedWorkshop.plan === 'Pro' ? 'pro' : 'free'
      })
      
      if (result.success) {
        console.log('Taller actualizado exitosamente:', result.data)
        setIsEditModalOpen(false)
        setSelectedWorkshop(null)
      } else {
        console.error('Error al actualizar taller:', result.error)
        alert(`Error al actualizar el taller: ${result.error}`)
      }
    } catch (error) {
      console.error('Error al actualizar taller:', error)
      alert(`Error al actualizar el taller: ${error}`)
    }
  }

  const handleConfirmDeleteWorkshop = async () => {
    try {
      console.log('Eliminando taller:', selectedWorkshop)
      const orgId = selectedWorkshop.pk.split('#')[1]
      
      const result = await deleteOrganization(orgId)
      
      if (result.success) {
        console.log('Taller eliminado exitosamente:', result.data)
        setIsDeleteModalOpen(false)
        setSelectedWorkshop(null)
      } else {
        console.error('Error al eliminar taller:', result.error)
        alert(`Error al eliminar el taller: ${result.error}`)
      }
    } catch (error) {
      console.error('Error al eliminar taller:', error)
      alert(`Error al eliminar el taller: ${error}`)
    }
  }

  // Filtrar talleres por estado (usando datos de la API)
  const activeWorkshops = workshops.filter(w => w.status === 'active' || !w.status) // Si no hay status, considerar activo
  const inactiveWorkshops = workshops.filter(w => w.status === 'inactive')
  
  // Filtrar talleres según la pestaña activa
  const getFilteredWorkshops = () => {
    switch (activeTab) {
      case 'active':
        return activeWorkshops
      case 'inactive':
        return inactiveWorkshops
      case 'all':
        return workshops
      default:
        return workshops
    }
  }
  
  const filteredWorkshops = getFilteredWorkshops()

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

  const WorkshopCard = ({ workshop, showActions = true }: { workshop: any, showActions?: boolean }) => (
    <div 
      className="workshop-card"
      style={{
        position: 'relative',
        padding: '20px',
        borderRadius: '12px',
        border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
        boxShadow: theme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        overflow: 'hidden'
      }}
      onClick={() => handleViewWorkshop(workshop)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = theme === 'dark' 
          ? '0 8px 25px -5px rgba(0, 0, 0, 0.4)' 
          : '0 10px 25px -5px rgba(0, 0, 0, 0.15)'
        // Activar shimmer effect
        const shimmer = e.currentTarget.querySelector('.shimmer-effect') as HTMLElement
        if (shimmer) {
          shimmer.style.opacity = '1'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = theme === 'dark' 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        // Desactivar shimmer effect
        const shimmer = e.currentTarget.querySelector('.shimmer-effect') as HTMLElement
        if (shimmer) {
          shimmer.style.opacity = '0'
        }
      }}
    >
      {/* Shimmer Effect */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: theme === 'dark' 
          ? 'linear-gradient(45deg, transparent 20%, rgba(59, 130, 246, 0.1) 50%, transparent 80%)'
          : 'linear-gradient(45deg, transparent 20%, rgba(59, 130, 246, 0.05) 50%, transparent 80%)',
        backgroundSize: '200% auto',
        transform: 'rotate(-45deg)',
        opacity: '0',
        transition: 'opacity 0.3s ease-in-out',
        pointerEvents: 'none'
      }} 
      className="shimmer-effect"
      />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: theme === 'dark' ? '#f1f5f9' : '#111827',
            margin: '0 0 8px 0'
          }}>
            {workshop.orgSlug}
          </h3>
          <p style={{
            fontSize: '14px',
            color: theme === 'dark' ? '#94a3b8' : '#6b7280',
            margin: '0 0 4px 0'
          }}>
            📍 Ubicación por definir
          </p>
          <p style={{
            fontSize: '14px',
            color: theme === 'dark' ? '#94a3b8' : '#6b7280',
            margin: '0 0 4px 0'
          }}>
            👤 Contacto por definir
          </p>
          <p style={{
            fontSize: '12px',
            color: theme === 'dark' ? '#64748b' : '#9ca3af',
            margin: '0'
          }}>
            📋 Plan: {workshop.plan === 'premium' ? 'Premium' : 'Básico'} • ID: {workshop.pk.split('#')[1]}
          </p>
        </div>
        {getStatusBadge(workshop.status || 'active')}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <span style={{
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            backgroundColor: theme === 'dark' ? '#334155' : '#f3f4f6',
            color: theme === 'dark' ? '#cbd5e1' : '#374151'
          }}>
            Taller
          </span>
          <span style={{
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            backgroundColor: theme === 'dark' ? '#334155' : '#f3f4f6',
            color: theme === 'dark' ? '#cbd5e1' : '#374151'
          }}>
            {workshop.plan === 'premium' ? 'Premium' : 'Básico'}
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: theme === 'dark' ? '1px solid #334155' : '1px solid #e5e7eb'
      }}>
        {showActions && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              style={{
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
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleViewWorkshop(workshop)
              }}
            >
              <Eye style={{ width: '14px', height: '14px', marginRight: '4px' }} />
              Ver
            </button>
            <button 
              style={{
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
              }}
              onClick={(e) => {
                e.stopPropagation()
                // TODO: Implementar configuración
              }}
            >
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
            Cargando talleres...
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
          <Wrench style={{ 
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
            Gestión de Talleres
          </h1>
        </div>
        <p style={{
          fontSize: '16px',
          color: theme === 'dark' ? '#94a3b8' : '#6b7280',
          margin: '0'
        }}>
          Administra talleres activos, inactivos y configura sus servicios
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
            Error al cargar talleres: {orgsError}
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
              Talleres Activos
            </h3>
          </div>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#10b981',
            margin: '0'
          }}>
            {activeWorkshops.length}
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
              Talleres Inactivos
            </h3>
          </div>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#ef4444',
            margin: '0'
          }}>
            {inactiveWorkshops.length}
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
            <List style={{ 
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
              Total de Talleres
            </h3>
          </div>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#3b82f6',
            margin: '0'
          }}>
            {workshops.length}
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
              placeholder="Buscar talleres..."
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
          Nuevo Taller
        </button>
      </div>

      {/* Pestañas de Talleres */}
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
            Activos ({activeWorkshops.length})
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
            Inactivos ({inactiveWorkshops.length})
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
            Todos ({workshops.length})
          </button>
        </div>

        {/* Contenido de la pestaña activa */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
          gap: '20px' 
        }}>
          {filteredWorkshops.map(workshop => (
            <WorkshopCard key={workshop.id} workshop={workshop} />
          ))}
        </div>
        
        {filteredWorkshops.length === 0 && (
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
                ? 'No hay talleres activos' 
                : activeTab === 'inactive' 
                ? 'No hay talleres inactivos'
                : 'No hay talleres registrados'
              }
            </h3>
            <p style={{
              fontSize: '14px',
              margin: '0',
              color: theme === 'dark' ? '#64748b' : '#9ca3af'
            }}>
              {activeTab === 'active' 
                ? 'Los talleres activos aparecerán aquí cuando estén disponibles'
                : activeTab === 'inactive' 
                ? 'Los talleres inactivos aparecerán aquí cuando estén disponibles'
                : 'Agrega talleres para comenzar'
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
            Listado Completo de Talleres ({workshops.length})
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
            <div style={{ fontWeight: '600', color: theme === 'dark' ? '#f1f5f9' : '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Taller</div>
            <div style={{ fontWeight: '600', color: theme === 'dark' ? '#f1f5f9' : '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ubicación</div>
            <div style={{ fontWeight: '600', color: theme === 'dark' ? '#f1f5f9' : '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contacto</div>
            <div style={{ fontWeight: '600', color: theme === 'dark' ? '#f1f5f9' : '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Servicios</div>
            <div style={{ fontWeight: '600', color: theme === 'dark' ? '#f1f5f9' : '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rating</div>
            <div style={{ fontWeight: '600', color: theme === 'dark' ? '#f1f5f9' : '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado</div>
            <div style={{ fontWeight: '600', color: theme === 'dark' ? '#f1f5f9' : '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Acciones</div>
          </div>
          {workshops.map(workshop => (
            <div key={workshop.pk} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 120px',
              gap: '16px',
              padding: '16px 20px',
              borderBottom: theme === 'dark' ? '1px solid #334155' : '1px solid #e5e7eb',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: '500', color: theme === 'dark' ? '#f1f5f9' : '#111827', marginBottom: '4px' }}>{workshop.orgSlug}</div>
                <div style={{ fontSize: '12px', color: theme === 'dark' ? '#64748b' : '#9ca3af' }}>ID: {workshop.pk.split('#')[1]}</div>
              </div>
              <div style={{ color: theme === 'dark' ? '#cbd5e1' : '#374151' }}>Ubicación por definir</div>
              <div>
                <div style={{ color: theme === 'dark' ? '#cbd5e1' : '#374151', marginBottom: '2px' }}>Contacto por definir</div>
                <div style={{ fontSize: '12px', color: theme === 'dark' ? '#64748b' : '#9ca3af' }}>email@ejemplo.com</div>
              </div>
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6',
                    color: theme === 'dark' ? '#cbd5e1' : '#374151'
                  }}>
                    Taller
                  </span>
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6',
                    color: theme === 'dark' ? '#cbd5e1' : '#374151'
                  }}>
                    {workshop.plan === 'premium' ? 'Premium' : 'Básico'}
                  </span>
                </div>
              </div>
              <div style={{ color: theme === 'dark' ? '#cbd5e1' : '#374151' }}>
                ⭐ 4.5/5
              </div>
              <div>{getStatusBadge(workshop.status)}</div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button 
                  onClick={() => handleViewWorkshop(workshop)}
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
                  onClick={() => handleEditWorkshop(workshop)}
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
                  onClick={() => handleDeleteWorkshop(workshop)}
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
                  onClick={() => handleManageFeatures(workshop)}
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
                  onClick={() => handleManageBrand(workshop)}
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

      {/* Modal para Nuevo Taller */}
      <NuevaOrganizacionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveWorkshop}
        modalType="workshop"
      />

      {/* Modal para Ver Detalles del Taller */}
      <WorkshopDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        workshop={selectedWorkshop}
      />

      {/* Modal para Ver Organización */}
      <VerOrganizacionModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedWorkshop(null)
        }}
        organization={selectedWorkshop}
      />

      {/* Modal para Editar Organización */}
      <EditarOrganizacionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedWorkshop(null)
        }}
        onSave={handleSaveEditWorkshop}
        organization={selectedWorkshop}
      />

      {/* Modal para Confirmar Eliminación */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedWorkshop(null)
        }}
        onConfirm={handleConfirmDeleteWorkshop}
        itemName={selectedWorkshop?.orgSlug || 'taller'}
        itemType="taller"
      />

      {/* Modal para Gestionar Funcionalidades */}
      <GestorFuncionalidadesModal
        isOpen={isFeaturesModalOpen}
        onClose={() => {
          setIsFeaturesModalOpen(false)
          setSelectedWorkshop(null)
        }}
        organization={selectedWorkshop}
      />

      {/* Modal para Gestionar Marca */}
      <BrandManagementModal
        isOpen={isBrandModalOpen}
        onClose={() => {
          setIsBrandModalOpen(false)
          setSelectedWorkshop(null)
        }}
        organization={selectedWorkshop}
      />
    </div>
  )
}
