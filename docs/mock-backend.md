# Mock Backend - Desarrollo Local

## ⚠️ ADVERTENCIA: BACKEND SIMULADO

**Este es un backend simulado (mock) exclusivamente para desarrollo y demostración.**
**NO debe usarse en entornos de producción.**

El backend en `backend/` implementa el mismo contrato de API que espera el frontend,
pero **sin base de datos real, sin seguridad real y sin lógica de negocio real**.
Su único propósito es permitir el desarrollo frontend sin dependencias externas.

## Inicio rapido

```bash
just dev-mock
```

Levanta frontend y mock backend juntos:

| Servicio  | URL                       |
|-----------|---------------------------|
| Frontend  | http://localhost:5173     |
| Backend   | http://localhost:8000     |

## ⚠️ Credenciales de Desarrollo (Públicas)

| Usuario | Contraseña    | Propósito |
|---------|---------------|-----------|
| `demo`  | `password123` | Usuario principal de demostración |
| `user`  | `user123`     | Usuario alternativo |

**NOTA IMPORTANTE:** Estas credenciales son públicas, conocidas y no representan seguridad real.
Están hardcodeadas en el código y son solo para facilitar el desarrollo.

## Endpoints

| Metodo | Ruta                  | Descripcion                        |
|--------|-----------------------|------------------------------------|
| POST   | `/api/auth/login`     | Autentica y retorna token de sesion |
| POST   | `/api/chat/message`   | Procesa mensaje y retorna respuesta |
| GET    | `/health`             | Health check                        |

## ⚠️ Comportamiento del Mock

### Limitaciones y Advertencias:
- **Tokens inseguros:** Generados con `base64`, no criptográficamente seguros
- **Almacenamiento volátil:** Todo en memoria, se pierde al reiniciar
- **Respuestas predefinidas:** No es un modelo AI real, las respuestas son fijas
- **Sin seguridad:** No hay validación real, rate limiting, o protección

### Características del Mock:
- Tokens generados en memoria; se invalidan al reiniciar el proceso
- Conversaciones almacenadas en memoria; no persisten entre reinicios
- Las respuestas incluyen bloques `<tinker>` para probar los distintos modos de visualización del frontend (`hidden`, `visible`, `expandable`)
- Health check básico para verificar que el servidor está activo

## Ejecutar de forma independiente

```bash
cd backend
npm install
npm run dev
```

## Stack

- Node.js >= 22
- Express
- TypeScript
- tsx (transpilacion en desarrollo)

## Requerimientos

- Node.js >= 22
- Puerto 8000 disponible

Para cambiar el puerto:

```bash
PORT=3001 just dev-mock
```

## ⚠️ Limitaciones y Advertencias de Seguridad

### Problemas de Seguridad Conocidos:
1. **Credenciales hardcodeadas:** Las contraseñas están en texto plano en el código
2. **Tokens inseguros:** Usa `base64` en lugar de JWT firmado
3. **Sin validación:** No valida entradas más allá de checks básicos
4. **CORS abierto:** Acepta requests de cualquier origen
5. **Sin rate limiting:** Vulnerable a ataques de denegación de servicio

### Para Producción:
Si necesitas un backend real para producción, debes:
1. Reemplazar las credenciales hardcodeadas por autenticación real
2. Implementar JWT con firma criptográfica
3. Agregar una base de datos real (PostgreSQL, MongoDB, etc.)
4. Integrar con un modelo AI real (OpenAI, Anthropic, etc.)
5. Implementar validación de entrada, rate limiting y CORS restringido

## Estado del Mock

**Última actualización:** Abril 2026  
**Versión mock:** 0.1.0-mock  
**Propósito:** Exclusivamente desarrollo frontend  
**Producción:** ❌ NO APTO
