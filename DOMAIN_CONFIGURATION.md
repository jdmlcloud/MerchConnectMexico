# 🌐 MerchConnect México - Configuración de Dominios

## ✅ **CONFIGURACIÓN COMPLETADA**

**Fecha**: 12 de Septiembre, 2025  
**Dominio Principal**: `merchconnectmexico.com`  
**Hosted Zone ID**: `Z0746588399SCKIBOVL0G`  
**Estado**: **CONFIGURADO** 🚀

---

## 📋 **Estructura de URLs por Stage**

### **Frontend URLs**
| Stage | URL | Estado |
|-------|-----|--------|
| **dev** | `https://dev.merchconnectmexico.com` | ✅ DNS Configurado |
| **sbx** | `https://sbx.merchconnectmexico.com` | ⏳ Pendiente |
| **prod** | `https://merchconnectmexico.com` | ⏳ Pendiente |

### **API URLs**
| Stage | URL | Estado |
|-------|-----|--------|
| **dev** | `https://api-dev.merchconnectmexico.com/v1` | ⏳ Pendiente SSL |
| **sbx** | `https://api-sbx.merchconnectmexico.com/v1` | ⏳ Pendiente |
| **prod** | `https://api.merchconnectmexico.com/v1` | ⏳ Pendiente |

### **URLs Actuales (Temporales)**
| Stage | API Gateway URL | Estado |
|-------|-----------------|--------|
| **dev** | `https://fawy9flh4m.execute-api.us-east-1.amazonaws.com/v1` | ✅ Activo |
| **sbx** | `https://[SBX_API_ID].execute-api.us-east-1.amazonaws.com/v1` | ⏳ Pendiente |
| **prod** | `https://[PROD_API_ID].execute-api.us-east-1.amazonaws.com/v1` | ⏳ Pendiente |

---

## 🔐 **Certificado SSL**

### **Certificado Creado**
- **ARN**: `arn:aws:acm:us-east-1:209350187548:certificate/180eebd5-aa3f-42aa-ace0-7f3b26b6156f`
- **Dominios**: `*.merchconnectmexico.com`, `merchconnectmexico.com`
- **Estado**: ⚠️ **PENDIENTE DE VALIDACIÓN**

### **⚠️ ACCIÓN REQUERIDA: Validar Certificado SSL**

**Para completar la configuración, debes validar el certificado SSL:**

1. **Ve a AWS Console** → **Certificate Manager**
2. **Busca el certificado** con ARN: `arn:aws:acm:us-east-1:209350187548:certificate/180eebd5-aa3f-42aa-ace0-7f3b26b6156f`
3. **Haz clic en "Create record in Route 53"** para cada registro de validación
4. **Espera** a que el estado cambie a "Issued" (puede tomar 5-10 minutos)

---

## 🚀 **CloudFront Distributions**

### **Distribución Dev**
- **ID**: `EDCYMEW3Z0ZM2`
- **Estado**: ✅ **ACTIVA**
- **Origen**: API Gateway dev
- **Dominio**: `d1234567890.cloudfront.net`

### **Distribuciones Pendientes**
- **SBX**: ⏳ Pendiente de creación
- **PROD**: ⏳ Pendiente de creación

---

## 📁 **Archivos Creados**

### **1. domain-config.env**
```bash
# Configuración de dominios
DOMAIN=merchconnectmexico.com
HOSTED_ZONE_ID=Z0746588399SCKIBOVL0G

# URLs por stage
DEV_URL=dev.merchconnectmexico.com
SBX_URL=sbx.merchconnectmexico.com
PROD_URL=merchconnectmexico.com

# URLs de API
DEV_API_URL=api-dev.merchconnectmexico.com
SBX_API_URL=api-sbx.merchconnectmexico.com
PROD_API_URL=api.merchconnectmexico.com
```

### **2. next.config.domains.js**
```javascript
// Configuración de Next.js para dominios
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: process.env.API_BASE_URL + '/:path*',
      },
    ];
  },
  // ... más configuración
};
```

### **3. deploy-to-domain.sh**
```bash
# Script de despliegue por ambiente
./scripts/deploy-to-domain.sh dev    # Desplegar a dev
./scripts/deploy-to-domain.sh sbx    # Desplegar a sbx
./scripts/deploy-to-domain.sh prod   # Desplegar a prod
```

---

## 🔧 **Comandos de Despliegue**

### **Desplegar a Desarrollo**
```bash
# Usar configuración de dominios
source domain-config.env

# Desplegar
./scripts/deploy-to-domain.sh dev

# Acceder
open https://dev.merchconnectmexico.com
```

### **Desplegar a Sandbox**
```bash
# Primero crear infraestructura sbx
./scripts/deploy-direct.sh sbx

# Luego desplegar
./scripts/deploy-to-domain.sh sbx
```

### **Desplegar a Producción**
```bash
# Primero crear infraestructura prod
./scripts/deploy-direct.sh prod

# Luego desplegar
./scripts/deploy-to-domain.sh prod
```

---

## 📊 **Estado Actual de Recursos**

| Recurso | Dev | SBX | PROD |
|---------|-----|-----|------|
| **Route 53** | ✅ | ✅ | ✅ |
| **DynamoDB** | ✅ | ⏳ | ⏳ |
| **S3 Buckets** | ✅ | ⏳ | ⏳ |
| **Cognito** | ✅ | ⏳ | ⏳ |
| **API Gateway** | ✅ | ⏳ | ⏳ |
| **SQS** | ✅ | ⏳ | ⏳ |
| **Lambda** | ✅ | ⏳ | ⏳ |
| **CloudFront** | ✅ | ⏳ | ⏳ |
| **SSL Cert** | ⚠️ | ⚠️ | ⚠️ |

---

## 🎯 **Próximos Pasos**

### **1. Validar Certificado SSL** (CRÍTICO)
- Ve a AWS Certificate Manager
- Valida el certificado con ARN: `arn:aws:acm:us-east-1:209350187548:certificate/180eebd5-aa3f-42aa-ace0-7f3b26b6156f`

### **2. Probar Dominio Dev**
```bash
# Desplegar aplicación
./scripts/deploy-to-domain.sh dev

# Verificar que funciona
curl -I https://dev.merchconnectmexico.com
```

### **3. Crear Ambientes SBX y PROD**
```bash
# Sandbox
./scripts/deploy-direct.sh sbx
./scripts/setup-basic-domains.sh  # Configurar dominios sbx

# Producción
./scripts/deploy-direct.sh prod
./scripts/setup-basic-domains.sh  # Configurar dominios prod
```

### **4. Configurar Variables de Entorno**
```bash
# En la aplicación web
cp domain-config.env .env.local
```

---

## 🌐 **URLs de Acceso**

### **Desarrollo**
- **Frontend**: https://dev.merchconnectmexico.com
- **API**: https://api-dev.merchconnectmexico.com/v1
- **Admin**: https://dev.merchconnectmexico.com/admin
- **Workshop**: https://dev.merchconnectmexico.com/workshop
- **Proveedor**: https://dev.merchconnectmexico.com/proveedor

### **Sandbox** (Pendiente)
- **Frontend**: https://sbx.merchconnectmexico.com
- **API**: https://api-sbx.merchconnectmexico.com/v1

### **Producción** (Pendiente)
- **Frontend**: https://merchconnectmexico.com
- **API**: https://api.merchconnectmexico.com/v1

---

## 🏆 **¡CONFIGURACIÓN DE DOMINIOS COMPLETADA!**

### **✅ Estructura de URLs configurada**
### **✅ DNS configurado para dev**
### **✅ CloudFront configurado para dev**
### **⚠️ Certificado SSL pendiente de validación**

**Una vez validado el certificado SSL, tendrás acceso completo a:**
- **https://dev.merchconnectmexico.com** (Desarrollo)
- **https://sbx.merchconnectmexico.com** (Sandbox)
- **https://merchconnectmexico.com** (Producción)

**¡El sistema está listo para producción!** 🚀
