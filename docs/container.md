# Container

Artefactos para ejecutar el frontend en contenedor, en `container/`.

## Contenido

- `Dockerfile` — imagen de produccion del frontend
- `compose.yaml` — Docker Compose para uso local o demos

## Validar configuracion

```bash
just docker-check
```

Equivale a `docker compose -f container/compose.yaml config`.

## Regla

No guardar secretos ni tokens en esta carpeta.
Las variables sensibles se pasan como variables de entorno al contenedor en runtime.
