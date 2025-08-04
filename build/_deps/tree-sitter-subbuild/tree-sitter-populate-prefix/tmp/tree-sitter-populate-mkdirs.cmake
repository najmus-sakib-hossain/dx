# Distributed under the OSI-approved BSD 3-Clause License.  See accompanying
# file Copyright.txt or https://cmake.org/licensing for details.

cmake_minimum_required(VERSION 3.5)

file(MAKE_DIRECTORY
  "/workspaces/dx/build/_deps/tree-sitter-src"
  "/workspaces/dx/build/_deps/tree-sitter-build"
  "/workspaces/dx/build/_deps/tree-sitter-subbuild/tree-sitter-populate-prefix"
  "/workspaces/dx/build/_deps/tree-sitter-subbuild/tree-sitter-populate-prefix/tmp"
  "/workspaces/dx/build/_deps/tree-sitter-subbuild/tree-sitter-populate-prefix/src/tree-sitter-populate-stamp"
  "/workspaces/dx/build/_deps/tree-sitter-subbuild/tree-sitter-populate-prefix/src"
  "/workspaces/dx/build/_deps/tree-sitter-subbuild/tree-sitter-populate-prefix/src/tree-sitter-populate-stamp"
)

set(configSubDirs )
foreach(subDir IN LISTS configSubDirs)
    file(MAKE_DIRECTORY "/workspaces/dx/build/_deps/tree-sitter-subbuild/tree-sitter-populate-prefix/src/tree-sitter-populate-stamp/${subDir}")
endforeach()
if(cfgdir)
  file(MAKE_DIRECTORY "/workspaces/dx/build/_deps/tree-sitter-subbuild/tree-sitter-populate-prefix/src/tree-sitter-populate-stamp${cfgdir}") # cfgdir has leading slash
endif()
