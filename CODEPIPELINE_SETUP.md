# 🚀 **AWS CodePipeline Setup para MerchConnect México**

**Fecha**: 12 de Septiembre, 2025  
**Estado**: ✅ **CONFIGURADO**  
**Tipo**: CI/CD con AWS CodePipeline + CodeBuild

---

## 📋 **ARQUITECTURA DE CI/CD**

### **Componentes**
- **GitHub**: Repositorio de código fuente
- **AWS CodePipeline**: Orquestador de CI/CD
- **AWS CodeBuild**: Servicio de build
- **AWS S3**: Almacenamiento de artifacts
- **AWS Lambda**: Deploy de funciones
- **AWS CloudFront**: Deploy de assets estáticos

### **Flujo de Pipeline**
```
GitHub Push → CodePipeline → CodeBuild → Deploy
     ↓              ↓           ↓         ↓
  Source        Build      Artifacts   Lambda/S3
```

---

## 🛠️ **CONFIGURACIÓN INICIAL**

### **1. Configurar Token de GitHub**
```bash
# Obtener token de GitHub:
# 1. Ve a https://github.com/settings/tokens
# 2. Genera un token con permisos 'repo' y 'admin:repo_hook'
# 3. Ejecuta:

./scripts/setup-github-secret.sh <tu_github_token>
```

### **2. Desplegar Infraestructura con Pipeline**
```bash
# Para desarrollo
pnpm deploy:pipeline:dev

# Para sandbox
pnpm deploy:pipeline:sbx

# Para producción
pnpm deploy:pipeline:prod
```

### **3. Configurar Webhooks (Opcional)**
```bash
# Configurar webhooks para activación automática
./scripts/setup-github-webhooks.sh sbx
```

---

## 🎯 **PIPELINES POR AMBIENTE**

### **Development (dev)**
- **Rama**: `develop`
- **Pipeline**: `merchconnect-dev-pipeline`
- **URL**: https://dev.merchconnectmexico.com

### **Sandbox (sbx)**
- **Rama**: `sandbox`
- **Pipeline**: `merchconnect-sbx-pipeline`
- **URL**: https://sbx.merchconnectmexico.com

### **Production (prod)**
- **Rama**: `main`
- **Pipeline**: `merchconnect-prod-pipeline`
- **URL**: https://merchconnectmexico.com

---

## 🔧 **CONFIGURACIÓN DETALLADA**

### **CodeBuild Project**
```yaml
Environment:
  - Build Image: aws/codebuild/amazonlinux2-x86_64-standard:7.0
  - Compute Type: BUILD_GENERAL1_LARGE
  - Privileged: true
  - Node.js: 20
  - pnpm: 9.6.0

Build Spec:
  - Install dependencies (--frozen-lockfile)
  - Build packages
  - Build web application
  - Build services
  - Upload artifacts to S3
```

### **Pipeline Stages**
1. **Source**: GitHub webhook trigger
2. **Build**: CodeBuild project execution
3. **Deploy**: S3 + Lambda deployment

### **Artifacts**
- **S3 Bucket**: `merchconnect-{stage}-artifacts-{account}`
- **Web Assets**: `web/{stage}/`
- **Lambda Functions**: `functions/{stage}/`

---

## 📊 **MONITOREO Y LOGS**

### **CodePipeline Console**
- **URL**: https://console.aws.amazon.com/codesuite/codepipeline/pipelines
- **Funciones**: Ver estado del pipeline, re-ejecutar builds

### **CodeBuild Console**
- **URL**: https://console.aws.amazon.com/codesuite/codebuild/projects
- **Funciones**: Ver logs de build, configurar notificaciones

### **CloudWatch Logs**
- **Log Group**: `/aws/codebuild/merchconnect-{stage}-build`
- **Retención**: 30 días

---

## 🚀 **ACTIVACIÓN DEL PIPELINE**

### **Método 1: Push a GitHub**
```bash
# Para development
git checkout develop
git add .
git commit -m "feat: nueva funcionalidad"
git push origin develop

# Para sandbox
git checkout sandbox
git add .
git commit -m "feat: nueva funcionalidad"
git push origin sandbox

# Para production
git checkout main
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

### **Método 2: Ejecución Manual**
1. Ve a CodePipeline Console
2. Selecciona el pipeline correspondiente
3. Haz clic en "Release change"

---

## 🔍 **TROUBLESHOOTING**

### **Error: Token de GitHub inválido**
```bash
# Verificar que el secret existe
aws secretsmanager describe-secret --secret-id github-token

# Actualizar el token
./scripts/setup-github-secret.sh <nuevo_token>
```

### **Error: Pipeline no se activa**
```bash
# Verificar webhooks
./scripts/setup-github-webhooks.sh <stage>

# Verificar permisos de GitHub
# El token debe tener permisos 'repo' y 'admin:repo_hook'
```

### **Error: Build falla**
1. Revisar logs en CodeBuild Console
2. Verificar que `pnpm-lock.yaml` existe
3. Verificar que todos los scripts de build están definidos

### **Error: Deploy falla**
1. Verificar permisos de IAM para CodeBuild
2. Verificar que los recursos de destino existen
3. Revisar logs de CloudWatch

---

## 📈 **OPTIMIZACIONES**

### **Cache de Dependencias**
- **pnpm store**: Cacheado en S3
- **node_modules**: Cacheado entre builds
- **Tiempo de build**: ~5-8 minutos

### **Build Paralelo**
- **Packages**: Construidos en paralelo
- **Web + Services**: Construidos secuencialmente
- **Artifacts**: Subidos en paralelo

### **Notificaciones**
- **SNS**: Configurar notificaciones de fallo
- **Slack**: Integración opcional
- **Email**: Notificaciones por defecto

---

## 🎯 **VENTAJAS SOBRE GITHUB ACTIONS**

### **✅ Integración AWS**
- **Nativo**: Mejor integración con servicios AWS
- **Permisos**: IAM roles más granulares
- **Costo**: Más económico para builds largos

### **✅ Escalabilidad**
- **Compute**: Instancias más grandes disponibles
- **Paralelo**: Múltiples builds simultáneos
- **Cache**: Cache persistente entre builds

### **✅ Monitoreo**
- **CloudWatch**: Logs centralizados
- **Métricas**: Dashboards personalizados
- **Alertas**: Notificaciones automáticas

---

## 🔗 **ENLACES ÚTILES**

- **CodePipeline Console**: https://console.aws.amazon.com/codesuite/codepipeline/pipelines
- **CodeBuild Console**: https://console.aws.amazon.com/codesuite/codebuild/projects
- **CloudWatch Logs**: https://console.aws.amazon.com/cloudwatch/home#logsV2:
- **S3 Artifacts**: https://console.aws.amazon.com/s3/

---

## 🎉 **RESULTADO FINAL**

**✅ CI/CD COMPLETAMENTE CONFIGURADO**

- **3 Pipelines** (dev, sbx, prod)
- **Build automático** en cada push
- **Deploy automático** a AWS
- **Monitoreo completo** con CloudWatch
- **Cache optimizado** para builds rápidos

**¡MerchConnect México está listo para CI/CD profesional con AWS!** 🚀
