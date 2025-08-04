# Distributed under the OSI-approved BSD 3-Clause License.  See accompanying
# file Copyright.txt or https://cmake.org/licensing for details.

cmake_minimum_required(VERSION 3.5)

file(MAKE_DIRECTORY
  "/workspaces/dx/build/_deps/flatcc-src"
  "/workspaces/dx/build/_deps/flatcc-build"
  "/workspaces/dx/build/_deps/flatcc-subbuild/flatcc-populate-prefix"
  "/workspaces/dx/build/_deps/flatcc-subbuild/flatcc-populate-prefix/tmp"
  "/workspaces/dx/build/_deps/flatcc-subbuild/flatcc-populate-prefix/src/flatcc-populate-stamp"
  "/workspaces/dx/build/_deps/flatcc-subbuild/flatcc-populate-prefix/src"
  "/workspaces/dx/build/_deps/flatcc-subbuild/flatcc-populate-prefix/src/flatcc-populate-stamp"
)

set(configSubDirs )
foreach(subDir IN LISTS configSubDirs)
    file(MAKE_DIRECTORY "/workspaces/dx/build/_deps/flatcc-subbuild/flatcc-populate-prefix/src/flatcc-populate-stamp/${subDir}")
endforeach()
if(cfgdir)
  file(MAKE_DIRECTORY "/workspaces/dx/build/_deps/flatcc-subbuild/flatcc-populate-prefix/src/flatcc-populate-stamp${cfgdir}") # cfgdir has leading slash
endif()
