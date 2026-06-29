export declare class EnrollmentStatusResponse {
    Household?: boolean;
    FinancialProfile?: boolean;
}
export interface EnrollmentOrchestratorRepository {
    getStatus(): Promise<EnrollmentStatusResponse>;
    init(): Promise<void>;
    finish(): Promise<void>;
}
//# sourceMappingURL=orchestrator-repository.contract.d.ts.map