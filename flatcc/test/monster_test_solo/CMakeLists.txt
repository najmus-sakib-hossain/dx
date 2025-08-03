include(CTest)

set(INC_DIR "${PROJECT_SOURCE_DIR}/include")
set(GEN_DIR "${CMAKE_CURRENT_BINARY_DIR}/generated")
set(FBS_DIR "${PROJECT_SOURCE_DIR}/test/monster_test")
set(GEN_HDR "${GEN_DIR}/monster_test.h")

# Tell CMake where to look for includes
include_directories("${GEN_DIR}" "${INC_DIR}")

# Create a custom command that generates the header using stdout redirection
add_custom_command(
    OUTPUT ${GEN_HDR}
    COMMAND ${CMAKE_COMMAND} -E make_directory "${GEN_DIR}"
    COMMAND flatcc_cli -cwv --reader --stdout
            "${FBS_DIR}/attributes.fbs"
            "${FBS_DIR}/include_test2.fbs"
            "${FBS_DIR}/include_test1.fbs"
            "${FBS_DIR}/monster_test.fbs"
            > "${GEN_HDR}"
    DEPENDS
        flatcc_cli
        "${FBS_DIR}/monster_test.fbs"
        "${FBS_DIR}/include_test1.fbs"
        "${FBS_DIR}/include_test2.fbs"
        "${FBS_DIR}/attributes.fbs"
    COMMENT "Generating monster_test.h using flatcc_cli --stdout"
    VERBATIM
)

# Create a target that depends on the generated header
add_custom_target(gen_monster_test_solo ALL
    DEPENDS ${GEN_HDR}
)

# Build the test executable
add_executable(monster_test_solo monster_test_solo.c)

# Ensure the test target builds after the generated header exists
add_dependencies(monster_test_solo gen_monster_test_solo)

# Link against flatcc runtime
target_link_libraries(monster_test_solo flatccrt)

# Register the test
add_test(monster_test_solo monster_test_solo${CMAKE_EXECUTABLE_SUFFIX})
