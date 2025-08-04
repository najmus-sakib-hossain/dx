# --- Project Setup ---
cmake_minimum_required(VERSION 3.14)
project(dx-tools C)

# --- Global Settings ---
# Set the output directory for all executables to the project's root folder
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR})

# Include the FetchContent module to manage external dependencies
include(FetchContent)

# --- Dependency Management (All dependencies for both programs) ---

# 1. flatcc (for FlatBuffers)
FetchContent_Declare(
    flatcc
    GIT_REPOSITORY https://github.com/dvidelabs/flatcc.git
    GIT_TAG        v0.6.1 # Using a stable tag is recommended
)
FetchContent_MakeAvailable(flatcc)

# 2. tomlc99 (for TOML parsing, used by 'styles')
FetchContent_Declare(
    tomlc99
    GIT_REPOSITORY https://github.com/cktan/tomlc99.git
    GIT_TAG        master
)
FetchContent_GetProperties(tomlc99)
if(NOT tomlc99_POPULATED)
    FetchContent_Populate(tomlc99)
endif()

# 3. libuv (for async I/O, used by 'dx-styles')
FetchContent_Declare(
    libuv
    GIT_REPOSITORY https://github.com/libuv/libuv.git
    GIT_TAG        v1.48.0
)
FetchContent_MakeAvailable(libuv)

# 4. tree-sitter (core parsing library, used by 'dx-styles')
FetchContent_Declare(
    tree-sitter
    GIT_REPOSITORY https://github.com/tree-sitter/tree-sitter.git
    GIT_TAG        v0.22.6
)
FetchContent_MakeAvailable(tree-sitter)

# 5. tree-sitter-typescript (TSX grammar, used by 'dx-styles')
FetchContent_Declare(
    tree-sitter-typescript
    GIT_REPOSITORY https://github.com/tree-sitter/tree-sitter-typescript.git
    GIT_TAG        master
)
FetchContent_GetProperties(tree-sitter-typescript)
if(NOT tree-sitter-typescript_POPULATED)
    FetchContent_Populate(tree-sitter-typescript)
    add_library(tree-sitter-tsx STATIC
        ${tree-sitter-typescript_SOURCE_DIR}/tsx/src/parser.c
        ${tree-sitter-typescript_SOURCE_DIR}/tsx/src/scanner.c
    )
    target_include_directories(tree-sitter-tsx PUBLIC ${tree-sitter_SOURCE_DIR}/lib/include)
endif()


# --- Code Generation (FlatBuffers, used by both) ---
set(FBS_SCHEMA "${CMAKE_CURRENT_SOURCE_DIR}/styles.fbs")
set(GENERATED_HEADER_DIR "${CMAKE_CURRENT_BINARY_DIR}")
set(GENERATED_HEADER "${GENERATED_HEADER_DIR}/styles_generated.h")

add_custom_command(
    OUTPUT ${GENERATED_HEADER}
    COMMAND $<TARGET_FILE:flatcc> -a -o ${GENERATED_HEADER_DIR} ${FBS_SCHEMA}
    DEPENDS ${FBS_SCHEMA} flatcc
    COMMENT "Generating FlatBuffers header: styles_generated.h"
)
add_custom_target(GenerateFBSHeader DEPENDS ${GENERATED_HEADER})


# --- Build Executables ---

# Target 1: 'styles' (The TOML to FlatBuffers converter from your Makefile)
# Assumes you have a 'main.c' file for this.
add_executable(styles
    main.c
    ${tomlc99_SOURCE_DIR}/toml.c
)
add_dependencies(styles GenerateFBSHeader)
target_include_directories(styles PRIVATE
    ${tomlc99_SOURCE_DIR}
    ${flatcc_SOURCE_DIR}/include
    ${GENERATED_HEADER_DIR}
)
target_link_libraries(styles PRIVATE flatccrt m)

# Target 2: 'dx-styles' (The original file watcher with tree-sitter)
# Assumes you have a 'dx-styles.c' file for this.
add_executable(dx-styles
    dx-styles.c
)
add_dependencies(dx-styles GenerateFBSHeader)
target_include_directories(dx-styles PRIVATE
    ${flatcc_SOURCE_DIR}/include
    ${tree-sitter_SOURCE_DIR}/lib/include
    ${GENERATED_HEADER_DIR}
)
target_link_libraries(dx-styles PRIVATE
    flatccrt
    uv_a
    tree-sitter
    tree-sitter-tsx
)