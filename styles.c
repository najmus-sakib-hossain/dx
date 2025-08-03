#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Use angle-bracket include as we will provide the path via compiler flags.
#include <toml.h> 

// Flatcc and generated header includes
#include <flatcc/flatcc_builder.h>
#include "styles_generated.h"

// Helper macro to check for errors and exit if something goes wrong.
#define CHECK(x) do { \
    if (!(x)) { \
        fprintf(stderr, "Fatal Error at %s:%d\n", __FILE__, __LINE__); \
        exit(1); \
    } \
} while (0)

int main(int argc, char *argv[]) {
    // --- 1. Argument and File Handling ---
    const char *toml_path = (argc > 1) ? argv[1] : "styles.toml";
    
    FILE *fp = fopen(toml_path, "r");
    if (!fp) {
        fprintf(stderr, "Error: Cannot open input file '%s'.\n", toml_path);
        fprintf(stderr, "Usage: %s [path_to_styles.toml]\n", argv[0]);
        return 1;
    }
    
    // --- 2. TOML Parsing ---
    char errbuf[200];
    toml_table_t *conf = toml_parse_file(fp, errbuf, sizeof(errbuf));
    fclose(fp);
    
    if (!conf) {
        fprintf(stderr, "Error parsing TOML file '%s': %s\n", toml_path, errbuf);
        return 1;
    }

    // --- 3. FlatBuffers Builder Initialization ---
    flatcc_builder_t builder;
    flatcc_builder_init(&builder);

    // --- 4. Process Static Rules ---
    StaticRule_vec_start(&builder);
    toml_table_t *static_rules = toml_table_in(conf, "static_rules");
    if (static_rules) {
        for (int i = 0; ; i++) {
            const char *key = toml_key_in(static_rules, i);
            if (!key) break;

            toml_table_t *rule = toml_table_in(static_rules, key);
            if (!rule) {
                fprintf(stderr, "Error: Could not find table for static_rule '%s' in '%s'.\n", key, toml_path);
                exit(1);
            }

            Property_vec_start(&builder);
            for (int j = 0; ; j++) {
                const char *prop_key = toml_key_in(rule, j);
                if (!prop_key) break;

                toml_datum_t prop_val = toml_string_in(rule, prop_key);
                if (!prop_val.ok) {
                    fprintf(stderr, "Error: Value for property '%s' in static_rule '%s' is not a string.\n", prop_key, key);
                    exit(1);
                }

                Property_ref_t prop_ref = Property_create(&builder, 
                    flatcc_builder_create_string_str(&builder, prop_key),
                    flatcc_builder_create_string_str(&builder, prop_val.u.s));
                Property_vec_push(&builder, prop_ref);
                free(prop_val.u.s);
            }
            Property_vec_ref_t props_vec = Property_vec_end(&builder);

            StaticRule_ref_t rule_ref = StaticRule_create(&builder, 
                flatcc_builder_create_string_str(&builder, key), 
                props_vec);
            StaticRule_vec_push(&builder, rule_ref);
        }
    }
    StaticRule_vec_ref_t static_rules_vec = StaticRule_vec_end(&builder);

    // --- 5. Process Dynamic Rules (Temporarily Disabled) ---
    DynamicRule_vec_start(&builder);
    DynamicRule_vec_ref_t dynamic_rules_vec = DynamicRule_vec_end(&builder);

    // --- 6. Finalize FlatBuffers ---
    Styles_create_as_root(&builder, static_rules_vec, dynamic_rules_vec);

    // Get the finalized buffer and its size
    size_t size;
    void *buf = flatcc_builder_get_direct_buffer(&builder, &size);
    
    // --- 7. Write to Output File ---
    FILE *out = fopen("styles.bin", "wb");
    if (!out) {
        fprintf(stderr, "Error: Failed to open output file 'styles.bin' for writing.\n");
        exit(1);
    }
    fwrite(buf, 1, size, out);
    fclose(out);

    printf("Successfully converted '%s' to 'styles.bin'\n", toml_path);

    // --- 8. Cleanup ---
    toml_free(conf);
    flatcc_builder_clear(&builder);
    return 0;
}
