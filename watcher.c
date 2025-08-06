#include "watcher.h"
#include "parser.h"
#include "css_generator.h"
#include "file_io.h"
#include "utils.h"
#include "id_generator.h"

static uv_timer_t debounce_timer;
static char* last_changed_file = NULL;
static DataLists previous_data = {0};
static uv_fs_event_t fs_event;

static void on_debounce_timeout(uv_timer_t *handle);
static void on_file_change(uv_fs_event_t *handle, const char *filename, int events, int status);

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
    collect_data(&current_data, "./src");
    write_final_css("styles.css", &current_data, styles_buffer);

    if (trigger_file) {
        int ids_added = 0, ids_removed = 0;
        int classes_added = 0, classes_removed = 0;

        for (size_t i = 0; i < current_data.id_count; i++) {
            bool found = false;
            for (size_t j = 0; j < previous_data.id_count; j++) {
                if (strcmp(current_data.injected_ids[i], previous_data.injected_ids[j]) == 0) {
                    found = true; break;
                }
            }
            if (!found) ids_added++;
        }
        for (size_t i = 0; i < previous_data.id_count; i++) {
            bool found = false;
            for (size_t j = 0; j < current_data.id_count; j++) {
                if (strcmp(previous_data.injected_ids[i], current_data.injected_ids[j]) == 0) {
                    found = true; break;
                }
            }
            if (!found) ids_removed++;
        }
        for (size_t i = 0; i < current_data.class_count; i++) {
            bool found = false;
            for (size_t j = 0; j < previous_data.class_count; j++) {
                if (strcmp(current_data.class_names[i], previous_data.class_names[j]) == 0) {
                    found = true; break;
                }
            }
            if (!found) classes_added++;
        }
        for (size_t i = 0; i < previous_data.class_count; i++) {
            bool found = false;
            for (size_t j = 0; j < current_data.class_count; j++) {
                if (strcmp(previous_data.class_names[i], current_data.class_names[j]) == 0) {
                    found = true; break;
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

static void on_debounce_timeout(uv_timer_t *handle) {
    if (last_changed_file) {
        run_modification_cycle(last_changed_file);
        free(last_changed_file);
        last_changed_file = NULL;
    }
}

static void on_file_change(uv_fs_event_t *handle, const char *filename, int events, int status) {
    if (status < 0) {
        fprintf(stderr, "Error watching file: %s\n", uv_strerror(status));
        return;
    }
    
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

void start_watching(uv_loop_t *loop, const char* directory) {
    uv_timer_init(loop, &debounce_timer);
    uv_fs_event_init(loop, &fs_event);
    uv_fs_event_start(&fs_event, on_file_change, directory, UV_FS_EVENT_RECURSIVE);
    printf("🎨 %sdx-styles%s watching for component changes in '%s'...\n", KBLU, KNRM, directory);
}

void cleanup_watcher() {
    if (last_changed_file) free(last_changed_file);
    free_data_contents(&previous_data);
    uv_timer_stop(&debounce_timer);
    uv_close((uv_handle_t*)&debounce_timer, NULL);
    uv_close((uv_handle_t*)&fs_event, NULL);
}