#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <stdbool.h>

#if defined(_WIN32)
    #define DX_PLATFORM_WINDOWS
#elif defined(__unix__) || defined(__APPLE__)
    #define DX_PLATFORM_POSIX
#else
    #define DX_PLATFORM_STANDARD
#endif

#if defined(DX_PLATFORM_WINDOWS)
    #include <windows.h>
    #include <regex.h> 
#elif defined(DX_PLATFORM_POSIX)
    #include <fcntl.h>
    #include <unistd.h>
    #include <sys/stat.h>
    #include <sys/mman.h>
    #include <regex.h>
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
char **g_previous_valid_classes = NULL;
size_t g_previous_valid_count = 0;
uv_timer_t debounce_timer;
char* last_changed_file = NULL;

typedef struct {
    char *buffer;
    size_t len;
    size_t capacity;
} StringBuilder;

void sb_init(StringBuilder *sb, size_t initial_capacity);
void sb_append_str(StringBuilder *sb, const char *str);
void sb_free(StringBuilder *sb);

void *map_file_read(const char *filename, size_t *size) {
    #if defined(DX_PLATFORM_WINDOWS)
        HANDLE hFile = CreateFileA(filename, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
        if (hFile == INVALID_HANDLE_VALUE) return NULL;
        LARGE_INTEGER liSize;
        if (!GetFileSizeEx(hFile, &liSize) || liSize.QuadPart > (ULONGLONG)-1) { CloseHandle(hFile); return NULL; }
        *size = (size_t)liSize.QuadPart;
        if (*size == 0) { CloseHandle(hFile); return calloc(1, 1); }
        HANDLE hMapFile = CreateFileMappingA(hFile, NULL, PAGE_READONLY, 0, 0, NULL);
        CloseHandle(hFile);
        if (hMapFile == NULL) return NULL;
        LPVOID pMapView = MapViewOfFile(hMapFile, FILE_MAP_READ, 0, 0, *size);
        CloseHandle(hMapFile);
        return pMapView;
    #elif defined(DX_PLATFORM_POSIX)
        int fd = open(filename, O_RDONLY);
        if (fd == -1) return NULL;
        struct stat st;
        if (fstat(fd, &st) == -1) { close(fd); return NULL; }
        *size = st.st_size;
        if (*size == 0) { close(fd); return calloc(1, 1); }
        void *buf = mmap(NULL, *size, PROT_READ, MAP_PRIVATE, fd, 0);
        close(fd);
        return (buf == MAP_FAILED) ? NULL : buf;
    #else
        FILE *fp = fopen(filename, "rb");
        if (!fp) return NULL;
        fseek(fp, 0, SEEK_END);
        *size = ftell(fp);
        fseek(fp, 0, SEEK_SET);
        if (*size == 0) { fclose(fp); return calloc(1, 1); }
        void *buffer = malloc(*size);
        if (!buffer) { fclose(fp); return NULL; }
        if (fread(buffer, 1, *size, fp) != *size) { free(buffer); fclose(fp); return NULL; }
        fclose(fp);
        return buffer;
    #endif
}

void unmap_file_read(void *buffer, size_t size) {
    if (!buffer) return;
    #if defined(DX_PLATFORM_WINDOWS) || defined(DX_PLATFORM_POSIX)
        if (size > 0) munmap(buffer, size); else free(buffer);
    #else
        free(buffer);
    #endif
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

char* create_comment_free_copy(const char* source, size_t size) {
    char* clean_source = (char*)malloc(size + 1);
    CHECK(clean_source);
    
    size_t j = 0;
    for (size_t i = 0; i < size; ++i) {
        if (source[i] == '/' && i + 1 < size) {
            if (source[i+1] == '/') {
                i++;
                while (i < size && source[i] != '\n') {
                    i++;
                }
            } else if (source[i+1] == '*') {
                i += 2;
                while (i + 1 < size && (source[i] != '*' || source[i+1] != '/')) {
                    i++;
                }
                i++;
            } else {
                clean_source[j++] = source[i];
            }
        } else {
            clean_source[j++] = source[i];
        }
    }
    clean_source[j] = '\0';
    return clean_source;
}

void extract_class_names_from_file_regex(const char *filename, char ***class_names, size_t *count) {
    size_t original_size;
    char *original_source = map_file_read(filename, &original_size);
    if (!original_source) { *class_names = NULL; *count = 0; return; }

    char* source = create_comment_free_copy(original_source, original_size);
    unmap_file_read(original_source, original_size);

    *count = 0;
    *class_names = NULL;

    regex_t regex;
    int reti = regcomp(&regex, "className=\"([^\"]*)\"", REG_EXTENDED);
    if (reti) {
        fprintf(stderr, "Could not compile regex\n");
        free(source);
        return;
    }

    const char *cursor = source;
    regmatch_t pmatch[2];
    while (regexec(&regex, cursor, 2, pmatch, 0) == 0) {
        int start = pmatch[1].rm_so;
        int end = pmatch[1].rm_eo;
        if (start != -1 && end != -1) {
            size_t len = end - start;
            char *value_str = malloc(len + 1);
            CHECK(value_str);
            strncpy(value_str, cursor + start, len);
            value_str[len] = '\0';

            char *token = strtok(value_str, " ");
            while (token) {
                *class_names = realloc(*class_names, (*count + 1) * sizeof(char *));
                CHECK(*class_names);
                (*class_names)[*count] = strdup(token);
                CHECK((*class_names)[*count]);
                (*count)++;
                token = strtok(NULL, " ");
            }
            free(value_str);
        }
        cursor += pmatch[0].rm_eo;
    }

    regfree(&regex);
    free(source);
}

void write_css_from_classes(char **class_names, size_t class_count, void *buffer) {
    if (!buffer) return;
    Styles_table_t styles = Styles_as_root(buffer);
    if (!styles) return;

    StringBuilder sb;
    sb_init(&sb, 8192);
    char temp_buffer[1024];

    StaticRule_vec_t static_rules = Styles_static_rules(styles);
    DynamicRule_vec_t dynamic_rules = Styles_dynamic_rules(styles);
    size_t static_rules_len = StaticRule_vec_len(static_rules);
    size_t dynamic_rules_len = DynamicRule_vec_len(dynamic_rules);

    for (size_t i = 0; i < class_count; i++) {
        const char *current_class = class_names[i];
        bool matched = false;
        for (size_t j = 0; j < static_rules_len; j++) {
            StaticRule_table_t rule = StaticRule_vec_at(static_rules, j);
            const char *rule_name = StaticRule_name(rule);
            if (rule_name && strcmp(current_class, rule_name) == 0) {
                snprintf(temp_buffer, sizeof(temp_buffer), ".%s {\n", rule_name);
                sb_append_str(&sb, temp_buffer);
                Property_vec_t props = StaticRule_properties(rule);
                for (size_t k = 0; k < Property_vec_len(props); k++) {
                    Property_table_t prop = Property_vec_at(props, k);
                    snprintf(temp_buffer, sizeof(temp_buffer), "    %s: %s;\n", Property_key(prop), Property_value(prop));
                    sb_append_str(&sb, temp_buffer);
                }
                sb_append_str(&sb, "}\n\n");
                matched = true;
                break;
            }
        }
        if (matched) continue;
        for (size_t j = 0; j < dynamic_rules_len; j++) {
            DynamicRule_table_t rule = DynamicRule_vec_at(dynamic_rules, j);
            const char *prefix = DynamicRule_prefix(rule);
            size_t prefix_len = strlen(prefix);
            if (prefix && strncmp(current_class, prefix, prefix_len) == 0) {
                const char *value_part = current_class + prefix_len;
                if (*value_part == '-' || *value_part == '\0') {
                    if (*value_part == '-') value_part++;
                    DynamicProperty_vec_t dyn_props = DynamicRule_properties(rule);
                    for (size_t k = 0; k < DynamicProperty_vec_len(dyn_props); k++) {
                        DynamicProperty_table_t dyn_prop = DynamicProperty_vec_at(dyn_props, k);
                        const char* prop_name = DynamicProperty_name(dyn_prop);
                        if (prop_name && strcmp(prop_name, value_part) == 0) {
                            snprintf(temp_buffer, sizeof(temp_buffer), ".%s {\n", current_class);
                            sb_append_str(&sb, temp_buffer);
                            Property_vec_t props = DynamicProperty_properties(dyn_prop);
                            for (size_t l = 0; l < Property_vec_len(props); l++) {
                                Property_table_t prop = Property_vec_at(props, l);
                                snprintf(temp_buffer, sizeof(temp_buffer), "    %s: %s;\n", Property_key(prop), Property_value(prop));
                                sb_append_str(&sb, temp_buffer);
                            }
                            sb_append_str(&sb, "}\n\n");
                            matched = true;
                            break;
                        }
                    }
                }
            }
            if (matched) break;
        }
    }
    
    if (sb.len > 1) { sb.len -= 2; }
    
    if (write_file_fast("styles.css", sb.buffer, sb.len) != 0) {
        fprintf(stderr, "%sError: Could not write to styles.css%s\n", KRED, KNRM);
    }

    sb_free(&sb);
}

int compare_strings(const void *a, const void *b) {
    return strcmp(*(const char **)a, *(const char **)b);
}

char** extract_and_unify_all_classes(size_t *final_count) {
    char **all_class_names = NULL;
    size_t total_class_count = 0;
    uv_fs_t scan_req;
    if (uv_fs_scandir(NULL, &scan_req, "./src", 0, NULL) < 0) {
        uv_fs_req_cleanup(&scan_req);
        *final_count = 0;
        return NULL;
    }
    uv_dirent_t dirent;
    while (UV_EOF != uv_fs_scandir_next(&scan_req, &dirent)) {
        if (dirent.type == UV_DIRENT_FILE && strstr(dirent.name, ".tsx")) {
            char full_path[512];
            snprintf(full_path, sizeof(full_path), "./src/%s", dirent.name);
            char **file_class_names = NULL;
            size_t file_class_count = 0;
            extract_class_names_from_file_regex(full_path, &file_class_names, &file_class_count);
            if (file_class_count > 0) {
                all_class_names = realloc(all_class_names, (total_class_count + file_class_count) * sizeof(char*));
                CHECK(all_class_names);
                memcpy(all_class_names + total_class_count, file_class_names, file_class_count * sizeof(char*));
                total_class_count += file_class_count;
                free(file_class_names);
            }
        }
    }
    uv_fs_req_cleanup(&scan_req);
    if (total_class_count == 0) { *final_count = 0; return NULL; }
    qsort(all_class_names, total_class_count, sizeof(char*), compare_strings);
    size_t unique_count = 1;
    for (size_t i = 1; i < total_class_count; i++) {
        if (strcmp(all_class_names[i], all_class_names[unique_count - 1]) != 0) {
            all_class_names[unique_count++] = all_class_names[i];
        } else {
            free(all_class_names[i]);
        }
    }
    *final_count = unique_count;
    return all_class_names;
}

char** filter_valid_classes(char **all_classes, size_t all_count, void *buffer, size_t *final_count) {
    if (!buffer || all_count == 0) {
        *final_count = 0;
        return NULL;
    }
    Styles_table_t styles = Styles_as_root(buffer);
    if (!styles) {
        *final_count = 0;
        return NULL;
    }

    char **valid_classes = NULL;
    size_t valid_count = 0;

    StaticRule_vec_t static_rules = Styles_static_rules(styles);
    DynamicRule_vec_t dynamic_rules = Styles_dynamic_rules(styles);
    size_t static_rules_len = StaticRule_vec_len(static_rules);
    size_t dynamic_rules_len = DynamicRule_vec_len(dynamic_rules);

    for (size_t i = 0; i < all_count; i++) {
        const char *current_class = all_classes[i];
        bool matched = false;
        for (size_t j = 0; j < static_rules_len; j++) {
            if (strcmp(current_class, StaticRule_name(StaticRule_vec_at(static_rules, j))) == 0) {
                matched = true;
                break;
            }
        }
        if (matched) {
            valid_classes = realloc(valid_classes, (valid_count + 1) * sizeof(char*));
            CHECK(valid_classes);
            valid_classes[valid_count++] = strdup(current_class);
            continue;
        }
        for (size_t j = 0; j < dynamic_rules_len; j++) {
            DynamicRule_table_t rule = DynamicRule_vec_at(dynamic_rules, j);
            const char *prefix = DynamicRule_prefix(rule);
            if (strncmp(current_class, prefix, strlen(prefix)) == 0) {
                matched = true;
                break;
            }
        }
        if (matched) {
            valid_classes = realloc(valid_classes, (valid_count + 1) * sizeof(char*));
            CHECK(valid_classes);
            valid_classes[valid_count++] = strdup(current_class);
        }
    }

    *final_count = valid_count;
    return valid_classes;
}

void count_class_changes(char **old_list, size_t old_count, char **new_list, size_t new_count, int *added, int *removed) {
    *added = 0;
    *removed = 0;
    size_t i = 0, j = 0;
    while (i < old_count && j < new_count) {
        int cmp = strcmp(old_list[i], new_list[j]);
        if (cmp < 0) {
            (*removed)++;
            i++;
        } else if (cmp > 0) {
            (*added)++;
            j++;
        } else {
            i++;
            j++;
        }
    }
    *added += (new_count - j);
    *removed += (old_count - i);
}

bool are_class_sets_equal(char **new_classes, size_t new_count) {
    if (new_count != g_previous_valid_count) return false;
    for (size_t i = 0; i < new_count; i++) {
        if (strcmp(new_classes[i], g_previous_valid_classes[i]) != 0) return false;
    }
    return true;
}

void update_global_class_state(char **new_classes, size_t new_count) {
    for (size_t i = 0; i < g_previous_valid_count; i++) free(g_previous_valid_classes[i]);
    free(g_previous_valid_classes);
    g_previous_valid_classes = new_classes;
    g_previous_valid_count = new_count;
}

void run_generation_cycle(const char* trigger_file) {
    uint64_t cycle_start_time = uv_hrtime();
    size_t all_class_count;
    char **all_class_names = extract_and_unify_all_classes(&all_class_count);

    size_t styles_bin_size;
    void *buffer = map_file_read("styles.bin", &styles_bin_size);
    if (!buffer) {
        fprintf(stderr, "%sError: Failed to reload styles.bin%s\n", KRED, KNRM);
        for(size_t i = 0; i < all_class_count; i++) free(all_class_names[i]);
        free(all_class_names);
        return;
    }

    size_t current_valid_count;
    char **current_valid_classes = filter_valid_classes(all_class_names, all_class_count, buffer, &current_valid_count);

    for(size_t i = 0; i < all_class_count; i++) free(all_class_names[i]);
    free(all_class_names);

    if (are_class_sets_equal(current_valid_classes, current_valid_count)) {
        if (trigger_file) {
            printf("✨ %sNo style changes detected. Everything is up to date!%s\n", KGRN, KNRM);
        }
        for (size_t i = 0; i < current_valid_count; i++) free(current_valid_classes[i]);
        free(current_valid_classes);
        unmap_file_read(buffer, styles_bin_size);
        return;
    }

    int added = 0, removed = 0;
    count_class_changes(g_previous_valid_classes, g_previous_valid_count, current_valid_classes, current_valid_count, &added, &removed);
    
    if (current_valid_count > 0) {
        write_css_from_classes(current_valid_classes, current_valid_count, buffer);
    } else {
        write_file_fast("styles.css", "", 0);
    }
    
    unmap_file_read(buffer, styles_bin_size);
    
    if (trigger_file) {
        double total_ms = (uv_hrtime() - cycle_start_time) / 1e6;
        printf("%s%s%s changed -> %sstyles.css%s updated (" KGRN "+%d" KNRM ", " KRED "-%d" KNRM ") in %.2fms\n",
               KCYN, trigger_file, KNRM, KGRN, KNRM, added, removed, total_ms);
    }
    
    update_global_class_state(current_valid_classes, current_valid_count);
}

void on_debounce_timeout(uv_timer_t *handle) {
    if (last_changed_file) {
        run_generation_cycle(last_changed_file);
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
    for (size_t i = 0; i < g_previous_valid_count; i++) free(g_previous_valid_classes[i]);
    free(g_previous_valid_classes);
    if (last_changed_file) free(last_changed_file);
    uv_close((uv_handle_t*)&debounce_timer, NULL);
    uv_run(loop, UV_RUN_ONCE);
    uv_loop_close(loop);
}

int main(int argc, char *argv[]) {
    loop = uv_default_loop();
    atexit(cleanup);
    uv_timer_init(loop, &debounce_timer);

    size_t styles_bin_size;
    void *buffer = map_file_read("styles.bin", &styles_bin_size);
    if (!buffer) { fprintf(stderr, "%sError: Failed to load styles.bin%s\n", KRED, KNRM); return 1; }
    if (Styles_verify_as_root(buffer, styles_bin_size) != 0) {
        fprintf(stderr, "%sError: styles.bin is corrupted%s\n", KRED, KNRM);
        unmap_file_read(buffer, styles_bin_size);
        return 1;
    }
    unmap_file_read(buffer, styles_bin_size);

    run_generation_cycle(NULL);

    uv_fs_event_t fs_event;
    uv_fs_event_init(loop, &fs_event);
    uv_fs_event_start(&fs_event, on_file_change, "./src", UV_FS_EVENT_RECURSIVE);
    
    printf("🎨 %sdx-styles%s watching for changes...\n", KBLU, KNRM);
    
    return uv_run(loop, UV_RUN_DEFAULT);
}

void sb_init(StringBuilder *sb, size_t initial_capacity) {
    sb->capacity = initial_capacity > 0 ? initial_capacity : 1024;
    sb->buffer = malloc(sb->capacity);
    CHECK(sb->buffer);
    sb->buffer[0] = '\0';
    sb->len = 0;
}

void sb_append_str(StringBuilder *sb, const char *str) {
    size_t str_len = strlen(str);
    if (sb->len + str_len + 1 > sb->capacity) {
        size_t new_capacity = sb->capacity * 2;
        while (sb->len + str_len + 1 > new_capacity) { new_capacity *= 2; }
        sb->buffer = realloc(sb->buffer, new_capacity);
        CHECK(sb->buffer);
        sb->capacity = new_capacity;
    }
    memcpy(sb->buffer + sb->len, str, str_len);
    sb->len += str_len;
    sb->buffer[sb->len] = '\0';
}

void sb_free(StringBuilder *sb) {
    if (sb->buffer) free(sb->buffer);
    sb->buffer = NULL;
    sb->len = 0;
    sb->capacity = 0;
}
