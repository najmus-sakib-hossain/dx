include(CTest)

set(INC_DIR "${PROJECT_SOURCE_DIR}/include")
set(GEN_DIR "${CMAKE_CURRENT_BINARY_DIR}/generated")
set(FBS_DIR "${PROJECT_SOURCE_DIR}/test/monster_test")
set(FBS_FILES
    "${FBS_DIR}/monster_test.fbs"
    "${FBS_DIR}/include_test1.fbs"
    "${FBS_DIR}/include_test2.fbs"
)

include_directories("${GEN_DIR}" "${INC_DIR}")

# Generate headers (example: monster_test_reader.h is a known generated file)
add_custom_command(
    OUTPUT "${GEN_DIR}/monster_test_reader.h"
    COMMAND ${CMAKE_COMMAND} -E make_directory "${GEN_DIR}"
    COMMAND flatcc_cli -a -o "${GEN_DIR}" ${FBS_FILES}
    DEPENDS flatcc_cli ${FBS_FILES}
    COMMENT "Generating FlatCC headers for load_test"
)

add_custom_target(gen_load_test ALL DEPENDS "${GEN_DIR}/monster_test_reader.h")

add_executable(load_test load_test.c)
add_dependencies(load_test gen_load_test)
target_link_libraries(load_test flatccrt)

add_test(load_test load_test${CMAKE_EXECUTABLE_SUFFIX})
