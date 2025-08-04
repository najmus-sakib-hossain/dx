# Distributed under the OSI-approved BSD 3-Clause License.  See accompanying
# file Copyright.txt or https://cmake.org/licensing for details.

cmake_minimum_required(VERSION 3.5)

file(MAKE_DIRECTORY
  "/workspaces/dx/build/_deps/tree-sitter-typescript-src"
  "/workspaces/dx/build/_deps/tree-sitter-typescript-build"
  "/workspaces/dx/build/_deps/tree-sitter-typescript-subbuild/tree-sitter-typescript-populate-prefix"
  "/workspaces/dx/build/_deps/tree-sitter-typescript-subbuild/tree-sitter-typescript-populate-prefix/tmp"
  "/workspaces/dx/build/_deps/tree-sitter-typescript-subbuild/tree-sitter-typescript-populate-prefix/src/tree-sitter-typescript-populate-stamp"
  "/workspaces/dx/build/_deps/tree-sitter-typescript-subbuild/tree-sitter-typescript-populate-prefix/src"
  "/workspaces/dx/build/_deps/tree-sitter-typescript-subbuild/tree-sitter-typescript-populate-prefix/src/tree-sitter-typescript-populate-stamp"
)

set(configSubDirs )
foreach(subDir IN LISTS configSubDirs)
    file(MAKE_DIRECTORY "/workspaces/dx/build/_deps/tree-sitter-typescript-subbuild/tree-sitter-typescript-populate-prefix/src/tree-sitter-typescript-populate-stamp/${subDir}")
endforeach()
if(cfgdir)
  file(MAKE_DIRECTORY "/workspaces/dx/build/_deps/tree-sitter-typescript-subbuild/tree-sitter-typescript-populate-prefix/src/tree-sitter-typescript-populate-stamp${cfgdir}") # cfgdir has leading slash
endif()
