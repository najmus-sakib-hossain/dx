all: generate

generate:
	@mkdir -p build
	@cd build && cmake .. && make
	@./build/generate_styles

clean:
	@rm -rf build styles.bin

watch:
	@while true; do \
		inotifywait -e modify styles.toml; \
		make generate; \
	done
