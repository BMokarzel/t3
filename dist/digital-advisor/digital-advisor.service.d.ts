import { EligibilityScreenerRepository } from "../contract/eligibility-repository.contract.js";
import { EnrollmentFlow } from "../contract/enrollment-flow.contract.js";
import { Logger } from "../contract/logger.contract.js";
import { Trace } from "../contract/observability.contract.js";
import { EnrollmentOrchestratorRepository } from "../contract/orchestrator-repository.contract.js";
import { EnrollmentService, EnrollmentStatus, StepSubmissionResult } from "../contract/service.contract.js";
import { Supergraph } from "../contract/supergraph.contract.js";
import { TogglesInterface } from "../contract/toggle.contract.js";
export declare class DigitalAdvisorService implements EnrollmentService {
    private readonly piFlow;
    private readonly es2Repository;
    private readonly vrzRepository;
    private readonly toggles;
    private readonly supergraph;
    private readonly logger;
    private readonly trace;
    private constructor();
    getStatus(evaluate: boolean): Promise<EnrollmentStatus>;
    submitStep(stepKey: string, payload: any): Promise<StepSubmissionResult>;
    private checkReleaseGate;
    private checkOrchestratorStatus;
    private checkEligibility;
    private loadCurrentStepData;
    static create(piFlow: EnrollmentFlow, es2Repository: EligibilityScreenerRepository, vrzRepository: EnrollmentOrchestratorRepository, toggles: TogglesInterface, supergraph: Supergraph, logger: Logger, trace: Trace): DigitalAdvisorService;
}
//# sourceMappingURL=digital-advisor.service.d.ts.map