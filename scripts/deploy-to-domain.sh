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
