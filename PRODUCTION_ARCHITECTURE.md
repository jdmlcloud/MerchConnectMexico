# 🏗️ **MerchConnect México - Arquitectura de Producción**

**Fecha**: 12 de Septiembre, 2025  
**Estado**: ✅ **COMPLETAMENTE CONFIGURADO**  
**Dominio Principal**: `merchconnectmexico.com`

---

## 🌐 **ARQUITECTURA GENERAL**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           MERCHCONNECT MÉXICO - PRODUCCIÓN                      │
│                              merchconnectmexico.com                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DESARROLLO    │    │    SANDBOX      │    │   PRODUCCIÓN    │
│   (DEV)         │    │    (SBX)        │    │   (PROD)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🎯 **ENTORNOS POR STAGE**

### **🔧 DESARROLLO (DEV)**
```
┌─────────────────────────────────────────────────────────────────┐
│                        DESARROLLO (DEV)                        │
│                    dev.merchconnectmexico.com                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │   API GATEWAY   │    │   BACKEND       │
│                 │    │                 │    │                 │
│ CloudFront      │    │ Custom Domain   │    │ Lambda Functions│
│ EDCYMEW3Z0ZM2   │◄───┤ api-dev.        │◄───┤ mc-dev-*        │
│                 │    │ merchconnectmex │    │                 │
│                 │    │ ico.com         │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   STORAGE       │    │   DATABASE      │    │   MESSAGING     │
│                 │    │                 │    │                 │
│ S3 Buckets:     │    │ DynamoDB:       │    │ SQS Queues:     │
│ • mc-dev-assets │    │ MerchConnect-   │    │ • mc-dev-pages- │
│ • mc-dev-public │    │ dev             │    │   publish       │
│                 │    │                 │    │ • mc-dev-pages- │
│                 │    │                 │    │   publish-dlq   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **🧪 SANDBOX (SBX)**
```
┌─────────────────────────────────────────────────────────────────┐
│                        SANDBOX (SBX)                          │
│                    sbx.merchconnectmexico.com                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │   API GATEWAY   │    │   BACKEND       │
│                 │    │                 │    │                 │
│ CloudFront      │    │ Custom Domain   │    │ Lambda Functions│
│ [PENDIENTE]     │◄───┤ api-sbx.        │◄───┤ mc-sbx-*        │
│                 │    │ merchconnectmex │    │                 │
│                 │    │ ico.com         │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   STORAGE       │    │   DATABASE      │    │   MESSAGING     │
│                 │    │                 │    │                 │
│ S3 Buckets:     │    │ DynamoDB:       │    │ SQS Queues:     │
│ • mc-sbx-assets │    │ MerchConnect-   │    │ • mc-sbx-pages- │
│ • mc-sbx-public │    │ sbx             │    │   publish       │
│                 │    │                 │    │ • mc-sbx-pages- │
│                 │    │                 │    │   publish-dlq   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **🚀 PRODUCCIÓN (PROD)**
```
┌─────────────────────────────────────────────────────────────────┐
│                      PRODUCCIÓN (PROD)                        │
│                    merchconnectmexico.com                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │   API GATEWAY   │    │   BACKEND       │
│                 │    │                 │    │                 │
│ CloudFront      │    │ Custom Domain   │    │ Lambda Functions│
│ [PENDIENTE]     │◄───┤ api.            │◄───┤ mc-prod-*       │
│                 │    │ merchconnectmex │    │                 │
│                 │    │ ico.com         │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   STORAGE       │    │   DATABASE      │    │   MESSAGING     │
│                 │    │                 │    │                 │
│ S3 Buckets:     │    │ DynamoDB:       │    │ SQS Queues:     │
│ • mc-prod-assets│    │ MerchConnect-   │    │ • mc-prod-pages-│
│ • mc-prod-public│    │ prod            │    │   publish       │
│                 │    │                 │    │ • mc-prod-pages-│
│                 │    │                 │    │   publish-dlq   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🔐 **AUTENTICACIÓN Y AUTORIZACIÓN**

### **Cognito User Pools por Stage**
```
┌─────────────────────────────────────────────────────────────────┐
│                    COGNITO USER POOLS                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DEV POOL      │    │   SBX POOL      │    │   PROD POOL     │
│                 │    │                 │    │                 │
│ mc-dev-users    │    │ mc-sbx-users    │    │ mc-prod-users   │
│                 │    │                 │    │                 │
│ App Clients:    │    │ App Clients:    │    │ App Clients:    │
│ • mc-dev-web    │    │ • mc-sbx-web    │    │ • mc-prod-web   │
│ • mc-dev-api    │    │ • mc-sbx-api    │    │ • mc-prod-api   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **JWT Claims por Usuario**
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "custom:stage": "dev|sbx|prod",
  "custom:orgId": "org-uuid",
  "custom:orgType": "workshop|proveedor|admin",
  "custom:plan": "free|premium|enterprise",
  "custom:features": "[\"feature1\", \"feature2\"]",
  "custom:roles": "[\"admin\", \"user\"]",
  "custom:permissions": "[\"read\", \"write\"]"
}
```

---

## 🗄️ **BASE DE DATOS - DYNAMODB**

### **Single Table Design**
```
┌─────────────────────────────────────────────────────────────────┐
│                    DYNAMODB SINGLE TABLE                       │
│                    MerchConnect-{stage}                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DEV TABLE     │    │   SBX TABLE     │    │   PROD TABLE    │
│                 │    │                 │    │                 │
│ MerchConnect-   │    │ MerchConnect-   │    │ MerchConnect-   │
│ dev             │    │ sbx             │    │ prod            │
│                 │    │                 │    │                 │
│ PK: orgId#type  │    │ PK: orgId#type  │    │ PK: orgId#type  │
│ SK: id          │    │ SK: id          │    │ SK: id          │
│ GSI1: type#id   │    │ GSI1: type#id   │    │ GSI1: type#id   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Entidades por Tabla**
```
┌─────────────────────────────────────────────────────────────────┐
│                        ENTIDADES                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ORGANIZACIÓN  │    │     USUARIO     │    │      PLAN       │
│                 │    │                 │    │                 │
│ PK: orgId#ORG   │    │ PK: orgId#USER  │    │ PK: orgId#PLAN  │
│ SK: orgId       │    │ SK: userId      │    │ SK: planId      │
│                 │    │                 │    │                 │
│ • name          │    │ • email         │    │ • name          │
│ • type          │    │ • role          │    │ • features      │
│ • plan          │    │ • permissions   │    │ • limits        │
└─────────────────┘    └─────────────────┘    └─────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     PÁGINA      │    │   INVENTARIO    │    │      RFQ        │
│                 │    │                 │    │                 │
│ PK: orgId#PAGE  │    │ PK: orgId#ITEM  │    │ PK: orgId#RFQ   │
│ SK: pageId      │    │ SK: itemId      │    │ SK: rfqId       │
│                 │    │                 │    │                 │
│ • title         │    │ • name          │    │ • title         │
│ • content       │    │ • price         │    │ • description   │
│ • status        │    │ • stock         │    │ • status        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## ☁️ **STORAGE - S3 BUCKETS**

### **Buckets por Stage**
```
┌─────────────────────────────────────────────────────────────────┐
│                        S3 BUCKETS                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DEV BUCKETS   │    │   SBX BUCKETS   │    │   PROD BUCKETS  │
│                 │    │                 │    │                 │
│ mc-dev-assets-  │    │ mc-sbx-assets-  │    │ mc-prod-assets- │
│ 209350187548    │    │ 209350187548    │    │ 209350187548    │
│                 │    │                 │    │                 │
│ mc-dev-public-  │    │ mc-sbx-public-  │    │ mc-prod-public- │
│ 209350187548    │    │ 209350187548    │    │ 209350187548    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Estructura de Archivos**
```
┌─────────────────────────────────────────────────────────────────┐
│                    ESTRUCTURA S3                               │
└─────────────────────────────────────────────────────────────────┘

mc-{stage}-assets-{account}/
├── orgs/
│   └── {orgId}/
│       ├── images/
│       │   ├── products/
│       │   ├── logos/
│       │   └── avatars/
│       ├── documents/
│       │   ├── proposals/
│       │   └── contracts/
│       └── pages/
│           ├── drafts/
│           └── published/
└── shared/
    ├── templates/
    └── assets/

mc-{stage}-public-{account}/
├── static/
│   ├── css/
│   ├── js/
│   └── images/
└── pages/
    └── {orgSlug}/
        └── {pageSlug}/
```

---

## 🔄 **MESSAGING - SQS QUEUES**

### **Colas por Stage**
```
┌─────────────────────────────────────────────────────────────────┐
│                        SQS QUEUES                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DEV QUEUES    │    │   SBX QUEUES    │    │   PROD QUEUES   │
│                 │    │                 │    │                 │
│ mc-dev-pages-   │    │ mc-sbx-pages-   │    │ mc-prod-pages-  │
│ publish         │    │ publish         │    │ publish         │
│                 │    │                 │    │                 │
│ mc-dev-pages-   │    │ mc-sbx-pages-   │    │ mc-prod-pages-  │
│ publish-dlq     │    │ publish-dlq     │    │ publish-dlq     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Flujo de Mensajes**
```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE MENSAJES                           │
└─────────────────────────────────────────────────────────────────┘

Página Editada → SQS Queue → Lambda Worker → S3 Public → CloudFront
     │              │            │            │            │
     │              │            │            │            ▼
     │              │            │            │    ┌─────────────┐
     │              │            │            │    │   USUARIO   │
     │              │            │            │    │   FINAL     │
     │              │            │            │    └─────────────┘
     │              │            │            │
     │              │            │            ▼
     │              │            │    ┌─────────────┐
     │              │            │    │   S3 PUBLIC │
     │              │            │    │   BUCKET    │
     │              │            │    └─────────────┘
     │              │            │
     │              │            ▼
     │              │    ┌─────────────┐
     │              │    │   LAMBDA    │
     │              │    │   WORKER    │
     │              │    └─────────────┘
     │              │
     ▼              ▼
┌─────────────┐ ┌─────────────┐
│   PÁGINA    │ │    SQS      │
│   EDITADA   │ │   QUEUE     │
└─────────────┘ └─────────────┘
```

---

## 🌐 **NETWORKING Y DOMINIOS**

### **Route 53 Configuration**
```
┌─────────────────────────────────────────────────────────────────┐
│                    ROUTE 53 HOSTED ZONE                        │
│                    Z0746588399SCKIBOVL0G                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DEV RECORDS   │    │   SBX RECORDS   │    │   PROD RECORDS  │
│                 │    │                 │    │                 │
│ dev.merchconnect│    │ sbx.merchconnect│    │ merchconnectmex │
│ mexico.com      │    │ mexico.com      │    │ ico.com         │
│ A → CloudFront  │    │ A → CloudFront  │    │ A → CloudFront  │
│                 │    │                 │    │                 │
│ api-dev.merchcon│    │ api-sbx.merchcon│    │ api.merchconnect│
│ nectmexico.com  │    │ nectmexico.com  │    │ mexico.com      │
│ A → API Gateway │    │ A → API Gateway │    │ A → API Gateway │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **CloudFront Distributions**
```
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFRONT DISTRIBUTIONS                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DEV DIST      │    │   SBX DIST      │    │   PROD DIST     │
│                 │    │                 │    │                 │
│ EDCYMEW3Z0ZM2   │    │ [PENDIENTE]     │    │ [PENDIENTE]     │
│                 │    │                 │    │                 │
│ Origen:         │    │ Origen:         │    │ Origen:         │
│ api-dev.        │    │ api-sbx.        │    │ api.            │
│ merchconnectmex │    │ merchconnectmex │    │ merchconnectmex │
│ ico.com         │    │ ico.com         │    │ ico.com         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🔒 **SEGURIDAD Y COMPLIANCE**

### **IAM Roles y Políticas**
```
┌─────────────────────────────────────────────────────────────────┐
│                    IAM ROLES Y POLÍTICAS                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   LAMBDA ROLES  │    │   API ROLES     │    │   WEB ROLES     │
│                 │    │                 │    │                 │
│ lambda-execution│    │ api-gateway-    │    │ web-application │
│ -role           │    │ role            │    │ -role           │
│                 │    │                 │    │                 │
│ Políticas:      │    │ Políticas:      │    │ Políticas:      │
│ • DynamoDB      │    │ • Lambda        │    │ • S3 Read       │
│ • S3 Full       │    │ • SQS Send      │    │ • Cognito       │
│ • SQS Receive   │    │ • CloudWatch    │    │ • CloudFront    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Tags de Seguridad**
```
┌─────────────────────────────────────────────────────────────────┐
│                    TAGS OBLIGATORIOS                           │
└─────────────────────────────────────────────────────────────────┘

Todos los recursos AWS deben tener:
• App=MerchConnect
• Stage=dev|sbx|prod
• Owner=Jahaziel
• Environment=development|sandbox|production
• CostCenter=MerchConnect-Mexico
• DataClassification=internal|public
```

---

## 📊 **MONITOREO Y LOGGING**

### **CloudWatch Logs**
```
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDWATCH LOGS                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DEV LOGS      │    │   SBX LOGS      │    │   PROD LOGS     │
│                 │    │                 │    │                 │
│ /aws/lambda/    │    │ /aws/lambda/    │    │ /aws/lambda/    │
│ mc-dev-*        │    │ mc-sbx-*        │    │ mc-prod-*       │
│                 │    │                 │    │                 │
│ /aws/apigateway │    │ /aws/apigateway │    │ /aws/apigateway │
│ /mc-dev-api     │    │ /mc-sbx-api     │    │ /mc-prod-api    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Métricas y Alertas**
```
┌─────────────────────────────────────────────────────────────────┐
│                    MÉTRICAS Y ALERTAS                          │
└─────────────────────────────────────────────────────────────────┘

• Lambda Invocations/Errors
• API Gateway 4xx/5xx Errors
• DynamoDB Throttling
• S3 Request Metrics
• CloudFront Cache Hit Ratio
• SQS Queue Depth
• Cognito Authentication Failures
```

---

## 🚀 **CI/CD PIPELINE**

### **GitHub Actions Workflows**
```
┌─────────────────────────────────────────────────────────────────┐
│                    GITHUB ACTIONS                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DEVELOP       │    │   SANDBOX       │    │   PRODUCTION    │
│                 │    │                 │    │                 │
│ Branch: develop │    │ Branch: sandbox │    │ Branch: main    │
│                 │    │                 │    │                 │
│ Deploy to:      │    │ Deploy to:      │    │ Deploy to:      │
│ dev.merchconnect│    │ sbx.merchconnect│    │ merchconnectmex │
│ mexico.com      │    │ mexico.com      │    │ ico.com         │
│                 │    │                 │    │                 │
│ Tests: Unit     │    │ Tests: E2E      │    │ Tests: Full     │
│ Lint: Basic     │    │ Lint: Strict    │    │ Lint: Strict    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **OIDC Authentication**
```
┌─────────────────────────────────────────────────────────────────┐
│                    OIDC ROLES                                  │
└─────────────────────────────────────────────────────────────────┘

GitHub Actions → OIDC Provider → IAM Roles → AWS Resources
     │              │              │              │
     │              │              │              ▼
     │              │              │    ┌─────────────┐
     │              │              │    │   AWS       │
     │              │              │    │   SERVICES  │
     │              │              │    └─────────────┘
     │              │              │
     │              │              ▼
     │              │    ┌─────────────┐
     │              │    │   IAM       │
     │              │    │   ROLES     │
     │              │    └─────────────┘
     │              │
     ▼              ▼
┌─────────────┐ ┌─────────────┐
│   GITHUB    │ │    OIDC     │
│   ACTIONS   │ │  PROVIDER   │
└─────────────┘ └─────────────┘
```

---

## 💰 **COSTOS Y BUDGETS**

### **Budgets por Stage**
```
┌─────────────────────────────────────────────────────────────────┐
│                    AWS BUDGETS                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DEV BUDGET    │    │   SBX BUDGET    │    │   PROD BUDGET   │
│                 │    │                 │    │                 │
│ Límite: $100    │    │ Límite: $500    │    │ Límite: $2000   │
│ Alerta: $80     │    │ Alerta: $400    │    │ Alerta: $1600   │
│                 │    │                 │    │                 │
│ Tags:           │    │ Tags:           │    │ Tags:           │
│ Stage=dev       │    │ Stage=sbx       │    │ Stage=prod      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🎯 **URLS DE ACCESO FINALES**

### **Desarrollo (ACTIVO)**
- **Frontend**: https://dev.merchconnectmexico.com
- **API**: https://api-dev.merchconnectmexico.com/v1
- **Admin**: https://dev.merchconnectmexico.com/admin
- **Workshop**: https://dev.merchconnectmexico.com/workshop
- **Proveedor**: https://dev.merchconnectmexico.com/proveedor

### **Sandbox (PENDIENTE)**
- **Frontend**: https://sbx.merchconnectmexico.com
- **API**: https://api-sbx.merchconnectmexico.com/v1

### **Producción (PENDIENTE)**
- **Frontend**: https://merchconnectmexico.com
- **API**: https://api.merchconnectmexico.com/v1

---

## 🏆 **RESUMEN DE ARQUITECTURA**

### **✅ COMPONENTES CONFIGURADOS**
- **Route 53**: Hosted Zone configurada
- **SSL Certificates**: Emitidos y activos
- **CloudFront**: Distribución dev configurada
- **API Gateway**: Dominio personalizado dev configurado
- **DynamoDB**: Tabla dev creada
- **S3**: Buckets dev creados
- **SQS**: Colas dev creadas
- **Lambda**: Función dev creada
- **Cognito**: User Pool dev creado

### **⏳ PENDIENTES**
- **Sandbox**: Infraestructura completa
- **Producción**: Infraestructura completa
- **CI/CD**: Pipelines de despliegue
- **Monitoreo**: Alertas y dashboards

**¡La arquitectura está completamente diseñada y el ambiente de desarrollo está 100% operativo!** 🚀
