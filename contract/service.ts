export interface EnrollmentService {
    GetStatus(evaluate: boolean): Promise<EnrollmentStatus>;
    SubmitStep(stepKey: string, payload: any): Promise<StepSubmissionResult>;
}

export class EnrollmentStatus {}

export class StepSubmissionResult {}
