#!/bin/bash

# MerchConnect México - Verificación de Infraestructura AWS
# Este script verifica que todos los servicios estén funcionando correctamente

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
STAGE=${1:-dev}
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"

log "🔍 Verificando infraestructura MerchConnect México para ambiente: $STAGE"

# Verificar DynamoDB
verify_dynamodb() {
    log "Verificando DynamoDB..."
    
    TABLE_STATUS=$(aws dynamodb describe-table --table-name "MerchConnect-$STAGE" --region $REGION --query 'Table.TableStatus' --output text 2>/dev/null || echo "NOT_FOUND")
    
    if [ "$TABLE_STATUS" = "ACTIVE" ]; then
        success "DynamoDB table MerchConnect-$STAGE está ACTIVE"
        
        # Verificar GSI
        GSI_STATUS=$(aws dynamodb describe-table --table-name "MerchConnect-$STAGE" --region $REGION --query 'Table.GlobalSecondaryIndexes[0].IndexStatus' --output text)
        if [ "$GSI_STATUS" = "ACTIVE" ]; then
            success "GSI1 está ACTIVE"
        else
            warning "GSI1 está en estado: $GSI_STATUS"
        fi
    else
        error "DynamoDB table MerchConnect-$STAGE no está ACTIVE (Estado: $TABLE_STATUS)"
    fi
}

# Verificar S3 Buckets
verify_s3() {
    log "Verificando S3 buckets..."
    
    # Assets bucket
    if aws s3api head-bucket --bucket "mc-$STAGE-assets-$ACCOUNT_ID" --region $REGION 2>/dev/null; then
        success "Assets bucket mc-$STAGE-assets-$ACCOUNT_ID existe"
        
        # Verificar versionado
        VERSIONING=$(aws s3api get-bucket-versioning --bucket "mc-$STAGE-assets-$ACCOUNT_ID" --region $REGION --query 'Status' --output text)
        if [ "$VERSIONING" = "Enabled" ]; then
            success "Versionado habilitado en assets bucket"
        else
            warning "Versionado no habilitado en assets bucket"
        fi
        
        # Verificar encriptación
        ENCRYPTION=$(aws s3api get-bucket-encryption --bucket "mc-$STAGE-assets-$ACCOUNT_ID" --region $REGION --query 'ServerSideEncryptionConfiguration.Rules[0].ApplyServerSideEncryptionByDefault.SSEAlgorithm' --output text 2>/dev/null || echo "None")
        if [ "$ENCRYPTION" = "AES256" ]; then
            success "Encriptación AES256 habilitada en assets bucket"
        else
            warning "Encriptación no configurada en assets bucket"
        fi
    else
        error "Assets bucket mc-$STAGE-assets-$ACCOUNT_ID no existe"
    fi
    
    # Public bucket
    if aws s3api head-bucket --bucket "mc-$STAGE-public-$ACCOUNT_ID" --region $REGION 2>/dev/null; then
        success "Public bucket mc-$STAGE-public-$ACCOUNT_ID existe"
    else
        error "Public bucket mc-$STAGE-public-$ACCOUNT_ID no existe"
    fi
}

# Verificar Cognito
verify_cognito() {
    log "Verificando Cognito User Pool..."
    
    USER_POOL_ID=$(aws cognito-idp list-user-pools --max-results 10 --region $REGION --query "UserPools[?Name=='mc-$STAGE-users'].Id" --output text)
    
    if [ -n "$USER_POOL_ID" ]; then
        success "Cognito User Pool mc-$STAGE-users existe (ID: $USER_POOL_ID)"
        
        # Verificar app client
        CLIENT_COUNT=$(aws cognito-idp list-user-pool-clients --user-pool-id $USER_POOL_ID --region $REGION --query 'UserPoolClients | length(@)' --output text)
        if [ "$CLIENT_COUNT" -gt 0 ]; then
            success "App Client configurado"
        else
            warning "No hay App Clients configurados"
        fi
    else
        error "Cognito User Pool mc-$STAGE-users no existe"
    fi
}

# Verificar API Gateway
verify_api_gateway() {
    log "Verificando API Gateway..."
    
    API_ID=$(aws apigatewayv2 get-apis --region $REGION --query "Items[?Name=='mc-$STAGE-api'].ApiId" --output text)
    
    if [ -n "$API_ID" ]; then
        success "API Gateway mc-$STAGE-api existe (ID: $API_ID)"
        
        # Verificar stage
        STAGE_COUNT=$(aws apigatewayv2 get-stages --api-id $API_ID --region $REGION --query 'Items | length(@)' --output text)
        if [ "$STAGE_COUNT" -gt 0 ]; then
            success "Stage v1 configurado"
        else
            warning "No hay stages configurados"
        fi
    else
        error "API Gateway mc-$STAGE-api no existe"
    fi
}

# Verificar SQS
verify_sqs() {
    log "Verificando SQS queues..."
    
    # Main queue
    if aws sqs get-queue-url --queue-name "mc-$STAGE-pages-publish" --region $REGION >/dev/null 2>&1; then
        success "SQS queue mc-$STAGE-pages-publish existe"
    else
        error "SQS queue mc-$STAGE-pages-publish no existe"
    fi
    
    # DLQ
    if aws sqs get-queue-url --queue-name "mc-$STAGE-pages-publish-dlq" --region $REGION >/dev/null 2>&1; then
        success "SQS DLQ mc-$STAGE-pages-publish-dlq existe"
    else
        error "SQS DLQ mc-$STAGE-pages-publish-dlq no existe"
    fi
}

# Verificar Lambda
verify_lambda() {
    log "Verificando Lambda function..."
    
    FUNCTION_STATUS=$(aws lambda get-function --function-name "mc-$STAGE-pages-worker" --region $REGION --query 'Configuration.State' --output text 2>/dev/null || echo "NOT_FOUND")
    
    if [ "$FUNCTION_STATUS" = "Active" ]; then
        success "Lambda function mc-$STAGE-pages-worker está ACTIVE"
        
        # Verificar event source mapping
        MAPPING_COUNT=$(aws lambda list-event-source-mappings --function-name "mc-$STAGE-pages-worker" --region $REGION --query 'EventSourceMappings | length(@)' --output text)
        if [ "$MAPPING_COUNT" -gt 0 ]; then
            success "Event source mapping configurado"
        else
            warning "No hay event source mappings configurados"
        fi
    else
        error "Lambda function mc-$STAGE-pages-worker no está ACTIVE (Estado: $FUNCTION_STATUS)"
    fi
}

# Verificar IAM Roles
verify_iam() {
    log "Verificando IAM roles..."
    
    if aws iam get-role --role-name "lambda-execution-role" >/dev/null 2>&1; then
        success "IAM role lambda-execution-role existe"
        
        # Verificar políticas adjuntas
        POLICY_COUNT=$(aws iam list-attached-role-policies --role-name "lambda-execution-role" --query 'AttachedPolicies | length(@)' --output text)
        if [ "$POLICY_COUNT" -gt 0 ]; then
            success "$POLICY_COUNT políticas adjuntas al role"
        else
            warning "No hay políticas adjuntas al role"
        fi
    else
        error "IAM role lambda-execution-role no existe"
    fi
}

# Verificar permisos de usuario
verify_user_permissions() {
    log "Verificando permisos del usuario actual..."
    
    # Verificar que puede acceder a todos los servicios
    SERVICES=("dynamodb" "s3" "cognito-idp" "apigatewayv2" "sqs" "lambda" "iam")
    
    for service in "${SERVICES[@]}"; do
        case $service in
            "dynamodb")
                if aws dynamodb list-tables --region $REGION >/dev/null 2>&1; then
                    success "Permisos DynamoDB: OK"
                else
                    error "Permisos DynamoDB: FALTA"
                fi
                ;;
            "s3")
                if aws s3 ls >/dev/null 2>&1; then
                    success "Permisos S3: OK"
                else
                    error "Permisos S3: FALTA"
                fi
                ;;
            "cognito-idp")
                if aws cognito-idp list-user-pools --max-results 1 --region $REGION >/dev/null 2>&1; then
                    success "Permisos Cognito: OK"
                else
                    error "Permisos Cognito: FALTA"
                fi
                ;;
            "apigatewayv2")
                if aws apigatewayv2 get-apis --region $REGION >/dev/null 2>&1; then
                    success "Permisos API Gateway: OK"
                else
                    error "Permisos API Gateway: FALTA"
                fi
                ;;
            "sqs")
                if aws sqs list-queues --region $REGION >/dev/null 2>&1; then
                    success "Permisos SQS: OK"
                else
                    error "Permisos SQS: FALTA"
                fi
                ;;
            "lambda")
                if aws lambda list-functions --region $REGION >/dev/null 2>&1; then
                    success "Permisos Lambda: OK"
                else
                    error "Permisos Lambda: FALTA"
                fi
                ;;
            "iam")
                if aws iam list-roles --max-items 1 >/dev/null 2>&1; then
                    success "Permisos IAM: OK"
                else
                    error "Permisos IAM: FALTA"
                fi
                ;;
        esac
    done
}

# Función principal
main() {
    log "🔍 Iniciando verificación completa de infraestructura"
    
    verify_user_permissions
    verify_dynamodb
    verify_s3
    verify_cognito
    verify_api_gateway
    verify_sqs
    verify_lambda
    verify_iam
    
    success "🎉 Verificación completada!"
    log "Resumen de recursos:"
    log "- DynamoDB: MerchConnect-$STAGE"
    log "- S3: mc-$STAGE-assets-$ACCOUNT_ID, mc-$STAGE-public-$ACCOUNT_ID"
    log "- Cognito: mc-$STAGE-users"
    log "- API Gateway: mc-$STAGE-api"
    log "- SQS: mc-$STAGE-pages-publish, mc-$STAGE-pages-publish-dlq"
    log "- Lambda: mc-$STAGE-pages-worker"
    log "- IAM: lambda-execution-role"
}

# Ejecutar función principal
main "$@"
