export interface Span {
    end(): void;
}
export interface Trace {
    span(name?: string, attributes?: Record<string, unknown>): Span;
    withSpan<T>(name: string, fn: () => Promise<T>, attributes?: Record<string, unknown>): Promise<T>;
}
//# sourceMappingURL=observability.contract.d.ts.map