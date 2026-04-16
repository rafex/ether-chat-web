# CI.md

Integracion continua del proyecto.

## Objetivo

Describir que validaciones corren automaticamente, en que momento
y que debe pasar antes de que un cambio pueda mergearse.

## Cuando actualizar este archivo

Actualizar cuando cambie un gate, se agregue una nueva validacion
automatica o se modifique la plataforma de CI.

## Template

### Plataforma

- Plataforma de CI: GitHub Actions.
- Archivo de configuracion: `.github/workflows/`.
- Donde ver resultados: checks del pull request o pestaña Actions del
  repositorio.

### Triggers

| Evento | Pipeline que se ejecuta |
| --- | --- |
| Pull request abierto | lint, tests y build del frontend |
| Push a rama principal | lint, tests y build del frontend |
| Release publicado | pendiente de definir |

### Gates obligatorios

Estos checks deben pasar antes de mergear cualquier cambio:

| Gate | Herramienta | Comando local |
| --- | --- | --- |
| Lint | npm | `just lint` |
| Tests unitarios | npm | `just test` |
| Tests de integracion | pendiente | ver `agents/COMMANDS.md` |
| Build | npm/Vite | `just build` |
| Compose config | Docker Compose | `just docker-check` |
| Helm lint | Helm | `just helm-lint` |

### Gates opcionales o informativos

Checks que corren pero no bloquean el merge:

| Gate | Herramienta | Observaciones |
| --- | --- | --- |
| Cobertura de tests | pendiente | habilitar cuando existan pruebas suficientes |
| Analisis de seguridad | pendiente | revisar dependencias npm y container |

### Politica de falla

- Un gate obligatorio fallido bloquea el merge.
- La persona o agente que introduce el cambio debe corregirlo o
  justificar una excepcion explicita.
- No hay proceso de excepcion preaprobado para omitir lint, tests o
  build.

### Relacion con tareas

Un agente no debe marcar una tarea como `done` si los gates de CI
definidos en la seccion de validacion de esa tarea no pasan.
