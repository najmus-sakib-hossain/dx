#ifndef DX_ID_GENERATOR_H
#define DX_ID_GENERATOR_H

#include "common.h"

void generate_id_prefix(char* buffer, size_t buffer_size, const char* class_name_base);
void get_unique_id(char* buffer, size_t buffer_size, const char* prefix, UsedIdNode** head);
void free_used_id_list(UsedIdNode** head);

#endif