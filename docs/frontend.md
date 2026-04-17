# Frontend

Aplicacion PWA del chat generico en `frontend/`.

## Stack

| Herramienta     | Uso                                        |
|-----------------|--------------------------------------------|
| Vite            | Build tool y dev server                    |
| TypeScript      | Lenguaje base                              |
| Pug             | Plantillas de vistas y componentes         |
| Sass            | Estilos, tokens visuales y temas           |
| vite-route      | Routing frontend                           |
| vite-plugin-pwa | Manifest, service worker y cache de shell  |
| vitest          | Testing                                    |
| ESLint          | Linting                                    |
| Prettier        | Formato de codigo                          |

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

## Modos de autenticacion

El chat soporta dos modos configurables via variable de entorno:

| `VITE_AUTH_REQUIRED` | Comportamiento |
|----------------------|----------------|
| `true` (default)     | Muestra pantalla de login antes del chat |
| `false`              | Acceso directo al chat sin autenticacion |

Cuando `VITE_AUTH_REQUIRED=false`, el chat abre directamente sin pasar por el formulario
de login. Los mensajes se envian sin token de autorizacion.

> **Seguridad:** `VITE_AUTH_REQUIRED` se lee siempre del entorno de build/runtime,
> nunca del localStorage. No puede ser alterado por el usuario desde el navegador.

## Modos de visualizacion del widget

| `VITE_WIDGET_MODE` | Comportamiento |
|--------------------|----------------|
| `floating`         | Widget flotante en una esquina (default). Tiene boton de toggle para abrir/cerrar. |
| `embedded`         | Ocupan el 100% del contenedor `#app`. Sin boton de toggle. |
| `fullscreen`       | Ocupa toda la pantalla (`inset: 0`). Sin boton de toggle. |

## Configuracion de colores dentro del chat

El panel de configuracion (icono de engranaje en el header) permite cambiar los
cuatro tokens de color del chat en tiempo real sin recompilar:

| Token     | Descripcion                       |
|-----------|-----------------------------------|
| Fondo     | Color primario del header y burbujas del agente |
| Acento    | Botones, links y burbujas del usuario |
| Superficie| Fondo del widget y compositor     |
| Texto     | Color del texto principal         |

Los cambios persisten en `localStorage` y se aplican inmediatamente via CSS custom properties.

### Temas predefinidos

Ademas de los pickers individuales, hay tres temas predefinidos que establecen los 4 tokens de golpe:

| Tema    | Descripcion                                              |
|---------|----------------------------------------------------------|
| `dark`  | Fondo oscuro azulado, acento rojo. Tema por defecto.     |
| `light` | Fondo claro grisáceo, acento rojo.                       |
| `rafex` | Fondo oscuro profundo, acento verde-azulado. Estilo rafex.dev. |

Si tras aplicar un tema se modifican colores individuales, el tema deja de mostrarse como activo.

## PWA

La aplicacion es instalable como PWA. El build genera:
- `manifest.webmanifest` con iconos de 72px a 512px
- Service worker con Workbox para cache offline del shell
- Cache de llamadas API con estrategia `NetworkFirst` (24h, max 100 entradas)

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
# Backend
VITE_BACKEND_URL=http://localhost:8000
VITE_AUTH_ENDPOINT=/api/auth/login
VITE_CHAT_ENDPOINT=/api/chat/message

# Autenticacion
VITE_AUTH_REQUIRED=true          # false = acceso directo sin login

# Widget
VITE_WIDGET_POSITION=bottom-right   # top-left | top-right | bottom-left | bottom-right
VITE_WIDGET_MODE=floating           # floating | embedded | fullscreen
VITE_TINKER_MODE=hidden             # hidden | visible | expandable

# Colores iniciales (hex)
VITE_COLOR_PRIMARY=#1a1a2e
VITE_COLOR_ACCENT=#e94560
VITE_COLOR_SURFACE=#16213e
VITE_COLOR_TEXT=#eaeaea
```

Ver referencia completa de API en [backend.md](./backend.md).

## Requerimientos

- Node.js >= 22
