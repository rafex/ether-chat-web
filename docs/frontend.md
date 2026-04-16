# Frontend

Aplicacion PWA del chat generico en `frontend/`.

## Stack

| Herramienta | Uso |
|-------------|-----|
| Vite        | Build tool y dev server |
| TypeScript  | Lenguaje base |
| Pug         | Plantillas de vistas y componentes |
| Sass        | Estilos, tokens visuales y temas |
| vite-route  | Routing frontend |
| vite-plugin-pwa | Manifest, service worker y cache de shell |
| vitest      | Testing |
| ESLint      | Linting |
| Prettier    | Formato de codigo |

## Estructura interna

```
frontend/src/
  components/     UI del chat: widget, mensajes, composer, configuracion, login
  services/       Casos de uso: auth, chat, config, storage
  transports/     Adaptadores de red: REST (activo), gRPC (contrato preparado)
  messages/       Parser y normalizador de mensajes con bloques <tinker>
  stores/         Estado de sesion y configuracion
  routes/         Rutas: login, chat
  config/         Configuracion de app y variables de entorno
  styles/         Variables, temas y estilos globales
  pwa/            Service worker
```

## Comandos

Todos se ejecutan desde la raiz del proyecto con `just`:

```bash
just setup        # Instalar dependencias
just dev          # Dev server en http://localhost:5173
just dev-mock     # Dev server + mock backend (recomendado)
just test         # Tests
just test-watch   # Tests en modo watch
just lint         # Linter (ESLint)
just format       # Formato (Prettier)
just quality      # Format + lint
just build        # Production build
just type-check   # TypeScript check sin bundling
just clean        # Limpiar artifacts
```

## Variables de entorno

Crea `frontend/.env.local` para desarrollo:

```bash
VITE_BACKEND_URL=http://localhost:8000
VITE_AUTH_ENDPOINT=/api/auth/login
VITE_CHAT_ENDPOINT=/api/chat/message
VITE_WIDGET_POSITION=bottom-right
VITE_WIDGET_MODE=floating
VITE_TINKER_MODE=expandable
```

Ver la referencia completa en [backend.md](./backend.md#variables-de-entorno-disponibles).

## Requerimientos

- Node.js >= 22
