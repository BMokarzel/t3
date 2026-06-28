import { EnrollmentStatusResponse } from "../contract/orchestrator-repository.contract";

export class PM5Repository implements EnrollmentStatusResponse {
    
    static create() {
        return PM5Repository
    }
}