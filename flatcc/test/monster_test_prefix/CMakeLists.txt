include(CTest)

set(INC_DIR "${PROJECT_SOURCE_DIR}/include")
set(GEN_DIR "${CMAKE_CURRENT_BINARY_DIR}/generated")
set(FBS_DIR "${PROJECT_SOURCE_DIR}/test/monster_test")
set(GEN_HDR "${GEN_DIR}/zzz_monster_test.h")

include_directories("${GEN_DIR}" "${INC_DIR}")

add_custom_command(
    OUTPUT ${GEN_HDR}
    COMMAND ${CMAKE_COMMAND} -E make_directory "${GEN_DIR}"
    COMMAND flatcc_cli -a --prefix=zzz_ --stdout
            "${FBS_DIR}/monster_test.fbs"
            > "${GEN_HDR}"
    DEPENDS
        flatcc_cli
        "${FBS_DIR}/monster_test.fbs"
        "${FBS_DIR}/include_test1.fbs"
        "${FBS_DIR}/include_test2.fbs"
    COMMENT "Generating monster_test.h with --prefix zzz_ and --stdout"
    VERBATIM
)

add_custom_target(gen_monster_test_prefix ALL
    DEPENDS ${GEN_HDR}
)

add_executable(monster_test_prefix monster_test_prefix.c)
add_dependencies(monster_test_prefix gen_monster_test_prefix)
target_link_libraries(monster_test_prefix flatccrt)

add_test(monster_test_prefix monster_test_prefix${CMAKE_EXECUTABLE_SUFFIX})
