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

**To connect a real backend:** see [docs/backend.md](docs/backend.md)

## Stack

- **Frontend**: Pug, Sass, Vite, TypeScript, PWA
- **Services**: REST (ready for gRPC), JWT auth, session management
- **Operations**: Docker Compose, Helm, GitHub Actions CI

## Documentation

Human-facing guides live in [`docs/`](docs/):

- [**docs/frontend.md**](docs/frontend.md) - Stack, structure and commands
- [**docs/mock-backend.md**](docs/mock-backend.md) - Mock backend for local dev
- [**docs/backend.md**](docs/backend.md) - Connect a real backend (API contract, env vars)
- [**docs/container.md**](docs/container.md) - Docker and Docker Compose
- [**docs/charts.md**](docs/charts.md) - Helm deployment

## Project Structure

- **`frontend/`** - PWA application (Pug, Sass, Vite, TypeScript)
- **`backend/`** - Mock backend for development (Node.js, TypeScript)
- **`docs/`** - Human-facing guides
- **`agents/`** - SpecNative: architecture, product, specs, decisions
- **`tasks/`** - Task decomposition from specs
- **`workflows/`** - Repeatable procedures (SpecNative)
- **`pipelines/`** - CI/CD documentation (SpecNative)
- **`container/`** - Docker & Docker Compose
- **`charts/`** - Helm chart for Kubernetes deployment
- **`.github/workflows/`** - CI pipelines
- **`Makefile`** - Build system (install + compile)
- **`justfile`** - Task runner (orchestrates everything)

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
