# Backend Mock

Mock backend para desarrollo local de ether-chat-web.

Implementa los endpoints esperados por el frontend:
- `POST /api/auth/login` - Autenticación
- `POST /api/chat/message` - Mensajes de chat
- `GET /health` - Health check

## Setup

```bash
cd backend
npm install
```

## Desarrollo

```bash
npm run dev
```

El servidor corre en `http://localhost:8000`

## Credenciales demo

```
Username: demo
Password: password123

Username: user
Password: user123
```

## Build

```bash
npm run build
npm run start
```

## Características

- ✅ Autenticación con mock tokens
- ✅ Conversaciones en memoria
- ✅ Respuestas con bloques `<tinker>` para testing
- ✅ CORS habilitado
- ✅ Sin base de datos (perfecto para dev)

## Integración con frontend

El frontend se conecta automáticamente si:

```bash
VITE_BACKEND_URL=http://localhost:8000 just dev
```

O usa el comando de conveniencia:

```bash
just dev-mock  # Levanta frontend + backend juntos
```
