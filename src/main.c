#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#if defined(_WIN32)
    #define DX_PLATFORM_WINDOWS
#elif defined(__unix__) || defined(__APPLE__)
    #define DX_PLATFORM_POSIX
#else
    #define DX_PLATFORM_STANDARD
#endif

#if defined(DX_PLATFORM_WINDOWS)
    #include <windows.h>
    #include <direct.h>
    #include <threads.h>
    #define MKDIR(path) _mkdir(path)
#elif defined(DX_PLATFORM_POSIX)
    #include <pthread.h>
    #include <fcntl.h>
    #include <unistd.h>
    #include <sys/stat.h>
    #include <sys/mman.h>
    #ifndef O_DIRECTORY
        #define O_DIRECTORY 0200000
    #endif
    #define MKDIR(path) mkdir(path, 0755)
#else
    #include <sys/stat.h>
    #include <threads.h>
    #define MKDIR(path) mkdir(path, 0755)
#endif

#define FOLDER "modules"
#define FILE_PREFIX "file"
#define FILE_SUFFIX ".txt"

static inline char* fast_itoa(int value, char* buffer_end) {
    *buffer_end = '\0';
    char* p = buffer_end;
    if (value == 0) { *--p = '0'; return p; }
    do { *--p = '0' + (value % 10); value /= 10; } while (value > 0);
    return p;
}

double get_monotonic_time() {
    struct timespec ts;
    timespec_get(&ts, TIME_UTC);
    return (double)ts.tv_sec + (double)ts.tv_nsec / 1.0e9;
}

#if defined(DX_PLATFORM_WINDOWS)
#define CREATE_CONTENT "Files Created on Windows!\n"
#define OVERWRITE_CONTENT "Files Overwritten with MMAP on Windows!\n"

typedef struct {
    const int *indices;
    int start;
    int end;
    const char *content;
    size_t content_len;
} ThreadArgs_Windows;

int create_files_worker_windows(void* arg) {
    ThreadArgs_Windows *args = (ThreadArgs_Windows *)arg;
    char filepath[256];
    for (int i = args->start; i < args->end; ++i) {
        snprintf(filepath, sizeof(filepath), "%s\\%s%d%s", FOLDER, FILE_PREFIX, args->indices[i], FILE_SUFFIX);
        FILE *fp = fopen(filepath, "wb");
        if (fp) {
            fwrite(args->content, 1, args->content_len, fp);
            fclose(fp);
        }
    }
    return 0;
}

int overwrite_files_mmap_worker_windows(void *arg) {
    ThreadArgs_Windows *args = (ThreadArgs_Windows *)arg;
    char filepath[256];

    for (int i = args->start; i < args->end; i++) {
        snprintf(filepath, sizeof(filepath), "%s\\%s%d%s", FOLDER, FILE_PREFIX, args->indices[i], FILE_SUFFIX);

        HANDLE hFile = CreateFileA(filepath, GENERIC_READ | GENERIC_WRITE, 0, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
        if (hFile == INVALID_HANDLE_VALUE) continue;

        HANDLE hMapFile = CreateFileMappingA(hFile, NULL, PAGE_READWRITE, 0, (DWORD)args->content_len, NULL);
        if (hMapFile == NULL) {
            CloseHandle(hFile);
            continue;
        }

        LPVOID pMapView = MapViewOfFile(hMapFile, FILE_MAP_WRITE, 0, 0, args->content_len);
        if (pMapView == NULL) {
            CloseHandle(hMapFile);
            CloseHandle(hFile);
            continue;
        }

        memcpy(pMapView, args->content, args->content_len);

        UnmapViewOfFile(pMapView);
        CloseHandle(hMapFile);
        CloseHandle(hFile);
    }
    return 0;
}
#endif

#if defined(DX_PLATFORM_POSIX)
#define CREATE_CONTENT "Files Created on POSIX!\n"
#define OVERWRITE_CONTENT "Files Overwritten with MMAP on POSIX!\n"

typedef struct {
    const int *indices;
    int start;
    int end;
    int dir_fd;
    const char *content;
    size_t content_len;
} ThreadArgs_POSIX;

void *create_files_worker_posix(void *arg) {
    ThreadArgs_POSIX *args = (ThreadArgs_POSIX *)arg;
    char filename[256];
    const size_t prefix_len = strlen(FILE_PREFIX);
    const size_t suffix_len = strlen(FILE_SUFFIX);
    memcpy(filename, FILE_PREFIX, prefix_len);
    char *num_start_ptr = filename + prefix_len;

    for (int i = args->start; i < args->end; i++) {
        char num_buf[12];
        char* num_str = fast_itoa(args->indices[i], num_buf + sizeof(num_buf) - 1);
        size_t num_len = (num_buf + sizeof(num_buf) - 1) - num_str;
        memcpy(num_start_ptr, num_str, num_len);
        memcpy(num_start_ptr + num_len, FILE_SUFFIX, suffix_len + 1);

        int fd = openat(args->dir_fd, filename, O_WRONLY | O_CREAT | O_TRUNC, 0644);
        if (fd == -1) continue;
        write(fd, args->content, args->content_len);
        close(fd);
    }
    return NULL;
}

void *overwrite_files_mmap_worker_posix(void *arg) {
    ThreadArgs_POSIX *args = (ThreadArgs_POSIX *)arg;
    char filename[256];
    const size_t prefix_len = strlen(FILE_PREFIX);
    const size_t suffix_len = strlen(FILE_SUFFIX);
    memcpy(filename, FILE_PREFIX, prefix_len);
    char *num_start_ptr = filename + prefix_len;

    for (int i = args->start; i < args->end; i++) {
        char num_buf[12];
        char* num_str = fast_itoa(args->indices[i], num_buf + sizeof(num_buf) - 1);
        size_t num_len = (num_buf + sizeof(num_buf) - 1) - num_str;
        memcpy(num_start_ptr, num_str, num_len);
        memcpy(num_start_ptr + num_len, FILE_SUFFIX, suffix_len + 1);

        int fd = openat(args->dir_fd, filename, O_RDWR);
        if (fd == -1) continue;

        void *map = mmap(NULL, args->content_len, PROT_WRITE, MAP_SHARED, fd, 0);
        if (map == MAP_FAILED) {
            close(fd);
            continue;
        }
        memcpy(map, args->content, args->content_len);
        munmap(map, args->content_len);
        close(fd);
    }
    return NULL;
}
#endif

#if defined(DX_PLATFORM_STANDARD)
#define CONTENT "Hello, Standard C I/O!"
typedef struct {
    const int *indices;
    int start;
    int end;
} ThreadData_Standard;

int create_files_worker_standard(void* arg) {
    ThreadData_Standard *data = (ThreadData_Standard *)arg;
    char filepath[256];
    for (int i = data->start; i < data->end; ++i) {
        snprintf(filepath, sizeof(filepath), "%s/%s%d%s", FOLDER, FILE_PREFIX, data->indices[i], FILE_SUFFIX);
        FILE *fp = fopen(filepath, "w");
        if (fp) {
            fputs(CONTENT, fp);
            fclose(fp);
        }
    }
    return 0;
}
#endif

int run_file_generator(const int *indices, int num_files) {
    if (num_files <= 0) {
        printf("No files to create.\n");
        return 0;
    }

    #define NUM_THREADS 8
    
    if (MKDIR(FOLDER) != 0) {
        printf("Directory '%s' may already exist. Continuing...\n", FOLDER);
    } else {
        printf("Directory '%s' created successfully.\n", FOLDER);
    }

#if defined(DX_PLATFORM_WINDOWS)
    printf("Running on Windows: Using high-performance MMAP method.\n");
    double start_time = get_monotonic_time();

    char first_filepath[256];
    snprintf(first_filepath, sizeof(first_filepath), "%s\\%s%d%s", FOLDER, FILE_PREFIX, indices[0], FILE_SUFFIX);
    
    int (*worker_func)(void*);
    const char* action_description;
    const char* content_to_write;

    const size_t create_len = strlen(CREATE_CONTENT);
    const size_t overwrite_len = strlen(OVERWRITE_CONTENT);
    const size_t max_len = (create_len > overwrite_len) ? create_len : overwrite_len;
    char padded_create_content[max_len + 1];
    char padded_overwrite_content[max_len + 1];
    memcpy(padded_create_content, CREATE_CONTENT, create_len);
    memset(padded_create_content + create_len, ' ', max_len - create_len);
    padded_create_content[max_len] = '\0';
    memcpy(padded_overwrite_content, OVERWRITE_CONTENT, overwrite_len);
    memset(padded_overwrite_content + overwrite_len, ' ', max_len - overwrite_len);
    padded_overwrite_content[max_len] = '\0';

    FILE* check_file = fopen(first_filepath, "r");
    if (check_file) {
        fclose(check_file);
        worker_func = overwrite_files_mmap_worker_windows;
        content_to_write = padded_overwrite_content;
        action_description = "overwriting";
    } else {
        worker_func = create_files_worker_windows;
        content_to_write = padded_create_content;
        action_description = "creating";
    }

    thrd_t threads[NUM_THREADS];
    ThreadArgs_Windows args[NUM_THREADS];
    int files_per_thread = num_files / NUM_THREADS;

    for (int i = 0; i < NUM_THREADS; i++) {
        args[i].indices = indices;
        args[i].start = i * files_per_thread;
        args[i].end = (i == NUM_THREADS - 1) ? num_files : (i + 1) * files_per_thread;
        args[i].content = content_to_write;
        args[i].content_len = max_len;
        thrd_create(&threads[i], worker_func, &args[i]);
    }

    for (int i = 0; i < NUM_THREADS; i++) {
        thrd_join(threads[i], NULL);
    }

    double end_time = get_monotonic_time();
    double time_ms = (end_time - start_time) * 1000.0;
    printf("\nFinished %s %d files.\n", action_description, num_files);
    printf("Total time taken: %.2f ms\n", time_ms);

#elif defined(DX_PLATFORM_POSIX)
    printf("Running on POSIX: Using high-performance mmap/openat methods.\n");
    struct timespec start_time, end_time;
    clock_gettime(CLOCK_MONOTONIC, &start_time);

    int dir_fd = open(FOLDER, O_RDONLY | O_DIRECTORY);
    if (dir_fd == -1) {
        perror("Fatal: Could not open directory " FOLDER);
        return 1;
    }

    void *(*worker_func)(void *);
    const char *content_to_write;
    const char *action_description;
    
    const size_t create_len = strlen(CREATE_CONTENT);
    const size_t overwrite_len = strlen(OVERWRITE_CONTENT);
    const size_t max_len = (create_len > overwrite_len) ? create_len : overwrite_len;
    char padded_create_content[max_len + 1];
    char padded_overwrite_content[max_len + 1];
    memcpy(padded_create_content, CREATE_CONTENT, create_len);
    memset(padded_create_content + create_len, ' ', max_len - create_len);
    padded_create_content[max_len] = '\0';
    memcpy(padded_overwrite_content, OVERWRITE_CONTENT, overwrite_len);
    memset(padded_overwrite_content + overwrite_len, ' ', max_len - overwrite_len);
    padded_overwrite_content[max_len] = '\0';

    char first_filename[64];
    snprintf(first_filename, sizeof(first_filename), "%s%d%s", FILE_PREFIX, indices[0], FILE_SUFFIX);
    if (faccessat(dir_fd, first_filename, F_OK, 0) == 0) {
        worker_func = overwrite_files_mmap_worker_posix;
        content_to_write = padded_overwrite_content;
        action_description = "overwriting";
    } else {
        worker_func = create_files_worker_posix;
        content_to_write = padded_create_content;
        action_description = "creating";
    }

    pthread_t threads[NUM_THREADS];
    ThreadArgs_POSIX args[NUM_THREADS];
    int files_per_thread = num_files / NUM_THREADS;
    for (int i = 0; i < NUM_THREADS; i++) {
        args[i].indices = indices;
        args[i].start = i * files_per_thread;
        args[i].end = (i == NUM_THREADS - 1) ? num_files : (i + 1) * files_per_thread;
        args[i].dir_fd = dir_fd;
        args[i].content = content_to_write;
        args[i].content_len = max_len;
        pthread_create(&threads[i], NULL, worker_func, &args[i]);
    }

    for (int i = 0; i < NUM_THREADS; i++) {
        pthread_join(threads[i], NULL);
    }
    close(dir_fd);

    clock_gettime(CLOCK_MONOTONIC, &end_time);
    double time_ms = (end_time.tv_sec - start_time.tv_sec) * 1000.0 + (end_time.tv_nsec - start_time.tv_nsec) / 1000000.0;
    printf("\nFinished %s %d files.\n", action_description, num_files);
    printf("Total time taken: %.2f ms\n", time_ms);

#elif defined(DX_PLATFORM_STANDARD)
    printf("Running on an unrecognized OS: Using generic standard C11 I/O fallback.\n");
    double start_time = get_monotonic_time();
    thrd_t threads[NUM_THREADS];
    ThreadData_Standard thread_data_array[NUM_THREADS];
    int files_per_thread = num_files / NUM_THREADS;

    for (int i = 0; i < NUM_THREADS; ++i) {
        thread_data_array[i].indices = indices;
        thread_data_array[i].start = i * files_per_thread;
        thread_data_array[i].end = (i == NUM_THREADS - 1) ? num_files : (i + 1) * files_per_thread;
        thrd_create(&threads[i], create_files_worker_standard, &thread_data_array[i]);
    }

    for (int i = 0; i < NUM_THREADS; ++i) {
        thrd_join(threads[i], NULL);
    }

    double end_time = get_monotonic_time();
    double time_ms = (end_time - start_time) * 1000.0;
    printf("\nFinished creating %d files.\n", num_files);
    printf("Total time taken: %.2f ms\n", time_ms);
#endif

    return 0;
}

int main(int argc, char *argv[]) {
    int num_files = 10000;

    if (argc > 1) {
        num_files = atoi(argv[1]);
        if (num_files <= 0) {
            fprintf(stderr, "Invalid number of files: %s\n", argv[1]);
            return 1;
        }
    }

    int *indices = malloc(num_files * sizeof(int));
    if (!indices) {
        perror("Failed to allocate memory for indices");
        return 1;
    }

    for (int i = 0; i < num_files; i++) {
        indices[i] = i + 1;
    }

    int result = run_file_generator(indices, num_files);

    free(indices);
    return result;
}
