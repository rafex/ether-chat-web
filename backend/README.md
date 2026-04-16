# Backend Mock - ether-chat-web

## ⚠️ ADVERTENCIA IMPORTANTE

**Este es un backend simulado (mock) exclusivamente para desarrollo y demostración.**
**NO debe usarse en entornos de producción.**

## Propósito

Este backend mock tiene como objetivo permitir el desarrollo frontend de la aplicación `ether-chat-web` sin necesidad de implementar un backend real. Proporciona autenticación simulada y respuestas de chat predefinidas.

## Características

### Lo que SÍ hace:
- ✅ Simula autenticación básica con usuarios predefinidos
- ✅ Genera tokens mock (base64, no criptográficamente seguros)
- ✅ Proporciona respuestas de chat predefinidas con formato `<tinker>`
- ✅ Mantiene sesiones y conversaciones en memoria
- ✅ Permite desarrollo frontend sin dependencias externas

### Lo que NO hace (y por qué es un mock):
- ❌ **No tiene seguridad real** - Las credenciales son públicas
- ❌ **No usa base de datos** - Todo está en memoria
- ❌ **No tiene lógica de negocio real** - Las respuestas son predefinidas
- ❌ **No es para producción** - Solo para desarrollo local

## Credenciales de Desarrollo

| Usuario | Contraseña | Propósito |
|---------|------------|-----------|
| `demo` | `password123` | Usuario principal de demostración |
| `user` | `user123` | Usuario alternativo |

**⚠️ NOTA:** Estas credenciales son públicas, conocidas y no representan seguridad real.

## Uso Rápido

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# El servidor se iniciará en http://localhost:8000
```

## Endpoints

- `POST /api/auth/login` - Autenticación simulada
- `POST /api/chat/message` - Chat AI simulado  
- `GET /health` - Health check

## Documentación Completa

Ver documentación detallada en [`docs/mock-backend.md`](../docs/mock-backend.md).

---
**Última actualización:** Abril 2026  
**Versión mock:** 0.1.0-mock  
**Estado:** Solo desarrollo
