#include "css_generator.h"
#include "file_io.h"
#include "utils.h"

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