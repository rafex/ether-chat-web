# STACK.md

Fuente de verdad de la base tecnologica del proyecto.

## Runtime

- Lenguaje: TypeScript (frontend y backend mock).
- Node.js >= 22 (frontend y backend mock).
- Version del frontend: `frontend/package.json`.
- Version del backend mock: `backend/package.json`.

## Frontend (`frontend/`)

- Vite:
  build tool y dev server.
- vite-route:
  manejo de rutas frontales.
- Pug:
  plantillas de vistas/componentes.
- Sass:
  estilos, tokens visuales y temas.
- PWA:
  manifest, service worker y cache de shell con integracion compatible
  con Vite.

## Backend Mock (`backend/`)

- Express:
  servidor HTTP para desarrollo local.
- CORS:
  habilitado para frontend en localhost.
- Solo para desarrollo local; no se despliega en produccion.
- Credenciales demo: `demo/password123`, `user/user123`.

## Herramientas de Build

- Makefile:
  build system autonomo; gestiona instalacion de dependencias (`make install`)
  y compilacion (`make build`, `make dev-build`, `make type-check`, `make clean`).
- justfile:
  task runner que orquesta el ciclo de desarrollo; llama a Makefile para
  compilacion y maneja dev, test, lint, deploy y utilities.
- Punto de entrada para desarrolladores: `just <recipe>`.

## Infraestructura

- Base de datos: fuera de alcance del frontend.
- Hosting: archivos estaticos servidos por contenedor o plataforma web.
- CI/CD: GitHub Actions en `.github/workflows/`.
- Container: Dockerfile y Compose en `container/`.
- Kubernetes: Helm chart en `charts/`.
- Observabilidad: fuera de alcance inicial, salvo logs/errores
  frontales basicos.

## Integraciones

- Backend REST:
  transporte inicial para auth y mensajes.
  Configuracion por variables de entorno `VITE_BACKEND_URL` y endpoints.
  Ver `docs/backend.md` para el contrato completo.
- Backend gRPC/gRPC-web:
  transporte preparado por contrato, implementacion concreta pendiente.
- Autenticacion JWT:
  el frontend puede recibir y adjuntar tokens via query param `?token=`.
- Login usuario/contrasena:
  flujo opcional contra endpoint configurable.
  Puede desactivarse con `VITE_AUTH_REQUIRED=false`.

## Modos del widget

- `floating`: widget flotante en esquina configurable (default).
- `embedded`: ocupa el contenedor raiz, sin toggle.
- `fullscreen`: ocupa toda la pantalla, sin toggle.

## Configuracion de colores y temas

Los cuatro tokens de color del widget (primary, accent, surface, text) son
configurables por variables de entorno en build time y por el usuario en runtime
a traves del ConfigPanel. Los cambios en runtime persisten en localStorage.

Temas predefinidos disponibles (aplican los 4 tokens de golpe):

- `dark`: fondo oscuro azulado, acento rojo (default).
- `light`: fondo claro grisáceo, acento rojo.
- `rafex`: fondo oscuro profundo, acento verde-azulado (#00d4aa), estilo rafex.dev.

El usuario puede mezclar: aplicar un tema base y luego ajustar tokens individuales.

## Restricciones

- El frontend debe ser PWA.
- No se deben hardcodear endpoints, tokens ni secretos.
- `VITE_AUTH_REQUIRED` se lee siempre del entorno de build; no puede
  ser sobreescrito por localStorage.
- La compatibilidad gRPC del navegador debe resolverse por gRPC-web o
  gateway HTTP.
- Las carpetas obligatorias de produccion son `frontend/`,
  `container/`, `charts/` y `.github/workflows/`.
- `backend/` es exclusivo de desarrollo local.
