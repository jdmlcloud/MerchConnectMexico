# 🏗️ MerchConnect México - Infraestructura AWS

## 📋 **Resumen de la Infraestructura**

Este documento describe la infraestructura completa que se desplegará en AWS para MerchConnect México, un marketplace B2B multi-tenant con sistema de Feature Flags.

## 🎯 **Arquitectura General**

### **3 Ambientes Aislados**
- **`dev`** - Desarrollo
- **`sbx`** - Sandbox/Staging  
- **`prod`** - Producción

### **Región Principal**
- **`us-east-1`** (N. Virginia)

## 🗄️ **Base de Datos**

### **DynamoDB - Single Table Design**
- **Tabla**: `MerchConnect-{stage}`
- **PITR**: Habilitado para recuperación de datos
- **Encripción**: AES-256
- **Modelo**: Single-table con GSI1 para consultas complejas

#### **Entidades Principales**
```
PK (Partition Key)          SK (Sort Key)           GSI1PK        GSI1SK
ORG#{orgId}                 METADATA                ORG           {orgId}
ORG#{orgId}                 USER#{userId}           USER          {orgId}#{userId}
ORG#{orgId}                 PLAN#{planId}           PLAN          {orgId}#{planId}
ORG#{orgId}                 FEATURE#{featureId}     FEATURE       {orgId}#{featureId}
ORG#{orgId}                 PAGE#{pageId}           PAGE          {orgId}#{pageId}
ORG#{orgId}                 INVENTORY#{itemId}      INVENTORY     {orgId}#{itemId}
ORG#{orgId}                 RFQ#{rfqId}             RFQ           {orgId}#{rfqId}
ORG#{orgId}                 QUOTE#{quoteId}         QUOTE         {orgId}#{quoteId}
ORG#{orgId}                 ORDER#{orderId}         ORDER         {orgId}#{orderId}
ORG#{orgId}                 AUDIT#{timestamp}       AUDIT         {orgId}#{timestamp}
```

## 🔐 **Autenticación y Autorización**

### **Amazon Cognito**
- **User Pool**: `mc-{stage}-users`
- **App Client**: Configurado para NextAuth.js
- **JWT Claims**: `{stage, orgId, orgType, plan, features[], roles[], perms[]}`
- **MFA**: Opcional por ambiente

### **IAM Roles y Políticas**
- **OIDC Identity Provider**: Para GitHub Actions
- **Roles por ambiente**: `MerchConnect-GitHubActions-{stage}`
- **Políticas con tags**: `App=MerchConnect`, `Stage={stage}`, `Owner=Jahaziel`

## 🌐 **API Gateway**

### **HTTP API Gateway**
- **Nombre**: `mc-{stage}-api`
- **Stage**: `/v1`
- **CORS**: Configurado por dominio
- **Rate Limiting**: Básico implementado
- **Logging**: CloudWatch habilitado

### **Endpoints Principales**
```
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
GET    /api/v1/orgs/{orgId}
PUT    /api/v1/orgs/{orgId}
GET    /api/v1/features
POST   /api/v1/features
PUT    /api/v1/features/{featureId}
GET    /api/v1/pages/{orgId}/{slug}
POST   /api/v1/pages/{orgId}/{slug}/publish
GET    /api/v1/inventory/{orgId}
POST   /api/v1/inventory/{orgId}
GET    /api/v1/rfq/{orgId}
POST   /api/v1/rfq/{orgId}
GET    /api/v1/quotes/{orgId}
POST   /api/v1/quotes/{orgId}
GET    /api/v1/orders/{orgId}
POST   /api/v1/orders/{orgId}
POST   /api/v1/payments/mercadopago/webhook
```

## ⚡ **Lambda Functions**

### **Arquitectura por Dominio**
- **Auth Service**: Autenticación y autorización
- **Org Service**: Gestión de organizaciones
- **Feature Service**: Sistema de Feature Flags
- **Page Service**: Gestión de páginas editables
- **Inventory Service**: Gestión de inventario
- **RFQ Service**: Solicitudes de cotización
- **Quote Service**: Gestión de cotizaciones
- **Order Service**: Gestión de órdenes
- **Payment Service**: Integración con MercadoPago

### **Configuración Lambda**
- **Runtime**: Node.js 20
- **Memory**: 512MB (configurable)
- **Timeout**: 30 segundos
- **Environment Variables**: Por ambiente
- **VPC**: No (serverless)

## 📦 **Almacenamiento**

### **Amazon S3 Buckets**

#### **Assets Bucket**
- **Nombre**: `mc-{stage}-assets`
- **Propósito**: Archivos privados de organizaciones
- **Estructura**: `s3://mc-{stage}-assets/orgs/{orgId}/...`
- **Encripción**: AES-256
- **Versionado**: Habilitado
- **Lifecycle**: Configurado

#### **Public Bucket**
- **Nombre**: `mc-{stage}-public`
- **Propósito**: Páginas públicas y assets estáticos
- **Estructura**: `s3://mc-{stage}-public/orgs/{orgId}/pages/...`
- **Encripción**: AES-256
- **Versionado**: Habilitado

### **CloudFront Distribution**
- **Origen**: S3 Public Bucket
- **Caching**: Configurado para assets estáticos
- **HTTPS**: Forzado
- **Custom Domains**: Por ambiente

## 📨 **Procesamiento Asíncrono**

### **Amazon SQS**
- **Queue**: `mc-{stage}-pages-publish`
- **DLQ**: `mc-{stage}-pages-publish-dlq`
- **Visibility Timeout**: 30 segundos
- **Message Retention**: 14 días

### **Lambda Triggers**
- **Page Publisher**: Procesa páginas MDX → HTML
- **S3 Revalidation**: Actualiza CloudFront cache

## 📊 **Monitoreo y Logging**

### **CloudWatch**
- **Log Groups**: Por Lambda function
- **Metrics**: Custom metrics para Feature Flags
- **Alarms**: Configurados por ambiente
- **Dashboards**: Por ambiente

### **AWS Budgets**
- **Por Tag**: `Stage={stage}`
- **Límites**: $100/mes por ambiente
- **Alertas**: 80% y 100% del presupuesto

## 🔒 **Seguridad**

### **Encriptación**
- **En Tránsito**: TLS 1.2+
- **En Reposo**: AES-256
- **DynamoDB**: Encriptado por defecto
- **S3**: Encriptado por defecto

### **Red**
- **VPC**: No requerido (serverless)
- **Security Groups**: N/A
- **NACLs**: N/A

### **Acceso**
- **IAM**: Principio de menor privilegio
- **Cognito**: MFA opcional
- **API Gateway**: Rate limiting
- **CORS**: Configurado por dominio

## 🚀 **CI/CD**

### **GitHub Actions**
- **OIDC**: Autenticación sin credenciales estáticas
- **Ambientes**: `develop` → `dev`, `sandbox` → `sbx`, `main` → `prod`
- **Deploy**: Automático por branch
- **Tests**: Unit tests y linting

### **Roles IAM para GitHub**
- **`MerchConnect-GitHubActions-dev`**
- **`MerchConnect-GitHubActions-sbx`**
- **`MerchConnect-GitHubActions-prod`**

## 💰 **Costos Estimados**

### **Desarrollo (dev)**
- **DynamoDB**: ~$5/mes
- **Lambda**: ~$2/mes
- **S3**: ~$1/mes
- **API Gateway**: ~$1/mes
- **Total**: ~$9/mes

### **Sandbox (sbx)**
- **DynamoDB**: ~$10/mes
- **Lambda**: ~$5/mes
- **S3**: ~$2/mes
- **API Gateway**: ~$3/mes
- **Total**: ~$20/mes

### **Producción (prod)**
- **DynamoDB**: ~$50/mes
- **Lambda**: ~$20/mes
- **S3**: ~$10/mes
- **API Gateway**: ~$15/mes
- **CloudFront**: ~$10/mes
- **Total**: ~$105/mes

## 🎯 **Próximos Pasos**

1. **Configurar AWS CLI** ✅
2. **Desplegar infraestructura** 🔄
3. **Configurar GitHub Actions**
4. **Desplegar aplicación web**
5. **Configurar dominios personalizados**
6. **Implementar monitoreo avanzado**

## 📝 **Comandos de Despliegue**

```bash
# Verificar dependencias
./scripts/check-dependencies.sh

# Configurar AWS CLI
./scripts/setup-aws.sh

# Desplegar infraestructura completa
./scripts/deploy-infrastructure.sh

# Verificar despliegue
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE
```

---

**Nota**: Esta infraestructura está diseñada para ser escalable, segura y cost-efectiva, siguiendo las mejores prácticas de AWS Well-Architected Framework.
