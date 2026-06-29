export class EnrollmentStatusResponse {
    // NOTA(casing): ver toggle.contract.ts.
    Household?: boolean
    FinancialProfile?: boolean
}

export interface EnrollmentOrchestratorRepository {
    getStatus(): Promise<EnrollmentStatusResponse>;

    init(): Promise<void>;

    finish(): Promise<void>;
}
