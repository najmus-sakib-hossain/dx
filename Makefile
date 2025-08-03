.PHONY: all build watch clean

all: build

build:
	@echo "🚀 Starting build process..."
	@mkdir -p build
	@cd build && cmake .. && make
	@./generate_styles
	@./dx-styles
	@echo "✅ Build successful. Executables are in the root directory."

clean:
	@echo "🧹 Cleaning up build artifacts..."
	@rm -rf build
	@rm -f dx-styles generate_styles styles.bin styles.css
	@echo "✨ Clean up complete."
