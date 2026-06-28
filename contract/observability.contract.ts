export interface Trace {
    Span(name?: string, attributes?: Record<string, unknown>): void;
}
