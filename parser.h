#ifndef DX_PARSER_H
#define DX_PARSER_H

#include "common.h"

int process_file(const char* filename, UsedIdNode** used_ids_head);
void collect_data(DataLists* data, const char* directory);
void free_data_contents(DataLists* data);

#endif