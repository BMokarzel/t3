import { EnrollmentOrchestratorRepository, EnrollmentStatusResponse } from "../contract/orchestrator-repository.contract.js";

// Adapter OPCIONAL (SDK) para o orchestrator. Use este ou prove o seu próprio.
export class VRZRepository implements EnrollmentOrchestratorRepository {
    async init(): Promise<void> {
        return
    }

    async finish(): Promise<void> {
        return
    }

    async getStatus(): Promise<EnrollmentStatusResponse> {
        return {}
    }

    // Antes: `return VRZRepository` devolvia a CLASSE, não uma instância.
    static create(): VRZRepository {
        return new VRZRepository()
    }
}
