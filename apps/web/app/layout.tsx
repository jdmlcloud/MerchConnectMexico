import '@/styles/globals.css';
import { ReactNode } from 'react';
import { Providers } from '@/components/providers';

export const metadata = {
  title: 'MerchConnect México',
  description: 'Marketplace B2B multi-tenant de talleres y proveedores de merchandise',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
