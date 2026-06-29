import { EnrollmentStepRepository } from "../contract/step-repository.contract.js";

// Adapter OPCIONAL (SDK). O AVE é usado como repositório de step (submit/get) no
// PIFinancialProfileStep. O consumidor pode usar este ou prover o seu próprio.
export class AVERepository implements EnrollmentStepRepository {
    // TODO(stub): implementar persistência real no AVE.
    async submit(_payload: unknown): Promise<void> {
        return
    }

    async get(): Promise<unknown> {
        return {}
    }

    // Antes: `return AVERepository` devolvia a CLASSE, não uma instância.
    static create(): AVERepository {
        return new AVERepository()
    }
}
