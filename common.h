#ifndef DX_COMMON_H
#define DX_COMMON_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <stdbool.h>
#include <time.h>

#include <uv.h>
#include "styles_generated.h"

#if defined(_WIN32)
    #define DX_PLATFORM_WINDOWS
    #include <windows.h>
#elif defined(__unix__) || defined(__APPLE__)
    #define DX_PLATFORM_POSIX
    #include <fcntl.h>
    #include <unistd.h>
    #include <sys/stat.h>
    #include <sys/mman.h>
#else
    #define DX_PLATFORM_STANDARD
#endif

#define KNRM  "\x1B[0m"
#define KRED  "\x1B[1;31m"
#define KGRN  "\x1B[32m"
#define KBLU  "\x1B[34m"
#define KMAG  "\x1B[1;35m"
#define KBCYN "\x1B[1;36m"

#define CHECK(x) do { if (!(x)) { fprintf(stderr, "%sFatal Error at %s:%d%s\n", KRED, __FILE__, __LINE__, KNRM); exit(1); } } while (0)

typedef struct {
    char *buffer;
    size_t len;
    size_t capacity;
} StringBuilder;

typedef struct UsedIdNode {
    char* id;
    struct UsedIdNode* next;
} UsedIdNode;

typedef struct {
    char** class_names;
    size_t class_count;
    size_t class_capacity;
    char** injected_ids;
    size_t id_count;
    size_t id_capacity;
} DataLists;

typedef struct {
    char** paths;
    size_t count;
    size_t capacity;
} FileList;

#endif