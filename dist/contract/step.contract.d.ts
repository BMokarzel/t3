export interface EnrollmentStep<TInput, TPrevData, TValidated = unknown> {
    validate(payload: TInput): TValidated;
    submit(payload: TInput): Promise<void>;
    getPrevData(): Promise<TPrevData>;
}
//# sourceMappingURL=step.contract.d.ts.map