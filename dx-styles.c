#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <uv.h>
#include <tree_sitter/api.h>
#include <flatcc/flatcc.h>
#include <flatcc/flatcc_builder.h>
#include "styles_generated.h"
#include <ctype.h>

#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

TSLanguage *tree_sitter_tsx(void);

#define KNRM  "\x1B[0m"
#define KRED  "\x1B[31m"
#define KGRN  "\x1B[32m"
#define KYEL  "\x1B[33m"
#define KBLU  "\x1B[34m"
#define KMAG  "\x1B[35m"
#define KCYN  "\x1B[36m"

uv_loop_t *loop;
TSParser *parser;

void scan_all_and_generate_css(void* buffer);

#define CHECK(x) do { if (!(x)) { fprintf(stderr, "%sFatal Error at %s:%d%s\n", KRED, __FILE__, __LINE__, KNRM); exit(1); } } while (0)

void *load_styles_bin(const char *filename, size_t *size) {
    int fd = open(filename, O_RDONLY);
    if (fd == -1) {
        fprintf(stderr, "%sWarning: Could not open file %s%s\n", KYEL, filename, KNRM);
        return NULL;
    }

    struct stat st;
    if (fstat(fd, &st) == -1) {
        fprintf(stderr, "%sWarning: Could not get file size for %s%s\n", KYEL, filename, KNRM);
        close(fd);
        return NULL;
    }
    *size = st.st_size;

    void *buf = mmap(NULL, *size, PROT_READ, MAP_PRIVATE, fd, 0);
    if (buf == MAP_FAILED) {
        fprintf(stderr, "%sError: Memory mapping failed%s\n", KRED, KNRM);
        close(fd);
        return NULL;
    }

    close(fd);
    return buf;
}

void extract_class_names(const char *filename, char ***class_names, size_t *count) {
    FILE *fp = fopen(filename, "r");
    if (!fp) {
        fprintf(stderr, "%sWarning: Could not open file %s%s\n", KYEL, filename, KNRM);
        *class_names = NULL;
        *count = 0;
        return;
    }
    
    fseek(fp, 0, SEEK_END);
    size_t size = ftell(fp);
    fseek(fp, 0, SEEK_SET);
    char *source = malloc(size + 1);
    CHECK(source);
    fread(source, 1, size, fp);
    source[size] = '\0';
    fclose(fp);

    TSTree *tree = ts_parser_parse_string(parser, NULL, source, size);
    if (!tree) {
        fprintf(stderr, "%sError: Failed to parse source in %s%s\n", KRED, filename, KNRM);
        free(source);
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
        free(source);
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
        uint32_t value_capture_index = -1;

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

        if (is_classname && value_capture_index != -1) {
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
    free(source);
}

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

    FILE* css_file = fopen("styles.css", "w");
    if (!css_file) {
        fprintf(stderr, "%sError: Could not open styles.css for writing%s\n", KRED, KNRM);
        return;
    }

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
                fprintf(css_file, ".%s {\n", rule_name);
                Property_vec_t props = StaticRule_properties(rule);
                for (size_t k = 0; k < Property_vec_len(props); k++) {
                    Property_table_t prop = Property_vec_at(props, k);
                    fprintf(css_file, "    %s: %s;\n", Property_key(prop), Property_value(prop));
                }
                fprintf(css_file, "}\n\n");
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
                    if(*value_part == '-') value_part++;

                    DynamicProperty_vec_t dyn_props = DynamicRule_properties(rule);
                    for (size_t k = 0; k < DynamicProperty_vec_len(dyn_props); k++) {
                        DynamicProperty_table_t dyn_prop = DynamicProperty_vec_at(dyn_props, k);
                        const char* prop_name = DynamicProperty_name(dyn_prop);

                        if (prop_name && strcmp(prop_name, value_part) == 0) {
                            fprintf(css_file, ".%s {\n", current_class);
                            Property_vec_t props = DynamicProperty_properties(dyn_prop);
                            for (size_t l = 0; l < Property_vec_len(props); l++) {
                                Property_table_t prop = Property_vec_at(props, l);
                                fprintf(css_file, "    %s: %s;\n", Property_key(prop), Property_value(prop));
                            }
                            fprintf(css_file, "}\n\n");
                            matched = true;
                            break; 
                        }
                    }
                }
            }
            if (matched) break; 
        }
    }

    fclose(css_file);
}

int compare_strings(const void *a, const void *b) {
    return strcmp(*(const char **)a, *(const char **)b);
}

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
        FILE* css_file = fopen("styles.css", "w");
        if (css_file) fclose(css_file);
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
            munmap(buffer, styles_bin_size);
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
        munmap(buffer, styles_bin_size);
        ts_parser_delete(parser);
        return 1;
    }

    printf("%sInitial scan of ./src...%s\n", KGRN, KNRM);
    scan_all_and_generate_css(buffer);
    munmap(buffer, styles_bin_size);
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