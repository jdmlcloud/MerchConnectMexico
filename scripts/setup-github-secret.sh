#!/bin/bash

# Script para configurar el token de GitHub en AWS Secrets Manager
# Uso: ./scripts/setup-github-secret.sh <GITHUB_TOKEN>

set -e

GITHUB_TOKEN=${1:-""}
SECRET_NAME="github-token"
REGION="us-east-1"

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: Debes proporcionar un token de GitHub"
    echo "Uso: $0 <GITHUB_TOKEN>"
    echo ""
    echo "Para obtener un token de GitHub:"
    echo "1. Ve a https://github.com/settings/tokens"
    echo "2. Genera un nuevo token con permisos 'repo' y 'admin:repo_hook'"
    echo "3. Ejecuta: $0 <tu_token>"
    exit 1
fi

echo "🔧 Configurando token de GitHub en AWS Secrets Manager..."

# Verificar si el secret ya existe
if aws secretsmanager describe-secret --secret-id "$SECRET_NAME" --region "$REGION" >/dev/null 2>&1; then
    echo "📝 Actualizando secret existente..."
    aws secretsmanager update-secret \
        --secret-id "$SECRET_NAME" \
        --secret-string "$GITHUB_TOKEN" \
        --region "$REGION" \
        --description "GitHub Personal Access Token for CodePipeline"
else
    echo "📝 Creando nuevo secret..."
    aws secretsmanager create-secret \
        --name "$SECRET_NAME" \
        --secret-string "$GITHUB_TOKEN" \
        --region "$REGION" \
        --description "GitHub Personal Access Token for CodePipeline"
fi

echo "✅ Token de GitHub configurado exitosamente"
echo "🔗 ARN del secret: arn:aws:secretsmanager:$REGION:$(aws sts get-caller-identity --query Account --output text):secret:$SECRET_NAME"

# Verificar que el secret se puede leer
echo "🧪 Verificando que el secret se puede leer..."
aws secretsmanager get-secret-value \
    --secret-id "$SECRET_NAME" \
    --region "$REGION" \
    --query SecretString \
    --output text >/dev/null

echo "✅ Verificación exitosa"
echo ""
echo "📋 Próximos pasos:"
echo "1. Despliega la infraestructura con: pnpm deploy:infra:sbx"
echo "2. El pipeline se creará automáticamente"
echo "3. Haz push a la rama 'sandbox' para activar el pipeline"
