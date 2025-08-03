include(CTest)

set(INC_DIR "${PROJECT_SOURCE_DIR}/include")
set(GEN_DIR "${CMAKE_CURRENT_BINARY_DIR}/generated")
set(FBS_DIR "${PROJECT_SOURCE_DIR}/test/monster_test")
set(MON_DATA "${CMAKE_CURRENT_BINARY_DIR}/monsterdata_test.mon")
set(GEN_HDR "${GEN_DIR}/monster_test_reader.h")

include_directories("${GEN_DIR}" "${INC_DIR}")

add_custom_command(
    OUTPUT ${GEN_HDR} ${MON_DATA}
    COMMAND ${CMAKE_COMMAND} -E make_directory "${GEN_DIR}"
    COMMAND ${CMAKE_COMMAND} -E copy
            "${CMAKE_CURRENT_SOURCE_DIR}/monsterdata_test.mon"
            "${MON_DATA}"
    COMMAND flatcc_cli -a -o "${GEN_DIR}" "${FBS_DIR}/monster_test.fbs"
    DEPENDS
        flatcc_cli
        "${FBS_DIR}/monster_test.fbs"
        "${FBS_DIR}/include_test1.fbs"
        "${FBS_DIR}/include_test2.fbs"
        "${CMAKE_CURRENT_SOURCE_DIR}/monsterdata_test.mon"
    COMMENT "Generating headers and copying binary data for flatc compatibility test"
    VERBATIM
)

add_custom_target(gen_flatc_compat ALL
    DEPENDS ${GEN_HDR} ${MON_DATA}
)

add_executable(flatc_compat flatc_compat.c)
add_dependencies(flatc_compat gen_flatc_compat)
target_link_libraries(flatc_compat flatccrt)

add_test(flatc_compat flatc_compat${CMAKE_EXECUTABLE_SUFFIX})
