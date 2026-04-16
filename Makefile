# Makefile - Build system and dependency management
# Responsible for: installing dependencies and compiling/bundling
# Call from: justfile only, not from other Makefiles

.PHONY: install build dev-build type-check clean

# ─── Install all dependencies ─────────────────────────────────────────────

install:
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install
	@echo "📦 Installing backend dependencies..."
	cd backend && npm install
	@echo "✓ All dependencies installed"

# ─── Build targets ────────────────────────────────────────────────────────

# Build for production: TypeScript check + Vite bundle
build: install
	@echo "🔨 Building frontend (production)..."
	cd frontend && npm run build

# Build for development: Vite bundle only (no TypeScript check)
dev-build: install
	@echo "🔨 Building frontend (dev)..."
	cd frontend && npx vite build

# Type check only (no bundling)
type-check: install
	@echo "🔍 Type checking..."
	cd frontend && npx tsc --noEmit

# ─── Cleanup ──────────────────────────────────────────────────────────────

# Clean all build artifacts and node_modules
clean:
	@echo "🧹 Cleaning artifacts..."
	rm -rf frontend/dist frontend/.output
	rm -rf frontend/node_modules backend/node_modules
	@echo "✓ Clean complete"

# Clean artifacts only (keep node_modules)
clean-artifacts:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf frontend/dist frontend/.output
	@echo "✓ Artifacts cleaned"

.DEFAULT_GOAL := build
