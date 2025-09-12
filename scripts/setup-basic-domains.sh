#!/bin/bash

# MerchConnect México - Configuración Básica de Dominios
# Este script configura la estructura básica de dominios

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Variables
DOMAIN="merchconnectmexico.com"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"

log "🌐 Configurando estructura básica de dominios para MerchConnect México"

# Crear archivo de configuración de dominios
create_domain_config() {
    log "Creando configuración de dominios..."
    
    cat > "/Volumes/Macintosh HD/MerchConnectMexico/domain-config.env" << EOF
# MerchConnect México - Configuración de Dominios
# Generado automáticamente el $(date)

# Dominio principal
DOMAIN=merchconnectmexico.com
HOSTED_ZONE_ID=Z0746588399SCKIBOVL0G

# Estructura de URLs por stage
DEV_URL=dev.merchconnectmexico.com
SBX_URL=sbx.merchconnectmexico.com
PROD_URL=merchconnectmexico.com

# URLs de API por stage
DEV_API_URL=api-dev.merchconnectmexico.com
SBX_API_URL=api-sbx.merchconnectmexico.com
PROD_API_URL=api.merchconnectmexico.com

# URLs completas para la aplicación
NEXT_PUBLIC_DEV_URL=https://dev.merchconnectmexico.com
NEXT_PUBLIC_SBX_URL=https://sbx.merchconnectmexico.com
NEXT_PUBLIC_PROD_URL=https://merchconnectmexico.com

NEXT_PUBLIC_DEV_API_URL=https://api-dev.merchconnectmexico.com/v1
NEXT_PUBLIC_SBX_API_URL=https://api-sbx.merchconnectmexico.com/v1
NEXT_PUBLIC_PROD_API_URL=https://api.merchconnectmexico.com/v1

# URLs actuales de API Gateway (temporales)
DEV_API_GATEWAY_URL=https://fawy9flh4m.execute-api.us-east-1.amazonaws.com/v1
SBX_API_GATEWAY_URL=https://[SBX_API_ID].execute-api.us-east-1.amazonaws.com/v1
PROD_API_GATEWAY_URL=https://[PROD_API_ID].execute-api.us-east-1.amazonaws.com/v1

# CloudFront Distribution IDs
DEV_CLOUDFRONT_ID=EDCYMEW3Z0ZM2
SBX_CLOUDFRONT_ID=[PENDIENTE]
PROD_CLOUDFRONT_ID=[PENDIENTE]

# Certificado SSL
SSL_CERT_ARN=arn:aws:acm:us-east-1:209350187548:certificate/180eebd5-aa3f-42aa-ace0-7f3b26b6156f
EOF

    success "Archivo de configuración creado: domain-config.env"
}

# Crear registros DNS básicos
create_basic_dns_records() {
    log "Creando registros DNS básicos..."
    
    # Obtener CloudFront domain name
    CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id EDCYMEW3Z0ZM2 --query 'Distribution.DomainName' --output text)
    
    # Crear registro A para dev.merchconnectmexico.com
    cat > "/tmp/dns-dev.json" << EOF
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "dev.merchconnectmexico.com",
                "Type": "A",
                "AliasTarget": {
                    "DNSName": "$CLOUDFRONT_DOMAIN",
                    "EvaluateTargetHealth": false,
                    "HostedZoneId": "Z2FDTNDATAQYW2"
                }
            }
        }
    ]
}
EOF
    
    # Aplicar cambios
    aws route53 change-resource-record-sets \
        --hosted-zone-id Z0746588399SCKIBOVL0G \
        --change-batch file:///tmp/dns-dev.json
    
    success "Registro DNS creado para dev.merchconnectmexico.com"
}

# Crear configuración de Next.js para dominios
create_nextjs_config() {
    log "Creando configuración de Next.js para dominios..."
    
    cat > "/Volumes/Macintosh HD/MerchConnectMexico/apps/web/next.config.domains.js" << 'EOF'
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
EOF

    success "Configuración de Next.js creada: next.config.domains.js"
}

# Crear script de despliegue por ambiente
create_deployment_script() {
    log "Creando script de despliegue por ambiente..."
    
    cat > "/Volumes/Macintosh HD/MerchConnectMexico/scripts/deploy-to-domain.sh" << 'EOF'
#!/bin/bash

# MerchConnect México - Despliegue a Dominio
# Uso: ./deploy-to-domain.sh [dev|sbx|prod]

set -e

STAGE=${1:-dev}
DOMAIN="merchconnectmexico.com"

# Cargar configuración de dominios
source /Volumes/Macintosh\ HD/MerchConnectMexico/domain-config.env

# Configurar variables por stage
case $STAGE in
    "dev")
        NEXT_PUBLIC_STAGE=dev
        NEXT_PUBLIC_DOMAIN=dev.merchconnectmexico.com
        NEXT_PUBLIC_API_URL=https://api-dev.merchconnectmexico.com/v1
        API_BASE_URL=https://fawy9flh4m.execute-api.us-east-1.amazonaws.com/v1
        ;;
    "sbx")
        NEXT_PUBLIC_STAGE=sbx
        NEXT_PUBLIC_DOMAIN=sbx.merchconnectmexico.com
        NEXT_PUBLIC_API_URL=https://api-sbx.merchconnectmexico.com/v1
        API_BASE_URL=https://[SBX_API_ID].execute-api.us-east-1.amazonaws.com/v1
        ;;
    "prod")
        NEXT_PUBLIC_STAGE=prod
        NEXT_PUBLIC_DOMAIN=merchconnectmexico.com
        NEXT_PUBLIC_API_URL=https://api.merchconnectmexico.com/v1
        API_BASE_URL=https://[PROD_API_ID].execute-api.us-east-1.amazonaws.com/v1
        ;;
    *)
        echo "❌ Stage inválido. Usa: dev, sbx, o prod"
        exit 1
        ;;
esac

echo "🚀 Desplegando para ambiente: $STAGE"
echo "🌐 Dominio: $NEXT_PUBLIC_DOMAIN"
echo "🔗 API: $NEXT_PUBLIC_API_URL"

# Construir aplicación
cd /Volumes/Macintosh\ HD/MerchConnectMexico/apps/web
pnpm build

# Exportar variables de entorno
export NEXT_PUBLIC_STAGE
export NEXT_PUBLIC_DOMAIN
export NEXT_PUBLIC_API_URL
export API_BASE_URL
export NEXTAUTH_URL=https://$NEXT_PUBLIC_DOMAIN
export NEXTAUTH_SECRET=production-secret-change-me

echo "✅ Aplicación construida para $STAGE"
echo "🌐 Accede a: https://$NEXT_PUBLIC_DOMAIN"
EOF

    chmod +x "/Volumes/Macintosh HD/MerchConnectMexico/scripts/deploy-to-domain.sh"
    success "Script de despliegue creado: deploy-to-domain.sh"
}

# Función principal
main() {
    log "🚀 Iniciando configuración básica de dominios"
    
    create_domain_config
    create_basic_dns_records
    create_nextjs_config
    create_deployment_script
    
    success "🎉 Configuración básica de dominios completada!"
    log ""
    log "📋 Próximos pasos:"
    log "1. Validar el certificado SSL en AWS Certificate Manager"
    log "2. Ejecutar: ./scripts/deploy-to-domain.sh dev"
    log "3. Acceder a: https://dev.merchconnectmexico.com"
    log ""
    log "📁 Archivos creados:"
    log "- domain-config.env (configuración de dominios)"
    log "- apps/web/next.config.domains.js (configuración Next.js)"
    log "- scripts/deploy-to-domain.sh (script de despliegue)"
}

# Ejecutar función principal
main "$@"
