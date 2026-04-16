# CD.md

Entrega continua del proyecto.

## Objetivo

Describir como el codigo pasa de un cambio mergeado a produccion:
ambientes, gates de promocion, proceso de deploy y rollback.

## Cuando actualizar este archivo

Actualizar cuando cambie un ambiente, se modifiquen los gates de
promocion o cambie el proceso de release.

## Template

### Plataforma

- Plataforma de CD: pendiente de definir por ambiente.
- Archivo de configuracion: chart Helm en `charts/` y artefactos de
  contenedor en `container/`.
- Donde ver el estado de los deploys: sistema de CD o cluster objetivo,
  una vez definido.

### Ambientes

| Ambiente | Rama o tag | Deploy automatico | Aprobacion requerida |
| --- | --- | --- | --- |
| Desarrollo | rama local o feature | no | no |
| Staging | rama principal o tag pre-release | pendiente | si |
| Produccion | tag versionado | pendiente | si |

### Proceso de release

1. CI valida lint, tests y build.
2. Se construye una imagen o artefacto estatico versionado.
3. Staging despliega la version candidata con configuracion externa.
4. Produccion promueve una version ya validada.

### Gates de promocion

Condiciones que deben cumplirse antes de promover a cada ambiente:

| De | A | Gates requeridos |
| --- | --- | --- |
| rama principal | staging | CI verde, configuracion de endpoints revisada |
| staging | produccion | aprobacion, version validada, rollback disponible |

### Variables y secretos

- Las variables se gestionan en la plataforma de despliegue, CI/CD o
  Kubernetes Secrets/ConfigMaps.
- Variables esperadas: endpoint REST, endpoint gRPC/gRPC-web si aplica,
  modo de autenticacion, configuracion visual por defecto y base path.
- No documentar valores sensibles; solo nombres y proposito.
- No guardar secretos en `frontend/`, `container/`, `charts/` ni
  workflows.

### Rollback

- En contenedor: redeplegar la imagen anterior conocida como estable.
- En Helm: usar rollback del release al revision anterior.
- En hosting estatico: restaurar el artefacto de build previo.
- Activar rollback cuando el chat no carga, rompe autenticacion, no puede
  enviar mensajes o expone configuracion sensible.

### Relacion con specs y tareas

Antes de considerar una iniciativa completamente entregada, verificar
que el cambio fue desplegado al ambiente objetivo y que los gates de
promocion definidos aqui fueron satisfechos.
