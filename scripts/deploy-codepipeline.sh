#!/bin/bash

# Script para desplegar MerchConnect con CodePipeline
# Uso: ./scripts/deploy-codepipeline.sh <stage>

set -e

STAGE=${1:-"dev"}
REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "🚀 Desplegando MerchConnect con CodePipeline para stage: $STAGE"

# Verificar que el stage es válido
if [[ ! "$STAGE" =~ ^(dev|sbx|prod)$ ]]; then
    echo "❌ Error: Stage debe ser dev, sbx o prod"
    exit 1
fi

# Verificar que la conexión de GitHub existe
GITHUB_CONNECTION_ARN="arn:aws:codeconnections:$REGION:$ACCOUNT_ID:connection/dc84f0a6-30c7-4282-aa1d-25271ea24b7b"
if ! aws codeconnections get-connection --connection-arn "$GITHUB_CONNECTION_ARN" >/dev/null 2>&1; then
    echo "❌ Error: La conexión de GitHub no existe o no está disponible"
    echo "   Configura primero la conexión en AWS CodeConnections"
    exit 1
fi

echo "✅ Conexión de GitHub verificada"

echo "📦 Instalando dependencias..."
pnpm install

echo "🏗️ Construyendo packages..."
pnpm build:packages

echo "🔧 Desplegando infraestructura con CDK..."
cd infra/cdk

# Configurar variables de entorno
export STAGE="$STAGE"
export CDK_DEFAULT_ACCOUNT="$ACCOUNT_ID"
export CDK_DEFAULT_REGION="$REGION"
export GITHUB_CONNECTION_ARN="$GITHUB_CONNECTION_ARN"

# Desplegar
pnpm build
npx cdk deploy --all --require-approval never

echo "✅ Despliegue completado exitosamente"
echo ""
echo "📋 Información del Pipeline:"
echo "🔗 Consola de CodePipeline: https://console.aws.amazon.com/codesuite/codepipeline/pipelines"
echo "🔗 Consola de CodeBuild: https://console.aws.amazon.com/codesuite/codebuild/projects"

# Obtener información del pipeline
PIPELINE_NAME="merchconnect-${STAGE}-pipeline"
echo ""
echo "📊 Pipeline: $PIPELINE_NAME"
echo "🌿 Rama: $([ "$STAGE" = "dev" ] && echo "develop" || [ "$STAGE" = "sbx" ] && echo "sandbox" || echo "main")"
echo ""
echo "🎯 Para activar el pipeline, haz push a la rama correspondiente:"
if [ "$STAGE" = "dev" ]; then
    echo "   git push origin develop"
elif [ "$STAGE" = "sbx" ]; then
    echo "   git push origin sandbox"
else
    echo "   git push origin main"
fi
