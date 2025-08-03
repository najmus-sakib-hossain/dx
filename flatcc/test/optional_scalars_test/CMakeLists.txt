include(CTest)

set(INC_DIR "${PROJECT_SOURCE_DIR}/include")
set(GEN_DIR "${CMAKE_CURRENT_BINARY_DIR}/generated")
set(FBS_DIR "${PROJECT_SOURCE_DIR}/test/optional_scalars_test")

# Known generated file (acts as build trigger)
set(GEN_HDR "${GEN_DIR}/optional_scalars_test_reader.h")

# Custom command to generate the FlatBuffers headers
add_custom_command(
    OUTPUT ${GEN_HDR}
    COMMAND ${CMAKE_COMMAND} -E make_directory "${GEN_DIR}"
    COMMAND flatcc_cli -a --json -o "${GEN_DIR}" "${FBS_DIR}/optional_scalars_test.fbs"
    DEPENDS
        flatcc_cli
        "${FBS_DIR}/optional_scalars_test.fbs"
    COMMENT "Generating FlatCC output for optional_scalars_test.fbs"
    VERBATIM
)

# Schema generation target
add_custom_target(gen_optional_scalars_test ALL
    DEPENDS ${GEN_HDR}
)

# Test executable
add_executable(optional_scalars_test optional_scalars_test.c)

# Includes and linking
target_include_directories(optional_scalars_test PRIVATE "${GEN_DIR}" "${INC_DIR}")
target_link_libraries(optional_scalars_test flatccrt)
add_dependencies(optional_scalars_test gen_optional_scalars_test)

# Test registration
add_test(optional_scalars_test optional_scalars_test${CMAKE_EXECUTABLE_SUFFIX})
