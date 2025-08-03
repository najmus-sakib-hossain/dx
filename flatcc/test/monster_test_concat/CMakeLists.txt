
include(CTest)

set(INC_DIR "${PROJECT_SOURCE_DIR}/include")
set(GEN_DIR "${CMAKE_CURRENT_BINARY_DIR}/generated")
set(FBS_DIR "${PROJECT_SOURCE_DIR}/test/monster_test")
set(GEN_HDR "${GEN_DIR}/monster_test.h")

# Tell the compiler where to find headers
include_directories("${GEN_DIR}" "${INC_DIR}")

# Generate a single concatenated header file with flatcc_cli
add_custom_command(
    OUTPUT ${GEN_HDR}
    COMMAND ${CMAKE_COMMAND} -E make_directory "${GEN_DIR}"
    COMMAND flatcc_cli -cwv --reader -o "${GEN_DIR}" "--outfile=monster_test.h"
            "${FBS_DIR}/attributes.fbs"
            "${FBS_DIR}/include_test2.fbs"
            "${FBS_DIR}/include_test1.fbs"
            "${FBS_DIR}/monster_test.fbs"
    DEPENDS
        flatcc_cli
        "${FBS_DIR}/monster_test.fbs"
        "${FBS_DIR}/include_test1.fbs"
        "${FBS_DIR}/include_test2.fbs"
        "${FBS_DIR}/attributes.fbs"
    COMMENT "Generating concatenated monster_test.h"
    VERBATIM
)

# Custom target to expose the generation step
add_custom_target(gen_monster_test_concat ALL
    DEPENDS ${GEN_HDR}
)

# Build the test executable
add_executable(monster_test_concat monster_test_concat.c)

# Link and depend on generated headers
add_dependencies(monster_test_concat gen_monster_test_concat)
target_link_libraries(monster_test_concat flatccrt)

# Register the test
add_test(monster_test_concat monster_test_concat${CMAKE_EXECUTABLE_SUFFIX})
