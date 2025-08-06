#include "parser.h"
#include "file_io.h"
#include "utils.h"
#include "id_generator.h"

static bool is_dx_id(const char* id) {
    size_t len = strlen(id);
    if (len < 1) return false;
    
    size_t i = 0;
    while(i < len && isalpha(id[i])) i++;
    if (i == 0) return false;
    while(i < len && isdigit(id[i])) i++;
    
    return i == len;
}

int process_file(const char* filename, UsedIdNode** used_ids_head) {
    size_t size;
    char *source = map_file_read(filename, &size);
    if (!source) return 0;

    StringBuilder sb;
    sb_init(&sb, size + 4096);
    const char *cursor = source;

    while (*cursor) {
        const char *class_name_ptr = strstr(cursor, "className=");
        if (!class_name_ptr) {
            sb_append_str(&sb, cursor);
            break;
        }

        const char *tag_start = NULL;
        for (const char *p = class_name_ptr; p >= source; --p) {
            if (*p == '<') {
                tag_start = p;
                break;
            }
        }
        if (!tag_start) {
            sb_append_n(&sb, cursor, class_name_ptr - cursor + 1);
            cursor = class_name_ptr + 1;
            continue;
        }

        const char *tag_end = strchr(tag_start, '>');
        if (!tag_end) {
            sb_append_str(&sb, cursor);
            break;
        }

        sb_append_n(&sb, cursor, tag_start - cursor);

        const char *class_val_start = strchr(class_name_ptr, '"') + 1;
        const char *class_val_end = strchr(class_val_start, '"');
        if (!class_val_start || !class_val_end || class_val_end > tag_end) {
            sb_append_n(&sb, tag_start, tag_end - tag_start + 1);
            cursor = tag_end + 1;
            continue;
        }
        size_t class_name_len = class_val_end - class_val_start;
        char class_name_val[512];
        if (class_name_len < sizeof(class_name_val)) {
            strncpy(class_name_val, class_val_start, class_name_len);
            class_name_val[class_name_len] = '\0';
        } else {
            sb_append_n(&sb, tag_start, tag_end - tag_start + 1);
            cursor = tag_end + 1;
            continue;
        }

        char id_prefix[8];
        generate_id_prefix(id_prefix, sizeof(id_prefix), class_name_val);

        char final_id[512];
        get_unique_id(final_id, sizeof(final_id), id_prefix, used_ids_head);

        const char *id_ptr = NULL;
        for (const char* p = tag_start; p < tag_end; ++p) {
            if ((*p == ' ' || *p == '<') && strncmp(p + 1, "id=", 3) == 0) {
                id_ptr = p + 1;
                break;
            }
        }
        
        if (id_ptr) {
            const char* id_val_start = strchr(id_ptr, '"') + 1;
            const char* id_val_end = strchr(id_val_start, '"');

            if (!id_val_start || !id_val_end || id_val_end > tag_end) {
                sb_append_n(&sb, tag_start, tag_end - tag_start + 1);
            } else {
                sb_append_n(&sb, tag_start, id_val_start - tag_start);
                sb_append_str(&sb, final_id);
                sb_append_n(&sb, id_val_end, tag_end - id_val_end + 1);
            }
        } else {
            const char* injection_point = class_val_end + 1;
            sb_append_n(&sb, tag_start, injection_point - tag_start);
            char id_attr[576];
            snprintf(id_attr, sizeof(id_attr), " id=\"%s\"", final_id);
            sb_append_str(&sb, id_attr);
            sb_append_n(&sb, injection_point, tag_end - injection_point + 1);
        }

        cursor = tag_end + 1;
    }
    
    int changes_made = 0;
    if (sb.len != size || strcmp(source, sb.buffer) != 0) {
        write_file_fast(filename, sb.buffer, sb.len);
        changes_made = 1;
    }
    
    sb_free(&sb);
    free(source);
    return changes_made;
}


void collect_data(DataLists* data, const char* directory) {
    memset(data, 0, sizeof(DataLists));
    
    uv_fs_t scan_req;
    uv_fs_scandir(NULL, &scan_req, directory, 0, NULL);

    uv_dirent_t dirent;
    while (UV_EOF != uv_fs_scandir_next(&scan_req, &dirent)) {
        if (dirent.type == UV_DIRENT_FILE && strstr(dirent.name, ".tsx")) {
            char full_path[512];
            snprintf(full_path, sizeof(full_path), "%s/%s", directory, dirent.name);
            
            size_t size;
            char* source = map_file_read(full_path, &size);
            if(!source) continue;

            const char* cursor = source;
            while((cursor = strstr(cursor, "className=\""))) {
                cursor += 11; // strlen("className=\"")
                const char* end = strchr(cursor, '"');
                if(!end) break;
                
                char class_str_buffer[512];
                if(end - cursor < sizeof(class_str_buffer)) {
                    strncpy(class_str_buffer, cursor, end - cursor);
                    class_str_buffer[end - cursor] = '\0';
                    
                    char* token = strtok(class_str_buffer, " ");
                    while(token) {
                        bool found = false;
                        for (size_t j = 0; j < data->class_count; j++) {
                            if (strcmp(data->class_names[j], token) == 0) {
                                found = true;
                                break;
                            }
                        }

                        if (!found) {
                            if (data->class_count >= data->class_capacity) {
                                data->class_capacity = data->class_capacity == 0 ? 16 : data->class_capacity * 2;
                                data->class_names = realloc(data->class_names, data->class_capacity * sizeof(char*));
                                CHECK(data->class_names);
                            }
                            data->class_names[data->class_count++] = strdup(token);
                            CHECK(data->class_names[data->class_count - 1]);
                        }
                        token = strtok(NULL, " ");
                    }
                }
                cursor = end;
            }
            
            cursor = source;
            while((cursor = strstr(cursor, "id=\""))) {
                cursor += 4; // strlen("id=\"")
                const char* end = strchr(cursor, '"');
                if(!end) break;
                
                size_t len = end - cursor;
                char id_val[256];
                if (len < sizeof(id_val)) {
                    strncpy(id_val, cursor, len);
                    id_val[len] = '\0';
                    if (is_dx_id(id_val)) {
                        bool found = false;
                        for (size_t k = 0; k < data->id_count; k++) {
                            if (strcmp(data->injected_ids[k], id_val) == 0) {
                                found = true;
                                break;
                            }
                        }

                        if (!found) {
                            if (data->id_count >= data->id_capacity) {
                                data->id_capacity = data->id_capacity == 0 ? 16 : data->id_capacity * 2;
                                data->injected_ids = realloc(data->injected_ids, data->id_capacity * sizeof(char*));
                                CHECK(data->injected_ids);
                            }
                            data->injected_ids[data->id_count++] = strdup(id_val);
                            CHECK(data->injected_ids[data->id_count - 1]);
                        }
                    }
                }
                cursor = end;
            }
            free(source);
        }
    }
    uv_fs_req_cleanup(&scan_req);
}

void free_data_contents(DataLists* data) {
    if (!data) return;
    for(size_t i = 0; i < data->class_count; i++) free(data->class_names[i]);
    for(size_t i = 0; i < data->id_count; i++) free(data->injected_ids[i]);
    free(data->class_names);
    free(data->injected_ids);
    memset(data, 0, sizeof(DataLists));
}