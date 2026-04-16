# DECISIONS.md

Registro de decisiones persistentes del proyecto.

## Cuando registrar aqui

Registrar una decision cuando cambie algo que futuras iniciativas
o agentes deban respetar:

- la arquitectura del sistema
- una convencion de codigo o de documentacion
- una tecnologia o dependencia base
- un tradeoff que condicione trabajo futuro

Ver `AGENTS.md` para entender la separacion semantica entre este
archivo y `SPEC.md`.

## Cuando leer este archivo

Antes de iniciar una nueva iniciativa, revisar si alguna decision
registrada condiciona el diseno o la implementacion.

## Decisiones

### DEC-0001 - Frontend PWA con Pug, Sass, Vite, vite-route y TypeScript

- Fecha: 2026-04-15
- Estado: `accepted`
- Relacionado con specs: `SPEC-GENERIC-WEB-CHAT`
- Relacionado con tareas: `TASK-GENERIC-WEB-CHAT-001`,
  `TASK-GENERIC-WEB-CHAT-002`, `TASK-GENERIC-WEB-CHAT-006`
- Contexto: el proyecto necesita una base frontend portable, compilable
  y adecuada para instalarse como PWA.
- Decision: el stack base del frontend sera Pug, Sass, Vite, vite-route
  y TypeScript.
- Consecuencias: futuras iniciativas deben respetar este stack salvo
  decision nueva que lo reemplace; los componentes y servicios deben
  organizarse dentro de `frontend/`.
- Reemplaza: `none`

### DEC-0002 - Transportes desacoplados del UI

- Fecha: 2026-04-15
- Estado: `accepted`
- Relacionado con specs: `SPEC-GENERIC-WEB-CHAT`
- Relacionado con tareas: `TASK-GENERIC-WEB-CHAT-003`,
  `TASK-GENERIC-WEB-CHAT-004`
- Contexto: el chat debe conectarse a backend real por REST o gRPC sin
  acoplar la interfaz visual a un protocolo especifico.
- Decision: la UI consumira servicios frontales y contratos de
  transporte; REST sera la implementacion inicial y gRPC quedara
  representado por un puerto/adaptador compatible con gRPC-web o gateway.
- Consecuencias: el UI no debe llamar directamente endpoints; agregar un
  nuevo protocolo implica implementar un adaptador, no reescribir
  componentes.
- Reemplaza: `none`

### DEC-0003 - Bloques tinker como contenido controlado de agente

- Fecha: 2026-04-15
- Estado: `accepted`
- Relacionado con specs: `SPEC-GENERIC-WEB-CHAT`
- Relacionado con tareas: `TASK-GENERIC-WEB-CHAT-005`
- Contexto: los agentes de IA pueden emitir detalle tecnico o
  razonamiento que no siempre debe mostrarse al usuario final.
- Decision: el frontend reconocera bloques `<tinker>` como contenido de
  agente controlado, con modos para ocultar, mostrar o expandir segun
  configuracion.
- Consecuencias: los mensajes requieren normalizacion antes de renderizar
  y deben evitar exponer markup no confiable.
- Reemplaza: `none`
