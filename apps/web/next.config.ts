import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['dev.app.dominio.com', 'sbx.app.dominio.com', 'app.dominio.com'],
    },
  },
};

export default nextConfig;
