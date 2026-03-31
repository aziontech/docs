# Azion Docs - Makefile for contributors
# Based on CONTRIBUTING.md guidelines

.PHONY: help install dev build build-local preview check lint format test clean

# Default target
help:
	@echo "Azion Docs - Contributor Commands"
	@echo "================================="
	@echo ""
	@echo "Setup:"
	@echo "  make install        - Install dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make dev            - Start dev server with hot reload (http://localhost:4321)"
	@echo "  make preview        - Preview production build locally"
	@echo ""
	@echo "Build:"
	@echo "  make build          - Production build"
	@echo "  make build-local    - Local build with frontmatter tests"
	@echo ""
	@echo "Quality:"
	@echo "  make check          - Run Astro type checking"
	@echo "  make lint           - Run ESLint"
	@echo "  make format         - Format code with Prettier"
	@echo "  make test           - Run all tests (frontmatter validation)"
	@echo ""
	@echo "All-in-one:"
	@echo "  make validate       - Run check, lint, and build-local"
	@echo ""
	@echo "Clean:"
	@echo "  make clean          - Remove build artifacts"
	@echo ""

# Setup
install:
	@echo "Installing dependencies..."
	npm install

# Development
dev:
	@echo "Starting dev server..."
	npm run dev

preview:
	@echo "Starting preview server..."
	npm run preview

# Build
build:
	@echo "Running production build..."
	npm run build

build-local:
	@echo "Running local build with frontmatter tests..."
	npm run build:local

# Quality
check:
	@echo "Running Astro type check..."
	npm run check

lint:
	@echo "Running ESLint..."
	npm run lint:eslint

format:
	@echo "Formatting code with Prettier..."
	npm run format

test:
	@echo "Running frontmatter tests..."
	npm run test:frontmatter

# All-in-one validation
validate: check lint build-local
	@echo "✓ All validations passed!"

# Clean
clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist/
	rm -rf .astro/
	rm -rf node_modules/.vite/
	@echo "✓ Clean complete!"

# Memory-expanded build (for large builds)
build-memory:
	@echo "Running build with expanded memory..."
	NODE_OPTIONS='--max-old-space-size=8192' npm run build:local
