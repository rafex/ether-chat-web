# ROADMAP.md

Direccion del proyecto en el tiempo.

## Objetivo

Dar contexto de prioridad sin convertir esto en una lista de tickets.

## Cuando leer este archivo

Leer antes de crear una nueva spec para confirmar que la iniciativa
es coherente con la direccion actual del proyecto.

Si ROADMAP.md menciona una iniciativa pero no existe spec para ella,
el siguiente paso es crear esa spec antes de implementar.

## Template

### Ahora

- `SPEC-GENERIC-WEB-CHAT`: completada. Base del chat web generico
  implementada con todas las tareas en estado `done`.
- Mock backend en `backend/` listo para desarrollo local (`just dev-mock`).
- Contrato REST documentado en `BACKEND.md`.
- Pendiente: confirmar si gRPC se consumira via gRPC-web o gateway HTTP.

### Despues

- Conectar el chat con un backend real de conversaciones usando el
  contrato definido en `BACKEND.md`.
- Agregar pruebas end-to-end sobre flujos de autenticacion y mensajes.
- Endurecer despliegue Helm para ambientes compartidos.

### Mas adelante

- Streaming avanzado de respuestas parciales.
- Observabilidad del widget y metricas de conversacion.
- Adaptadores adicionales para proveedores de agentes.

### No hacer por ahora

- Backend de conversaciones persistente.
- Panel administrativo multi-tenant.
- Entrenamiento o hosting de modelos de IA.
