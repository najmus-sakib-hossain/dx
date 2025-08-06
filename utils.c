#include "utils.h"

void sb_init(StringBuilder *sb, size_t initial_capacity) {
    sb->capacity = initial_capacity > 0 ? initial_capacity : 1024;
    sb->buffer = malloc(sb->capacity);
    CHECK(sb->buffer);
    sb->buffer[0] = '\0';
    sb->len = 0;
}

void sb_append_n(StringBuilder *sb, const char *str, size_t n) {
    if (sb->len + n + 1 > sb->capacity) {
        size_t new_capacity = sb->capacity * 2;
        while (sb->len + n + 1 > new_capacity) { new_capacity *= 2; }
        sb->buffer = realloc(sb->buffer, new_capacity);
        CHECK(sb->buffer);
        sb->capacity = new_capacity;
    }
    memcpy(sb->buffer + sb->len, str, n);
    sb->len += n;
    sb->buffer[sb->len] = '\0';
}

void sb_append_str(StringBuilder *sb, const char *str) {
    sb_append_n(sb, str, strlen(str));
}

void sb_free(StringBuilder *sb) {
    if (sb->buffer) free(sb->buffer);
    sb->buffer = NULL;
    sb->len = 0;
    sb->capacity = 0;
}

int compare_strings(const void* a, const void* b) {
    return strcmp(*(const char**)a, *(const char**)b);
}