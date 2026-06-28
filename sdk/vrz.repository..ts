import { EnrollmentOrchestratorRepository, EnrollmentStatusResponse } from "../contract/orchestrator-repository.contract";

export class VRZRepository implements EnrollmentOrchestratorRepository {
    async Init(): Promise<void> {
        return
    }

    async Finish(): Promise<void> {
        return
    }

    async GetStatus(): Promise<EnrollmentStatusResponse> {
        return {}
    }

    static create() {
        return VRZRepository
    }
}
