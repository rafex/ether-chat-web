# Spec: Generic Web Chat

```toml
artifact_type = "spec"
id = "SPEC-GENERIC-WEB-CHAT"
state = "active"
owner = "rafex"
initiative = "generic-web-chat"
created_at = "2026-04-15"
updated_at = "2026-04-15"
related_tasks = [
  "TASK-GENERIC-WEB-CHAT-001",
  "TASK-GENERIC-WEB-CHAT-002",
  "TASK-GENERIC-WEB-CHAT-003",
  "TASK-GENERIC-WEB-CHAT-004",
  "TASK-GENERIC-WEB-CHAT-005",
  "TASK-GENERIC-WEB-CHAT-006",
  "TASK-GENERIC-WEB-CHAT-007"
]
related_decisions = [
  "DEC-0001",
  "DEC-0002",
  "DEC-0003"
]
artifacts = [
  "frontend/",
  "container/",
  "charts/",
  ".github/workflows/"
]
validation = [
  "just lint",
  "just test",
  "just build",
  "just docker-check",
  "just helm-lint"
]
```

## Metadata

- ID: `SPEC-GENERIC-WEB-CHAT`
- Estado: `active`
- Owner: `rafex`
- Fecha de creacion: 2026-04-15
- Ultima actualizacion: 2026-04-15
- Reemplaza: `none`
- Tareas relacionadas: `TASK-GENERIC-WEB-CHAT-001` a `TASK-GENERIC-WEB-CHAT-007`
- Decisiones relacionadas: `DEC-0001`, `DEC-0002`, `DEC-0003`

## Resumen

Construir un chat web generico, instalable como PWA, para conversar con
agentes de IA. El frontend debe incluir los servicios frontales
necesarios para operar con backend real por REST o gRPC, soportar
autenticacion por JWT o usuario/contrasena, y ofrecer configuracion
visual para colores y ubicacion flotante.

La experiencia base toma como referencia un widget compacto tipo
`TARS Chat`, con encabezado, mensajes, indicador de escritura, boton de
configuracion y caja de respuesta.

## Problema

El proyecto necesita una interfaz de chat reutilizable que pueda
integrarse en distintos sitios o despliegues sin quedar acoplada a un
backend especifico. Como el caso principal es la interaccion con agentes
de IA, el frontend debe manejar mensajes normales, estados de agente y
contenido tecnico como bloques `<tinker>` que pueden ocultarse o
mostrarse segun configuracion.

## Objetivo

Al terminar la iniciativa debe existir una base frontend ejecutable y
desplegable que permita:

- abrir un chat flotante o embebido;
- autenticarse con JWT existente o login de usuario/contrasena;
- enviar y recibir mensajes por un contrato de transporte REST y una
  interfaz preparada para gRPC;
- mostrar, ocultar o expandir bloques `<tinker>`;
- configurar colores y posicion del widget en cualquiera de las cuatro
  esquinas;
- instalar la experiencia como PWA;
- construir, probar, contenerizar y desplegar con CI, Docker Compose y
  Helm.

## Alcance

Incluye:

- Aplicacion `frontend/` con Pug, Sass, Vite, vite-route y TypeScript.
- Componentes de chat, lista de mensajes, composer, indicador de
  escritura, panel de configuracion y estados de autenticacion.
- Servicios frontales para auth, sesiones, mensajes, transporte REST,
  adaptador gRPC planificado, configuracion y persistencia local.
- PWA con manifest, service worker y cache basico de shell.
- Soporte de temas por variables CSS/Sass y posicion flotante:
  `top-left`, `top-right`, `bottom-left`, `bottom-right`.
- Parsing seguro de contenido de agente para detectar bloques
  `<tinker>` y permitir ocultar, mostrar o expandir detalle.
- Carpeta `container/` con Dockerfile y Compose para usar el chat.
- Carpeta `charts/` con chart Helm para despliegue.
- Carpeta `.github/workflows/` con CI de lint, test y build.

Excluye:

- Implementar el backend real.
- Persistencia server-side de conversaciones.
- Entrenamiento, hosting o seleccion de modelos de IA.
- Autorizacion avanzada por roles.
- Sistema de analytics de producto.

## Requisitos funcionales

- RF-1: El usuario puede abrir, cerrar y usar el chat desde una vista
  web responsive.
- RF-2: El chat soporta modo flotante en cuatro esquinas y modo
  embebido.
- RF-3: El usuario puede configurar colores principales, acento,
  superficie y texto sin recompilar.
- RF-4: El frontend acepta JWT preexistente y login con usuario y
  contrasena contra un endpoint configurable.
- RF-5: El servicio de mensajes expone una interfaz unica para enviar y
  recibir mensajes, con implementacion REST inicial y contrato para gRPC.
- RF-6: Los mensajes de IA pueden contener bloques `<tinker>` y el UI
  permite ocultarlos, mostrarlos o expandirlos segun configuracion.
- RF-7: El chat muestra estados de agente: escribiendo, procesando,
  error, reconexion y respuesta parcial cuando el transporte lo permita.
- RF-8: La configuracion se puede cargar desde variables de entorno de
  build/runtime o archivo publico de configuracion.
- RF-9: La PWA puede instalarse y mantiene el shell basico disponible
  offline.
- RF-10: La plantilla visual inicial conserva la estructura compacta del
  ejemplo TARS Chat y se adapta al sistema de componentes del proyecto.

## Requisitos no funcionales

- RNF-1: El codigo debe estar escrito en TypeScript estricto.
- RNF-2: La estructura debe separar UI, servicios frontales, contratos de
  transporte y configuracion.
- RNF-3: El build debe ser reproducible en CI.
- RNF-4: El widget debe ser accesible por teclado y usar semantica ARIA
  para controles principales.
- RNF-5: La configuracion visual no debe requerir editar codigo fuente.
- RNF-6: El manejo de HTML o contenido del modelo debe evitar inyeccion
  de markup no confiable.
- RNF-7: La app debe poder ejecutarse localmente con Vite y en
  contenedor.
- RNF-8: Los charts Helm no deben contener secretos hardcodeados.

## Criterios de aceptacion

- CA-1: Dado un entorno local, cuando se ejecuta el comando de
  desarrollo, entonces el chat renderiza y permite enviar un mensaje
  contra un servicio mock o configurable.
- CA-2: Dado un mensaje con `<tinker>...</tinker>`, cuando la
  configuracion esta en modo oculto, entonces el contenido tecnico no se
  muestra en la conversacion principal.
- CA-3: Dado el modo de tinker visible, cuando llega un mensaje de
  agente, entonces el usuario puede inspeccionar el bloque tecnico sin
  perder el texto final.
- CA-4: Dado un JWT valido, cuando se inicializa el cliente, entonces las
  llamadas al transporte incluyen credenciales segun contrato.
- CA-5: Dado usuario y contrasena, cuando el backend de auth responde
  correctamente, entonces el frontend conserva la sesion de forma
  configurable y puede enviar mensajes autenticados.
- CA-6: Dada una configuracion de tema y posicion, cuando se recarga la
  app, entonces los colores y la esquina elegida se mantienen.
- CA-7: Dado el build de produccion, cuando se ejecuta CI, entonces
  pasan lint, tests y build.
- CA-8: Dado el despliegue por contenedor o Helm, cuando se revisa la
  configuracion, entonces no hay secretos embebidos y los endpoints son
  configurables.

## Dependencias y riesgos

- Dependencia: Definir contrato minimo de backend para auth, mensajes y
  streaming.
- Dependencia: Elegir libreria de service worker compatible con Vite.
- Riesgo: gRPC en navegador requiere gRPC-web o gateway compatible.
  Mitigacion: definir puerto de transporte y dejar REST como
  implementacion inicial.
- Riesgo: El contenido `<tinker>` puede mezclarse con texto final del
  modelo. Mitigacion: parser dedicado y tests de casos limite.
- Riesgo: Personalizacion visual excesiva puede romper accesibilidad.
  Mitigacion: validar contraste minimo y estados de foco.

## Plan de ejecucion

1. Crear estructura base del repo y configurar stack frontend.
2. Implementar layout del chat, tema y posicionamiento.
3. Implementar servicios frontales de auth, mensajes, configuracion y
   transporte REST.
4. Implementar parser/render de mensajes de agente y bloques `<tinker>`.
5. Agregar PWA, persistencia local y estados offline basicos.
6. Agregar containerizacion, Compose y chart Helm.
7. Agregar CI y documentar comandos de validacion.

## Plan de validacion

- Test manual: render del widget en desktop y mobile, apertura/cierre,
  envio de mensaje, configuracion visual y cambio de esquina.
- Test automatizado: unit tests para parser `<tinker>`, servicios de
  configuracion y contratos de transporte.
- Build: `just build`.
- Lint: `just lint`.
- Contenedores: `just docker-check`.
- Helm: `just helm-lint`.
- Evidencia esperada: salida exitosa de comandos y captura funcional del
  chat renderizado.

## Trazabilidad

- Commits o PRs: pendiente.
- Archivos principales: `frontend/`, `container/`, `charts/`,
  `.github/workflows/`.
- Resultado de validacion: pendiente de implementacion.
