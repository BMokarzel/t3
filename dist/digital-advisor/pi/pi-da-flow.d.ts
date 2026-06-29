import { EnrollmentFlow, StepSubmissionResult } from "../../contract/enrollment-flow.contract.js";
import { EnrollmentStep } from "../../contract/step.contract.js";
import { PIFinancialProfileOutput } from "../../common/steps/pi-financial-profile.js";
import { PIFinancialProfileInput } from "../../validation/pi-financial-profile.schema.js";
export interface PIStepTypeMap {
    "financial-profile": {
        input: PIFinancialProfileInput;
        output: PIFinancialProfileOutput;
    };
}
export type PIStepKey = keyof PIStepTypeMap;
export declare class PIDAEnrollmentFlow implements EnrollmentFlow {
    private readonly steps;
    private constructor();
    private resolveKey;
    private internalGetStep;
    submitStep(stepKey: string, payload: any): Promise<StepSubmissionResult>;
    getStep(stepKey: string): EnrollmentStep<any, any>;
    getCurrentStep(): EnrollmentStep<any, any>;
    static create(steps: Map<PIStepKey, EnrollmentStep<any, any>>): PIDAEnrollmentFlow;
}
//# sourceMappingURL=pi-da-flow.d.ts.map