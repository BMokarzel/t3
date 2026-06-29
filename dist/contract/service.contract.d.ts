export interface EnrollmentService {
    getStatus(evaluate: boolean): Promise<EnrollmentStatus>;
    submitStep(stepKey: string, payload: any): Promise<StepSubmissionResult>;
}
export declare class EnrollmentStatus {
}
export declare class StepSubmissionResult {
}
//# sourceMappingURL=service.contract.d.ts.map