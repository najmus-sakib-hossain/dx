type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      // biome-ignore lint/suspicious/noConsole: Logger utility needs console
      console.info(this.formatMessage("info", message, context));
    }
    // In production, send to logging service (Sentry, LogRocket, etc.)
  }

  warn(message: string, context?: LogContext): void {
    // biome-ignore lint/suspicious/noConsole: Logger utility needs console
    console.warn(this.formatMessage("warn", message, context));
    // In production, send to logging service
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              name: error.name,
            }
          : error,
    };

    // biome-ignore lint/suspicious/noConsole: Logger utility needs console
    console.error(this.formatMessage("error", message, errorContext));
    // In production, send to error tracking service (Sentry)
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      // biome-ignore lint/suspicious/noConsole: Logger utility needs console
      console.debug(this.formatMessage("debug", message, context));
    }
  }
}

export const logger = new Logger();
