#include <stdio.h>
#include <stdlib.h>
#include "toml.h"
#include "flatcc/flatcc_builder.h"
#include "styles_generated.h"

// Helper to handle errors
#define CHECK(x) do { if (!(x)) { fprintf(stderr, "Error at %s:%d\n", __FILE__, __LINE__); exit(1); } } while (0)

int main(int argc, char *argv[]) {
    // Initialize TOML parser
    FILE *fp = fopen("styles.toml", "r");
    CHECK(fp);
    toml_table_t *conf = toml_parse_file(fp, NULL, 0);
    fclose(fp);
    CHECK(conf);

    // Initialize FlatBuffers builder
    flatcc_builder_t builder;
    flatcc_builder_init(&builder);

    // Create vectors for static and dynamic rules
    flatbuffers_string_vec_ref_t static_rules_vec = flatcc_builder_create_vector(&builder, 0);
    flatbuffers_string_vec_ref_t dynamic_rules_vec = flatcc_builder_create_vector(&builder, 0);

    // Process static rules
    toml_table_t *static_rules = toml_table_in(conf, "static_rules");
    if (static_rules) {
        for (int i = 0; i < toml_table_nkval(static_rules); i++) {
            const char *key = toml_key_in(static_rules, i);
            toml_table_t *rule = toml_table_in(static_rules, key);
            CHECK(rule);

            // Build properties
            flatbuffers_string_vec_ref_t props_vec = flatcc_builder_create_vector(&builder, 0);
            for (int j = 0; j < toml_table_nkval(rule); j++) {
                const char *prop_key = toml_key_in(rule, j);
                toml_datum_t prop_val = toml_string_in(rule, prop_key);
                CHECK(prop_val.ok);

                flatbuffers_string_ref_t prop = flatcc_builder_create_string(&builder, prop_key, strlen(prop_key));
                flatbuffers_string_ref_t val = flatcc_builder_create_string(&builder, prop_val.u.s, strlen(prop_val.u.s));
                Styles_Property_ref_t prop_ref = Styles_Property_create(&builder, prop, val);
                flatbuffers_string_vec_push(&builder, props_vec, prop_ref);
                free(prop_val.u.s);
            }

            // Create static rule
            flatbuffers_string_ref_t name = flatcc_builder_create_string(&builder, key, strlen(key));
            Styles_StaticRule_ref_t rule_ref = Styles_StaticRule_create(&builder, name, props_vec);
            flatbuffers_string_vec_push_sorted(&builder, static_rules_vec, rule_ref, Styles_StaticRule_name);
        }
    }

    // Process dynamic rules
    toml_table_t *dynamic_rules = toml_table_in(conf, "dynamic_rules");
    if (dynamic_rules) {
        for (int i = 0; i < toml_table_nkval(dynamic_rules); i++) {
            const char *key = toml_key_in(dynamic_rules, i);
            toml_table_t *rule = toml_table_in(dynamic_rules, key);
            CHECK(rule);

            // Get prefix
            toml_datum_t prefix = toml_string_in(rule, "prefix");
            CHECK(prefix.ok);
            flatbuffers_string_ref_t prefix_ref = flatcc_builder_create_string(&builder, prefix.u.s, strlen(prefix.u.s));
            free(prefix.u.s);

            // Get values
            toml_array_t *values = toml_array_in(rule, "values");
            CHECK(values);
            flatbuffers_string_vec_ref_t values_vec = flatcc_builder_create_vector(&builder, 0);
            for (int j = 0; j < toml_array_nelem(values); j++) {
                toml_datum_t val = toml_string_at(values, j);
                CHECK(val.ok);
                flatbuffers_string_ref_t val_ref = flatcc_builder_create_string(&builder, val.u.s, strlen(val.u.s));
                flatbuffers_string_vec_push(&builder, values_vec, val_ref);
                free(val.u.s);
            }

            // Get properties
            toml_table_t *props = toml_table_in(rule, "properties");
            CHECK(props);
            flatbuffers_string_vec_ref_t props_vec = flatcc_builder_create_vector(&builder, 0);
            for (int j = 0; j < toml_table_nkval(props); j++) {
                const char *prop_key = toml_key_in(props, j);
                toml_table_t *prop_table = toml_table_in(props, prop_key);
                CHECK(prop_table);

                flatbuffers_string_vec_ref_t prop_pairs = flatcc_builder_create_vector(&builder, 0);
                for (int k = 0; k < toml_table_nkval(prop_table); k++) {
                    const char *p_key = toml_key_in(prop_table, k);
                    toml_datum_t p_val = toml_string_in(prop_table, p_key);
                    CHECK(p_val.ok);

                    flatbuffers_string_ref_t p_key_ref = flatcc_builder_create_string(&builder, p_key, strlen(p_key));
                    flatbuffers_string_ref_t p_val_ref = flatcc_builder_create_string(&builder, p_val.u.s, strlen(p_val.u.s));
                    Styles_Property_ref_t prop_ref = Styles_Property_create(&builder, p_key_ref, p_val_ref);
                    flatbuffers_string_vec_push(&builder, prop_pairs, prop_ref);
                    free(p_val.u.s);
                }

                flatbuffers_string_ref_t prop_name = flatcc_builder_create_string(&builder, prop_key, strlen(prop_key));
                Styles_DynamicProperty_ref_t dyn_prop = Styles_DynamicProperty_create(&builder, prop_name, prop_pairs);
                flatbuffers_string_vec_push(&builder, props_vec, dyn_prop);
            }

            // Create dynamic rule
            Styles_DynamicRule_ref_t rule_ref = Styles_DynamicRule_create(&builder, prefix_ref, values_vec, props_vec);
            flatbuffers_string_vec_push_sorted(&builder, dynamic_rules_vec, rule_ref, Styles_DynamicRule_prefix);
        }
    }

    // Create root table
    Styles_Styles_ref_t styles = Styles_Styles_create(&builder, static_rules_vec, dynamic_rules_vec);

    // Finalize and write to file
    flatcc_builder_finalize_buffer(&builder, styles);
    size_t size;
    void *buf = flatcc_builder_get_buffer(&builder, &size);
    FILE *out = fopen("styles.bin", "wb");
    CHECK(out);
    fwrite(buf, 1, size, out);
    fclose(out);

    // Cleanup
    toml_free(conf);
    flatcc_builder_clear(&builder);
    return 0;
}