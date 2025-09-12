#!/bin/bash

# MerchConnect México - Configuración OIDC para GitHub Actions
# Este script configura OpenID Connect para autenticación sin claves estáticas

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
GITHUB_ORG="jahazielmartinez"  # Cambiar por tu organización
GITHUB_REPO="MerchConnectMexico"  # Cambiar por tu repositorio
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"

log "🔐 Configurando OIDC para GitHub Actions"

# 1. Crear Identity Provider OIDC
create_oidc_provider() {
    log "Creando Identity Provider OIDC..."
    
    # Verificar si ya existe
    EXISTING_PROVIDER=$(aws iam list-open-id-connect-providers --query "OpenIDConnectProviderList[?contains(Arn, 'github')].Arn" --output text)
    
    if [ -n "$EXISTING_PROVIDER" ]; then
        success "Identity Provider OIDC ya existe: $EXISTING_PROVIDER"
        OIDC_PROVIDER_ARN=$EXISTING_PROVIDER
    else
        # Crear Identity Provider
        OIDC_PROVIDER_ARN=$(aws iam create-open-id-connect-provider \
            --url "https://token.actions.githubusercontent.com" \
            --client-id-list "sts.amazonaws.com" \
            --thumbprint-list "6938fd4d98bab03faadb97b34396831e3780aea1" \
            --query 'OpenIDConnectProviderArn' \
            --output text)
        
        if [ -n "$OIDC_PROVIDER_ARN" ]; then
            success "Identity Provider OIDC creado: $OIDC_PROVIDER_ARN"
        else
            error "No se pudo crear el Identity Provider OIDC"
            exit 1
        fi
    fi
}

# 2. Crear Role para GitHub Actions
create_github_role() {
    log "Creando IAM Role para GitHub Actions..."
    
    # Verificar si ya existe
    EXISTING_ROLE=$(aws iam get-role --role-name github-actions-role --query 'Role.RoleName' --output text 2>/dev/null || echo "")
    
    if [ -n "$EXISTING_ROLE" ]; then
        success "IAM Role ya existe: github-actions-role"
    else
        # Crear Trust Policy
        cat > /tmp/github-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "$OIDC_PROVIDER_ARN"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:$GITHUB_ORG/$GITHUB_REPO:*"
        }
      }
    }
  ]
}
EOF

        # Crear Role
        aws iam create-role \
            --role-name github-actions-role \
            --assume-role-policy-document file:///tmp/github-trust-policy.json \
            --description "Role for GitHub Actions to deploy MerchConnect México"
        
        success "IAM Role creado: github-actions-role"
    fi
}

# 3. Crear Policy para GitHub Actions
create_github_policy() {
    log "Creando IAM Policy para GitHub Actions..."
    
    # Verificar si ya existe
    EXISTING_POLICY=$(aws iam get-policy --policy-arn "arn:aws:iam::$ACCOUNT_ID:policy/GitHubActionsDeployPolicy" --query 'Policy.PolicyName' --output text 2>/dev/null || echo "")
    
    if [ -n "$EXISTING_POLICY" ]; then
        success "IAM Policy ya existe: GitHubActionsDeployPolicy"
    else
        # Crear Policy
        cat > /tmp/github-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:*"
      ],
      "Resource": [
        "arn:aws:s3:::*merchconnect*",
        "arn:aws:s3:::*merchconnect*/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "lambda:*"
      ],
      "Resource": [
        "arn:aws:lambda:$REGION:$ACCOUNT_ID:function:mc-*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "apigateway:*"
      ],
      "Resource": [
        "arn:aws:apigateway:$REGION::/apis/*",
        "arn:aws:apigateway:$REGION::/restapis/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:*"
      ],
      "Resource": [
        "arn:aws:dynamodb:$REGION:$ACCOUNT_ID:table/MerchConnect-*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cognito-idp:*"
      ],
      "Resource": [
        "arn:aws:cognito-idp:$REGION:$ACCOUNT_ID:userpool/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "sqs:*"
      ],
      "Resource": [
        "arn:aws:sqs:$REGION:$ACCOUNT_ID:mc-*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "wafv2:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "route53:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "acm:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:PassRole"
      ],
      "Resource": [
        "arn:aws:iam::$ACCOUNT_ID:role/lambda-execution-role",
        "arn:aws:iam::$ACCOUNT_ID:role/github-actions-role"
      ]
    }
  ]
}
EOF

        # Crear Policy
        aws iam create-policy \
            --policy-name GitHubActionsDeployPolicy \
            --policy-document file:///tmp/github-policy.json \
            --description "Policy for GitHub Actions to deploy MerchConnect México"
        
        success "IAM Policy creado: GitHubActionsDeployPolicy"
    fi
}

# 4. Adjuntar Policy al Role
attach_policy_to_role() {
    log "Adjuntando Policy al Role..."
    
    # Adjuntar Policy personalizada
    aws iam attach-role-policy \
        --role-name github-actions-role \
        --policy-arn "arn:aws:iam::$ACCOUNT_ID:policy/GitHubActionsDeployPolicy"
    
    # Adjuntar Policy de CloudFormation (para CDK)
    aws iam attach-role-policy \
        --role-name github-actions-role \
        --policy-arn "arn:aws:iam::aws:policy/CloudFormationFullAccess" || warning "CloudFormationFullAccess no disponible"
    
    # Adjuntar Policy de CDK
    aws iam attach-role-policy \
        --role-name github-actions-role \
        --policy-arn "arn:aws:iam::aws:policy/PowerUserAccess"
    
    success "Policies adjuntadas al Role"
}

# 5. Crear archivo de configuración
create_config_file() {
    log "Creando archivo de configuración..."
    
    cat > "/Volumes/Macintosh HD/MerchConnectMexico/github-oidc-config.env" << EOF
# MerchConnect México - Configuración OIDC GitHub Actions
# Generado automáticamente el $(date)

# AWS Configuration
AWS_ACCOUNT_ID=$ACCOUNT_ID
AWS_REGION=$REGION

# GitHub Configuration
GITHUB_ORG=$GITHUB_ORG
GITHUB_REPO=$GITHUB_REPO

# OIDC Configuration
OIDC_PROVIDER_ARN=$OIDC_PROVIDER_ARN
GITHUB_ROLE_ARN=arn:aws:iam::$ACCOUNT_ID:role/github-actions-role

# Trust Policy (para referencia)
GITHUB_TRUST_POLICY='{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "$OIDC_PROVIDER_ARN"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:$GITHUB_ORG/$GITHUB_REPO:*"
        }
      }
    }
  ]
}'
EOF

    success "Archivo de configuración creado: github-oidc-config.env"
}

# 6. Verificar configuración
verify_configuration() {
    log "Verificando configuración OIDC..."
    
    # Verificar Identity Provider
    PROVIDER_COUNT=$(aws iam list-open-id-connect-providers --query "length(OpenIDConnectProviderList)" --output text)
    if [ "$PROVIDER_COUNT" -gt 0 ]; then
        success "Identity Provider OIDC configurado correctamente"
    else
        error "No se encontró Identity Provider OIDC"
        exit 1
    fi
    
    # Verificar Role
    ROLE_EXISTS=$(aws iam get-role --role-name github-actions-role --query 'Role.RoleName' --output text 2>/dev/null || echo "")
    if [ -n "$ROLE_EXISTS" ]; then
        success "IAM Role configurado correctamente"
    else
        error "No se encontró IAM Role"
        exit 1
    fi
    
    # Verificar Policies adjuntadas
    POLICY_COUNT=$(aws iam list-attached-role-policies --role-name github-actions-role --query "length(AttachedPolicies)" --output text)
    if [ "$POLICY_COUNT" -gt 0 ]; then
        success "Policies adjuntadas correctamente ($POLICY_COUNT policies)"
    else
        error "No se encontraron policies adjuntadas"
        exit 1
    fi
}

# Función principal
main() {
    log "🔐 Iniciando configuración OIDC para GitHub Actions"
    
    create_oidc_provider
    create_github_role
    create_github_policy
    attach_policy_to_role
    create_config_file
    verify_configuration
    
    success "🎉 Configuración OIDC completada!"
    log ""
    log "📋 Configuración creada:"
    log "✅ Identity Provider OIDC: $OIDC_PROVIDER_ARN"
    log "✅ IAM Role: github-actions-role"
    log "✅ IAM Policy: GitHubActionsDeployPolicy"
    log "✅ Trust Policy: Configurado para $GITHUB_ORG/$GITHUB_REPO"
    log ""
    log "🔧 Próximos pasos:"
    log "1. Verificar que el repositorio $GITHUB_ORG/$GITHUB_REPO existe"
    log "2. Los workflows de GitHub Actions ya están configurados"
    log "3. Hacer push a las ramas develop/sandbox/main para probar"
    log ""
    log "📁 Archivos creados:"
    log "- github-oidc-config.env (configuración OIDC)"
    log "- .github/workflows/ (workflows de CI/CD)"
}

# Ejecutar función principal
main "$@"
