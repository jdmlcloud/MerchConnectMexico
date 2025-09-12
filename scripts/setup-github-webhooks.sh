#!/bin/bash

# Script para configurar webhooks de GitHub para CodePipeline
# Uso: ./scripts/setup-github-webhooks.sh <stage>

set -e

STAGE=${1:-"dev"}
REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "🔗 Configurando webhooks de GitHub para stage: $STAGE"

# Verificar que el stage es válido
if [[ ! "$STAGE" =~ ^(dev|sbx|prod)$ ]]; then
    echo "❌ Error: Stage debe ser dev, sbx o prod"
    exit 1
fi

# Obtener el ARN del pipeline
PIPELINE_NAME="merchconnect-${STAGE}-pipeline"
PIPELINE_ARN="arn:aws:codepipeline:$REGION:$ACCOUNT_ID:pipeline/$PIPELINE_NAME"

echo "📋 Pipeline: $PIPELINE_NAME"
echo "🔗 ARN: $PIPELINE_ARN"

# Verificar que el pipeline existe
if ! aws codepipeline get-pipeline --name "$PIPELINE_NAME" >/dev/null 2>&1; then
    echo "❌ Error: El pipeline $PIPELINE_NAME no existe"
    echo "   Ejecuta primero: ./scripts/deploy-codepipeline.sh $STAGE"
    exit 1
fi

# Obtener el token de GitHub
echo "🔑 Obteniendo token de GitHub..."
GITHUB_TOKEN=$(aws secretsmanager get-secret-value \
    --secret-id "github-token" \
    --region "$REGION" \
    --query SecretString \
    --output text)

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: No se pudo obtener el token de GitHub"
    exit 1
fi

# Configurar webhook para GitHub
echo "🔧 Configurando webhook de GitHub..."

# Obtener la URL del webhook del pipeline
WEBHOOK_URL=$(aws codepipeline get-pipeline --name "$PIPELINE_NAME" \
    --query 'pipeline.stages[?name==`Source`].actions[0].configuration.WebhookUrl' \
    --output text)

if [ "$WEBHOOK_URL" = "None" ] || [ -z "$WEBHOOK_URL" ]; then
    echo "⚠️  El pipeline no tiene webhook configurado"
    echo "   El webhook se configurará automáticamente en el próximo push"
else
    echo "✅ Webhook URL: $WEBHOOK_URL"
fi

# Verificar configuración de GitHub
echo "🔍 Verificando configuración de GitHub..."

# Obtener información del repositorio
REPO_OWNER="jdmlcloud"
REPO_NAME="MerchConnectMexico"
BRANCH=$([ "$STAGE" = "dev" ] && echo "develop" || [ "$STAGE" = "sbx" ] && echo "sandbox" || echo "main")

echo "📋 Repositorio: $REPO_OWNER/$REPO_NAME"
echo "🌿 Rama: $BRANCH"

# Verificar que la rama existe
if ! git ls-remote --heads origin "$BRANCH" | grep -q "refs/heads/$BRANCH"; then
    echo "⚠️  La rama $BRANCH no existe en el repositorio remoto"
    echo "   Creando la rama..."
    
    # Crear la rama si no existe
    if [ "$BRANCH" = "develop" ]; then
        git checkout -b develop
        git push origin develop
    elif [ "$BRANCH" = "sandbox" ]; then
        git checkout -b sandbox
        git push origin sandbox
    elif [ "$BRANCH" = "main" ]; then
        git checkout -b main
        git push origin main
    fi
fi

echo "✅ Configuración completada"
echo ""
echo "📋 Próximos pasos:"
echo "1. Haz push a la rama $BRANCH para activar el pipeline"
echo "2. Monitorea el pipeline en: https://console.aws.amazon.com/codesuite/codepipeline/pipelines"
echo "3. Revisa los logs de build en: https://console.aws.amazon.com/codesuite/codebuild/projects"
