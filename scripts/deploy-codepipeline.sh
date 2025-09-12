#!/bin/bash

# Script para desplegar MerchConnect con CodePipeline
# Uso: ./scripts/deploy-codepipeline.sh <stage> [github-token]

set -e

STAGE=${1:-"dev"}
GITHUB_TOKEN=${2:-""}
REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "🚀 Desplegando MerchConnect con CodePipeline para stage: $STAGE"

# Verificar que el stage es válido
if [[ ! "$STAGE" =~ ^(dev|sbx|prod)$ ]]; then
    echo "❌ Error: Stage debe ser dev, sbx o prod"
    exit 1
fi

# Configurar el token de GitHub si se proporciona
if [ -n "$GITHUB_TOKEN" ]; then
    echo "🔧 Configurando token de GitHub..."
    ./scripts/setup-github-secret.sh "$GITHUB_TOKEN"
fi

# Verificar que el secret existe
SECRET_ARN="arn:aws:secretsmanager:$REGION:$ACCOUNT_ID:secret:github-token"
if ! aws secretsmanager describe-secret --secret-id "$SECRET_ARN" >/dev/null 2>&1; then
    echo "❌ Error: El secret de GitHub no existe. Ejecuta:"
    echo "   ./scripts/setup-github-secret.sh <tu_github_token>"
    exit 1
fi

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
export GITHUB_TOKEN_SECRET_ARN="$SECRET_ARN"

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
