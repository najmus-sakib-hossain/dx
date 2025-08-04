#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <stdbool.h>
#include <time.h>

#if defined(_WIN32)
    #define DX_PLATFORM_WINDOWS
#elif defined(__unix__) || defined(__APPLE__)
    #define DX_PLATFORM_POSIX
#else
    #define DX_PLATFORM_STANDARD
#endif

#if defined(DX_PLATFORM_WINDOWS)
    #include <windows.h>
#elif defined(DX_PLATFORM_POSIX)
    #include <fcntl.h>
    #include <unistd.h>
    #include <sys/stat.h>
    #include <sys/mman.h>
#endif

#include <uv.h>
#include "styles_generated.h"

#define KNRM  "\x1B[0m"
#define KRED  "\x1B[31m"
#define KGRN  "\x1B[32m"
#define KYEL  "\x1B[33m"
#define KBLU  "\x1B[34m"
#define KCYN  "\x1B[36m"

#define CHECK(x) do { if (!(x)) { fprintf(stderr, "%sFatal Error at %s:%d%s\n", KRED, __FILE__, __LINE__, KNRM); exit(1); } } while (0)

uv_loop_t *loop;
uv_timer_t debounce_timer;
char* last_changed_file = NULL;

typedef struct {
    char *buffer;
    size_t len;
    size_t capacity;
} StringBuilder;

typedef struct AcronymCounter {
    char* acronym;
    int count;
    struct AcronymCounter* next;
} AcronymCounter;

typedef struct DataLists {
    char** class_names;
    size_t class_count;
    char** injected_ids;
    size_t id_count;
} DataLists;

void sb_init(StringBuilder *sb, size_t initial_capacity);
void sb_append_str(StringBuilder *sb, const char *str);
void sb_append_n(StringBuilder *sb, const char *str, size_t n);
void sb_free(StringBuilder *sb);

// --- Human-Readable Acronym ID Generator ---

void generate_id_string(char* buffer, size_t buffer_size, const char* class_name_base, AcronymCounter** head) {
    char acronym[256] = {0};
    size_t acronym_len = 0;
    bool new_word = true;

    for (const char* p = class_name_base; *p && acronym_len < sizeof(acronym) - 1; ++p) {
        if (isspace((unsigned char)*p)) {
            new_word = true;
        } else if (new_word) {
            acronym[acronym_len++] = tolower((unsigned char)*p);
            new_word = false;
        }
    }

    AcronymCounter* current = *head;
    AcronymCounter* parent = NULL;
    while (current != NULL) {
        if (strcmp(current->acronym, acronym) == 0) {
            current->count++;
            snprintf(buffer, buffer_size, "%s%d", acronym, current->count);
            return;
        }
        parent = current;
        current = current->next;
    }

    AcronymCounter* new_node = (AcronymCounter*)malloc(sizeof(AcronymCounter));
    CHECK(new_node);
    new_node->acronym = strdup(acronym);
    new_node->count = 1;
    new_node->next = NULL;

    if (parent == NULL) {
        *head = new_node;
    } else {
        parent->next = new_node;
    }
    snprintf(buffer, buffer_size, "%s1", acronym);
}

void free_acronym_list(AcronymCounter** head) {
    AcronymCounter* current = *head;
    while (current != NULL) {
        AcronymCounter* next = current->next;
        free(current->acronym);
        free(current);
        current = next;
    }
    *head = NULL;
}

// --- End of ID Generator ---

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

int process_file(const char* filename, AcronymCounter** acronym_head) {
    size_t size;
    char *source = map_file_read(filename, &size);
    if (!source) return 0;

    StringBuilder sb;
    sb_init(&sb, size + 2048);
    const char *cursor = source;
    int ids_added = 0;

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

        const char* tag_end = strchr(tag_start, '>');
        if (!tag_end) {
            sb_append_n(&sb, cursor, class_name_ptr - cursor + 1);
            cursor = class_name_ptr + 1;
            continue;
        }

        size_t tag_len = tag_end - tag_start;
        char* tag_content = malloc(tag_len + 1);
        CHECK(tag_content);
        strncpy(tag_content, tag_start, tag_len);
        tag_content[tag_len] = '\0';
        
        bool id_exists = strstr(tag_content, "id=") != NULL;
        free(tag_content);

        const char *class_name_start = strchr(class_name_ptr, '"');
        if (!class_name_start) {
            sb_append_n(&sb, cursor, class_name_ptr - cursor + 10);
            cursor = class_name_ptr + 10;
            continue;
        }
        class_name_start++;

        const char *class_name_end = strchr(class_name_start, '"');
        if (!class_name_end) {
            sb_append_str(&sb, cursor);
            break;
        }

        sb_append_n(&sb, cursor, class_name_end - cursor + 1);
        cursor = class_name_end + 1;

        if (!id_exists) {
            size_t class_name_len = class_name_end - class_name_start;
            char class_name_val[512];
            if (class_name_len > 0 && class_name_len < sizeof(class_name_val)) {
                strncpy(class_name_val, class_name_start, class_name_len);
                class_name_val[class_name_len] = '\0';

                char generated_id[512];
                generate_id_string(generated_id, sizeof(generated_id), class_name_val, acronym_head);
                char id_attr[576];
                snprintf(id_attr, sizeof(id_attr), " id=\"%s\"", generated_id);
                sb_append_str(&sb, id_attr);
                ids_added++;
            }
        }
    }
    
    if (ids_added > 0) {
        write_file_fast(filename, sb.buffer, sb.len);
    }
    
    sb_free(&sb);
    free(source);
    return ids_added;
}

bool is_dx_id(const char* id) {
    size_t len = strlen(id);
    if (len < 2) return false;
    
    size_t i = 0;
    while(i < len && isalpha(id[i])) {
        i++;
    }
    if (i == 0 || i == len) return false;
    while(i < len && isdigit(id[i])) {
        i++;
    }
    return i == len;
}

void collect_data(DataLists* data) {
    data->class_names = NULL;
    data->injected_ids = NULL;
    data->class_count = 0;
    data->id_count = 0;
    
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
                char class_str[512];
                if(end - cursor < sizeof(class_str)) {
                    strncpy(class_str, cursor, end - cursor);
                    class_str[end - cursor] = '\0';
                    char* token = strtok(class_str, " ");
                    while(token) {
                        data->class_names = realloc(data->class_names, (data->class_count + 1) * sizeof(char*));
                        data->class_names[data->class_count++] = strdup(token);
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
                         data->injected_ids = realloc(data->injected_ids, (data->id_count + 1) * sizeof(char*));
                         data->injected_ids[data->id_count++] = strdup(id_val);
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
    DynamicRule_vec_t dynamic_rules = Styles_dynamic_rules(styles);

    for (size_t i = 0; i < data->class_count; i++) {
        const char* current_class = data->class_names[i];
        bool matched = false;
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
                matched = true;
                break;
            }
        }
        if(matched) continue;
        // ... logic for dynamic rules ...
    }

    for (size_t i = 0; i < data->id_count; i++) {
        snprintf(temp_buffer, sizeof(temp_buffer), "#%s {}\n\n", data->injected_ids[i]);
        sb_append_str(&sb, temp_buffer);
    }

    if (sb.len > 1) { sb.len -= 2; }
    write_file_fast(filename, sb.buffer, sb.len);
    sb_free(&sb);
}


void run_modification_cycle(const char* trigger_file) {
    uint64_t cycle_start_time = uv_hrtime();
    int ids_added_total = 0;
    AcronymCounter* acronym_head = NULL;

    size_t styles_bin_size;
    void* styles_buffer = map_file_read("styles.bin", &styles_bin_size);
    if (!styles_buffer) {
        fprintf(stderr, "Could not load styles.bin\n");
        return;
    }

    uv_fs_t scan_req;
    uv_fs_scandir(NULL, &scan_req, "./src", 0, NULL);

    uv_dirent_t dirent;
    while (UV_EOF != uv_fs_scandir_next(&scan_req, &dirent)) {
        if (dirent.type == UV_DIRENT_FILE && strstr(dirent.name, ".tsx")) {
            char full_path[512];
            snprintf(full_path, sizeof(full_path), "./src/%s", dirent.name);
            ids_added_total += process_file(full_path, &acronym_head);
        }
    }
    uv_fs_req_cleanup(&scan_req);

    DataLists data = { .class_names = NULL, .injected_ids = NULL };
    collect_data(&data);
    write_final_css("styles.css", &data, styles_buffer);

    for(size_t i = 0; i < data.class_count; i++) free(data.class_names[i]);
    for(size_t i = 0; i < data.id_count; i++) free(data.injected_ids[i]);
    free(data.class_names);
    free(data.injected_ids);

    free_acronym_list(&acronym_head);
    free(styles_buffer);

    if (trigger_file) {
        double total_ms = (uv_hrtime() - cycle_start_time) / 1e6;
        if (ids_added_total > 0) {
            printf("%s%s%s (" KGRN "+%d ID%s" KNRM ") -> Synced %sstyles.css%s in %.2fms\n",
                   KCYN, trigger_file, KNRM, ids_added_total, ids_added_total > 1 ? "s" : "", KGRN, KNRM, total_ms);
        } else {
            printf("%s%s%s -> %sstyles.css%s is already in sync.\n",
                   KCYN, trigger_file, KNRM, KGRN, KNRM);
        }
    }
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
        
        uv_timer_start(&debounce_timer, on_debounce_timeout, 50, 0);
    }
}

void cleanup() {
    if (last_changed_file) free(last_changed_file);
    uv_close((uv_handle_t*)&debounce_timer, NULL);
    uv_run(loop, UV_RUN_ONCE);
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
