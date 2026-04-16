# Mock Backend

Backend de desarrollo local en `backend/`. Implementa el mismo contrato de API
que espera el frontend, sin base de datos ni dependencias externas.

## Inicio rapido

```bash
just dev-mock
```

Levanta frontend y mock backend juntos:

| Servicio  | URL                       |
|-----------|---------------------------|
| Frontend  | http://localhost:5173     |
| Backend   | http://localhost:8000     |

## Credenciales disponibles

| Usuario | Contrasena    |
|---------|---------------|
| `demo`  | `password123` |
| `user`  | `user123`     |

## Endpoints

| Metodo | Ruta                  | Descripcion                        |
|--------|-----------------------|------------------------------------|
| POST   | `/api/auth/login`     | Autentica y retorna token de sesion |
| POST   | `/api/chat/message`   | Procesa mensaje y retorna respuesta |
| GET    | `/health`             | Health check                        |

## Comportamiento

- Tokens generados en memoria; se invalidan al reiniciar el proceso.
- Conversaciones almacenadas en memoria; no persisten entre reinicios.
- Las respuestas incluyen bloques `<tinker>` para probar los distintos modos
  de visualizacion del frontend (`hidden`, `visible`, `expandable`).

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
