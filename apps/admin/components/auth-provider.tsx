"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { getEnvironmentInfo } from '../lib/config';

interface User {
  username: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser({
        username: currentUser.username,
        email: currentUser.signInDetails?.loginId || '',
        name: currentUser.username,
      });
    } catch (error) {
      console.log('No user signed in:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    loading,
    signOut: handleSignOut,
    isAuthenticated: !!user,
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f0f2f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#666', fontSize: '16px' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function LoginPage() {
  const envInfo = getEnvironmentInfo();

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
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          marginBottom: '10px', 
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
          padding: '6px 12px',
          borderRadius: '16px',
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '30px',
          display: 'inline-block'
        }}>
          ADMIN - {envInfo.environment.toUpperCase()}
        </div>

        <p style={{ 
          fontSize: '16px', 
          color: '#666', 
          marginBottom: '30px',
          lineHeight: '1.5'
        }}>
          Accede al panel de administración con tus credenciales
        </p>

        <Authenticator
          hideSignUp={false}
          signUpAttributes={['email', 'name']}
          formFields={{
            signUp: {
              email: {
                order: 1,
                isRequired: true,
              },
              name: {
                order: 2,
                isRequired: true,
              },
              password: {
                order: 3,
                isRequired: true,
              },
              confirm_password: {
                order: 4,
                isRequired: true,
              },
            },
          }}
          components={{
            Header() {
              return (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <h2 style={{ color: '#333', fontSize: '20px', margin: 0 }}>
                    Iniciar Sesión
                  </h2>
                </div>
              );
            },
          }}
        />
      </div>
    </div>
  );
}
