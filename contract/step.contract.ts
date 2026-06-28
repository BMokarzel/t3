export interface EnrollmentStep<T, U> {
    Validate(payload: T): any;
    Submit(payload: T): void;
    GetPrevData(): U;
}