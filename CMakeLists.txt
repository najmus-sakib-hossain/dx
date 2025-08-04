# --- Project Setup ---
cmake_minimum_required(VERSION 3.14)
project(dx-tools C)

# Include FetchContent for downloading missing dependencies
include(FetchContent)

# --- Dependency Management ---
# This section checks for local directories first before downloading.

# 1. flatcc (for FlatBuffers)
if(EXISTS "${CMAKE_SOURCE_DIR}/flatcc/CMakeLists.txt")
    message(STATUS "Found local flatcc, using add_subdirectory.")
    add_subdirectory(${CMAKE_SOURCE_DIR}/flatcc)
else()
    message(STATUS "Local flatcc not found, using FetchContent.")
    FetchContent_Declare(
        flatcc
        GIT_REPOSITORY https://github.com/dvidelabs/flatcc.git
        GIT_TAG        v0.6.1
    )
    FetchContent_MakeAvailable(flatcc)
endif()

# 2. tomlc99 (for TOML parsing)
if(EXISTS "${CMAKE_SOURCE_DIR}/tomlc99/toml.c")
    message(STATUS "Found local tomlc99, creating library.")
    add_library(tomlc99 STATIC ${CMAKE_SOURCE_DIR}/tomlc99/toml.c)
    set(TOMLC99_INCLUDE_DIR ${CMAKE_SOURCE_DIR}/tomlc99)
else()
    message(STATUS "Local tomlc99 not found, using FetchContent.")
    FetchContent_Declare(
        tomlc99
        GIT_REPOSITORY https://github.com/cktan/tomlc99.git
        GIT_TAG        master
    )
    FetchContent_Populate(tomlc99)
    add_library(tomlc99 STATIC ${tomlc99_SOURCE_DIR}/toml.c)
    set(TOMLC99_INCLUDE_DIR ${tomlc99_SOURCE_DIR})
endif()

# 3. libuv (for async I/O)
if(EXISTS "${CMAKE_SOURCE_DIR}/libuv/CMakeLists.txt")
    message(STATUS "Found local libuv, using add_subdirectory.")
    add_subdirectory(${CMAKE_SOURCE_DIR}/libuv)
else()
    message(STATUS "Local libuv not found, using FetchContent.")
    FetchContent_Declare(
        libuv
        GIT_REPOSITORY https://github.com/libuv/libuv.git
        GIT_TAG        v1.48.0
    )
    FetchContent_MakeAvailable(libuv)
endif()

# 4. tree-sitter (core parsing library)
if(EXISTS "${CMAKE_SOURCE_DIR}/tree-sitter/CMakeLists.txt")
    message(STATUS "Found local tree-sitter, using add_subdirectory.")
    add_subdirectory(${CMAKE_SOURCE_DIR}/tree-sitter)
else()
    message(STATUS "Local tree-sitter not found, using FetchContent.")
    FetchContent_Declare(
        tree-sitter
        GIT_REPOSITORY https://github.com/tree-sitter/tree-sitter.git
        GIT_TAG        v0.22.6
    )
    FetchContent_MakeAvailable(tree-sitter)
endif()

# 5. tree-sitter-typescript (TSX grammar)
if(EXISTS "${CMAKE_SOURCE_DIR}/tree-sitter-typescript/tsx/src/parser.c")
    message(STATUS "Found local tree-sitter-typescript, creating library.")
    set(TS_TSX_SRC_DIR ${CMAKE_SOURCE_DIR}/tree-sitter-typescript/tsx/src)
else()
    message(STATUS "Local tree-sitter-typescript not found, using FetchContent.")
    FetchContent_Declare(
        tree-sitter-typescript
        GIT_REPOSITORY https://github.com/tree-sitter/tree-sitter-typescript.git
        GIT_TAG        master
    )
    FetchContent_Populate(tree-sitter-typescript)
    set(TS_TSX_SRC_DIR ${tree-sitter-typescript_SOURCE_DIR}/tsx/src)
endif()
add_library(tree-sitter-tsx STATIC ${TS_TSX_SRC_DIR}/parser.c ${TS_TSX_SRC_DIR}/scanner.c)
target_include_directories(tree-sitter-tsx PUBLIC ${tree-sitter_SOURCE_DIR}/lib/include)


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

# Target 1: 'styles' (TOML to FlatBuffers converter)
add_executable(styles main.c)
add_dependencies(styles GenerateFBSHeader)
target_include_directories(styles PRIVATE
    ${TOMLC99_INCLUDE_DIR}
    ${flatcc_SOURCE_DIR}/include
    ${GENERATED_HEADER_DIR}
)
target_link_libraries(styles PRIVATE styles tomlc99 flatccrt m)

# Target 2: 'dx-styles' (File watcher)
add_executable(dx-styles dx-styles.c)
add_dependencies(dx-styles GenerateFBSHeader)
target_include_directories(dx-styles PRIVATE
    ${flatcc_SOURCE_DIR}/include
    ${tree-sitter_SOURCE_DIR}/lib/include
    ${GENERATED_HEADER_DIR}
)
target_link_libraries(dx-styles PRIVATE flatccrt uv_a tree-sitter tree-sitter-tsx)

# --- Set Final Executable Output Location ---
# This explicitly places the final programs in your project's root directory.
set_target_properties(styles dx-styles PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR})
