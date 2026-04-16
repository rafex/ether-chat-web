# ether-chat-web

Frontend web genérico, instalable como PWA, para conversar con agentes de IA.
Incluye autenticación, configuración visual, transporte REST y contrato preparado
para gRPC.

## Quick Start

```bash
# Install dependencies
just setup

# Development with mock backend (recommended)
just dev-mock
# → Frontend: http://localhost:5173
# → Backend: http://localhost:8000
# → Credentials: demo / password123

# Or frontend only
just dev

# Tests, linting, build
just test
just lint
just build
just ci

# See all commands
just help
```

**To connect a real backend:** see [BACKEND.md](BACKEND.md)

## Stack

- **Frontend**: Pug, Sass, Vite, TypeScript, PWA
- **Services**: REST (ready for gRPC), JWT auth, session management
- **Operations**: Docker Compose, Helm, GitHub Actions CI

## Documentation

- [**ARCHITECTURE.md**](agents/ARCHITECTURE.md) - System design, modules, constraints
- [**SPEC.md**](agents/specs/generic-web-chat/SPEC.md) - Feature specification  
- [**COMMANDS.md**](agents/COMMANDS.md) - All available commands (just + make)
- [**DECISIONS.md**](agents/DECISIONS.md) - Design decisions and rationale
- [**STACK.md**](agents/STACK.md) - Technology choices
- [**ROADMAP.md**](agents/ROADMAP.md) - Future work

## Project Structure

- **`frontend/`** - PWA application (Pug, Sass, Vite, TypeScript)
- **`backend/`** - Mock backend for development (Node.js, TypeScript)
- **`agents/`** - SpecNative context: product, architecture, specs, decisions
- **`tasks/`** - Executable task decomposition from specs (7 completed)
- **`container/`** - Docker & Docker Compose configuration
- **`charts/`** - Helm chart for Kubernetes deployment
- **`.github/workflows/`** - CI pipelines
- **`Makefile`** - Build and compilation only
- **`justfile`** - Task runner: dev, test, lint, deploy, utilities
- **`workflows/`** - Repeatable procedures
- **`BACKEND.md`** - Backend integration and configuration guide

## Development

### Setup

```bash
just setup    # Install frontend dependencies
```

### Daily Workflow

```bash
just dev      # Start dev server with hot reload
just test     # Run tests
just lint     # Check code quality
just format   # Auto-format code
```

### Before Commit

```bash
just quality  # Format + lint
just test     # Run tests
```

### Deployment

```bash
just build              # Production build
just docker-check       # Validate Docker Compose
just helm-lint          # Validate Helm chart
```

## Build System Philosophy

This project uses two complementary tools with clear separation:

- **`Makefile`** - Build system: install dependencies, compile, bundle, clean
  - Self-contained: can run standalone (`make build` installs and builds)
  - Called by justfile, never the reverse
  - Pure build concerns (no test, lint, deploy)

- **`justfile`** - Task runner: orchestrates Makefile + development workflows
  - Single point of entry: `just <recipe>`
  - Handles: dev, test, lint, deploy, utilities
  - Delegates to Makefile for build tasks

All commands run from the project root: `just <recipe>`

## Requirements

- **Node.js >= 22** (frontend + mock backend)
- **Just** (task runner) - [installation guide](https://just.systems/man/en/chapter_1.html)
- **Docker & Docker Compose** (optional, for containerization)
- **Helm** (optional, for Kubernetes deployment)
