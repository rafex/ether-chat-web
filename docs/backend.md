# Backend

Guía para desarrollar con el mock backend local o conectar un backend real.

---

## Modo Mock (desarrollo local)

El repositorio incluye un backend mock en `backend/` que implementa los mismos
endpoints que espera el frontend. Es la forma más rápida de empezar.

### Iniciar

```bash
just dev-mock
```

Levanta los dos servicios en paralelo:

| Servicio  | URL                       |
|-----------|---------------------------|
| Frontend  | http://localhost:5173     |
| Backend   | http://localhost:8000     |

### Credenciales disponibles en modo mock

| Usuario | Contraseña   |
|---------|--------------|
| `demo`  | `password123`|
| `user`  | `user123`    |

### Qué hace el mock

- Valida usuario y contraseña contra la tabla anterior.
- Genera un token de sesión en memoria (no persiste entre reinicios).
- Responde mensajes con texto aleatorio que incluye bloques `<tinker>` para
  probar los distintos modos de visualización del frontend.
- Almacena conversaciones en memoria; se pierden al reiniciar el proceso.

---

## Modo Backend Real

### 1. Configurar la URL

Crea `frontend/.env.local` con la URL base de tu backend:

```bash
VITE_BACKEND_URL=http://localhost:3000
```

Luego inicia solo el frontend:

```bash
just dev
```

O pasa la variable inline sin crear el archivo:

```bash
VITE_BACKEND_URL=http://localhost:3000 just dev
```

### 2. Variables de entorno disponibles

| Variable              | Valor por defecto    | Descripción                                              |
|-----------------------|----------------------|----------------------------------------------------------|
| `VITE_BACKEND_URL`    | *(vacío)*            | URL base del backend                                     |
| `VITE_AUTH_ENDPOINT`  | `/api/auth/login`    | Endpoint de autenticación                                |
| `VITE_CHAT_ENDPOINT`  | `/api/chat/message`  | Endpoint de mensajes                                     |
| `VITE_WIDGET_POSITION`| `bottom-right`       | Posición: `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `VITE_WIDGET_MODE`    | `floating`           | Modo: `floating` o `embedded`                            |
| `VITE_TINKER_MODE`    | `hidden`             | Bloques tinker: `hidden`, `visible`, `expandable`        |
| `VITE_COLOR_PRIMARY`  | `#1a1a2e`            | Color primario (hex)                                     |
| `VITE_COLOR_ACCENT`   | `#e94560`            | Color de acento (hex)                                    |
| `VITE_COLOR_SURFACE`  | `#16213e`            | Color de superficie (hex)                                |
| `VITE_COLOR_TEXT`     | `#eaeaea`            | Color de texto (hex)                                     |

### 3. Contrato de API

Tu backend debe implementar dos endpoints:

#### `POST /api/auth/login`

```
Request
  Content-Type: application/json
  Body: { "username": "...", "password": "..." }

Response 200
  { "token": "..." }

Response 401
  { "error": "Invalid credentials" }
```

#### `POST /api/chat/message`

```
Request
  Content-Type: application/json
  Authorization: Bearer <token>
  Body: {
    "message": "texto del usuario",
    "conversation_id": "conv_abc"   ← opcional en el primer mensaje
  }

Response 200
  {
    "content": "respuesta del agente",
    "conversation_id": "conv_abc"   ← el backend lo genera si no se envió
  }
```

El campo `content` puede incluir bloques `<tinker>` con razonamiento técnico.
El frontend los parsea automáticamente según `VITE_TINKER_MODE`:

```
Texto visible para el usuario.

<tinker>
Razonamiento interno o detalles técnicos.
</tinker>

Más texto visible.
```

---

## Referencia del mock

El mock vive en [`backend/src/index.ts`](backend/src/index.ts) y puede usarse
como referencia para implementar el contrato en cualquier lenguaje o framework.

Para correr el mock de forma independiente (sin el frontend):

```bash
cd backend
npm install
npm run dev
```

---

## Troubleshooting

### CORS error al conectar backend real

El backend debe tener CORS habilitado para `http://localhost:5173`:

```javascript
// Node.js / Express
import cors from 'cors';
app.use(cors());
```

### El mock no inicia (puerto 8000 ocupado)

```bash
# Ver qué proceso usa el puerto
lsof -i :8000

# Cambiar el puerto del mock
PORT=3001 just dev-mock
```

### Token rechazado por el backend

Verifica que:
1. `/api/auth/login` retorna `{ "token": "..." }` en la clave exacta `token`.
2. El frontend envía `Authorization: Bearer <token>` en cada mensaje.
3. El backend valida ese header en `/api/chat/message`.
