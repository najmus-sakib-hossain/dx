# Makefile for the dx-styles and styles generator tools

# Phony targets are rules that don't represent actual files.
# 'all' is the default target that runs when you just type 'make'.
.PHONY: all build forge clean

# --- Main Targets ---

# Default target: runs the 'build' process.
all: build

# 'build' compiles the C code using CMake and runs the 'styles' generator once.
build:
	@echo "🚀 Starting build process..."
	@mkdir -p build
	cmake .. && make
	@echo "⚙️  Running the styles generator..."
	@./styles
	@echo "✅ Build successful. Executables are in the root directory."

# 'forge' builds the code and then runs the 'dx-styles' file watcher.
forge:
	@echo "🔥 Activating the Forge..."
	@mkdir -p build
	@cd build && cmake .. && make
	@echo "⚙️  Running the initial styles generator..."
	@./styles
	@echo "👀 Watching for file changes with dx-styles..."
	@./dx-styles
	@echo "Thanks for using Forge! Your styles have been generated and dx-styles is running."

# 'clean' removes all generated files and build artifacts.
clean:
	@echo "🧹 Cleaning up build artifacts..."
	@rm -rf build
	@rm -f dx-styles styles styles.bin styles.css
	@echo "✨ Clean up complete."
