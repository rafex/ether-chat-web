# Backend Integration Guide

Cómo conectar el frontend con un backend real o usar el mock para desarrollo.

## Desarrollo rápido con Mock Backend

El proyecto incluye un mock backend en `backend/` listo para usar.

### Inicio rápido

```bash
just dev-mock
```

Esto levanta:
- ✅ Frontend en `http://localhost:5173`
- ✅ Mock backend en `http://localhost:8000`

**Credenciales demo:**
```
Username: demo
Password: password123

Username: user
Password: user123
```

## Conectar un Backend Real

### 1. API esperada por el frontend

El backend debe exponer dos endpoints:

#### POST /api/auth/login

Autentica el usuario y retorna un token JWT.

```
POST /api/auth/login
Content-Type: application/json

{
  "username": "user",
  "password": "pass123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

Response (401):
{
  "error": "Invalid credentials"
}
```

#### POST /api/chat/message

Procesa un mensaje de usuario y retorna la respuesta del agente.

```
POST /api/chat/message
Content-Type: application/json
Authorization: Bearer <token>

{
  "message": "¿Hola, cómo estás?",
  "conversation_id": "conv_12345"  // opcional, generado por backend si no existe
}

Response (200):
{
  "content": "Respuesta del agente aquí...",
  "conversation_id": "conv_12345"
}
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en `frontend/`:

```bash
# .env.local
VITE_BACKEND_URL=http://tu-backend.com
VITE_AUTH_ENDPOINT=/api/auth/login
VITE_CHAT_ENDPOINT=/api/chat/message
```

O establécelas antes de ejecutar:

```bash
VITE_BACKEND_URL=http://localhost:3000 just dev
```

### 3. Variables de entorno disponibles

| Variable | Defecto | Descripción |
|----------|---------|-------------|
| `VITE_BACKEND_URL` | `` (vacío) | URL base del backend |
| `VITE_AUTH_ENDPOINT` | `/api/auth/login` | Endpoint de autenticación |
| `VITE_CHAT_ENDPOINT` | `/api/chat/message` | Endpoint de mensajes |
| `VITE_WIDGET_POSITION` | `bottom-right` | Posición del widget: top-left, top-right, bottom-left, bottom-right |
| `VITE_WIDGET_MODE` | `floating` | Modo: floating o embedded |
| `VITE_TINKER_MODE` | `hidden` | Control de bloques tinker: hidden, visible, expandable |
| `VITE_COLOR_PRIMARY` | `#1a1a2e` | Color primario (hex) |
| `VITE_COLOR_ACCENT` | `#e94560` | Color de acento (hex) |
| `VITE_COLOR_SURFACE` | `#16213e` | Color de fondo (hex) |
| `VITE_COLOR_TEXT` | `#eaeaea` | Color de texto (hex) |

## Flujo de autenticación

```
┌──────────────┐
│  Usuario     │
└──────┬───────┘
       │ 1. Ingresa usuario/contraseña
       ▼
┌──────────────────────────────────────────────────┐
│ Frontend (LoginForm)                             │
│  POST /api/auth/login                           │
└──────────────────┬───────────────────────────────┘
                   │ 2. Envía credenciales
                   ▼
           ┌───────────────┐
           │ Tu Backend    │
           │ (auth)        │
           └───────┬───────┘
                   │ 3. Retorna token
                   ▼
┌──────────────────────────────────────────────────┐
│ Frontend (ConfigStore/SessionStore)              │
│ - Almacena token en sessionStorage               │
│ - Estado autenticado ✅                          │
└──────────────────────────────────────────────────┘
```

## Flujo de mensajes

```
┌──────────────┐
│  Usuario     │
│  escribe     │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ Frontend (Composer)                              │
│  POST /api/chat/message                         │
│  Authorization: Bearer <token>                  │
│  Body: { message, conversation_id }            │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
           ┌───────────────┐
           │ Tu Backend    │
           │ (chat)        │
           └───────┬───────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│ Frontend (ChatService)                           │
│ - Recibe respuesta                              │
│ - Parsea bloques <tinker>                       │
│ - Renderiza en MessageList                      │
└──────────────────────────────────────────────────┘
```

## Bloque tinker (contenido técnico)

El backend puede incluir bloques `<tinker>` para contenido técnico o razonamiento que el usuario puede ocultar/expandir:

```json
{
  "content": "Respuesta visible al usuario.\n\n<tinker>\nDetalles técnicos internos\nque el usuario puede ocultar\n</tinker>\n\nMás respuesta visible.",
  "conversation_id": "conv_12345"
}
```

El frontend parsea automáticamente estos bloques y los renderiza según `VITE_TINKER_MODE`:
- `hidden` - No se muestran
- `visible` - Se muestran directamente
- `expandable` - Se pueden expandir/contraer

## Ejemplo: Backend en Node.js

Usa el mock en `backend/` como referencia:

```bash
# Setup
cd backend
npm install
npm run dev
```

Archivo principal: [`backend/src/index.ts`](backend/src/index.ts)

## Ejemplo: Backend en Python (FastAPI)

```python
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])

class LoginRequest(BaseModel):
    username: str
    password: str

class MessageRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

@app.post("/api/auth/login")
async def login(req: LoginRequest):
    if req.username == "user" and req.password == "pass":
        return {"token": "mock_token_123"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/chat/message")
async def chat(req: MessageRequest, authorization: str = Header()):
    # Validate token from Authorization header
    token = authorization.replace("Bearer ", "")
    
    response = f"Respondiendo a: {req.message}"
    return {
        "content": response,
        "conversation_id": req.conversation_id or f"conv_{int(time.time())}"
    }
```

## Arquitectura del frontend

El frontend está diseñado para desacoplarse del protocolo de transporte:

- **`services/chat.service.ts`** - Orquestación de mensajes (agnóstica al transporte)
- **`transports/transport.interface.ts`** - Contrato que debe implementar cualquier transporte
- **`transports/rest.transport.ts`** - Implementación REST (la actual)
- **`transports/grpc.transport.ts`** - Interfaz preparada para gRPC

Esto significa que puedes:
1. Cambiar el endpoint del backend sin tocar código
2. Agregar un nuevo protocolo (gRPC, WebSocket, etc.) sin reescribir componentes
3. Testear con mock sin afectar el código principal

## Troubleshooting

### "CORS error" al conectar

El backend debe tener CORS habilitado:

```javascript
// Node.js/Express
import cors from 'cors';
app.use(cors());

// Python/FastAPI
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(CORSMiddleware, allow_origins=["*"])
```

### Token inválido

Asegúrate que:
1. El backend genera un token válido en `/api/auth/login`
2. El frontend lo envía en el header `Authorization: Bearer <token>`
3. El backend lo valida en `/api/chat/message`

### "Undefined variable" en Sass

Si ves errores de Sass, asegúrate de instalar dependencias:

```bash
cd frontend
npm install
```

### Mock backend no inicia

Verifica que el puerto 8000 esté disponible:

```bash
# Ver qué proceso usa el puerto 8000
lsof -i :8000

# Cambiar puerto
PORT=3000 just dev-mock
```
