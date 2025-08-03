include(CTest)

set(INC_DIR "${PROJECT_SOURCE_DIR}/include")
set(FBS_DIR "${PROJECT_SOURCE_DIR}/test/monster_test")
set(DATA_SRC "${PROJECT_SOURCE_DIR}/test/flatc_compat")
set(GEN_DIR "${CMAKE_CURRENT_BINARY_DIR}/generated")
set(DATA_DST "${CMAKE_CURRENT_BINARY_DIR}")

include_directories("${GEN_DIR}" "${INC_DIR}")

# Generate FlatBuffers headers and copy required data files
add_custom_command(
    OUTPUT
        "${GEN_DIR}/monster_test_builder.h"
        "${DATA_DST}/monsterdata_test.golden"
        "${DATA_DST}/monsterdata_test.mon"
    COMMAND ${CMAKE_COMMAND} -E make_directory "${GEN_DIR}"
    COMMAND ${CMAKE_COMMAND} -E copy "${DATA_SRC}/monsterdata_test.golden" "${DATA_DST}"
    COMMAND ${CMAKE_COMMAND} -E copy "${DATA_SRC}/monsterdata_test.mon" "${DATA_DST}"
    COMMAND flatcc_cli -av --json -o "${GEN_DIR}" "${FBS_DIR}/monster_test.fbs"
    DEPENDS flatcc_cli
            "${FBS_DIR}/monster_test.fbs"
            "${FBS_DIR}/include_test1.fbs"
            "${FBS_DIR}/include_test2.fbs"
    COMMENT "Generating JSON-compatible headers for monster_test"
)

add_custom_target(gen_monster_test_json
    DEPENDS
        "${GEN_DIR}/monster_test_builder.h"
        "${DATA_DST}/monsterdata_test.golden"
        "${DATA_DST}/monsterdata_test.mon"
)

# JSON parsing tests using the default runtime
foreach(test IN ITEMS
    test_basic_parse
    test_json_parser
    test_json_printer
    test_json
)
    add_executable(${test} ${test}.c)
    add_dependencies(${test} gen_monster_test_json)
    target_link_libraries(${test} flatccrt)
    add_test(${test} ${test}${CMAKE_EXECUTABLE_SUFFIX})
endforeach()

# Runtime sources used for tests that link custom runtime files
set(RTPATH "${PROJECT_SOURCE_DIR}/src/runtime")
set(RTSRC
    "${RTPATH}/builder.c"
    "${RTPATH}/emitter.c"
    "${RTPATH}/refmap.c"
    "${RTPATH}/verifier.c"
    "${RTPATH}/json_parser.c"
    "${RTPATH}/json_printer.c"
)

# Macro for custom runtime JSON tests with specific flags
macro(jstest target compile_flags)
    add_executable(${target} test_json.c ${RTSRC})
    add_dependencies(${target} gen_monster_test_json)
    set_target_properties(${target} PROPERTIES COMPILE_FLAGS "${compile_flags}")
    add_test(${target} ${target}${CMAKE_EXECUTABLE_SUFFIX})
endmacro()

jstest(json_test_uql     "-DFLATCC_JSON_PARSE_ALLOW_UNQUOTED_LIST=1")
jstest(json_test_uql_off "-DFLATCC_JSON_PARSE_ALLOW_UNQUOTED_LIST=0")
jstest(json_test_uq      "-DFLATCC_JSON_PARSE_ALLOW_UNQUOTED=1")
jstest(json_test_uq_off  "-DFLATCC_JSON_PARSE_ALLOW_UNQUOTED=0")
jstest(json_test         "-DFLATCC_JSON_PARSE_WIDE_SPACE=1")
