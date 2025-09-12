#!/bin/bash

# MerchConnect México - AWS Setup Script
# Configura roles OIDC, budgets y despliega infraestructura

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar AWS CLI
if ! command -v aws &> /dev/null; then
    error "AWS CLI no está instalado. Instálalo desde: https://aws.amazon.com/cli/"
    exit 1
fi

# Verificar CDK
if ! command -v cdk &> /dev/null; then
    error "AWS CDK no está instalado. Instálalo con: npm install -g aws-cdk"
    exit 1
fi

# Obtener información de la cuenta
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"
GITHUB_REPO="jdmlcloud/MerchConnectMexico"

log "Configurando AWS para MerchConnect México"
log "Account ID: $ACCOUNT_ID"
log "Region: $REGION"
log "GitHub Repo: $GITHUB_REPO"

# 1. Crear roles OIDC para GitHub Actions
create_oidc_roles() {
    log "Creando roles OIDC para GitHub Actions..."
    
    # Trust policy para GitHub OIDC
    cat > /tmp/github-trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::$ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                },
                "StringLike": {
                    "token.actions.githubusercontent.com:sub": "repo:$GITHUB_REPO:*"
                }
            }
        }
    ]
}
EOF

    # Policy para cada stage
    cat > /tmp/stage-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "aws:ResourceTag/Stage": "\${aws:PrincipalTag/Stage}"
                }
            }
        }
    ]
}
EOF

    # Crear roles para cada stage
    for stage in dev sbx prod; do
        log "Creando rol para stage: $stage"
        
        # Crear el rol
        aws iam create-role \
            --role-name "github-oidc-merchconnect-$stage" \
            --assume-role-policy-document file:///tmp/github-trust-policy.json \
            --description "GitHub OIDC role for MerchConnect $stage environment" \
            --tags Key=App,Value=MerchConnect Key=Stage,Value=$stage Key=Owner,Value=Jahaziel || true

        # Crear policy específica del stage
        aws iam create-policy \
            --policy-name "MerchConnect-$stage-Policy" \
            --policy-document file:///tmp/stage-policy.json \
            --description "Policy for MerchConnect $stage environment" || true

        # Attach policy al rol
        aws iam attach-role-policy \
            --role-name "github-oidc-merchconnect-$stage" \
            --policy-arn "arn:aws:iam::$ACCOUNT_ID:policy/MerchConnect-$stage-Policy"

        # Obtener ARN del rol
        ROLE_ARN=$(aws iam get-role --role-name "github-oidc-merchconnect-$stage" --query 'Role.Arn' --output text)
        success "Rol creado: $ROLE_ARN"
        
        # Mostrar ARN para actualizar en workflows
        echo "Actualiza el workflow con: TODO_ROLE_ARN_${stage^^} = $ROLE_ARN"
    done
}

# 2. Crear budgets por stage
create_budgets() {
    log "Creando budgets por stage..."
    
    for stage in dev sbx prod; do
        cat > /tmp/budget-$stage.json << EOF
{
    "Budget": {
        "BudgetName": "MerchConnect-$stage-Budget",
        "BudgetLimit": {
            "Amount": "100",
            "Unit": "USD"
        },
        "TimeUnit": "MONTHLY",
        "BudgetType": "COST",
        "CostFilters": {
            "TagKey": ["Stage"],
            "TagValue": ["$stage"]
        },
        "NotificationsWithSubscribers": [
            {
                "Notification": {
                    "NotificationType": "ACTUAL",
                    "ComparisonOperator": "GREATER_THAN",
                    "Threshold": 70,
                    "ThresholdType": "PERCENTAGE"
                },
                "Subscribers": [
                    {
                        "SubscriptionType": "EMAIL",
                        "Address": "admin@merchconnect.com"
                    }
                ]
            },
            {
                "Notification": {
                    "NotificationType": "ACTUAL",
                    "ComparisonOperator": "GREATER_THAN",
                    "Threshold": 90,
                    "ThresholdType": "PERCENTAGE"
                },
                "Subscribers": [
                    {
                        "SubscriptionType": "EMAIL",
                        "Address": "admin@merchconnect.com"
                    }
                ]
            }
        ]
    }
}
EOF

        aws budgets create-budget \
            --account-id $ACCOUNT_ID \
            --budget file:///tmp/budget-$stage.json || warning "Budget para $stage ya existe"
    done
    
    success "Budgets creados"
}

# 3. Desplegar infraestructura
deploy_infrastructure() {
    local stage=$1
    log "Desplegando infraestructura para stage: $stage"
    
    cd /Volumes/Macintosh\ HD/MerchConnectMexico/infra/cdk
    
    # Instalar dependencias
    pnpm install
    
    # Compilar
    pnpm build
    
    # Deploy
    STAGE=$stage cdk deploy --all --require-approval never
    
    success "Infraestructura desplegada para $stage"
}

# 4. Mostrar información de configuración
show_config() {
    log "Configuración completada. Información importante:"
    echo ""
    echo "🔧 ROLES OIDC CREADOS:"
    for stage in dev sbx prod; do
        ROLE_ARN=$(aws iam get-role --role-name "github-oidc-merchconnect-$stage" --query 'Role.Arn' --output text 2>/dev/null || echo "No encontrado")
        echo "  $stage: $ROLE_ARN"
    done
    echo ""
    echo "📝 PRÓXIMOS PASOS:"
    echo "1. Actualiza los ARNs en .github/workflows/*.yml"
    echo "2. Haz push a develop para desplegar dev"
    echo "3. Configura dominios en Route 53 si es necesario"
    echo ""
    echo "🚀 COMANDOS DE DEPLOY:"
    echo "  pnpm deploy:infra:dev    # Deploy a dev"
    echo "  pnpm deploy:infra:sbx    # Deploy a sbx" 
    echo "  pnpm deploy:infra:prod   # Deploy a prod"
}

# Función principal
main() {
    case "${1:-all}" in
        "roles")
            create_oidc_roles
            ;;
        "budgets")
            create_budgets
            ;;
        "deploy")
            if [ -z "$2" ]; then
                error "Especifica el stage: dev, sbx, o prod"
                exit 1
            fi
            deploy_infrastructure $2
            ;;
        "all")
            create_oidc_roles
            create_budgets
            show_config
            ;;
        *)
            echo "Uso: $0 [roles|budgets|deploy <stage>|all]"
            echo ""
            echo "Comandos:"
            echo "  roles     - Crear roles OIDC"
            echo "  budgets   - Crear budgets por stage"
            echo "  deploy    - Deploy infraestructura (especificar stage)"
            echo "  all       - Ejecutar todo"
            exit 1
            ;;
    esac
}

# Limpiar archivos temporales
cleanup() {
    rm -f /tmp/github-trust-policy.json
    rm -f /tmp/stage-policy.json
    rm -f /tmp/budget-*.json
}

trap cleanup EXIT

# Ejecutar función principal
main "$@"
