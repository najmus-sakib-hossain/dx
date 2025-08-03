include(CTest)

set(INC_DIR "${PROJECT_SOURCE_DIR}/include")
set(GEN_DIR "${CMAKE_CURRENT_BINARY_DIR}/generated")
set(FBS_DIR "${PROJECT_SOURCE_DIR}/test/doublevec_test")

# Use a reliably generated output file as the trigger
set(GEN_HDR "${GEN_DIR}/doublevec_test_reader.h")

# Custom command to generate headers
add_custom_command(
    OUTPUT ${GEN_HDR}
    COMMAND ${CMAKE_COMMAND} -E make_directory "${GEN_DIR}"
    COMMAND flatcc_cli -a -o "${GEN_DIR}" "${FBS_DIR}/doublevec_test.fbs"
    DEPENDS
        flatcc_cli
        "${FBS_DIR}/doublevec_test.fbs"
    COMMENT "Generating FlatCC output for doublevec_test.fbs"
    VERBATIM
)

# Target representing schema generation
add_custom_target(gen_doublevec_test ALL
    DEPENDS ${GEN_HDR}
)

# Test executable
add_executable(doublevec_test doublevec_test.c)

# Include paths
target_include_directories(doublevec_test PRIVATE "${GEN_DIR}" "${INC_DIR}")

# Link + build order
target_link_libraries(doublevec_test flatccrt)
add_dependencies(doublevec_test gen_doublevec_test)

# Register the test
add_test(doublevec_test doublevec_test${CMAKE_EXECUTABLE_SUFFIX})
