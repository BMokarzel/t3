import { StepSubmissionResult } from "./service";
import { EnrollmentStep } from "./step.contract";

export interface EnrollmentFlow {
    SubmitStep(step: string, payload: any): Promise<StepSubmissionResult>;
    GetStep(stepKey: string): EnrollmentStep<any, any>;
    GetCurrentStep(): EnrollmentStep<any, any>;
}

export { StepSubmissionResult };
