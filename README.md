# dx

Dx cli

git clone https://github.com/tree-sitter/tree-sitter-typescript.git
cd tree-sitter-typescript
make && sudo make install
sudo ldconfig






















































CMakeLists.txt
dx-styles.c
src
styles.toml
Makefile
README.md
build
styles.bin
styles.c
styles.fbs


styles_verifier.h
flatbuffers_common_builder.h
styles_builder.h
tree-sitter-typescript
flatbuffers_common_reader.h
styles_generated.h
tree_sitter_tsx.h
flatcc_output.log
styles_reader.h











































































































sudo apt update
sudo apt install -y libuv1-dev
sudo apt install -y tree_sitter_tsx

cd /workspaces/dx
make generate  # Assumes Makefile from previous responses














































































CMakeLists.txt  flatbuffers_common_builder.h  main      styles.fbs        styles_generated.h  tomlc99
README.md       flatbuffers_common_reader.h   main.c    styles.toml       styles_reader.h
build           flatcc_output.log             styles.c  styles_builder.h  styles_verifier.h


sudo apt install -y inotify-tools

sudo apt update
sudo apt install -y git cmake make gcc


# Clone tomlc99 repository
git clone https://github.com/cktan/tomlc99.git
cd tomlc99

# Build and install
make
sudo make install
sudo ldconfig  # Update dynamic linker cache
cd ..

# Clone flatcc repository
git clone https://github.com/dvidelabs/flatcc.git
cd flatcc

# Create build directory and configure with CMake
mkdir build && cd build
cmake .. -DFLATCC_INSTALL=ON

# Build and install
make
sudo make install
sudo ldconfig  # Update dynamic linker cache
cd ../..


## Prerequisites

```bash
# Install required dependencies
sudo apt update && sudo apt install -y \
    build-essential \
    libuv1-dev \
    libtree-sitter-dev \
    liburing-dev \
    flatbuffers-compiler
```

### Building

```bash
# Compile with io_uring support on Linux
gcc -o main main.c -O2 -Wall -lpthread
gcc -O3 -Wall -o main main.c -lpthread

# Run the program
./main
```

### Code Overview

The program demonstrates high-performance file I/O using:

- Linux: io_uring
- Windows: IORing
- macOS: kqueue
- POSIX: mmap/pthreads
- Other: Standard C11

Platform-specific optimizations are automatically selected at compile time.

### C Code

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#if defined(__linux__)
    #define DX_PLATFORM_LINUX_IO_URING
#elif defined(_WIN32)
    #define DX_PLATFORM_WINDOWS_IORING
#elif defined(__APPLE__)
    #define DX_PLATFORM_MACOS_KQUEUE
#elif defined(__unix__)
    #define DX_PLATFORM_POSIX
#else
    #define DX_PLATFORM_STANDARD
#endif

#if defined(DX_PLATFORM_LINUX_IO_URING)
    #include <fcntl.h>
    #include <unistd.h>
    #include <sys/stat.h>
    #include <liburing.h>
#elif defined(DX_PLATFORM_WINDOWS_IORING)
    #include <windows.h>
    #include <ioringapi.h>
#elif defined(DX_PLATFORM_MACOS_KQUEUE)
    #include <fcntl.h>
    #include <unistd.h>
    #include <sys/stat.h>
    #include <sys/event.h>
#elif defined(DX_PLATFORM_POSIX)
    #include <pthread.h>
    #include <fcntl.h>
    #include <unistd.h>
    #include <sys/stat.h>
    #include <sys/mman.h>
#elif defined(DX_PLATFORM_STANDARD)
    #if defined(_WIN32)
        #include <direct.h>
        #define MKDIR(path) _mkdir(path)
    #else
        #include <sys/stat.h>
        #define MKDIR(path) mkdir(path, 0755)
    #endif
    #include <threads.h>
#endif

#define FOLDER "modules"
#define FILE_PREFIX "file"
#define FILE_SUFFIX ".txt"
#define CONTENT "Hello, High-Performance I/O!"

static inline char* fast_itoa(int value, char* buffer_end) {
    *buffer_end = '\0';
    char* p = buffer_end;
    if (value == 0) { *--p = '0'; return p; }
    do {
        *--p = '0' + (value % 10);
        value /= 10;
    } while (value > 0);
    return p;
}

#if defined(DX_PLATFORM_POSIX) || defined(DX_PLATFORM_STANDARD)
typedef struct {
    const int *indices;
    int start;
    int end;
    int dir_fd;
} ThreadArgs;

#if defined(DX_PLATFORM_POSIX)
void *worker_posix(void *arg) {
    ThreadArgs *args = (ThreadArgs *)arg;
    char filename[256];
    const size_t prefix_len = strlen(FILE_PREFIX);
    const size_t suffix_len = strlen(FILE_SUFFIX);
    const size_t content_len = strlen(CONTENT);
    memcpy(filename, FILE_PREFIX, prefix_len);
    char *num_start_ptr = filename + prefix_len;

    for (int i = args->start; i < args->end; i++) {
        char num_buf[12];
        char* num_str = fast_itoa(args->indices[i], num_buf + sizeof(num_buf) - 1);
        size_t num_len = (num_buf + sizeof(num_buf) - 1) - num_str;

        memcpy(num_start_ptr, num_str, num_len);
        memcpy(num_start_ptr + num_len, FILE_SUFFIX, suffix_len + 1);

        int fd = openat(args->dir_fd, filename, O_RDWR | O_CREAT | O_TRUNC, 0644);
        if (fd == -1) continue;

        ftruncate(fd, content_len);
        void *map = mmap(NULL, content_len, PROT_WRITE, MAP_SHARED, fd, 0);
        if (map == MAP_FAILED) {
            close(fd);
            continue;
        }
        memcpy(map, CONTENT, content_len);
        munmap(map, content_len);
        close(fd);
    }
    return NULL;
}
#elif defined(DX_PLATFORM_STANDARD)
int worker_standard(void *arg) {
    ThreadArgs *data = (ThreadArgs *)arg;
    char filepath[256];
    for (int i = data->start; i < data->end; ++i) {
        snprintf(filepath, sizeof(filepath), "%s/%s%d%s", FOLDER, FILE_PREFIX, data->indices[i], FILE_SUFFIX);
        FILE *fp = fopen(filepath, "w");
        if (fp == NULL) continue;
        fputs(CONTENT, fp);
        fclose(fp);
    }
    return 0;
}
double get_monotonic_time() {
    struct timespec ts;
    timespec_get(&ts, TIME_UTC);
    return (double)ts.tv_sec + (double)ts.tv_nsec / 1.0e9;
}
#endif
#endif

int main(void) {
    const int num_files = 10000;
    int* indices = malloc(num_files * sizeof(int));
    if (!indices) {
        fprintf(stderr, "Failed to allocate memory for indices.\n");
        return 1;
    }
    for (int i = 0; i < num_files; ++i) {
        indices[i] = i;
    }

#if defined(_WIN32)
    CreateDirectoryA(FOLDER, NULL);
#else
    mkdir(FOLDER, 0755);
#endif

#if defined(DX_PLATFORM_LINUX_IO_URING)
    printf("Running on Linux: Using ultra-performance io_uring.\n");
    struct timespec start_time, end_time;
    clock_gettime(CLOCK_MONOTONIC, &start_time);

    // Use a more conservative queue size
    struct io_uring ring;
    if (io_uring_queue_init(256, &ring, 0) < 0) {
        perror("io_uring_queue_init");
        free(indices);
        return 1;
    }

    int dir_fd = open(FOLDER, O_RDONLY | O_DIRECTORY);
    if (dir_fd < 0) {
        perror("open folder");
        io_uring_queue_exit(&ring);
        free(indices);
        return 1;
    }
    
    // Allocate memory for file tracking
    char (*filenames)[256] = malloc(num_files * sizeof(*filenames));
    int *fds = calloc(num_files, sizeof(int)); // Initialize to 0
    if (!filenames || !fds) {
        fprintf(stderr, "Failed to allocate memory\n");
        close(dir_fd);
        io_uring_queue_exit(&ring);
        free(filenames);
        free(fds);
        free(indices);
        return 1;
    }

    // Phase 1: Open files in batches
    int open_files_count = 0;
    const int BATCH_SIZE = 64;
    const size_t content_len = strlen(CONTENT);
    
    for (int batch_start = 0; batch_start < num_files; batch_start += BATCH_SIZE) {
        int batch_end = batch_start + BATCH_SIZE;
        if (batch_end > num_files) batch_end = num_files;
        int batch_size = batch_end - batch_start;
        
        // Prepare filenames and SQEs for open operations
        for (int i = 0; i < batch_size; i++) {
            int idx = batch_start + i;
            snprintf(filenames[idx], 256, "%s%d%s", FILE_PREFIX, indices[idx], FILE_SUFFIX);
            
            struct io_uring_sqe *sqe = io_uring_get_sqe(&ring);
            if (!sqe) {
                fprintf(stderr, "Could not get SQE for open %d\n", idx);
                continue;
            }
            io_uring_prep_openat(sqe, dir_fd, filenames[idx], O_WRONLY | O_CREAT | O_TRUNC, 0644);
            sqe->user_data = idx;
        }
        
        // Submit batch
        int submitted = io_uring_submit(&ring);
        if (submitted <= 0) {
            perror("io_uring_submit");
            continue;
        }
        
        // Process completions for this batch
        for (int i = 0; i < submitted; i++) {
            struct io_uring_cqe *cqe = NULL;
            int ret = io_uring_wait_cqe(&ring, &cqe);
            
            if (ret < 0) {
                perror("io_uring_wait_cqe");
                continue;
            }
            
            if (cqe) {
                int idx = cqe->user_data;
                if (idx >= 0 && idx < num_files) {
                    if (cqe->res >= 0) {
                        fds[idx] = cqe->res;
                        open_files_count++;
                    }
                }
                io_uring_cqe_seen(&ring, cqe);
            }
        }
    }
    
    // Phase 2: Write to files in batches
    for (int batch_start = 0; batch_start < num_files; batch_start += BATCH_SIZE) {
        int batch_end = batch_start + BATCH_SIZE;
        if (batch_end > num_files) batch_end = num_files;
        int batch_size = batch_end - batch_start;
        int submitted = 0;
        
        // Prepare write operations
        for (int i = 0; i < batch_size; i++) {
            int idx = batch_start + i;
            if (fds[idx] <= 0) continue;
            
            struct io_uring_sqe *sqe = io_uring_get_sqe(&ring);
            if (!sqe) {
                fprintf(stderr, "Could not get SQE for write %d\n", idx);
                continue;
            }
            io_uring_prep_write(sqe, fds[idx], CONTENT, content_len, 0);
            sqe->user_data = idx;
            submitted++;
        }
        
        // Submit batch
        if (submitted > 0) {
            int ret = io_uring_submit(&ring);
            if (ret <= 0) {
                perror("io_uring_submit for write");
                continue;
            }
            
            // Process completions
            for (int i = 0; i < submitted; i++) {
                struct io_uring_cqe *cqe = NULL;
                int ret = io_uring_wait_cqe(&ring, &cqe);
                
                if (ret < 0) {
                    perror("io_uring_wait_cqe for write");
                    continue;
                }
                
                if (cqe) {
                    io_uring_cqe_seen(&ring, cqe);
                }
            }
        }
    }
    
    // Phase 3: Close files
    for (int i = 0; i < num_files; i++) {
        if (fds[i] > 0) {
            close(fds[i]);
        }
    }
    
    free(filenames);
    free(fds);
    close(dir_fd);
    io_uring_queue_exit(&ring);

    clock_gettime(CLOCK_MONOTONIC, &end_time);
    double time_ms = (end_time.tv_sec - start_time.tv_sec) * 1000.0 + (end_time.tv_nsec - start_time.tv_nsec) / 1000000.0;
    printf("\nFinished creating %d files.\n", open_files_count);
    printf("Total time taken: %.2f ms\n", time_ms);

#elif defined(DX_PLATFORM_WINDOWS_IORING)
    printf("Running on Windows: Using high-performance IORing.\n");
    LARGE_INTEGER frequency, start_time, end_time;
    QueryPerformanceFrequency(&frequency);
    QueryPerformanceCounter(&start_time);

    HIORING ring;
    CreateIoRing(IORING_VERSION_3, 256, 256, &ring);

    char current_dir[MAX_PATH];
    GetCurrentDirectoryA(MAX_PATH, current_dir);
    char folder_path[MAX_PATH];
    snprintf(folder_path, sizeof(folder_path), "%s\\%s", current_dir, FOLDER);

    const size_t content_len = strlen(CONTENT);
    HANDLE *file_handles = malloc(num_files * sizeof(HANDLE));
    if (!file_handles) {
        fprintf(stderr, "Failed to allocate memory for file handles\n");
        free(indices);
        return 1;
    }

    for (int i = 0; i < num_files; i++) {
        char filepath[MAX_PATH];
        snprintf(filepath, sizeof(filepath), "%s\\%s%d%s", folder_path, FILE_PREFIX, indices[i], FILE_SUFFIX);
        file_handles[i] = CreateFileA(filepath, GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_FLAG_OVERLAPPED, NULL);
        if (file_handles[i] == INVALID_HANDLE_VALUE) continue;

        IORING_BUFFER_INFO buffer_info = { .Address = (void*)CONTENT, .Length = (UINT32)content_len };
        IORING_HANDLE_INFO handle_info = { .Handle = file_handles[i], .Registering = FALSE };
        BuildIoRingWriteFile(ring, handle_info, buffer_info, 0, 0, (UINT_PTR)i, IOSQE_FLAGS_NONE);
    }

    SubmitIoRing(ring, 0, 0, NULL);

    for (int i = 0; i < num_files; i++) {
        IORING_CQE cqe;
        PopIoRingCompletion(ring, &cqe);
    }

    for (int i = 0; i < num_files; i++) {
        if (file_handles[i] != INVALID_HANDLE_VALUE) CloseHandle(file_handles[i]);
    }
    free(file_handles);
    CloseIoRing(ring);

    QueryPerformanceCounter(&end_time);
    double time_ms = ((double)(end_time.QuadPart - start_time.QuadPart) * 1000.0) / frequency.QuadPart;
    printf("\nFinished creating %d files.\n", num_files);
    printf("Total time taken: %.2f ms\n", time_ms);

#elif defined(DX_PLATFORM_MACOS_KQUEUE)
    printf("Running on macOS: Using high-performance kqueue.\n");
    struct timespec start_time, end_time;
    clock_gettime(CLOCK_MONOTONIC, &start_time);

    int kq = kqueue();
    int dir_fd = open(FOLDER, O_RDONLY | O_DIRECTORY);
    
    int *fds = malloc(num_files * sizeof(int));
    struct kevent *changelist = malloc(num_files * sizeof(struct kevent));
    if (!fds || !changelist) {
        fprintf(stderr, "Failed to allocate memory for fds or changelist\n");
        free(fds);
        free(changelist);
        close(dir_fd);
        close(kq);
        free(indices);
        return 1;
    }

    const size_t content_len = strlen(CONTENT);
    int valid_files = 0;

    for (int i = 0; i < num_files; i++) {
        char filename[256];
        snprintf(filename, sizeof(filename), "%s%d%s", FILE_PREFIX, indices[i], FILE_SUFFIX);
        fds[i] = openat(dir_fd, filename, O_WRONLY | O_CREAT | O_TRUNC, 0644);
        if (fds[i] == -1) continue;
        EV_SET(&changelist[valid_files], fds[i], EVFILT_WRITE, EV_ADD | EV_ONESHOT, 0, 0, (void*)(intptr_t)i);
        valid_files++;
    }

    kevent(kq, changelist, valid_files, NULL, 0, NULL);

    struct kevent eventlist[num_files];
    int events_handled = 0;
    while(events_handled < valid_files) {
        int nev = kevent(kq, NULL, 0, eventlist, valid_files - events_handled, NULL);
        for (int i = 0; i < nev; i++) {
            int fd = eventlist[i].ident;
            write(fd, CONTENT, content_len);
            close(fd);
            events_handled++;
        }
    }

    free(fds);
    free(changelist);
    close(dir_fd);
    close(kq);

    clock_gettime(CLOCK_MONOTONIC, &end_time);
    double time_ms = (end_time.tv_sec - start_time.tv_sec) * 1000.0 + (end_time.tv_nsec - start_time.tv_nsec) / 1000000.0;
    printf("\nFinished creating %d files.\n", valid_files);
    printf("Total time taken: %.2f ms\n", time_ms);

#elif defined(DX_PLATFORM_POSIX)
    printf("Running on POSIX (BSD/etc): Using high-performance mmap/pthreads.\n");
    struct timespec start_time, end_time;
    clock_gettime(CLOCK_MONOTONIC, &start_time);
    
    int dir_fd = open(FOLDER, O_RDONLY | O_DIRECTORY);
    #define NUM_THREADS 8
    pthread_t threads[NUM_THREADS];
    ThreadArgs args[NUM_THREADS];
    int files_per_thread = num_files / NUM_THREADS;

    for (int i = 0; i < NUM_THREADS; i++) {
        args[i].indices = indices;
        args[i].start = i * files_per_thread;
        args[i].end = (i == NUM_THREADS - 1) ? num_files : (i + 1) * files_per_thread;
        args[i].dir_fd = dir_fd;
        pthread_create(&threads[i], NULL, worker_posix, &args[i]);
    }

    for (int i = 0; i < NUM_THREADS; i++) {
        pthread_join(threads[i], NULL);
    }

    close(dir_fd);
    clock_gettime(CLOCK_MONOTONIC, &end_time);
    double time_ms = (end_time.tv_sec - start_time.tv_sec) * 1000.0 + (end_time.tv_nsec - start_time.tv_nsec) / 1000000.0;
    printf("\nFinished creating %d files.\n", num_files);
    printf("Total time taken: %.2f ms\n", time_ms);

#elif defined(DX_PLATFORM_STANDARD)
    printf("Running on other OS: Using standard C11 threads and I/O.\n");
    double start_time = get_monotonic_time();
    
    MKDIR(FOLDER);
    
    #define NUM_THREADS 8
    thrd_t threads[NUM_THREADS];
    ThreadArgs thread_data_array[NUM_THREADS];
    int files_per_thread = num_files / NUM_THREADS;

    for (int i = 0; i < NUM_THREADS; ++i) {
        thread_data_array[i].indices = indices;
        thread_data_array[i].start = i * files_per_thread;
        thread_data_array[i].end = (i == NUM_THREADS - 1) ? num_files : (i + 1) * files_per_thread;
        thrd_create(&threads[i], worker_standard, &thread_data_array[i]);
    }

    for (int i = 0; i < NUM_THREADS; ++i) {
        thrd_join(threads[i], NULL);
    }

    double end_time = get_monotonic_time();
    double time_ms = (end_time - start_time) * 1000.0;
    printf("\nFinished creating %d files.\n", num_files);
    printf("Total time taken: %.2f ms\n", time_ms);
#endif

    free(indices);
    return 0;
}
```
