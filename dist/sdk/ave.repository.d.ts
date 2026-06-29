import { EnrollmentStepRepository } from "../contract/step-repository.contract.js";
export declare class AVERepository implements EnrollmentStepRepository {
    submit(_payload: unknown): Promise<void>;
    get(): Promise<unknown>;
    static create(): AVERepository;
}
//# sourceMappingURL=ave.repository.d.ts.map