CC = gcc
CFLAGS = -Wall -Wextra -g -O2 -D_POSIX_C_SOURCE=200809L
LDFLAGS = -luv

TARGET = dx_styles_c

SRCS = main.c watcher.c parser.c id_generator.c css_generator.c file_io.c utils.c

OBJS = $(SRCS:.c=.o)

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $(TARGET) $(OBJS) $(LDFLAGS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET)

.PHONY: all clean