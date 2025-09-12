/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de dominios por ambiente
  async rewrites() {
    return [
      // Rewrite para API Gateway
      {
        source: '/api/v1/:path*',
        destination: process.env.API_BASE_URL + '/:path*',
      },
    ];
  },
  
  // Configuración de headers para CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  
  // Configuración de imágenes
  images: {
    domains: [
      'mc-dev-assets-209350187548.s3.us-east-1.amazonaws.com',
      'mc-sbx-assets-209350187548.s3.us-east-1.amazonaws.com',
      'mc-prod-assets-209350187548.s3.us-east-1.amazonaws.com',
    ],
  },
  
  // Configuración de variables de entorno
  env: {
    NEXT_PUBLIC_STAGE: process.env.NEXT_PUBLIC_STAGE || 'dev',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
  },
};

module.exports = nextConfig;
