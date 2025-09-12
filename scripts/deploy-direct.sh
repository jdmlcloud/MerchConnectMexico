#!/bin/bash

# MerchConnect México - Direct CloudFormation Deployment
# Este script despliega la infraestructura directamente usando CloudFormation

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

log "🚀 Desplegando infraestructura MerchConnect México para ambiente: $STAGE"

# Crear DynamoDB Table
create_dynamodb_table() {
    log "Creando tabla DynamoDB..."
    
    aws dynamodb create-table \
        --table-name "MerchConnect-$STAGE" \
        --attribute-definitions \
            AttributeName=PK,AttributeType=S \
            AttributeName=SK,AttributeType=S \
            AttributeName=GSI1PK,AttributeType=S \
            AttributeName=GSI1SK,AttributeType=S \
        --key-schema \
            AttributeName=PK,KeyType=HASH \
            AttributeName=SK,KeyType=RANGE \
        --global-secondary-indexes \
            IndexName=GSI1,KeySchema=[{AttributeName=GSI1PK,KeyType=HASH},{AttributeName=GSI1SK,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
        --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
        --point-in-time-recovery-specification '{"PointInTimeRecoveryEnabled":true}' \
        --tags Key=App,Value=MerchConnect Key=Stage,Value=$STAGE Key=Owner,Value=Jahaziel \
        --region $REGION || log "Tabla ya existe o error al crear"
    
    success "Tabla DynamoDB creada"
}

# Crear S3 Buckets
create_s3_buckets() {
    log "Creando buckets S3..."
    
    # Assets bucket
    if [ "$REGION" = "us-east-1" ]; then
        aws s3api create-bucket \
            --bucket "mc-$STAGE-assets-$ACCOUNT_ID" \
            --region $REGION || log "Bucket assets ya existe"
        
        aws s3api create-bucket \
            --bucket "mc-$STAGE-public-$ACCOUNT_ID" \
            --region $REGION || log "Bucket public ya existe"
    else
        aws s3api create-bucket \
            --bucket "mc-$STAGE-assets" \
            --region $REGION \
            --create-bucket-configuration LocationConstraint=$REGION || log "Bucket assets ya existe"
        
        aws s3api create-bucket \
            --bucket "mc-$STAGE-public" \
            --region $REGION \
            --create-bucket-configuration LocationConstraint=$REGION || log "Bucket public ya existe"
    fi
    
    # Configurar versionado
    aws s3api put-bucket-versioning \
        --bucket "mc-$STAGE-assets-$ACCOUNT_ID" \
        --versioning-configuration Status=Enabled
    
    aws s3api put-bucket-versioning \
        --bucket "mc-$STAGE-public-$ACCOUNT_ID" \
        --versioning-configuration Status=Enabled
    
    # Configurar encriptación
    aws s3api put-bucket-encryption \
        --bucket "mc-$STAGE-assets-$ACCOUNT_ID" \
        --server-side-encryption-configuration '{
            "Rules": [
                {
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "AES256"
                    }
                }
            ]
        }'
    
    aws s3api put-bucket-encryption \
        --bucket "mc-$STAGE-public-$ACCOUNT_ID" \
        --server-side-encryption-configuration '{
            "Rules": [
                {
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "AES256"
                    }
                }
            ]
        }'
    
    success "Buckets S3 creados"
}

# Crear Cognito User Pool
create_cognito_pool() {
    log "Creando Cognito User Pool..."
    
    # Crear User Pool
    USER_POOL_ID=$(aws cognito-idp create-user-pool \
        --pool-name "mc-$STAGE-users" \
        --policies '{
            "PasswordPolicy": {
                "MinimumLength": 8,
                "RequireUppercase": true,
                "RequireLowercase": true,
                "RequireNumbers": true,
                "RequireSymbols": false
            }
        }' \
        --schema '[
            {
                "Name": "email",
                "AttributeDataType": "String",
                "Required": true,
                "Mutable": true
            }
        ]' \
        --auto-verified-attributes email \
        --region $REGION \
        --query 'UserPool.Id' \
        --output text)
    
    # Crear App Client
    CLIENT_ID=$(aws cognito-idp create-user-pool-client \
        --user-pool-id $USER_POOL_ID \
        --client-name "mc-$STAGE-web-client" \
        --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH \
        --supported-identity-providers COGNITO \
        --generate-secret \
        --region $REGION \
        --query 'UserPoolClient.ClientId' \
        --output text)
    
    # Guardar IDs en archivo
    echo "USER_POOL_ID=$USER_POOL_ID" > "/tmp/mc-$STAGE-cognito.env"
    echo "CLIENT_ID=$CLIENT_ID" >> "/tmp/mc-$STAGE-cognito.env"
    
    success "Cognito User Pool creado: $USER_POOL_ID"
    success "App Client creado: $CLIENT_ID"
}

# Crear SQS Queues
create_sqs_queues() {
    log "Creando colas SQS..."
    
    # DLQ
    aws sqs create-queue \
        --queue-name "mc-$STAGE-pages-publish-dlq" \
        --attributes '{
            "MessageRetentionPeriod": "1209600",
            "KmsMasterKeyId": "alias/aws/sqs"
        }' \
        --region $REGION || log "DLQ ya existe"
    
    # Main Queue
    DLQ_URL=$(aws sqs get-queue-url --queue-name "mc-$STAGE-pages-publish-dlq" --region $REGION --query 'QueueUrl' --output text)
    
    aws sqs create-queue \
        --queue-name "mc-$STAGE-pages-publish" \
        --attributes "{
            \"MessageRetentionPeriod\": \"345600\",
            \"KmsMasterKeyId\": \"alias/aws/sqs\",
            \"RedrivePolicy\": \"{\\\"deadLetterTargetArn\\\":\\\"$DLQ_URL\\\",\\\"maxReceiveCount\\\":5}\"
        }" \
        --region $REGION || log "Queue principal ya existe"
    
    success "Colas SQS creadas"
}

# Crear Lambda Function para Pages Worker
create_lambda_function() {
    log "Creando Lambda function para Pages Worker..."
    
    # Crear el código de la función
    cat > "/tmp/pages-worker.js" << 'EOF'
exports.handler = async (event) => {
    console.log('Processing pages publish event:', JSON.stringify(event, null, 2));
    
    // TODO: Implementar lógica de procesamiento de páginas
    // - Leer MDX del S3
    // - Convertir a HTML
    // - Subir a bucket público
    // - Invalidar CloudFront cache
    
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Pages processed successfully' })
    };
};
EOF
    
    # Crear ZIP
    cd /tmp
    zip pages-worker.zip pages-worker.js
    
    # Crear función Lambda
    aws lambda create-function \
        --function-name "mc-$STAGE-pages-worker" \
        --runtime nodejs20.x \
        --role "arn:aws:iam::$ACCOUNT_ID:role/lambda-execution-role" \
        --handler pages-worker.handler \
        --zip-file fileb://pages-worker.zip \
        --environment Variables="{STAGE=$STAGE}" \
        --region $REGION || log "Lambda function ya existe"
    
    success "Lambda function creada"
}

# Crear IAM Role para Lambda
create_lambda_role() {
    log "Creando IAM role para Lambda..."
    
    # Trust policy
    cat > "/tmp/lambda-trust-policy.json" << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "lambda.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF
    
    # Crear role
    aws iam create-role \
        --role-name "lambda-execution-role" \
        --assume-role-policy-document file:///tmp/lambda-trust-policy.json || log "Role ya existe"
    
    # Adjuntar políticas
    aws iam attach-role-policy \
        --role-name "lambda-execution-role" \
        --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
    
    aws iam attach-role-policy \
        --role-name "lambda-execution-role" \
        --policy-arn "arn:aws:iam::aws:policy/AmazonS3FullAccess"
    
    aws iam attach-role-policy \
        --role-name "lambda-execution-role" \
        --policy-arn "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
    
    success "IAM role creado"
}

# Crear API Gateway
create_api_gateway() {
    log "Creando API Gateway..."
    
    # Crear API
    API_ID=$(aws apigatewayv2 create-api \
        --name "mc-$STAGE-api" \
        --protocol-type HTTP \
        --cors-configuration '{
            "AllowOrigins": ["*"],
            "AllowMethods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "AllowHeaders": ["Content-Type", "Authorization"],
            "MaxAge": 300
        }' \
        --region $REGION \
        --query 'ApiId' \
        --output text)
    
    # Crear stage
    aws apigatewayv2 create-stage \
        --api-id $API_ID \
        --stage-name "v1" \
        --auto-deploy \
        --region $REGION
    
    success "API Gateway creado: $API_ID"
}

# Función principal
main() {
    log "🔧 Iniciando despliegue directo para $STAGE"
    
    create_dynamodb_table
    create_s3_buckets
    create_cognito_pool
    create_sqs_queues
    create_lambda_role
    create_lambda_function
    create_api_gateway
    
    success "🎉 Despliegue directo completado para $STAGE!"
    log "Próximos pasos:"
    log "1. Configurar variables de entorno con los IDs generados"
    log "2. Desplegar la aplicación web"
    log "3. Configurar dominios personalizados"
}

# Ejecutar función principal
main "$@"
