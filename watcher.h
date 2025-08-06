#ifndef DX_WATCHER_H
#define DX_WATCHER_H

#include "common.h"

void run_modification_cycle(const char* trigger_file);
void start_watching(uv_loop_t *loop, const char* directory);
void cleanup_watcher();

#endif