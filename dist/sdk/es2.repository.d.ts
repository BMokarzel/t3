import { EligibilityScreenerRepository, EligibilityScreenerResponse } from "../contract/eligibility-repository.contract.js";
export declare class ES2Repository implements EligibilityScreenerRepository {
    evaluate(_plan: boolean): Promise<EligibilityScreenerResponse>;
    static create(): ES2Repository;
}
//# sourceMappingURL=es2.repository.d.ts.map