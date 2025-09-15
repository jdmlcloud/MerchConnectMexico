import './globals.css'
import Script from 'next/script'
import { ThemeProvider } from '../components/theme-provider'
import { EnvironmentSelector } from '../components/environment-selector'
import { EnvironmentIndicator } from '../components/environment-indicator'
import { AuthProvider } from '../components/auth-provider'
import '../lib/amplify-config'

export const metadata = {
  title: 'Admin | MerchConnect',
  description: 'Panel de administración'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" style={{ margin: 0, padding: 0, height: '100%' }}>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              // Aplicar dark inmediatamente para prevenir FOUC
              document.documentElement.style.backgroundColor = '#0f172a'
              document.documentElement.style.color = '#f1f5f9'
              document.documentElement.style.colorScheme = 'dark'
              document.documentElement.setAttribute('data-theme', 'dark')
              
              try {
                const theme = localStorage.getItem('admin:theme') || 'dark'
                document.documentElement.setAttribute('data-theme', theme)
                
                if (theme === 'light') {
                  document.documentElement.style.backgroundColor = '#f8fafc'
                  document.documentElement.style.color = '#111827'
                  document.documentElement.style.colorScheme = 'light'
                } else {
                  // Mantener dark por defecto
                  document.documentElement.style.backgroundColor = '#0f172a'
                  document.documentElement.style.color = '#f1f5f9'
                  document.documentElement.style.colorScheme = 'dark'
                }
              } catch (e) {
                // Mantener dark por defecto
                document.documentElement.setAttribute('data-theme', 'dark')
                document.documentElement.style.backgroundColor = '#0f172a'
                document.documentElement.style.color = '#f1f5f9'
                document.documentElement.style.colorScheme = 'dark'
              }
            })()
          `}
        </Script>
      </head>
      <body style={{ margin: 0, padding: 0, minHeight: '100vh' }}>
        <ThemeProvider>
          <AuthProvider>
            <EnvironmentIndicator />
            <EnvironmentSelector />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


