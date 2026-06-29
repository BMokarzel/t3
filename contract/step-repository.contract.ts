// Antes: `Submit(payload: any): void` / `Get(): any` — eram chamados com
// `await`, então o contrato mentia sobre ser síncrono. Agora genérico + async.
// Defaults `unknown` permitem uso não-tipado enquanto os repos são stubs;
// tipar concretamente (ex.: <ClientFinancialProfileData, PIFinancialProfileOutput>)
// quando as estruturas forem populadas.
export interface EnrollmentStepRepository<TSubmit = unknown, TGet = unknown> {
    submit(payload: TSubmit): Promise<void>;
    get(): Promise<TGet>;
}
