#!/bin/bash

# MerchConnect México - AWS Setup Script
# Este script ayuda a configurar AWS CLI para el despliegue

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

# Verificar si AWS CLI está instalado
check_aws_cli_installed() {
    if ! command -v aws &> /dev/null; then
        error "AWS CLI no está instalado"
        echo "Instalando AWS CLI..."
        
        # Detectar el sistema operativo
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command -v brew &> /dev/null; then
                brew install awscli
            else
                echo "Por favor instala AWS CLI manualmente desde: https://aws.amazon.com/cli/"
                exit 1
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
            unzip awscliv2.zip
            sudo ./aws/install
            rm -rf aws awscliv2.zip
        else
            echo "Sistema operativo no soportado. Por favor instala AWS CLI manualmente."
            exit 1
        fi
    fi
    success "AWS CLI está instalado"
}

# Configurar AWS CLI
configure_aws() {
    log "Configurando AWS CLI..."
    
    echo "Selecciona el método de autenticación:"
    echo "1) Access Keys (Access Key ID + Secret Access Key)"
    echo "2) AWS SSO"
    echo "3) Perfil existente"
    
    read -p "Opción (1-3): " choice
    
    case $choice in
        1)
            log "Configurando con Access Keys..."
            aws configure
            ;;
        2)
            log "Configurando con AWS SSO..."
            aws configure sso
            ;;
        3)
            log "Usando perfil existente..."
            aws configure list-profiles
            read -p "Nombre del perfil: " profile_name
            export AWS_PROFILE=$profile_name
            ;;
        *)
            error "Opción inválida"
            exit 1
            ;;
    esac
}

# Verificar configuración
verify_aws_config() {
    log "Verificando configuración de AWS..."
    
    if aws sts get-caller-identity > /dev/null 2>&1; then
        ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
        USER_ARN=$(aws sts get-caller-identity --query Arn --output text)
        
        success "AWS CLI configurado correctamente"
        log "Account ID: $ACCOUNT_ID"
        log "User/Role: $USER_ARN"
        
        # Verificar región
        REGION=$(aws configure get region)
        if [ -z "$REGION" ]; then
            warning "No se ha configurado una región por defecto"
            log "Configurando región us-east-1..."
            aws configure set region us-east-1
        fi
        
        success "Configuración verificada"
        return 0
    else
        error "Error al verificar configuración de AWS"
        return 1
    fi
}

# Instalar AWS CDK si es necesario
install_cdk() {
    log "Verificando AWS CDK..."
    
    if ! command -v cdk &> /dev/null; then
        log "Instalando AWS CDK globalmente..."
        npm install -g aws-cdk@latest
    fi
    
    success "AWS CDK disponible"
}

# Mostrar información de la cuenta
show_account_info() {
    log "Información de la cuenta AWS:"
    
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    USER_ARN=$(aws sts get-caller-identity --query Arn --output text)
    REGION=$(aws configure get region)
    
    echo "Account ID: $ACCOUNT_ID"
    echo "User/Role: $USER_ARN"
    echo "Región: $REGION"
    
    # Verificar permisos básicos
    log "Verificando permisos básicos..."
    
    if aws iam list-attached-user-policies --user-name $(aws sts get-caller-identity --query UserName --output text) > /dev/null 2>&1; then
        success "Permisos de IAM verificados"
    elif aws iam list-attached-role-policies --role-name $(aws sts get-caller-identity --query RoleName --output text) > /dev/null 2>&1; then
        success "Permisos de IAM verificados"
    else
        warning "No se pudieron verificar los permisos de IAM"
    fi
}

# Función principal
main() {
    log "🔧 Configurando AWS para MerchConnect México"
    
    check_aws_cli_installed
    configure_aws
    
    if verify_aws_config; then
        install_cdk
        show_account_info
        
        success "🎉 AWS CLI configurado correctamente!"
        log "Ahora puedes ejecutar: ./scripts/deploy-infrastructure.sh"
    else
        error "No se pudo configurar AWS CLI correctamente"
        exit 1
    fi
}

# Ejecutar función principal
main "$@"
