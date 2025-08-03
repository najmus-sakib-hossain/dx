#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <uv.h>
#include <tree_sitter/api.h>
#include <flatcc/flatcc.h>
#include <flatcc/flatcc_builder.h>
#include "styles_reader.h"
#include "styles_verifier.h"

// Tree-sitter language for TypeScript/TSX
TSLanguage *tree_sitter_typescript(void); // Provided by tree-sitter-typescript

// Error handling macro
#define CHECK(x) do { if (!(x)) { fprintf(stderr, "Error at %s:%d\n", __FILE__, __LINE__); exit(1); } } while (0)

// Global variables
uv_loop_t *loop;
uv_fs_event_t fs_event;
TSParser *parser;
FILE *css_file;

// Function to read styles.bin
void *load_styles_bin(const char *filename) {
    FILE *fp = fopen(filename, "rb");
    CHECK(fp);
    fseek(fp, 0, SEEK_END);
    size_t size = ftell(fp);
    fseek(fp, 0, SEEK_SET);
    void *buf = malloc(size);
    CHECK(buf);
    fread(buf, 1, size, fp);
    fclose(fp);
    // Return the buffer directly instead of creating a flatcc_buffer_t
    return buf;
}

// Function to extract class names from TSX file using Tree-sitter
void extract_class_names(const char *filename, char ***class_names, size_t *count) {
    // Read TSX file content
    FILE *fp = fopen(filename, "r");
    CHECK(fp);
    fseek(fp, 0, SEEK_END);
    size_t size = ftell(fp);
    fseek(fp, 0, SEEK_SET);
    char *source = malloc(size + 1);
    CHECK(source);
    fread(source, 1, size, fp);
    source[size] = '\0';
    fclose(fp);

    // Parse TSX file
    TSTree *tree = ts_parser_parse_string(parser, NULL, source, size);
    CHECK(tree);
    TSNode root = ts_tree_root_node(tree);

    // Query to find className attributes
    const char *query_str = "(jsx_attribute (property_identifier) @name (#eq? @name \"className\") (string (string_fragment) @value))";
    TSQuery *query = ts_query_new(tree_sitter_typescript(), query_str, strlen(query_str), NULL, NULL);
    CHECK(query);

    TSQueryCursor *cursor = ts_query_cursor_new();
    CHECK(cursor);
    ts_query_cursor_exec(cursor, query, root);

    // Collect class names
    *count = 0;
    *class_names = NULL;
    TSQueryMatch match;
    while (ts_query_cursor_next_match(cursor, &match)) {
        for (uint32_t i = 0; i < match.capture_count; i++) {
            const char *capture_name;
            uint32_t capture_length;
            
            // Fix: correct API usage
            capture_name = ts_query_capture_name_for_id(query, match.captures[i].index, &capture_length);
            if (capture_name && strcmp(capture_name, "value") == 0) {
                TSNode node = match.captures[i].node;
                uint32_t start = ts_node_start_byte(node);
                uint32_t end = ts_node_end_byte(node);
                size_t len = end - start;
                char *value = malloc(len + 1);
                strncpy(value, source + start, len);
                value[len] = '\0';
                *class_names = realloc(*class_names, (*count + 1) * sizeof(char *));
                (*class_names)[*count] = value;
                (*count)++;
            }
        }
    }

    // Cleanup
    ts_query_cursor_delete(cursor);
    ts_query_delete(query);
    ts_tree_delete(tree);
    free(source);
}

// Function to match class names and generate CSS
void generate_css(const char *filename, void *buffer) {
    // Parse class names from TSX file
    char **class_names;
    size_t class_count;
    extract_class_names(filename, &class_names, &class_count);

    // Load styles.bin - Fixed: removed extra "Styles_" prefix
    Styles_table_t styles = Styles_as_root(buffer);
    CHECK(styles);

    // Open styles.css for writing
    css_file = fopen("styles.css", "w");
    CHECK(css_file);

    // Process static rules - Fixed: correct function names
    StaticRule_vec_t static_rules = Styles_static_rules(styles);
    size_t static_rules_len = StaticRule_vec_len(static_rules);
    
    for (size_t i = 0; i < class_count; i++) {
        for (size_t j = 0; j < static_rules_len; j++) {
            StaticRule_table_t rule = StaticRule_vec_at(static_rules, j);
            const char *rule_name = StaticRule_name(rule);
            if (strcmp(class_names[i], rule_name) == 0) {
                fprintf(css_file, ".%s {\n", rule_name);
                Property_vec_t props = StaticRule_properties(rule);
                size_t props_len = Property_vec_len(props);
                
                for (size_t k = 0; k < props_len; k++) {
                    Property_table_t prop = Property_vec_at(props, k);
                    fprintf(css_file, "  %s: %s;\n", Property_key(prop), Property_value(prop));
                }
                fprintf(css_file, "}\n");
            }
        }
    }

    // Process dynamic rules - Fixed: correct function names and types
    DynamicRule_vec_t dynamic_rules = Styles_dynamic_rules(styles);
    size_t dynamic_rules_len = DynamicRule_vec_len(dynamic_rules);
    
    for (size_t i = 0; i < class_count; i++) {
        for (size_t j = 0; j < dynamic_rules_len; j++) {
            DynamicRule_table_t rule = DynamicRule_vec_at(dynamic_rules, j);
            const char *prefix = DynamicRule_prefix(rule);
            flatbuffers_string_vec_t values = DynamicRule_values(rule);
            size_t values_len = flatbuffers_string_vec_len(values);
            
            for (size_t k = 0; k < values_len; k++) {
                const char *value = flatbuffers_string_vec_at(values, k);
                char expected_class[256];
                snprintf(expected_class, sizeof(expected_class), "%s-%s", prefix, value);
                
                if (strcmp(class_names[i], expected_class) == 0) {
                    fprintf(css_file, ".%s {\n", expected_class);
                    DynamicProperty_vec_t props = DynamicRule_properties(rule);
                    
                    if (k < DynamicProperty_vec_len(props)) {
                        DynamicProperty_table_t dyn_prop = DynamicProperty_vec_at(props, k);
                        Property_vec_t prop_pairs = DynamicProperty_properties(dyn_prop);
                        size_t prop_pairs_len = Property_vec_len(prop_pairs);
                        
                        for (size_t m = 0; m < prop_pairs_len; m++) {
                            Property_table_t prop = Property_vec_at(prop_pairs, m);
                            fprintf(css_file, "  %s: %s;\n", Property_key(prop), Property_value(prop));
                        }
                    }
                    fprintf(css_file, "}\n");
                }
            }
        }
    }

    // Cleanup
    for (size_t i = 0; i < class_count; i++) {
        free(class_names[i]);
    }
    free(class_names);
    fclose(css_file);
}

// libuv file system event callback
void on_file_change(uv_fs_event_t *handle, const char *filename, int events, int status) {
    if (status < 0) {
        fprintf(stderr, "Error watching file: %s\n", uv_strerror(status));
        return;
    }
    if (filename && (events & UV_CHANGE) && strstr(filename, ".tsx")) {
        printf("Detected change in %s\n", filename);
        char full_path[512];
        snprintf(full_path, sizeof(full_path), "./src/%s", filename);
        void *buffer = load_styles_bin("styles.bin");
        generate_css(full_path, buffer);
        free(buffer); // Use free instead of flatcc_destroy_buffer
    }
}

int main(int argc, char *argv[]) {
    // Initialize libuv loop
    loop = uv_default_loop();

    // Initialize Tree-sitter parser
    parser = ts_parser_new();
    CHECK(parser);
    ts_parser_set_language(parser, tree_sitter_typescript());

    // Load styles.bin
    void *buffer = load_styles_bin("styles.bin");

    // Generate initial CSS for all TSX files
    uv_fs_t scan_req;
    int scan_result = uv_fs_scandir(loop, &scan_req, "./src", 0, NULL);
    if (scan_result >= 0) {
        uv_dirent_t dirent;
        while (UV_EOF != uv_fs_scandir_next(&scan_req, &dirent)) {
            if (dirent.type == UV_DIRENT_FILE && strstr(dirent.name, ".tsx")) {
                char full_path[512];
                snprintf(full_path, sizeof(full_path), "./src/%s", dirent.name);
                generate_css(full_path, buffer);
            }
        }
    }
    uv_fs_req_cleanup(&scan_req);

    // Start watching ./src directory
    uv_fs_event_init(loop, &fs_event);
    uv_fs_event_start(&fs_event, on_file_change, "./src", UV_FS_EVENT_RECURSIVE);
    printf("Watching ./src for .tsx file changes...\n");

    // Run libuv loop
    uv_run(loop, UV_RUN_DEFAULT);

    // Cleanup
    free(buffer); // Use free instead of flatcc_destroy_buffer
    ts_parser_delete(parser);
    uv_fs_event_stop(&fs_event);
    uv_loop_close(loop);
    return 0;
}