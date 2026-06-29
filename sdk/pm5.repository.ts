import { EnrollmentStepRepository } from "../contract/step-repository.contract.js";

// Adapter OPCIONAL (SDK). O PM5 é usado como repositório de step (submit/get) no
// PIFinancialProfileStep. O consumidor pode usar este ou prover o seu próprio.
export class PM5Repository implements EnrollmentStepRepository {
    // TODO(stub): implementar persistência real no PM5.
    async submit(_payload: unknown): Promise<void> {
        return
    }

    async get(): Promise<unknown> {
        return {}
    }

    // Antes: `return PM5Repository` devolvia a CLASSE, não uma instância.
    static create(): PM5Repository {
        return new PM5Repository()
    }
}
