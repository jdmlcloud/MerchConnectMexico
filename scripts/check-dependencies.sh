#!/bin/bash

# MerchConnect México - Dependency Check Script
# Este script verifica que todas las dependencias estén instaladas

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

# Verificar Node.js
check_node() {
    log "Verificando Node.js..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        success "Node.js $NODE_VERSION instalado"
        
        # Verificar versión mínima (18+)
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR" -ge 18 ]; then
            success "Versión de Node.js compatible"
        else
            warning "Se recomienda Node.js 18 o superior (actual: $NODE_VERSION)"
        fi
    else
        error "Node.js no está instalado"
        echo "Instala Node.js desde: https://nodejs.org/"
        exit 1
    fi
}

# Verificar pnpm
check_pnpm() {
    log "Verificando pnpm..."
    if command -v pnpm &> /dev/null; then
        PNPM_VERSION=$(pnpm --version)
        success "pnpm $PNPM_VERSION instalado"
    else
        log "Instalando pnpm..."
        npm install -g pnpm
        success "pnpm instalado"
    fi
}

# Verificar AWS CLI
check_aws_cli() {
    log "Verificando AWS CLI..."
    if command -v aws &> /dev/null; then
        AWS_VERSION=$(aws --version)
        success "AWS CLI instalado: $AWS_VERSION"
        
        # Verificar configuración
        if aws sts get-caller-identity > /dev/null 2>&1; then
            success "AWS CLI configurado correctamente"
        else
            warning "AWS CLI no está configurado. Ejecuta: ./scripts/setup-aws.sh"
        fi
    else
        error "AWS CLI no está instalado"
        echo "Instala AWS CLI desde: https://aws.amazon.com/cli/"
        exit 1
    fi
}

# Verificar AWS CDK
check_cdk() {
    log "Verificando AWS CDK..."
    if command -v cdk &> /dev/null; then
        CDK_VERSION=$(cdk --version)
        success "AWS CDK instalado: $CDK_VERSION"
    else
        log "Instalando AWS CDK..."
        npm install -g aws-cdk@latest
        success "AWS CDK instalado"
    fi
}

# Verificar jq (para procesamiento JSON)
check_jq() {
    log "Verificando jq..."
    if command -v jq &> /dev/null; then
        JQ_VERSION=$(jq --version)
        success "jq $JQ_VERSION instalado"
    else
        warning "jq no está instalado (recomendado para procesamiento JSON)"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            echo "Instala con: brew install jq"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            echo "Instala con: sudo apt-get install jq"
        fi
    fi
}

# Verificar curl
check_curl() {
    log "Verificando curl..."
    if command -v curl &> /dev/null; then
        CURL_VERSION=$(curl --version | head -n1)
        success "curl instalado: $CURL_VERSION"
    else
        error "curl no está instalado"
        exit 1
    fi
}

# Verificar Git
check_git() {
    log "Verificando Git..."
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version)
        success "Git instalado: $GIT_VERSION"
    else
        error "Git no está instalado"
        exit 1
    fi
}

# Verificar que el proyecto esté construido
check_project_build() {
    log "Verificando construcción del proyecto..."
    
    cd /Volumes/Macintosh\ HD/MerchConnectMexico
    
    # Verificar que los paquetes estén instalados
    if [ ! -d "node_modules" ]; then
        log "Instalando dependencias del proyecto..."
        pnpm install
    fi
    
    # Construir paquetes compartidos
    log "Construyendo paquetes compartidos..."
    pnpm build --filter=@merchconnect/types
    pnpm build --filter=@merchconnect/features
    pnpm build --filter=@merchconnect/data
    pnpm build --filter=@merchconnect/storage
    pnpm build --filter=@merchconnect/auth
    
    # Construir CDK
    log "Construyendo CDK..."
    cd infra/cdk
    pnpm build
    
    success "Proyecto construido correctamente"
}

# Verificar permisos de AWS
check_aws_permissions() {
    log "Verificando permisos de AWS..."
    
    # Verificar que podemos listar usuarios/roles
    if aws sts get-caller-identity > /dev/null 2>&1; then
        success "Autenticación AWS exitosa"
        
        # Verificar permisos básicos
        if aws iam get-user > /dev/null 2>&1 || aws iam get-role --role-name $(aws sts get-caller-identity --query RoleName --output text) > /dev/null 2>&1; then
            success "Permisos de IAM verificados"
        else
            warning "No se pudieron verificar los permisos de IAM"
        fi
        
        # Verificar permisos de CloudFormation
        if aws cloudformation list-stacks --max-items 1 > /dev/null 2>&1; then
            success "Permisos de CloudFormation verificados"
        else
            warning "No se pudieron verificar los permisos de CloudFormation"
        fi
        
    else
        error "No se pudo autenticar con AWS"
        echo "Ejecuta: ./scripts/setup-aws.sh"
        exit 1
    fi
}

# Función principal
main() {
    log "🔍 Verificando dependencias para MerchConnect México"
    
    check_node
    check_pnpm
    check_aws_cli
    check_cdk
    check_jq
    check_curl
    check_git
    check_project_build
    check_aws_permissions
    
    success "🎉 Todas las dependencias están listas!"
    log "Puedes proceder con el despliegue: ./scripts/deploy-infrastructure.sh"
}

# Ejecutar función principal
main "$@"
