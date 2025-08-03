cmake_minimum_required(VERSION 3.10)
project(dx-styles C)

# Find tomlc99
find_path(TOML_INCLUDE_DIR toml.h PATHS /usr/local/include/tomlc99)
find_library(TOML_LIBRARY NAMES toml tomlc99 PATHS /usr/local/lib)

# Find flatcc
find_path(FLATCC_INCLUDE_DIR flatcc/flatcc.h PATHS /usr/local/include)
find_library(FLATCC_LIBRARY NAMES flatccrt PATHS /usr/local/lib)

# Generate FlatBuffers headers
set(FBS_SCHEMA "${CMAKE_CURRENT_SOURCE_DIR}/styles.fbs")
set(FBS_OUTPUT "${CMAKE_CURRENT_SOURCE_DIR}/styles_generated.h")
add_custom_command(
    OUTPUT ${FBS_OUTPUT}
    COMMAND flatcc --outfile ${FBS_OUTPUT} -a ${FBS_SCHEMA}
    DEPENDS ${FBS_SCHEMA}
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    COMMENT "Generating FlatBuffers headers"
)

# Copy styles.toml to build directory
configure_file(${CMAKE_CURRENT_SOURCE_DIR}/styles.toml
               ${CMAKE_CURRENT_BINARY_DIR}/styles.toml COPYONLY)

# Build executable
add_executable(generate_styles styles.c ${FBS_OUTPUT})
target_include_directories(generate_styles PRIVATE ${TOML_INCLUDE_DIR} ${FLATCC_INCLUDE_DIR} ${CMAKE_CURRENT_SOURCE_DIR})
target_link_libraries(generate_styles PRIVATE ${TOML_LIBRARY} ${FLATCC_LIBRARY})
