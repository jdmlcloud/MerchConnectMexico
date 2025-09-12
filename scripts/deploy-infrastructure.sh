#!/bin/bash

# MerchConnect México - Infrastructure Deployment Script
# Este script despliega toda la infraestructura de AWS para los 3 ambientes

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
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

# Verificar que AWS CLI está configurado
check_aws_cli() {
    log "Verificando configuración de AWS CLI..."
    if ! aws sts get-caller-identity > /dev/null 2>&1; then
        error "AWS CLI no está configurado correctamente"
        echo "Por favor ejecuta: aws configure"
        exit 1
    fi
    success "AWS CLI configurado correctamente"
}

# Verificar que CDK está instalado
check_cdk() {
    log "Verificando AWS CDK..."
    if ! command -v cdk &> /dev/null; then
        error "AWS CDK no está instalado"
        echo "Instalando CDK globalmente..."
        npm install -g aws-cdk
    fi
    success "AWS CDK disponible"
}

# Bootstrap CDK (solo si es necesario)
bootstrap_cdk() {
    log "Verificando si CDK necesita bootstrap..."
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    REGION="us-east-1"
    
    if ! aws cloudformation describe-stacks --stack-name CDKToolkit --region $REGION > /dev/null 2>&1; then
        log "Bootstrap CDK en región $REGION..."
        cdk bootstrap aws://$ACCOUNT_ID/$REGION
        success "CDK bootstrap completado"
    else
        success "CDK ya está bootstraped"
    fi
}

# Desplegar para un ambiente específico
deploy_environment() {
    local stage=$1
    log "Desplegando infraestructura para ambiente: $stage"
    
    cd /Volumes/Macintosh\ HD/MerchConnectMexico/infra/cdk
    
    # Construir el proyecto
    log "Construyendo CDK..."
    pnpm build
    
    # Desplegar stacks
    log "Desplegando stacks para $stage..."
    cdk deploy --all --context stage=$stage --require-approval never
    
    success "Despliegue completado para $stage"
}

# Crear OIDC Identity Provider para GitHub Actions
setup_github_oidc() {
    log "Configurando OIDC Identity Provider para GitHub Actions..."
    
    # Obtener información de la cuenta
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    REGION="us-east-1"
    
    # Crear OIDC Identity Provider si no existe
    if ! aws iam get-open-id-connect-provider --open-id-connect-provider-arn "arn:aws:iam::$ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com" > /dev/null 2>&1; then
        log "Creando OIDC Identity Provider..."
        
        # Obtener el certificado de GitHub
        GITHUB_CERT_URL="https://token.actions.githubusercontent.com/.well-known/openid_configuration"
        THUMBPRINT=$(curl -s $GITHUB_CERT_URL | jq -r '.jwks_uri' | sed 's|https://token.actions.githubusercontent.com/.well-known/jwks||')
        
        aws iam create-open-id-connect-provider \
            --url https://token.actions.githubusercontent.com \
            --thumbprint-list $THUMBPRINT \
            --client-id-list sts.amazonaws.com
        
        success "OIDC Identity Provider creado"
    else
        success "OIDC Identity Provider ya existe"
    fi
}

# Crear roles de IAM para GitHub Actions
create_github_roles() {
    log "Creando roles de IAM para GitHub Actions..."
    
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    
    # Trust policy para GitHub Actions
    cat > /tmp/github-trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::$ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                },
                "StringLike": {
                    "token.actions.githubusercontent.com:sub": "repo:MerchConnectMexico/MerchConnectMexico:*"
                }
            }
        }
    ]
}
EOF

    # Crear roles para cada ambiente
    for stage in dev sbx prod; do
        ROLE_NAME="MerchConnect-GitHubActions-$stage"
        
        if ! aws iam get-role --role-name $ROLE_NAME > /dev/null 2>&1; then
            log "Creando rol $ROLE_NAME..."
            aws iam create-role \
                --role-name $ROLE_NAME \
                --assume-role-policy-document file:///tmp/github-trust-policy.json
            
            # Adjuntar políticas necesarias
            aws iam attach-role-policy \
                --role-name $ROLE_NAME \
                --policy-arn arn:aws:iam::aws:policy/PowerUserAccess
            
            success "Rol $ROLE_NAME creado"
        else
            success "Rol $ROLE_NAME ya existe"
        fi
    done
    
    rm /tmp/github-trust-policy.json
}

# Configurar budgets por ambiente
setup_budgets() {
    log "Configurando budgets por ambiente..."
    
    for stage in dev sbx prod; do
        BUDGET_NAME="MerchConnect-$stage-Budget"
        
        # Verificar si el budget ya existe
        if ! aws budgets describe-budgets --account-id $(aws sts get-caller-identity --query Account --output text) --query "Budgets[?BudgetName=='$BUDGET_NAME']" --output text | grep -q $BUDGET_NAME; then
            log "Creando budget para $stage..."
            
            # Crear budget JSON
            cat > /tmp/budget-$stage.json << EOF
{
    "BudgetName": "$BUDGET_NAME",
    "BudgetLimit": {
        "Amount": "100",
        "Unit": "USD"
    },
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST",
    "CostFilters": {
        "TagKey": ["Stage"],
        "TagValue": ["$stage"]
    },
    "TimePeriod": {
        "Start": "$(date -u +%Y-%m-01T00:00:00Z)",
        "End": "2025-12-31T23:59:59Z"
    }
}
EOF
            
            aws budgets create-budget \
                --account-id $(aws sts get-caller-identity --query Account --output text) \
                --budget file:///tmp/budget-$stage.json
            
            success "Budget creado para $stage"
            rm /tmp/budget-$stage.json
        else
            success "Budget para $stage ya existe"
        fi
    done
}

# Función principal
main() {
    log "🚀 Iniciando despliegue de infraestructura MerchConnect México"
    
    # Verificaciones previas
    check_aws_cli
    check_cdk
    bootstrap_cdk
    
    # Configurar GitHub Actions
    setup_github_oidc
    create_github_roles
    
    # Desplegar para cada ambiente
    for stage in dev sbx prod; do
        deploy_environment $stage
    done
    
    # Configurar budgets
    setup_budgets
    
    success "🎉 Despliegue de infraestructura completado exitosamente!"
    log "Próximos pasos:"
    log "1. Configurar GitHub Actions con los roles creados"
    log "2. Configurar variables de entorno en GitHub"
    log "3. Desplegar la aplicación web"
}

# Ejecutar función principal
main "$@"
