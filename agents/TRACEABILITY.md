# TRACEABILITY.md

Mapa de relaciones entre specs, tareas, decisiones y validacion.

## Objetivo

Permitir que una persona o agente pueda reconstruir rapidamente:

- que spec origino un cambio
- que tareas ejecutaron esa spec
- que decisiones condicionaron el trabajo
- que evidencia valida el resultado

## Cuando actualizar este archivo

Actualizar al cerrar una iniciativa, no durante la ejecucion.
El momento correcto es cuando la spec pasa a estado `done` o `blocked`.

Si una decision cambia el alcance de una spec activa, registrar
la relacion antes de continuar.

## Formato sugerido

| Spec | Estado | Tareas | Decisiones | Archivos principales | Validacion | Observaciones |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

| Spec | Estado | Tareas | Decisiones | Archivos principales | Validacion | Observaciones |
| --- | --- | --- | --- | --- | --- | --- |
| SPEC-GENERIC-WEB-CHAT | active→implementado | TASK-001 a TASK-007 (done) | DEC-0001, DEC-0002, DEC-0003 | `frontend/`, `container/`, `charts/`, `.github/workflows/` | `just lint`, `just test`, `just build`, `just docker-check`, `just helm-lint` | Implementacion inicial completa. Pendiente: validar build en CI. gRPC queda como stub (DEC-0002). Iconos PWA PNG requieren generarse desde `public/icons/icon.svg`. Task runner: `justfile` para todo, `Makefile` solo para compilacion. |
