# MerchConnect México - Configuración de Ramas Git

## 🌿 **ESTRUCTURA DE RAMAS**

### **Ramas Configuradas:**

| Rama | Entorno | Default | URL Frontend | URL API |
|------|---------|---------|--------------|---------|
| **`main`** | Producción | `prod` | `https://merchconnectmexico.com` | `https://api.merchconnectmexico.com/v1` |
| **`production`** | Producción | `prod` | `https://merchconnectmexico.com` | `https://api.merchconnectmexico.com/v1` |
| **`sandbox`** | Sandbox | `sbx` | `https://sbx.merchconnectmexico.com` | `https://api-sbx.merchconnectmexico.com/v1` |
| **`develop`** | Desarrollo | `dev` | `https://dev.merchconnectmexico.com` | `https://api-dev.merchconnectmexico.com/v1` |

## 🔧 **CONFIGURACIÓN POR RAMA**

### **1. Rama `main` / `production`**
- **Entorno por defecto**: Producción
- **Configuración**: `production-config.env`
- **Uso**: Despliegue de producción
- **Características**:
  - Apunta automáticamente a APIs de producción
  - Base de datos: `MerchConnect-prod`
  - Dominio: `merchconnectmexico.com`

### **2. Rama `sandbox`**
- **Entorno por defecto**: Sandbox
- **Configuración**: `aws-resources-sbx.env`
- **Uso**: Pruebas y validación antes de producción
- **Características**:
  - Apunta automáticamente a APIs de sandbox
  - Base de datos: `MerchConnect-sbx`
  - Dominio: `sbx.merchconnectmexico.com`

### **3. Rama `develop`**
- **Entorno por defecto**: Desarrollo
- **Configuración**: `development-config.env`
- **Uso**: Desarrollo y pruebas locales
- **Características**:
  - Apunta automáticamente a APIs de desarrollo
  - Base de datos: `MerchConnect-dev`
  - Dominio: `dev.merchconnectmexico.com`
  - Localhost: `http://localhost:3000`

## 🚀 **FLUJO DE TRABAJO**

### **Desarrollo:**
```bash
git checkout develop
npm run dev
# Desarrolla en entorno de desarrollo
```

### **Pruebas:**
```bash
git checkout sandbox
npm run dev
# Prueba en entorno de sandbox
```

### **Producción:**
```bash
git checkout production
npm run build
npm run start
# Despliega en entorno de producción
```

## 🔄 **DETECCIÓN AUTOMÁTICA**

### **Sistema Inteligente:**
El sistema detecta automáticamente el entorno basado en:

1. **Dominio actual**:
   - `merchconnectmexico.com` → Producción
   - `sbx.merchconnectmexico.com` → Sandbox
   - `dev.merchconnectmexico.com` → Desarrollo

2. **Variables de entorno**:
   - `NEXT_PUBLIC_STAGE=prod` → Producción
   - `NEXT_PUBLIC_STAGE=sbx` → Sandbox
   - `NEXT_PUBLIC_STAGE=dev` → Desarrollo

3. **Fallback por rama**:
   - Rama `production` → Producción
   - Rama `sandbox` → Sandbox
   - Rama `develop` → Desarrollo

## 📁 **ARCHIVOS DE CONFIGURACIÓN**

### **Por Entorno:**
- `production-config.env` - Configuración de producción
- `aws-resources-sbx.env` - Configuración de sandbox
- `development-config.env` - Configuración de desarrollo

### **Comunes:**
- `apps/admin/lib/config.ts` - Configuración dinámica del admin
- `apps/web/lib/config.ts` - Configuración dinámica del web
- `domain-config.env` - Configuración de dominios

## 🎯 **VENTAJAS DE ESTA CONFIGURACIÓN**

### **✅ Aislamiento Completo:**
- Cada rama tiene su entorno específico
- No hay conflictos entre entornos
- Configuración automática por rama

### **✅ Desarrollo Seguro:**
- Cambios en `develop` no afectan producción
- Pruebas en `sandbox` antes de producción
- Despliegue controlado desde `production`

### **✅ Detección Inteligente:**
- El sistema se adapta automáticamente
- No requiere configuración manual
- Funciona en cualquier entorno

### **✅ Escalabilidad:**
- Fácil agregar nuevos entornos
- Configuración centralizada
- Mantenimiento simplificado

## 🔧 **COMANDOS ÚTILES**

### **Cambiar de Rama:**
```bash
git checkout develop    # Cambiar a desarrollo
git checkout sandbox    # Cambiar a sandbox
git checkout production # Cambiar a producción
```

### **Ver Configuración Actual:**
```bash
# En el navegador, revisar el indicador de entorno
# En la esquina superior izquierda
```

### **Forzar Entorno Específico:**
```bash
# En localhost, usar el selector de entorno
# En la esquina superior derecha
```

## 📋 **CHECKLIST DE DESPLIEGUE**

### **Antes de Desplegar:**
- [ ] Verificar que estás en la rama correcta
- [ ] Confirmar que el entorno es el correcto
- [ ] Probar funcionalidad en sandbox
- [ ] Verificar configuración de APIs

### **Después de Desplegar:**
- [ ] Verificar que el dominio funciona
- [ ] Probar APIs del entorno
- [ ] Confirmar que la base de datos es correcta
- [ ] Verificar indicadores visuales

## 🏆 **RESUMEN**

**Las ramas están configuradas para:**
- ✅ **Desarrollo seguro** en `develop`
- ✅ **Pruebas controladas** en `sandbox`
- ✅ **Producción estable** en `production`
- ✅ **Detección automática** de entorno
- ✅ **Configuración dinámica** por rama

**¡El sistema está listo para desarrollo multi-entorno!** 🚀
