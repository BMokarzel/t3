export interface EnrollmentStepRepository {
    Submit(payload: any): void;
    Get(): any
}