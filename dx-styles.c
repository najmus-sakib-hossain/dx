#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <stdbool.h>
#include <time.h>

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

#include <uv.h>
#include "styles_generated.h"

#define KNRM  "\x1B[0m"
#define KRED  "\x1B[1;31m"
#define KGRN  "\x1B[32m"
#define KBLU  "\x1B[34m"
#define KMAG  "\x1B[1;35m"
#define KBCYN "\x1B[1;36m"

#define CHECK(x) do { if (!(x)) { fprintf(stderr, "%sFatal Error at %s:%d%s\n", KRED, __FILE__, __LINE__, KNRM); exit(1); } } while (0)

uv_loop_t *loop;
uv_timer_t debounce_timer;
char* last_changed_file = NULL;

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

DataLists previous_data = {0};

void sb_init(StringBuilder *sb, size_t initial_capacity);
void sb_append_str(StringBuilder *sb, const char *str);
void sb_append_n(StringBuilder *sb, const char *str, size_t n);
void sb_free(StringBuilder *sb);

void generate_id_prefix(char* buffer, size_t buffer_size, const char* class_name_base) {
    buffer[0] = '\0';
    size_t prefix_len = 0;
    bool new_word = true;
    char temp_prefix[8] = {0};

    for (const char* p = class_name_base; *p && prefix_len < 7; ++p) {
        if (isspace((unsigned char)*p)) {
            new_word = true;
        } else if (new_word) {
            temp_prefix[prefix_len++] = tolower((unsigned char)*p);
            new_word = false;
        }
    }
    strncpy(buffer, temp_prefix, buffer_size);
}

bool is_id_used(UsedIdNode* head, const char* id) {
    UsedIdNode* current = head;
    while (current != NULL) {
        if (strcmp(current->id, id) == 0) {
            return true;
        }
        current = current->next;
    }
    return false;
}

void add_used_id(UsedIdNode** head, const char* id) {
    UsedIdNode* new_node = (UsedIdNode*)malloc(sizeof(UsedIdNode));
    CHECK(new_node);
    new_node->id = strdup(id);
    CHECK(new_node->id);
    new_node->next = *head;
    *head = new_node;
}

void get_unique_id(char* buffer, size_t buffer_size, const char* prefix, UsedIdNode** head) {
    if (!is_id_used(*head, prefix)) {
        strncpy(buffer, prefix, buffer_size);
        add_used_id(head, buffer);
        return;
    }

    int count = 1;
    while (true) {
        snprintf(buffer, buffer_size, "%s%d", prefix, count);
        if (!is_id_used(*head, buffer)) {
            add_used_id(head, buffer);
            return;
        }
        count++;
    }
}

void free_used_id_list(UsedIdNode** head) {
    UsedIdNode* current = *head;
    while (current != NULL) {
        UsedIdNode* next = current->next;
        free(current->id);
        free(current);
        current = next;
    }
    *head = NULL;
}

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
            if ((*p == ' ' || *p == '<') && p[1] == 'i' && p[2] == 'd' && p[3] == '=') {
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


bool is_dx_id(const char* id) {
    size_t len = strlen(id);
    if (len < 1) return false;
    
    size_t i = 0;
    while(i < len && isalpha(id[i])) i++;
    if (i == 0) return false;
    while(i < len && isdigit(id[i])) i++;
    
    return i == len;
}

void collect_data(DataLists* data) {
    data->class_names = NULL;
    data->injected_ids = NULL;
    data->class_count = 0;
    data->id_count = 0;
    data->class_capacity = 0;
    data->id_capacity = 0;
    
    uv_fs_t scan_req;
    uv_fs_scandir(NULL, &scan_req, "./src", 0, NULL);

    uv_dirent_t dirent;
    while (UV_EOF != uv_fs_scandir_next(&scan_req, &dirent)) {
        if (dirent.type == UV_DIRENT_FILE && strstr(dirent.name, ".tsx")) {
            char full_path[512];
            snprintf(full_path, sizeof(full_path), "./src/%s", dirent.name);
            
            size_t size;
            char* source = map_file_read(full_path, &size);
            if(!source) continue;

            const char* cursor = source;
            while((cursor = strstr(cursor, "className=\""))) {
                cursor += 11;
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
                cursor += 4;
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

void write_final_css(const char* filename, DataLists* data, void* styles_buffer) {
    StringBuilder sb;
    sb_init(&sb, 8192);
    char temp_buffer[1024];
    
    Styles_table_t styles = Styles_as_root(styles_buffer);
    StaticRule_vec_t static_rules = Styles_static_rules(styles);

    for (size_t i = 0; i < data->class_count; i++) {
        const char* current_class = data->class_names[i];
        for (size_t j = 0; j < StaticRule_vec_len(static_rules); j++) {
            StaticRule_table_t rule = StaticRule_vec_at(static_rules, j);
            if (strcmp(current_class, StaticRule_name(rule)) == 0) {
                snprintf(temp_buffer, sizeof(temp_buffer), ".%s {\n", current_class);
                sb_append_str(&sb, temp_buffer);
                Property_vec_t props = StaticRule_properties(rule);
                for(size_t k = 0; k < Property_vec_len(props); k++) {
                    Property_table_t p = Property_vec_at(props, k);
                    snprintf(temp_buffer, sizeof(temp_buffer), "    %s: %s;\n", Property_key(p), Property_value(p));
                    sb_append_str(&sb, temp_buffer);
                }
                sb_append_str(&sb, "}\n\n");
                break;
            }
        }
    }

    for (size_t i = 0; i < data->id_count; i++) {
        snprintf(temp_buffer, sizeof(temp_buffer), "#%s {}\n\n", data->injected_ids[i]);
        sb_append_str(&sb, temp_buffer);
    }

    if (sb.len > 1) { 
        sb.buffer[sb.len - 2] = '\0';
        sb.len -= 2;
    }
    write_file_fast(filename, sb.buffer, sb.len);
    sb_free(&sb);
}

void free_data_contents(DataLists* data) {
    if (!data) return;
    for(size_t i = 0; i < data->class_count; i++) free(data->class_names[i]);
    for(size_t i = 0; i < data->id_count; i++) free(data->injected_ids[i]);
    free(data->class_names);
    free(data->injected_ids);
    memset(data, 0, sizeof(DataLists));
}

int compare_strings(const void* a, const void* b) {
    return strcmp(*(const char**)a, *(const char**)b);
}

void free_file_list(FileList* list) {
    for (size_t i = 0; i < list->count; i++) {
        free(list->paths[i]);
    }
    free(list->paths);
}

void run_modification_cycle(const char* trigger_file) {
    uint64_t cycle_start_time = uv_hrtime();
    UsedIdNode* used_ids_head = NULL;

    size_t styles_bin_size;
    void* styles_buffer = map_file_read("styles.bin", &styles_bin_size);
    if (!styles_buffer) {
        fprintf(stderr, "Could not load styles.bin\n");
        return;
    }

    FileList file_list = {0};
    file_list.capacity = 16;
    file_list.paths = malloc(file_list.capacity * sizeof(char*));
    CHECK(file_list.paths);

    uv_fs_t scan_req;
    uv_fs_scandir(NULL, &scan_req, "./src", 0, NULL);
    uv_dirent_t dirent;
    while (UV_EOF != uv_fs_scandir_next(&scan_req, &dirent)) {
        if (dirent.type == UV_DIRENT_FILE && strstr(dirent.name, ".tsx")) {
            if (file_list.count >= file_list.capacity) {
                file_list.capacity *= 2;
                file_list.paths = realloc(file_list.paths, file_list.capacity * sizeof(char*));
                CHECK(file_list.paths);
            }
            char full_path[512];
            snprintf(full_path, sizeof(full_path), "./src/%s", dirent.name);
            file_list.paths[file_list.count++] = strdup(full_path);
        }
    }
    uv_fs_req_cleanup(&scan_req);

    qsort(file_list.paths, file_list.count, sizeof(char*), compare_strings);

    for (size_t i = 0; i < file_list.count; i++) {
        process_file(file_list.paths[i], &used_ids_head);
    }
    
    free_file_list(&file_list);

    DataLists current_data;
    collect_data(&current_data);
    write_final_css("styles.css", &current_data, styles_buffer);

    if (trigger_file) {
        int ids_added = 0, ids_removed = 0;
        int classes_added = 0, classes_removed = 0;

        for (size_t i = 0; i < current_data.id_count; i++) {
            bool found = false;
            for (size_t j = 0; j < previous_data.id_count; j++) {
                if (strcmp(current_data.injected_ids[i], previous_data.injected_ids[j]) == 0) {
                    found = true;
                    break;
                }
            }
            if (!found) ids_added++;
        }
        for (size_t i = 0; i < previous_data.id_count; i++) {
            bool found = false;
            for (size_t j = 0; j < current_data.id_count; j++) {
                if (strcmp(previous_data.injected_ids[i], current_data.injected_ids[j]) == 0) {
                    found = true;
                    break;
                }
            }
            if (!found) ids_removed++;
        }

        for (size_t i = 0; i < current_data.class_count; i++) {
            bool found = false;
            for (size_t j = 0; j < previous_data.class_count; j++) {
                if (strcmp(current_data.class_names[i], previous_data.class_names[j]) == 0) {
                    found = true;
                    break;
                }
            }
            if (!found) classes_added++;
        }

        for (size_t i = 0; i < previous_data.class_count; i++) {
            bool found = false;
            for (size_t j = 0; j < current_data.class_count; j++) {
                if (strcmp(previous_data.class_names[i], current_data.class_names[j]) == 0) {
                    found = true;
                    break;
                }
            }
            if (!found) classes_removed++;
        }

        double total_ms = (uv_hrtime() - cycle_start_time) / 1e6;
        if (ids_added > 0 || ids_removed > 0 || classes_added > 0 || classes_removed > 0) {
            printf("%s%s%s (%s+%d%s,%s-%d%s) -> %sstyles.css%s (%s+%d%s,%s-%d%s) • %.2fms\n",
                   KMAG, trigger_file, KNRM,
                   KGRN, ids_added, KNRM, KRED, ids_removed, KNRM,
                   KBCYN, KNRM,
                   KGRN, classes_added, KNRM, KRED, classes_removed, KNRM,
                   total_ms);
        }
    }
    
    free_data_contents(&previous_data);
    previous_data = current_data;

    free_used_id_list(&used_ids_head);
    free(styles_buffer);
}

void on_debounce_timeout(uv_timer_t *handle) {
    if (last_changed_file) {
        run_modification_cycle(last_changed_file);
        free(last_changed_file);
        last_changed_file = NULL;
    }
}

void on_file_change(uv_fs_event_t *handle, const char *filename, int events, int status) {
    if (status < 0) { fprintf(stderr, "Error watching file: %s\n", uv_strerror(status)); return; }
    
    if (filename && (events & UV_CHANGE) && strstr(filename, ".tsx")) {
        uv_timer_stop(&debounce_timer);
        if (last_changed_file) free(last_changed_file);
        
        char full_path[512];
        snprintf(full_path, sizeof(full_path), "./src/%s", filename);
        last_changed_file = strdup(full_path);
        CHECK(last_changed_file);
        
        uv_timer_start(&debounce_timer, on_debounce_timeout, 50, 0);
    }
}

void cleanup() {
    if (last_changed_file) free(last_changed_file);
    free_data_contents(&previous_data);
    uv_timer_stop(&debounce_timer);
    uv_close((uv_handle_t*)&debounce_timer, NULL);
    uv_run(loop, UV_RUN_NOWAIT);
    uv_loop_close(loop);
}

int main(int argc, char *argv[]) {
    loop = uv_default_loop();
    atexit(cleanup);
    uv_timer_init(loop, &debounce_timer);
    
    srand((unsigned int)time(NULL));

    run_modification_cycle(NULL);

    uv_fs_event_t fs_event;
    uv_fs_event_init(loop, &fs_event);
    uv_fs_event_start(&fs_event, on_file_change, "./src", UV_FS_EVENT_RECURSIVE);
    
    printf("🎨 %sdx-styles%s watching for component changes...\n", KBLU, KNRM);
    
    return uv_run(loop, UV_RUN_DEFAULT);
}

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
