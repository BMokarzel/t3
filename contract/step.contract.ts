export interface EnrollmentStep<TInput, TPrevData, TValidated = unknown> {
    // Valida/normaliza o payload e devolve a forma já validada.
    // TODO(erros): padronizar o retorno para incluir os erros de intake
    //   padronizados — hoje só normaliza, não acumula erros. Casa com a
    //   taxonomia de erros (ver TODO em service.contract.ts).
    validate(payload: TInput): TValidated;

    // Antes: `Submit(payload: T): void` — incoerente com a impl async.
    submit(payload: TInput): Promise<void>;

    // Antes: `GetPrevData(): U` — incoerente com a impl async.
    getPrevData(): Promise<TPrevData>;
}
