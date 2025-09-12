#!/bin/bash

# MerchConnect México - Deploy Script
# Despliega infraestructura y aplicaciones por stage

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

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Validar stage
validate_stage() {
    local stage=$1
    if [[ ! "$stage" =~ ^(dev|sbx|prod)$ ]]; then
        error "Stage inválido. Usa: dev, sbx, o prod"
        exit 1
    fi
}

# Deploy infraestructura
deploy_infra() {
    local stage=$1
    log "Desplegando infraestructura para $stage..."
    
    cd /Volumes/Macintosh\ HD/MerchConnectMexico/infra/cdk
    
    # Verificar que CDK esté instalado
    if ! command -v cdk &> /dev/null; then
        error "AWS CDK no está instalado. Instálalo con: npm install -g aws-cdk"
        exit 1
    fi
    
    # Instalar dependencias
    pnpm install
    
    # Compilar
    pnpm build
    
    # Deploy
    STAGE=$stage cdk deploy --all --require-approval never
    
    success "Infraestructura desplegada para $stage"
}

# Deploy servicios (Lambdas)
deploy_services() {
    local stage=$1
    log "Desplegando servicios para $stage..."
    
    cd /Volumes/Macintosh\ HD/MerchConnectMexico
    
    # Compilar todos los paquetes
    pnpm -w build
    
    # Deploy servicios (esto actualizará las Lambdas existentes)
    cd infra/cdk
    STAGE=$stage cdk deploy mc-$stage-async --require-approval never
    
    success "Servicios desplegados para $stage"
}

# Deploy web app
deploy_web() {
    local stage=$1
    log "Desplegando web app para $stage..."
    
    cd /Volumes/Macintosh\ HD/MerchConnectMexico/apps/web
    
    # Instalar dependencias
    pnpm install
    
    # Build con variables de entorno
    export NEXT_PUBLIC_STAGE=$stage
    export NEXTAUTH_SECRET="change-me-in-production"
    export NEXTAUTH_URL="https://$stage.app.merchconnect.com"
    export API_BASE_URL="https://mc-$stage-api.execute-api.us-east-1.amazonaws.com/v1"
    export COGNITO_USER_POOL_ID="mc-$stage-users"
    export COGNITO_CLIENT_ID="mc-$stage-web-client"
    
    pnpm build
    
    # Para producción, aquí iría el deploy a Amplify o S3+CloudFront
    # Por ahora solo mostramos que el build fue exitoso
    success "Web app compilada para $stage"
    log "Para deploy completo, configura Amplify o S3+CloudFront"
}

# Mostrar información del stage
show_stage_info() {
    local stage=$1
    log "Información del stage $stage:"
    echo ""
    echo "🌐 URLs:"
    echo "  Web: https://$stage.app.merchconnect.com"
    echo "  API: https://mc-$stage-api.execute-api.us-east-1.amazonaws.com/v1"
    echo ""
    echo "📊 Recursos AWS:"
    echo "  DynamoDB: MerchConnect-$stage"
    echo "  S3 Assets: mc-$stage-assets"
    echo "  S3 Public: mc-$stage-public"
    echo "  Cognito: mc-$stage-users"
    echo "  SQS: mc-$stage-pages-publish"
    echo ""
    echo "🔧 Variables de entorno:"
    echo "  NEXT_PUBLIC_STAGE=$stage"
    echo "  API_BASE_URL=https://mc-$stage-api.execute-api.us-east-1.amazonaws.com/v1"
    echo "  COGNITO_USER_POOL_ID=mc-$stage-users"
    echo "  COGNITO_CLIENT_ID=mc-$stage-web-client"
}

# Función principal
main() {
    local command=${1:-help}
    local stage=${2:-dev}
    
    case $command in
        "infra")
            validate_stage $stage
            deploy_infra $stage
            show_stage_info $stage
            ;;
        "services")
            validate_stage $stage
            deploy_services $stage
            ;;
        "web")
            validate_stage $stage
            deploy_web $stage
            ;;
        "all")
            validate_stage $stage
            deploy_infra $stage
            deploy_services $stage
            deploy_web $stage
            show_stage_info $stage
            ;;
        "info")
            validate_stage $stage
            show_stage_info $stage
            ;;
        "help"|*)
            echo "MerchConnect México - Deploy Script"
            echo ""
            echo "Uso: $0 <comando> [stage]"
            echo ""
            echo "Comandos:"
            echo "  infra     - Deploy infraestructura (CDK)"
            echo "  services  - Deploy servicios (Lambdas)"
            echo "  web       - Deploy web app (Next.js)"
            echo "  all       - Deploy todo"
            echo "  info      - Mostrar información del stage"
            echo "  help      - Mostrar esta ayuda"
            echo ""
            echo "Stages: dev, sbx, prod (default: dev)"
            echo ""
            echo "Ejemplos:"
            echo "  $0 infra dev      # Deploy infra a dev"
            echo "  $0 all sbx        # Deploy todo a sbx"
            echo "  $0 info prod      # Info del stage prod"
            ;;
    esac
}

# Ejecutar función principal
main "$@"
