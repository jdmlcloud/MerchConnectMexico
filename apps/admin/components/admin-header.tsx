"use client"

import React from 'react';
import { useAuth } from './auth-provider';
import { getEnvironmentInfo } from '../lib/config';

export function AdminHeader() {
  const { user, signOut } = useAuth();
  const envInfo = getEnvironmentInfo();

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'prod':
        return '#10b981';
      case 'sbx':
        return '#f59e0b';
      case 'dev':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getEnvironmentLabel = (env: string) => {
    switch (env) {
      case 'prod':
        return 'PRODUCCIÓN';
      case 'sbx':
        return 'SANDBOX';
      case 'dev':
        return 'DESARROLLO';
      default:
        return 'DESCONOCIDO';
    }
  };

  return (
    <header style={{
      backgroundColor: '#fff',
      borderBottom: '1px solid #e5e7eb',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: 0,
          background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          MerchConnect Admin
        </h1>
        
        <div style={{
          backgroundColor: getEnvironmentColor(envInfo.environment),
          color: 'white',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {getEnvironmentLabel(envInfo.environment)}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                {user.name || user.username}
              </p>
              <p style={{ 
                margin: 0, 
                fontSize: '12px', 
                color: '#6b7280' 
              }}>
                {user.email}
              </p>
            </div>
            
            <button
              onClick={signOut}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
