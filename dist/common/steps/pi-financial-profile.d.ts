import { Logger } from "../../contract/logger.contract.js";
import { Trace } from "../../contract/observability.contract.js";
import { EnrollmentStepRepository } from "../../contract/step-repository.contract.js";
import { EnrollmentStep } from "../../contract/step.contract.js";
import { PIFinancialProfileInput } from "../../validation/pi-financial-profile.schema.js";
export type { PIFinancialProfileInput };
export declare class ClientFinancialProfileData {
    Name?: string;
}
export declare class PartnerFinancialProfileData {
    Name?: string;
}
export declare class PIFinancialProfileOutput {
}
export declare class PIFinancialProfileStep implements EnrollmentStep<PIFinancialProfileInput, PIFinancialProfileOutput, [
    ClientFinancialProfileData,
    PartnerFinancialProfileData
]> {
    private readonly aveRepository;
    private readonly pm5Repository;
    private readonly logger;
    private readonly trace;
    private constructor();
    validate(payload: PIFinancialProfileInput): [ClientFinancialProfileData, PartnerFinancialProfileData];
    submit(payload: PIFinancialProfileInput): Promise<void>;
    getPrevData(): Promise<PIFinancialProfileOutput>;
    static create(aveRepository: EnrollmentStepRepository, pm5Repository: EnrollmentStepRepository, logger: Logger, trace: Trace): PIFinancialProfileStep;
}
//# sourceMappingURL=pi-financial-profile.d.ts.map