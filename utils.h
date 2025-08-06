#ifndef DX_UTILS_H
#define DX_UTILS_H

#include "common.h"

void sb_init(StringBuilder *sb, size_t initial_capacity);
void sb_append_str(StringBuilder *sb, const char *str);
void sb_append_n(StringBuilder *sb, const char *str, size_t n);
void sb_free(StringBuilder *sb);

int compare_strings(const void* a, const void* b);

#endif