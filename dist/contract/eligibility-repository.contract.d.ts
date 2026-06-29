export declare class EligibilityScreenerResponse {
    Eligibility?: boolean;
}
export interface EligibilityScreenerRepository {
    evaluate(plan: boolean): Promise<EligibilityScreenerResponse>;
}
//# sourceMappingURL=eligibility-repository.contract.d.ts.map