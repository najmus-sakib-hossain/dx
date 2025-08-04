#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

//==============================================================================
// PLATFORM DETECTION & INCLUDES
//==============================================================================
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
#include <tree_sitter/api.h>
#include <flatcc/flatcc.h>
#include <flatcc/flatcc_builder.h>
#include "styles_generated.h"

TSLanguage *tree_sitter_tsx(void);

//==============================================================================
// UTILITIES & GLOBALS
//==============================================================================
#define KNRM  "\x1B[0m"
#define KRED  "\x1B[31m"
#define KGRN  "\x1B[32m"
#define KYEL  "\x1B[33m"
#define KBLU  "\x1B[34m"
#define KMAG  "\x1B[35m"
#define KCYN  "\x1B[36m"

#define CHECK(x) do { if (!(x)) { fprintf(stderr, "%sFatal Error at %s:%d%s\n", KRED, __FILE__, __LINE__, KNRM); exit(1); } } while (0)

uv_loop_t *loop;
TSParser *parser;

// A simple dynamic string builder.
typedef struct {
    char *buffer;
    size_t len;
    size_t capacity;
} StringBuilder;

//==============================================================================
// FORWARD DECLARATIONS
//==============================================================================
void scan_all_and_generate_css(void* buffer);
void sb_init(StringBuilder *sb, size_t initial_capacity);
void sb_append_str(StringBuilder *sb, const char *str);
void sb_free(StringBuilder *sb);

//==============================================================================
// CROSS-PLATFORM FILE I/O (MMAP)
//==============================================================================

/**
 * @brief Maps a file into memory for reading.
 *
 * @param filename The path to the file.
 * @param size Pointer to a size_t to store the file size.
 * @return A pointer to the memory-mapped file content, or NULL on failure.
 * The caller must call unmap_file_read() on the returned pointer.
 */
void *map_file_read(const char *filename, size_t *size) {
    #if defined(DX_PLATFORM_WINDOWS)
        HANDLE hFile = CreateFileA(filename, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
        if (hFile == INVALID_HANDLE_VALUE) return NULL;

        LARGE_INTEGER liSize;
        if (!GetFileSizeEx(hFile, &liSize) || liSize.QuadPart > (ULONGLONG)-1) {
            CloseHandle(hFile);
            return NULL;
        }
        *size = (size_t)liSize.QuadPart;
        if (*size == 0) {
            CloseHandle(hFile);
            return calloc(1, 1); // Return valid pointer for zero-sized file
        }

        HANDLE hMapFile = CreateFileMappingA(hFile, NULL, PAGE_READONLY, 0, 0, NULL);
        CloseHandle(hFile); // Can close file handle after creating mapping
        if (hMapFile == NULL) return NULL;

        LPVOID pMapView = MapViewOfFile(hMapFile, FILE_MAP_READ, 0, 0, *size);
        CloseHandle(hMapFile); // Can close mapping handle after creating view
        return pMapView;
    #elif defined(DX_PLATFORM_POSIX)
        int fd = open(filename, O_RDONLY);
        if (fd == -1) return NULL;

        struct stat st;
        if (fstat(fd, &st) == -1) {
            close(fd);
            return NULL;
        }
        *size = st.st_size;
        if (*size == 0) {
            close(fd);
            return calloc(1, 1);
        }

        void *buf = mmap(NULL, *size, PROT_READ, MAP_PRIVATE, fd, 0);
        close(fd);
        return (buf == MAP_FAILED) ? NULL : buf;
    #else // DX_PLATFORM_STANDARD (Fallback)
        FILE *fp = fopen(filename, "rb");
        if (!fp) return NULL;
        fseek(fp, 0, SEEK_END);
        *size = ftell(fp);
        fseek(fp, 0, SEEK_SET);
        if (*size == 0) {
            fclose(fp);
            return calloc(1, 1);
        }
        void *buffer = malloc(*size);
        if (!buffer) {
            fclose(fp);
            return NULL;
        }
        if (fread(buffer, 1, *size, fp) != *size) {
            free(buffer);
            fclose(fp);
            return NULL;
        }
        fclose(fp);
        return buffer;
    #endif
}

/**
 * @brief Unmaps or frees a memory buffer created by map_file_read.
 */
void unmap_file_read(void *buffer, size_t size) {
    if (!buffer) return;
    #if defined(DX_PLATFORM_WINDOWS)
        if (size > 0) UnmapViewOfFile(buffer);
        else free(buffer);
    #elif defined(DX_PLATFORM_POSIX)
        if (size > 0) munmap(buffer, size);
        else free(buffer);
    #else
        free(buffer);
    #endif
}

/**
 * @brief Writes content to a file, overwriting it using mmap where possible.
 *
 * This function creates a new file or truncates an existing one, then writes
 * the content using an efficient memory-mapped operation.
 *
 * @return 0 on success, -1 on failure.
 */
int write_file_mmap(const char *filename, const char *content, size_t content_len) {
    #if defined(DX_PLATFORM_WINDOWS)
        HANDLE hFile = CreateFileA(filename, GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
        if (hFile == INVALID_HANDLE_VALUE) return -1;
        
        if (content_len == 0) {
            CloseHandle(hFile);
            return 0;
        }

        HANDLE hMapFile = CreateFileMappingA(hFile, NULL, PAGE_READWRITE, 0, (DWORD)content_len, NULL);
        if (hMapFile == NULL) {
            CloseHandle(hFile);
            return -1;
        }

        LPVOID pMapView = MapViewOfFile(hMapFile, FILE_MAP_WRITE, 0, 0, content_len);
        if (pMapView == NULL) {
            CloseHandle(hMapFile);
            CloseHandle(hFile);
            return -1;
        }

        memcpy(pMapView, content, content_len);
        FlushViewOfFile(pMapView, content_len);

        UnmapViewOfFile(pMapView);
        CloseHandle(hMapFile);
        CloseHandle(hFile);
        return 0;
    #elif defined(DX_PLATFORM_POSIX)
        int fd = open(filename, O_RDWR | O_CREAT | O_TRUNC, 0644);
        if (fd == -1) return -1;

        if (content_len == 0) {
            close(fd);
            return 0;
        }

        if (ftruncate(fd, content_len) == -1) {
            close(fd);
            return -1;
        }

        void *map = mmap(NULL, content_len, PROT_WRITE, MAP_SHARED, fd, 0);
        if (map == MAP_FAILED) {
            close(fd);
            return -1;
        }

        memcpy(map, content, content_len);
        msync(map, content_len, MS_SYNC);
        munmap(map, content_len);
        close(fd);
        return 0;
    #else // DX_PLATFORM_STANDARD (Fallback)
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
    #endif
}

//==============================================================================
// CORE LOGIC
//==============================================================================

/**
 * @brief Loads the styles.bin FlatBuffers file using mmap.
 */
void *load_styles_bin(const char *filename, size_t *size) {
    void* buffer = map_file_read(filename, size);
    if (!buffer) {
        fprintf(stderr, "%sWarning: Could not open or map file %s%s\n", KYEL, filename, KNRM);
        return NULL;
    }
    return buffer;
}

/**
 * @brief Extracts all 'className' values from a given TSX file.
 *
 * Uses tree-sitter for parsing and mmap for fast file reading.
 */
void extract_class_names(const char *filename, char ***class_names, size_t *count) {
    size_t size;
    char *source = map_file_read(filename, &size);
    if (!source) {
        fprintf(stderr, "%sWarning: Could not open file %s%s\n", KYEL, filename, KNRM);
        *class_names = NULL;
        *count = 0;
        return;
    }
    
    TSTree *tree = ts_parser_parse_string(parser, NULL, source, size);
    if (!tree) {
        fprintf(stderr, "%sError: Failed to parse source in %s%s\n", KRED, filename, KNRM);
        unmap_file_read(source, size);
        *class_names = NULL;
        *count = 0;
        return;
    }
    
    TSNode root = ts_tree_root_node(tree);

    const char *query_str = "(jsx_attribute (property_identifier) @name (string (string_fragment) @value))";
    uint32_t error_offset;
    TSQueryError error_type;
    TSQuery *query = ts_query_new(tree_sitter_tsx(), query_str, strlen(query_str), &error_offset, &error_type);
    if (!query) {
        fprintf(stderr, "%sError: Failed to create tree-sitter query (error type %d at offset %d)%s\n", KRED, error_type, error_offset, KNRM);
        ts_tree_delete(tree);
        unmap_file_read(source, size);
        *class_names = NULL;
        *count = 0;
        return;
    }

    TSQueryCursor *cursor = ts_query_cursor_new();
    CHECK(cursor);
    ts_query_cursor_exec(cursor, query, root);

    *count = 0;
    *class_names = NULL;
    TSQueryMatch match;
    while (ts_query_cursor_next_match(cursor, &match)) {
        bool is_classname = false;
        uint32_t value_capture_index = (uint32_t)-1;

        for (uint32_t i = 0; i < match.capture_count; i++) {
            uint32_t capture_index = match.captures[i].index;
            uint32_t capture_name_len;
            const char* capture_name = ts_query_capture_name_for_id(query, capture_index, &capture_name_len);

            if (strcmp(capture_name, "name") == 0) {
                TSNode name_node = match.captures[i].node;
                uint32_t start = ts_node_start_byte(name_node);
                uint32_t end = ts_node_end_byte(name_node);
                if (strncmp(source + start, "className", end - start) == 0) {
                    is_classname = true;
                }
            } else if (strcmp(capture_name, "value") == 0) {
                value_capture_index = i;
            }
        }

        if (is_classname && value_capture_index != (uint32_t)-1) {
            TSNode node = match.captures[value_capture_index].node;
            uint32_t start = ts_node_start_byte(node);
            uint32_t end = ts_node_end_byte(node);
            
            char *value_str = malloc(end - start + 1);
            CHECK(value_str);
            strncpy(value_str, source + start, end - start);
            value_str[end - start] = '\0';

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
    }

    ts_query_cursor_delete(cursor);
    ts_query_delete(query);
    ts_tree_delete(tree);
    unmap_file_read(source, size);
}

/**
 * @brief Generates a CSS string from a list of class names and a styles definition buffer.
 *
 * Builds the entire CSS file in an in-memory string builder and then writes it to
 * "styles.css" using the efficient mmap-based writer.
 */
void write_css_from_classes(char **class_names, size_t class_count, void *buffer) {
    if (!buffer) {
        fprintf(stderr, "%sError: Invalid buffer for styles%s\n", KRED, KNRM);
        return;
    }

    Styles_table_t styles = Styles_as_root(buffer);
    if (!styles) {
        fprintf(stderr, "%sError: Invalid styles data in styles.bin%s\n", KRED, KNRM);
        return;
    }

    StringBuilder sb;
    sb_init(&sb, 8192); // Start with 8KB capacity
    char temp_buffer[1024];

    StaticRule_vec_t static_rules = Styles_static_rules(styles);
    DynamicRule_vec_t dynamic_rules = Styles_dynamic_rules(styles);
    size_t static_rules_len = StaticRule_vec_len(static_rules);
    size_t dynamic_rules_len = DynamicRule_vec_len(dynamic_rules);

    for (size_t i = 0; i < class_count; i++) {
        const char *current_class = class_names[i];
        bool matched = false;

        // Match static rules
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

        // Match dynamic rules
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

    if (write_file_mmap("styles.css", sb.buffer, sb.len) != 0) {
        fprintf(stderr, "%sError: Could not write to styles.css%s\n", KRED, KNRM);
    }
    sb_free(&sb);
}

int compare_strings(const void *a, const void *b) {
    return strcmp(*(const char **)a, *(const char **)b);
}

/**
 * @brief Scans all .tsx files in ./src, extracts class names, and generates styles.css.
 */
void scan_all_and_generate_css(void* buffer) {
    char **all_class_names = NULL;
    size_t total_class_count = 0;

    uv_fs_t scan_req;
    int scan_result = uv_fs_scandir(NULL, &scan_req, "./src", 0, NULL);
    if (scan_result < 0) {
        fprintf(stderr, "%sError scanning directory ./src: %s%s\n", KRED, uv_strerror(scan_result), KNRM);
        uv_fs_req_cleanup(&scan_req);
        return;
    }

    uv_dirent_t dirent;
    printf("%sScanning ./src for .tsx files...%s\n", KGRN, KNRM);
    while (UV_EOF != uv_fs_scandir_next(&scan_req, &dirent)) {
        if (dirent.type == UV_DIRENT_FILE && strstr(dirent.name, ".tsx")) {
            char full_path[512];
            snprintf(full_path, sizeof(full_path), "./src/%s", dirent.name);
            printf("%sProcessing file: %s%s\n", KCYN, full_path, KNRM);

            char **file_class_names = NULL;
            size_t file_class_count = 0;
            extract_class_names(full_path, &file_class_names, &file_class_count);

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

    printf("%sTotal class names collected: %zu%s\n", KGRN, total_class_count, KNRM);

    if (total_class_count == 0) {
        write_file_mmap("styles.css", "", 0); // Write an empty file
        printf("%sNo classNames found. Emptied styles.css.%s\n", KYEL, KNRM);
        return;
    }

    qsort(all_class_names, total_class_count, sizeof(char*), compare_strings);
    size_t unique_count = 0;
    if (total_class_count > 0) {
        unique_count = 1;
        for (size_t i = 1; i < total_class_count; i++) {
            if (strcmp(all_class_names[i], all_class_names[unique_count - 1]) != 0) {
                all_class_names[unique_count++] = all_class_names[i];
            } else {
                free(all_class_names[i]);
            }
        }
    }
    
    write_css_from_classes(all_class_names, unique_count, buffer);

    for (size_t i = 0; i < unique_count; i++) {
        free(all_class_names[i]);
    }
    free(all_class_names);
}

//==============================================================================
// FILE WATCHER & MAIN LOOP
//==============================================================================

void on_file_change(uv_fs_event_t *handle, const char *filename, int events, int status) {
    if (status < 0) {
        fprintf(stderr, "%sError watching file: %s%s\n", KRED, uv_strerror(status), KNRM);
        return;
    }
    
    if (filename && (events & UV_CHANGE) && strstr(filename, ".tsx")) {
        printf("\n%sChange detected in %s./src/%s%s\n", KYEL, KCYN, filename, KNRM);
        printf("%sRe-generating styles.css...%s\n", KGRN, KNRM);
        
        size_t styles_bin_size;
        void *buffer = load_styles_bin("styles.bin", &styles_bin_size);
        if (buffer) {
            scan_all_and_generate_css(buffer);
            unmap_file_read(buffer, styles_bin_size);
            printf("%sSuccessfully updated styles.css.%s\n", KGRN, KNRM);
        } else {
            fprintf(stderr, "%sFailed to reload styles.bin. CSS not updated.%s\n", KRED, KNRM);
        }
    }
}

int main(int argc, char *argv[]) {
    loop = uv_default_loop();

    parser = ts_parser_new();
    CHECK(parser);
    CHECK(ts_parser_set_language(parser, tree_sitter_tsx()));

    printf("%sStarting dx-style generator...%s\n", KBLU, KNRM);

    size_t styles_bin_size;
    void *buffer = load_styles_bin("styles.bin", &styles_bin_size);
    if (!buffer) {
        fprintf(stderr, "%sError: Failed to load styles.bin on startup. Exiting.%s\n", KRED, KNRM);
        ts_parser_delete(parser);
        return 1;
    }

    if (Styles_verify_as_root(buffer, styles_bin_size) != 0) {
        fprintf(stderr, "%sError: styles.bin is corrupted or invalid. Exiting.%s\n", KRED, KNRM);
        unmap_file_read(buffer, styles_bin_size);
        ts_parser_delete(parser);
        return 1;
    }

    printf("%sInitial scan of ./src...%s\n", KGRN, KNRM);
    scan_all_and_generate_css(buffer);
    unmap_file_read(buffer, styles_bin_size);
    printf("%sInitial styles.css generated.%s\n", KGRN, KNRM);

    uv_fs_event_t fs_event;
    uv_fs_event_init(loop, &fs_event);
    uv_fs_event_start(&fs_event, on_file_change, "./src", UV_FS_EVENT_RECURSIVE);
    printf("%sWatching ./src for .tsx file changes...%s\n", KBLU, KNRM);
    
    uv_run(loop, UV_RUN_DEFAULT);

    ts_parser_delete(parser);
    uv_fs_event_stop(&fs_event);
    uv_loop_close(loop);
    printf("%sShutdown complete.%s\n", KBLU, KNRM);
    return 0;
}

//==============================================================================
// STRING BUILDER IMPLEMENTATION
//==============================================================================

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
        while (sb->len + str_len + 1 > new_capacity) {
            new_capacity *= 2;
        }
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
