#include "file_io.h"

void *map_file_read(const char *filename, size_t *size) {
    FILE *fp = fopen(filename, "rb");
    if (!fp) return NULL;
    fseek(fp, 0, SEEK_END);
    *size = ftell(fp);
    fseek(fp, 0, SEEK_SET);
    if (*size == 0) { fclose(fp); return calloc(1, 1); }
    void *buffer = malloc(*size + 1);
    if (!buffer) { fclose(fp); return NULL; }
    fread(buffer, 1, *size, fp);
    ((char*)buffer)[*size] = '\0';
    fclose(fp);
    return buffer;
}

int write_file_fast(const char *filename, const char *content, size_t content_len) {
    FILE *fp = fopen(filename, "wb");
    if (!fp) return -1;
    if (content_len > 0) {
        if (fwrite(content, 1, content_len, fp) != content_len) {
            fclose(fp);
            return -1;
        }
    }
    fclose(fp);
    return 0;
}

void free_file_list(FileList* list) {
    for (size_t i = 0; i < list->count; i++) {
        free(list->paths[i]);
    }
    free(list->paths);
}