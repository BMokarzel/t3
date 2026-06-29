import { EligibilityScreenerRepository, EligibilityScreenerResponse } from "../contract/eligibility-repository.contract.js";

// Adapter OPCIONAL (SDK) para o eligibility screener. Use este ou prove o seu.
export class ES2Repository implements EligibilityScreenerRepository {
    // `_plan` opaco — ver TODO(boolean-trap) no contrato/serviço.
    async evaluate(_plan: boolean): Promise<EligibilityScreenerResponse> {
        return {}
    }

    // Antes: `return ES2Repository` devolvia a CLASSE, não uma instância.
    static create(): ES2Repository {
        return new ES2Repository()
    }
}
