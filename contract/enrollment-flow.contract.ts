import { StepSubmissionResult } from "./service.contract.js";
import { EnrollmentStep } from "./step.contract.js";

export interface EnrollmentFlow {
    submitStep(step: string, payload: any): Promise<StepSubmissionResult>;
    getStep(stepKey: string): EnrollmentStep<any, any>;
    getCurrentStep(): EnrollmentStep<any, any>;
}

export { StepSubmissionResult };
