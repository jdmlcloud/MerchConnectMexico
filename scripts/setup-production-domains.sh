#!/bin/bash

# MerchConnect México - Configuración de Dominios de Producción
# Este script configura Route 53, CloudFront y dominios personalizados

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

# URLs por stage
DEV_URL="dev.merchconnectmexico.com"
SBX_URL="sbx.merchconnectmexico.com"
PROD_URL="merchconnectmexico.com"

# URLs de API por stage
DEV_API_URL="api-dev.merchconnectmexico.com"
SBX_API_URL="api-sbx.merchconnectmexico.com"
PROD_API_URL="api.merchconnectmexico.com"

log "🌐 Configurando dominios de producción para MerchConnect México"
log "Dominio principal: $DOMAIN"

# Verificar que el dominio existe en Route 53
verify_domain() {
    log "Verificando dominio en Route 53..."
    
    HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='$DOMAIN.'].Id" --output text | sed 's|/hostedzone/||')
    
    if [ -n "$HOSTED_ZONE_ID" ]; then
        success "Hosted Zone encontrada: $HOSTED_ZONE_ID"
    else
        error "No se encontró el dominio $DOMAIN en Route 53"
        log "Por favor, asegúrate de que el dominio esté configurado en Route 53"
        exit 1
    fi
}

# Crear certificados SSL
create_ssl_certificates() {
    log "Creando certificados SSL..."
    
    # Certificado principal para *.merchconnectmexico.com
    CERT_ARN=$(aws acm request-certificate \
        --domain-name "*.merchconnectmexico.com" \
        --subject-alternative-names "merchconnectmexico.com" \
        --validation-method DNS \
        --region us-east-1 \
        --query 'CertificateArn' \
        --output text)
    
    if [ -n "$CERT_ARN" ]; then
        success "Certificado SSL solicitado: $CERT_ARN"
        log "⚠️  IMPORTANTE: Debes validar el certificado en AWS Certificate Manager"
        log "   - Ve a AWS Console > Certificate Manager"
        log "   - Busca el certificado con ARN: $CERT_ARN"
        log "   - Agrega los registros DNS de validación a Route 53"
    else
        error "No se pudo crear el certificado SSL"
        exit 1
    fi
}

# Crear CloudFront Distribution
create_cloudfront_distribution() {
    local stage=$1
    local api_gateway_id=$2
    
    log "Creando CloudFront Distribution para $stage..."
    
    # Obtener API Gateway URL
    API_GATEWAY_URL=$(aws apigatewayv2 get-api --api-id $api_gateway_id --region $REGION --query 'ApiEndpoint' --output text)
    
    # Crear configuración de CloudFront
    cat > "/tmp/cloudfront-$stage.json" << EOF
{
    "CallerReference": "merchconnect-$stage-$(date +%s)",
    "Comment": "MerchConnect $stage - CloudFront Distribution",
    "DefaultCacheBehavior": {
        "TargetOriginId": "api-gateway-$stage",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": true,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000
    },
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "api-gateway-$stage",
                "DomainName": "$(echo $API_GATEWAY_URL | sed 's|https://||')",
                "CustomOriginConfig": {
                    "HTTPPort": 443,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "https-only"
                }
            }
        ]
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100",
    "HttpVersion": "http2",
    "IsIPV6Enabled": true
}
EOF
    
    # Crear la distribución
    DISTRIBUTION_ID=$(aws cloudfront create-distribution \
        --distribution-config file:///tmp/cloudfront-$stage.json \
        --query 'Distribution.Id' \
        --output text)
    
    if [ -n "$DISTRIBUTION_ID" ]; then
        success "CloudFront Distribution creada: $DISTRIBUTION_ID"
        echo "DISTRIBUTION_ID_$stage=$DISTRIBUTION_ID" >> /tmp/cloudfront-ids.env
    else
        error "No se pudo crear la distribución CloudFront"
    fi
}

# Configurar dominios personalizados en API Gateway
setup_custom_domain() {
    local stage=$1
    local api_gateway_id=$2
    local domain_name=$3
    
    log "Configurando dominio personalizado para API Gateway $stage: $domain_name"
    
    # Crear custom domain
    aws apigatewayv2 create-domain-name \
        --domain-name $domain_name \
        --domain-name-configurations CertificateArn=$CERT_ARN \
        --region $REGION || log "Dominio ya existe o error al crear"
    
    # Crear mapping
    aws apigatewayv2 create-api-mapping \
        --domain-name $domain_name \
        --api-id $api_gateway_id \
        --stage v1 \
        --region $REGION || log "Mapping ya existe o error al crear"
    
    success "Dominio personalizado configurado: $domain_name"
}

# Crear registros DNS en Route 53
create_dns_records() {
    local stage=$1
    local domain_name=$2
    local distribution_id=$3
    
    log "Creando registros DNS para $domain_name..."
    
    # Obtener CloudFront domain name
    CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id $distribution_id --query 'Distribution.DomainName' --output text)
    
    # Crear registro A para CloudFront
    cat > "/tmp/dns-record-$stage.json" << EOF
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$domain_name",
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
        --hosted-zone-id $HOSTED_ZONE_ID \
        --change-batch file:///tmp/dns-record-$stage.json
    
    success "Registro DNS creado para $domain_name"
}

# Configurar S3 para hosting estático
setup_s3_hosting() {
    local stage=$1
    local bucket_name="mc-$stage-public-$ACCOUNT_ID"
    
    log "Configurando S3 para hosting estático..."
    
    # Habilitar hosting estático
    aws s3 website s3://$bucket_name \
        --index-document index.html \
        --error-document error.html
    
    # Configurar política de bucket
    cat > "/tmp/s3-policy-$stage.json" << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$bucket_name/*"
        }
    ]
}
EOF
    
    aws s3api put-bucket-policy \
        --bucket $bucket_name \
        --policy file:///tmp/s3-policy-$stage.json
    
    success "S3 configurado para hosting estático"
}

# Función principal
main() {
    log "🚀 Iniciando configuración de dominios de producción"
    
    # Verificar dominio
    verify_domain
    
    # Crear certificados SSL
    create_ssl_certificates
    
    # Obtener API Gateway IDs existentes
    DEV_API_ID=$(aws apigatewayv2 get-apis --region $REGION --query "Items[?Name=='mc-dev-api'].ApiId" --output text)
    
    if [ -n "$DEV_API_ID" ]; then
        success "API Gateway dev encontrado: $DEV_API_ID"
        
        # Crear CloudFront para dev
        create_cloudfront_distribution "dev" $DEV_API_ID
        
        # Configurar dominio personalizado
        setup_custom_domain "dev" $DEV_API_ID "api-dev.merchconnectmexico.com"
        
        # Configurar S3 hosting
        setup_s3_hosting "dev"
        
        success "Configuración completada para ambiente dev"
    else
        warning "No se encontró API Gateway para dev"
    fi
    
    # Crear archivo de configuración final
    cat > "/Volumes/Macintosh HD/MerchConnectMexico/production-domains.env" << EOF
# MerchConnect México - Configuración de Dominios de Producción
# Generado automáticamente el $(date)

# Dominio principal
DOMAIN=merchconnectmexico.com
HOSTED_ZONE_ID=$HOSTED_ZONE_ID

# URLs por stage
DEV_URL=dev.merchconnectmexico.com
SBX_URL=sbx.merchconnectmexico.com
PROD_URL=merchconnectmexico.com

# URLs de API por stage
DEV_API_URL=api-dev.merchconnectmexico.com
SBX_API_URL=api-sbx.merchconnectmexico.com
PROD_API_URL=api.merchconnectmexico.com

# Certificado SSL
SSL_CERT_ARN=$CERT_ARN

# CloudFront Distributions
$(cat /tmp/cloudfront-ids.env 2>/dev/null || echo "# CloudFront IDs se generarán después de la validación SSL")

# Para usar en la aplicación
NEXT_PUBLIC_DEV_URL=https://dev.merchconnectmexico.com
NEXT_PUBLIC_SBX_URL=https://sbx.merchconnectmexico.com
NEXT_PUBLIC_PROD_URL=https://merchconnectmexico.com

NEXT_PUBLIC_DEV_API_URL=https://api-dev.merchconnectmexico.com/v1
NEXT_PUBLIC_SBX_API_URL=https://api-sbx.merchconnectmexico.com/v1
NEXT_PUBLIC_PROD_API_URL=https://api.merchconnectmexico.com/v1
EOF
    
    success "🎉 Configuración de dominios completada!"
    log "Archivo de configuración creado: production-domains.env"
    log "Próximos pasos:"
    log "1. Validar el certificado SSL en AWS Certificate Manager"
    log "2. Ejecutar el script nuevamente para completar la configuración"
    log "3. Configurar las variables de entorno en la aplicación"
}

# Ejecutar función principal
main "$@"
