import { EnrollmentStepRepository } from "../../contract/step-repository.contract.js";
import { Logger } from "../../contract/logger.contract.js";
import { Trace } from "../../contract/observability.contract.js";
import { EnrollmentStep } from "../../contract/step.contract.js";
import { PIFinancialProfileStep } from "../../common/steps/pi-financial-profile.js";
import { PIStepKey } from "./pi-da-flow.js";

// Catálogo canônico dos steps do fluxo PI (quais steps e em que ordem). Mantém o
// conhecimento de domínio DENTRO da library, enquanto o flow permanece magro e
// recebe o Map pronto — facilitando teste/override por step no consumidor.
export function createDefaultPISteps(
    aveRepository: EnrollmentStepRepository,
    pm5Repository: EnrollmentStepRepository,
    logger: Logger,
    trace: Trace,
): Map<PIStepKey, EnrollmentStep<any, any>> {
    return new Map<PIStepKey, EnrollmentStep<any, any>>([
        ["financial-profile", PIFinancialProfileStep.create(aveRepository, pm5Repository, logger, trace)],
    ]);
}
