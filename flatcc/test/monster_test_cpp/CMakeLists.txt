include(CTest)

# According to the C++ standard ISO/IEC 14882:2024 §6.9.3.1,
# 'main' with C language linkage is ill-formed.
# Suppress warning when including C file with main from extern "C"
if (CMAKE_CXX_COMPILER_ID MATCHES "Clang")
    add_compile_options(-Wno-main)
endif()

set(INC_DIR "${PROJECT_SOURCE_DIR}/include")
set(GEN_DIR "${CMAKE_CURRENT_BINARY_DIR}/generated/monster_test_cpp")
set(FBS_DIR "${PROJECT_SOURCE_DIR}/samples/monster")

include_directories("${GEN_DIR}" "${INC_DIR}")

# Pick a representative generated file as output anchor
set(GEN_HDR "${GEN_DIR}/monster_test_reader.h")

add_custom_command(
    OUTPUT ${GEN_HDR}
    COMMAND ${CMAKE_COMMAND} -E make_directory "${GEN_DIR}"
    COMMAND flatcc_cli -a -o "${GEN_DIR}" "${FBS_DIR}/monster.fbs"
    DEPENDS flatcc_cli "${FBS_DIR}/monster.fbs"
    COMMENT "Generating headers for monster_test_cpp"
    VERBATIM
)

add_custom_target(gen_monster_test_cpp ALL
    DEPENDS ${GEN_HDR}
)

add_executable(monster_test_cpp monster_test.cpp)
add_dependencies(monster_test_cpp gen_monster_test_cpp)
target_link_libraries(monster_test_cpp flatccrt)

add_test(monster_test_cpp monster_test_cpp${CMAKE_EXECUTABLE_SUFFIX})
