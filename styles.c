#include <stdio.h>
#include <stdlib.h>
#include <string.h>
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

    // Start the vectors for static and dynamic rules
    StaticRule_vec_ref_t static_rules_vec;
    DynamicRule_vec_ref_t dynamic_rules_vec;
    
    CHECK(StaticRule_vec_start(&builder) == 0);
    CHECK(DynamicRule_vec_start(&builder) == 0);

    // Process static rules
    toml_table_t *static_rules = toml_table_in(conf, "static_rules");
    if (static_rules) {
        for (int i = 0; i < toml_table_nkval(static_rules); i++) {
            const char *key = toml_key_in(static_rules, i);
            toml_table_t *rule = toml_table_in(static_rules, key);
            CHECK(rule);

            // Build properties
            Property_vec_ref_t props_vec;
            CHECK(Property_vec_start(&builder) == 0);
            
            for (int j = 0; j < toml_table_nkval(rule); j++) {
                const char *prop_key = toml_key_in(rule, j);
                toml_datum_t prop_val = toml_string_in(rule, prop_key);
                CHECK(prop_val.ok);

                flatbuffers_string_ref_t prop = flatcc_builder_create_string_str(&builder, prop_key);
                flatbuffers_string_ref_t val = flatcc_builder_create_string_str(&builder, prop_val.u.s);
                
                CHECK(Property_start(&builder) == 0);
                CHECK(Property_key_add(&builder, prop) == 0);
                CHECK(Property_value_add(&builder, val) == 0);
                Property_ref_t prop_ref = Property_end(&builder);
                
                CHECK(Property_vec_push(&builder, prop_ref) != NULL);
                free(prop_val.u.s);
            }
            
            props_vec = Property_vec_end(&builder);

            // Create static rule
            flatbuffers_string_ref_t name = flatcc_builder_create_string_str(&builder, key);
            
            CHECK(StaticRule_start(&builder) == 0);
            CHECK(StaticRule_name_add(&builder, name) == 0);
            CHECK(StaticRule_properties_add(&builder, props_vec) == 0);
            StaticRule_ref_t rule_ref = StaticRule_end(&builder);
            
            CHECK(StaticRule_vec_push(&builder, rule_ref) != NULL);
        }
    }
    
    static_rules_vec = StaticRule_vec_end(&builder);

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
            flatbuffers_string_ref_t prefix_ref = flatcc_builder_create_string_str(&builder, prefix.u.s);
            free(prefix.u.s);

            // Get values
            toml_array_t *values = toml_array_in(rule, "values");
            CHECK(values);
            
            CHECK(flatbuffers_string_vec_start(&builder) == 0);
            for (int j = 0; j < toml_array_nelem(values); j++) {
                toml_datum_t val = toml_string_at(values, j);
                CHECK(val.ok);
                flatbuffers_string_ref_t val_ref = flatcc_builder_create_string_str(&builder, val.u.s);
                CHECK(flatbuffers_string_vec_push(&builder, val_ref) != NULL);
                free(val.u.s);
            }
            flatbuffers_string_vec_ref_t values_vec = flatbuffers_string_vec_end(&builder);

            // Get properties
            toml_table_t *props = toml_table_in(rule, "properties");
            CHECK(props);
            
            CHECK(DynamicProperty_vec_start(&builder) == 0);
            for (int j = 0; j < toml_table_nkval(props); j++) {
                const char *prop_key = toml_key_in(props, j);
                toml_table_t *prop_table = toml_table_in(props, prop_key);
                CHECK(prop_table);

                CHECK(Property_vec_start(&builder) == 0);
                for (int k = 0; k < toml_table_nkval(prop_table); k++) {
                    const char *p_key = toml_key_in(prop_table, k);
                    toml_datum_t p_val = toml_string_in(prop_table, p_key);
                    CHECK(p_val.ok);

                    flatbuffers_string_ref_t p_key_ref = flatcc_builder_create_string_str(&builder, p_key);
                    flatbuffers_string_ref_t p_val_ref = flatcc_builder_create_string_str(&builder, p_val.u.s);
                    
                    CHECK(Property_start(&builder) == 0);
                    CHECK(Property_key_add(&builder, p_key_ref) == 0);
                    CHECK(Property_value_add(&builder, p_val_ref) == 0);
                    Property_ref_t prop_ref = Property_end(&builder);
                    
                    CHECK(Property_vec_push(&builder, prop_ref) != NULL);
                    free(p_val.u.s);
                }
                Property_vec_ref_t prop_pairs = Property_vec_end(&builder);

                flatbuffers_string_ref_t prop_name = flatcc_builder_create_string_str(&builder, prop_key);
                
                CHECK(DynamicProperty_start(&builder) == 0);
                CHECK(DynamicProperty_name_add(&builder, prop_name) == 0);
                CHECK(DynamicProperty_properties_add(&builder, prop_pairs) == 0);
                DynamicProperty_ref_t dyn_prop = DynamicProperty_end(&builder);
                
                CHECK(DynamicProperty_vec_push(&builder, dyn_prop) != NULL);
            }
            DynamicProperty_vec_ref_t props_vec = DynamicProperty_vec_end(&builder);

            // Create dynamic rule
            CHECK(DynamicRule_start(&builder) == 0);
            CHECK(DynamicRule_prefix_add(&builder, prefix_ref) == 0);
            CHECK(DynamicRule_values_add(&builder, values_vec) == 0);
            CHECK(DynamicRule_properties_add(&builder, props_vec) == 0);
            DynamicRule_ref_t rule_ref = DynamicRule_end(&builder);
            
            CHECK(DynamicRule_vec_push(&builder, rule_ref) != NULL);
        }
    }
    
    dynamic_rules_vec = DynamicRule_vec_end(&builder);

    // Create root table
    CHECK(Styles_start(&builder) == 0);
    CHECK(Styles_static_rules_add(&builder, static_rules_vec) == 0);
    CHECK(Styles_dynamic_rules_add(&builder, dynamic_rules_vec) == 0);
    Styles_ref_t styles = Styles_end(&builder);

    // Finalize buffer
    size_t size;
    void *buf = flatcc_builder_get_direct_buffer(&builder, &size);
    
    // Write to file
    FILE *out = fopen("styles.bin", "wb");
    CHECK(out);
    fwrite(buf, 1, size, out);
    fclose(out);

    // Cleanup
    toml_free(conf);
    flatcc_builder_clear(&builder);
    return 0;
}