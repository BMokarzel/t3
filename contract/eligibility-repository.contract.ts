export class EligibilityScreenerResponse {
    Eligibility?: boolean
}

export interface EligibilityScreenerRepository {
    Evaluate(plan: boolean): Promise<EligibilityScreenerResponse>;
}
