#include "common.h"
#include "watcher.h"

static uv_loop_t *loop;

void cleanup() {
    cleanup_watcher();
    uv_run(loop, UV_RUN_NOWAIT); 
    uv_loop_close(loop);
}

int main(int argc, char *argv[]) {
    loop = uv_default_loop();
    atexit(cleanup);

    srand((unsigned int)time(NULL));

    run_modification_cycle(NULL);

    start_watching(loop, "./src");

    return uv_run(loop, UV_RUN_DEFAULT);
}