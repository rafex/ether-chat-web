# ARCHITECTURE.md

Describe la arquitectura actual del proyecto.

## Vision general

Ether Chat Web es una aplicacion frontend PWA. Su nucleo vive en
`frontend/` y se divide entre componentes visuales, servicios frontales,
contratos de transporte y configuracion. El frontend no implementa el
backend de conversaciones; consume endpoints configurables por REST y
mantiene una interfaz para incorporar gRPC/gRPC-web.

El repositorio incluye ademas un mock backend en `backend/` exclusivamente
para desarrollo local; no forma parte del artefacto de produccion.

La operacion se separa en `container/` para imagenes y Compose,
`charts/` para Kubernetes por Helm, y `.github/workflows/` para CI. Los
documentos de `agents/` y `tasks/` mantienen el contexto de SpecNative y
la trazabilidad de iniciativas.

El sistema de build usa `Makefile` como build system autonomo (instala
dependencias y compila) y `justfile` como task runner que orquesta el
ciclo de desarrollo.

## Modulos principales

- `frontend/ui`:
  componentes de chat, mensajes, composer, estados, panel de
  configuracion y rutas.
- `frontend/services`:
  casos de uso frontales para auth, chat, configuracion, PWA y
  persistencia local.
- `frontend/transports`:
  adaptadores para REST y contrato futuro de gRPC/gRPC-web.
- `frontend/messages`:
  parseo y normalizacion de mensajes de usuario, agente y bloques
  `<tinker>`.
- `backend`:
  mock backend de desarrollo en Node.js/Express con los mismos endpoints
  que espera el frontend. Solo para desarrollo local; excluido de CI y
  produccion.
- `container`:
  Dockerfile y Compose para construir y ejecutar el frontend.
- `charts`:
  chart Helm con valores configurables para imagen, endpoints,
  recursos e ingress.
- `.github/workflows`:
  validacion automatica de lint, tests y build.

## Flujo principal

1. La app carga configuracion de build/runtime (env vars via Vite).
2. El router evalua `VITE_AUTH_REQUIRED`:
   - `true`: redirige a login si no hay sesion activa.
   - `false`: redirige directo a `/chat`.
3. Si auth es requerida, el usuario hace login; el token se guarda en
   `SessionStore` (localStorage).
4. La app monta el widget en modo `floating`, `embedded` o `fullscreen`
   segun `VITE_WIDGET_MODE`.
5. El usuario envia mensajes; el `ChatService` los delega al transporte.
6. El transporte adjunta el token JWT si existe.
7. La respuesta del agente se normaliza, separando texto visible y
   bloques `<tinker>`.
8. La UI renderiza mensajes y aplica el modo de tinker configurado.
9. El usuario puede abrir el `ConfigPanel` para cambiar colores (4 tokens
   individuales o via tema predefinido: dark/light/rafex), posicion del
   widget y modo de tinker en tiempo real. Los cambios persisten en
   localStorage y se aplican via CSS custom properties.

## Restricciones

- El UI no debe depender directamente de `fetch`, gRPC o detalles de red;
  debe usar servicios y contratos.
- Los secretos no deben vivir en codigo fuente, Compose, values de Helm
  ni workflows.
- El parser de mensajes no debe renderizar HTML no confiable sin
  sanitizacion.
- La configuracion visual debe aplicarse por variables o tokens, no por
  cambios manuales al componente.
- `VITE_AUTH_REQUIRED` se lee siempre del entorno de build; no puede ser
  sobreescrito por el usuario desde localStorage.

## Riesgos

- gRPC en navegador requiere gRPC-web o gateway compatible.
  Impacto: integracion directa podria no funcionar con servidores gRPC
  puros. Mitigacion: REST como transporte inicial y contrato de puerto
  para adaptar gRPC despues.
- Bloques `<tinker>` mal formados pueden degradar la conversacion.
  Impacto: razonamiento tecnico visible por accidente o perdida de texto.
  Mitigacion: parser probado con casos limite y fallback conservador.
- Temas configurables pueden romper contraste.
  Impacto: accesibilidad baja. Mitigacion: defaults accesibles y
  validacion de estados principales.
