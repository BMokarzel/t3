import { EnrollmentStepRepository } from "../../contract/step-repository.contract.js";
import { Logger } from "../../contract/logger.contract.js";
import { Trace } from "../../contract/observability.contract.js";
import { EnrollmentStep } from "../../contract/step.contract.js";
import { PIStepKey } from "./pi-da-flow.js";
export declare function createDefaultPISteps(aveRepository: EnrollmentStepRepository, pm5Repository: EnrollmentStepRepository, logger: Logger, trace: Trace): Map<PIStepKey, EnrollmentStep<any, any>>;
//# sourceMappingURL=pi-steps.factory.d.ts.map