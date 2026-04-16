# Tasks: Generic Web Chat

## TASK-GENERIC-WEB-CHAT-001: Estructura base del proyecto

```toml
artifact_type = "task"
id = "TASK-GENERIC-WEB-CHAT-001"
state = "done"
owner = "rafex"
spec_id = "SPEC-GENERIC-WEB-CHAT"
initiative = "generic-web-chat"
dependencies = []
expected_files = [
  "frontend/",
  "frontend/package.json",
  "frontend/vite.config.ts",
  "frontend/src/"
]
close_criteria = "La aplicacion frontend existe con Pug, Sass, Vite, vite-route y TypeScript configurados."
validation = [
  "just setup",
  "just build"
]
created_at = "2026-04-15"
updated_at = "2026-04-15"
```

**Description:** Crear la base tecnica del frontend y dejarla lista para desarrollo local.

**Criterio de cierre:** Vite compila una app minima y los comandos base estan documentados.

---

## TASK-GENERIC-WEB-CHAT-002: UI del chat y configuracion visual

```toml
artifact_type = "task"
id = "TASK-GENERIC-WEB-CHAT-002"
state = "done"
owner = "rafex"
spec_id = "SPEC-GENERIC-WEB-CHAT"
initiative = "generic-web-chat"
dependencies = ["TASK-GENERIC-WEB-CHAT-001"]
expected_files = [
  "frontend/src/components/",
  "frontend/src/styles/",
  "frontend/src/config/"
]
close_criteria = "El widget renderiza mensajes, composer, estado de escritura, configuracion de colores y posicion en cuatro esquinas."
validation = [
  "just test",
  "just build"
]
created_at = "2026-04-15"
updated_at = "2026-04-15"
```

**Description:** Implementar la experiencia visual tomando como referencia el ejemplo TARS Chat.

**Criterio de cierre:** El usuario puede abrir/cerrar el chat, cambiar tema y mover el widget.

---

## TASK-GENERIC-WEB-CHAT-003: Servicios frontales y contratos de transporte

```toml
artifact_type = "task"
id = "TASK-GENERIC-WEB-CHAT-003"
state = "done"
owner = "rafex"
spec_id = "SPEC-GENERIC-WEB-CHAT"
initiative = "generic-web-chat"
dependencies = ["TASK-GENERIC-WEB-CHAT-001"]
expected_files = [
  "frontend/src/services/",
  "frontend/src/transports/",
  "frontend/src/types/"
]
close_criteria = "Existen servicios de auth, chat, configuracion y transporte REST con interfaz preparada para gRPC."
validation = [
  "just test",
  "just build"
]
created_at = "2026-04-15"
updated_at = "2026-04-15"
```

**Description:** Separar contratos de dominio frontend de los detalles de REST o gRPC.

**Criterio de cierre:** La UI puede operar contra mock local y endpoint REST configurable.

---

## TASK-GENERIC-WEB-CHAT-004: Autenticacion JWT y usuario/contrasena

```toml
artifact_type = "task"
id = "TASK-GENERIC-WEB-CHAT-004"
state = "done"
owner = "rafex"
spec_id = "SPEC-GENERIC-WEB-CHAT"
initiative = "generic-web-chat"
dependencies = ["TASK-GENERIC-WEB-CHAT-003"]
expected_files = [
  "frontend/src/services/auth*",
  "frontend/src/stores/",
  "frontend/src/routes/"
]
close_criteria = "El frontend acepta JWT existente y login con usuario/contrasena contra endpoint configurable."
validation = [
  "just test",
  "just build"
]
created_at = "2026-04-15"
updated_at = "2026-04-15"
```

**Description:** Implementar flujo de sesion frontend sin acoplarlo a un proveedor especifico.

**Criterio de cierre:** Las llamadas de chat pueden incluir token y manejar expiracion/error basico.

---

## TASK-GENERIC-WEB-CHAT-005: Mensajes de agente y bloques tinker

```toml
artifact_type = "task"
id = "TASK-GENERIC-WEB-CHAT-005"
state = "done"
owner = "rafex"
spec_id = "SPEC-GENERIC-WEB-CHAT"
initiative = "generic-web-chat"
dependencies = ["TASK-GENERIC-WEB-CHAT-002", "TASK-GENERIC-WEB-CHAT-003"]
expected_files = [
  "frontend/src/messages/",
  "frontend/src/components/Tinker*"
]
close_criteria = "Los mensajes con bloques <tinker> pueden ocultarse, mostrarse o expandirse sin exponer markup inseguro."
validation = [
  "just test",
  "just build"
]
created_at = "2026-04-15"
updated_at = "2026-04-15"
```

**Description:** Parsear y renderizar contenido de agentes de IA con control de razonamiento o detalle tecnico.

**Criterio de cierre:** Hay pruebas de parsing para bloques tinker completos, ausentes y mal formados.

---

## TASK-GENERIC-WEB-CHAT-006: PWA y persistencia local

```toml
artifact_type = "task"
id = "TASK-GENERIC-WEB-CHAT-006"
state = "done"
owner = "rafex"
spec_id = "SPEC-GENERIC-WEB-CHAT"
initiative = "generic-web-chat"
dependencies = ["TASK-GENERIC-WEB-CHAT-001", "TASK-GENERIC-WEB-CHAT-002"]
expected_files = [
  "frontend/public/manifest.webmanifest",
  "frontend/src/pwa/",
  "frontend/public/icons/"
]
close_criteria = "La app es instalable como PWA y conserva shell/configuracion basica."
validation = [
  "just build"
]
created_at = "2026-04-15"
updated_at = "2026-04-15"
```

**Description:** Agregar manifest, service worker y persistencia local de configuracion.

**Criterio de cierre:** El build genera assets PWA y la configuracion visual persiste.

---

## TASK-GENERIC-WEB-CHAT-007: Operacion, despliegue y CI

```toml
artifact_type = "task"
id = "TASK-GENERIC-WEB-CHAT-007"
state = "done"
owner = "rafex"
spec_id = "SPEC-GENERIC-WEB-CHAT"
initiative = "generic-web-chat"
dependencies = ["TASK-GENERIC-WEB-CHAT-001"]
expected_files = [
  "container/",
  "charts/",
  ".github/workflows/"
]
close_criteria = "Existen Dockerfile, Compose, chart Helm y workflow de GitHub Actions para validar el frontend."
validation = [
  "docker compose config",
  "helm lint charts/ether-chat-web",
  "GitHub Actions"
]
created_at = "2026-04-15"
updated_at = "2026-04-15"
```

**Description:** Preparar los artefactos de operacion para ejecutar y desplegar el chat.

**Criterio de cierre:** CI ejecuta lint/test/build y la configuracion de despliegue no contiene secretos.
