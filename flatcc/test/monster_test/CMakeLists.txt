include(CTest)

set(INC_DIR "${PROJECT_SOURCE_DIR}/include")
set(GEN_DIR "${CMAKE_CURRENT_BINARY_DIR}/generated")
set(FBS_DIR "${PROJECT_SOURCE_DIR}/test/monster_test")

# Representative generated output file (acts as build trigger)
set(GEN_HDR "${GEN_DIR}/monster_test_reader.h")

# Explicitly generate FlatBuffers headers
add_custom_command(
    OUTPUT ${GEN_HDR}
    COMMAND ${CMAKE_COMMAND} -E make_directory "${GEN_DIR}"
    COMMAND flatcc_cli -a -o "${GEN_DIR}" "${FBS_DIR}/monster_test.fbs"
    DEPENDS
        flatcc_cli
        "${FBS_DIR}/monster_test.fbs"
        "${FBS_DIR}/include_test1.fbs"
        "${FBS_DIR}/include_test2.fbs"
    COMMENT "Generating FlatCC output for monster_test.fbs"
    VERBATIM
)

# Virtual target representing schema generation
add_custom_target(gen_monster_test ALL
    DEPENDS ${GEN_HDR}
)

# Executable using the generated code
add_executable(monster_test monster_test.c)

# Include directories
target_include_directories(monster_test PRIVATE "${GEN_DIR}" "${INC_DIR}")

# Link + depend
target_link_libraries(monster_test flatccrt)
add_dependencies(monster_test gen_monster_test)

# Test registration
add_test(monster_test monster_test${CMAKE_EXECUTABLE_SUFFIX})
