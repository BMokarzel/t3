import { EligibilityScreenerRepository, EligibilityScreenerResponse } from "../contract/eligibility-repository.contract";

export class ES2Repository implements EligibilityScreenerRepository {
    async Evaluate(plan: boolean): Promise<EligibilityScreenerResponse> {
        return {}
    }

    static create() {
        return ES2Repository
    }
}
