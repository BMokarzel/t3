export interface Span {
    // Encerra o span. Idealmente chamado num finally.
    end(): void;
}

export interface Trace {
    // Inicia um span; o chamador é responsável por chamar `end()`.
    span(name?: string, attributes?: Record<string, unknown>): Span;

    // Executa `fn` dentro de um span e o encerra automaticamente, inclusive em
    // caso de erro. Forma ergonômica preferida quando há um escopo bem definido.
    withSpan<T>(
        name: string,
        fn: () => Promise<T>,
        attributes?: Record<string, unknown>,
    ): Promise<T>;
}
