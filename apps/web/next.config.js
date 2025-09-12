/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['dev.app.dominio.com', 'sbx.app.dominio.com', 'app.dominio.com'],
    },
  },
};

module.exports = nextConfig;
