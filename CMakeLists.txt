# --- Project Setup ---
cmake_minimum_required(VERSION 3.10)
project(dx-tools C)

# --- Find Pre-installed System Libraries ---
# This section looks for libraries in standard system locations.

# 1. Find flatcc compiler and runtime library
find_program(FLATCC_EXECUTABLE NAMES flatcc HINTS /usr/local/bin)
find_path(FLATCC_INCLUDE_DIR flatcc_flatbuffers.h PATH_SUFFIXES flatcc)
find_library(FLATCC_LIBRARY NAMES flatccrt)

# 2. Find tomlc99
find_path(TOML_INCLUDE_DIR toml.h PATH_SUFFIXES tomlc99)
find_library(TOML_LIBRARY NAMES tomlc99)

# 3. Find libuv
find_library(UV_LIBRARY NAMES uv)

# 4. Find tree-sitter
find_path(TREE_SITTER_INCLUDE_DIR tree_sitter/api.h)
find_library(TREE_SITTER_LIBRARY NAMES tree-sitter)

# 5. Find tree-sitter-typescript
# Note: This assumes the compiled .a or .so file is in a standard library path.
find_library(TREE_SITTER_TSX_LIBRARY NAMES tree-sitter-tsx)

# --- Code Generation (FlatBuffers) ---
set(FBS_SCHEMA "${CMAKE_CURRENT_SOURCE_DIR}/styles.fbs")
set(GENERATED_HEADER_DIR "${CMAKE_CURRENT_BINARY_DIR}")
set(GENERATED_HEADER "${GENERATED_HEADER_DIR}/styles_generated.h")

# Custom command to generate header using the found flatcc executable
add_custom_command(
    OUTPUT ${GENERATED_HEADER}
    COMMAND ${FLATCC_EXECUTABLE} -a -o ${GENERATED_HEADER_DIR} ${FBS_SCHEMA}
    DEPENDS ${FBS_SCHEMA}
    COMMENT "Generating FlatBuffers header: styles_generated.h"
)
add_custom_target(GenerateFBSHeader DEPENDS ${GENERATED_HEADER})


# --- Build Executables ---

# Target 1: 'styles_generator' (TOML to FlatBuffers converter)
add_executable(styles_generator styles_generator.c)
add_dependencies(styles_generator GenerateFBSHeader)
target_include_directories(styles_generator PRIVATE
    ${TOML_INCLUDE_DIR}
    ${FLATCC_INCLUDE_DIR}
    ${GENERATED_HEADER_DIR}
)
target_link_libraries(styles_generator PRIVATE
    ${TOML_LIBRARY}
    ${FLATCC_LIBRARY}
    m
)

# Target 2: 'dx-styles' (File watcher)
add_executable(dx-styles dx-styles.c)
add_dependencies(dx-styles GenerateFBSHeader)
target_include_directories(dx-styles PRIVATE
    ${FLATCC_INCLUDE_DIR}
    ${TREE_SITTER_INCLUDE_DIR}
    ${GENERATED_HEADER_DIR}
)
target_link_libraries(dx-styles PRIVATE
    ${FLATCC_LIBRARY}
    ${UV_LIBRARY}
    ${TREE_SITTER_LIBRARY}
    ${TREE_SITTER_TSX_LIBRARY}
)

# --- Set Final Executable Output Location ---
set_target_properties(styles_generator dx-styles PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR})
