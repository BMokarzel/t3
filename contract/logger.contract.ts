export interface Logger {
    Info(message?: string, context?: Record<string, unknown>): void;
    Error(message?: string, context?: Record<string, unknown>): void;
}
