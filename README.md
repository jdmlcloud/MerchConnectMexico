# MerchConnect México

Marketplace B2B multi-tenant de talleres y proveedores de merchandise.

## 🏗️ Arquitectura

- **Monorepo**: Turborepo + pnpm
- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript
- **UI**: Tailwind CSS + shadcn/ui + Radix
- **Backend**: AWS Lambda (Node 20) + API Gateway
- **Base de datos**: DynamoDB (single-table design)
- **Storage**: S3 (assets + páginas públicas)
- **Auth**: NextAuth + Cognito
- **Infraestructura**: AWS CDK
- **CI/CD**: GitHub Actions + OIDC

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 20+
- pnpm 9+
- AWS CLI configurado
- AWS CDK instalado globalmente

```bash
# Instalar CDK globalmente
npm install -g aws-cdk
```

### Instalación

```bash
# Clonar repositorio
git clone git@github.com:jdmlcloud/MerchConnectMexico.git
cd MerchConnectMexico

# Instalar dependencias
pnpm install

# Compilar todo
pnpm build
```

### Desarrollo Local

```bash
# Levantar servidor de desarrollo
cd apps/web
NEXT_PUBLIC_STAGE=dev NEXTAUTH_SECRET=dev-secret-only NEXTAUTH_URL=http://localhost:3000 API_BASE_URL=http://localhost:3000/api/v1 COGNITO_USER_POOL_ID=dummy COGNITO_CLIENT_ID=dummy pnpm dev
```

Visita http://localhost:3000 y usa las credenciales de desarrollo:
- Email: `admin@demo.com`
- Org ID: `demo-org`
- Tipo: `provider`

## 🔧 Configuración AWS

### 1. Configurar Roles OIDC y Budgets

```bash
# Ejecutar setup completo de AWS
pnpm aws:setup

# O por partes:
pnpm aws:setup roles     # Solo roles OIDC
pnpm aws:setup budgets   # Solo budgets
```

### 2. Actualizar Workflows

Después del setup, actualiza los ARNs en `.github/workflows/*.yml`:

```yaml
# Reemplazar estos placeholders:
TODO_ROLE_ARN_DEV  = arn:aws:iam::ACCOUNT:role/github-oidc-merchconnect-dev
TODO_ROLE_ARN_SBX  = arn:aws:iam::ACCOUNT:role/github-oidc-merchconnect-sbx
TODO_ROLE_ARN_PROD = arn:aws:iam::ACCOUNT:role/github-oidc-merchconnect-prod
```

## 🚀 Deploy

### Deploy Manual

```bash
# Deploy infraestructura
pnpm deploy infra dev    # Deploy a dev
pnpm deploy infra sbx    # Deploy a sbx
pnpm deploy infra prod   # Deploy a prod

# Deploy servicios (Lambdas)
pnpm deploy services dev

# Deploy web app
pnpm deploy web dev

# Deploy todo
pnpm deploy all dev
```

### Deploy Automático (GitHub Actions)

- **develop** → deploy a **dev**
- **sandbox** → deploy a **sbx**
- **main** → deploy a **prod**

```bash
# Hacer push para disparar deploy
git push origin develop  # Deploy a dev
git push origin sandbox  # Deploy a sbx
git push origin main     # Deploy a prod
```

## 📊 Datos de Prueba

```bash
# Crear datos de prueba en dev
STAGE=dev pnpm seed:dev
```

Esto crea:
- 2 organizaciones (OnPoint Workshop, Forpromo Solutions)
- 2 usuarios admin
- 2 páginas públicas
- 2 productos en inventario
- 1 RFQ de ejemplo
- 1 cotización de ejemplo

## 🌐 URLs por Stage

### Desarrollo (dev)
- Web: https://dev.app.merchconnect.com
- API: https://mc-dev-api.execute-api.us-east-1.amazonaws.com/v1

### Sandbox (sbx)
- Web: https://sbx.app.merchconnect.com
- API: https://mc-sbx-api.execute-api.us-east-1.amazonaws.com/v1

### Producción (prod)
- Web: https://app.merchconnect.com
- API: https://mc-prod-api.execute-api.us-east-1.amazonaws.com/v1

## 🏢 Estructura del Proyecto

```
merchconnect/
├── apps/
│   ├── web/                 # Next.js 14 app
│   └── services/            # Lambda functions
│       ├── common/          # Utilidades compartidas
│       ├── pages/           # Worker de páginas
│       ├── orgs/            # CRUD organizaciones
│       └── billing/         # Webhooks MercadoPago
├── packages/
│   ├── types/               # Tipos TypeScript + Zod
│   ├── features/            # Planes + feature flags
│   ├── data/                # Helpers DynamoDB
│   ├── storage/             # Helpers S3
│   └── auth/                # JWT + NextAuth
├── infra/
│   └── cdk/                 # Infraestructura AWS
├── scripts/
│   ├── aws-setup.sh         # Setup AWS (roles, budgets)
│   ├── deploy.sh            # Deploy por stage
│   └── seeds-dev.ts         # Datos de prueba
└── .github/workflows/       # CI/CD GitHub Actions
```

## 🔐 Seguridad

- **Aislamiento por stage**: Recursos etiquetados, políticas IAM restrictivas
- **Multi-tenant**: Aislamiento lógico por orgId en DynamoDB
- **OIDC**: Sin access keys, roles específicos por stage
- **CORS**: Dominios permitidos por stage
- **Runtime guards**: Validación de stage en runtime

## 📈 Monitoreo

- **Budgets**: Alertas al 70% y 90% por stage
- **CloudWatch**: Logs de Lambdas y API Gateway
- **DynamoDB**: PITR habilitado
- **S3**: Versioning + encryption

## 🛠️ Comandos Útiles

```bash
# Desarrollo
pnpm dev                    # Levantar todo en dev
pnpm build                  # Compilar todo
pnpm typecheck             # Verificar tipos
pnpm lint                  # Linter
pnpm format                # Formatear código

# Infraestructura
pnpm synth:infra           # Sintetizar CDK
pnpm deploy:infra:dev      # Deploy infra a dev
pnpm aws:setup             # Setup AWS completo

# Datos
pnpm seed:dev              # Crear datos de prueba
```

## 🎯 Funcionalidades MVP

- ✅ **Auth multi-tenant** con NextAuth + Cognito
- ✅ **Dashboards por rol** (Admin, Workshop, Proveedor)
- ✅ **Infraestructura AWS** completa por stage
- ✅ **CI/CD** con GitHub Actions + OIDC
- ✅ **UI moderna** con shadcn/ui
- 🔄 **APIs funcionales** (en desarrollo)
- 🔄 **Editor MDX** para páginas (en desarrollo)
- 🔄 **Flujo RFQ → Quote → Order** (en desarrollo)

## 📞 Soporte

Para dudas o problemas:
- Crear issue en GitHub
- Revisar logs en CloudWatch
- Verificar políticas IAM y tags de recursos

---

**Desarrollado con ❤️ para el ecosistema B2B de merchandise en México**
