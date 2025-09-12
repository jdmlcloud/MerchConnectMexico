#!/bin/bash

echo "🧹 Paso 1: Eliminando credenciales anteriores..."

# Eliminar archivo de credenciales y config (opcional, con backup)
mkdir -p ~/.aws/backup
cp ~/.aws/credentials ~/.aws/backup/credentials.bak 2>/dev/null
cp ~/.aws/config ~/.aws/backup/config.bak 2>/dev/null

rm -f ~/.aws/credentials
rm -f ~/.aws/config

echo "✅ Credenciales anteriores eliminadas."

echo ""
echo "🔐 Paso 2: Introduce las nuevas credenciales de AWS"
read -p "➡️  Access Key ID: " ACCESS_KEY
read -s -p "➡️  Secret Access Key: " SECRET_KEY
echo ""
read -p "🌍 Región por defecto (ej: us-east-1): " REGION

echo "🛠️ Paso 3: Configurando nuevo perfil..."
aws configure set aws_access_key_id "$ACCESS_KEY"
aws configure set aws_secret_access_key "$SECRET_KEY"
aws configure set default.region "$REGION"
aws configure set default.output json

echo ""
echo "✅ Listo. Tu configuración actual es:"
aws configure list

