# justfile - Task runner for ether-chat-web
# Responsible for: development workflow, testing, deployment, utilities
# Can call: Makefile targets
# Cannot be called by: Makefile

set shell := ["bash", "-c"]
set dotenv-load := true

# Default recipe
default:
    @just --list

# ============================================================================
# Setup and Dependencies (delegates to Makefile)
# ============================================================================

# Install all dependencies (frontend + backend)
setup:
    make install

# ============================================================================
# Development
# ============================================================================

# Start development server
dev:
    cd frontend && npm run dev

# Start frontend + mock backend together
dev-mock:
    #!/bin/bash
    set -e
    echo "🚀 Starting frontend + mock backend..."
    (cd backend && npm run dev) & BACKEND_PID=$!
    sleep 2
    (cd frontend && VITE_BACKEND_URL=http://localhost:8000 npm run dev) & FRONTEND_PID=$!

    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true" EXIT
    wait

# Watch TypeScript for changes (no bundling)
type-watch:
    cd frontend && npx tsc --watch --noEmit

# ============================================================================
# Testing
# ============================================================================

# Run tests once
test:
    cd frontend && npm run test

# Run tests in watch mode
test-watch:
    cd frontend && npm run test:watch

# ============================================================================
# Code Quality
# ============================================================================

# Lint code
lint:
    cd frontend && npm run lint

# Format code
format:
    cd frontend && npm run format

# Lint and format (format first, then lint)
quality: format lint

# ============================================================================
# Build (all delegate to Makefile - Makefile is the build system)
# ============================================================================

# Production build (install + TypeScript check + bundling)
build:
    make build

# Development build (install + vite only, no TypeScript check)
build-dev:
    make dev-build

# Type check only (install + check)
type-check:
    make type-check

# Clean artifacts only (keep node_modules for speed)
clean:
    make clean-artifacts

# Full clean (remove node_modules too)
clean-all:
    make clean

# ============================================================================
# Deployment and Infrastructure
# ============================================================================

# Validate Docker Compose configuration
docker-check:
    docker compose -f container/compose.yaml config

# Lint Helm chart
helm-lint:
    helm lint charts/ether-chat-web

# Validate all infrastructure
infra-check: docker-check helm-lint
    @echo "✓ Infrastructure validated"

# ============================================================================
# CI Pipeline (same as GitHub Actions)
# ============================================================================

# Run full CI pipeline: lint → test → build
ci: lint test build
    @echo "✓ CI pipeline complete"

# ============================================================================
# Utilities
# ============================================================================

# Show all available recipes
help:
    just --list --unsorted

# Format, lint, type-check, test, and build
all: quality type-check test build
    @echo "✓ All checks passed"

# Preview production build
preview: build
    cd frontend && npm run preview
