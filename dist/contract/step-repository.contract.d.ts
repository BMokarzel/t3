export interface EnrollmentStepRepository<TSubmit = unknown, TGet = unknown> {
    submit(payload: TSubmit): Promise<void>;
    get(): Promise<TGet>;
}
//# sourceMappingURL=step-repository.contract.d.ts.map