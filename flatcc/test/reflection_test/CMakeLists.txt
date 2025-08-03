include(CTest)

set(INC_DIR "${PROJECT_SOURCE_DIR}/include")
set(GEN_DIR "${CMAKE_CURRENT_BINARY_DIR}/generated")
set(FBS_DIR "${PROJECT_SOURCE_DIR}/test/monster_test")

# Expected generated binary schema file
set(GEN_SCHEMA "${GEN_DIR}/monster_test.bfbs")

add_custom_command(
    OUTPUT ${GEN_SCHEMA}
    COMMAND ${CMAKE_COMMAND} -E make_directory "${GEN_DIR}"
    COMMAND flatcc_cli --schema -o "${GEN_DIR}" "${FBS_DIR}/monster_test.fbs"
    DEPENDS
        flatcc_cli
        "${FBS_DIR}/monster_test.fbs"
        "${FBS_DIR}/include_test1.fbs"
        "${FBS_DIR}/include_test2.fbs"
    COMMENT "Generating FlatCC binary schema for reflection test"
    VERBATIM
)

add_custom_target(gen_reflection_test ALL
    DEPENDS ${GEN_SCHEMA}
)

add_executable(reflection_test reflection_test.c)

target_include_directories(reflection_test PRIVATE "${GEN_DIR}" "${INC_DIR}")
target_link_libraries(reflection_test flatccrt)
add_dependencies(reflection_test gen_reflection_test)

add_test(reflection_test reflection_test${CMAKE_EXECUTABLE_SUFFIX})
