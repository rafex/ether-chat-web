# COMMANDS.md

Lista de comandos operativos del proyecto.

## Objetivo

Reducir la ambiguedad de ejecucion para agentes y humanos usando herramientas
de responsabilidad unica:
- **`just`** (justfile): Task runner para desarrollo, testing, deployment y utilities
- **`make`** (Makefile): Compilacion y build solamente

## Task Runner: justfile

Punto de entrada principal. Ejecuta desde la raiz del proyecto.

### Setup

```bash
just setup        # Instalar dependencias
```

### Desarrollo

```bash
just dev          # Frontend solo (http://localhost:5173)
just dev-mock     # Frontend + mock backend (recomendado)
just type-watch   # Ver cambios en TypeScript (sin bundling)
```

**Para conectar un backend real:** ver [`BACKEND.md`](../BACKEND.md)

### Tests

```bash
just test         # Ejecutar tests una vez
just test-watch   # Modo watch (re-run on changes)
```

### Code Quality

```bash
just lint         # Ejecutar linter (ESLint)
just format       # Formatear con Prettier
just quality      # Format + Lint (orden correcto)
```

### Build

```bash
just build        # Production build (TypeScript check + bundling)
just build-dev    # Dev build (solo bundling, no check)
just type-check   # TypeScript check solamente
just clean        # Limpiar artifacts
```

### Infrastructure

```bash
just docker-check # Validar Docker Compose
just helm-lint    # Validar Helm chart
just infra-check  # Ambos
```

### CI Pipeline

```bash
just ci           # lint → test → build (same as GitHub Actions)
```

### All Checks

```bash
just all          # format → lint → type-check → test → build
just help         # Ver todos los comandos disponibles
```

## Build System: Makefile

Responsable de: instalación de dependencias y compilación/bundling.

```bash
make install      # Instala dependencias (frontend + backend)
make build        # Install + Production build (tsc + vite)
make dev-build    # Install + Dev build (vite only)
make type-check   # Install + Type checking
make clean        # Remove dist/ y node_modules
make clean-artifacts  # Remove dist/ solo (mantiene node_modules)
```

## Precedencia

**Usa `just` para todo.** El Makefile es la abstracción de build subyacente.
Llamar a `make` directamente solo es necesario para debugging o scripts especiales.
