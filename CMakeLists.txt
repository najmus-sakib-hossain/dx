cmake_minimum_required(VERSION 3.10)
project(dx-styles C)

# Find tomlc99
find_path(TOML_INCLUDE_DIR toml.h PATHS /usr/local/include/tomlc99)
find_library(TOML_LIBRARY NAMES toml tomlc99 PATHS /usr/local/lib)

# Find flatcc
find_path(FLATCC_INCLUDE_DIR flatcc.h PATH_SUFFIXES flatcc)
find_library(FLATCC_LIBRARY NAMES flatccrt PATHS /usr/local/lib)

# Find libuv
find_library(UV_LIBRARY NAMES uv PATHS /usr/lib)

# Find tree-sitter
find_path(TREE_SITTER_INCLUDE_DIR tree_sitter/api.h)
find_library(TREE_SITTER_LIBRARY NAMES tree-sitter ts)

# Find tree-sitter-typescript
find_library(TREE_SITTER_TYPESCRIPT_LIBRARY NAMES tree-sitter-typescript)
if(NOT TREE_SITTER_TYPESCRIPT_LIBRARY)
    message(STATUS "tree-sitter-typescript library not found, using source files directly")
    set(TREE_SITTER_TYPESCRIPT_SOURCES
        ${CMAKE_SOURCE_DIR}/tree-sitter-typescript/typescript/src/parser.c
        ${CMAKE_SOURCE_DIR}/tree-sitter-typescript/typescript/src/scanner.c)
endif()

# Generate FlatBuffers headers
set(FBS_SCHEMA "${CMAKE_CURRENT_SOURCE_DIR}/styles.fbs")
set(FBS_OUTPUT "${CMAKE_CURRENT_SOURCE_DIR}/styles_generated.h")
add_custom_command(
    OUTPUT ${FBS_OUTPUT}
    COMMAND /usr/local/bin/flatcc -a ${FBS_SCHEMA}
    DEPENDS ${FBS_SCHEMA}
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    COMMENT "Generating FlatBuffers headers"
)

# Build generate_styles
add_executable(generate_styles styles.c ${FBS_OUTPUT})
target_include_directories(generate_styles PRIVATE ${TOML_INCLUDE_DIR} ${FLATCC_INCLUDE_DIR})
target_link_libraries(generate_styles PRIVATE ${TOML_LIBRARY} ${FLATCC_LIBRARY})

# Build dx-styles
add_executable(dx-styles dx-styles.c ${FBS_OUTPUT} ${TREE_SITTER_TYPESCRIPT_SOURCES})
target_include_directories(dx-styles PRIVATE 
    ${TOML_INCLUDE_DIR} 
    ${FLATCC_INCLUDE_DIR} 
    ${TREE_SITTER_INCLUDE_DIR}
    ${CMAKE_SOURCE_DIR}/tree-sitter-typescript/typescript/src)
target_link_libraries(dx-styles PRIVATE 
    ${FLATCC_LIBRARY} 
    ${UV_LIBRARY} 
    ${TREE_SITTER_LIBRARY}
    ${TREE_SITTER_TYPESCRIPT_LIBRARY})
