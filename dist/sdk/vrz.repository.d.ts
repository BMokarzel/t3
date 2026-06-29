import { EnrollmentOrchestratorRepository, EnrollmentStatusResponse } from "../contract/orchestrator-repository.contract.js";
export declare class VRZRepository implements EnrollmentOrchestratorRepository {
    init(): Promise<void>;
    finish(): Promise<void>;
    getStatus(): Promise<EnrollmentStatusResponse>;
    static create(): VRZRepository;
}
//# sourceMappingURL=vrz.repository.d.ts.map