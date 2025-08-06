#include "id_generator.h"

static bool is_id_used(UsedIdNode* head, const char* id) {
    UsedIdNode* current = head;
    while (current != NULL) {
        if (strcmp(current->id, id) == 0) {
            return true;
        }
        current = current->next;
    }
    return false;
}

static void add_used_id(UsedIdNode** head, const char* id) {
    UsedIdNode* new_node = (UsedIdNode*)malloc(sizeof(UsedIdNode));
    CHECK(new_node);
    new_node->id = strdup(id);
    CHECK(new_node->id);
    new_node->next = *head;
    *head = new_node;
}

void generate_id_prefix(char* buffer, size_t buffer_size, const char* class_name_base) {
    buffer[0] = '\0';
    size_t prefix_len = 0;
    bool new_word = true;
    char temp_prefix[8] = {0};

    for (const char* p = class_name_base; *p && prefix_len < 7; ++p) {
        if (isspace((unsigned char)*p)) {
            new_word = true;
        } else if (new_word) {
            temp_prefix[prefix_len++] = tolower((unsigned char)*p);
            new_word = false;
        }
    }
    strncpy(buffer, temp_prefix, buffer_size);
}

void get_unique_id(char* buffer, size_t buffer_size, const char* prefix, UsedIdNode** head) {
    if (!is_id_used(*head, prefix)) {
        strncpy(buffer, prefix, buffer_size);
        add_used_id(head, buffer);
        return;
    }

    int count = 1;
    while (true) {
        snprintf(buffer, buffer_size, "%s%d", prefix, count);
        if (!is_id_used(*head, buffer)) {
            add_used_id(head, buffer);
            return;
        }
        count++;
    }
}

void free_used_id_list(UsedIdNode** head) {
    UsedIdNode* current = *head;
    while (current != NULL) {
        UsedIdNode* next = current->next;
        free(current->id);
        free(current);
        current = next;
    }
    *head = NULL;
}