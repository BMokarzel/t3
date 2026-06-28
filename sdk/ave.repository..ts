import { EnrollmentStatusResponse } from "../contract/orchestrator-repository.contract";

export class AVERepository implements EnrollmentStatusResponse {
    
    static create() {
        return AVERepository
    }
}