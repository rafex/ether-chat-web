# AGENTS_BACKENDS.md

Especificación del contrato que debe cumplir cualquier backend para integrarse con **ether-chat-web**. Este documento está escrito para agentes de IA que implementen o validen un backend compatible.

---

## Resumen rápido

El frontend espera exactamente **dos endpoints HTTP** y un **formato de contenido opcional** para bloques de razonamiento interno. Todo lo demás es configurable vía variables de entorno.

| Endpoint | Método | Propósito |
|---|---|---|
| `/api/auth/login` | POST | Intercambia credenciales por un token de sesión |
| `/api/chat/message` | POST | Envía un mensaje y retorna la respuesta del agente |

---

## Configuración del frontend

El frontend se apunta al backend mediante variables de entorno definidas en `frontend/.env.local`. El agente que implemente el backend debe conocer estos valores:

| Variable | Por defecto | Descripción |
|---|---|---|
| `VITE_BACKEND_URL` | *(vacío)* | URL base del backend, p. ej. `http://localhost:8000` |
| `VITE_AUTH_ENDPOINT` | `/api/auth/login` | Ruta del endpoint de autenticación |
| `VITE_CHAT_ENDPOINT` | `/api/chat/message` | Ruta del endpoint de chat |
| `VITE_AUTH_REQUIRED` | `true` | Si es `false`, el frontend omite el login y llama al chat sin token |

Las rutas son relativas a `VITE_BACKEND_URL`. La URL final que llama el frontend es:

```
${VITE_BACKEND_URL}${VITE_AUTH_ENDPOINT}   →  http://localhost:8000/api/auth/login
${VITE_BACKEND_URL}${VITE_CHAT_ENDPOINT}   →  http://localhost:8000/api/chat/message
```

---

## CORS

El backend **debe** permitir solicitudes desde el origen del frontend (por defecto `http://localhost:5173` en desarrollo, o el dominio de producción).

El frontend envía las siguientes cabeceras en cada petición:

```
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>   ← solo cuando hay sesión activa
```

El backend debe incluir en sus respuestas:

```
Access-Control-Allow-Origin: <origen-del-frontend>
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Methods: POST, OPTIONS
```

---

## Timeouts

El frontend aplica timeouts mediante `AbortController`. El backend debe responder dentro de estos límites o la petición será abortada:

| Endpoint | Timeout |
|---|---|
| `/api/auth/login` | **10 segundos** |
| `/api/chat/message` | **30 segundos** |

Si el backend necesita más tiempo (p. ej. un modelo LLM lento), se debe implementar streaming o una arquitectura de polling con job ID.

---

## Endpoint 1 — Autenticación

### `POST /api/auth/login`

Solo es llamado cuando `VITE_AUTH_REQUIRED !== 'false'`.

**Request**

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Response 200 — éxito**

```json
{
  "token": "string",
  "expires_at": "2026-12-31T23:59:59Z",
  "user_id": "string"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `token` | string | **sí** | Token de sesión que el frontend incluirá como `Bearer` en cada mensaje |
| `expires_at` | ISO 8601 string | no | Si se incluye, el frontend invalida la sesión automáticamente al vencer |
| `user_id` | string | no | Identificador del usuario autenticado |

**Respuestas de error**

| Código | Cuándo |
|---|---|
| `400` | Falta `username` o `password` en el body |
| `401` | Credenciales incorrectas |
| `500` | Error interno del backend |

Formato de error (cualquier código >= 400):

```json
{ "error": "descripción del error" }
```

El frontend muestra el `error` directamente al usuario en el formulario de login.

---

## Endpoint 2 — Chat

### `POST /api/chat/message`

**Request**

```http
POST /api/chat/message
Content-Type: application/json
Authorization: Bearer <token>

{
  "message": "string",
  "conversation_id": "string"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `message` | string | **sí** | Texto del usuario |
| `conversation_id` | string | no | ID de conversación existente. Ausente en el primer mensaje. |

> **Nota sobre autenticación**: si el frontend se configuró con `VITE_AUTH_REQUIRED=false`, el header `Authorization` no se envía. El backend debe aceptar peticiones sin ese header en ese caso.

**Response 200 — éxito**

```json
{
  "content": "string",
  "conversation_id": "string"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `content` | string | **sí** | Respuesta del agente. Puede contener bloques `<tinker>` (ver sección siguiente). |
| `conversation_id` | string | **sí** | El backend lo genera en el primer turno y el frontend lo reenvía en turnos posteriores para mantener contexto. |

**Respuestas de error**

| Código | Cuándo |
|---|---|
| `400` | Falta el campo `message` |
| `401` | Token ausente o inválido (solo cuando se requiere autenticación) |
| `500` | Error interno del backend o del modelo |

Formato de error:

```json
{ "error": "descripción del error" }
```

El frontend muestra el estado `error` en el indicador de escritura cuando recibe un código >= 400.

---

## Formato del campo `content` — bloques `<tinker>`

El campo `content` de la respuesta del chat es texto plano que el frontend renderiza directamente. Opcionalmente puede incluir uno o más bloques `<tinker>` para exponer razonamiento interno, pasos de ejecución, trazas o cualquier información técnica que no sea parte de la respuesta visible.

### Sintaxis

```
Texto visible para el usuario.

<tinker>
Contenido interno del agente: razonamiento, pasos, trazas, contexto.
Puede tener múltiples líneas.
</tinker>

Más texto visible.
```

### Reglas

- La etiqueta de apertura es exactamente `<tinker>` (minúsculas, sin atributos).
- La etiqueta de cierre es exactamente `</tinker>`.
- El contenido puede ser multilínea.
- Puede haber cero, uno o varios bloques por respuesta.
- Los bloques vacíos o que contienen solo espacios son ignorados por el frontend.

### Comportamiento según `VITE_TINKER_MODE`

| Valor | Comportamiento en el frontend |
|---|---|
| `hidden` (por defecto) | Los bloques `<tinker>` no se muestran |
| `visible` | Se muestran siempre expandidos |
| `expandable` | Se muestran como acordeones colapsables |

El backend no necesita conocer el `VITE_TINKER_MODE`; simplemente incluye los bloques en el `content` y el frontend decide cómo renderizarlos.

### Ejemplo de respuesta completa

```json
{
  "content": "El precio del dólar hoy es $17.85 MXN.\n\n<tinker>\nHerramienta llamada: fx_rate_api\nParámetros: { \"from\": \"USD\", \"to\": \"MXN\" }\nRespuesta: { \"rate\": 17.85, \"timestamp\": \"2026-04-29T13:00:00Z\" }\n</tinker>\n\n¿Deseas convertir alguna cantidad?",
  "conversation_id": "conv_abc123"
}
```

---

## Flujo completo

### Con autenticación (`VITE_AUTH_REQUIRED=true`)

```
1. Usuario ingresa credenciales en el formulario de login.

2. Frontend → POST /api/auth/login
              Body: { username, password }

3. Backend  → 200 { token, expires_at?, user_id? }

4. Frontend almacena el token en localStorage.

5. Usuario escribe un mensaje.

6. Frontend → POST /api/chat/message
              Authorization: Bearer <token>
              Body: { message }

7. Backend  → 200 { content, conversation_id }

8. Frontend muestra la respuesta. Guarda conversation_id.

9. Usuario escribe otro mensaje.

10. Frontend → POST /api/chat/message
               Authorization: Bearer <token>
               Body: { message, conversation_id }

(El ciclo 9-10 se repite por cada turno de conversación.)
```

### Sin autenticación (`VITE_AUTH_REQUIRED=false`)

```
1. Frontend navega directo al chat (sin mostrar login).

2. Usuario escribe un mensaje.

3. Frontend → POST /api/chat/message
              Body: { message }       ← sin Authorization header

4. Backend  → 200 { content, conversation_id }

(El ciclo continúa igual que en el caso autenticado pero sin header.)
```

### Con JWT externo (SSO / OAuth)

El frontend también acepta un token inyectado vía query param `?token=<jwt>`:

```
https://chat.example.com/chat?token=eyJhb...
```

El frontend extrae el token, lo guarda y limpia el parámetro de la URL. A partir de ese punto el flujo es idéntico al caso autenticado. El backend no necesita implementar nada especial para este modo; solo debe validar el JWT en `/api/chat/message`.

---

## Notas de desarrollo — CSP en el servidor Vite

Al ejecutar `npm run dev`, Vite sirve el frontend con un header `Content-Security-Policy`. La directiva `connect-src` controla los orígenes a los que el frontend puede hacer `fetch`.

**Problema**: si el backend corre en un puerto distinto al 5173 (p. ej. `:8080`), la URL `http://localhost:8080` no coincide con `'self'` ni con `https:`, por lo que el navegador bloquea las peticiones.

**Solución aplicada** en `vite.config.ts`:

```
connect-src 'self' http://localhost:* ws://localhost:* wss: https:
```

Esto permite cualquier puerto de localhost en desarrollo. El header de producción (en `index.html`) no incluye `http://localhost:*` porque en producción el backend real debe servirse por HTTPS.

Si se prefiere evitar por completo los problemas de CORS y CSP durante el desarrollo, se puede usar el proxy de Vite en lugar de `VITE_BACKEND_URL`:

```ts
// vite.config.ts — alternativa con proxy
server: {
  proxy: {
    '/api': 'http://localhost:8080',
    '/health': 'http://localhost:8080',
  }
}
```

Con el proxy, el frontend llama a `/api/...` en el mismo origen (`:5173`) y Vite lo reenvía al backend. No se necesita `VITE_BACKEND_URL` ni configuración de CORS en el backend para desarrollo.

---

## Health check (opcional pero recomendado)

```http
GET /health

Response 200
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-04-29T13:00:00Z"
}
```

El frontend no llama este endpoint actualmente, pero es útil para liveness probes en contenedores y para diagnóstico en desarrollo.

---

## Referencia de implementación

El directorio `backend/` contiene un servidor mock en Node.js + Express que implementa exactamente este contrato y puede usarse como referencia de implementación:

```
backend/
└── src/
    └── index.ts   ← implementación de referencia (mock)
```

Para iniciarlo:

```bash
cd backend
npm install
npm run dev        # escucha en http://localhost:8000
```

> Este mock usa credenciales públicas (`demo`/`password123`, `user`/`user123`) y almacenamiento en memoria. Es únicamente para desarrollo local.

---

## Checklist de validación para el agente

Un backend es compatible con este frontend si cumple todos los puntos marcados:

- [ ] `POST /api/auth/login` devuelve `{ "token": "..." }` en respuesta 200
- [ ] `POST /api/chat/message` devuelve `{ "content": "...", "conversation_id": "..." }` en respuesta 200
- [ ] El backend acepta `Authorization: Bearer <token>` y lo valida
- [ ] El backend acepta peticiones sin `Authorization` cuando se opera en modo público
- [ ] El backend propaga el `conversation_id` entre turnos
- [ ] Las respuestas de error usan el formato `{ "error": "..." }`
- [ ] CORS está configurado para el origen del frontend
- [ ] El endpoint de autenticación responde en menos de **10 segundos**
- [ ] El endpoint de chat responde en menos de **30 segundos**
- [ ] Los bloques `<tinker>` en `content` usan la sintaxis `<tinker>...</tinker>` correcta (si se usan)
