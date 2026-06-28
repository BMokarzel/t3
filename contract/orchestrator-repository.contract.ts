export class EnrollmentStatusResponse {
    Household?: boolean
    FinancialProfile?: boolean
}

export interface EnrollmentOrchestratorRepository {
    GetStatus(): Promise<EnrollmentStatusResponse>;

    Init(): Promise<void>;

    Finish(): Promise<void>;
}
