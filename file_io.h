#ifndef DX_FILE_IO_H
#define DX_FILE_IO_H

#include "common.h"

void *map_file_read(const char *filename, size_t *size);
int write_file_fast(const char *filename, const char *content, size_t content_len);
void free_file_list(FileList* list);

#endif