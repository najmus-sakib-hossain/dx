include(CTest)

set(INC_DIR "${PROJECT_SOURCE_DIR}/include")
set(GEN_DIR "${CMAKE_CURRENT_BINARY_DIR}/generated")
set(FBS_DIR "${PROJECT_SOURCE_DIR}/test/emit_test")
set(FBS "${FBS_DIR}/emit_test.fbs")

include_directories("${GEN_DIR}" "${INC_DIR}")

# Generate headers for emit_test.fbs
add_custom_command(
    OUTPUT "${GEN_DIR}/emit_test_builder.h"
    COMMAND ${CMAKE_COMMAND} -E make_directory "${GEN_DIR}"
    COMMAND flatcc_cli -a -o "${GEN_DIR}" "${FBS}"
    DEPENDS flatcc_cli "${FBS}"
    COMMENT "Generating code from emit_test.fbs"
)

add_custom_target(gen_emit_test ALL
    DEPENDS "${GEN_DIR}/emit_test_builder.h"
)

# Build and link the test
add_executable(emit_test emit_test.c)
add_dependencies(emit_test gen_emit_test)
target_link_libraries(emit_test flatccrt)

# Register test with CTest
add_test(emit_test emit_test${CMAKE_EXECUTABLE_SUFFIX})
