import { EnrollmentStepRepository } from "../contract/step-repository.contract.js";
export declare class PM5Repository implements EnrollmentStepRepository {
    submit(_payload: unknown): Promise<void>;
    get(): Promise<unknown>;
    static create(): PM5Repository;
}
//# sourceMappingURL=pm5.repository.d.ts.map